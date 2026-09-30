'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, type Transition } from 'motion/react';
import { Check, ChevronDown, Globe } from 'lucide-react';
import { site } from '@/content/site';
import { setLanguage, useLanguage, useSite } from '@/content/i18n';
import styles from './LanguageSwitcher.module.css';

const EASE: Transition['ease'] = [0.16, 1, 0.3, 1];

interface Props {
  /** Open the list below (navbar) or above (footer) the button */
  placement?: 'down' | 'up';
  /** Which edge of the button the list lines up with */
  align?: 'start' | 'end';
  tone?: 'light' | 'dark';
}

export default function LanguageSwitcher({ placement = 'down', align = 'end', tone = 'light' }: Props) {
  const lang = useLanguage();
  const { ui } = useSite();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  // Close on outside click / Escape
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const y = placement === 'down' ? -8 : 8;

  return (
    <div ref={rootRef} className={styles.root} data-tone={tone}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={ui.language.label}
      >
        <Globe size={14} strokeWidth={1.75} />
        <span className={styles.code}>{lang.toUpperCase()}</span>
        <ChevronDown size={13} strokeWidth={2} className={styles.chevron} data-open={open} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className={styles.panel}
            data-placement={placement}
            data-align={align}
            initial={{ opacity: 0, y, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y, scale: 0.97 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <p className={styles.heading}>{ui.language.label}</p>
            <ul id={listId} role="listbox" aria-label={ui.language.label} className={styles.list}>
              {site.languages.map((l) => (
                <li key={l.code}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={l.code === lang}
                    lang={l.code}
                    className={styles.option}
                    onClick={() => {
                      void setLanguage(l.code);
                      setOpen(false);
                    }}
                  >
                    <span className={styles.optionCode}>{l.code.toUpperCase()}</span>
                    <span className={styles.optionLabel}>{l.label}</span>
                    {l.code === lang && <Check size={14} strokeWidth={2.25} className={styles.check} />}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
