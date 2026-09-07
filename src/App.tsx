import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { GeneratorWizard } from './components/GeneratorWizard';
import { WebsitePreview } from './components/WebsitePreview';
import { WebsiteEditor } from './components/WebsiteEditor';
import { Dashboard } from './components/Dashboard';
import { AuthModal } from './components/AuthModal';
import { PublishModal } from './components/PublishModal';
import { ProjectSettingsModal } from './components/ProjectSettingsModal';
import { getMe, clearStoredToken, getPublicSite, saveProject, updateProject, loginGuest } from './lib/api';
import { User, Project, BusinessInfo, WebsiteContent } from './types';
import { CategoryPreset, CATEGORY_PRESETS } from './lib/presets';
import { updatePageSeo } from './lib/seo';

type ViewMode = 'landing' | 'wizard' | 'preview' | 'editor' | 'dashboard' | 'public_site';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  // Active generation/editing workspace
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [activeBusinessInfo, setActiveBusinessInfo] = useState<BusinessInfo | null>(null);
  const [activeWebsite, setActiveWebsite] = useState<WebsiteContent | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<CategoryPreset | null>(null);

  // Modals
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [settingsProject, setSettingsProject] = useState<Project | null>(null);

  // Public standalone site loading state
  const [publicSiteSlug, setPublicSiteSlug] = useState<string | null>(null);
  const [publicSiteData, setPublicSiteData] = useState<{
    slug: string;
    businessInfo: BusinessInfo;
    website: WebsiteContent;
  } | null>(null);
  const [publicSiteError, setPublicSiteError] = useState<string | null>(null);

  // On mount, check URL path and user authentication
  useEffect(() => {
    checkCurrentRoute();
    checkAuth();

    // Listen to browser navigation
    window.addEventListener('popstate', checkCurrentRoute);
    return () => window.removeEventListener('popstate', checkCurrentRoute);
  }, []);

  // Update document title, meta description, and canonical URL dynamically for each view
  useEffect(() => {
    if (currentView === 'landing') {
      updatePageSeo({
        title: 'LocalAI Web — AI Website Builder for Local Businesses & Shops',
        description:
          'Create a fast, mobile-friendly website for your local business in minutes. LocalAI Web generates tailored copy, menus, WhatsApp bookings, and Google Maps directions.',
        canonical: 'https://localweb.ai.studio/',
      });
    } else if (currentView === 'wizard') {
      updatePageSeo({
        title: 'Create Your Business Website | LocalAI Web',
        description:
          'Step-by-step AI wizard to generate your local business website with custom branding, services, and WhatsApp contact in 2 minutes.',
        canonical: 'https://localweb.ai.studio/',
      });
    } else if (currentView === 'preview') {
      const name = activeBusinessInfo?.businessName || 'Local Business';
      updatePageSeo({
        title: `Preview: ${name} Website | LocalAI Web`,
        description: `Live responsive mobile and desktop preview for ${name}. Review services, WhatsApp booking button, and business hours.`,
        canonical: 'https://localweb.ai.studio/',
      });
    } else if (currentView === 'editor') {
      const name = activeBusinessInfo?.businessName || 'Local Business';
      updatePageSeo({
        title: `Edit ${name} Website Content | LocalAI Web`,
        description: `Fine-tune your website headlines, services catalog, pricing, contact details, and visual styling.`,
        canonical: 'https://localweb.ai.studio/',
      });
    } else if (currentView === 'dashboard') {
      updatePageSeo({
        title: 'My Websites & Business Dashboard | LocalAI Web',
        description:
          'Manage your published local business websites, view customer inquiries, and download counter QR codes.',
        canonical: 'https://localweb.ai.studio/',
      });
    } else if (currentView === 'public_site' && publicSiteData) {
      const { businessInfo, slug } = publicSiteData;
      const categoryCapitalized = businessInfo.category
        ? businessInfo.category.charAt(0).toUpperCase() + businessInfo.category.slice(1)
        : 'Business';
      updatePageSeo({
        title: `${businessInfo.businessName} — ${categoryCapitalized} in ${businessInfo.city}`,
        description:
          businessInfo.shortDescription ||
          `Official website for ${businessInfo.businessName} in ${businessInfo.city}. Book on WhatsApp, view services, pricing, hours, and directions.`,
        canonical: `https://localweb.ai.studio/site/${slug}`,
      });
    }
  }, [currentView, activeBusinessInfo, publicSiteData]);

  function checkCurrentRoute() {
    const path = window.location.pathname;
    const match = path.match(/^\/site\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      const slug = match[1];
      setPublicSiteSlug(slug);
      setCurrentView('public_site');
      loadPublicSite(slug);
    }
  }

  async function checkAuth() {
    try {
      const me = await getMe();
      setUser(me);
    } catch {
      setUser(null);
    } finally {
      setIsAuthChecking(false);
    }
  }

  async function loadPublicSite(slug: string) {
    setPublicSiteError(null);
    try {
      const data = await getPublicSite(slug);
      setPublicSiteData(data);
    } catch (err: any) {
      setPublicSiteError(err.message || 'Website not found or has been unpublished.');
    }
  }

  function handleLogout() {
    clearStoredToken();
    setUser(null);
    setCurrentView('landing');
  }

  function handleStartWizard(preset?: CategoryPreset) {
    setSelectedPreset(preset || null);
    setCurrentView('wizard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleGenerationComplete(info: BusinessInfo, website: WebsiteContent) {
    setActiveBusinessInfo(info);
    setActiveWebsite(website);

    // If user is logged in, auto-save to their projects
    if (user) {
      try {
        const proj = await saveProject(info, website);
        setActiveProject(proj);
      } catch (err) {
        console.error('Auto-save project failed:', err);
      }
    }
  }

  async function handleSaveWebsite(updatedWebsite: WebsiteContent, updatedInfo: BusinessInfo) {
    setActiveWebsite(updatedWebsite);
    setActiveBusinessInfo(updatedInfo);

    // If user is logged in and activeProject exists, save to DB
    if (user && activeProject) {
      const updated = await updateProject(activeProject.id, {
        website: updatedWebsite,
        businessInfo: updatedInfo,
      });
      setActiveProject(updated);
    } else if (user && !activeProject) {
      const created = await saveProject(updatedInfo, updatedWebsite);
      setActiveProject(created);
    }
  }

  async function handlePublish() {
    if (!user) {
      // Auto-authenticate as guest or open auth modal so user gets a real persistent link
      try {
        const guestUser = await loginGuest();
        setUser(guestUser);
        if (activeBusinessInfo && activeWebsite) {
          const proj = await saveProject(activeBusinessInfo, activeWebsite);
          const published = await updateProject(proj.id, { isPublished: true });
          setActiveProject(published);
          setPublishModalOpen(true);
          return;
        }
      } catch {
        setAuthModalOpen(true);
        return;
      }
    }

    if (activeProject) {
      const updated = await updateProject(activeProject.id, { isPublished: true });
      setActiveProject(updated);
      setPublishModalOpen(true);
    } else if (activeBusinessInfo && activeWebsite) {
      const created = await saveProject(activeBusinessInfo, activeWebsite);
      const published = await updateProject(created.id, { isPublished: true });
      setActiveProject(published);
      setPublishModalOpen(true);
    }
  }

  function handleViewLiveSite(slug: string) {
    window.history.pushState({}, '', `/site/${slug}`);
    setPublicSiteSlug(slug);
    setCurrentView('public_site');
    loadPublicSite(slug);
  }

  // Load a demo site for quick showcase exploration
  function handleExploreDemo() {
    const demoPreset = CATEGORY_PRESETS[0];
    const dummyInfo: BusinessInfo = {
      businessName: demoPreset.defaultInfo.businessName || 'Bella Luxe Hair & Spa',
      category: 'salon',
      city: demoPreset.defaultInfo.city || 'Bandra West, Mumbai',
      address: demoPreset.defaultInfo.address || 'Shop 4, Hill Road, Bandra West, Mumbai',
      shortDescription:
        demoPreset.defaultInfo.shortDescription || 'Boutique hair styling, organic skin therapies, and bridal beauty.',
      services: demoPreset.defaultInfo.services || [],
      phoneNumber: demoPreset.defaultInfo.phoneNumber || '+91 98200 12345',
      whatsappNumber: demoPreset.defaultInfo.whatsappNumber || '+91 98200 12345',
      openingHours: {
        general: 'Mon - Sat: 10:00 AM - 9:00 PM (Sun: 11 AM - 7 PM)',
        schedule: [
          { day: 'Monday - Saturday', hours: '10:00 AM - 9:00 PM', isOpen: true },
          { day: 'Sunday', hours: '11:00 AM - 7:00 PM', isOpen: true },
        ],
      },
      businessEmail: demoPreset.defaultInfo.businessEmail || 'hello@bellaluxe.com',
      stylePreference: 'elegant-luxury',
      currencySymbol: '₹',
    };

    const dummyWebsite: WebsiteContent = {
      hero: {
        badge: 'Top-Rated Luxury Salon in Mumbai',
        headline: 'Where Glamour Meets Relaxation in Bandra',
        subheadline:
          'Expert hair stylists, organic skin therapies, and bespoke bridal beauty right on Hill Road. Walk-ins welcomed.',
        primaryCta: 'Chat on WhatsApp',
        secondaryCta: 'View Menu & Prices',
        coverImage:
          'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80',
      },
      about: {
        title: 'Our Craft & Neighborhood Heritage',
        subtitle: 'Boutique Beauty Care Since 2018',
        story:
          'Founded in the bustling heart of Bandra West, Bella Luxe Salon has served over 8,000 neighborhood clients. We believe personal care should be relaxing, transparent, and completely customized.',
        image:
          'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
        highlights: [
          { title: 'Certified Master Stylists', desc: 'Trained at Vidal Sassoon & L’Oreal Academies' },
          { title: '100% Organic Products', desc: 'Cruelty-free botanical colors & treatments' },
          { title: 'Zero Wait Policy', desc: 'Dedicated booked slots with prompt reception' },
        ],
        yearsInBusiness: '6+ Years in Bandra',
      },
      services: dummyInfo.services || [],
      contact: {
        phone: dummyInfo.phoneNumber || '+91 98200 12345',
        whatsapp: dummyInfo.whatsappNumber || '+91 98200 12345',
        email: dummyInfo.businessEmail || 'hello@bellaluxe.com',
        address: dummyInfo.address || 'Shop 4, Hill Road, Bandra West, Mumbai 400050',
        city: dummyInfo.city,
        googleMapsQuery: 'Bella Luxe Hair and Spa Bandra West Mumbai',
        whatsappMessagePreset:
          'Hi Bella Luxe, I would like to schedule an appointment. What slots are available?',
      },
      schedule: [
        { day: 'Monday - Saturday', hours: '10:00 AM - 9:00 PM', isOpen: true },
        { day: 'Sunday', hours: '11:00 AM - 7:00 PM', isOpen: true },
      ],
      testimonials: [
        {
          id: '1',
          name: 'Pooja Hegde',
          role: 'Regular Client',
          comment: 'The balayage coloring was sensational! Best salon experience in Bandra by far.',
          rating: 5,
        },
        {
          id: '2',
          name: 'Rohan Mehta',
          role: 'Bandra Resident',
          comment: 'Quick WhatsApp booking and zero wait. Clean, professional and great staff.',
          rating: 5,
        },
        {
          id: '3',
          name: 'Ananya Sen',
          role: 'Bridal Client',
          comment: 'Booked my wedding makeup package with them. Absolutely flawless finish!',
          rating: 5,
        },
      ],
      faq: [
        {
          id: '1',
          question: 'Do I need an appointment beforehand?',
          answer: 'Appointments are recommended to avoid waiting, though walk-ins are always welcome.',
        },
        {
          id: '2',
          question: 'Is valet parking available?',
          answer: 'Yes, complimentary valet parking is available on Hill Road right outside the salon.',
        },
      ],
      seo: {
        metaTitle: 'Bella Luxe Hair & Spa | Best Salon in Bandra West, Mumbai',
        metaDescription:
          'Experience luxury hair treatments, facials, and bridal makeovers in Bandra West. Book directly on WhatsApp.',
        keywords: ['salon in bandra', 'hair spa mumbai', 'best beauty parlour mumbai'],
        title: 'Bella Luxe Hair & Spa | Best Salon in Bandra West, Mumbai',
        description:
          'Experience luxury hair treatments, facials, and bridal makeovers in Bandra West. Book directly on WhatsApp.',
      },
      theme: {
        style: 'elegant-luxury',
        primaryColor: '#312e81',
        accentColor: '#fbbf24',
        fontFamily: 'Outfit',
        borderRadius: 'rounded-2xl',
      },
    };

    setActiveBusinessInfo(dummyInfo);
    setActiveWebsite(dummyWebsite);
    setCurrentView('preview');
  }

  // Standalone Public Site View (Direct URL Route)
  if (currentView === 'public_site') {
    if (publicSiteError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 text-center">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 max-w-md shadow-sm space-y-4">
            <h2 className="font-heading text-xl font-bold text-slate-900">Website Unavailable</h2>
            <p className="text-xs text-slate-500">{publicSiteError}</p>
            <button
              onClick={() => {
                window.history.pushState({}, '', '/');
                setCurrentView('landing');
              }}
              className="rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm"
            >
              Go to LocalAI Web Homepage
            </button>
          </div>
        </div>
      );
    }

    if (!publicSiteData) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-indigo-600 border-t-transparent" />
          <p className="mt-3 text-xs text-slate-500">Loading website...</p>
        </div>
      );
    }

    return (
      <WebsitePreview
        businessInfo={publicSiteData.businessInfo}
        website={publicSiteData.website}
        isStandalone={true}
        slug={publicSiteData.slug}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Navigation Header */}
      <Navbar
        user={user}
        onOpenAuth={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        currentView={currentView}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingPage
            onStartWizard={handleStartWizard}
            onExploreDemo={handleExploreDemo}
          />
        )}

        {currentView === 'wizard' && (
          <GeneratorWizard
            initialPreset={selectedPreset}
            onGenerationComplete={handleGenerationComplete}
            onCancel={() => setCurrentView('landing')}
            onPreview={() => setCurrentView('preview')}
            onEdit={() => setCurrentView('editor')}
            onPublish={handlePublish}
            generatedWebsite={activeWebsite}
          />
        )}

        {currentView === 'preview' && activeBusinessInfo && activeWebsite && (
          <WebsitePreview
            businessInfo={activeBusinessInfo}
            website={activeWebsite}
            isStandalone={false}
            slug={activeProject?.slug || 'preview'}
            onEdit={() => setCurrentView('editor')}
            onPublish={handlePublish}
            onBack={() => setCurrentView(user ? 'dashboard' : 'landing')}
          />
        )}

        {currentView === 'editor' && activeBusinessInfo && activeWebsite && (
          <WebsiteEditor
            businessInfo={activeBusinessInfo}
            website={activeWebsite}
            onSave={handleSaveWebsite}
            onPreview={() => setCurrentView('preview')}
            onPublish={handlePublish}
            onBack={() => setCurrentView('preview')}
          />
        )}

        {currentView === 'dashboard' && user && (
          <Dashboard
            user={user}
            onCreateNew={() => {
              setActiveBusinessInfo(null);
              setActiveWebsite(null);
              setActiveProject(null);
              setCurrentView('wizard');
            }}
            onEditProject={(proj) => {
              setActiveProject(proj);
              setActiveBusinessInfo(proj.businessInfo);
              setActiveWebsite(proj.website);
              setCurrentView('editor');
            }}
            onPreviewProject={(proj) => {
              setActiveProject(proj);
              setActiveBusinessInfo(proj.businessInfo);
              setActiveWebsite(proj.website);
              setCurrentView('preview');
            }}
            onPublishProject={(proj) => {
              setActiveProject(proj);
              setPublishModalOpen(true);
            }}
          />
        )}
      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={(loggedUser) => {
          setUser(loggedUser);
          if (activeWebsite && activeBusinessInfo && !activeProject) {
            saveProject(activeBusinessInfo, activeWebsite).then((p) => setActiveProject(p));
          }
        }}
      />

      {/* Publish Modal */}
      <PublishModal
        isOpen={publishModalOpen}
        onClose={() => setPublishModalOpen(false)}
        project={activeProject}
        onViewLive={handleViewLiveSite}
        onOpenCustomDomain={(proj) => {
          setPublishModalOpen(false);
          setSettingsProject(proj);
        }}
      />

      {/* Project Settings Modal (Accessible directly from Publish flow or workspace) */}
      <ProjectSettingsModal
        isOpen={!!settingsProject}
        onClose={() => setSettingsProject(null)}
        project={settingsProject}
        onProjectUpdated={(updated) => {
          if (activeProject?.id === updated.id) {
            setActiveProject(updated);
          }
          setSettingsProject(updated);
        }}
      />
    </div>
  );
}
