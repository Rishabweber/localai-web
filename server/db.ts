import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { Project, User, LeadInquiry, BusinessInfo, WebsiteContent } from '../src/types';

interface DatabaseSchema {
  users: Record<string, User & { passwordHash: string }>;
  projects: Record<string, Project>;
  inquiries: LeadInquiry[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// In-memory cache
let db: DatabaseSchema = {
  users: {},
  projects: {},
  inquiries: [],
};

// Seed initial realistic local business demo projects
function getInitialSeed(): DatabaseSchema {
  const demoUserId = 'user_demo_123';
  const demoUser: User & { passwordHash: string } = {
    id: demoUserId,
    email: 'demo@localai.web',
    name: 'Shubham Sharma',
    businessName: 'Bella Luxe Salon',
    token: 'demo_token_localai_2026',
    passwordHash: hashPassword('demo123'),
  };

  const p1Id = 'proj_bella_salon';
  const p1Info: BusinessInfo = {
    businessName: 'Bella Luxe Salon & Spa',
    category: 'salon',
    city: 'Bandra West, Mumbai',
    address: 'Plot 42, Hill Road, Bandra West, Mumbai, MH 400050',
    shortDescription: 'Award-winning hair styling, organic skincare, bridal makeup and revitalizing spa therapies in Mumbai.',
    phoneNumber: '+91 98200 12345',
    whatsappNumber: '+91 98200 12345',
    businessEmail: 'appointments@bellaluxemumbai.com',
    stylePreference: 'elegant-luxury',
    currencySymbol: '₹',
    openingHours: {
      general: 'Tue - Sun: 10:00 AM - 9:00 PM',
      schedule: [
        { day: 'Monday', hours: 'Closed (Sanitization Day)', isOpen: false },
        { day: 'Tuesday - Friday', hours: '10:00 AM - 9:00 PM', isOpen: true },
        { day: 'Saturday - Sunday', hours: '9:30 AM - 9:30 PM', isOpen: true },
      ],
    },
    services: [
      { id: 's1', name: 'Signature Haircut & Blowdry', description: 'Face-framing bespoke cut with Moroccan scalp massage and salon finish blowdry.', price: '₹950', duration: '45 mins', popular: true, category: 'salon' },
      { id: 's2', name: '24K Gold Radiance Facial', description: 'Deep exfoliation, gold serum infusion, and lymphatic drainage for an instant red-carpet glow.', price: '₹2,400', duration: '60 mins', popular: true, category: 'salon' },
      { id: 's3', name: 'Brazilian Keratin Smoothing', description: 'Formaldehyde-free intensive smoothing treatment eliminating frizz for up to 5 months.', price: '₹4,999', duration: '120 mins', popular: false, category: 'salon' },
      { id: 's4', name: 'Bridal & Reception Glam', description: 'HD makeup with airbrush finish, pre-bridal consultation, false lashes, and customized styling.', price: '₹12,500', duration: '180 mins', popular: true, category: 'salon' },
    ],
  };

  const p1Website: WebsiteContent = {
    hero: {
      badge: '★ Awarded Top Salon & Spa in Mumbai 2025',
      headline: 'Where Glamour Meets Relaxation in Bandra',
      subheadline: 'Step into Bella Luxe Salon & Spa. Expert stylists, bespoke hair & skin treatments, and luxury care designed just for you.',
      primaryCta: 'Book on WhatsApp',
      secondaryCta: 'View Treatments & Pricing',
      coverImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1400&q=80',
    },
    about: {
      title: 'Our Craft & Philosophy',
      subtitle: 'Over 8 Years of Styling Mumbai’s Best',
      story: 'Bella Luxe Salon & Spa was founded in the vibrant streets of Bandra with a vision to combine modern European hairdressing artistry with holistic wellness rituals.\n\nEvery member of our styling crew is internationally trained and dedicated to giving you an experience that leaves you feeling renewed, radiant, and empowered.',
      highlights: [
        { title: 'Cruelty-Free Products', desc: 'We only use authentic, imported salon-grade formulas safe for all skin types' },
        { title: 'Private VIP Suites', desc: 'Quiet, hygienic treatment chambers for facials, waxing, and bridal prep' },
        { title: 'Rapid WhatsApp Booking', desc: 'Instant confirmations and zero wait-time on appointments' },
      ],
      yearsInBusiness: '8+ Years',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    },
    services: p1Info.services,
    schedule: p1Info.openingHours.schedule,
    contact: {
      phone: p1Info.phoneNumber,
      whatsapp: p1Info.whatsappNumber,
      whatsappMessagePreset: encodeURIComponent('Hi Bella Luxe, I would like to book an appointment!'),
      email: p1Info.businessEmail,
      address: p1Info.address,
      city: p1Info.city,
      googleMapsQuery: encodeURIComponent('Hill Road Bandra West Mumbai Bella Luxe'),
    },
    testimonials: [
      {
        id: 't1',
        name: 'Ananya Deshmukh',
        role: 'Fashion Blogger, Bandra',
        rating: 5,
        comment: 'Bella Luxe is my absolute holy grail salon! My hair color turned out exactly like Pinterest, and booking over WhatsApp was lightning fast.',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya',
      },
      {
        id: 't2',
        name: 'Vikram Mehta',
        role: 'Resident, Mumbai',
        rating: 5,
        comment: 'Great haircut, clean tools, and very polite stylists. The head massage alone is worth coming back for every fortnight.',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram',
      },
      {
        id: 't3',
        name: 'Zara Merchant',
        role: 'Verified Customer',
        rating: 5,
        comment: 'Did my pre-wedding bridal facial package here. My skin was glowing on my big day! Thank you team Bella Luxe!',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zara',
      },
    ],
    faq: [
      {
        id: 'f1',
        question: 'Do you accept walk-in clients or is prior booking required?',
        answer: 'While we welcome walk-ins whenever a chair is available, we strongly recommend reserving your slot via WhatsApp to guarantee zero waiting time.',
      },
      {
        id: 'f2',
        question: 'What hair color brands do you work with?',
        answer: 'We exclusively stock premium salon brands like L’Oréal Professionnel Série Expert, Wella Professionals, and Olaplex bond repair.',
      },
      {
        id: 'f3',
        question: 'Is valet or street parking available?',
        answer: 'Yes, convenient street parking and nearby mall parking lots are easily accessible along Hill Road Bandra.',
      },
    ],
    seo: {
      metaTitle: 'Bella Luxe Salon & Spa | Best Hair Salon in Bandra West, Mumbai',
      metaDescription: 'Book your hair, skin, and spa treatments at Bella Luxe Salon in Bandra West Mumbai. Expert hair stylists, luxury facials, and instant WhatsApp booking.',
      keywords: ['salon in bandra', 'haircut bandra west', 'best spa mumbai', 'bridal makeup mumbai', 'bella luxe salon'],
    },
    theme: {
      style: 'elegant-luxury',
      primaryColor: '#1e1b4b',
      accentColor: '#d97706',
      fontFamily: 'Outfit, Plus Jakarta Sans, sans-serif',
      borderRadius: 'rounded-2xl',
    },
  };

  const p1: Project = {
    id: p1Id,
    userId: demoUserId,
    slug: 'bella-luxe-salon-mumbai',
    businessInfo: p1Info,
    website: p1Website,
    isPublished: true,
    publishedAt: new Date().toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date().toISOString(),
    viewsCount: 342,
    whatsappClicksCount: 89,
    callClicksCount: 24,
    leadsCount: 16,
    customDomain: {
      domain: 'www.bellaluxesalon.in',
      status: 'active',
      cnameTarget: 'cname.localai.web',
      dnsRecordType: 'CNAME',
      dnsHost: 'www',
      sslStatus: 'active',
      configuredAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      verifiedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      lastCheckedAt: new Date().toISOString(),
    },
  };

  return {
    users: { [demoUserId]: demoUser },
    projects: { [p1Id]: p1 },
    inquiries: [
      {
        id: 'inq_1',
        projectId: p1Id,
        name: 'Neha Kapoor',
        phone: '+91 98111 22334',
        email: 'neha@example.com',
        serviceRequested: '24K Gold Radiance Facial',
        message: 'Looking for Saturday 4 PM slot for 2 people.',
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      },
    ],
  };
}

// Ensure database file is loaded
export function initDatabase() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      db = JSON.parse(content);
      // Ensure seed exists
      if (!db.users || Object.keys(db.users).length === 0) {
        db = getInitialSeed();
        saveDatabase();
      }
    } else {
      db = getInitialSeed();
      saveDatabase();
    }
  } catch (err) {
    console.warn('Error reading db.json, using in-memory default:', err);
    db = getInitialSeed();
  }
}

function saveDatabase() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not write to db.json (using memory cache):', err);
  }
}

export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + '_localai_salt_2026').digest('hex');
}

export function generateToken(): string {
  return 'tok_' + crypto.randomBytes(24).toString('hex');
}

export function createSlug(businessName: string, city: string): string {
  const base = `${businessName}-${city}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  const shortRand = Math.random().toString(36).substring(2, 6);
  return `${base || 'site'}-${shortRand}`;
}

// User CRUD
export function getUserByEmail(email: string) {
  const normalized = email.toLowerCase().trim();
  return Object.values(db.users).find((u) => u.email.toLowerCase() === normalized) || null;
}

export function getUserById(id: string) {
  return db.users[id] || null;
}

export function getUserByToken(token: string) {
  if (!token) return null;
  return Object.values(db.users).find((u) => u.token === token) || null;
}

export function createUser(data: { email: string; password: string; name: string; businessName?: string }): User {
  const id = 'user_' + crypto.randomBytes(8).toString('hex');
  const token = generateToken();
  const user: User & { passwordHash: string } = {
    id,
    email: data.email.toLowerCase().trim(),
    name: data.name.trim(),
    businessName: data.businessName?.trim() || '',
    token,
    passwordHash: hashPassword(data.password),
  };
  db.users[id] = user;
  saveDatabase();

  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

// Project CRUD
export function getProjectsByUser(userId: string): Project[] {
  return Object.values(db.projects)
    .filter((p) => p.userId === userId)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export function getProjectById(id: string): Project | null {
  return db.projects[id] || null;
}

export function getAllPublishedProjects(): Project[] {
  return Object.values(db.projects).filter((p) => p.isPublished);
}

export function getProjectBySlug(slug: string): Project | null {
  const normalized = slug.toLowerCase().trim();
  return Object.values(db.projects).find((p) => p.slug.toLowerCase() === normalized) || null;
}

export function getProjectByDomain(domain: string): Project | null {
  const normalized = domain.toLowerCase().trim().replace(/^https?:\/\//, '').replace(/\/+$/, '');
  return (
    Object.values(db.projects).find(
      (p) => p.customDomain && p.customDomain.domain.toLowerCase() === normalized
    ) || null
  );
}

export function createProject(userId: string, businessInfo: BusinessInfo, website: WebsiteContent): Project {
  const id = 'proj_' + crypto.randomBytes(8).toString('hex');
  const slug = createSlug(businessInfo.businessName, businessInfo.city);

  const project: Project = {
    id,
    userId,
    slug,
    businessInfo,
    website,
    isPublished: true, // Default to ready/published so link can be previewed immediately
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    viewsCount: 1,
    whatsappClicksCount: 0,
    callClicksCount: 0,
    leadsCount: 0,
  };

  db.projects[id] = project;
  saveDatabase();
  return project;
}

export function updateProject(
  id: string,
  userId: string,
  updates: Partial<Pick<Project, 'businessInfo' | 'website' | 'isPublished' | 'slug' | 'customDomain'>>
): Project | null {
  const proj = db.projects[id];
  if (!proj || proj.userId !== userId) {
    return null;
  }

  if (updates.businessInfo) proj.businessInfo = updates.businessInfo;
  if (updates.website) proj.website = updates.website;
  if (typeof updates.isPublished === 'boolean') {
    proj.isPublished = updates.isPublished;
    if (updates.isPublished && !proj.publishedAt) {
      proj.publishedAt = new Date().toISOString();
    }
  }
  if (updates.slug) {
    // Sanitize slug
    proj.slug = updates.slug
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  if ('customDomain' in updates) {
    proj.customDomain = updates.customDomain;
  }

  proj.updatedAt = new Date().toISOString();
  saveDatabase();
  return proj;
}

export function deleteProject(id: string, userId: string): boolean {
  const proj = db.projects[id];
  if (!proj || proj.userId !== userId) {
    return false;
  }
  delete db.projects[id];
  saveDatabase();
  return true;
}

// Inquiries & Analytics
export function createInquiry(projectId: string, data: Omit<LeadInquiry, 'id' | 'projectId' | 'createdAt'>): LeadInquiry {
  const inq: LeadInquiry = {
    id: 'inq_' + crypto.randomBytes(6).toString('hex'),
    projectId,
    name: data.name,
    phone: data.phone,
    email: data.email,
    serviceRequested: data.serviceRequested,
    message: data.message,
    createdAt: new Date().toISOString(),
  };
  db.inquiries.unshift(inq);

  if (db.projects[projectId]) {
    db.projects[projectId].leadsCount = (db.projects[projectId].leadsCount || 0) + 1;
  }
  saveDatabase();
  return inq;
}

export function getInquiriesForProject(projectId: string): LeadInquiry[] {
  return db.inquiries.filter((inq) => inq.projectId === projectId);
}

export function recordInteraction(slug: string, type: 'view' | 'whatsapp' | 'call') {
  const proj = getProjectBySlug(slug);
  if (!proj) return;

  if (type === 'view') {
    proj.viewsCount = (proj.viewsCount || 0) + 1;
  } else if (type === 'whatsapp') {
    proj.whatsappClicksCount = (proj.whatsappClicksCount || 0) + 1;
  } else if (type === 'call') {
    proj.callClicksCount = (proj.callClicksCount || 0) + 1;
  }
  saveDatabase();
}
