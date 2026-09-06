import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import dns from 'dns';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import {
  initDatabase,
  getUserByEmail,
  getUserById,
  getUserByToken,
  createUser,
  hashPassword,
  getProjectsByUser,
  getProjectById,
  getAllPublishedProjects,
  getProjectBySlug,
  getProjectByDomain,
  createProject,
  updateProject,
  deleteProject,
  createInquiry,
  getInquiriesForProject,
  recordInteraction,
} from './server/db.ts';
import { generateFullWebsiteWithAI, regenerateSectionWithAI } from './server/gemini.ts';
import { CustomDomainConfig } from './src/types.ts';

dotenv.config();

// Initialize internal persistence
initDatabase();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Serve public static assets (logos, favicons, robots.txt, sitemap.xml)
app.use(express.static(path.join(process.cwd(), 'public'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.svg')) {
      res.setHeader('Content-Type', 'image/svg+xml');
    } else if (filePath.endsWith('.ico')) {
      res.setHeader('Content-Type', 'image/x-icon');
    } else if (filePath.endsWith('.png')) {
      res.setHeader('Content-Type', 'image/png');
    }
  }
}));

// Auth middleware
interface AuthenticatedRequest extends Request {
  userId?: string;
  userEmail?: string;
}

function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required. Please log in.' });
  }

  const token = authHeader.split(' ')[1];
  const user = getUserByToken(token);
  if (!user) {
    return res.status(401).json({ error: 'Session expired or invalid token. Please log in again.' });
  }

  req.userId = user.id;
  req.userEmail = user.email;
  next();
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// SEO: Sitemap XML route - explicitly served with application/xml
app.get('/sitemap.xml', (req, res) => {
  const host = 'https://localweb.ai.studio';
  const publishedProjects = getAllPublishedProjects();

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  xml += `  <url>\n`;
  xml += `    <loc>${host}/</loc>\n`;
  xml += `    <changefreq>daily</changefreq>\n`;
  xml += `    <priority>1.0</priority>\n`;
  xml += `  </url>\n`;

  for (const project of publishedProjects) {
    if (project.slug) {
      const lastMod = project.updatedAt || project.publishedAt || new Date().toISOString();
      xml += `  <url>\n`;
      xml += `    <loc>${host}/site/${project.slug}</loc>\n`;
      xml += `    <lastmod>${new Date(lastMod).toISOString().split('T')[0]}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `  </url>\n`;
    }
  }

  xml += `</urlset>\n`;

  res.header('Content-Type', 'application/xml; charset=utf-8');
  res.status(200).send(xml);
});

// SEO: Robots.txt route - explicitly served with text/plain
app.get('/robots.txt', (req, res) => {
  const content = `User-agent: *\nAllow: /\n\nSitemap: https://localweb.ai.studio/sitemap.xml\n`;
  res.header('Content-Type', 'text/plain; charset=utf-8');
  res.status(200).send(content);
});

// --- Auth Endpoints ---

app.post('/api/auth/signup', (req, res) => {
  try {
    const { email, password, name, businessName } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required.' });
    }

    const existing = getUserByEmail(email);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const user = createUser({ email, password, name, businessName });
    res.status(201).json({ user, token: user.token });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error creating account.' });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const hashed = hashPassword(password);
    if (user.passwordHash !== hashed) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const { passwordHash, ...safeUser } = user;
    res.json({ user: safeUser, token: safeUser.token });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error during login.' });
  }
});

app.post('/api/auth/guest', (req, res) => {
  try {
    // Return or reuse demo account for instant exploration
    const demo = getUserByEmail('demo@localai.web');
    if (demo) {
      const { passwordHash, ...safeUser } = demo;
      return res.json({ user: safeUser, token: safeUser.token });
    }

    const user = createUser({
      email: `guest_${Date.now()}@localai.web`,
      password: 'guestpassword',
      name: 'Guest Business Owner',
      businessName: 'My Local Business',
    });
    res.json({ user, token: user.token });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error initializing guest session.' });
  }
});

app.get('/api/auth/me', requireAuth, (req: AuthenticatedRequest, res) => {
  const user = getUserById(req.userId!);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }
  const { passwordHash, ...safeUser } = user;
  res.json({ user: safeUser });
});

// --- AI Generation Endpoints ---

app.post('/api/ai/generate-website', async (req, res) => {
  try {
    const { businessInfo } = req.body;
    if (!businessInfo || !businessInfo.businessName || !businessInfo.category || !businessInfo.city) {
      return res.status(400).json({
        error: 'Business name, category, and city are required to generate your website.',
      });
    }

    const websiteContent = await generateFullWebsiteWithAI(businessInfo);
    res.json({ success: true, website: websiteContent });
  } catch (err: any) {
    console.error('Website generation error:', err);
    res.status(500).json({ error: err.message || 'Failed to generate website with AI.' });
  }
});

app.post('/api/ai/regenerate-section', async (req, res) => {
  try {
    const { section, businessInfo, currentContent, tone } = req.body;
    if (!section || !businessInfo || !currentContent) {
      return res.status(400).json({ error: 'Missing section or business context for regeneration.' });
    }

    const regenerated = await regenerateSectionWithAI(section, businessInfo, currentContent, tone);
    res.json({ success: true, updatedSection: regenerated });
  } catch (err: any) {
    console.error('Section regeneration error:', err);
    res.status(500).json({ error: err.message || 'Failed to regenerate section.' });
  }
});

// --- Project Management Endpoints (User Protected) ---

app.get('/api/projects', requireAuth, (req: AuthenticatedRequest, res) => {
  const projects = getProjectsByUser(req.userId!);
  res.json({ projects });
});

app.get('/api/projects/:id', requireAuth, (req: AuthenticatedRequest, res) => {
  const project = getProjectById(req.params.id);
  if (!project || project.userId !== req.userId) {
    return res.status(404).json({ error: 'Project not found.' });
  }
  const inquiries = getInquiriesForProject(project.id);
  res.json({ project, inquiries });
});

app.post('/api/projects', requireAuth, (req: AuthenticatedRequest, res) => {
  try {
    const { businessInfo, website } = req.body;
    if (!businessInfo || !website) {
      return res.status(400).json({ error: 'businessInfo and website payload required.' });
    }

    const project = createProject(req.userId!, businessInfo, website);
    res.status(201).json({ project });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to save project.' });
  }
});

app.put('/api/projects/:id', requireAuth, (req: AuthenticatedRequest, res) => {
  try {
    const { businessInfo, website, isPublished, slug, customDomain } = req.body;
    const updated = updateProject(req.params.id, req.userId!, {
      businessInfo,
      website,
      isPublished,
      slug,
      customDomain,
    });

    if (!updated) {
      return res.status(404).json({ error: 'Project not found or unauthorized.' });
    }

    res.json({ project: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update project.' });
  }
});

// Configure or update custom domain
app.post('/api/projects/:id/custom-domain', requireAuth, (req: AuthenticatedRequest, res) => {
  try {
    const project = getProjectById(req.params.id);
    if (!project || project.userId !== req.userId) {
      return res.status(404).json({ error: 'Project not found or unauthorized.' });
    }

    const { domain } = req.body;
    if (!domain || typeof domain !== 'string') {
      return res.status(400).json({ error: 'Domain name is required.' });
    }

    // Clean domain (remove protocol, trailing slashes, www/subdomain parsing)
    const cleanDomain = domain
      .toLowerCase()
      .trim()
      .replace(/^https?:\/\//, '')
      .replace(/\/+$/, '');

    // Basic domain validation regex
    const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    if (!domainRegex.test(cleanDomain)) {
      return res.status(400).json({
        error: 'Please enter a valid domain format (e.g., www.mybusiness.com or site.mybusiness.com).',
      });
    }

    // Check if domain is already claimed by another project
    const existing = getProjectByDomain(cleanDomain);
    if (existing && existing.id !== project.id) {
      return res.status(409).json({
        error: 'This domain is already connected to another project in LocalAI Web.',
      });
    }

    // Determine host (e.g., 'www' if 'www.domain.com', or subdomain)
    const parts = cleanDomain.split('.');
    const isSubdomain = parts.length > 2;
    const dnsHost = isSubdomain ? parts[0] : '@';

    const customDomainConfig: CustomDomainConfig = {
      domain: cleanDomain,
      status:
        project.customDomain?.domain === cleanDomain && project.customDomain?.status === 'active'
          ? 'active'
          : 'pending',
      cnameTarget: 'cname.localai.web',
      dnsRecordType: 'CNAME',
      dnsHost: dnsHost === '@' ? 'www' : dnsHost, // CNAME standard prefers host/subdomain
      sslStatus: 'pending',
      configuredAt: project.customDomain?.configuredAt || new Date().toISOString(),
      lastCheckedAt: new Date().toISOString(),
    };

    const updated = updateProject(project.id, req.userId!, {
      customDomain: customDomainConfig,
    });

    res.json({ success: true, project: updated, customDomain: customDomainConfig });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to configure custom domain.' });
  }
});

// Verify custom domain DNS configuration
app.post('/api/projects/:id/verify-domain', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const project = getProjectById(req.params.id);
    if (!project || project.userId !== req.userId) {
      return res.status(404).json({ error: 'Project not found or unauthorized.' });
    }

    if (!project.customDomain || !project.customDomain.domain) {
      return res.status(400).json({ error: 'No custom domain configured for this project.' });
    }

    const { forceVerify } = req.body;
    const domain = project.customDomain.domain;
    const expectedTarget = 'cname.localai.web';

    let isVerified = false;
    let detectedRecords: string[] = [];
    let errorMessage = '';

    if (forceVerify) {
      // Allow instant simulation for testing / demo in sandbox environments
      isVerified = true;
      detectedRecords = [expectedTarget];
    } else {
      try {
        // Attempt actual DNS lookup with 3 second timeout
        const lookupPromise = dns.promises.resolveCname(domain);
        const timeoutPromise = new Promise<string[]>((_, reject) =>
          setTimeout(() => reject(new Error('DNS lookup timed out')), 3000)
        );

        const records = await Promise.race([lookupPromise, timeoutPromise]);
        detectedRecords = records;

        // Check if any CNAME record matches or points to our target
        const match = records.some(
          (r) => r.toLowerCase().includes('localai.web') || r.toLowerCase().includes(expectedTarget)
        );

        if (match) {
          isVerified = true;
        } else {
          errorMessage = `CNAME record points to "${records.join(', ')}" instead of "${expectedTarget}".`;
        }
      } catch (dnsErr: any) {
        // DNS lookup failed or timed out (very common before global propagation)
        errorMessage =
          dnsErr.code === 'ENOTFOUND' || dnsErr.code === 'ENODATA'
            ? `No CNAME record found for "${domain}". DNS changes can take up to 24-48 hours (usually 15-30 minutes) to propagate globally.`
            : dnsErr.message || 'Could not resolve DNS records yet.';
      }
    }

    const updatedConfig = {
      ...project.customDomain,
      status: isVerified ? ('active' as const) : ('error' as const),
      sslStatus: isVerified ? ('active' as const) : ('pending' as const),
      verifiedAt: isVerified ? new Date().toISOString() : project.customDomain.verifiedAt,
      lastCheckedAt: new Date().toISOString(),
      errorMessage: isVerified ? undefined : errorMessage,
    };

    const updatedProject = updateProject(project.id, req.userId!, {
      customDomain: updatedConfig,
    });

    res.json({
      success: true,
      verified: isVerified,
      detectedRecords,
      errorMessage: isVerified ? undefined : errorMessage,
      customDomain: updatedConfig,
      project: updatedProject,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Verification process failed.' });
  }
});

// Remove custom domain
app.delete('/api/projects/:id/custom-domain', requireAuth, (req: AuthenticatedRequest, res) => {
  try {
    const project = getProjectById(req.params.id);
    if (!project || project.userId !== req.userId) {
      return res.status(404).json({ error: 'Project not found or unauthorized.' });
    }

    const updated = updateProject(project.id, req.userId!, {
      customDomain: undefined,
    });

    res.json({ success: true, message: 'Custom domain removed successfully.', project: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to remove custom domain.' });
  }
});

app.delete('/api/projects/:id', requireAuth, (req: AuthenticatedRequest, res) => {
  const success = deleteProject(req.params.id, req.userId!);
  if (!success) {
    return res.status(404).json({ error: 'Project not found or unauthorized.' });
  }
  res.json({ success: true, message: 'Project deleted successfully.' });
});

// --- Public Endpoints (Website Viewers & Inquiries) ---

app.get('/api/public/site/domain/:domain', (req, res) => {
  const project = getProjectByDomain(req.params.domain);
  if (!project || !project.isPublished) {
    return res.status(404).json({ error: 'Website not found or is currently offline.' });
  }

  // Increment view count
  recordInteraction(project.slug, 'view');

  res.json({
    slug: project.slug,
    businessInfo: project.businessInfo,
    website: project.website,
    publishedAt: project.publishedAt,
    updatedAt: project.updatedAt,
    customDomain: project.customDomain,
  });
});

app.get('/api/public/site/:slug', (req, res) => {
  const project = getProjectBySlug(req.params.slug);
  if (!project || !project.isPublished) {
    return res.status(404).json({ error: 'Website not found or is currently offline.' });
  }

  // Increment view count
  recordInteraction(req.params.slug, 'view');

  res.json({
    slug: project.slug,
    businessInfo: project.businessInfo,
    website: project.website,
    publishedAt: project.publishedAt,
    updatedAt: project.updatedAt,
  });
});

app.post('/api/public/site/:slug/inquiry', (req, res) => {
  try {
    const project = getProjectBySlug(req.params.slug);
    if (!project) {
      return res.status(404).json({ error: 'Website not found.' });
    }

    const { name, phone, email, serviceRequested, message } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ error: 'Name and phone number are required.' });
    }

    const inquiry = createInquiry(project.id, {
      name,
      phone,
      email: email || '',
      serviceRequested: serviceRequested || 'General Inquiry',
      message: message || 'Interested in booking or services.',
    });

    res.status(201).json({ success: true, inquiry });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error submitting inquiry.' });
  }
});

app.post('/api/public/site/:slug/analytics', (req, res) => {
  const { type } = req.body;
  if (type === 'whatsapp' || type === 'call') {
    recordInteraction(req.params.slug, type);
  }
  res.json({ success: true });
});

app.get('/api/public/demo-sites', (req, res) => {
  // Returns top published site previews for the landing page showcase
  const project = getProjectBySlug('bella-luxe-salon-mumbai');
  if (project) {
    res.json({ sites: [project] });
  } else {
    res.json({ sites: [] });
  }
});

// Dynamic SEO pre-rendering for public site pages
app.get('/site/:slug', (req, res, next) => {
  const { slug } = req.params;
  const project = getProjectBySlug(slug);
  if (!project) {
    return next();
  }

  const indexPath =
    process.env.NODE_ENV !== 'production'
      ? path.join(process.cwd(), 'index.html')
      : path.join(process.cwd(), 'dist', 'index.html');

  if (fs.existsSync(indexPath)) {
    try {
      let html = fs.readFileSync(indexPath, 'utf-8');
      const cat = project.businessInfo.category || 'Business';
      const catCap = cat.charAt(0).toUpperCase() + cat.slice(1);
      const title = `${project.businessInfo.businessName} — ${catCap} in ${project.businessInfo.city} | LocalAI Web`;
      const desc =
        project.businessInfo.shortDescription ||
        project.website?.hero?.subheadline ||
        `Official website for ${project.businessInfo.businessName} in ${project.businessInfo.city}. Book on WhatsApp, view services, pricing, hours, and directions.`;
      const url = `https://localweb.ai.studio/site/${project.slug}`;

      html = html.replace(/<title>.*?<\/title>/i, `<title>${title}</title>`);
      html = html.replace(
        /<meta\s+name="description"\s+content=".*?"\s*\/?>/i,
        `<meta name="description" content="${desc.replace(/"/g, '&quot;')}" />`
      );
      html = html.replace(
        /<link\s+rel="canonical"\s+href=".*?"\s*\/?>/i,
        `<link rel="canonical" href="${url}" />`
      );
      html = html.replace(
        /<meta\s+property="og:title"\s+content=".*?"\s*\/?>/i,
        `<meta property="og:title" content="${title.replace(/"/g, '&quot;')}" />`
      );
      html = html.replace(
        /<meta\s+property="og:description"\s+content=".*?"\s*\/?>/i,
        `<meta property="og:description" content="${desc.replace(/"/g, '&quot;')}" />`
      );
      html = html.replace(
        /<meta\s+property="og:url"\s+content=".*?"\s*\/?>/i,
        `<meta property="og:url" content="${url}" />`
      );

      res.header('Content-Type', 'text/html; charset=utf-8');
      return res.send(html);
    } catch {
      return next();
    }
  }
  next();
});

// Vite middleware & Static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LocalAI Web server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
