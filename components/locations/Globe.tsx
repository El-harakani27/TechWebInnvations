'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import {
  geoDistance,
  geoEquirectangular,
  geoGraticule10,
  geoInterpolate,
  geoOrthographic,
  geoPath,
  type GeoPermissibleObjects,
} from 'd3-geo';
import { feature } from 'topojson-client';
import type { GeometryCollection, Topology } from 'topojson-specification';

export interface GlobePoint {
  label: string;
  lat: number;
  lon: number;
}

interface GlobeProps {
  points: [GlobePoint, GlobePoint];
  /** Index of the point to turn towards, or null for the idle drift between both. */
  focus: number | null;
  className?: string;
  /** Accessible description of the globe (translated) */
  label: string;
}

const HALF_PI = Math.PI / 2;
const DOT_STEP = 1.7; // degrees between land dots

/**
 * Dotted wireframe globe on <canvas>. GSAP drives the rotation, the arc draw-on and the
 * travelling pulse; the ticker redraws only while the globe is on screen.
 */
export default function Globe({ points, focus, className, label }: GlobeProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const state = useRef({ lambda: -55, phi: -32, arc: 0, pulse: 0 });
  const idleRef = useRef<gsap.core.Animation | null>(null);
  // Latest labels (they change with the language); coordinates never change
  const pointsRef = useRef(points);
  pointsRef.current = points;

  // Centre of the idle drift: between both cities so both stay on the visible side
  const [a, b] = points;
  const midLon = (a.lon + b.lon) / 2;

  const startIdle = () => {
    idleRef.current?.kill();
    const s = state.current;
    idleRef.current = gsap
      .timeline({ repeat: -1, yoyo: true })
      .to(s, { lambda: -(midLon - 22), phi: -34, duration: 7, ease: 'sine.inOut' })
      .to(s, { lambda: -(midLon + 18), phi: -26, duration: 9, ease: 'sine.inOut' });
  };

  // Set by the canvas effect; lets other effects request a one-off redraw
  const renderRef = useRef<() => void>(() => {});

  // Turn towards the focused city, or go back to drifting
  useEffect(() => {
    const s = state.current;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const target =
      focus === null
        ? { lambda: -midLon, phi: -30 }
        : { lambda: -points[focus].lon, phi: -Math.max(Math.min(points[focus].lat, 45), 10) };

    idleRef.current?.kill();
    // Only stop rotation tweens — the arc draw-on and the travelling pulse must keep running
    gsap.killTweensOf(s, 'lambda,phi');

    if (reduce) {
      gsap.set(s, target);
      renderRef.current();
      return;
    }
    gsap.to(s, {
      ...target,
      duration: 1.6,
      ease: 'power3.inOut',
      onComplete: focus === null ? startIdle : undefined,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focus]);

  // Redraw when the city labels change language (the ticker doesn't run under reduced motion)
  useEffect(() => {
    renderRef.current();
  }, [a.label, b.label]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!wrap || !canvas || !ctx) return;

    const s = state.current;
    const projection = geoOrthographic().clipAngle(90).precision(0.4);
    const path = geoPath(projection, ctx);
    const graticule = geoGraticule10();
    const along = geoInterpolate([a.lon, a.lat], [b.lon, b.lat]);
    const fontFamily = getComputedStyle(canvas).fontFamily || 'sans-serif';
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let size = 0;
    let dpr = 1;
    let visible = false;
    let dots: [number, number][] = [];

    const resize = () => {
      size = wrap.clientWidth;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(size * dpr);
      canvas.height = Math.round(size * dpr);
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;
      render();
    };

    let dead = false;

    // Rasterise the land once into an equirectangular bitmap, then sample it on a lat/lon grid
    import('world-atlas/land-110m.json').then((mod) => {
      if (dead) return;
      const topo = ((mod as { default?: unknown }).default ?? mod) as Topology<{ land: GeometryCollection }>;
      const land = feature(topo, topo.objects.land);
      const W = 720;
      const H = 360;
      const off = document.createElement('canvas');
      off.width = W;
      off.height = H;
      const octx = off.getContext('2d');
      if (!octx) return;
      const eq = geoEquirectangular().scale(W / (2 * Math.PI)).translate([W / 2, H / 2]);
      octx.beginPath();
      geoPath(eq, octx)(land);
      octx.fill();
      const px = octx.getImageData(0, 0, W, H).data;

      const found: [number, number][] = [];
      for (let lat = -58; lat <= 82; lat += DOT_STEP) {
        const lonStep = DOT_STEP / Math.max(Math.cos((lat * Math.PI) / 180), 0.25);
        for (let lon = -180; lon < 180; lon += lonStep) {
          const xy = eq([lon, lat]);
          if (!xy) continue;
          const i = (Math.floor(xy[1]) * W + Math.floor(xy[0])) * 4 + 3;
          if (px[i] > 128) found.push([lon, lat]);
        }
      }
      dots = found;
      render();
    }).catch(() => {
      /* land data failed to load — the globe still renders without continents */
    });

    renderRef.current = () => render();

    function render() {
      if (!size || !ctx) return;
      const r = size / 2 - 6;
      const cx = size / 2;
      const center: [number, number] = [-s.lambda, -s.phi];
      projection.scale(r).translate([cx, cx]).rotate([s.lambda, s.phi]);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, size, size);

      // Atmosphere glow
      const glow = ctx.createRadialGradient(cx, cx, r * 0.85, cx, cx, r * 1.02);
      glow.addColorStop(0, 'rgba(77,163,255,0)');
      glow.addColorStop(1, 'rgba(77,163,255,0.16)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cx, r + 4, 0, Math.PI * 2);
      ctx.fill();

      // Sphere body
      const body = ctx.createRadialGradient(cx - r * 0.35, cx - r * 0.4, r * 0.1, cx, cx, r);
      body.addColorStop(0, '#182030');
      body.addColorStop(1, '#0a0d12');
      ctx.beginPath();
      path({ type: 'Sphere' } as GeoPermissibleObjects);
      ctx.fillStyle = body;
      ctx.fill();
      ctx.strokeStyle = 'rgba(140,196,255,0.28)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Graticule
      ctx.beginPath();
      path(graticule);
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.stroke();

      // Land dots, fading towards the limb
      const dotR = Math.max(size / 520, 0.7);
      ctx.fillStyle = '#8cc4ff';
      for (const d of dots) {
        const dist = geoDistance(d, center);
        if (dist > HALF_PI - 0.02) continue;
        const p = projection(d);
        if (!p) continue;
        ctx.globalAlpha = 0.12 + 0.6 * Math.cos(dist);
        ctx.fillRect(p[0] - dotR, p[1] - dotR, dotR * 2, dotR * 2);
      }
      ctx.globalAlpha = 1;

      // Great-circle arc between the offices, drawn on progressively
      if (s.arc > 0) {
        const steps = 80;
        const coords: [number, number][] = [];
        for (let i = 0; i <= steps * s.arc; i++) coords.push(along(i / steps));
        ctx.beginPath();
        path({ type: 'LineString', coordinates: coords });
        ctx.strokeStyle = '#4da3ff';
        ctx.lineWidth = 1.6;
        ctx.shadowColor = 'rgba(77,163,255,0.9)';
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Travelling pulse
      if (s.arc >= 1) {
        const p = along(s.pulse);
        if (geoDistance(p, center) < HALF_PI) {
          const xy = projection(p);
          if (xy) {
            ctx.beginPath();
            ctx.arc(xy[0], xy[1], 3, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = '#4da3ff';
            ctx.shadowBlur = 14;
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      }

      // City markers with pulsing rings + labels
      const t = (performance.now() / 1600) % 1;
      ctx.font = `500 ${Math.max(11, size / 44)}px ${fontFamily}`;
      pointsRef.current.forEach((pt, i) => {
        const ll: [number, number] = [pt.lon, pt.lat];
        if (geoDistance(ll, center) > HALF_PI - 0.05) return;
        const xy = projection(ll);
        if (!xy) return;
        const phase = (t + i * 0.5) % 1;

        ctx.beginPath();
        ctx.arc(xy[0], xy[1], 4 + phase * 16, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(77,163,255,${0.7 * (1 - phase)})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(xy[0], xy[1], 4.5, 0, Math.PI * 2);
        ctx.fillStyle = '#4da3ff';
        ctx.fill();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();

        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.textBaseline = 'middle';
        ctx.fillText(pt.label, xy[0] + 12, xy[1] - 12);
      });
    }

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    // Only animate while on screen
    let started = false;
    const io = new IntersectionObserver((entries) => {
      visible = entries[entries.length - 1].isIntersecting;
      if (visible && !started) {
        started = true;
        if (reduce) {
          s.arc = 1;
          render();
          return;
        }
        gsap.to(s, { arc: 1, duration: 2.2, delay: 0.4, ease: 'power2.inOut' });
        gsap.to(s, { pulse: 1, duration: 3.2, delay: 2.6, ease: 'sine.inOut', repeat: -1, yoyo: true, repeatDelay: 0.4 });
        startIdle();
      }
    });
    io.observe(wrap);

    const tick = () => {
      if (visible && !reduce) render();
    };
    gsap.ticker.add(tick);

    return () => {
      dead = true;
      renderRef.current = () => {};
      gsap.ticker.remove(tick);
      ro.disconnect();
      io.disconnect();
      idleRef.current?.kill();
      gsap.killTweensOf(s);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={wrapRef} className={className}>
      <canvas ref={canvasRef} role="img" aria-label={label} />
    </div>
  );
}
