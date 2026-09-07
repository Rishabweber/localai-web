import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Plus,
  Trash2,
  Check,
  Building2,
  MapPin,
  FileText,
  Phone,
  MessageSquare,
  Clock,
  Mail,
  Palette,
  Eye,
  RefreshCw,
  Share2,
  Scissors,
  Utensils,
  Coffee,
  Dumbbell,
  Stethoscope,
  Wrench,
  GraduationCap,
  Store,
  User as UserIcon,
  CheckCircle2,
} from 'lucide-react';
import { BusinessInfo, ServiceItem, StylePreference, WebsiteContent } from '../types';
import { CATEGORY_PRESETS, CategoryPreset } from '../lib/presets';
import { generateWebsite } from '../lib/api';

interface GeneratorWizardProps {
  initialPreset?: CategoryPreset | null;
  onGenerationComplete: (info: BusinessInfo, website: WebsiteContent) => void;
  onCancel: () => void;
  onPreview: () => void;
  onEdit: () => void;
  onPublish: () => void;
  generatedWebsite: WebsiteContent | null;
}

export const GeneratorWizard: React.FC<GeneratorWizardProps> = ({
  initialPreset,
  onGenerationComplete,
  onCancel,
  onPreview,
  onEdit,
  onPublish,
  generatedWebsite,
}) => {
  const [step, setStep] = useState<number>(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationPhase, setGenerationPhase] = useState(0);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Initialize form state
  const defaultPreset = initialPreset?.defaultInfo || CATEGORY_PRESETS[0].defaultInfo;

  const [businessName, setBusinessName] = useState(defaultPreset.businessName || '');
  const [category, setCategory] = useState(defaultPreset.category || 'salon');
  const [city, setCity] = useState(defaultPreset.city || '');
  const [address, setAddress] = useState(defaultPreset.address || '');
  const [shortDescription, setShortDescription] = useState(defaultPreset.shortDescription || '');

  const [currencySymbol, setCurrencySymbol] = useState(defaultPreset.currencySymbol || '₹');
  const [services, setServices] = useState<ServiceItem[]>(
    defaultPreset.services?.length
      ? defaultPreset.services
      : [
          {
            id: '1',
            name: 'Consultation & Service',
            description: 'Professional bespoke service with dedicated care.',
            price: '₹499',
            duration: '30 mins',
            popular: true,
          },
        ]
  );

  const [phoneNumber, setPhoneNumber] = useState(defaultPreset.phoneNumber || '+91 98765 43210');
  const [whatsappNumber, setWhatsappNumber] = useState(defaultPreset.whatsappNumber || '+91 98765 43210');
  const [businessEmail, setBusinessEmail] = useState(defaultPreset.businessEmail || '');
  const [generalHours, setGeneralHours] = useState('Mon - Sat: 10:00 AM - 8:30 PM (Sun: 10 AM - 5 PM)');

  const [stylePreference, setStylePreference] = useState<StylePreference>(
    (defaultPreset.stylePreference as StylePreference) || 'modern-minimal'
  );

  // Quick preset loader
  function loadPreset(preset: CategoryPreset) {
    const info = preset.defaultInfo;
    setCategory(info.category || 'other');
    setBusinessName(info.businessName || '');
    setCity(info.city || '');
    setAddress(info.address || '');
    setShortDescription(info.shortDescription || '');
    if (info.services) setServices(info.services);
    if (info.phoneNumber) setPhoneNumber(info.phoneNumber);
    if (info.whatsappNumber) setWhatsappNumber(info.whatsappNumber);
    if (info.businessEmail) setBusinessEmail(info.businessEmail);
    if (info.stylePreference) setStylePreference(info.stylePreference as StylePreference);
    if (info.currencySymbol) setCurrencySymbol(info.currencySymbol);
  }

  // Service item management
  function addService() {
    const newId = String(Date.now());
    setServices([
      ...services,
      {
        id: newId,
        name: 'New Service',
        description: 'Quality service executed with meticulous attention.',
        price: `${currencySymbol}500`,
        duration: '45 mins',
        popular: false,
      },
    ]);
  }

  function updateService(id: string, field: keyof ServiceItem, value: any) {
    setServices(services.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  }

  function removeService(id: string) {
    if (services.length <= 1) return;
    setServices(services.filter((s) => s.id !== id));
  }

  // Trigger AI generation
  async function handleStartGeneration() {
    setStep(5);
    setIsGenerating(true);
    setGenerationError(null);
    setGenerationPhase(0);

    const businessInfo: BusinessInfo = {
      businessName: businessName.trim() || 'My Local Business',
      category,
      city: city.trim() || 'Our City',
      address: address.trim(),
      shortDescription: shortDescription.trim(),
      services,
      phoneNumber: phoneNumber.trim(),
      whatsappNumber: whatsappNumber.trim() || phoneNumber.trim(),
      openingHours: {
        general: generalHours,
        schedule: [
          { day: 'Monday - Friday', hours: '9:30 AM - 8:30 PM', isOpen: true },
          { day: 'Saturday', hours: '9:30 AM - 9:00 PM', isOpen: true },
          { day: 'Sunday', hours: '10:00 AM - 6:00 PM', isOpen: true },
        ],
      },
      businessEmail: businessEmail.trim(),
      stylePreference,
      currencySymbol,
    };

    // Animate phases for rich feedback
    const timer1 = setTimeout(() => setGenerationPhase(1), 700);
    const timer2 = setTimeout(() => setGenerationPhase(2), 1600);
    const timer3 = setTimeout(() => setGenerationPhase(3), 2600);
    const timer4 = setTimeout(() => setGenerationPhase(4), 3600);

    try {
      const generated = await generateWebsite(businessInfo);
      setTimeout(() => {
        setIsGenerating(false);
        onGenerationComplete(businessInfo, generated);
      }, 4200);
    } catch (err: any) {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      setIsGenerating(false);
      setGenerationError(err.message || 'Generation failed. Please try again.');
    }
  }

  const generationPhasesText = [
    `Analyzing ${category} industry benchmarks in ${city || 'your area'}...`,
    `Crafting high-converting headlines & authentic local business story...`,
    `Organizing services catalog & pricing with ${currencySymbol} format...`,
    `Configuring instant WhatsApp lead routing & call-to-action buttons...`,
    `Generating SEO meta tags & mobile-first responsive layout...`,
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
      {/* Progress Bar & Steps Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3 text-xs font-semibold text-slate-500">
          <span>STEP {step} OF 5</span>
          <span className="text-indigo-600 font-bold">
            {step === 1 && 'Business Information'}
            {step === 2 && 'Services & Pricing'}
            {step === 3 && 'Contact & Opening Hours'}
            {step === 4 && 'Design & Style'}
            {step === 5 && (isGenerating ? 'AI Generating...' : 'Website Ready!')}
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
          <div
            className="h-full bg-indigo-600 transition-all duration-300 rounded-full"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* STEP 1: BUSINESS INFORMATION */}
      {step === 1 && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm animate-fadeIn">
          <div className="mb-6">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900">
              Tell us about your business
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Provide basic details so our AI can customize the layout and copywriting specifically for your local shop or service.
            </p>
          </div>

          {/* Quick Preset Selector */}
          <div className="mb-8 rounded-2xl bg-slate-50 p-4 border border-slate-200/80">
            <p className="text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
              Quick Fill with a Real Template (Optional):
            </p>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => loadPreset(preset)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-indigo-500 hover:text-indigo-600 transition shadow-2xs"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Business Name *
              </label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  id="wizard-business-name"
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Bella Luxe Hair & Spa"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Business Category *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'salon', label: 'Salon & Spa', icon: Scissors },
                  { id: 'restaurant', label: 'Restaurant', icon: Utensils },
                  { id: 'cafe', label: 'Cafe & Bakery', icon: Coffee },
                  { id: 'gym', label: 'Gym & Fitness', icon: Dumbbell },
                  { id: 'clinic', label: 'Clinic / Dental', icon: Stethoscope },
                  { id: 'tutor', label: 'Tutor / Academy', icon: GraduationCap },
                  { id: 'service', label: 'Repairs / Trades', icon: Wrench },
                  { id: 'retail', label: 'Retail Shop', icon: Store },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = category === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      id={`wizard-cat-select-${item.id}`}
                      onClick={() => setCategory(item.id)}
                      className={`flex items-center gap-2 rounded-xl border p-3 text-xs font-semibold transition text-left ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-sm'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className={`h-4 w-4 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  City / Location *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    id="wizard-city"
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Bandra West, Mumbai"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Full Street Address (for Google Maps)
                </label>
                <input
                  id="wizard-address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Shop 4, Hill Road, Bandra West"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Short Description / Tagline
              </label>
              <div className="relative">
                <FileText className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <textarea
                  id="wizard-description"
                  rows={3}
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="e.g. Premier hair coloring, bridal glam and relaxing spa treatments serving Bandra since 2018."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Step Actions */}
          <div className="mt-8 flex items-center justify-between pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={onCancel}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              id="wizard-step1-next"
              type="button"
              disabled={!businessName.trim() || !city.trim()}
              onClick={() => setStep(2)}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-indigo-200 hover:bg-indigo-700 disabled:opacity-40 transition"
            >
              Continue to Services
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: SERVICES */}
      {step === 2 && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
            <div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900">
                List Your Services & Pricing
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Clear pricing builds immediate trust with local customers browsing your site.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Currency:</span>
              <select
                id="wizard-currency-select"
                value={currencySymbol}
                onChange={(e) => setCurrencySymbol(e.target.value)}
                className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-bold text-slate-800"
              >
                <option value="₹">₹ (INR)</option>
                <option value="$">$ (USD)</option>
                <option value="€">€ (EUR)</option>
                <option value="£">£ (GBP)</option>
                <option value="AED ">AED</option>
              </select>
            </div>
          </div>

          <div className="space-y-3.5 mb-6">
            {services.map((srv, idx) => (
              <div
                key={srv.id}
                className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 sm:p-5 relative group"
              >
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-start">
                  <div className="sm:col-span-6">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Service Name #{idx + 1}
                    </label>
                    <input
                      type="text"
                      value={srv.name}
                      onChange={(e) => updateService(srv.id, 'name', e.target.value)}
                      placeholder="e.g. Signature Haircut & Blowdry"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Price</label>
                    <input
                      type="text"
                      value={srv.price}
                      onChange={(e) => updateService(srv.id, 'price', e.target.value)}
                      placeholder={`${currencySymbol}950`}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Duration / Unit</label>
                    <input
                      type="text"
                      value={srv.duration || ''}
                      onChange={(e) => updateService(srv.id, 'duration', e.target.value)}
                      placeholder="45 mins"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-10">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Short Description (AI will polish this)
                    </label>
                    <input
                      type="text"
                      value={srv.description}
                      onChange={(e) => updateService(srv.id, 'description', e.target.value)}
                      placeholder="e.g. Includes relaxing wash, customized cut, and blowout finish."
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-700 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2 flex items-center justify-end gap-2 pt-5">
                    <button
                      type="button"
                      onClick={() => updateService(srv.id, 'popular', !srv.popular)}
                      className={`text-xs px-2 py-1 rounded-md font-semibold transition ${
                        srv.popular
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-200/70 text-slate-500 hover:bg-slate-200'
                      }`}
                      title="Toggle Popular Badge"
                    >
                      {srv.popular ? '★ Popular' : 'Mark Popular'}
                    </button>
                    {services.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeService(srv.id)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            id="wizard-add-service-btn"
            type="button"
            onClick={addService}
            className="flex items-center gap-2 rounded-xl border border-dashed border-indigo-300 bg-indigo-50/50 px-4 py-2.5 text-xs font-bold text-indigo-700 hover:bg-indigo-50 transition"
          >
            <Plus className="h-4 w-4" />
            Add Another Service
          </button>

          {/* Step Actions */}
          <div className="mt-8 flex items-center justify-between pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <button
              id="wizard-step2-next"
              type="button"
              onClick={() => setStep(3)}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-indigo-200 hover:bg-indigo-700 transition"
            >
              Continue to Contact
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: CONTACT INFORMATION */}
      {step === 3 && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm animate-fadeIn">
          <div className="mb-6">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900">
              Contact & Business Hours
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Direct connection is essential. Enter your WhatsApp number where customers can message you directly.
            </p>
          </div>

          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  WhatsApp Contact Number *
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3.5 top-3.5 h-4 w-4 text-emerald-600" />
                  <input
                    id="wizard-whatsapp"
                    type="text"
                    required
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    placeholder="+91 98200 12345"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <p className="mt-1 text-[11px] text-slate-400">
                  Includes country code (e.g. +91 for India). Leads will chat with you here directly!
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Call Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-blue-600" />
                  <input
                    id="wizard-phone"
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+91 98200 12345"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Business Email (Optional)
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    id="wizard-email"
                    type="email"
                    value={businessEmail}
                    onChange={(e) => setBusinessEmail(e.target.value)}
                    placeholder="contact@mybusiness.com"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Opening Hours Summary *
                </label>
                <div className="relative">
                  <Clock className="absolute left-3.5 top-3.5 h-4 w-4 text-amber-600" />
                  <input
                    id="wizard-hours"
                    type="text"
                    value={generalHours}
                    onChange={(e) => setGeneralHours(e.target.value)}
                    placeholder="Mon - Sat: 9:30 AM - 8:30 PM (Sunday Open)"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Step Actions */}
          <div className="mt-8 flex items-center justify-between pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <button
              id="wizard-step3-next"
              type="button"
              disabled={!whatsappNumber.trim()}
              onClick={() => setStep(4)}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-indigo-200 hover:bg-indigo-700 disabled:opacity-40 transition"
            >
              Continue to Design
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: DESIGN PREFERENCE */}
      {step === 4 && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm animate-fadeIn">
          <div className="mb-6">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900">
              Choose Your Website Style
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Select the aesthetic that best represents your brand personality.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              {
                id: 'modern-minimal',
                name: 'Modern Minimal',
                desc: 'Clean lines, spacious layout, crisp typography, high readability.',
                color: 'from-slate-900 to-blue-900',
              },
              {
                id: 'warm-friendly',
                name: 'Warm & Friendly',
                desc: 'Earthy amber tones, welcoming atmosphere, cafe & bistro warmth.',
                color: 'from-amber-900 to-orange-800',
              },
              {
                id: 'elegant-luxury',
                name: 'Elegant Luxury',
                desc: 'Deep indigo & gold accents, premium aesthetics, salon & clinic prestige.',
                color: 'from-indigo-950 to-amber-700',
              },
              {
                id: 'vibrant-bold',
                name: 'Vibrant & Bold',
                desc: 'High energy teal & cyan, fitness gyms, active coaching, modern vibes.',
                color: 'from-teal-900 to-cyan-600',
              },
              {
                id: 'clean-corporate',
                name: 'Clean Professional',
                desc: 'Deep navy & royal blue, dependable corporate services and medical clinics.',
                color: 'from-slate-900 to-blue-700',
              },
            ].map((theme) => {
              const isSelected = stylePreference === theme.id;
              return (
                <div
                  key={theme.id}
                  id={`style-pref-${theme.id}`}
                  onClick={() => setStylePreference(theme.id as StylePreference)}
                  className={`cursor-pointer rounded-2xl border p-5 transition relative ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-600/30'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className={`h-10 w-full rounded-xl bg-gradient-to-r ${theme.color} mb-3`} />
                  <div className="flex items-center justify-between">
                    <h4 className="font-heading font-bold text-sm text-slate-900">{theme.name}</h4>
                    {isSelected && (
                      <div className="h-5 w-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">
                        <Check className="h-3 w-3" />
                      </div>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-slate-500 leading-relaxed">{theme.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Summary Preview Box */}
          <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-bold text-slate-700">{businessName}</span>
              <span className="text-slate-500"> · {city} · {services.length} services</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-700 font-semibold">
              <MessageSquare className="h-3.5 w-3.5" />
              <span>WhatsApp: {whatsappNumber}</span>
            </div>
          </div>

          {/* Step Actions */}
          <div className="mt-8 flex items-center justify-between pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <button
              id="wizard-generate-btn"
              type="button"
              onClick={handleStartGeneration}
              className="flex items-center gap-2.5 rounded-xl bg-indigo-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition"
            >
              <Sparkles className="h-4 w-4" />
              Generate My Website with AI
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: AI GENERATION IN PROGRESS & COMPLETION */}
      {step === 5 && (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-sm text-center animate-fadeIn">
          {isGenerating ? (
            <div className="max-w-md mx-auto space-y-6">
              <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-50 text-indigo-600">
                <Sparkles className="h-10 w-10 animate-spin" />
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-indigo-500" />
                </span>
              </div>

              <div>
                <h3 className="font-heading text-2xl font-bold text-slate-900">
                  Building {businessName}...
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-500">
                  Our AI is analyzing your local market and assembling a conversion-optimized website.
                </p>
              </div>

              {/* Phases visual stepper */}
              <div className="space-y-2.5 text-left border rounded-2xl p-4 border-slate-100 bg-slate-50/60 text-xs">
                {generationPhasesText.map((text, idx) => {
                  const isDone = generationPhase > idx;
                  const isCurrent = generationPhase === idx;
                  return (
                    <div
                      key={idx}
                      className={`flex items-center gap-2.5 transition-all ${
                        isDone
                          ? 'text-emerald-700 font-medium'
                          : isCurrent
                          ? 'text-indigo-600 font-bold'
                          : 'text-slate-400 opacity-50'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      ) : isCurrent ? (
                        <span className="h-4 w-4 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin shrink-0" />
                      ) : (
                        <span className="h-4 w-4 rounded-full border border-slate-300 shrink-0" />
                      )}
                      <span>{text}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : generationError ? (
            <div className="max-w-md mx-auto space-y-4">
              <div className="text-rose-600 font-bold text-lg">Generation Encountered an Issue</div>
              <p className="text-xs text-slate-600">{generationError}</p>
              <button
                onClick={handleStartGeneration}
                className="rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-sm"
              >
                Retry Generation
              </button>
            </div>
          ) : (
            /* After generation, show exact requirement:
               "Your website is ready!"
               Add buttons:
               "Preview"
               "Edit"
               "Regenerate"
               "Publish"
            */
            <div className="max-w-lg mx-auto space-y-6">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                <Check className="h-8 w-8 stroke-[3]" />
              </div>

              <div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                  Generation Successful
                </span>
                <h3 className="mt-3 font-heading text-3xl font-extrabold text-slate-900">
                  Your website is ready!
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  {businessName} has a complete, mobile-optimized website with services, contact triggers, and local SEO.
                </p>
              </div>

              {/* Action Buttons as requested */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  id="btn-ready-preview"
                  onClick={onPreview}
                  className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 px-4 text-sm font-bold text-white shadow-md shadow-indigo-200 hover:bg-indigo-700 transition active:scale-95"
                >
                  <Eye className="h-4 w-4" />
                  Preview
                </button>

                <button
                  id="btn-ready-edit"
                  onClick={onEdit}
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3.5 px-4 text-sm font-bold text-slate-700 hover:bg-slate-50 transition active:scale-95"
                >
                  <Palette className="h-4 w-4" />
                  Edit
                </button>

                <button
                  id="btn-ready-regenerate"
                  onClick={handleStartGeneration}
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 px-4 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  <RefreshCw className="h-4 w-4 text-indigo-600" />
                  Regenerate
                </button>

                <button
                  id="btn-ready-publish"
                  onClick={onPublish}
                  className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 px-4 text-xs font-bold text-white shadow-md shadow-emerald-200 hover:bg-emerald-700 transition active:scale-95"
                >
                  <Share2 className="h-4 w-4" />
                  Publish
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
