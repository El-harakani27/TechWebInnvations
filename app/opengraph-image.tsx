import { ImageResponse } from 'next/og';
import { site } from '@/content/site';

// Link-preview image (Open Graph / Twitter), generated at build time
export const alt = site.meta.title;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          backgroundColor: '#0a0d12',
          // Satori (the OG renderer) only supports the simple radial-gradient form
          backgroundImage: 'radial-gradient(circle at 85% 10%, rgba(77,163,255,0.28), rgba(10,13,18,0) 55%)',
          color: '#ffffff',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 28, letterSpacing: 2 }}>
          <div style={{ width: 14, height: 14, borderRadius: 999, background: '#4da3ff' }} />
          {site.hero.eyebrow.toUpperCase()}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 92, lineHeight: 1, letterSpacing: -3 }}>
          <div style={{ display: 'flex' }}>{site.ui.hero.headingLines[0]}</div>
          <div style={{ display: 'flex', color: '#8cc4ff' }}>{site.ui.hero.headingLines[1]}</div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 28, color: 'rgba(255,255,255,0.7)' }}>
          <div style={{ display: 'flex', color: '#ffffff' }}>{site.brand.name}</div>
          <div style={{ display: 'flex' }}>{site.ui.hero.officesPill}</div>
        </div>
      </div>
    ),
    size,
  );
}
