'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, type Transition } from 'motion/react';
import { ArrowUp, ArrowUpRight, X } from 'lucide-react';
import { useSite } from '@/content/i18n';
import LanguageSwitcher from '@/components/language/LanguageSwitcher';
import styles from './Footer.module.css';

const EASE: Transition['ease'] = [0.16, 1, 0.3, 1];

type Doc = 'legal' | 'privacy' | null;

export default function Footer() {
  const s = useSite();
  const { ui, footer, legal } = s;
  const [doc, setDoc] = useState<Doc>(null);
  const closeDoc = useCallback(() => setDoc(null), []);

  return (
    <footer className={styles.footer}>
      {/* Statement + call to action */}
      <div className={styles.top}>
        <motion.h2
          className={styles.statement}
          initial={{ y: 24, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          {s.hero.title}
        </motion.h2>

        <motion.div
          className={styles.topActions}
          initial={{ y: 16, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
        >
          <a href="#contact" className={styles.cta}>
            {ui.menu.cta}
            <span className={styles.ctaCircle}>
              <ArrowUpRight size={15} strokeWidth={2} aria-hidden />
            </span>
          </a>
          <a href={`mailto:${footer.email}`} className={styles.email}>
            {footer.email}
          </a>
        </motion.div>
      </div>

      {/* Columns */}
      <div className={styles.columns}>
        <div className={styles.brand}>
          <Image src={s.brand.logo} alt={s.brand.logoAlt} width={320} height={138} className={styles.logo} />
          <p className={styles.brandText}>{s.services.lead}</p>
        </div>

        <nav className={styles.col} aria-label={ui.footer.navigation}>
          <h3 className={styles.colTitle}>{ui.footer.navigation}</h3>
          <ul>
            {s.nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} className={styles.link}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.col}>
          <h3 className={styles.colTitle}>{ui.footer.services}</h3>
          <ul>
            {s.services.groups.map((g) => (
              <li key={g.title}>
                <a href="#services" className={styles.link}>
                  {g.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.col}>
          <h3 className={styles.colTitle}>{ui.footer.offices}</h3>
          <ul className={styles.offices}>
            {s.locations.items.map((l, i) => (
              <li key={l.countryCode}>
                <span className={styles.officeCity}>
                  {l.city}, {l.country}
                </span>
                <span className={styles.officeCompany}>{l.company}</span>
                {i === 0 && <span className={styles.officeAddress}>{legal.address[0]}</span>}
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.col}>
          <h3 className={styles.colTitle}>{ui.footer.contact}</h3>
          <ul>
            <li>
              <a href={`mailto:${footer.email}`} className={styles.link}>
                {footer.email}
              </a>
            </li>
            <li>
              <a href={`tel:${legal.phone.replace(/\s/g, '')}`} className={styles.link}>
                {legal.phone}
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className={styles.bottom}>
        <p className={styles.copyright}>{footer.copyright}</p>

        <div className={styles.bottomLinks}>
          <button type="button" className={styles.textButton} onClick={() => setDoc('legal')}>
            {footer.links[0]}
          </button>
          <button type="button" className={styles.textButton} onClick={() => setDoc('privacy')}>
            {footer.links[1]}
          </button>
        </div>

        <div className={styles.bottomActions}>
          <LanguageSwitcher placement="up" tone="dark" />
          <a href="#top" className={styles.backToTop} aria-label={ui.footer.backToTop}>
            <ArrowUp size={15} strokeWidth={2} aria-hidden />
          </a>
        </div>
      </div>

      {/* Oversized wordmark */}
      <div className={styles.wordmark} aria-hidden>
        {s.brand.name}
      </div>

      <LegalModal doc={doc} onClose={closeDoc} />
    </footer>
  );
}

/* ---------- Legal Notice / Privacy Policy dialog ---------- */

function LegalModal({ doc, onClose }: { doc: Doc; onClose: () => void }) {
  const { legal, privacy, ui } = useSite();
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = `legal-title-${useId().replace(/:/g, '')}`;

  useEffect(() => {
    if (!doc) return;
    // Remember what opened the dialog so focus can go back there on close (WCAG 2.4.3)
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'));
      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (!dialog.contains(active)) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
      } else if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
      if (opener && opener.isConnected) opener.focus();
    };
  }, [doc, onClose]);

  const title = doc === 'legal' ? legal.title : privacy.title;

  return (
    <AnimatePresence>
      {doc && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className={styles.dialog}
            initial={{ y: 24, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 16, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.45, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.dialogHead}>
              <h2 id={titleId} className={styles.dialogTitle}>{title}</h2>
              <button ref={closeRef} type="button" className={styles.close} onClick={onClose} aria-label={ui.footer.close}>
                <X size={16} strokeWidth={2} aria-hidden />
              </button>
            </div>

            <div className={styles.dialogBody}>
              {doc === 'legal' ? (
                <>
                  <p className={styles.muted}>{legal.intro}</p>
                  <p>
                    <strong>{legal.company}</strong>
                    {legal.address.map((line) => (
                      <span key={line} className={styles.block}>
                        {line}
                      </span>
                    ))}
                  </p>
                  <h3>{ui.legal.contact}</h3>
                  <p>
                    {ui.legal.email}: <a href={`mailto:${legal.email}`}>{legal.email}</a>
                    <span className={styles.block}>
                      {ui.legal.phone}: <a href={`tel:${legal.phone.replace(/\s/g, '')}`}>{legal.phone}</a>
                    </span>
                  </p>
                  <p>
                    {ui.legal.representedBy}: {legal.representedBy}
                    <span className={styles.block}>
                      {ui.legal.registration}: {legal.registrationNumber}
                    </span>
                    <span className={styles.block}>
                      {ui.legal.responsible}: {legal.responsibleForContent}
                    </span>
                  </p>
                </>
              ) : (
                <>
                  <p className={styles.muted}>{privacy.intro}</p>
                  {privacy.sections.map((sec) => (
                    <section key={sec.title}>
                      <h3>{sec.title}</h3>
                      <p>{sec.text}</p>
                    </section>
                  ))}
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
