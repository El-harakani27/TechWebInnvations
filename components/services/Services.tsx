'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, type Transition } from 'motion/react';
import { Plus } from 'lucide-react';
import { useSite } from '@/content/i18n';
// CC0 photos (StockSnap / rawpixel via Openverse)
import developmentImg from '@/assets/services/development.jpg';
import mediaImg from '@/assets/services/media.jpg';
import itImg from '@/assets/services/it.jpg';
import styles from './Services.module.css';

const SERVICE_IMAGES = { development: developmentImg, media: mediaImg, it: itImg };

const EASE: Transition['ease'] = [0.16, 1, 0.3, 1];

// One photo per service group — rendered in black & white to match the hero.
const MEDIA = [SERVICE_IMAGES.development, SERVICE_IMAGES.media, SERVICE_IMAGES.it];

export default function Services() {
  const { services, ui } = useSite();
  const [active, setActive] = useState(0);
  // Hovering a sub-service pill swaps the description to that sub-service's text.
  const [hovered, setHovered] = useState<number | null>(null);

  const open = (i: number) => {
    setActive(i);
    setHovered(null);
  };

  return (
    <section id="services" className={styles.section}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerMain}>
          <motion.span
            className={styles.label}
            initial={{ y: 16, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            02 / {services.eyebrow}
          </motion.span>

          <motion.h2
            className={styles.title}
            initial={{ y: 24, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
          >
            {services.title}
            <span className={styles.titleDot}>.</span>
          </motion.h2>

          <motion.p
            className={styles.lead}
            initial={{ y: 16, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
          >
            {services.lead}
          </motion.p>
        </div>

        <motion.a
          href={services.cta.href}
          className={styles.cta}
          initial={{ y: 16, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
          whileTap={{ scale: 0.97 }}
        >
          {services.cta.label}
          <span className={styles.ctaCircle}>
            <span />
          </span>
        </motion.a>
      </div>

      {/* Accordion */}
      <motion.div
        className={styles.track}
        initial={{ y: 32, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 1, delay: 0.2, ease: EASE }}
      >
        {services.groups.map((group, i) => {
          const isActive = i === active;
          const number = `/${String(i + 1).padStart(2, '0')}`;
          const description = isActive && hovered !== null ? group.items[hovered].text : group.text;

          return (
            <div key={group.title} className={styles.panel} data-active={isActive}>
              {/* Collapsed face — also the mobile header row */}
              <button
                type="button"
                className={styles.face}
                onClick={() => open(i)}
                aria-expanded={isActive}
                aria-controls={`service-${i}`}
              >
                <span className={styles.faceNumber}>{number}</span>
                <span className={styles.faceTitle}>{group.eyebrow}</span>
                <span className={styles.faceToggle} aria-hidden>
                  <Plus size={12} strokeWidth={2.5} />
                </span>
              </button>

              {/* Expanded body */}
              <div id={`service-${i}`} className={styles.body} aria-hidden={!isActive}>
                <div className={styles.bodyInner}>
                  <div className={styles.media}>
                    <Image
                      src={MEDIA[i]}
                      alt={ui.services.imageAlts[i]}
                      fill
                      sizes="(min-width: 1024px) 70vw, 100vw"
                      className={styles.image}
                      priority={i === 0}
                    />
                    <div className={styles.shade} />
                    <Blueprint />
                  </div>

                  <div className={styles.content}>
                    <AnimatePresence mode="wait">
                      {isActive && (
                        <motion.div
                          key={group.title}
                          initial="hidden"
                          animate="show"
                          exit="hidden"
                          variants={{ show: { transition: { staggerChildren: 0.08, delayChildren: 0.35 } } }}
                        >
                          <motion.span className={styles.contentMeta} variants={reveal}>
                            <span>{number}</span>
                            {group.eyebrow} · {String(group.items.length).padStart(2, '0')} {ui.services.countLabel}
                          </motion.span>

                          <motion.h3 className={styles.contentTitle} variants={reveal}>
                            {group.title}
                          </motion.h3>

                          <motion.div className={styles.contentTextWrap} variants={reveal}>
                            <AnimatePresence mode="wait" initial={false}>
                              <motion.p
                                key={description}
                                className={styles.contentText}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.25, ease: EASE }}
                              >
                                {description}
                              </motion.p>
                            </AnimatePresence>
                          </motion.div>

                          <motion.ul
                            className={styles.pills}
                            variants={reveal}
                            onMouseLeave={() => setHovered(null)}
                          >
                            {group.items.map((item, j) => (
                              <li key={item.title}>
                                <button
                                  type="button"
                                  className={styles.pill}
                                  data-hovered={hovered === j}
                                  onMouseEnter={() => setHovered(j)}
                                  onFocus={() => setHovered(j)}
                                  onBlur={() => setHovered(null)}
                                >
                                  {item.title}
                                </button>
                              </li>
                            ))}
                          </motion.ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </motion.div>
    </section>
  );
}

const reveal = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

/* Thin technical-drawing overlay (orbit rings + nodes), with one brand-blue node. */
function Blueprint() {
  return (
    <svg className={styles.blueprint} viewBox="0 0 800 520" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <g fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1">
        <circle cx="560" cy="170" r="150" strokeDasharray="2 6" />
        <circle cx="560" cy="170" r="92" />
        <path d="M410 170 H710 M560 20 V320" strokeDasharray="1 5" />
        <path d="M455 64 L665 276 M665 64 L455 276" strokeDasharray="1 7" />
        {[
          [560, 20],
          [710, 170],
          [560, 320],
          [410, 170],
          [666, 64],
          [454, 276],
        ].map(([x, y]) => (
          <g key={`${x}-${y}`}>
            <circle cx={x} cy={y} r="14" />
            <circle cx={x} cy={y} r="2" fill="rgba(255,255,255,0.5)" stroke="none" />
          </g>
        ))}
      </g>
      <line x1="560" y1="170" x2="454" y2="276" stroke="#4da3ff" strokeWidth="1" />
      <circle className={styles.node} cx="454" cy="276" r="7" fill="#4da3ff" />
      <circle cx="454" cy="276" r="7" fill="none" stroke="#4da3ff" className={styles.nodePing} />
    </svg>
  );
}
