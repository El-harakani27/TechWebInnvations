import Link from 'next/link';
import styles from './status.module.css';

export default function NotFound() {
  return (
    <main className={styles.page}>
      <p className={styles.code}>404</p>
      <h1 className={styles.title}>
        Page not found<span className={styles.dot}>.</span>
      </h1>
      <p className={styles.text}>The page you are looking for doesn&apos;t exist or has moved.</p>
      <Link href="/" className={styles.button}>
        Back to home
      </Link>
    </main>
  );
}
