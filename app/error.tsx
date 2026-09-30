'use client';

import { useEffect } from 'react';
import styles from './status.module.css';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className={styles.page}>
      <p className={styles.code}>Error</p>
      <h1 className={styles.title}>
        Something went wrong<span className={styles.dot}>.</span>
      </h1>
      <p className={styles.text}>Please try again. If it keeps happening, email info@techwebinnovations.com.</p>
      <button type="button" onClick={reset} className={styles.button}>
        Try again
      </button>
    </main>
  );
}
