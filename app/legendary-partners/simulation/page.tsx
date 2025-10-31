"use client";

import styles from "./page.module.css";

const RECHARGE_TO_MIRA = 100;
const SETTLEMENT_RATIO = 0.7;
const UPLINE_SHARE_RATIO = 0.2;

type Tier = {
  name: string;
  threshold: number;
  coinRate: number;
  cashRate: number;
};

const tiers: Tier[] = [
  { name: "米拉萌芽", threshold: 0, coinRate: 0, cashRate: 0 },
  { name: "米拉一星", threshold: 100_000, coinRate: 0.05, cashRate: 0 },
  { name: "米拉二星", threshold: 500_000, coinRate: 0.1, cashRate: 0 },
  { name: "米拉三星", threshold: 1_000_000, coinRate: 0.12, cashRate: 0 },
  { name: "米拉四星", threshold: 5_000_000, coinRate: 0.15, cashRate: 0 },
  { name: "米拉五星", threshold: 10_000_000, coinRate: 0.18, cashRate: 0 },
  { name: "米拉六星", threshold: 30_000_000, coinRate: 0.2, cashRate: 0 },
  { name: "米拉合伙人", threshold: 50_000_000, coinRate: 0, cashRate: 0.3 },
  { name: "传奇合伙人", threshold: 100_000_000, coinRate: 0, cashRate: 0.4 },
  { name: "殿堂合伙人", threshold: 200_000_000, coinRate: 0, cashRate: 0.5 },
  { name: "特约股东", threshold: 500_000_000, coinRate: 0, cashRate: 0.7 },
  { name: "名人堂", threshold: 1_000_000_000, coinRate: 0, cashRate: 0.8 }
];

type MonthInput = {
  label: string;
  selfRecharge: number;
  uplineRecharge: number;
  downlineRecharge: number;
};

const months: MonthInput[] = [
  {
    label: "第一个月",
    selfRecharge: 10_000,
    uplineRecharge: 0,
    downlineRecharge: 10_000
  },
  {
    label: "第二个月",
    selfRecharge: 100_000,
    uplineRecharge: 0,
    downlineRecharge: 200_000
  },
  {
    label: "第三个月",
    selfRecharge: 200_000,
    uplineRecharge: 0,
    downlineRecharge: 300_000
  }
];

type MonthResult = {
  month: MonthInput;
  monthMira: number;
  cumulativeMira: number;
  tier: Tier;
  coinReward: number;
  cashReward: number;
  assumptions: {
    downlineRateType: "coin" | "cash";
    downlineRateValue: number;
  };
  calculations: {
    mira: string[];
    tier: string[];
    coin: string[];
    cash: string[];
  };
};

function getTier(totalMira: number) {
  let current = tiers[0];
  for (const tier of tiers) {
    if (totalMira >= tier.threshold) {
      current = tier;
    } else {
      break;
    }
  }
  return current;
}

function formatNumber(value: number) {
  return value.toLocaleString("zh-CN", {
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2
  });
}

function formatCurrency(value: number) {
  return `¥${value.toLocaleString("zh-CN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  })}`;
}

function formatPercent(value: number) {
  return `${(value * 100).toLocaleString("zh-CN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  })}%`;
}

const monthResults = months.reduce<MonthResult[]>((acc, month) => {
  const previousTotal = acc.length ? acc[acc.length - 1].cumulativeMira : 0;
  const selfMira = month.selfRecharge * RECHARGE_TO_MIRA;
  const teamMira = month.downlineRecharge * RECHARGE_TO_MIRA;
  const monthMira = selfMira + teamMira;
  const cumulativeMira = previousTotal + monthMira;
  const tier = getTier(cumulativeMira);

  const downlineRateType = tier.cashRate > 0 ? "cash" : "coin";
  const downlineRateValue = downlineRateType === "cash" ? tier.cashRate : tier.coinRate;

  const selfCoin =
    tier.coinRate > 0 ? month.selfRecharge * SETTLEMENT_RATIO * tier.coinRate : 0;
  const selfCash =
    tier.cashRate > 0 ? month.selfRecharge * SETTLEMENT_RATIO * tier.cashRate : 0;

  const downlineSettlement =
    month.downlineRecharge * SETTLEMENT_RATIO * downlineRateValue;
  const uplineShare = downlineSettlement * UPLINE_SHARE_RATIO;

  const teamCoin = downlineRateType === "coin" ? uplineShare : 0;
  const teamCash = downlineRateType === "cash" ? uplineShare : 0;

  const miraSteps = [
    `本人充值 ${formatCurrency(month.selfRecharge)} × ${RECHARGE_TO_MIRA.toLocaleString()} = ${formatNumber(selfMira)} 米拉`,
    `团队充值 ${formatCurrency(month.downlineRecharge)} × ${RECHARGE_TO_MIRA.toLocaleString()} = ${formatNumber(teamMira)} 米拉`,
    `当月新增米拉 = ${formatNumber(selfMira)} + ${formatNumber(teamMira)} = ${formatNumber(monthMira)} 米拉`,
    `累计米拉 = ${formatNumber(previousTotal)} + ${formatNumber(monthMira)} = ${formatNumber(cumulativeMira)} 米拉`
  ];

  const tierSteps = [
    `累计米拉达到 ${formatNumber(cumulativeMira)}，超过 ${formatNumber(tier.threshold)} 阈值，星级定位为「${tier.name}」`
  ];

  const coinSteps: string[] = [];
  const coinParts: string[] = [];
  if (tier.coinRate > 0 && month.selfRecharge > 0) {
    coinSteps.push(
      `本人结算：${formatCurrency(month.selfRecharge)} × ${formatPercent(
        SETTLEMENT_RATIO
      )} × ${formatPercent(tier.coinRate)} = ${formatNumber(selfCoin)} 枚 COIN`
    );
    coinParts.push(`${formatNumber(selfCoin)} 枚`);
  }
  if (downlineRateType === "coin" && month.downlineRecharge > 0) {
    coinSteps.push(
      `团队结算：${formatCurrency(month.downlineRecharge)} × ${formatPercent(
        SETTLEMENT_RATIO
      )} × ${formatPercent(downlineRateValue)} = ${formatNumber(downlineSettlement)}`
    );
    coinSteps.push(
      `上级分配：${formatNumber(downlineSettlement)} × ${formatPercent(
        UPLINE_SHARE_RATIO
      )} = ${formatNumber(uplineShare)}`
    );
    coinParts.push(`${formatNumber(uplineShare)} 枚`);
  }
  coinSteps.push(
    `当月 COIN 返利 = ${
      coinParts.length ? `${coinParts.join(" + ")} = ${formatNumber(selfCoin + teamCoin)} 枚` : "0 枚"
    }`
  );

  const cashSteps: string[] = [];
  const cashParts: string[] = [];
  if (tier.cashRate > 0 && month.selfRecharge > 0) {
    cashSteps.push(
      `本人结算：${formatCurrency(month.selfRecharge)} × ${formatPercent(
        SETTLEMENT_RATIO
      )} × ${formatPercent(tier.cashRate)} = ${formatCurrency(selfCash)}`
    );
    cashParts.push(formatCurrency(selfCash));
  }
  if (downlineRateType === "cash" && month.downlineRecharge > 0) {
    cashSteps.push(
      `团队结算：${formatCurrency(month.downlineRecharge)} × ${formatPercent(
        SETTLEMENT_RATIO
      )} × ${formatPercent(downlineRateValue)} = ${formatCurrency(downlineSettlement)}`
    );
    cashSteps.push(
      `上级分配：${formatCurrency(downlineSettlement)} × ${formatPercent(
        UPLINE_SHARE_RATIO
      )} = ${formatCurrency(uplineShare)}`
    );
    cashParts.push(formatCurrency(uplineShare));
  }
  cashSteps.push(
    `当月现金分成 = ${
      cashParts.length ? `${cashParts.join(" + ")} = ${formatCurrency(selfCash + teamCash)}` : "¥0"
    }`
  );

  acc.push({
    month,
    monthMira,
    cumulativeMira,
    tier,
    coinReward: selfCoin + teamCoin,
    cashReward: selfCash + teamCash,
    assumptions: {
      downlineRateType,
      downlineRateValue
    },
    calculations: {
      mira: miraSteps,
      tier: tierSteps,
      coin: coinSteps,
      cash: cashSteps
    }
  });

  return acc;
}, []);

const totals = monthResults.reduce(
  (result, current) => {
    result.coin += current.coinReward;
    result.cash += current.cashReward;
    return result;
  },
  { coin: 0, cash: 0 }
);

export default function SimulationPage() {
  return (
    <main className={styles.wrapper}>
      <header className={styles.hero}>
        <span className={styles.tagline}>三个月成长模拟</span>
        <h1>米拉星级晋升与返利收益示例</h1>
        <p>
          以下模拟展示某位合伙人在三个月内通过自充与团队充值累积米拉积分，触发星级晋升，并按规则获得 COIN
          返利或现金分成的过程。所有数据基于官方结算公式，并依赖若干前置假设。
        </p>
      </header>

      <section className={styles.section}>
        <h2>关键假设</h2>
        <ul className={styles.assumptionList}>
          <li>全部充值渠道均为官网/官方游戏包，结算比例统一为 70%。</li>
          <li>用户无上线，故自充结算金额 100% 归本人；团队直接下级与本人星级同步。</li>
          <li>上线分配按规则固定为 20%，充值账号获得剩余 80%，并与账号结算方式一致。</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>月度晋级与返利</h2>
        <div className={styles.timeline}>
          {monthResults.map((result) => (
            <article key={result.month.label} className={styles.timelineCard}>
              <div className={styles.timelineHeader}>
                <h3>{result.month.label}</h3>
                <span className={styles.tierBadge}>{result.tier.name}</span>
              </div>
              <dl className={styles.metricList}>
                <div>
                  <dt>当月新增米拉</dt>
                  <dd>{formatNumber(result.monthMira)}</dd>
                </div>
                <div>
                  <dt>累计米拉</dt>
                  <dd>{formatNumber(result.cumulativeMira)}</dd>
                </div>
                <div>
                  <dt>星级结算方式</dt>
                  <dd>
                    {result.tier.cashRate > 0
                      ? `现金 ${formatNumber(result.tier.cashRate * 100)}%`
                      : `COIN ${formatNumber(result.tier.coinRate * 100)}%`}
                    <span className={styles.metricNote}>
                      团队结算同向，按 {formatNumber(UPLINE_SHARE_RATIO * 100)}% 分配至本人
                    </span>
                  </dd>
                </div>
                <div>
                  <dt>当月 COIN 返利</dt>
                  <dd>{result.coinReward > 0 ? `${formatNumber(result.coinReward)} 枚` : "—"}</dd>
                </div>
                <div>
                  <dt>当月现金分成</dt>
                  <dd>
                    {result.cashReward > 0 ? `¥${formatNumber(result.cashReward)}` : "—"}
                  </dd>
                </div>
              </dl>
              <div className={styles.calculationBlock}>
                <h4>计算过程</h4>
                <div className={styles.calcGroup}>
                  <span className={styles.calcTitle}>米拉累计</span>
                  <ul>
                    {result.calculations.mira.map((item) => (
                      <li key={`mira-${item}`}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className={styles.calcGroup}>
                  <span className={styles.calcTitle}>星级判定</span>
                  <ul>
                    {result.calculations.tier.map((item) => (
                      <li key={`tier-${item}`}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className={styles.calcGroup}>
                  <span className={styles.calcTitle}>COIN 返利</span>
                  <ul>
                    {result.calculations.coin.map((item) => (
                      <li key={`coin-${item}`}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className={styles.calcGroup}>
                  <span className={styles.calcTitle}>现金分成</span>
                  <ul>
                    {result.calculations.cash.map((item) => (
                      <li key={`cash-${item}`}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2>收益汇总</h2>
        <div className={styles.summaryCard}>
          <div>
            <span className={styles.summaryLabel}>三个月累计 COIN 返利</span>
            <strong>{formatNumber(totals.coin)} 枚</strong>
          </div>
          <div>
            <span className={styles.summaryLabel}>三个月累计现金分成</span>
            <strong>¥{formatNumber(totals.cash)}</strong>
          </div>
        </div>
        <div className={styles.tableWrapper}>
          <table className={styles.detailTable}>
            <thead>
              <tr>
                <th>月份</th>
                <th>本人充值</th>
                <th>下线充值</th>
                <th>当月米拉</th>
                <th>累计米拉</th>
                <th>星级</th>
                <th>COIN 返利</th>
                <th>现金分成</th>
              </tr>
            </thead>
            <tbody>
              {monthResults.map((result) => (
                <tr key={`${result.month.label}-table`}>
                  <td>{result.month.label}</td>
                  <td>¥{formatNumber(result.month.selfRecharge)}</td>
                  <td>¥{formatNumber(result.month.downlineRecharge)}</td>
                  <td>{formatNumber(result.monthMira)}</td>
                  <td>{formatNumber(result.cumulativeMira)}</td>
                  <td>{result.tier.name}</td>
                  <td>
                    {result.coinReward > 0 ? `${formatNumber(result.coinReward)} 枚` : "—"}
                  </td>
                  <td>
                    {result.cashReward > 0 ? `¥${formatNumber(result.cashReward)}` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className={styles.footnote}>
          ※ 本示例仅用于展示结算逻辑，实际结算结果将受渠道类型、团队结构、风控校验等因素影响。
        </p>
      </section>
    </main>
  );
}
