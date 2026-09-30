'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, type Transition } from 'motion/react';
import { useSite } from '@/content/i18n';
import Globe, { type GlobePoint } from './Globe';
import styles from './Locations.module.css';

const EASE: Transition['ease'] = [0.16, 1, 0.3, 1];


/** Live local time for a time zone. Renders placeholders on the server to avoid a hydration mismatch. */
function LocalTime({ timeZone }: { timeZone: string }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const [hh, mm] = now
    ? new Intl.DateTimeFormat('en-GB', { timeZone, hour: '2-digit', minute: '2-digit', hour12: false })
        .format(now)
        .split(':')
    : ['--', '--'];
  const offset = now
    ? new Intl.DateTimeFormat('en-US', { timeZone, timeZoneName: 'shortOffset' })
        .formatToParts(now)
        .find((p) => p.type === 'timeZoneName')?.value
    : 'GMT';

  return (
    <span className={styles.time}>
      <span className={styles.timeValue}>
        {hh}
        <span className={styles.timeColon}>:</span>
        {mm}
      </span>
      <span className={styles.timeZone}>{offset}</span>
    </span>
  );
}

export default function Locations() {
  const { locations } = useSite();
  const [first, second] = locations.items;
  const globePoints = useMemo<[GlobePoint, GlobePoint]>(
    () => [
      { label: first.city, ...first.coords },
      { label: second.city, ...second.coords },
    ],
    [first, second],
  );

  // Hovering a card turns the globe towards that office
  const [focus, setFocus] = useState<number | null>(null);

  return (
    <section id="locations" className={styles.section}>
      <div className={styles.header}>
        <div className={styles.headerMain}>
          <motion.span
            className={styles.label}
            initial={{ y: 16, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            04 / {locations.eyebrow}
          </motion.span>

          <motion.h2
            className={styles.title}
            initial={{ y: 24, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
          >
            {locations.title}
            <span className={styles.titleDot}>.</span>
          </motion.h2>

          <motion.p
            className={styles.lead}
            initial={{ y: 16, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
          >
            {locations.lead}
          </motion.p>
        </div>

        <motion.a
          href={locations.cta.href}
          className={styles.cta}
          initial={{ y: 16, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
          whileTap={{ scale: 0.97 }}
        >
          {locations.cta.label}
          <span className={styles.ctaCircle}>
            <span />
          </span>
        </motion.a>
      </div>

      <div className={styles.grid}>
        <motion.div
          className={styles.globeFrame}
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1.4, ease: EASE }}
        >
          <Globe points={globePoints} focus={focus} className={styles.globe} />
          <span className={styles.globeCaption}>
            {first.city} ⟷ {second.city}
          </span>
        </motion.div>

        <div className={styles.cards}>
          {locations.items.map((loc, i) => (
            <motion.article
              key={loc.city}
              className={styles.card}
              data-focus={focus === i}
              onMouseEnter={() => setFocus(i)}
              onMouseLeave={() => setFocus(null)}
              initial={{ y: 28, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.9, delay: 0.15 + i * 0.12, ease: EASE }}
            >
              <div className={styles.cardTop}>
                <span className={styles.region}>
                  <span className={styles.code}>{loc.countryCode}</span>
                  {loc.region}
                </span>
                <LocalTime timeZone={loc.timeZone} />
              </div>

              <h3 className={styles.city}>
                {loc.city}
                <span className={styles.country}>{loc.country}</span>
              </h3>
              <p className={styles.company}>{loc.company}</p>
              <p className={styles.text}>{loc.text}</p>

              <div className={styles.cardBottom}>
                <ul className={styles.tags}>
                  {loc.tag.split(' · ').map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
                <span className={styles.coords}>
                  {loc.coords.lat.toFixed(2)}° N, {loc.coords.lon.toFixed(2)}° E
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
