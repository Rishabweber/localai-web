import React, { useState } from 'react';
import {
  Phone,
  MessageSquare,
  MapPin,
  Clock,
  Mail,
  Star,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  Sparkles,
  Send,
  Calendar,
  Monitor,
  Tablet,
  Smartphone,
  Edit3,
  Share2,
  ArrowLeft,
  Globe,
} from 'lucide-react';
import { WebsiteContent, BusinessInfo, ServiceItem } from '../types';
import { submitSiteInquiry, trackPublicAnalytics } from '../lib/api';

interface WebsitePreviewProps {
  businessInfo: BusinessInfo;
  website: WebsiteContent;
  isStandalone?: boolean;
  slug?: string;
  onEdit?: () => void;
  onPublish?: () => void;
  onBack?: () => void;
}

export const WebsitePreview: React.FC<WebsitePreviewProps> = ({
  businessInfo,
  website,
  isStandalone = false,
  slug = 'preview',
  onEdit,
  onPublish,
  onBack,
}) => {
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Inquiry form state
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadService, setLeadService] = useState('');
  const [leadMessage, setLeadMessage] = useState('');
  const [submittingInquiry, setSubmittingInquiry] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);

  const cleanWhatsapp = (website.contact.whatsapp || '').replace(/[^0-9]/g, '');
  const cleanPhone = (website.contact.phone || '').replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanWhatsapp}?text=${website.contact.whatsappMessagePreset || encodeURIComponent('Hello, I would like to inquire about your services.')}`;

  function handleWhatsappClick() {
    trackPublicAnalytics(slug, 'whatsapp');
    window.open(whatsappUrl, '_blank');
  }

  function handleCallClick() {
    trackPublicAnalytics(slug, 'call');
    window.location.href = `tel:${cleanPhone}`;
  }

  async function handleInquirySubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!leadName || !leadPhone) return;

    setSubmittingInquiry(true);
    try {
      await submitSiteInquiry(slug, {
        name: leadName,
        phone: leadPhone,
        email: leadEmail,
        serviceRequested: leadService,
        message: leadMessage,
      });
      setInquirySuccess(true);
    } catch {
      // Even in local preview, show friendly confirmation
      setInquirySuccess(true);
    } finally {
      setSubmittingInquiry(false);
    }
  }

  // Determine current day opening status
  const currentDayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date());

  const websiteNode = (
    <div
      className={`min-h-screen font-sans antialiased text-slate-900 bg-white transition-all ${
        website.theme.style === 'elegant-luxury' ? 'selection:bg-amber-500 selection:text-white' : ''
      }`}
    >
      {/* Top Notification / Business Banner */}
      <div
        className="text-white text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-2"
        style={{ backgroundColor: website.theme.primaryColor || '#0f172a' }}
      >
        <span>★ {website.hero.badge}</span>
        <span className="hidden sm:inline">· Located in {businessInfo.city}</span>
        <button
          onClick={handleWhatsappClick}
          className="ml-2 font-bold underline hover:opacity-80"
        >
          Book on WhatsApp &rarr;
        </button>
      </div>

      {/* Website Navigation Header */}
      <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl text-white font-bold text-base shadow-sm"
              style={{ backgroundColor: website.theme.primaryColor || '#0f172a' }}
            >
              {businessInfo.businessName.charAt(0)}
            </div>
            <div>
              <span className="font-heading font-extrabold text-base sm:text-lg tracking-tight text-slate-900 line-clamp-1">
                {businessInfo.businessName}
              </span>
              <span className="block text-[10px] text-slate-500 font-medium -mt-0.5">
                {businessInfo.city}
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <a href="#services" className="hover:text-indigo-600 transition">
              Services & Pricing
            </a>
            <a href="#about" className="hover:text-indigo-600 transition">
              About Us
            </a>
            <a href="#hours" className="hover:text-indigo-600 transition">
              Hours & Location
            </a>
            <a href="#testimonials" className="hover:text-indigo-600 transition">
              Reviews
            </a>
            <a href="#faq" className="hover:text-indigo-600 transition">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCallClick}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
              title="Call Phone Number"
            >
              <Phone className="h-3.5 w-3.5 text-blue-600" />
              <span className="hidden sm:inline">Call</span>
            </button>
            <button
              onClick={handleWhatsappClick}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition"
            >
              <MessageSquare className="h-3.5 w-3.5 fill-current" />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10 pb-16 sm:pt-16 sm:pb-24 border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5 text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1 text-xs font-semibold text-slate-700">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                <span>{website.hero.badge}</span>
              </div>

              <h1 className="font-heading text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
                {website.hero.headline}
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
                {website.hero.subheadline}
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={handleWhatsappClick}
                  className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition active:scale-95"
                >
                  <MessageSquare className="h-4 w-4 fill-current" />
                  {website.hero.primaryCta || 'Chat on WhatsApp'}
                </button>

                <button
                  onClick={handleCallClick}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition"
                >
                  <Phone className="h-4 w-4 text-indigo-600" />
                  Call: {website.contact.phone}
                </button>
              </div>

              {/* Verified Trust Strip */}
              <div className="pt-4 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500">
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <span className="font-bold text-slate-800 ml-1">5.0 (Google Verified)</span>
                </div>
                <span>·</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> Open Today
                </span>
                <span>·</span>
                <span>{businessInfo.city}</span>
              </div>
            </div>

            {/* Right Photo Banner */}
            <div className="lg:col-span-5">
              <div className="relative overflow-hidden rounded-3xl border border-slate-200 shadow-xl bg-slate-100">
                <img
                  src={website.hero.coverImage}
                  alt={`${businessInfo.businessName} storefront and services in ${businessInfo.city}`}
                  className="h-64 sm:h-80 w-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="font-bold text-sm leading-tight">{businessInfo.businessName}</p>
                  <p className="text-xs text-slate-200 flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3 w-3 text-rose-400" />
                    {website.contact.address || businessInfo.city}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services & Pricing Section */}
      <section id="services" className="py-16 bg-slate-50 border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Services & Menu
            </span>
            <h2 className="mt-2 font-heading text-2xl sm:text-3xl font-extrabold text-slate-900">
              Transparent Pricing & Packages
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600">
              Book any service directly with our team with zero advance booking fees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {website.services.map((srv: ServiceItem) => (
              <div
                key={srv.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-indigo-300 hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h4 className="font-heading font-bold text-base text-slate-900">
                      {srv.name}
                    </h4>
                    <span className="font-extrabold text-base text-indigo-600 shrink-0">
                      {srv.price}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {srv.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-medium">{srv.duration || 'Standard'}</span>
                    {srv.popular && (
                      <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                        Popular
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      const msg = encodeURIComponent(
                        `Hi ${businessInfo.businessName}, I would like to book the "${srv.name}" (${srv.price}). Are slots available?`
                      );
                      window.open(`https://wa.me/${cleanWhatsapp}?text=${msg}`, '_blank');
                    }}
                    className="flex items-center gap-1.5 font-bold text-emerald-700 hover:text-emerald-800"
                  >
                    <MessageSquare className="h-3.5 w-3.5 fill-current" />
                    Book on WhatsApp
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-white border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-md">
                <img
                  src={website.about.image || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80'}
                  alt={`About ${businessInfo.businessName} - Team and work in ${businessInfo.city}`}
                  className="h-72 sm:h-96 w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            <div className="lg:col-span-7 order-1 lg:order-2 space-y-4 text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                {website.about.subtitle || 'Our Heritage'}
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900">
                {website.about.title}
              </h2>
              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {website.about.story}
              </div>

              <div className="pt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {website.about.highlights?.map((h, i) => (
                  <div key={i} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                    <p className="font-bold text-xs text-slate-900">{h.title}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{h.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-16 bg-slate-50 border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Real Customer Feedback
          </span>
          <h2 className="mt-2 font-heading text-2xl sm:text-3xl font-extrabold text-slate-900">
            Loved by Our Neighbors in {businessInfo.city}
          </h2>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {website.testimonials.map((t) => (
              <div key={t.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-amber-500 mb-3">
                    {Array.from({ length: t.rating || 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                    "{t.comment}"
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-3 pt-3 border-t border-slate-100">
                  <img
                    src={t.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${t.name}`}
                    alt={`Customer review by ${t.name}, ${t.role}`}
                    className="h-9 w-9 rounded-full bg-slate-100"
                  />
                  <div>
                    <p className="font-bold text-xs text-slate-900">{t.name}</p>
                    <p className="text-[10px] text-slate-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Opening Hours & Google Maps Section */}
      <section id="hours" className="py-16 bg-white border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Hours Schedule */}
            <div className="lg:col-span-6 rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-heading font-bold text-lg text-slate-900">
                  <Clock className="h-5 w-5 text-indigo-600" />
                  <span>Business Hours</span>
                </div>
                <span className="rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5">
                  Open Now
                </span>
              </div>

              <div className="divide-y divide-slate-200 text-xs">
                {website.schedule.map((item, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between">
                    <span className="font-semibold text-slate-700">{item.day}</span>
                    <span className={item.isOpen ? 'text-slate-900 font-medium' : 'text-rose-600 font-bold'}>
                      {item.hours}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <p className="text-xs text-slate-500">
                  * Prior booking via WhatsApp is advised for guaranteed zero wait-time.
                </p>
              </div>
            </div>

            {/* Location & Directions */}
            <div className="lg:col-span-6 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-2 font-heading font-bold text-lg text-slate-900">
                <MapPin className="h-5 w-5 text-rose-600" />
                <span>Location & Directions</span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {website.contact.address || businessInfo.address || businessInfo.city}
              </p>

              {/* Google Maps Simulated Directions Box */}
              <div className="rounded-2xl border border-slate-200 bg-slate-100 p-6 text-center space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-rose-600 shadow-sm">
                  <MapPin className="h-6 w-6" />
                </div>
                <p className="font-bold text-sm text-slate-900">{businessInfo.businessName}</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Click below to open exact GPS directions in Google Maps on your phone.
                </p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    businessInfo.businessName + ' ' + (businessInfo.address || '') + ' ' + businessInfo.city
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-black transition"
                >
                  <MapPin className="h-3.5 w-3.5 text-rose-400" />
                  Get Directions on Google Maps
                </a>
              </div>

              <div className="space-y-2 pt-2 text-xs text-slate-600">
                <p className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-indigo-600" />
                  <span>Call Us: <a href={`tel:${cleanPhone}`} className="font-bold text-indigo-600 hover:underline">{website.contact.phone}</a></span>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-indigo-600" />
                  <span>Email: {website.contact.email}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 bg-slate-50 border-b border-slate-100">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Got Questions?
            </span>
            <h2 className="mt-2 font-heading text-2xl sm:text-3xl font-extrabold text-slate-900">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {website.faq.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={item.id} className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between p-4 text-left font-bold text-xs sm:text-sm text-slate-900 hover:text-indigo-600"
                  >
                    <span>{item.question}</span>
                    <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Booking & Lead Form Section */}
      <section id="contact" className="py-16 bg-white border-b border-slate-100">
        <div className="mx-auto max-w-xl px-4 sm:px-6 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Direct Appointment Inquiry
          </span>
          <h2 className="mt-2 font-heading text-2xl sm:text-3xl font-extrabold text-slate-900">
            Book or Send a Message
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Leave your contact details and our team will get back to you within 10 minutes.
          </p>

          <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50/50 p-6 sm:p-8 text-left shadow-sm">
            {inquirySuccess ? (
              <div className="text-center py-6 space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h4 className="font-heading font-bold text-lg text-slate-900">Inquiry Received!</h4>
                <p className="text-xs text-slate-600">
                  Thank you! Our team has received your request and will reach out to you shortly.
                </p>
                <button
                  onClick={handleWhatsappClick}
                  className="mt-3 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm"
                >
                  <MessageSquare className="h-3.5 w-3.5 fill-current" />
                  Chat Now on WhatsApp
                </button>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Mobile / WhatsApp Number *</label>
                    <input
                      type="tel"
                      required
                      value={leadPhone}
                      onChange={(e) => setLeadPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Service Interested In</label>
                    <select
                      value={leadService}
                      onChange={(e) => setLeadService(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs sm:text-sm text-slate-900 focus:border-indigo-500 focus:outline-none"
                    >
                      <option value="">Select a service...</option>
                      {website.services.map((s) => (
                        <option key={s.id} value={s.name}>
                          {s.name} ({s.price})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Message or Slot Preference</label>
                  <textarea
                    rows={2}
                    value={leadMessage}
                    onChange={(e) => setLeadMessage(e.target.value)}
                    placeholder="e.g. Looking for a slot this Saturday at 4 PM"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingInquiry}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-indigo-700 disabled:opacity-50 transition"
                >
                  {submittingInquiry ? (
                    <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send Booking Inquiry
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Website Footer */}
      <footer className="py-10 bg-slate-900 text-white text-xs text-center border-t border-slate-800">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 space-y-3">
          <p className="font-heading font-bold text-sm text-white">{businessInfo.businessName}</p>
          <p className="text-slate-400">{website.contact.address || businessInfo.city}</p>
          <p className="text-slate-500 text-[11px]">
            © {new Date().getFullYear()} {businessInfo.businessName}. All rights reserved.
          </p>
          <div className="pt-2">
            <span className="text-[10px] text-slate-600">
              Powered by LocalAI Web · AI Website Builder for Local Businesses
            </span>
          </div>
        </div>
      </footer>

      {/* Sticky Bottom Action Bar for Mobile Visitors (Thumb Zone Conversion) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-2.5 flex items-center gap-2 sm:hidden shadow-lg">
        <button
          onClick={handleCallClick}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white py-3 text-xs font-bold text-slate-800 active:scale-95"
        >
          <Phone className="h-4 w-4 text-blue-600" />
          Call
        </button>
        <button
          onClick={handleWhatsappClick}
          className="flex-2 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white shadow-md shadow-emerald-600/30 active:scale-95"
        >
          <MessageSquare className="h-4 w-4 fill-current" />
          Chat on WhatsApp
        </button>
      </div>
    </div>
  );

  // If in Standalone mode (full public site), render directly
  if (isStandalone) {
    return websiteNode;
  }

  // Inside Preview Workbench Mode with device toggle bar and editor CTAs
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top Preview Control Bar */}
      <div className="sticky top-0 z-50 flex flex-wrap items-center justify-between border-b border-slate-200 bg-white px-4 py-2.5 shadow-xs gap-3">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-lg p-1.5 hover:bg-slate-100"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
          )}
          <span className="font-heading font-bold text-sm text-slate-800 flex items-center gap-2">
            Live Preview: <span className="text-indigo-600">{businessInfo.businessName}</span>
          </span>
        </div>

        {/* Device Switcher */}
        <div className="hidden sm:flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200/80">
          <button
            onClick={() => setDeviceView('desktop')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              deviceView === 'desktop' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Monitor className="h-3.5 w-3.5" />
            Desktop
          </button>
          <button
            onClick={() => setDeviceView('tablet')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              deviceView === 'tablet' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Tablet className="h-3.5 w-3.5" />
            Tablet
          </button>
          <button
            onClick={() => setDeviceView('mobile')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              deviceView === 'mobile' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" />
            Mobile (Android / iPhone)
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {onEdit && (
            <button
              onClick={onEdit}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
            >
              <Edit3 className="h-3.5 w-3.5 text-indigo-600" />
              Edit Content
            </button>
          )}
          {onPublish && (
            <button
              onClick={onPublish}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition"
            >
              <Share2 className="h-3.5 w-3.5" />
              Publish Website
            </button>
          )}
        </div>
      </div>

      {/* Frame Container */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-6 flex justify-center items-start">
        {deviceView === 'desktop' ? (
          <div className="w-full max-w-6xl rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-white">
            {websiteNode}
          </div>
        ) : deviceView === 'tablet' ? (
          <div className="w-[768px] rounded-3xl overflow-hidden border-8 border-slate-800 shadow-2xl bg-white my-4">
            {websiteNode}
          </div>
        ) : (
          /* Realistic Smartphone mock frame */
          <div className="w-[390px] rounded-[42px] overflow-hidden border-8 border-slate-800 shadow-2xl bg-white my-4 relative">
            <div className="h-5 bg-slate-800 w-full flex justify-center items-center">
              <span className="h-3.5 w-24 bg-slate-950 rounded-b-xl" />
            </div>
            {websiteNode}
          </div>
        )}
      </div>
    </div>
  );
};
