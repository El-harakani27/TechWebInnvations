'use client';

import { useId, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { motion, type Transition } from 'motion/react';
import { ArrowUpRight, Clock, Globe2, Mail } from 'lucide-react';
import TextLoop, { VIEW_H } from '@/components/text-loop/TextLoop';
import { useLanguage, useSite } from '@/content/i18n';
import styles from './Contact.module.css';

const EASE: Transition['ease'] = [0.16, 1, 0.3, 1];

// Mirror of TextLoop's built-in wave (curviness 40), flipped — so the two ribbons cross.
const CY = VIEW_H / 2;
const AMP = 88;
const FLIPPED_WAVE = `M -320 ${CY} Q -160 ${CY + AMP} 0 ${CY} T 320 ${CY} T 640 ${CY} T 960 ${CY} T 1280 ${CY} T 1520 ${CY}`;

// Keep the mailto: link under what mail clients / browsers reliably accept
const MAILTO_MAX = 1800;

const reveal = (delay = 0) => ({
  initial: { y: 20, opacity: 0 },
  whileInView: { y: 0, opacity: 1 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.85, delay, ease: EASE },
});

export default function Contact() {
  const { contact, locations, ui } = useSite();
  const lang = useLanguage();
  const t = ui.contact;
  const topicsLabelId = useId();
  const topicRefs = useRef<(HTMLButtonElement | null)[]>([]);
  // Arabic is the only RTL language: Left/Right arrows are mirrored there
  const rtl = lang === 'ar';
  // Topic is stored by index so it survives a language switch
  const [topicIndex, setTopicIndex] = useState(0);
  const topic = contact.form.topics[topicIndex];
  const [sent, setSent] = useState(false);

  // Opens the visitor's mail app with the request pre-filled.
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get('name') ?? '');
    const f = t.mailFields;
    const message = String(data.get('message') ?? '');
    const subject = `${t.mailSubject}: ${topic}${name ? ` (${name})` : ''}`;
    const buildUrl = (msg: string) => {
      const lines = [
        `${f.name}: ${name}`,
        `${f.email}: ${data.get('email') ?? ''}`,
        `${f.company}: ${data.get('company') || f.notGiven}`,
        `${f.topic}: ${topic}`,
        '',
        msg,
      ];
      return `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\r\n'))}`;
    };

    let url = buildUrl(message);
    if (url.length > MAILTO_MAX) {
      // Longest message prefix (plus an ellipsis) that still fits
      const fit = (n: number) => {
        let cut = message.slice(0, n);
        // don't split a surrogate pair
        if (/[\uD800-\uDBFF]$/.test(cut)) cut = cut.slice(0, -1);
        return `${cut.trimEnd()}…`;
      };
      let lo = 0;
      let hi = message.length;
      while (lo < hi) {
        const mid = Math.ceil((lo + hi) / 2);
        if (buildUrl(fit(mid)).length <= MAILTO_MAX) lo = mid;
        else hi = mid - 1;
      }
      url = buildUrl(fit(lo));
    }
    window.location.href = url;
    setSent(true);
  };

  // Radio-group keyboard support: arrows move the selection (mirrored Left/Right in RTL)
  const onTopicKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const count = contact.form.topics.length;
    let step = 0;
    if (e.key === 'ArrowDown') step = 1;
    else if (e.key === 'ArrowUp') step = -1;
    else if (e.key === 'ArrowRight') step = rtl ? -1 : 1;
    else if (e.key === 'ArrowLeft') step = rtl ? 1 : -1;
    if (!step) return;
    e.preventDefault();
    const next = (topicIndex + step + count) % count;
    setTopicIndex(next);
    topicRefs.current[next]?.focus();
  };

  return (
    <section id="contact" className={styles.section}>
      {/* Crossing ribbons (decorative: their text repeats nearby content) */}
      <motion.div
        className={styles.loops}
        aria-hidden="true"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 1.2, ease: EASE }}
      >
        <div className={styles.loopsInner}>
          <TextLoop
            text={t.loopServices}
            path={FLIPPED_WAVE}
            separator="✦"
            speed={60}
            direction="reverse"
            fontSize={34}
            fontWeight={500}
            letterSpacing={lang === 'ar' ? 0 : 3}
            color="#ffffff"
            ribbonColor="#10141c"
            ribbonWidth={64}
            className={styles.loop}
          />
          <TextLoop
            text={t.loopMain}
            shape="wave"
            curviness={40}
            separator="✦"
            speed={80}
            fontSize={40}
            fontWeight={600}
            letterSpacing={lang === 'ar' ? 0 : 2}
            color="#ffffff"
            ribbonColor="#1e7fe0"
            ribbonWidth={72}
            className={styles.loop}
          />
        </div>
      </motion.div>

      <div className={styles.inner}>
        {/* Left — intro + details */}
        <div className={styles.intro}>
          <motion.span className={styles.label} {...reveal()}>
            05 / {t.eyebrow}
          </motion.span>
          <motion.h2 className={styles.title} {...reveal(0.1)}>
            {contact.title.replace(/[.。]$/, '')}
            <span className={styles.titleDot}>.</span>
          </motion.h2>
          <motion.p className={styles.lead} {...reveal(0.2)}>
            {contact.lead}
          </motion.p>

          <motion.ul className={styles.details} {...reveal(0.3)}>
            <li>
              <a href={`mailto:${contact.email}`} className={styles.detail}>
                <span className={styles.detailIcon}>
                  <Mail size={15} strokeWidth={1.75} aria-hidden />
                </span>
                <span>
                  <span className={styles.detailLabel}>{t.emailLabel}</span>
                  <span className={styles.detailValue}>{contact.email}</span>
                </span>
                <ArrowUpRight size={16} className={styles.detailArrow} aria-hidden />
              </a>
            </li>
            <li>
              <div className={styles.detail}>
                <span className={styles.detailIcon}>
                  <Clock size={15} strokeWidth={1.75} aria-hidden />
                </span>
                <span>
                  <span className={styles.detailLabel}>{t.responseLabel}</span>
                  <span className={styles.detailValue}>{t.responseValue}</span>
                </span>
              </div>
            </li>
            <li>
              <div className={styles.detail}>
                <span className={styles.detailIcon}>
                  <Globe2 size={15} strokeWidth={1.75} aria-hidden />
                </span>
                <span>
                  <span className={styles.detailLabel}>{t.officesLabel}</span>
                  <span className={styles.detailValue}>
                    {locations.items.map((l) => l.city).join(' · ')} · {t.languagesValue}
                  </span>
                </span>
              </div>
            </li>
          </motion.ul>
        </div>

        {/* Right — form */}
        <motion.form className={styles.form} onSubmit={onSubmit} {...reveal(0.2)}>
          <div className={styles.row}>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>
                {contact.form.fields.name}
                <span aria-hidden="true"> *</span>
              </span>
              <input name="name" type="text" autoComplete="name" required className={styles.input} />
            </label>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>
                {contact.form.fields.email}
                <span aria-hidden="true"> *</span>
              </span>
              <input name="email" type="email" autoComplete="email" required className={styles.input} />
            </label>
          </div>

          <label className={styles.field}>
            <span className={styles.fieldLabel}>{contact.form.fields.company}</span>
            <input name="company" type="text" autoComplete="organization" className={styles.input} />
          </label>

          <fieldset className={styles.field}>
            <legend id={topicsLabelId} className={styles.fieldLabel}>
              {contact.form.fields.topic}
            </legend>
            <div className={styles.topics} role="radiogroup" aria-labelledby={topicsLabelId} onKeyDown={onTopicKey}>
              {contact.form.topics.map((label, i) => (
                <button
                  key={i}
                  ref={(el) => {
                    topicRefs.current[i] = el;
                  }}
                  type="button"
                  role="radio"
                  aria-checked={topicIndex === i}
                  tabIndex={topicIndex === i ? 0 : -1}
                  className={styles.topic}
                  data-selected={topicIndex === i}
                  onClick={() => setTopicIndex(i)}
                >
                  {label}
                </button>
              ))}
            </div>
          </fieldset>

          <label className={styles.field}>
            <span className={styles.fieldLabel}>
              {contact.form.fields.message}
              <span aria-hidden="true"> *</span>
            </span>
            <textarea name="message" rows={5} required className={`${styles.input} ${styles.textarea}`} />
          </label>

          <p className={styles.required}>* {t.required}</p>

          <div className={styles.submitRow}>
            <motion.button type="submit" className={styles.submit} whileTap={{ scale: 0.97 }}>
              {contact.form.submit}
              <span className={styles.submitCircle}>
                <ArrowUpRight size={15} strokeWidth={2} aria-hidden />
              </span>
            </motion.button>
            <p className={styles.note} aria-live="polite">
              {sent ? t.sentNote : t.note}
            </p>
          </div>
        </motion.form>
      </div>
    </section>
  );
}
