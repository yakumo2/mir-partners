"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./page.module.css";

const RECHARGE_TO_MIRA = 100;
const SETTLEMENT_RATIO = 0.7;
const DEFAULT_UPLINE_SHARE = 0.2;

type Tier = {
  name: string;
  threshold: number;
  kind: "coin" | "cash";
  coinRate: number;
  cashRate: number;
};

const baseTiers: Tier[] = [
  { name: "米拉萌芽", threshold: 0, kind: "coin", coinRate: 0, cashRate: 0 },
  { name: "米拉一星", threshold: 100_000, kind: "coin", coinRate: 0.05, cashRate: 0 },
  { name: "米拉二星", threshold: 500_000, kind: "coin", coinRate: 0.1, cashRate: 0 },
  { name: "米拉三星", threshold: 1_000_000, kind: "coin", coinRate: 0.12, cashRate: 0 },
  { name: "米拉四星", threshold: 5_000_000, kind: "coin", coinRate: 0.15, cashRate: 0 },
  { name: "米拉五星", threshold: 10_000_000, kind: "coin", coinRate: 0.18, cashRate: 0 },
  { name: "米拉六星", threshold: 30_000_000, kind: "coin", coinRate: 0.2, cashRate: 0 },
  { name: "米拉合伙人", threshold: 50_000_000, kind: "cash", coinRate: 0, cashRate: 0.3 },
  { name: "传奇合伙人", threshold: 100_000_000, kind: "cash", coinRate: 0, cashRate: 0.4 },
  { name: "殿堂合伙人", threshold: 200_000_000, kind: "cash", coinRate: 0, cashRate: 0.5 },
  { name: "特约股东", threshold: 500_000_000, kind: "cash", coinRate: 0, cashRate: 0.7 },
  { name: "名人堂", threshold: 1_000_000_000, kind: "cash", coinRate: 0, cashRate: 0.8 }
];

type MonthInput = {
  label: string;
  selfRecharge: number;
  downlineRecharge: number;
};

const defaultMonths: MonthInput[] = [
  {
    label: "第一个月",
    selfRecharge: 10_000,
    downlineRecharge: 10_000
  },
  {
    label: "第二个月",
    selfRecharge: 100_000,
    downlineRecharge: 200_000
  },
  {
    label: "第三个月",
    selfRecharge: 200_000,
    downlineRecharge: 300_000
  }
];

type MonthResult = {
  month: MonthInput;
  monthMira: number;
  cumulativeMira: number;
  tier: Tier;
  tierChange: {
    previous: Tier;
    current: Tier;
    promotion?: Tier;
    degraded?: Tier;
    missStreak: number;
  };
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

function computeMonthResults(
  months: MonthInput[],
  tiers: Tier[],
  uplineShareRatio: number,
  upstreamShareRatio = 0
): MonthResult[] {
  let currentTierIndex = 0;
  let missStreak = 0;
  let statusMira = 0;

  const effectiveUplineShare = Math.min(1, Math.max(0, uplineShareRatio));
  const effectiveUpstreamShare = Math.min(1, Math.max(0, upstreamShareRatio));
  const retainFactor = 1 - effectiveUpstreamShare;

  return months.reduce<MonthResult[]>((acc, month) => {
    const previousTotal = acc.length ? acc[acc.length - 1].cumulativeMira : 0;
    const previousTier = tiers[currentTierIndex];
    const selfMira = month.selfRecharge * RECHARGE_TO_MIRA;
    const teamMira = month.downlineRecharge * RECHARGE_TO_MIRA;
    const monthMira = selfMira + teamMira;
    const cumulativeMira = previousTotal + monthMira;
    statusMira += monthMira;

    const potentialTierIndex = (() => {
      let index = currentTierIndex;
      while (
        index + 1 < tiers.length &&
        statusMira >= tiers[index + 1].threshold &&
        tiers[index + 1].threshold > 0
      ) {
        index += 1;
      }
      return index;
    })();

    let promotion: Tier | undefined;
    let degraded: Tier | undefined;

    if (potentialTierIndex > currentTierIndex) {
      currentTierIndex = potentialTierIndex;
      promotion = tiers[currentTierIndex];
      missStreak = 0;
    } else {
      const currentThreshold = tiers[currentTierIndex].threshold;
      if (currentThreshold > 0 && monthMira < currentThreshold * 0.2) {
        missStreak += 1;
        if (missStreak >= 2 && currentTierIndex > 0) {
          currentTierIndex -= 1;
          degraded = tiers[currentTierIndex];
          missStreak = 0;
          statusMira = Math.min(statusMira, tiers[currentTierIndex].threshold);
        }
      } else {
        missStreak = 0;
      }
    }

    const tierCurrent = tiers[currentTierIndex];

    const downlineRateType = tierCurrent.kind === "cash" ? "cash" : "coin";
    const downlineRateValue =
      downlineRateType === "cash" ? tierCurrent.cashRate : tierCurrent.coinRate;

    const downlineSettlement =
      month.downlineRecharge * SETTLEMENT_RATIO * downlineRateValue;
    const uplineShare = downlineSettlement * effectiveUplineShare;

    const teamCoin = downlineRateType === "coin" ? uplineShare : 0;
    const teamCash = downlineRateType === "cash" ? uplineShare : 0;

    const rawSelfCoin =
      tierCurrent.kind === "coin"
        ? month.selfRecharge * SETTLEMENT_RATIO * tierCurrent.coinRate
        : 0;
    const rawSelfCash =
      tierCurrent.kind === "cash"
        ? month.selfRecharge * SETTLEMENT_RATIO * tierCurrent.cashRate
        : 0;

    const selfCoin = tierCurrent.kind === "coin" ? rawSelfCoin * retainFactor : 0;
    const selfCash = tierCurrent.kind === "cash" ? rawSelfCash * retainFactor : 0;

    const miraSteps = [
      `本人充值 ${formatCurrency(month.selfRecharge)} × ${RECHARGE_TO_MIRA.toLocaleString()} = ${formatNumber(selfMira)} 米拉`,
      `团队充值 ${formatCurrency(month.downlineRecharge)} × ${RECHARGE_TO_MIRA.toLocaleString()} = ${formatNumber(teamMira)} 米拉`,
      `当月新增米拉 = ${formatNumber(selfMira)} + ${formatNumber(teamMira)} = ${formatNumber(monthMira)} 米拉`,
      `累计米拉 = ${formatNumber(previousTotal)} + ${formatNumber(monthMira)} = ${formatNumber(cumulativeMira)} 米拉`
    ];

    const tierSteps: string[] = [];
    tierSteps.push(
      `期初星级：${previousTier.name}，当月新增米拉 ${formatNumber(monthMira)}，累计米拉 ${formatNumber(
        cumulativeMira
      )}`
    );

    const upcomingTier = tiers[currentTierIndex + 1];

    if (promotion) {
      tierSteps.push(
        `累计米拉达到 ${formatNumber(cumulativeMira)} ≥ ${formatNumber(
          promotion.threshold
        )}，晋级为「${promotion.name}」`
      );
    } else if (degraded) {
      const thresholdForCheck = previousTier.threshold;
      tierSteps.push(
        `连续两月新增米拉未达到当前星级 ${previousTier.name} 阈值 ${formatNumber(
          thresholdForCheck
        )} 的 20%（即 ${formatNumber(thresholdForCheck * 0.2)}），触发保级失败，降级为「${degraded.name}」`
      );
      tierSteps.push(`降级后有效累计积分回调至 ${formatNumber(statusMira)} 米拉`);
    } else {
      if (upcomingTier) {
        tierSteps.push(
          `未达到下一星级 ${upcomingTier.name} 的阈值 ${formatNumber(
            upcomingTier.threshold
          )}，保持「${
            tierCurrent.name
          }」`
        );
      } else {
        tierSteps.push(`已达到最高等级，保持「${tierCurrent.name}」`);
      }
      if (tierCurrent.threshold > 0) {
        tierSteps.push(
          `保级判定：本月新增米拉 ${formatNumber(monthMira)} ${
            monthMira >= tierCurrent.threshold * 0.2 ? "≥" : "<"
          } 当前星级阈值 20%（${formatNumber(tierCurrent.threshold * 0.2)}），${
            monthMira >= tierCurrent.threshold * 0.2 ? "保级成功" : `连续未达标次数：${missStreak}`
          }`
        );
      }
    }

    const coinSegments: number[] = [];
    const coinStepDetails: string[] = [];
    if (tierCurrent.kind === "coin" && rawSelfCoin > 0) {
      coinStepDetails.push(
        `本人结算：${formatCurrency(month.selfRecharge)} × ${formatPercent(
          SETTLEMENT_RATIO
        )} × ${formatPercent(tierCurrent.coinRate)} = ${formatNumber(rawSelfCoin)} 枚 COIN`
      );
      if (effectiveUpstreamShare > 0) {
        coinStepDetails.push(
          `自留比例：${formatNumber(rawSelfCoin)} × ${formatPercent(retainFactor)} = ${formatNumber(selfCoin)} 枚`
        );
      }
      coinSegments.push(selfCoin);
    }
    if (downlineRateType === "coin" && month.downlineRecharge > 0) {
      coinStepDetails.push(
        `团队结算：${formatCurrency(month.downlineRecharge)} × ${formatPercent(
          SETTLEMENT_RATIO
        )} × ${formatPercent(downlineRateValue)} = ${formatNumber(downlineSettlement)}`
      );
      coinStepDetails.push(
        `上级分配：${formatNumber(downlineSettlement)} × ${formatPercent(
          effectiveUplineShare
        )} = ${formatNumber(uplineShare)}`
      );
      coinSegments.push(uplineShare);
    }
    const coinTotal = coinSegments.reduce((sum, value) => sum + value, 0);
    coinStepDetails.push(
      `当月 COIN 返利 = ${
        coinSegments.length
          ? `${coinSegments.map((value) => `${formatNumber(value)} 枚`).join(" + ")} = ${formatNumber(coinTotal)} 枚`
          : "0 枚"
      }`
    );

    const cashSegments: number[] = [];
    const cashStepDetails: string[] = [];
    if (tierCurrent.kind === "cash" && rawSelfCash > 0) {
      cashStepDetails.push(
        `本人结算：${formatCurrency(month.selfRecharge)} × ${formatPercent(
          SETTLEMENT_RATIO
        )} × ${formatPercent(tierCurrent.cashRate)} = ${formatCurrency(rawSelfCash)}`
      );
      if (effectiveUpstreamShare > 0) {
        cashStepDetails.push(
          `自留比例：${formatCurrency(rawSelfCash)} × ${formatPercent(retainFactor)} = ${formatCurrency(selfCash)}`
        );
      }
      cashSegments.push(selfCash);
    }
    if (downlineRateType === "cash" && month.downlineRecharge > 0) {
      cashStepDetails.push(
        `团队结算：${formatCurrency(month.downlineRecharge)} × ${formatPercent(
          SETTLEMENT_RATIO
        )} × ${formatPercent(downlineRateValue)} = ${formatCurrency(downlineSettlement)}`
      );
      cashStepDetails.push(
        `上级分配：${formatCurrency(downlineSettlement)} × ${formatPercent(
          effectiveUplineShare
        )} = ${formatCurrency(uplineShare)}`
      );
      cashSegments.push(uplineShare);
    }
    const cashTotal = cashSegments.reduce((sum, value) => sum + value, 0);
    cashStepDetails.push(
      `当月现金分成 = ${
        cashSegments.length
          ? `${cashSegments.map((value) => formatCurrency(value)).join(" + ")} = ${formatCurrency(cashTotal)}`
          : "¥0"
      }`
    );

    acc.push({
      month,
      monthMira,
      cumulativeMira,
      tier: tierCurrent,
      tierChange: {
        previous: previousTier,
        current: tierCurrent,
        promotion,
        degraded,
        missStreak
      },
      coinReward: coinTotal,
      cashReward: cashTotal,
      assumptions: {
        downlineRateType,
        downlineRateValue
      },
      calculations: {
        mira: miraSteps,
        tier: tierSteps,
        coin: coinStepDetails,
        cash: cashStepDetails
      }
    });

    return acc;
  }, []);
}

export default function SimulationPage() {
  const [monthInputs, setMonthInputs] = useState<MonthInput[]>(defaultMonths);
  const [tierRates, setTierRates] = useState<number[]>(
    baseTiers.map((tier) => (tier.kind === "coin" ? tier.coinRate : tier.cashRate))
  );
  const [distribution, setDistribution] = useState<{ upline: number; self: number }>(() => ({
    upline: DEFAULT_UPLINE_SHARE * 100,
    self: (1 - DEFAULT_UPLINE_SHARE) * 100
  }));

  const highlightRefs = useRef<Record<string, HTMLElement | null>>({});
  const previousSnapshot = useRef<Record<string, string>>({});

  const tiers = useMemo(
    () =>
      baseTiers.map((tier, index) => ({
        ...tier,
        coinRate: tier.kind === "coin" ? tierRates[index] : 0,
        cashRate: tier.kind === "cash" ? tierRates[index] : 0
      })),
    [tierRates]
  );

  const monthResults = useMemo(
    () => computeMonthResults(monthInputs, tiers, distribution.upline / 100, 0),
    [monthInputs, tiers, distribution.upline]
  );

  const downlineMonths = useMemo(
    () =>
      monthInputs.map((month) => ({
        label: month.label,
        selfRecharge: month.downlineRecharge,
        downlineRecharge: 0
      })),
    [monthInputs]
  );

  const downlineResults = useMemo(
    () =>
      computeMonthResults(
        downlineMonths,
        tiers,
        distribution.upline / 100,
        distribution.upline / 100
      ),
    [downlineMonths, tiers, distribution.upline]
  );
  const totals = useMemo(
    () =>
      monthResults.reduce(
        (result, current) => {
          result.coin += current.coinReward;
          result.cash += current.cashReward;
          return result;
        },
        { coin: 0, cash: 0 }
      ),
    [monthResults]
  );

  const downlineTotals = useMemo(
    () =>
      downlineResults.reduce(
        (result, current) => {
          result.coin += current.coinReward;
          result.cash += current.cashReward;
          return result;
        },
        { coin: 0, cash: 0 }
      ),
    [downlineResults]
  );

  const snapshotValues = useMemo(() => {
    const map: Record<string, string> = {};
    monthResults.forEach((result, index) => {
      map[`self-${index}-coin`] = formatNumber(result.coinReward);
      map[`self-${index}-cash`] = formatNumber(result.cashReward);
      map[`self-${index}-ratio`] = result.month.selfRecharge > 0
        ? formatNumber(((result.coinReward + result.cashReward) / result.month.selfRecharge) * 100)
        : "0";
    });
    downlineResults.forEach((result, index) => {
      map[`down-${index}-coin`] = formatNumber(result.coinReward);
      map[`down-${index}-cash`] = formatNumber(result.cashReward);
      map[`down-${index}-ratio`] = result.month.selfRecharge > 0
        ? formatNumber(((result.coinReward + result.cashReward) / result.month.selfRecharge) * 100)
        : "0";
    });
    monthResults.forEach((result, index) => {
      const downline = downlineResults[index];
      const combined = result.month.selfRecharge + result.month.downlineRecharge > 0
        ? (result.coinReward + result.cashReward + (downline?.coinReward ?? 0) + (downline?.cashReward ?? 0)) /
          (result.month.selfRecharge + result.month.downlineRecharge)
        : 0;
      map[`combined-${index}-ratio`] = formatNumber(combined * 100);
    });
    map.summaryCoin = formatNumber(totals.coin);
    map.summaryCash = formatNumber(totals.cash);
    map.summaryDownCoin = formatNumber(downlineTotals.coin);
    map.summaryDownCash = formatNumber(downlineTotals.cash);
    return map;
  }, [monthResults, downlineResults, totals, downlineTotals]);

  useEffect(() => {
    Object.entries(snapshotValues).forEach(([key, value]) => {
      if (previousSnapshot.current[key] !== undefined && previousSnapshot.current[key] !== value) {
        const node = highlightRefs.current[key];
        if (node) {
          node.classList.remove(styles.highlight);
          void node.offsetWidth;
          node.classList.add(styles.highlight);
        }
      }
    });
    previousSnapshot.current = snapshotValues;
  }, [snapshotValues]);

  const handleChange = (
    index: number,
    field: keyof MonthInput,
    value: string,
    formatted?: boolean
  ) => {
    setMonthInputs((previous) => {
      const next = [...previous];
      const numeric = Number(value);
      next[index] = {
        ...next[index],
        [field]: Number.isNaN(numeric) ? 0 : Math.max(0, numeric)
      };
      return next;
    });
  };

  const handleTierRateChange = (index: number, value: string) => {
    setTierRates((previous) => {
      const next = [...previous];
      const numeric = Number(value);
      const percent = Number.isNaN(numeric) ? 0 : Math.min(100, Math.max(0, numeric));
      next[index] = percent / 100;
      return next;
    });
  };

  const handleDistributionChange = (field: "upline" | "self", value: string) => {
    const numeric = Number(value);
    const percent = Number.isNaN(numeric) ? 0 : Math.min(100, Math.max(0, numeric));
    if (field === "upline") {
      setDistribution({ upline: percent, self: Math.max(0, 100 - percent) });
    } else {
      setDistribution({ self: percent, upline: Math.max(0, 100 - percent) });
    }
  };

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

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <section className={styles.sideSection}>
            <h2>模拟参数</h2>
            <p className={styles.sectionLead}>
              调整每个月的本人充值与下线充值，实时查看米拉累计、星级变化与收益结算。
            </p>
            <div className={styles.inputGrid}>
              {monthInputs.map((month, index) => (
                <div key={month.label} className={styles.inputCard}>
                  <h3>{month.label}</h3>
                  <div className={styles.inputField}>
                    <label htmlFor={`self-${index}`}>本人充值</label>
                    <div className={styles.inputControl}>
                      <span>¥</span>
                  <input
                    id={`self-${index}`}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9,]*"
                    value={formatNumber(month.selfRecharge)}
                    onChange={(event) => {
                      const raw = event.target.value.replace(/,/g, "");
                      handleChange(index, "selfRecharge", raw);
                    }}
                    onBlur={(event) => {
                      const raw = event.target.value.replace(/,/g, "");
                      handleChange(index, "selfRecharge", raw);
                    }}
                  />
                    </div>
                  </div>
                  <div className={styles.inputField}>
                    <label htmlFor={`downline-${index}`}>下线充值</label>
                    <div className={styles.inputControl}>
                      <span>¥</span>
                  <input
                    id={`downline-${index}`}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9,]*"
                    value={formatNumber(month.downlineRecharge)}
                    onChange={(event) => {
                      const raw = event.target.value.replace(/,/g, "");
                      handleChange(index, "downlineRecharge", raw);
                    }}
                    onBlur={(event) => {
                      const raw = event.target.value.replace(/,/g, "");
                      handleChange(index, "downlineRecharge", raw);
                    }}
                  />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className={styles.sideSection}>
            <h2>关键假设</h2>
            <ul className={styles.assumptionList}>
              <li>全部充值渠道均为官网/官方游戏包，结算比例统一为 70%。</li>
              <li>用户无上线，故自充结算金额 100% 归本人；团队直接下级与本人星级同步。</li>
              <li>
                上线与充值账号分配比例支持自定义（当前：{formatNumber(distribution.upline)}% /
                {formatNumber(distribution.self)}%）。
              </li>
              <li>各星级返利方式固定（米拉萌芽-六星为 COIN、合伙人及以上为现金），仅调整分成比例数值。</li>
            </ul>
          </section>

          <section className={styles.sideSection}>
            <h2>分成比例设置</h2>
            <div className={styles.distributionBox}>
              <div className={styles.inputField}>
                <label htmlFor="upline-share">上线分配比例</label>
                <div className={styles.inputControl}>
                  <input
                    id="upline-share"
                    type="number"
                    min={0}
                    max={100}
                    step={1}
                    value={distribution.upline}
                    onChange={(event) => handleDistributionChange("upline", event.target.value)}
                  />
                  <span>%</span>
                </div>
              </div>
              <div className={styles.inputField}>
                <label htmlFor="self-share">充值账号分配比例</label>
                <div className={styles.inputControl}>
                  <input
                    id="self-share"
                    type="number"
                    min={0}
                    max={100}
                    step={1}
                    value={distribution.self}
                    onChange={(event) => handleDistributionChange("self", event.target.value)}
                  />
                  <span>%</span>
                </div>
              </div>
            </div>
            <div className={styles.rateList}>
              {tiers.map((tier, index) => {
                const isCashTier = tier.kind === "cash";
                const currentValue = tierRates[index] * 100;
                return (
                  <div key={tier.name} className={styles.rateItem}>
                    <div className={styles.rateLabel}>
                      <span>{tier.name}</span>
                      <small>{isCashTier ? "现金分成" : "COIN 返利"}</small>
                    </div>
                    <div className={styles.inputControl}>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        step={0.5}
                        value={Number.isNaN(currentValue) ? 0 : currentValue}
                        onChange={(event) => handleTierRateChange(index, event.target.value)}
                      />
                      <span>%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </aside>

        <div className={styles.mainContent}>
          <section className={styles.section}>
            <h2>收益汇总</h2>
            <div className={styles.summaryCard}>
              <div>
                <span className={styles.summaryLabel}>三个月累计 COIN 返利</span>
                <strong
                  ref={(el) => (highlightRefs.current.summaryCoin = el)}
                >
                  {formatNumber(totals.coin)} 枚
                </strong>
              </div>
              <div>
                <span className={styles.summaryLabel}>三个月累计现金分成</span>
                <strong ref={(el) => (highlightRefs.current.summaryCash = el)}>
                  ¥{formatNumber(totals.cash)}
                </strong>
              </div>
              <div>
                <span className={styles.summaryLabel}>下线三个月累计 COIN 返利</span>
                <strong
                  ref={(el) => (highlightRefs.current.summaryDownCoin = el)}
                >
                  {formatNumber(downlineTotals.coin)} 枚
                </strong>
              </div>
              <div>
                <span className={styles.summaryLabel}>下线三个月累计现金分成</span>
                <strong ref={(el) => (highlightRefs.current.summaryDownCash = el)}>
                  ¥{formatNumber(downlineTotals.cash)}
                </strong>
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
                    <th>本人返利 / 充值</th>
                    <th>下线星级</th>
                    <th>下线 COIN</th>
                    <th>下线现金</th>
                    <th>下线返利 / 充值</th>
                    <th>汇总返利 / 充值</th>
                  </tr>
                </thead>
                <tbody>
              {monthResults.map((result, index) => {
                const downline = downlineResults[index];
                const selfReturn =
                  result.month.selfRecharge > 0
                    ? (result.coinReward + result.cashReward) /
                      result.month.selfRecharge
                    : 0;
                    const downlineReturn = downline && downline.month.selfRecharge > 0
                      ? (downline.coinReward + downline.cashReward) /
                        downline.month.selfRecharge
                      : 0;
                    const combinedReturn =
                      result.month.selfRecharge + result.month.downlineRecharge > 0
                      ? (result.coinReward + result.cashReward + (downline?.coinReward ?? 0) + (downline?.cashReward ?? 0)) /
                        (result.month.selfRecharge + result.month.downlineRecharge)
                      : 0;
                    return (
                      <tr key={`${result.month.label}-table`}>
                        <td>{result.month.label}</td>
                        <td>{formatCurrency(result.month.selfRecharge)}</td>
                        <td>{formatCurrency(result.month.downlineRecharge)}</td>
                        <td>{formatNumber(result.monthMira)}</td>
                        <td>{formatNumber(result.cumulativeMira)}</td>
                        <td>{result.tier.name}</td>
                        <td>
                          <span
                            ref={(el) => (highlightRefs.current[`self-${index}-coin`] = el)}
                          >
                            {result.coinReward > 0 ? `${formatNumber(result.coinReward)} 枚` : "—"}
                          </span>
                        </td>
                        <td>
                          <span
                            ref={(el) => (highlightRefs.current[`self-${index}-cash`] = el)}
                          >
                            {result.cashReward > 0 ? `¥${formatNumber(result.cashReward)}` : "—"}
                          </span>
                        </td>
                        <td>
                          <span
                            ref={(el) => (highlightRefs.current[`self-${index}-ratio`] = el)}
                          >
                            {result.month.selfRecharge > 0
                              ? `${formatNumber(selfReturn * 100)}%`
                              : "—"}
                          </span>
                        </td>
                        <td>{downline?.tier.name ?? "—"}</td>
                        <td>
                          <span
                            ref={(el) => (highlightRefs.current[`down-${index}-coin`] = el)}
                          >
                            {downline && downline.coinReward > 0
                              ? `${formatNumber(downline.coinReward)} 枚`
                              : "—"}
                          </span>
                        </td>
                        <td>
                          <span
                            ref={(el) => (highlightRefs.current[`down-${index}-cash`] = el)}
                          >
                            {downline && downline.cashReward > 0
                              ? `¥${formatNumber(downline.cashReward)}`
                              : "—"}
                          </span>
                        </td>
                        <td>
                          <span
                            ref={(el) => (highlightRefs.current[`down-${index}-ratio`] = el)}
                          >
                            {downline && downline.month.selfRecharge > 0
                              ? `${formatNumber(downlineReturn * 100)}%`
                              : "—"}
                          </span>
                        </td>
                        <td>
                          <span
                            ref={(el) => (highlightRefs.current[`combined-${index}-ratio`] = el)}
                          >
                            {result.month.selfRecharge + result.month.downlineRecharge > 0
                              ? `${formatNumber(combinedReturn * 100)}%`
                              : "—"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className={styles.footnote}>
              ※ 本示例仅用于展示结算逻辑，实际结算结果将受渠道类型、团队结构、风控校验等因素影响；下线收益已扣除上线分配比例。
            </p>
          </section>

          <section className={styles.section}>
            <h2>月度晋级与返利</h2>
            <div className={styles.timeline}>
              {monthResults.map((result) => (
                <article key={result.month.label} className={styles.timelineCard}>
                  <div className={styles.timelineHeader}>
                    <h3>{result.month.label}</h3>
                    <div className={styles.badgeRow}>
                      {result.tierChange.promotion ? (
                        <span className={`${styles.changeBadge} ${styles.up}`}>晋级</span>
                      ) : null}
                      {result.tierChange.degraded ? (
                        <span className={`${styles.changeBadge} ${styles.down}`}>降级</span>
                      ) : null}
                      <span className={styles.tierBadge}>{result.tier.name}</span>
                    </div>
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
                        {result.tier.kind === "cash"
                          ? `现金 ${formatNumber(result.tier.cashRate * 100)}%`
                          : `COIN ${formatNumber(result.tier.coinRate * 100)}%`}
                        <span className={styles.metricNote}>
                          团队结算同向，按 {formatNumber(distribution.upline)}% 分配至本人
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
            <h2>下线成长与收益</h2>
            <div className={styles.timeline}>
              {downlineResults.map((result) => (
                <article key={`downline-${result.month.label}`} className={styles.timelineCard}>
                  <div className={styles.timelineHeader}>
                    <h3>{result.month.label}</h3>
                    <div className={styles.badgeRow}>
                      {result.tierChange.promotion ? (
                        <span className={`${styles.changeBadge} ${styles.up}`}>晋级</span>
                      ) : null}
                      {result.tierChange.degraded ? (
                        <span className={`${styles.changeBadge} ${styles.down}`}>降级</span>
                      ) : null}
                      <span className={styles.tierBadge}>{result.tier.name}</span>
                    </div>
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
                        {result.tier.kind === "cash"
                          ? `现金 ${formatNumber(result.tier.cashRate * 100)}%`
                          : `COIN ${formatNumber(result.tier.coinRate * 100)}%`}
                        <span className={styles.metricNote}>
                          自留比例 {formatNumber(distribution.self)}%，按此结算收益
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
                          <li key={`downline-mira-${item}`}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className={styles.calcGroup}>
                      <span className={styles.calcTitle}>星级判定</span>
                      <ul>
                        {result.calculations.tier.map((item) => (
                          <li key={`downline-tier-${item}`}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className={styles.calcGroup}>
                      <span className={styles.calcTitle}>COIN 返利</span>
                      <ul>
                        {result.calculations.coin.map((item) => (
                          <li key={`downline-coin-${item}`}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className={styles.calcGroup}>
                      <span className={styles.calcTitle}>现金分成</span>
                      <ul>
                        {result.calculations.cash.map((item) => (
                          <li key={`downline-cash-${item}`}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
