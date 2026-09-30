/**
 * Site copy — extracted from https://techwebinnovations.com/ (English version, 2026-09-30).
 * Single source of truth for all text on the site.
 */

export const site = {
  meta: {
    title: 'TechWebInnovations | Webdesign, Marketing & IT-Services',
    // Live site ships German meta/OG descriptions; English equivalents below.
    description:
      'TechWebInnovations: web design, programming, SEO & IT services (Microsoft 365, IT support) from one source. 150+ clients, 26 languages. Tallinn · Hua Hin.',
    ogDescription:
      'Web design, programming, SEO, photo & video and enterprise IT from one source. 150+ companies migrated · Service in 26 languages · Tallinn, Hua Hin.',
    url: 'https://techwebinnovations.com/',
  },

  brand: {
    name: 'TechWebInnovations',
    logo: '/logo.webp',
    logoAlt: 'TechWebInnovations Logo',
  },

  nav: [
    { label: 'Services', description: 'Web, media & IT', href: '#services' },
    { label: 'Process', description: 'How we work', href: '#process' },
    { label: 'Locations', description: 'Tallinn · Hua Hin', href: '#locations' },
    { label: 'Contact', description: "Let's talk", href: '#contact' },
  ],

  // 26 service languages are advertised; the live switcher lists these 19.
  // `label` is each language's own name, so it is never translated.
  languages: [
    { code: 'de', label: 'Deutsch' },
    { code: 'en', label: 'English' },
    { code: 'it', label: 'Italiano' },
    { code: 'th', label: 'ไทย' },
    { code: 'tr', label: 'Türkçe' },
    { code: 'ru', label: 'Русский' },
    { code: 'pt', label: 'Português' },
    { code: 'es', label: 'Español' },
    { code: 'fr', label: 'Français' },
    { code: 'fi', label: 'Suomi' },
    { code: 'no', label: 'Norsk' },
    { code: 'sv', label: 'Svenska' },
    { code: 'da', label: 'Dansk' },
    { code: 'pl', label: 'Polski' },
    { code: 'cs', label: 'Čeština' },
    { code: 'el', label: 'Ελληνικά' },
    { code: 'ar', label: 'العربية', dir: 'rtl' },
    { code: 'zh', label: '中文' },
    { code: 'vi', label: 'Tiếng Việt' },
  ],

  // Interface text that used to be hard-coded in components (kept here so it can be translated)
  ui: {
    skipLink: 'Skip to content',
    menu: { open: 'Menu', close: 'Close', cta: 'Start a project' },
    language: { label: 'Language' },
    locations: { globeAlt: 'Globe showing our offices in Tallinn and Hua Hin' },
    hero: {
      navTags: ['Web Design', 'IT Services'],
      officesPill: 'Tallinn · Hua Hin',
      subtitle: '150+ companies migrated · 26 languages',
      headingLines: ['Design, Code & IT.', 'One Team. Worldwide.'],
      about:
        'We combine modern web development, professional photo and video production, and enterprise IT, from custom programming for your website or online shop to Microsoft 365 migration and ongoing IT support.',
      ctaPrimary: 'Start a Project',
      ctaSecondary: 'Explore Services',
      chips: ['Microsoft 365', 'E-Commerce', 'Branding'],
    },
    services: {
      countLabel: 'services',
      imageAlts: ['Developer writing code on a laptop', 'Camera in a photo studio', 'Server racks in a data center'],
    },
    contact: {
      eyebrow: 'Contact',
      loopMain: "Let's talk",
      loopServices: 'Web Design · Marketing · IT Services',
      emailLabel: 'Email',
      responseLabel: 'Response',
      responseValue: 'Within 24 hours',
      officesLabel: 'Offices',
      languagesValue: '26 languages',
      note: 'We reply within 24 hours.',
      required: 'Required',
      sentNote: 'Your mail app should open with your request. Just press send.',
      mailSubject: 'New project request',
      mailFields: { name: 'Name', email: 'Email', company: 'Company', topic: 'Topic', notGiven: 'not given' },
    },
    footer: {
      navigation: 'Navigation',
      services: 'Services',
      offices: 'Offices',
      contact: 'Contact',
      phone: 'Phone',
      backToTop: 'Back to top',
      close: 'Close',
    },
    legal: {
      contact: 'Contact',
      email: 'Email',
      phone: 'Phone',
      representedBy: 'Represented by',
      registration: 'Registration number (Registrikood)',
      responsible: 'Responsible for content',
    },
  },

  hero: {
    eyebrow: 'Web Design · Marketing · IT Services',
    title: 'Your digital agency for design, marketing and IT.',
    lead:
      'TechWebInnovations combines modern web development, professional photo and video production, and enterprise IT: from custom programming for your website or online shop to Microsoft 365 migration and ongoing IT support. All from one team, in 26 languages.',
    ctaPrimary: { label: 'Start a project', href: '#contact' },
    ctaSecondary: { label: 'Explore services', href: '#services' },
    locations: [
      { city: 'Tallinn', country: 'Estonia' },
      { city: 'Hua Hin', country: 'Thailand' },
    ],
    // Decorative code window in the live hero
    codeWindow: {
      filename: 'techwebinnovations.com / index.tsx',
      lines: [
        "import { Ideas } from './your-vision';",
        '// design × marketing × IT',
        'const agency = new TechWebInnovations();',
        "agency.design('websites', 'brands');",
        "agency.create('photo', 'video');",
        "agency.operate('M365', 'cloud');",
        "agency.support('24/7');",
        '// 150+ companies migrated · 26 languages',
        'export default yourSuccess;',
      ],
    },
  },

  services: {
    eyebrow: 'Our Services',
    title: 'Everything your business needs digitally',
    lead:
      'Web design agency, creative studio and IT service provider in one: we design, code, produce and operate. Measurable, secure and multilingual.',
    cta: { label: 'Start a project', href: '#contact' },
    groups: [
      {
        eyebrow: 'Development',
        title: 'Web Design, Programming & Marketing',
        // Group summaries are composed from the site's own service texts.
        text: 'Modern, fast websites, online shops and custom web apps: search engine optimized, built for conversion and backed by a brand people remember.',
        items: [
          {
            title: 'Web Design & Development',
            text: 'Modern, fast websites with responsive design: search engine optimized, accessible and built for conversion.',
          },
          {
            title: 'Custom Programming & Shop Systems',
            text: 'Tailor-made web solutions, online shops and e-commerce systems, from WooCommerce to fully custom web apps.',
          },
          {
            title: 'Branding & Corporate Identity',
            text: 'Logo, color palette, typography and a brand presence people remember, consistent across every channel.',
          },
          {
            title: 'Online Marketing & SEO',
            text: 'Search engine optimization, campaigns and performance reporting. Visibility you can measure.',
          },
        ],
      },
      {
        eyebrow: 'Media',
        title: 'Content, Photo & Video',
        text: 'Strategy, editorial planning and content production, plus professional photography and video from shoot to post-production, for reach and trust.',
        items: [
          {
            title: 'Social Media & Content',
            text: 'Strategy, editorial planning and content production for more reach and trust in your brand.',
          },
          {
            title: 'Professional Photography',
            text: 'Product, business and brand photography at a professional level, for websites, shops and social media.',
          },
          {
            title: 'Videography, Sound & Editing',
            text: 'Video production from shoot to post-production, with professional sound, editing and color grading.',
          },
        ],
      },
      {
        eyebrow: 'IT Services',
        title: 'Infrastructure, Support & Projects',
        text: 'Microsoft 365, cloud and infrastructure: rolled out, secured and operated, with a multilingual hotline for your team. Over 150 companies migrated.',
        items: [
          {
            title: 'Microsoft 365 & Cloud Migration',
            text: 'Rollout, migration and operation of Microsoft 365: Exchange, SharePoint, Teams and OneDrive, securely configured. Over 150 companies migrated.',
          },
          {
            title: 'IT Infrastructure & Administration',
            text: 'Planning, building and administering your IT environment, on-premises, hybrid or in the Azure cloud.',
          },
          {
            title: 'IT Hotline & IT Support',
            text: 'A reachable, multilingual IT hotline and fast support for your team, remote and proactive.',
          },
          {
            title: 'Managed Services & Operations',
            text: 'Ongoing operations, monitoring, updates and maintenance, so your IT simply works.',
          },
          {
            title: 'Security & Endpoint Management',
            text: 'Device management with Microsoft Intune, compliance policies and hardening according to best practices.',
          },
          {
            title: 'Project & Change Management',
            text: 'Structured IT projects from planning to rollout, including change management and user communication.',
          },
        ],
      },
    ],
  },

  process: {
    eyebrow: 'Process',
    title: 'How we work',
    lead: 'Clearly structured, transparently communicated, from the first conversation to ongoing operations.',
    steps: [
      // `phase` labels the step's header bar (the site gives no timeframes, so these use its own wording)
      { number: '/01', phase: 'First conversation', title: 'Understand', text: 'We listen, analyze your goals and your current situation, technically and strategically.' },
      { number: '/02', phase: 'Concept & fixed price', title: 'Plan', text: 'You get a clear concept with scope, timeline and fixed price. No surprises.' },
      { number: '/03', phase: 'Short iterations', title: 'Build', text: 'Design, development, production or migration, in short iterations, with regular check-ins.' },
      { number: '/04', phase: 'Ongoing', title: 'Support', text: 'After launch, we stay: support, maintenance, further development and reporting.' },
    ],
    cta: { label: 'Start a project', href: '#contact' },
  },

  stats: [
    { value: 150, suffix: '+', label: 'companies migrated' },
    { value: 26, suffix: '', label: 'service languages' },
    { value: 2, suffix: '', label: 'locations' },
    { value: 10, suffix: '+', label: 'years of experience' },
  ],

  locations: {
    eyebrow: 'Locations',
    // The live site says "Three locations" but lists two (and its counter shows 2), so this says two.
    title: 'Two locations, one team',
    lead:
      'From Tallinn to Hua Hin, every location offers our full range of services: web design, marketing, photo & video and IT services. Personal, multilingual, and in your time zone.',
    items: [
      {
        flag: '🇪🇪',
        title: 'TechWebInnovations OÜ, Tallinn',
        company: 'TechWebInnovations OÜ',
        city: 'Tallinn',
        country: 'Estonia',
        countryCode: 'EE',
        region: 'Europe',
        timeZone: 'Europe/Tallinn',
        coords: { lat: 59.437, lon: 24.754 },
        tag: 'Web Design · Marketing · IT Services',
        text: 'From Tallinn we serve clients across Europe with the same full-service offering: web development, branding, media production and enterprise IT. Digital, efficient and EU-regulated.',
      },
      {
        flag: '🇹🇭',
        title: 'TechWebInnovations Co., Ltd., Hua Hin',
        company: 'TechWebInnovations Co., Ltd.',
        city: 'Hua Hin',
        country: 'Thailand',
        countryCode: 'TH',
        region: 'Southeast Asia',
        timeZone: 'Asia/Bangkok',
        coords: { lat: 12.568, lon: 99.958 },
        tag: 'Web Design · Marketing · IT Services',
        text: 'Our Hua Hin location delivers the identical portfolio for Southeast Asia: web design, social media, professional photo and video production, and IT services, right in your time zone.',
      },
    ],
    cta: { label: 'Start a project', href: '#contact' },
  },

  contact: {
    title: "Let's talk.",
    lead:
      "Whether it's a new website, online shop, brand identity or a Microsoft 365 migration, tell us about your project. We reply within 24 hours.",
    email: 'info@techwebinnovations.com',
    form: {
      fields: {
        name: 'Name',
        email: 'Email',
        company: 'Company (optional)',
        topic: 'Topic',
        message: 'Your message',
      },
      topics: ['Web design & development', 'Marketing & media', 'IT services', 'Other'],
      submit: 'Send request',
    },
  },

  footer: {
    copyright: '© 2026 TechWebInnovations OÜ · Tallinn · Hua Hin',
    email: 'info@techwebinnovations.com',
    links: ['Legal Notice', 'Privacy Policy', 'Cookie settings'],
    backToTop: 'Back to top',
  },

  cookieBanner: {
    text: 'We use cookies and similar technologies. Technically necessary storage (e.g. your language choice) always applies. Optional cookies for statistics or marketing only with your consent. May we store optional cookies?',
    more: 'More in our privacy policy',
    accept: 'Yes, accept',
    decline: 'No, decline',
  },

  legal: {
    title: 'Legal Notice (Impressum)',
    intro: 'Information about the service provider:',
    company: 'TechWebInnovations OÜ',
    address: ['Sepapaja tn 6', '11415 Tallinn, Harjumaa', 'Estonia'],
    email: 'info@techwebinnovations.com',
    phone: '+49 176 63683426',
    representedBy: 'Maximilian Roßbach',
    registrationNumber: '16959549',
    responsibleForContent: 'TechWebInnovations OÜ',
  },

  privacy: {
    title: 'Privacy Policy',
    intro:
      'Protecting your data matters to us. Below we inform you, in accordance with the GDPR, about the processing of personal data on this website.',
    sections: [
      {
        title: '1. Controller',
        text: 'TechWebInnovations OÜ, Sepapaja tn 6, 11415 Tallinn, Estonia. Email: info@techwebinnovations.com',
      },
      {
        title: '2. Hosting & server log files',
        text: 'When you visit this website, our hosting provider automatically processes technical data (e.g. IP address, date and time of access, browser type) to the extent necessary to provide, stabilize and secure the website (Art. 6(1)(f) GDPR). This data is deleted after a short period.',
      },
      {
        title: '3. Contacting us',
        text: 'If you contact us by email, we process your details solely to handle your inquiry (Art. 6(1)(b) GDPR).',
      },
      {
        title: '4. Cookies & local storage',
        text: "Technically necessary storage (e.g. your language selection and your cookie decision in your browser's local storage) is based on Art. 6(1)(f) GDPR. Optional cookies (e.g. for statistics or marketing) are only set with your consent (Art. 6(1)(a) GDPR). You can change your decision at any time via “Cookie settings” in the footer.",
      },
      {
        title: '5. Your rights',
        text: 'You have the right to access, rectification, erasure, restriction of processing, data portability and to object to the processing of your data. You also have the right to lodge a complaint with a data protection supervisory authority. Contact: info@techwebinnovations.com',
      },
    ],
  },
} as const;

export type SiteContent = typeof site;
