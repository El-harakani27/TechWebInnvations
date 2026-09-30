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
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listId = useId();
  const currentName = site.languages.find((l) => l.code === lang)?.label ?? lang.toUpperCase();

  // Close on outside click / Escape (Escape hands focus back to the trigger)
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      triggerRef.current?.focus();
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const y = placement === 'down' ? -8 : 8;

  return (
    <div
      ref={rootRef}
      className={styles.root}
      data-tone={tone}
      onBlur={(e) => {
        // Keyboard focus left the switcher: close the panel
        const next = e.relatedTarget as Node | null;
        if (open && next && !e.currentTarget.contains(next)) setOpen(false);
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        className={styles.trigger}
        data-lang-trigger
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={listId}
        aria-label={`${ui.language.label}: ${currentName}`}
      >
        <Globe size={14} strokeWidth={1.75} aria-hidden />
        <span className={styles.code}>{lang.toUpperCase()}</span>
        <ChevronDown size={13} strokeWidth={2} className={styles.chevron} data-open={open} aria-hidden />
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
            <ul id={listId} aria-label={ui.language.label} className={styles.list}>
              {site.languages.map((l) => (
                <li key={l.code}>
                  <button
                    type="button"
                    lang={l.code}
                    data-lang-option={l.code}
                    aria-current={l.code === lang ? 'true' : undefined}
                    className={styles.option}
                    onClick={() => {
                      void setLanguage(l.code);
                      setOpen(false);
                      triggerRef.current?.focus();
                    }}
                  >
                    <span className={styles.optionCode}>{l.code.toUpperCase()}</span>
                    <span className={styles.optionLabel}>{l.label}</span>
                    {l.code === lang && <Check size={14} strokeWidth={2.25} className={styles.check} aria-hidden />}
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
