import { GoogleGenAI, Type } from '@google/genai';
import { BusinessInfo, WebsiteContent, ServiceItem, FaqItem } from '../src/types';

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Category photo presets (high quality Unsplash direct URLs for local business archetypes)
const CATEGORY_IMAGES: Record<string, { hero: string; about: string }> = {
  salon: {
    hero: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1400&q=80',
    about: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
  },
  restaurant: {
    hero: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=80',
    about: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
  },
  cafe: {
    hero: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1400&q=80',
    about: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=800&q=80',
  },
  gym: {
    hero: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1400&q=80',
    about: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
  },
  clinic: {
    hero: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1400&q=80',
    about: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
  },
  tutor: {
    hero: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1400&q=80',
    about: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=800&q=80',
  },
  retail: {
    hero: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1400&q=80',
    about: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80',
  },
  service: {
    hero: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1400&q=80',
    about: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
  },
  freelancer: {
    hero: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1400&q=80',
    about: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
  },
  other: {
    hero: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=80',
    about: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80',
  },
};

const THEME_PALETTES: Record<string, { primaryColor: string; accentColor: string }> = {
  'modern-minimal': { primaryColor: '#0f172a', accentColor: '#3b82f6' },
  'warm-friendly': { primaryColor: '#7c2d12', accentColor: '#ea580c' },
  'elegant-luxury': { primaryColor: '#1e1b4b', accentColor: '#d97706' },
  'vibrant-bold': { primaryColor: '#0f766e', accentColor: '#06b6d4' },
  'clean-corporate': { primaryColor: '#1e293b', accentColor: '#2563eb' },
};

export async function generateFullWebsiteWithAI(info: BusinessInfo): Promise<WebsiteContent> {
  const ai = getAiClient();
  const categoryKey = (info.category?.toLowerCase() || 'other') as keyof typeof CATEGORY_IMAGES;
  const imageAssets = CATEGORY_IMAGES[categoryKey] || CATEGORY_IMAGES.other;
  const themePalette = THEME_PALETTES[info.stylePreference] || THEME_PALETTES['modern-minimal'];

  if (ai) {
    try {
      const prompt = `You are a world-class conversion copywriter and web designer for local businesses.
Generate a complete, high-converting website content structure for this local business:

Business Name: ${info.businessName}
Category: ${info.category}
City/Location: ${info.city}
Physical Address: ${info.address || info.city}
Short Description: ${info.shortDescription || 'Quality local services with dedicated customer satisfaction.'}
Services entered: ${JSON.stringify(info.services || [])}
Phone: ${info.phoneNumber}
WhatsApp: ${info.whatsappNumber}
Style Preference: ${info.stylePreference}
Currency Symbol: ${info.currencySymbol || '₹'}

Please return a strictly formatted JSON object with:
1. hero: badge (e.g. "Top-Rated in [City]"), headline (punchy, benefit-driven), subheadline (descriptive and local-focused), primaryCta (e.g. "Book Appointment", "Order Now", "Chat on WhatsApp"), secondaryCta (e.g. "Explore Services", "View Menu", "Our Location")
2. about: title, subtitle, story (engaging 2-3 paragraph local business story highlighting expertise, customer care, and local pride), highlights (3 items with title and desc), yearsInBusiness (e.g. "8+ Years")
3. services: refined array of services with enticing names, persuasive 1-2 sentence descriptions, formatted realistic prices with currency symbol ${info.currencySymbol || '₹'}, duration (e.g. "45 mins", "1 hour", "Custom"), and popular boolean flag. Keep at least 4-6 services.
4. testimonials: 3 realistic, authentic customer reviews from locals in ${info.city} with full names, role/area, rating (5), and genuine enthusiastic comment.
5. faq: 5 industry-specific FAQs with clear, helpful answers answering common client concerns (e.g., parking, pricing, booking policy, guarantees, payment methods).
6. seo: metaTitle (e.g., "${info.businessName} | Best ${info.category} in ${info.city}"), metaDescription (150-160 chars optimized for local Google search), keywords (array of 6-8 local search keywords).
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              hero: {
                type: Type.OBJECT,
                properties: {
                  badge: { type: Type.STRING },
                  headline: { type: Type.STRING },
                  subheadline: { type: Type.STRING },
                  primaryCta: { type: Type.STRING },
                  secondaryCta: { type: Type.STRING },
                },
                required: ['badge', 'headline', 'subheadline', 'primaryCta', 'secondaryCta'],
              },
              about: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  subtitle: { type: Type.STRING },
                  story: { type: Type.STRING },
                  highlights: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        title: { type: Type.STRING },
                        desc: { type: Type.STRING },
                      },
                      required: ['title', 'desc'],
                    },
                  },
                  yearsInBusiness: { type: Type.STRING },
                },
                required: ['title', 'subtitle', 'story', 'highlights', 'yearsInBusiness'],
              },
              services: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    description: { type: Type.STRING },
                    price: { type: Type.STRING },
                    duration: { type: Type.STRING },
                    popular: { type: Type.BOOLEAN },
                  },
                  required: ['name', 'description', 'price'],
                },
              },
              testimonials: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    role: { type: Type.STRING },
                    rating: { type: Type.NUMBER },
                    comment: { type: Type.STRING },
                  },
                  required: ['name', 'role', 'rating', 'comment'],
                },
              },
              faq: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    question: { type: Type.STRING },
                    answer: { type: Type.STRING },
                  },
                  required: ['question', 'answer'],
                },
              },
              seo: {
                type: Type.OBJECT,
                properties: {
                  metaTitle: { type: Type.STRING },
                  metaDescription: { type: Type.STRING },
                  keywords: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: ['metaTitle', 'metaDescription', 'keywords'],
              },
            },
            required: ['hero', 'about', 'services', 'testimonials', 'faq', 'seo'],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');

      if (parsed.hero && parsed.about && parsed.services) {
        return assembleWebsiteContent(info, parsed, imageAssets, themePalette);
      }
    } catch (error) {
      console.warn('Gemini generation encountered an issue, falling back to smart local generation:', error);
    }
  }

  // High-craft fallback generator if API key is not configured or query fails
  return generateCraftedFallback(info, imageAssets, themePalette);
}

function assembleWebsiteContent(
  info: BusinessInfo,
  aiData: any,
  imageAssets: { hero: string; about: string },
  themePalette: { primaryColor: string; accentColor: string }
): WebsiteContent {
  const cleanPhone = (info.whatsappNumber || info.phoneNumber || '').replace(/[^0-9]/g, '');
  const presetMessage = encodeURIComponent(
    `Hello ${info.businessName}, I found your website and would like to inquire about your services!`
  );

  const services: ServiceItem[] = (aiData.services || []).map((s: any, idx: number) => ({
    id: `srv-${idx + 1}`,
    name: s.name,
    description: s.description,
    price: s.price.includes(info.currencySymbol) ? s.price : `${info.currencySymbol}${s.price}`,
    duration: s.duration || 'Standard Session',
    popular: Boolean(s.popular || idx === 0),
    category: info.category,
  }));

  const faqs: FaqItem[] = (aiData.faq || []).map((f: any, idx: number) => ({
    id: `faq-${idx + 1}`,
    question: f.question,
    answer: f.answer,
  }));

  return {
    hero: {
      badge: aiData.hero.badge || `★ #1 Rated in ${info.city}`,
      headline: aiData.hero.headline || `Exceptional ${info.category} Services in ${info.city}`,
      subheadline:
        aiData.hero.subheadline ||
        `${info.businessName} delivers unmatched quality and care right in the heart of ${info.city}.`,
      primaryCta: aiData.hero.primaryCta || 'Contact via WhatsApp',
      secondaryCta: aiData.hero.secondaryCta || 'Browse Services',
      coverImage: imageAssets.hero,
    },
    about: {
      title: aiData.about.title || `About ${info.businessName}`,
      subtitle: aiData.about.subtitle || `Trusted by thousands in ${info.city}`,
      story:
        aiData.about.story ||
        `Founded with a passion for excellence, ${info.businessName} has been serving ${info.city} with pride. We combine top-tier craftsmanship with friendly, personalized attention.`,
      highlights: aiData.about.highlights || [
        { title: 'Verified Quality', desc: 'Certified professionals and premium materials' },
        { title: 'Transparent Pricing', desc: 'No hidden fees or unexpected charges' },
        { title: 'Fast Response', desc: 'Quick turnaround and direct WhatsApp support' },
      ],
      yearsInBusiness: aiData.about.yearsInBusiness || '5+ Years',
      image: imageAssets.about,
    },
    services,
    schedule: info.openingHours?.schedule?.length
      ? info.openingHours.schedule
      : [
          { day: 'Monday - Friday', hours: '9:00 AM - 8:00 PM', isOpen: true },
          { day: 'Saturday', hours: '10:00 AM - 7:00 PM', isOpen: true },
          { day: 'Sunday', hours: '10:00 AM - 5:00 PM', isOpen: true },
        ],
    contact: {
      phone: info.phoneNumber || '+91 98765 43210',
      whatsapp: info.whatsappNumber || info.phoneNumber || '+91 98765 43210',
      whatsappMessagePreset: presetMessage,
      email: info.businessEmail || `contact@${info.businessName.toLowerCase().replace(/\s+/g, '')}.com`,
      address: info.address || `${info.city}, Center Market`,
      city: info.city,
      googleMapsQuery: `${encodeURIComponent(info.businessName + ' ' + info.address + ' ' + info.city)}`,
    },
    testimonials: (aiData.testimonials || []).map((t: any, idx: number) => ({
      id: `test-${idx + 1}`,
      name: t.name,
      role: t.role || `Resident, ${info.city}`,
      rating: Number(t.rating) || 5,
      comment: t.comment,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(t.name)}`,
    })),
    faq: faqs,
    seo: {
      metaTitle: aiData.seo.metaTitle || `${info.businessName} - Top ${info.category} in ${info.city}`,
      metaDescription:
        aiData.seo.metaDescription ||
        `Visit ${info.businessName} in ${info.city}. Exceptional ${info.category} services, expert staff, transparent pricing, and instant WhatsApp booking.`,
      keywords: aiData.seo.keywords || [
        info.businessName,
        `${info.category} in ${info.city}`,
        `best ${info.category}`,
        `${info.city} services`,
      ],
    },
    theme: {
      style: info.stylePreference,
      primaryColor: themePalette.primaryColor,
      accentColor: themePalette.accentColor,
      fontFamily: 'Outfit, Plus Jakarta Sans, sans-serif',
      borderRadius: 'rounded-2xl',
    },
  };
}

function generateCraftedFallback(
  info: BusinessInfo,
  imageAssets: { hero: string; about: string },
  themePalette: { primaryColor: string; accentColor: string }
): WebsiteContent {
  const sym = info.currencySymbol || '₹';
  const categoryTitle = info.category.charAt(0).toUpperCase() + info.category.slice(1);
  const cleanPhone = (info.whatsappNumber || info.phoneNumber || '').replace(/[^0-9]/g, '');
  const presetMessage = encodeURIComponent(
    `Hello ${info.businessName}, I saw your website and would like to inquire about your services!`
  );

  // Pre-craft tailored services based on common user services or business category
  let defaultServices: ServiceItem[] = [];
  if (info.services && info.services.length > 0) {
    defaultServices = info.services.map((s, i) => ({
      id: `srv-${i + 1}`,
      name: s.name,
      description: s.description || `Professional ${s.name.toLowerCase()} executed by our certified specialists with complete attention to detail.`,
      price: s.price.includes(sym) ? s.price : `${sym}${s.price || '499'}`,
      duration: s.duration || '45 mins',
      popular: i === 0 || i === 2,
      category: info.category,
    }));
  } else {
    // Generate intelligent defaults by category
    if (info.category === 'salon') {
      defaultServices = [
        { id: 'srv-1', name: 'Signature Haircut & Styling', description: 'Precision cut customized to your face shape, including scalp wash, conditioning, and blow-dry finish.', price: `${sym}650`, duration: '45 mins', popular: true },
        { id: 'srv-2', name: 'Organic Glow Facial', description: 'Deep cleansing, gentle exfoliation, nutrient mask, and facial massage for radiant, hydrated skin.', price: `${sym}1,200`, duration: '60 mins', popular: true },
        { id: 'srv-3', name: 'Keratin Smooth Therapy', description: 'Intense frizz-free straightening and restorative gloss treatment lasting up to 4 months.', price: `${sym}3,500`, duration: '90 mins' },
        { id: 'srv-4', name: 'Deluxe Spa Manicure & Pedicure', description: 'Exfoliating sea-salt scrub, cuticle care, relaxing massage, and high-shine protective polish.', price: `${sym}850`, duration: '50 mins' },
      ];
    } else if (info.category === 'restaurant' || info.category === 'cafe') {
      defaultServices = [
        { id: 'srv-1', name: 'Chef Special Platter', description: 'Our most-loved culinary signature prepared fresh daily with authentic regional spices and fresh herbs.', price: `${sym}420`, duration: 'Fresh Prep', popular: true },
        { id: 'srv-2', name: 'Artisanal Handcrafted Brews', description: 'Locally roasted single-origin beans brewed to perfection by our expert baristas.', price: `${sym}190`, duration: 'Instant', popular: true },
        { id: 'srv-3', name: 'Weekend Family Dining Feast', description: 'Generous multi-course meal designed for gatherings of 4-6 guests with appetisers, mains, and dessert.', price: `${sym}1,450`, duration: 'Table for 4' },
        { id: 'srv-4', name: 'Private Table Reservation', description: 'Reserved premium seating with custom dietary arrangements and priority service.', price: `${sym}500`, duration: 'Advance Booking' },
      ];
    } else if (info.category === 'gym') {
      defaultServices = [
        { id: 'srv-1', name: 'Monthly All-Access Membership', description: 'Unlimited access to strength floor, cardio deck, locker rooms, and certified floor coaches.', price: `${sym}1,800`, duration: '1 Month', popular: true },
        { id: 'srv-2', name: 'Personal Coaching (10 Sessions)', description: 'One-on-one goal tailored training with customized weekly nutrition and progressive overload tracking.', price: `${sym}6,500`, duration: '10 Sessions', popular: true },
        { id: 'srv-3', name: 'HIIT & Functional Fitness Batch', description: 'High energy group classes focusing on metabolic conditioning, endurance, and fat loss.', price: `${sym}2,200`, duration: 'Monthly' },
        { id: 'srv-4', name: 'Nutrition & Body Composition Scan', description: 'In-depth metabolic rate analysis, macro guidelines, and tailored dietary planning.', price: `${sym}950`, duration: '1 Session' },
      ];
    } else {
      defaultServices = [
        { id: 'srv-1', name: 'Comprehensive Consultation', description: 'In-depth assessment of your requirements with customized recommendations and transparent quotation.', price: `${sym}499`, duration: '30 mins', popular: true },
        { id: 'srv-2', name: 'Standard Service Package', description: 'Full execution covering diagnostics, top-tier tools, and guaranteed satisfaction with warranty.', price: `${sym}1,499`, duration: '2 Hours', popular: true },
        { id: 'srv-3', name: 'Express Priority Service', description: 'Same-day on-demand assistance delivered right to your doorstep or priority counter.', price: `${sym}2,199`, duration: 'Same Day' },
        { id: 'srv-4', name: 'Annual Care & Maintenance Plan', description: 'Regular scheduled inspections, priority bookings, and discounted emergency interventions.', price: `${sym}4,999`, duration: '1 Year' },
      ];
    }
  }

  const testimonials = [
    {
      id: 't-1',
      name: 'Aarav Sharma',
      role: `Verified Customer, ${info.city}`,
      rating: 5,
      comment: `The best ${info.category} in ${info.city}! Booking via WhatsApp took literally 30 seconds, and the service quality was genuinely exceptional.`,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aarav',
    },
    {
      id: 't-2',
      name: 'Priya Mukherjee',
      role: `Regular Client, ${info.city}`,
      rating: 5,
      comment: `Very professional, clean ambiance, and completely transparent prices. I recommend ${info.businessName} to all my family and friends!`,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
    },
    {
      id: 't-3',
      name: 'Rohan Gupta',
      role: `Local Business Owner, ${info.city}`,
      rating: 5,
      comment: `Consistently great experience every single visit. It is so convenient to see their service list and hours online before dropping by.`,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan',
    },
  ];

  const faqs: FaqItem[] = [
    {
      id: 'faq-1',
      question: `How do I book an appointment or place an order with ${info.businessName}?`,
      answer: `The fastest way is clicking our green "Book on WhatsApp" or "Call Us" button on this page. Our team typically replies within 5 to 10 minutes during working hours.`,
    },
    {
      id: 'faq-2',
      question: `What are your operating hours and location in ${info.city}?`,
      answer: `We are conveniently located at ${info.address || info.city}. We are open Monday through Saturday, with flexible morning and evening hours. Check our Opening Hours section below for exact daily schedules.`,
    },
    {
      id: 'faq-3',
      question: `What payment options do you accept?`,
      answer: `We accept all popular payment modes including UPI (Google Pay, PhonePe, Paytm), credit/debit cards, net banking, and cash.`,
    },
    {
      id: 'faq-4',
      question: `Can I reschedule or cancel my appointment?`,
      answer: `Yes! Simply message us on WhatsApp at least 2 hours prior to your slot, and our friendly team will gladly reschedule you at zero additional fee.`,
    },
    {
      id: 'faq-5',
      question: `Do you offer customized packages or group bookings?`,
      answer: `Absolutely. We offer tailored packages for celebrations, regular loyalty plans, and family appointments. Reach out directly on WhatsApp to get a custom quote.`,
    },
  ];

  return {
    hero: {
      badge: `★ Top-Rated ${categoryTitle} in ${info.city}`,
      headline: `Experience the Finest ${categoryTitle} Services in ${info.city}`,
      subheadline:
        info.shortDescription ||
        `Welcome to ${info.businessName}. We provide premier ${info.category} solutions designed with premium standards, dedicated care, and transparent pricing.`,
      primaryCta: 'Chat on WhatsApp',
      secondaryCta: 'View Services & Pricing',
      coverImage: imageAssets.hero,
    },
    about: {
      title: `Crafted with Passion in ${info.city}`,
      subtitle: `Your Trusted Neighborhood ${categoryTitle}`,
      story: `${info.businessName} was established to bring reliable, modern, and high-standard ${info.category} experiences to people across ${info.city}.\n\nOur certified team believes that every client deserves personalized attention without compromise. Whether you are visiting us for the first time or are one of our hundreds of loyal regulars, you will immediately feel the difference in our quality and commitment.`,
      highlights: [
        { title: 'Verified Expertise', desc: 'Over 5+ years of dedicated service in the local community' },
        { title: 'Instant WhatsApp Booking', desc: 'Direct, hassle-free communication with immediate confirmation' },
        { title: '100% Quality Assurance', desc: 'Only certified techniques, genuine materials, and hygienic practices' },
      ],
      yearsInBusiness: '5+ Years',
      image: imageAssets.about,
    },
    services: defaultServices,
    schedule: info.openingHours?.schedule?.length
      ? info.openingHours.schedule
      : [
          { day: 'Monday - Friday', hours: '9:30 AM - 8:30 PM', isOpen: true },
          { day: 'Saturday', hours: '9:30 AM - 9:00 PM', isOpen: true },
          { day: 'Sunday', hours: '10:00 AM - 6:00 PM', isOpen: true },
        ],
    contact: {
      phone: info.phoneNumber || '+91 98765 43210',
      whatsapp: info.whatsappNumber || info.phoneNumber || '+91 98765 43210',
      whatsappMessagePreset: presetMessage,
      email: info.businessEmail || `hello@${info.businessName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      address: info.address || `${info.city}, Main Commercial Hub`,
      city: info.city,
      googleMapsQuery: `${encodeURIComponent(info.businessName + ' ' + info.city)}`,
    },
    testimonials,
    faq: faqs,
    seo: {
      metaTitle: `${info.businessName} — Leading ${categoryTitle} in ${info.city}`,
      metaDescription: `Discover ${info.businessName} in ${info.city}. High-quality ${info.category} services, clear pricing, verified reviews, and instant WhatsApp contact.`,
      keywords: [
        info.businessName,
        `${info.category} in ${info.city}`,
        `best ${info.category} near me`,
        `${info.city} ${info.category} booking`,
      ],
    },
    theme: {
      style: info.stylePreference,
      primaryColor: themePalette.primaryColor,
      accentColor: themePalette.accentColor,
      fontFamily: 'Outfit, Plus Jakarta Sans, sans-serif',
      borderRadius: 'rounded-2xl',
    },
  };
}

export async function regenerateSectionWithAI(
  section: 'hero' | 'about' | 'services' | 'faq' | 'seo',
  info: BusinessInfo,
  currentContent: WebsiteContent,
  tone: string = 'professional and friendly'
): Promise<Partial<WebsiteContent>> {
  const ai = getAiClient();

  if (ai) {
    try {
      const prompt = `You are a web copywriter specializing in local businesses.
Regenerate ONLY the "${section}" section for the business "${info.businessName}" in "${info.city}" (${info.category}).
Desired tone: ${tone}.

Return valid JSON with the regenerated "${section}" object matching this structure:
${section === 'hero' ? '{"hero": {"badge": "...", "headline": "...", "subheadline": "...", "primaryCta": "...", "secondaryCta": "..."}}' : ''}
${section === 'about' ? '{"about": {"title": "...", "subtitle": "...", "story": "...", "highlights": [{"title": "...", "desc": "..."}, {"title": "...", "desc": "..."}, {"title": "...", "desc": "..."}], "yearsInBusiness": "..."}}' : ''}
${section === 'services' ? '{"services": [{"name": "...", "description": "...", "price": "...", "duration": "...", "popular": true}]}' : ''}
${section === 'faq' ? '{"faq": [{"question": "...", "answer": "..."}, {"question": "...", "answer": "..."}]}' : ''}
${section === 'seo' ? '{"seo": {"metaTitle": "...", "metaDescription": "...", "keywords": ["..."]}}' : ''}
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      if (parsed[section]) {
        return { [section]: parsed[section] };
      }
    } catch (err) {
      console.warn('Regeneration with Gemini failed, applying dynamic variation:', err);
    }
  }

  // Fallback dynamic variation
  if (section === 'hero') {
    return {
      hero: {
        ...currentContent.hero,
        badge: `★ Highly Recommended in ${info.city}`,
        headline: `Transforming ${info.category} Experiences in ${info.city}`,
        subheadline: `Discover how ${info.businessName} delivers tailored excellence, friendly expertise, and unmatched customer satisfaction every single day.`,
        primaryCta: 'Book Instantly on WhatsApp',
        secondaryCta: 'Explore Price List',
      },
    };
  } else if (section === 'about') {
    return {
      about: {
        ...currentContent.about,
        title: `The Story Behind ${info.businessName}`,
        subtitle: `Built on trust, community, and meticulous craft in ${info.city}`,
        story: `At ${info.businessName}, we hold ourselves to the highest benchmark of quality in ${info.city}. Our journey began with a simple vision: to make world-class ${info.category} services accessible, welcoming, and dependable for every neighbor.\n\nFrom the moment you connect with us, our focus is on understanding your unique requirements and delivering outcomes that exceed your expectations.`,
        highlights: [
          { title: 'Locally Owned & Operated', desc: 'Rooted deeply in the community of ' + info.city },
          { title: 'Personalized Care', desc: 'Customized solutions for every individual customer' },
          { title: 'Transparent Guarantee', desc: 'Clear honest pricing without hidden markups' },
        ],
      },
    };
  } else if (section === 'faq') {
    return {
      faq: [
        {
          id: 'faq-r1',
          question: `Why choose ${info.businessName} over other ${info.category} options in ${info.city}?`,
          answer: `We provide verified certified experts, quick WhatsApp direct contact, zero surprise fees, and a proven track record of happy local clients.`,
        },
        {
          id: 'faq-r2',
          question: `How do I receive a price estimate before booking?`,
          answer: `Our service list displays typical pricing, and you can also send us a quick photo or description on WhatsApp for an immediate free estimate.`,
        },
        {
          id: 'faq-r3',
          question: `Is there parking available near your location?`,
          answer: `Yes, convenient vehicle and bike parking is available right near our premises in ${info.city}.`,
        },
      ],
    };
  } else if (section === 'seo') {
    return {
      seo: {
        metaTitle: `Best ${info.category} in ${info.city} | ${info.businessName}`,
        metaDescription: `Looking for top-rated ${info.category} in ${info.city}? Visit ${info.businessName} for premium services, affordable rates, and direct WhatsApp booking.`,
        keywords: [
          `${info.category} ${info.city}`,
          `${info.businessName} reviews`,
          `top ${info.category} near me`,
          `affordable ${info.category} ${info.city}`,
        ],
      },
    };
  }

  return {};
}
