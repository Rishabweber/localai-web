import { BusinessInfo } from '../types';

export interface CategoryPreset {
  id: string;
  label: string;
  iconName: string;
  defaultInfo: Partial<BusinessInfo>;
}

export const CATEGORY_PRESETS: CategoryPreset[] = [
  {
    id: 'salon',
    label: 'Beauty Salon & Spa',
    iconName: 'Sparkles',
    defaultInfo: {
      category: 'salon',
      businessName: 'Glow Aura Salon & Spa',
      city: 'Indiranagar, Bengaluru',
      address: '100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru 560038',
      shortDescription: 'Luxury hair styling, bridal makeup, organic facials, and rejuvenating massage therapies in Bengaluru.',
      phoneNumber: '+91 98450 11223',
      whatsappNumber: '+91 98450 11223',
      businessEmail: 'contact@glowaurasalon.com',
      stylePreference: 'elegant-luxury',
      currencySymbol: '₹',
      services: [
        { id: '1', name: 'Signature Haircut & Styling', description: 'Consultation, scalp wash, personalized cut, and blowout.', price: '₹799', duration: '45 mins', popular: true, category: 'salon' },
        { id: '2', name: 'Hydra Glow Facial', description: 'Deep pore extraction, moisture infusion, and antioxidant mask.', price: '₹1,999', duration: '60 mins', popular: true, category: 'salon' },
        { id: '3', name: 'Keratin Frizz Control', description: 'Long-lasting hair smoothening with protein repair.', price: '₹3,999', duration: '90 mins', popular: false, category: 'salon' },
        { id: '4', name: 'Bridal Makeover Package', description: 'HD makeup, hairstyling, saree draping, and pre-bridal consultation.', price: '₹14,999', duration: '180 mins', popular: true, category: 'salon' },
      ],
    },
  },
  {
    id: 'restaurant',
    label: 'Restaurant & Bistro',
    iconName: 'Utensils',
    defaultInfo: {
      category: 'restaurant',
      businessName: 'Dawat Heritage Bistro',
      city: 'Connaught Place, New Delhi',
      address: 'Block M, Inner Circle, Connaught Place, New Delhi 110001',
      shortDescription: 'Authentic Mughlai and North Indian cuisine with artisanal clay oven breads and slow-cooked biryanis.',
      phoneNumber: '+91 98110 33445',
      whatsappNumber: '+91 98110 33445',
      businessEmail: 'reserve@dawatheritage.com',
      stylePreference: 'warm-friendly',
      currencySymbol: '₹',
      services: [
        { id: '1', name: 'Dum Gosht Awadhi Biryani', description: 'Slow cooked fragrant basmati rice with tender spiced mutton and saffron.', price: '₹550', duration: 'Fresh Batch', popular: true, category: 'restaurant' },
        { id: '2', name: 'Old Delhi Butter Chicken', description: 'Tandoori chicken simmered in a velvety tomato, butter, and cashew gravy.', price: '₹480', duration: 'Classic Dish', popular: true, category: 'restaurant' },
        { id: '3', name: 'Dal Dawat Slow Simmered', description: 'Black lentils slow cooked overnight on charcoal with churned white butter.', price: '₹380', duration: 'Signature', popular: false, category: 'restaurant' },
        { id: '4', name: 'Royal Family Feast Platter', description: 'Chef curated multi-course dining experience for 4 guests.', price: '₹1,850', duration: 'Table for 4', popular: true, category: 'restaurant' },
      ],
    },
  },
  {
    id: 'cafe',
    label: 'Artisan Cafe & Bakery',
    iconName: 'Coffee',
    defaultInfo: {
      category: 'cafe',
      businessName: 'Roast & Bean Cafe',
      city: 'Koregaon Park, Pune',
      address: 'Lane 7, Koregaon Park, Pune, MH 411001',
      shortDescription: 'Specialty pour-over coffee, fresh sourdough bakes, matcha lattes, and cozy workspace ambiance.',
      phoneNumber: '+91 99220 55667',
      whatsappNumber: '+91 99220 55667',
      businessEmail: 'hello@roastandbean.com',
      stylePreference: 'warm-friendly',
      currencySymbol: '₹',
      services: [
        { id: '1', name: 'Single Origin Manual Brew', description: 'Aeropress or V60 pour over with Chikmagalur estate beans.', price: '₹220', duration: 'Fresh Brew', popular: true, category: 'cafe' },
        { id: '2', name: 'Sourdough Avocado Toast', description: 'Poached free-range eggs, feta crumble, and chili flakes on artisanal bread.', price: '₹320', duration: 'All Day', popular: true, category: 'cafe' },
        { id: '3', name: 'Iced Spanish Vanilla Latte', description: 'Double espresso pulled over sweet condensed milk and chilled whole milk.', price: '₹240', duration: 'Chilled', popular: true, category: 'cafe' },
        { id: '4', name: 'Belgian Dark Chocolate Croissant', description: 'Flaky 72-layer butter pastry with molten Valrhona chocolate core.', price: '₹180', duration: 'Fresh Baked', popular: false, category: 'cafe' },
      ],
    },
  },
  {
    id: 'gym',
    label: 'Fitness Gym & Crossfit',
    iconName: 'Dumbbell',
    defaultInfo: {
      category: 'gym',
      businessName: 'IronPulse Fitness & Performance',
      city: 'Jubilee Hills, Hyderabad',
      address: 'Road No. 36, Jubilee Hills, Hyderabad, TS 500033',
      shortDescription: 'State-of-the-art strength training, cardio turf, Olympic lifting, and certified one-on-one personal coaching.',
      phoneNumber: '+91 99880 77889',
      whatsappNumber: '+91 99880 77889',
      businessEmail: 'join@ironpulsefitness.com',
      stylePreference: 'vibrant-bold',
      currencySymbol: '₹',
      services: [
        { id: '1', name: 'Full Access Gym Membership', description: 'Unlimited floor access, locker facility, and steam shower access.', price: '₹2,500', duration: 'Monthly', popular: true, category: 'gym' },
        { id: '2', name: 'Transformation Coaching (12 Weeks)', description: 'Targeted hypertrophy & fat loss plan with weekly body scan and diet.', price: '₹12,000', duration: '3 Months', popular: true, category: 'gym' },
        { id: '3', name: 'HIIT & Functional Batch', description: 'Group metabolic conditioning, kettlebell circuits, and agility work.', price: '₹3,000', duration: 'Monthly', popular: false, category: 'gym' },
        { id: '4', name: '1-on-1 Personal Training (12 Sessions)', description: 'Dedicated certified coach focusing on form, strength progression, and mobility.', price: '₹8,500', duration: '12 Sessions', popular: true, category: 'gym' },
      ],
    },
  },
  {
    id: 'clinic',
    label: 'Dental & Healthcare Clinic',
    iconName: 'Stethoscope',
    defaultInfo: {
      category: 'clinic',
      businessName: 'Apex Care Dental & Wellness',
      city: 'Anna Nagar, Chennai',
      address: '2nd Avenue, Anna Nagar, Chennai, TN 600040',
      shortDescription: 'Gentle dentistry, painless root canals, invisible aligners, and comprehensive oral healthcare for families.',
      phoneNumber: '+91 98410 88990',
      whatsappNumber: '+91 98410 88990',
      businessEmail: 'care@apexdentalchennai.com',
      stylePreference: 'clean-corporate',
      currencySymbol: '₹',
      services: [
        { id: '1', name: 'Comprehensive Dental Checkup & X-Ray', description: 'Digital intraoral scan, cavity detection, and tailored hygiene plan.', price: '₹499', duration: '30 mins', popular: true, category: 'clinic' },
        { id: '2', name: 'Laser Teeth Whitening', description: 'Single-session brightening up to 6 shades with zero enamel sensitivity.', price: '₹4,500', duration: '45 mins', popular: true, category: 'clinic' },
        { id: '3', name: 'Invisible Clear Aligners Consultation', description: '3D smile simulation, orthodontic evaluation, and aligner fitting.', price: '₹1,200', duration: '40 mins', popular: false, category: 'clinic' },
        { id: '4', name: 'Painless Single-Sitting RCT', description: 'Microscopic rotary endodontics with permanent ceramic crown restoration.', price: '₹5,500', duration: '60 mins', popular: true, category: 'clinic' },
      ],
    },
  },
  {
    id: 'service',
    label: 'Home Repairs & Electrician / Plumber',
    iconName: 'Wrench',
    defaultInfo: {
      category: 'service',
      businessName: 'QuickFix Home Services',
      city: 'Salt Lake, Kolkata',
      address: 'Sector 1, Salt Lake City, Kolkata, WB 700064',
      shortDescription: 'Licensed residential electrical repairs, plumbing leaks, inverter setup, and emergency repair service.',
      phoneNumber: '+91 98300 44556',
      whatsappNumber: '+91 98300 44556',
      businessEmail: 'service@quickfixkolkata.com',
      stylePreference: 'modern-minimal',
      currencySymbol: '₹',
      services: [
        { id: '1', name: 'Emergency Doorstep Inspection', description: 'Quick diagnosis of electrical faults, circuit trips, or water leakage.', price: '₹299', duration: 'Within 60 Mins', popular: true, category: 'service' },
        { id: '2', name: 'Complete Bathroom Plumbing Overhaul', description: 'Fixing mixer taps, concealed pipe leaks, and drainage clearing with warranty.', price: '₹1,200', duration: '2 Hours', popular: true, category: 'service' },
        { id: '3', name: 'Inverter & Battery Setup / Repair', description: 'Wiring verification, load calculation, and safety switch installation.', price: '₹850', duration: '90 Mins', popular: false, category: 'service' },
        { id: '4', name: 'Annual Home Maintenance Contract', description: '3 scheduled checkups per year with free emergency callouts and 20% off parts.', price: '₹3,499', duration: '1 Year', popular: true, category: 'service' },
      ],
    },
  },
];
