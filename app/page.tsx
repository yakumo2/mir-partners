"use client";

import Link from "next/link";
import styles from "./page.module.css";

const sections = [
  {
    title: "传奇合伙人计划",
    description: "查看计划定位、米拉体系、星级权益与结算规则的完整说明。",
    href: "/legendary-partners"
  },
  {
    title: "三个月成长模拟",
    description: "了解示例合伙人在三个月内的积分晋升、返利计算过程。",
    href: "/legendary-partners/simulation"
  }
];

export default function Home() {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <h1 className={styles.title}>传奇合伙人计划</h1>
        <p className={styles.subtitle}>
          深入了解米拉成长体系，并演练合伙人晋级与收益分配的完整流程。
        </p>
        <div className={styles.links}>
          {sections.map((section) => (
            <Link key={section.href} href={section.href} className={styles.link}>
              <span className={styles.linkTitle}>{section.title}</span>
              <span className={styles.linkDescription}>{section.description}</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
