"use client";

import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <h1 className={styles.title}>Welcome to your local Next.js project</h1>
        <p className={styles.subtitle}>
          This starter was assembled locally so you can begin building right away.
        </p>
        <div className={styles.links}>
          <Link href="https://nextjs.org/docs" className={styles.link}>
            Next.js Docs
          </Link>
          <Link href="https://react.dev/learn" className={styles.link}>
            React Docs
          </Link>
        </div>
      </section>
    </main>
  );
}
