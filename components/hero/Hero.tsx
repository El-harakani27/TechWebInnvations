'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionValueEvent,
  useScroll,
  type Transition,
} from 'motion/react';
import { ArrowUpRight, Plus } from 'lucide-react';
import { useSite } from '@/content/i18n';
import LanguageSwitcher from '@/components/language/LanguageSwitcher';
import styles from './Hero.module.css';

const EASE: Transition['ease'] = [0.16, 1, 0.3, 1];

const VIDEO_SRC =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_215831_c6a8989c-d716-4d8d-8745-e972a2eec711.mp4';
const VIDEO_PAUSE_MS = 3000; // hold on the last frame before replaying
const VIDEO_FADE_MS = 600; // fade out → rewind → fade in, so the jump back to frame 1 isn't visible

/** Plays once, holds the final frame, then fades and replays — forever. */
function useDelayedLoop(ref: React.RefObject<HTMLVideoElement>) {
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const timers: number[] = [];

    const onEnded = () => {
      timers.push(
        window.setTimeout(() => {
          video.style.opacity = '0';
          timers.push(
            window.setTimeout(() => {
              video.currentTime = 0;
              void video.play().catch(() => {});
              video.style.opacity = '1';
            }, VIDEO_FADE_MS),
          );
        }, VIDEO_PAUSE_MS),
      );
    };

    video.addEventListener('ended', onEnded);
    return () => {
      video.removeEventListener('ended', onEnded);
      timers.forEach(clearTimeout);
    };
  }, [ref]);
}

function Counter({ to, delay }: { to: number; delay: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView || !ref.current) return;
    const node = ref.current;
    const controls = animate(0, to, {
      duration: 1.6,
      delay,
      ease: EASE,
      onUpdate: (v) => (node.textContent = String(Math.round(v))),
    });
    return () => controls.stop();
  }, [inView, to, delay]);

  return <span ref={ref}>{to}</span>;
}

function GridIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden>
      <circle cx="3" cy="3" r="1.6" />
      <circle cx="9" cy="3" r="1.6" />
      <circle cx="3" cy="9" r="1.6" />
      <circle cx="9" cy="9" r="1.6" />
    </svg>
  );
}

export default function Hero() {
  const s = useSite();
  const { ui } = s;
  // 150+ companies migrated · 26 service languages · 10+ years of experience
  const stats = s.stats.filter((_, i) => i !== 2);

  const videoRef = useRef<HTMLVideoElement>(null);
  useDelayedLoop(videoRef);

  // Frosted navbar once the page is scrolled
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 24));

  // Menu dropdown
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: PointerEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  return (
    <section id="top" className={styles.hero}>
      {/* Navbar */}
      <motion.nav
        className={styles.nav}
        data-scrolled={scrolled}
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        <div className={styles.navLeft}>
          <a href="#top" className={styles.logo}>
            <Image src="/logo.webp" alt={s.brand.logoAlt} width={320} height={138} priority className={styles.logoImg} />
          </a>

          <div ref={menuRef} className={styles.menuWrap}>
            <motion.button
              type="button"
              className={styles.menuBtn}
              data-open={menuOpen}
              onClick={() => setMenuOpen((o) => !o)}
              aria-expanded={menuOpen}
              aria-controls="site-menu"
              whileTap={{ scale: 0.96 }}
            >
              <span className={styles.menuCircle}>
                <Plus size={12} strokeWidth={3} />
              </span>
              {menuOpen ? ui.menu.close : ui.menu.open}
            </motion.button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  id="site-menu"
                  className={styles.menuPanel}
                  initial={{ opacity: 0, y: -10, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.97 }}
                  transition={{ duration: 0.4, ease: EASE }}
                >
                  <motion.ul
                    className={styles.menuList}
                    initial="hidden"
                    animate="show"
                    variants={{ show: { transition: { staggerChildren: 0.05, delayChildren: 0.08 } } }}
                  >
                    {s.nav.map((item, i) => (
                      <motion.li
                        key={item.href}
                        variants={{ hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: EASE } } }}
                      >
                        <a href={item.href} className={styles.menuItem} onClick={() => setMenuOpen(false)}>
                          <span className={styles.menuNumber}>{String(i + 1).padStart(2, '0')}</span>
                          <span className={styles.menuLabel}>{item.label}</span>
                          <span className={styles.menuDesc}>{item.description}</span>
                          <ArrowUpRight size={16} className={styles.menuArrow} />
                        </a>
                      </motion.li>
                    ))}
                  </motion.ul>

                  <div className={styles.menuFooter}>
                    <a href={`mailto:${s.contact.email}`} className={styles.menuEmail}>
                      {s.contact.email}
                    </a>
                    <a href="#contact" className={styles.menuCta} onClick={() => setMenuOpen(false)}>
                      {ui.menu.cta}
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className={styles.tags}>
            {ui.hero.navTags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>

        <div className={styles.navRightGroup}>
          <LanguageSwitcher />
          <a href="#locations" className={styles.navRight}>
            <span className={styles.gridBtn}>
              <GridIcon />
            </span>
            <span className={styles.navRightLabel}>{ui.hero.officesPill}</span>
          </a>
        </div>
      </motion.nav>

      {/* Background video */}
      <motion.div
        className={styles.videoWrap}
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.8, ease: EASE }}
      >
        <video ref={videoRef} className={styles.video} src={VIDEO_SRC} autoPlay muted playsInline />
      </motion.div>

      {/* About block — sits in the open space beside the hand (desktop only) */}
      <div className={styles.aside}>
        <motion.div
          initial={{ x: 16, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 1.2, ease: EASE }}
        >
          <p className={styles.asideText}>{ui.hero.about}</p>
        </motion.div>

        <div className={styles.stats}>
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              className={styles.stat}
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.4 + i * 0.1, ease: EASE }}
            >
              <span className={styles.statValue}>
                <Counter to={stat.value} delay={1.4 + i * 0.1} />
                {stat.suffix && <span className={styles.statSuffix}>{stat.suffix}</span>}
              </span>
              {/* Break before the last word so every label sits on two even lines */}
              <span className={styles.statLabel}>
                {stat.label.includes(' ') ? (
                  <>
                    {stat.label.slice(0, stat.label.lastIndexOf(' '))}
                    <br />
                    {stat.label.slice(stat.label.lastIndexOf(' ') + 1)}
                  </>
                ) : (
                  stat.label
                )}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer content */}
      <motion.div
        className={styles.footer}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.5, ease: EASE }}
      >
        <div className={styles.footerMain}>
          <motion.p
            className={styles.subtitle}
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6, ease: EASE }}
          >
            <span className={styles.dot} />
            {ui.hero.subtitle}
          </motion.p>

          <motion.h1
            className={styles.heading}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8, ease: EASE }}
          >
            {ui.hero.headingLines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </motion.h1>

          {/* Below 1024px the side About block is hidden, so its text lives under the title */}
          <motion.p
            className={styles.mobileAbout}
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9, ease: EASE }}
          >
            {ui.hero.about}
          </motion.p>

          <motion.div
            className={styles.buttons}
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.0, ease: EASE }}
          >
            <motion.a href="#contact" className={`${styles.btn} ${styles.btnPrimary}`} whileTap={{ scale: 0.97 }}>
              {ui.hero.ctaPrimary}
            </motion.a>
            <motion.a href="#services" className={`${styles.btn} ${styles.btnSecondary}`} whileTap={{ scale: 0.97 }}>
              {ui.hero.ctaSecondary}
            </motion.a>
          </motion.div>
        </div>

        <div className={styles.chips}>
          {ui.hero.chips.map((chip) => (
            <span key={chip} className={styles.chip}>
              {chip}
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
