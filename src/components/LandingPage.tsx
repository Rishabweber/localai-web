import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Phone,
  MessageSquare,
  MapPin,
  Clock,
  Smartphone,
  Search,
  Zap,
  ShieldCheck,
  Star,
  ChevronDown,
  Globe,
  ExternalLink,
  Store,
  Scissors,
  Utensils,
  Dumbbell,
  Stethoscope,
  Wrench,
  Coffee,
  QrCode,
  Layers,
  HeartHandshake,
  TrendingUp,
  Code2,
  User,
} from 'lucide-react';
import { CATEGORY_PRESETS, CategoryPreset } from '../lib/presets';

interface LandingPageProps {
  onStartWizard: (preset?: CategoryPreset) => void;
  onExploreDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartWizard, onExploreDemo }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('salon');
  const [pricingCurrency, setPricingCurrency] = useState<'INR' | 'USD'>('INR');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const activePreset = CATEGORY_PRESETS.find((p) => p.id === selectedCategory) || CATEGORY_PRESETS[0];

  const faqs = [
    {
      q: 'Do I need any technical, coding, or design skills to use LocalAI Web?',
      a: 'None at all! You simply provide basic details like your business name, services, and city. Our AI automatically handles the copywriting, mobile layout, color schemes, SEO meta tags, and contact buttons.',
    },
    {
      q: 'How do customers contact me from the generated website?',
      a: 'Your website includes prominent, sticky "Chat on WhatsApp" and "Call Us" buttons. When a visitor taps WhatsApp, it opens a direct chat with your business containing a pre-filled service inquiry message.',
    },
    {
      q: 'Can I edit the text, prices, and services after AI generates the site?',
      a: 'Yes, 100%! You have full control. You can edit any headline, modify prices, add or remove services, tweak your business hours, or use AI to regenerate individual sections with one click.',
    },
    {
      q: 'Can I share the link with customers on Google Maps and Instagram?',
      a: 'Absolutely. Once you click "Publish", you get a clean, shareable website link and a ready-to-print QR Code you can put on your shop counter, billing desk, Google Business profile, or social media bio.',
    },
    {
      q: 'Does the website work smoothly on budget smartphones and slow mobile networks?',
      a: 'Yes. Every website is built mobile-first and optimized for extreme speed and low data usage, ensuring snappy loading even on 3G/4G connections anywhere in India and worldwide.',
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
        {/* Background Subtle Gradient Blobs */}
        <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[550px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-indigo-100/70 via-blue-50/60 to-purple-100/40 blur-3xl" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-white px-4 py-1.5 shadow-sm shadow-indigo-100 mb-8 animate-fadeIn">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-slate-800">
              #1 AI Website Builder for Small Businesses & Shops
            </span>
            <span className="text-indigo-600 font-bold text-xs">· Free to try</span>
          </div>

          {/* Hero Headline (Exact requirement from prompt) */}
          <h1 className="font-heading text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl md:text-7xl max-w-4xl mx-auto leading-[1.12]">
            Your Business Website.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700">
              Created by AI.
            </span>
          </h1>

          {/* Subheadline (Exact requirement from prompt) */}
          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Create a professional website for your local business in minutes — without coding.
          </p>

          {/* CTAs (Exact requirement from prompt) */}
          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              id="hero-primary-cta"
              onClick={() => onStartWizard()}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 rounded-2xl bg-indigo-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-indigo-200 hover:bg-indigo-700 active:scale-[0.98] transition"
            >
              <Sparkles className="h-5 w-5" />
              Create My Website
              <ArrowRight className="h-5 w-5" />
            </button>

            <button
              id="hero-secondary-cta"
              onClick={() => {
                document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-7 py-4 text-base font-semibold text-slate-700 shadow-sm hover:bg-slate-50 hover:text-slate-900 transition"
            >
              See How It Works
            </button>
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-500">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Direct WhatsApp Lead Chat
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Google Maps & Business Hours
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              100% Mobile-First Responsive
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Ready in under 2 minutes
            </div>
          </div>

          {/* Interactive Hero Preview Card */}
          <div className="mt-14 relative mx-auto max-w-5xl rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white p-2 sm:p-4 shadow-2xl shadow-slate-200/80">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-400" />
                <span className="h-3 w-3 rounded-full bg-amber-400" />
                <span className="h-3 w-3 rounded-full bg-emerald-400" />
                <span className="ml-2 font-mono text-[11px] text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md">
                  https://localai.web/site/bella-luxe-salon-mumbai
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline-flex items-center gap-1 text-emerald-600 font-medium">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" /> Published & Live
                </span>
                <button
                  onClick={onExploreDemo}
                  className="font-semibold text-indigo-600 hover:underline flex items-center gap-1"
                >
                  Explore Live Demo <ExternalLink className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* Teaser Website Mock inside Hero */}
            <div className="relative overflow-hidden rounded-xl bg-slate-900 text-white p-6 sm:p-10 text-left">
              <div className="max-w-xl space-y-4">
                <span className="inline-block rounded-full bg-amber-400/20 px-3 py-1 text-xs font-bold text-amber-300 border border-amber-400/30">
                  ★ Top-Rated Luxury Salon & Spa in Bandra, Mumbai
                </span>
                <h3 className="font-heading text-2xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                  Where Glamour Meets Relaxation in Mumbai
                </h3>
                <p className="text-sm sm:text-base text-slate-300">
                  Expert stylists, bespoke hair & skin treatments, and certified organic luxury care right on Hill Road.
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <span className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-emerald-900/40">
                    <MessageSquare className="h-4 w-4 fill-current" />
                    Book on WhatsApp
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs sm:text-sm font-medium text-white backdrop-blur">
                    <Phone className="h-4 w-4" />
                    +91 98200 12345
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs sm:text-sm font-medium text-white backdrop-blur">
                    <Clock className="h-4 w-4" />
                    Open Now (Until 9 PM)
                  </span>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-white/10 text-xs">
                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                  <p className="font-semibold text-white">Signature Haircut</p>
                  <p className="text-amber-400 font-bold mt-1">₹950</p>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                  <p className="font-semibold text-white">24K Gold Facial</p>
                  <p className="text-amber-400 font-bold mt-1">₹2,400</p>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                  <p className="font-semibold text-white">Keratin Smoothing</p>
                  <p className="text-amber-400 font-bold mt-1">₹4,999</p>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                  <p className="font-semibold text-white">Bridal Glamour</p>
                  <p className="text-amber-400 font-bold mt-1">₹12,500</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* On-Page Table of Contents & Quick Internal Navigation */}
      <nav aria-label="Quick Page Navigation" className="border-y border-slate-200/80 bg-white/95 backdrop-blur-md py-3 sticky top-16 z-30 shadow-xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs font-semibold text-slate-600 gap-4">
          <div className="flex items-center gap-1.5 text-indigo-700 font-bold shrink-0">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Explore:</span>
          </div>
          <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto py-1 text-slate-700 scrollbar-none">
            <a href="#what-it-does" className="hover:text-indigo-600 transition whitespace-nowrap">What It Does</a>
            <a href="#who-its-for" className="hover:text-indigo-600 transition whitespace-nowrap">Who It's For</a>
            <a href="#how-it-works" className="hover:text-indigo-600 transition whitespace-nowrap">How It Works</a>
            <a href="#features" className="hover:text-indigo-600 transition whitespace-nowrap">Main Features</a>
            <a href="#why-choose-us" className="hover:text-indigo-600 transition whitespace-nowrap">Why Choose Us</a>
            <a href="#pricing" className="hover:text-indigo-600 transition whitespace-nowrap">Pricing</a>
            <a href="#faq" className="hover:text-indigo-600 transition whitespace-nowrap">FAQ</a>
            <a href="#about-founder" className="hover:text-indigo-600 transition whitespace-nowrap">About Founder</a>
          </div>
          <button
            onClick={onExploreDemo}
            className="text-indigo-600 font-bold hover:underline whitespace-nowrap hidden lg:flex items-center gap-1 shrink-0 text-xs"
          >
            Live Demo Site <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </nav>

      {/* What LocalAI Web Does Section */}
      <section id="what-it-does" className="py-20 bg-white border-b border-slate-200/80 scroll-mt-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="rounded-full bg-indigo-50 px-3.5 py-1 text-xs font-bold text-indigo-700 uppercase tracking-wider">
              Website Builder Overview
            </span>
            <h2 className="mt-3 font-heading text-3xl sm:text-4xl font-extrabold text-slate-900">
              What LocalAI Web Does: AI-Powered Websites in Under 2 Minutes
            </h2>
            <p className="mt-4 text-slate-600 text-base sm:text-lg leading-relaxed">
              LocalAI Web is an intelligent website platform purpose-built for local brick-and-mortar shops, clinics, salons, cafes, and neighborhood service businesses. Instead of dealing with complicated WordPress installations, expensive design agencies, or confusing drag-and-drop builders, you simply provide five basic details about your business. In under two minutes, our AI generates a complete, mobile-first website equipped with persuasive copy, transparent price lists, 1-tap WhatsApp booking, direct calling, and Google Maps navigation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6 sm:p-7 space-y-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 font-bold">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="font-heading font-bold text-lg text-slate-900">Automated Business Copywriting & Menus</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                LocalAI Web creates compelling headlines, detailed service descriptions, authentic about-us stories, and transparent pricing cards tailored specifically to your city and industry.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6 sm:p-7 space-y-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 font-bold">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="font-heading font-bold text-lg text-slate-900">Direct WhatsApp &amp; 1-Tap Calling Leads</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Over 80% of local customers prefer messaging or calling directly. Every generated website features prominent 1-tap WhatsApp booking with pre-filled service inquiry messages.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6 sm:p-7 space-y-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-700 font-bold">
                <QrCode className="h-6 w-6" />
              </div>
              <h3 className="font-heading font-bold text-lg text-slate-900">Google Maps Navigation &amp; Counter QR Codes</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Help nearby customers reach your storefront with turn-by-turn Google Maps navigation, live business hours, and printable high-resolution QR codes for your billing counter.
              </p>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm text-slate-500">
            <span>Learn more:</span>
            <a href="#who-its-for" className="font-semibold text-indigo-600 hover:underline">Who It's For</a>
            <span>•</span>
            <a href="#how-it-works" className="font-semibold text-indigo-600 hover:underline">How It Works in 4 Steps</a>
            <span>•</span>
            <a href="#features" className="font-semibold text-indigo-600 hover:underline">Core Features</a>
            <span>•</span>
            <a href="#pricing" className="font-semibold text-indigo-600 hover:underline">Pricing Plans</a>
          </div>
        </div>
      </section>

      {/* Interactive Showcase Section (Salons, Restaurants, Cafes, Gyms, Clinics, Services) */}
      <section id="who-its-for" className="py-20 bg-slate-50 border-b border-slate-200/80 scroll-mt-28">
        <div id="showcase" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="rounded-full bg-indigo-50 px-3.5 py-1 text-xs font-bold text-indigo-700 uppercase tracking-wider">
              Tailored For Your Industry
            </span>
            <h2 className="mt-3 font-heading text-3xl sm:text-4xl font-extrabold text-slate-900">
              Who LocalAI Web Is Built For: Local Shops, Clinics, Salons &amp; Services
            </h2>
            <p className="mt-3 text-slate-600 text-base">
              LocalAI Web is engineered specifically for local businesses that serve customers in their city or neighborhood. Whether you run an appointment-based clinic or a busy high-street salon, our AI crafts layout, copy, and conversion triggers tailored to your exact industry.
            </p>
          </div>

          {/* Industry Audience Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs text-center">
              <div className="h-9 w-9 mx-auto mb-2 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Scissors className="h-5 w-5" />
              </div>
              <h3 className="text-xs font-bold text-slate-900">Salons &amp; Spas</h3>
              <p className="text-[11px] text-slate-500 mt-1">Hair, skin &amp; bridal beauty</p>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs text-center">
              <div className="h-9 w-9 mx-auto mb-2 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Stethoscope className="h-5 w-5" />
              </div>
              <h3 className="text-xs font-bold text-slate-900">Clinics &amp; Care</h3>
              <p className="text-[11px] text-slate-500 mt-1">Dental, physio &amp; wellness</p>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs text-center">
              <div className="h-9 w-9 mx-auto mb-2 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Coffee className="h-5 w-5" />
              </div>
              <h3 className="text-xs font-bold text-slate-900">Cafes &amp; Bakeries</h3>
              <p className="text-[11px] text-slate-500 mt-1">Menu &amp; table reservations</p>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs text-center">
              <div className="h-9 w-9 mx-auto mb-2 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <Utensils className="h-5 w-5" />
              </div>
              <h3 className="text-xs font-bold text-slate-900">Restaurants</h3>
              <p className="text-[11px] text-slate-500 mt-1">Bistros &amp; cloud kitchens</p>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs text-center">
              <div className="h-9 w-9 mx-auto mb-2 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Dumbbell className="h-5 w-5" />
              </div>
              <h3 className="text-xs font-bold text-slate-900">Fitness &amp; Gyms</h3>
              <p className="text-[11px] text-slate-500 mt-1">Yoga, crossfit &amp; training</p>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs text-center">
              <div className="h-9 w-9 mx-auto mb-2 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Wrench className="h-5 w-5" />
              </div>
              <h3 className="text-xs font-bold text-slate-900">Home &amp; Auto</h3>
              <p className="text-[11px] text-slate-500 mt-1">Repairs, electric &amp; plumbing</p>
            </div>
          </div>

          {/* Category Selector Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
            {CATEGORY_PRESETS.map((preset) => {
              const isSelected = selectedCategory === preset.id;
              return (
                <button
                  key={preset.id}
                  id={`showcase-cat-${preset.id}`}
                  onClick={() => setSelectedCategory(preset.id)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 scale-105'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
                  }`}
                >
                  {preset.id === 'salon' && <Scissors className="h-4 w-4" />}
                  {preset.id === 'restaurant' && <Utensils className="h-4 w-4" />}
                  {preset.id === 'cafe' && <Coffee className="h-4 w-4" />}
                  {preset.id === 'gym' && <Dumbbell className="h-4 w-4" />}
                  {preset.id === 'clinic' && <Stethoscope className="h-4 w-4" />}
                  {preset.id === 'service' && <Wrench className="h-4 w-4" />}
                  {preset.label}
                </button>
              );
            })}
          </div>

          {/* Dynamic Interactive Preview Card */}
          <div className="rounded-3xl border border-slate-200 bg-slate-50/50 p-4 sm:p-8 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Info */}
              <div className="lg:col-span-5 space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-800">
                  <Sparkles className="h-3.5 w-3.5" />
                  AI Preset: {activePreset.label}
                </div>
                <h3 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900">
                  {activePreset.defaultInfo.businessName}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {activePreset.defaultInfo.shortDescription}
                </p>

                <div className="space-y-2.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-indigo-600 shrink-0" />
                    <span>{activePreset.defaultInfo.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-indigo-600 shrink-0" />
                    <span>{activePreset.defaultInfo.phoneNumber}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-indigo-600 shrink-0" />
                    <span>Mon - Sat: 9:30 AM - 8:30 PM (Sunday Open)</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    id="create-with-preset-btn"
                    onClick={() => onStartWizard(activePreset)}
                    className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-indigo-200 hover:bg-indigo-700 transition"
                  >
                    Generate Website Like This
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Right Mock Card Preview */}
              <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-lg">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                      {activePreset.defaultInfo.businessName?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-slate-900">{activePreset.defaultInfo.businessName}</p>
                      <p className="text-[11px] text-slate-500">{activePreset.defaultInfo.city}</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold px-2.5 py-0.5">
                    ● Verified Business
                  </span>
                </div>

                {/* Simulated service items */}
                <div className="space-y-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Featured Services & Transparent Pricing
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {activePreset.defaultInfo.services?.map((srv) => (
                      <div
                        key={srv.id}
                        className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 hover:border-indigo-200 transition"
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-xs text-slate-900 truncate">{srv.name}</p>
                          <span className="font-bold text-xs text-indigo-600">{srv.price}</span>
                        </div>
                        <p className="mt-1 text-[11px] text-slate-500 line-clamp-1">{srv.description}</p>
                        <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                          <span>{srv.duration}</span>
                          {srv.popular && (
                            <span className="rounded bg-amber-100 px-1.5 py-0.5 font-semibold text-amber-800">
                              Popular
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Instant Actions Bar */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <MessageSquare className="h-4 w-4 text-emerald-600" />
                    <span>Instant WhatsApp connect enabled</span>
                  </div>
                  <span className="rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm">
                    Chat on WhatsApp
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="rounded-full bg-indigo-50 px-3.5 py-1 text-xs font-bold text-indigo-700 uppercase tracking-wider">
              Simple 4-Step Process
            </span>
            <h2 className="mt-3 font-heading text-3xl sm:text-4xl font-extrabold text-slate-900">
              How It Works: 4 Simple Steps to Get Your Business Online
            </h2>
            <p className="mt-3 text-slate-600 text-base">
              No technical setup, no design headaches. Go from zero to a live, lead-generating website in under two minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 font-bold text-lg mb-4">
                1
              </div>
              <h3 className="font-heading font-bold text-base text-slate-900 mb-2">Tell Us Your Business</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Enter your business name, city, services offered, operating hours, and WhatsApp contact number.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 font-bold text-lg mb-4">
                2
              </div>
              <h3 className="font-heading font-bold text-base text-slate-900 mb-2">AI Builds Your Site</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Our AI writes compelling headlines, service descriptions, an authentic About story, tailored FAQs, and SEO tags.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600 font-bold text-lg mb-4">
                3
              </div>
              <h3 className="font-heading font-bold text-base text-slate-900 mb-2">Preview &amp; Fine-tune</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Review your live interactive preview on desktop or mobile. Edit text directly or let AI regenerate any section.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 font-bold text-lg mb-4">
                4
              </div>
              <h3 className="font-heading font-bold text-base text-slate-900 mb-2">Publish &amp; Get Leads</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Get an instant shareable link and custom QR code. Customers tap WhatsApp to book services directly!
              </p>
            </div>
          </div>

          <div className="mt-12 text-center flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm text-slate-500">
            <span>Next steps:</span>
            <button
              onClick={() => onStartWizard()}
              className="font-bold text-indigo-600 hover:underline flex items-center gap-1"
            >
              Start in 2 Minutes <ArrowRight className="h-3.5 w-3.5" />
            </button>
            <span>•</span>
            <a href="#why-choose-us" className="font-semibold text-indigo-600 hover:underline">Why Choose LocalAI Web</a>
            <span>•</span>
            <a href="#pricing" className="font-semibold text-indigo-600 hover:underline">View Pricing Plans</a>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-white border-y border-slate-200/80 scroll-mt-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="rounded-full bg-indigo-50 px-3.5 py-1 text-xs font-bold text-indigo-700 uppercase tracking-wider">
              Everything Included
            </span>
            <h2 className="mt-3 font-heading text-3xl sm:text-4xl font-extrabold text-slate-900">
              Core Features: Engineered for Local Customer Inquiries &amp; Calls
            </h2>
            <p className="mt-3 text-slate-600 text-base">
              Traditional site builders are cluttered with bloated templates. LocalAI Web focuses strictly on what brings paying customers through your door.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <MessageSquare className="h-5 w-5" />
              </div>
              <h3 className="font-heading font-bold text-lg text-slate-900">Direct WhatsApp Booking</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Over 80% of local customers prefer messaging. One tap opens WhatsApp with a pre-filled service inquiry message.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <Phone className="h-5 w-5" />
              </div>
              <h3 className="font-heading font-bold text-lg text-slate-900">1-Tap Direct Calling</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Prominent phone trigger for urgent client requests, reservations, and immediate doorstep service inquiries.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
                <MapPin className="h-5 w-5" />
              </div>
              <h3 className="font-heading font-bold text-lg text-slate-900">Google Maps &amp; Directions</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Automatic navigation coordinates and map integration so nearby clients find your shop or clinic effortlessly.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                <Clock className="h-5 w-5" />
              </div>
              <h3 className="font-heading font-bold text-lg text-slate-900">Real-Time Business Hours</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Smart "Open Now" or "Closed" badge based on the current time so clients know exactly when you are available.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
                <Search className="h-5 w-5" />
              </div>
              <h3 className="font-heading font-bold text-lg text-slate-900">AI Local SEO Optimization</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Automated meta titles, local keywords, and description tags formatted to rank in Google searches for your city.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
                <Smartphone className="h-5 w-5" />
              </div>
              <h3 className="font-heading font-bold text-lg text-slate-900">Android &amp; iPhone Optimized</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Sticky bottom action bar engineered for the thumb zone on all mobile browsers and social media in-app webviews.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits for Local Businesses */}
      <section id="why-choose-us" className="py-20 bg-slate-900 text-white scroll-mt-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="rounded-full bg-indigo-500/20 px-3.5 py-1 text-xs font-bold text-indigo-300 border border-indigo-500/30">
                Why Local Businesses Love LocalAI Web
              </span>
              <h2 className="mt-4 font-heading text-3xl sm:text-5xl font-extrabold leading-tight">
                Why Choose LocalAI Web: Agency Results Without the Cost or Delay
              </h2>
              <p className="mt-4 text-slate-300 text-base sm:text-lg leading-relaxed">
                When someone in your area searches for a salon, dentist, mechanic, or cafe, having an authentic website with clear pricing and a WhatsApp button makes them choose you immediately.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 mt-0.5">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-white">Save ₹25,000+ ($300+) on Web Designers</p>
                    <p className="text-xs text-slate-400">Get agency-grade results in 2 minutes without waiting weeks.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 mt-0.5">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-white">Printable QR Code for Your Shop Counter</p>
                    <p className="text-xs text-slate-400">Let walk-in customers scan and bookmark your full price list and services.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 mt-0.5">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-white">Easy 1-Click Price & Service Updates</p>
                    <p className="text-xs text-slate-400">Change services or festive seasonal offers right from your phone anytime.</p>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <button
                  id="benefits-cta-create"
                  onClick={() => onStartWizard()}
                  className="inline-flex items-center gap-2 rounded-2xl bg-indigo-500 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-600 transition"
                >
                  Create Your Business Website Now
                  <ArrowRight className="h-4 w-4" />
                </button>
                <a
                  href="#pricing"
                  className="text-xs font-semibold text-indigo-300 hover:text-white underline transition"
                >
                  Explore transparent pricing plans →
                </a>
              </div>
            </div>

            {/* Visual Comparison Card */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur">
              <h3 className="font-heading font-bold text-lg text-white mb-6 flex items-center justify-between">
                <span>Agency vs LocalAI Web</span>
                <span className="text-xs font-normal text-slate-400">Head-to-head</span>
              </h3>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="grid grid-cols-2 gap-4 pb-4 border-b border-white/10">
                  <div>
                    <p className="text-slate-400">Traditional Agency / Freelancer</p>
                    <p className="text-rose-400 font-semibold mt-1">₹25,000 - ₹50,000</p>
                    <p className="text-slate-500 text-xs mt-0.5">Takes 2 to 4 weeks</p>
                  </div>
                  <div className="bg-indigo-950/60 p-3 rounded-xl border border-indigo-500/30">
                    <p className="text-indigo-300 font-bold">LocalAI Web</p>
                    <p className="text-emerald-400 font-extrabold mt-1">Free to Start</p>
                    <p className="text-indigo-200 text-xs mt-0.5">Ready in 2 minutes</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pb-4 border-b border-white/10">
                  <div className="text-slate-400">
                    <p>Complex WordPress dashboards & hosting maintenance bills</p>
                  </div>
                  <div className="text-indigo-200 font-medium">
                    <p>Zero hosting fees, fully managed cloud speed, mobile-first</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-slate-400">
                    <p>Hard to edit prices or change menu on phone</p>
                  </div>
                  <div className="text-indigo-200 font-medium">
                    <p>Instant phone-friendly editor & AI regenerator</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white scroll-mt-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="rounded-full bg-indigo-50 px-3.5 py-1 text-xs font-bold text-indigo-700 uppercase tracking-wider">
              Transparent Pricing
            </span>
            <h2 className="mt-3 font-heading text-3xl sm:text-4xl font-extrabold text-slate-900">
              Transparent Pricing: Simple Plans for Every Local Shop &amp; Clinic
            </h2>
            <p className="mt-3 text-slate-600 text-base">
              Start completely free. Upgrade only when your business expands.
            </p>

            {/* Currency Switcher */}
            <div className="mt-6 inline-flex items-center rounded-xl bg-slate-100 p-1">
              <button
                id="pricing-curr-inr"
                onClick={() => setPricingCurrency('INR')}
                className={`rounded-lg px-4 py-1.5 text-xs font-bold transition ${
                  pricingCurrency === 'INR' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
                }`}
              >
                ₹ INR (India)
              </button>
              <button
                id="pricing-curr-usd"
                onClick={() => setPricingCurrency('USD')}
                className={`rounded-lg px-4 py-1.5 text-xs font-bold transition ${
                  pricingCurrency === 'USD' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
                }`}
              >
                $ USD (Global)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Starter */}
            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Starter</span>
                <h3 className="font-heading text-2xl font-bold text-slate-900 mt-1">Free Forever</h3>
                <p className="text-xs text-slate-500 mt-2">Perfect to get your shop or clinic online today.</p>

                <div className="mt-6 mb-6">
                  <span className="text-4xl font-extrabold text-slate-900">
                    {pricingCurrency === 'INR' ? '₹0' : '$0'}
                  </span>
                  <span className="text-xs text-slate-500"> / free forever</span>
                </div>

                <ul className="space-y-3 text-xs sm:text-sm text-slate-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    1 Complete AI Business Website
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    WhatsApp & Call Contact Buttons
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    Shareable Website Link & QR Code
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    Google Maps & Business Hours
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    Full Content & Section Editor
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                <button
                  id="pricing-plan-starter-btn"
                  onClick={() => onStartWizard()}
                  className="w-full rounded-xl border border-slate-200 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 transition"
                >
                  Create Free Website
                </button>
              </div>
            </div>

            {/* Pro Plan (Featured) */}
            <div className="relative rounded-3xl border-2 border-indigo-600 bg-white p-7 shadow-xl shadow-indigo-100 flex flex-col justify-between scale-105">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-4 py-0.5 text-[11px] font-bold text-white uppercase tracking-wider">
                Most Popular
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Business Pro</span>
                <h3 className="font-heading text-2xl font-bold text-slate-900 mt-1">Growth & Leads</h3>
                <p className="text-xs text-slate-500 mt-2">For established salons, cafes, clinics, and service pros.</p>

                <div className="mt-6 mb-6">
                  <span className="text-4xl font-extrabold text-slate-900">
                    {pricingCurrency === 'INR' ? '₹499' : '$9'}
                  </span>
                  <span className="text-xs text-slate-500"> / month</span>
                </div>

                <ul className="space-y-3 text-xs sm:text-sm text-slate-600">
                  <li className="flex items-center gap-2 font-medium text-slate-900">
                    <CheckCircle2 className="h-4 w-4 text-indigo-600" />
                    Everything in Free, plus:
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-indigo-600" />
                    Unlimited AI Section Regenerations
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-indigo-600" />
                    Customer Inquiry / Booking Lead Manager
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-indigo-600" />
                    Remove "LocalAI Web" Badge
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-indigo-600" />
                    High-Res Vector QR Code Download
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                <button
                  id="pricing-plan-pro-btn"
                  onClick={() => onStartWizard()}
                  className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white shadow-md shadow-indigo-200 hover:bg-indigo-700 transition"
                >
                  Start Pro Trial
                </button>
              </div>
            </div>

            {/* Multiple Locations */}
            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Multi-Shop</span>
                <h3 className="font-heading text-2xl font-bold text-slate-900 mt-1">Multi-Outlet</h3>
                <p className="text-xs text-slate-500 mt-2">For business chains, multi-branch shops, or agencies.</p>

                <div className="mt-6 mb-6">
                  <span className="text-4xl font-extrabold text-slate-900">
                    {pricingCurrency === 'INR' ? '₹1,499' : '$29'}
                  </span>
                  <span className="text-xs text-slate-500"> / month</span>
                </div>

                <ul className="space-y-3 text-xs sm:text-sm text-slate-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    Up to 10 Business Websites
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    Multi-location management dashboard
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    Priority Gemini AI processing
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    Dedicated WhatsApp support
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                <button
                  id="pricing-plan-multi-btn"
                  onClick={() => onStartWizard()}
                  className="w-full rounded-xl border border-slate-200 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 transition"
                >
                  Get Multi-Shop
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-slate-50 border-t border-slate-200/80 scroll-mt-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="rounded-full bg-indigo-50 px-3.5 py-1 text-xs font-bold text-indigo-700 uppercase tracking-wider">
              Common Questions
            </span>
            <h2 className="mt-3 font-heading text-3xl sm:text-4xl font-extrabold text-slate-900">
              Frequently Asked Questions About Local Business Websites
            </h2>
            <p className="mt-3 text-slate-600 text-base">
              Everything you need to know about getting your local business online with LocalAI Web.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  id={`faq-item-${idx}`}
                  className="rounded-2xl border border-slate-200 bg-white overflow-hidden transition"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between p-5 text-left font-heading font-bold text-sm sm:text-base text-slate-900 hover:text-indigo-600 transition"
                  >
                    <span>{item.q}</span>
                    <ChevronDown
                      className={`h-5 w-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-indigo-600' : ''}`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Founder Section */}
      <section id="about-founder" className="py-20 bg-white border-t border-slate-200/80 scroll-mt-28">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="rounded-full bg-indigo-50 px-3.5 py-1 text-xs font-bold text-indigo-700 uppercase tracking-wider">
              Leadership &amp; Vision
            </span>
            <h2 className="mt-3 font-heading text-3xl sm:text-4xl font-extrabold text-slate-900">
              About the Founder
            </h2>
            <p className="mt-3 text-slate-600 text-base">
              The driving vision and engineering behind LocalAI Web — purpose-built to bring neighborhood storefronts, clinics, and local services online.
            </p>
          </div>

          <div className="relative rounded-3xl border border-slate-200/90 bg-gradient-to-b from-slate-50/70 to-white p-6 sm:p-10 shadow-sm">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              {/* Founder Avatar / Badge */}
              <div className="flex flex-col items-center shrink-0">
                <div className="relative flex h-28 w-28 sm:h-32 sm:w-32 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-indigo-800 text-white shadow-lg shadow-indigo-200 ring-4 ring-white">
                  <span className="font-heading text-3xl sm:text-4xl font-black tracking-tight">RK</span>
                  <div className="absolute -bottom-2.5 -right-2.5 flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white shadow-md border-2 border-white">
                    <Code2 className="h-4 w-4 text-indigo-400" />
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200/70">
                    <CheckCircle2 className="h-3 w-3" /> Founder &amp; Architect
                  </span>
                </div>
              </div>

              {/* Founder Details */}
              <div className="flex-1 space-y-4 text-center md:text-left">
                <div>
                  <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900">
                    Rishab Kumar
                  </h3>
                  <p className="text-sm font-medium text-indigo-600 mt-0.5">
                    Coder, Web Developer &amp; Digital Entrepreneur
                  </p>
                </div>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  Rishab Kumar is a coder, web developer, and digital entrepreneur with 4+ years of software engineering experience. He created LocalAI Web with a focused mission: to eliminate the complex technical and financial barriers that keep neighborhood retail, beauty salons, healthcare clinics, and service professionals from having an authoritative, search-optimized web presence.
                </p>

                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Through intelligent prompt engines and lightweight mobile architectures, LocalAI Web enables local business owners to generate high-converting, mobile-first websites in minutes with seamless WhatsApp ordering and direct Google Maps navigation.
                </p>

                {/* Highlights / Badges */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1">
                  <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700">
                    4+ Years Dev Experience
                  </span>
                  <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700">
                    Full-Stack Web Engineering
                  </span>
                  <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700">
                    AI &amp; Local Business Technology
                  </span>
                </div>

                {/* External Link Action */}
                <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
                  <a
                    id="founder-portfolio-link"
                    href="https://rishab.ai.studio/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-indigo-200 hover:bg-indigo-700 active:scale-[0.98] transition"
                  >
                    <span>View Founder Biography &amp; Profile</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>

                  <a
                    href="https://rishab.ai.studio/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-slate-500 hover:text-indigo-600 transition flex items-center gap-1"
                  >
                    <Globe className="h-3.5 w-3.5 text-slate-400" />
                    <span>rishab.ai.studio</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="py-20 bg-gradient-to-br from-indigo-700 via-indigo-600 to-blue-700 text-white relative overflow-hidden">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="font-heading text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Ready to Get More Local Customers for Your Business?
          </h2>
          <p className="mt-4 text-base sm:text-xl text-indigo-100 max-w-2xl mx-auto">
            Join thousands of salons, restaurants, clinics, and local services who created their websites in minutes.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              id="final-banner-create-btn"
              onClick={() => onStartWizard()}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 text-base font-bold text-indigo-700 shadow-xl shadow-indigo-900/30 hover:bg-slate-100 active:scale-95 transition"
            >
              <Sparkles className="h-5 w-5 text-indigo-600" />
              Create My Website Free
              <ArrowRight className="h-5 w-5" />
            </button>
            <button
              id="final-banner-demo-btn"
              onClick={onExploreDemo}
              className="w-full sm:w-auto rounded-2xl border border-white/30 bg-white/10 px-7 py-4 text-base font-semibold text-white hover:bg-white/20 transition"
            >
              Explore Live Demo Site
            </button>
          </div>
        </div>
      </section>

      {/* Semantic Footer with Rich Internal Links */}
      <footer className="border-t border-slate-200 bg-slate-50/70 pt-16 pb-12 text-slate-600 text-xs sm:text-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-200">
            {/* Column 1: Brand & Info */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2.5">
                <img
                  id="footer-official-logo"
                  src="/logo-horizontal.svg"
                  alt="LocalWeb AI Studio"
                  className="h-8 sm:h-9 w-auto object-contain"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
              </div>
              <p className="text-xs sm:text-sm text-slate-600 max-w-sm leading-relaxed">
                The fastest, easiest AI-powered website builder designed exclusively for neighborhood shops, healthcare clinics, beauty salons, and local services.
              </p>
              <div className="pt-2 flex items-center gap-3 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                  <CheckCircle2 className="h-3.5 w-3.5" /> 100% Mobile Ready
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                  <CheckCircle2 className="h-3.5 w-3.5" /> 1-Tap WhatsApp
                </span>
              </div>
            </div>

            {/* Column 2: Solutions / Who It's For */}
            <div>
              <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-900 mb-4">
                Solutions
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-600">
                <li>
                  <a href="#who-its-for" className="hover:text-indigo-600 transition">Salons &amp; Beauty</a>
                </li>
                <li>
                  <a href="#who-its-for" className="hover:text-indigo-600 transition">Clinics &amp; Care</a>
                </li>
                <li>
                  <a href="#who-its-for" className="hover:text-indigo-600 transition">Cafes &amp; Bakeries</a>
                </li>
                <li>
                  <a href="#who-its-for" className="hover:text-indigo-600 transition">Restaurants</a>
                </li>
                <li>
                  <a href="#who-its-for" className="hover:text-indigo-600 transition">Fitness &amp; Gyms</a>
                </li>
                <li>
                  <a href="#who-its-for" className="hover:text-indigo-600 transition">Home &amp; Repair</a>
                </li>
              </ul>
            </div>

            {/* Column 3: Platform Sections */}
            <div>
              <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-900 mb-4">
                Platform
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-600">
                <li>
                  <a href="#what-it-does" className="hover:text-indigo-600 transition">What It Does</a>
                </li>
                <li>
                  <a href="#who-its-for" className="hover:text-indigo-600 transition">Who It's For</a>
                </li>
                <li>
                  <a href="#how-it-works" className="hover:text-indigo-600 transition">How It Works</a>
                </li>
                <li>
                  <a href="#features" className="hover:text-indigo-600 transition">Main Features</a>
                </li>
                <li>
                  <a href="#why-choose-us" className="hover:text-indigo-600 transition">Why Choose Us</a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-indigo-600 transition">Pricing Plans</a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-indigo-600 transition">Frequently Asked</a>
                </li>
                <li>
                  <a href="#about-founder" className="hover:text-indigo-600 transition">About Founder</a>
                </li>
              </ul>
            </div>

            {/* Column 4: Resources & Links */}
            <div>
              <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-900 mb-4">
                Resources
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-600">
                <li>
                  <a
                    href="/site/bella-luxe-salon-mumbai"
                    onClick={(e) => {
                      e.preventDefault();
                      onExploreDemo();
                    }}
                    className="text-indigo-600 font-semibold hover:underline flex items-center gap-1"
                  >
                    Live Sample Site <ArrowRight className="h-3 w-3" />
                  </a>
                </li>
                <li>
                  <button
                    onClick={() => onStartWizard()}
                    className="hover:text-indigo-600 transition font-medium"
                  >
                    Start AI Wizard
                  </button>
                </li>
                <li>
                  <a
                    href="https://rishab.ai.studio/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 font-semibold hover:underline flex items-center gap-1"
                  >
                    Founder Portfolio <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
                <li>
                  <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 transition">
                    XML Sitemap
                  </a>
                </li>
                <li>
                  <a href="/robots.txt" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 transition">
                    robots.txt
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>
              © {new Date().getFullYear()} LocalAI Web. Helping local businesses build websites with AI worldwide.
            </p>
            <p className="text-slate-400">
              Canonical: <a href="https://localweb.ai.studio/" className="hover:underline">https://localweb.ai.studio/</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
