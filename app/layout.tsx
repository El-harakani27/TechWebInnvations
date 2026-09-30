import type { Metadata, Viewport } from 'next';
import { Inter, Noto_Sans_Arabic, Noto_Sans_SC, Noto_Sans_Thai } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], weight: ['300', '400', '500', '600'], variable: '--font-inter' });

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

export const metadata: Metadata = {
  title: 'TechWebInnovations | Webdesign, Marketing & IT-Services',
  description:
    'Web design, programming, SEO & IT services (Microsoft 365, IT support) from one team. 150+ clients, 26 languages. Tallinn · Hua Hin.',
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${notoThai.variable} ${notoArabic.variable} ${notoSC.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
