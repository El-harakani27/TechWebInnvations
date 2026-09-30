'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { motion, useInView, useReducedMotion, type Transition } from 'motion/react';
import { site } from '@/content/site';
import { useSite } from '@/content/i18n';
import styles from './Process.module.css';

gsap.registerPlugin(useGSAP);

const EASE: Transition['ease'] = [0.16, 1, 0.3, 1];
const STEP_SECONDS = 4.5; // how long each step stays highlighted
const GLIDE_SECONDS = 1.3; // how long the dark highlight takes to move

const STEP_COUNT = site.process.steps.length;
const pad = (n: number) => String(n).padStart(2, '0');

export default function Process() {
  const { process } = useSite();
  const steps = process.steps;
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const barHighlight = useRef<HTMLDivElement>(null);
  const cardHighlight = useRef<HTMLDivElement>(null);
  const barRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const placed = useRef(false);
  // Autoplay pauses while the user hovers / focuses the steps, or the tab is hidden
  const [hoverPaused, setHoverPaused] = useState(false);
  const [focusPaused, setFocusPaused] = useState(false);
  const [docHidden, setDocHidden] = useState(false);
  const paused = hoverPaused || focusPaused || docHidden;
  const activeRef = useRef(active);
  activeRef.current = active;

  const inView = useInView(listRef, { margin: '-15% 0px -15% 0px' });
  const reduceMotion = useReducedMotion();

  // StrictMode remounts effects — make sure the first placement snaps rather than glides
  useEffect(
    () => () => {
      placed.current = false;
    },
    [],
  );

  // Glide the two dark highlights (bar + card) onto the active step
  useGSAP(
    () => {
      const bar = barRefs.current[active];
      const card = cardRefs.current[active];
      if (!bar || !card) return;

      const instant = !placed.current || reduceMotion;
      const duration = instant ? 0 : GLIDE_SECONDS;

      gsap.to(barHighlight.current, {
        y: bar.offsetTop,
        height: bar.offsetHeight,
        autoAlpha: 1,
        duration,
        ease: 'power4.inOut',
        overwrite: true,
      });
      gsap.to(cardHighlight.current, {
        y: card.offsetTop,
        height: card.offsetHeight,
        autoAlpha: 1,
        duration,
        delay: instant ? 0 : 0.06, // card trails the bar slightly, for a softer feel
        ease: 'power4.inOut',
        overwrite: true,
      });

      // Card copy settles in as the highlight arrives
      if (!instant) {
        gsap.fromTo(
          card.querySelectorAll('[data-settle]'),
          { y: 10 },
          { y: 0, duration: 1, ease: 'power3.out', stagger: 0.07, delay: GLIDE_SECONDS * 0.5 },
        );
      }
      placed.current = true;
    },
    { dependencies: [active, reduceMotion], scope: listRef },
  );

  // Keep highlights aligned when the layout changes (resize, font load, breakpoint)
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const ro = new ResizeObserver(() => {
      const bar = barRefs.current[activeRef.current];
      const card = cardRefs.current[activeRef.current];
      if (!bar || !card) return;
      // gsap.set doesn't stop an in-flight glide, which would keep writing stale values
      gsap.killTweensOf([barHighlight.current, cardHighlight.current]);
      gsap.set(barHighlight.current, { y: bar.offsetTop, height: bar.offsetHeight });
      gsap.set(cardHighlight.current, { y: card.offsetTop, height: card.offsetHeight });
    });
    ro.observe(list);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const onVisibility = () => setDocHidden(document.hidden);
    onVisibility();
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  // Autoplay — advances on its own while the section is on screen
  useEffect(() => {
    if (!inView || reduceMotion || paused) return;
    const call = gsap.delayedCall(STEP_SECONDS, () => setActive((a) => (a + 1) % STEP_COUNT));
    return () => {
      call.kill();
    };
  }, [active, inView, reduceMotion, paused]);

  return (
    <section id="process" className={styles.section}>
      <div className={styles.inner}>
        {/* Left — sticky intro */}
        <div className={styles.intro}>
          <motion.span
            className={styles.label}
            initial={{ y: 16, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            03 / {process.eyebrow}
          </motion.span>

          <motion.h2
            className={styles.title}
            initial={{ y: 24, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
          >
            {process.title}
            <span className={styles.titleDot}>.</span>
          </motion.h2>

          <motion.p
            className={styles.lead}
            initial={{ y: 16, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
          >
            {process.lead}
          </motion.p>

          <motion.a
            href={process.cta.href}
            className={styles.cta}
            initial={{ y: 16, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
            whileTap={{ scale: 0.97 }}
          >
            {process.cta.label}
            <span className={styles.ctaCircle}>
              <span />
            </span>
          </motion.a>
        </div>

        {/* Right — steps (display only; the highlight moves by itself) */}
        <motion.div
          ref={listRef}
          className={styles.stepsWrap}
          initial={{ y: 32, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1, delay: 0.15, ease: EASE }}
          onPointerEnter={() => setHoverPaused(true)}
          onPointerLeave={() => setHoverPaused(false)}
          onFocus={() => setFocusPaused(true)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocusPaused(false);
          }}
        >
          <div ref={barHighlight} className={`${styles.highlight} ${styles.highlightBar}`} aria-hidden />
          <div ref={cardHighlight} className={`${styles.highlight} ${styles.highlightCard}`} aria-hidden />

          <ol className={styles.steps}>
            {steps.map((step, i) => (
              <li key={i} className={styles.step} data-active={i === active}>
                <div ref={(el) => { barRefs.current[i] = el; }} className={styles.bar}>
                  <span className={styles.barLabel}>{step.phase}</span>
                  <span className={styles.ticks} aria-hidden>
                    {steps.map((_, t) => (
                      <i key={t} data-on={t <= i} />
                    ))}
                  </span>
                </div>

                <div ref={(el) => { cardRefs.current[i] = el; }} className={styles.card}>
                  <span className={styles.cardNumber} data-settle>
                    {pad(i + 1)}
                  </span>
                  <h3 className={styles.cardTitle} data-settle>
                    {step.title}
                  </h3>
                  <p className={styles.cardText} data-settle>
                    {step.text}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </motion.div>
      </div>
    </section>
  );
}
