import type { Metadata, Viewport } from 'next';
import { Inter, Noto_Sans_Arabic, Noto_Sans_SC, Noto_Sans_Thai } from 'next/font/google';
import MotionProvider from '@/components/providers/MotionProvider';
import { site } from '@/content/site';
import './globals.css';

// Variable font: one file covers every weight used (300–600)
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

// Script fallbacks for translations Inter doesn't cover. Not preloaded: the browser only
// fetches them (and only the glyph ranges it needs) when Thai / Arabic / Chinese text renders.
const notoThai = Noto_Sans_Thai({
  subsets: ['thai'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-noto-thai',
  preload: false,
});
const notoArabic = Noto_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-noto-arabic',
  preload: false,
});
const notoSC = Noto_Sans_SC({
  weight: ['300', '400', '500', '600'],
  variable: '--font-noto-sc',
  preload: false,
});

const SITE_URL = site.meta.url; // https://techwebinnovations.com/

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: site.meta.title,
  description: site.meta.description,
  applicationName: site.brand.name,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: site.brand.name,
    title: site.meta.title,
    description: site.meta.ogDescription,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: site.meta.title,
    description: site.meta.ogDescription,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
};

// Organization + both offices, for search engines (mirrors the live site's schema)
const [tallinn, huaHin] = site.locations.items;
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}#org`,
      name: site.brand.name,
      url: SITE_URL,
      logo: new URL('/icon.svg', SITE_URL).href,
      email: site.contact.email,
      description: site.meta.description,
      subOrganization: [{ '@id': `${SITE_URL}#tallinn` }, { '@id': `${SITE_URL}#huahin` }],
    },
    {
      '@type': 'ProfessionalService',
      '@id': `${SITE_URL}#tallinn`,
      name: tallinn.company,
      parentOrganization: { '@id': `${SITE_URL}#org` },
      email: site.contact.email,
      telephone: site.legal.phone,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Sepapaja tn 6',
        postalCode: '11415',
        addressLocality: 'Tallinn',
        addressRegion: 'Harjumaa',
        addressCountry: 'EE',
      },
      geo: { '@type': 'GeoCoordinates', latitude: tallinn.coords.lat, longitude: tallinn.coords.lon },
    },
    {
      '@type': 'ProfessionalService',
      '@id': `${SITE_URL}#huahin`,
      name: huaHin.company,
      parentOrganization: { '@id': `${SITE_URL}#org` },
      email: site.contact.email,
      address: { '@type': 'PostalAddress', addressLocality: 'Hua Hin', addressCountry: 'TH' },
      geo: { '@type': 'GeoCoordinates', latitude: huaHin.coords.lat, longitude: huaHin.coords.lon },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${notoThai.variable} ${notoArabic.variable} ${notoSC.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
