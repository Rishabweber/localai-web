import React, { useState } from 'react';
import {
  Sparkles,
  Save,
  Eye,
  Share2,
  ArrowLeft,
  Plus,
  Trash2,
  CheckCircle2,
  RefreshCw,
  FileText,
  DollarSign,
  Phone,
  HelpCircle,
  Search,
  Sliders,
  Clock,
  MapPin,
  MessageSquare,
  ChevronDown,
} from 'lucide-react';
import { WebsiteContent, BusinessInfo, ServiceItem, FaqItem } from '../types';
import { regenerateSection } from '../lib/api';

interface WebsiteEditorProps {
  businessInfo: BusinessInfo;
  website: WebsiteContent;
  onSave: (updatedWebsite: WebsiteContent, updatedInfo: BusinessInfo) => Promise<void>;
  onPreview: () => void;
  onPublish: () => void;
  onBack: () => void;
}

export const WebsiteEditor: React.FC<WebsiteEditorProps> = ({
  businessInfo,
  website: initialWebsite,
  onSave,
  onPreview,
  onPublish,
  onBack,
}) => {
  const [content, setContent] = useState<WebsiteContent>(JSON.parse(JSON.stringify(initialWebsite)));
  const [info, setInfo] = useState<BusinessInfo>(JSON.parse(JSON.stringify(businessInfo)));
  const [activeTab, setActiveTab] = useState<'hero' | 'about' | 'services' | 'contact' | 'faq' | 'seo'>('hero');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // AI regeneration state
  const [regeneratingSection, setRegeneratingSection] = useState<string | null>(null);
  const [aiTone, setAiTone] = useState<string>('Friendly & Persuasive');

  async function handleRegenerate(section: 'hero' | 'about' | 'services' | 'faq' | 'seo') {
    setRegeneratingSection(section);
    try {
      const updatedData = await regenerateSection(section, info, content, aiTone);
      setContent((prev) => ({
        ...prev,
        ...updatedData,
      }));
      setSaveSuccess(false);
    } catch (err: any) {
      alert(err.message || 'AI regeneration failed. Please try again.');
    } finally {
      setRegeneratingSection(null);
    }
  }

  async function handleSave() {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await onSave(content, info);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to save changes.');
    } finally {
      setIsSaving(false);
    }
  }

  // Service helpers
  function addService() {
    const newService: ServiceItem = {
      id: String(Date.now()),
      name: 'New Custom Service',
      description: 'Comprehensive service provided with top-tier materials and care.',
      price: `${info.currencySymbol || '₹'}699`,
      duration: '45 mins',
      popular: false,
    };
    setContent({
      ...content,
      services: [...content.services, newService],
    });
  }

  function updateService(id: string, field: keyof ServiceItem, value: any) {
    setContent({
      ...content,
      services: content.services.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
    });
  }

  function deleteService(id: string) {
    if (content.services.length <= 1) return;
    setContent({
      ...content,
      services: content.services.filter((s) => s.id !== id),
    });
  }

  // FAQ helpers
  function addFaq() {
    const newFaq: FaqItem = {
      id: String(Date.now()),
      question: 'Do you accept online appointments?',
      answer: 'Yes! You can message us on WhatsApp or call our phone line directly to reserve your slot.',
    };
    setContent({
      ...content,
      faq: [...content.faq, newFaq],
    });
  }

  function updateFaq(id: string, field: 'question' | 'answer', value: string) {
    setContent({
      ...content,
      faq: content.faq.map((f) => (f.id === id ? { ...f, [field]: value } : f)),
    });
  }

  function deleteFaq(id: string) {
    if (content.faq.length <= 1) return;
    setContent({
      ...content,
      faq: content.faq.filter((f) => f.id !== id),
    });
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navbar for Editor */}
      <div className="sticky top-0 z-40 border-b border-slate-200 bg-white px-4 py-3 shadow-xs">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 rounded-lg p-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="font-heading font-bold text-sm text-slate-900 line-clamp-1">
                Editing: <span className="text-indigo-600">{info.businessName}</span>
              </span>
              {saveSuccess && (
                <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200 animate-fadeIn">
                  <CheckCircle2 className="h-3 w-3" /> Saved!
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              id="editor-preview-btn"
              onClick={onPreview}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
            >
              <Eye className="h-3.5 w-3.5 text-slate-500" />
              Preview
            </button>
            <button
              id="editor-save-btn"
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50 transition"
            >
              {isSaving ? (
                <span className="h-3.5 w-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                <Save className="h-3.5 w-3.5" />
              )}
              Save Changes
            </button>
            <button
              id="editor-publish-btn"
              onClick={onPublish}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition"
            >
              <Share2 className="h-3.5 w-3.5" />
              Publish
            </button>
          </div>
        </div>
      </div>

      {/* Editor Body */}
      <div className="mx-auto max-w-6xl w-full px-4 py-6 flex-1 flex flex-col md:flex-row gap-6">
        {/* Section Navigation Tabs (Left Sidebar) */}
        <div className="w-full md:w-64 shrink-0 space-y-1">
          <div className="p-3 bg-white rounded-2xl border border-slate-200 space-y-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
              Website Sections
            </p>
            {[
              { id: 'hero', label: 'Hero Headline & CTA', icon: Sparkles },
              { id: 'services', label: 'Services & Pricing', icon: DollarSign },
              { id: 'about', label: 'About Story & Highlights', icon: FileText },
              { id: 'contact', label: 'Contact & Business Hours', icon: Phone },
              { id: 'faq', label: 'FAQ Accordion', icon: HelpCircle },
              { id: 'seo', label: 'Local SEO & Social Meta', icon: Search },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-bold text-left transition ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* AI Regeneration Assistant Tone Widget */}
          <div className="p-4 bg-indigo-50/70 rounded-2xl border border-indigo-200/80 space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900">
              <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
              <span>AI Writing Assistant Tone</span>
            </div>
            <p className="text-[11px] text-slate-600">
              When regenerating sections, AI will adopt this personality:
            </p>
            <select
              value={aiTone}
              onChange={(e) => setAiTone(e.target.value)}
              className="w-full rounded-xl border border-indigo-200 bg-white p-2 text-xs font-medium text-slate-800"
            >
              <option value="Friendly & Welcoming">Warm, Friendly & Welcoming</option>
              <option value="Premium & Luxury">Exclusive & Luxury Prestige</option>
              <option value="Modern, Direct & Persuasive">Modern, Direct & High Converting</option>
              <option value="Authoritative & Clinical">Professional & Authoritative</option>
              <option value="Vibrant & High-Energy">Vibrant & High-Energy</option>
            </select>
          </div>
        </div>

        {/* Section Editing Canvas (Right Pane) */}
        <div className="flex-1 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          {/* TAB 1: HERO */}
          {activeTab === 'hero' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-heading text-lg font-bold text-slate-900">Hero Section Content</h3>
                  <p className="text-xs text-slate-500">First impressions determine customer bookings.</p>
                </div>
                <button
                  onClick={() => handleRegenerate('hero')}
                  disabled={regeneratingSection === 'hero'}
                  className="flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3.5 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 disabled:opacity-50 transition"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${regeneratingSection === 'hero' ? 'animate-spin' : ''}`} />
                  Regenerate Hero with AI
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Top Badge / Pill</label>
                  <input
                    type="text"
                    value={content.hero.badge}
                    onChange={(e) =>
                      setContent({ ...content, hero: { ...content.hero, badge: e.target.value } })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Main Headline</label>
                  <input
                    type="text"
                    value={content.hero.headline}
                    onChange={(e) =>
                      setContent({ ...content, hero: { ...content.hero, headline: e.target.value } })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 font-semibold focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Subheadline</label>
                  <textarea
                    rows={3}
                    value={content.hero.subheadline}
                    onChange={(e) =>
                      setContent({ ...content, hero: { ...content.hero, subheadline: e.target.value } })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Primary WhatsApp Button Text</label>
                    <input
                      type="text"
                      value={content.hero.primaryCta}
                      onChange={(e) =>
                        setContent({ ...content, hero: { ...content.hero, primaryCta: e.target.value } })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Hero Image URL</label>
                    <input
                      type="text"
                      value={content.hero.coverImage}
                      onChange={(e) =>
                        setContent({ ...content, hero: { ...content.hero, coverImage: e.target.value } })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SERVICES & PRICING */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-heading text-lg font-bold text-slate-900">Services & Pricing Menu</h3>
                  <p className="text-xs text-slate-500">Edit prices, service details, and highlight popular items.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRegenerate('services')}
                    disabled={regeneratingSection === 'services'}
                    className="flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${regeneratingSection === 'services' ? 'animate-spin' : ''}`} />
                    Regenerate Copy
                  </button>
                  <button
                    onClick={addService}
                    className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 transition"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Service
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {content.services.map((srv, idx) => (
                  <div key={srv.id} className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 relative space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                      <div className="sm:col-span-5">
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Service Title</label>
                        <input
                          type="text"
                          value={srv.name}
                          onChange={(e) => updateService(srv.id, 'name', e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Price</label>
                        <input
                          type="text"
                          value={srv.price}
                          onChange={(e) => updateService(srv.id, 'price', e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-indigo-600 focus:outline-none"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Duration</label>
                        <input
                          type="text"
                          value={srv.duration || ''}
                          onChange={(e) => updateService(srv.id, 'duration', e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:outline-none"
                        />
                      </div>
                      <div className="sm:col-span-1 flex justify-end pt-5">
                        {content.services.length > 1 && (
                          <button
                            onClick={() => deleteService(srv.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Description</label>
                      <input
                        type="text"
                        value={srv.description}
                        onChange={(e) => updateService(srv.id, 'description', e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600 focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ABOUT STORY */}
          {activeTab === 'about' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-heading text-lg font-bold text-slate-900">About Story & Heritage</h3>
                  <p className="text-xs text-slate-500">Your local origin story builds genuine neighborhood trust.</p>
                </div>
                <button
                  onClick={() => handleRegenerate('about')}
                  disabled={regeneratingSection === 'about'}
                  className="flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3.5 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${regeneratingSection === 'about' ? 'animate-spin' : ''}`} />
                  Regenerate Story with AI
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Section Subtitle</label>
                  <input
                    type="text"
                    value={content.about.subtitle || ''}
                    onChange={(e) =>
                      setContent({ ...content, about: { ...content.about, subtitle: e.target.value } })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Section Title</label>
                  <input
                    type="text"
                    value={content.about.title}
                    onChange={(e) =>
                      setContent({ ...content, about: { ...content.about, title: e.target.value } })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">The Story (Paragraphs)</label>
                  <textarea
                    rows={6}
                    value={content.about.story}
                    onChange={(e) =>
                      setContent({ ...content, about: { ...content.about, story: e.target.value } })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">About Image URL</label>
                  <input
                    type="text"
                    value={content.about.image || ''}
                    onChange={(e) =>
                      setContent({ ...content, about: { ...content.about, image: e.target.value } })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CONTACT & HOURS */}
          {activeTab === 'contact' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="font-heading text-lg font-bold text-slate-900">Contact & Operating Hours</h3>
                <p className="text-xs text-slate-500">Ensure your phone, WhatsApp, and Google Maps address are accurate.</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp Number (with Country Code)</label>
                    <input
                      type="text"
                      value={content.contact.whatsapp}
                      onChange={(e) => {
                        const val = e.target.value;
                        setContent({ ...content, contact: { ...content.contact, whatsapp: val } });
                        setInfo({ ...info, whatsappNumber: val });
                      }}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Phone Call Number</label>
                    <input
                      type="text"
                      value={content.contact.phone}
                      onChange={(e) => {
                        const val = e.target.value;
                        setContent({ ...content, contact: { ...content.contact, phone: val } });
                        setInfo({ ...info, phoneNumber: val });
                      }}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Business Email</label>
                    <input
                      type="email"
                      value={content.contact.email}
                      onChange={(e) => {
                        const val = e.target.value;
                        setContent({ ...content, contact: { ...content.contact, email: val } });
                        setInfo({ ...info, businessEmail: val });
                      }}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Physical Street Address</label>
                    <input
                      type="text"
                      value={content.contact.address}
                      onChange={(e) => {
                        const val = e.target.value;
                        setContent({ ...content, contact: { ...content.contact, address: val } });
                        setInfo({ ...info, address: val });
                      }}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp Pre-filled Message</label>
                  <input
                    type="text"
                    value={content.contact.whatsappMessagePreset || ''}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        contact: { ...content.contact, whatsappMessagePreset: e.target.value },
                      })
                    }
                    placeholder="Hello, I want to book an appointment..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: FAQ */}
          {activeTab === 'faq' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-heading text-lg font-bold text-slate-900">FAQ Section</h3>
                  <p className="text-xs text-slate-500">Address common questions about parking, booking, and pricing.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRegenerate('faq')}
                    disabled={regeneratingSection === 'faq'}
                    className="flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${regeneratingSection === 'faq' ? 'animate-spin' : ''}`} />
                    Regenerate FAQs
                  </button>
                  <button
                    onClick={addFaq}
                    className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 transition"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Question
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {content.faq.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        value={item.question}
                        onChange={(e) => updateFaq(item.id, 'question', e.target.value)}
                        placeholder="Question..."
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none"
                      />
                      {content.faq.length > 1 && (
                        <button
                          onClick={() => deleteFaq(item.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    <textarea
                      rows={2}
                      value={item.answer}
                      onChange={(e) => updateFaq(item.id, 'answer', e.target.value)}
                      placeholder="Answer..."
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: SEO */}
          {activeTab === 'seo' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-heading text-lg font-bold text-slate-900">Local SEO & Google Search Meta</h3>
                  <p className="text-xs text-slate-500">Fine-tune how your business shows up on Google & social shares.</p>
                </div>
                <button
                  onClick={() => handleRegenerate('seo')}
                  disabled={regeneratingSection === 'seo'}
                  className="flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3.5 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${regeneratingSection === 'seo' ? 'animate-spin' : ''}`} />
                  Regenerate SEO with AI
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Google Meta Title (Max 60 chars)</label>
                  <input
                    type="text"
                    value={content.seo.title}
                    onChange={(e) =>
                      setContent({ ...content, seo: { ...content.seo, title: e.target.value } })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none"
                  />
                  <p className="mt-1 text-[11px] text-slate-400">
                    {content.seo.title.length} characters (ideal: 50-60)
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Google Meta Description (Max 160 chars)</label>
                  <textarea
                    rows={3}
                    value={content.seo.description}
                    onChange={(e) =>
                      setContent({ ...content, seo: { ...content.seo, description: e.target.value } })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-700 focus:outline-none"
                  />
                  <p className="mt-1 text-[11px] text-slate-400">
                    {content.seo.description.length} characters (ideal: 140-160)
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Local Keywords (comma separated)</label>
                  <input
                    type="text"
                    value={content.seo.keywords?.join(', ') || ''}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        seo: {
                          ...content.seo,
                          keywords: e.target.value.split(',').map((k) => k.trim()).filter(Boolean),
                        },
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-700 focus:outline-none"
                  />
                </div>

                {/* Google Search Mock Preview */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-1">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Google Search Result Preview:
                  </p>
                  <p className="text-xs text-emerald-800">
                    https://localai.web &rsaquo; site &rsaquo; {info.businessName.toLowerCase().replace(/[^a-z0-9]/g, '-')}
                  </p>
                  <h4 className="text-sm font-bold text-blue-800 hover:underline cursor-pointer">
                    {content.seo.title}
                  </h4>
                  <p className="text-xs text-slate-600 line-clamp-2">
                    {content.seo.description}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
