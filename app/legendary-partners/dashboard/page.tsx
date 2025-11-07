"use client";

import { ReactNode, useMemo, useState } from "react";
import styles from "./page.module.css";

type EarningDetail = {
  datetime: string;
  source: string;
  mira: number;
  coin: number;
  cash: number;
  miraTooltip?: string;
  coinTooltip?: string;
  cashTooltip?: string;
};

type EarningsHistoryRow = {
  month: string;
  coin: number;
  cash: number;
  mira: number;
  tier: string;
  details: EarningDetail[];
};

type TeamSnapshot = {
  totalDownlines: number;
  active30d: number;
  level50: number;
  monthMira: number;
  uplink?: { name: string; tier: string } | null;
  ranking: { name: string; tier: string; mira: number }[];
};

type CurrentMonthStats = {
  miraEarned: number;
  coinEarned: number;
  cashEarned: number;
  retentionNeeded: number;
};

type UserScenario = {
  key: string;
  label: string;
  userStats: {
    name: string;
    id: string;
    tier: string;
    tierBadge: string;
    availableCoin: number;
    availableCash: number;
    cumulativeMira: number;
    inviteLink: string;
    nextTier: { name: string; required: number };
  };
  privileges: { label: string; granted: boolean }[];
  earningsHistory: EarningsHistoryRow[];
  levelTimeline: { date: string; label: string; note: string }[];
  teamSnapshot: TeamSnapshot;
  currentMonth: CurrentMonthStats;
};

const mockUsers: UserScenario[] = [
  {
    key: "partner-linxi",
    label: "林夕 · 米拉合伙人",
    userStats: {
      name: "林夕",
      id: "LP-203948",
      tier: "米拉合伙人",
      tierBadge: "cash",
      availableCoin: 20608,
      availableCash: 54600,
      cumulativeMira: 82000000,
      inviteLink: "https://mirpartners.com/join/LP-203948",
      nextTier: {
        name: "传奇合伙人",
        required: 100000000
      }
    },
    currentMonth: {
      miraEarned: 53_000_000,
      coinEarned: 0,
      cashEarned: 54_600,
      retentionNeeded: 0
    },
    privileges: [
      { label: "专属推广链接", granted: true },
      { label: "推广素材包", granted: true },
      { label: "共创训练营", granted: true },
      { label: "专属客服", granted: true },
      { label: "共创顾问", granted: true },
      { label: "线上签约", granted: true },
      { label: "线下签约", granted: true },
      { label: "新游分成竞拍", granted: true },
      { label: "专属后台", granted: true },
      { label: "特邀访谈", granted: false },
      { label: "名人堂年会", granted: false }
    ],
    earningsHistory: [
      {
        month: "2024年03月",
        coin: 1008,
        cash: 0,
        mira: 2000000,
        tier: "米拉三星",
        details: [
          {
            datetime: "03-05 11:20",
            source: "本人充值",
            mira: 1000000,
            coin: 0,
            cash: 0,
            miraTooltip: "本人充值 ¥10,000 × 100 = 1,000,000 米拉"
          },
          {
            datetime: "03-18 14:32",
            source: "下线充值",
            mira: 1000000,
            coin: 0,
            cash: 0,
            miraTooltip: "团队充值 ¥10,000 × 100 = 1,000,000 米拉"
          },
          {
            datetime: "03-30 21:10",
            source: "充值返利",
            mira: 0,
            coin: 1008,
            cash: 0,
            coinTooltip:
              "本人返利：¥10,000 × 70% × 12% = 840 枚；团队返利：¥10,000 × 70% × 12% × 20% = 168 枚；合计 1,008 枚"
          }
        ]
      },
      {
        month: "2024年04月",
        coin: 19600,
        cash: 0,
        mira: 32000000,
        tier: "米拉六星",
        details: [
          {
            datetime: "04-02 10:05",
            source: "本人充值",
            mira: 10000000,
            coin: 0,
            cash: 0,
            miraTooltip: "本人充值 ¥100,000 × 100 = 10,000,000 米拉"
          },
          {
            datetime: "04-12 18:26",
            source: "下线充值",
            mira: 20000000,
            coin: 0,
            cash: 0,
            miraTooltip: "团队充值 ¥200,000 × 100 = 20,000,000 米拉"
          },
          {
            datetime: "04-20 09:10",
            source: "注册奖励",
            mira: 1000000,
            coin: 0,
            cash: 0,
            miraTooltip: "注册奖励：10 人 × 100,000 = 1,000,000 米拉"
          },
          {
            datetime: "04-21 09:10",
            source: "50级奖励",
            mira: 1000000,
            coin: 0,
            cash: 0,
            miraTooltip: "50 级奖励：10 人 × 100,000 = 1,000,000 米拉"
          },
          {
            datetime: "04-30 22:08",
            source: "充值返利",
            mira: 0,
            coin: 19600,
            cash: 0,
            coinTooltip:
              "本人返利：¥100,000 × 70% × 20% = 14,000 枚；团队返利：¥200,000 × 70% × 20% × 20% = 5,600 枚；合计 19,600 枚"
          }
        ]
      },
      {
        month: "2024年05月",
        coin: 0,
        cash: 54600,
        mira: 82000000,
        tier: "米拉合伙人",
        details: [
          {
            datetime: "05-03 13:15",
            source: "本人充值",
            mira: 20000000,
            coin: 0,
            cash: 0,
            miraTooltip: "本人充值 ¥200,000 × 100 = 20,000,000 米拉"
          },
          {
            datetime: "05-09 17:44",
            source: "下线充值",
            mira: 30000000,
            coin: 0,
            cash: 0,
            miraTooltip: "团队充值 ¥300,000 × 100 = 30,000,000 米拉"
          },
          {
            datetime: "05-12 09:00",
            source: "直播任务 50h",
            mira: 3000000,
            coin: 0,
            cash: 0,
            miraTooltip: "直播 50 小时档：50h × 60,000 = 3,000,000 米拉"
          },
          {
            datetime: "05-12 09:01",
            source: "滴滴司机认证",
            mira: 500000,
            coin: 0,
            cash: 0,
            miraTooltip: "滴滴司机认证奖励 500,000 米拉"
          },
          {
            datetime: "05-14 09:02",
            source: "快递小哥认证",
            mira: 500000,
            coin: 0,
            cash: 0,
            miraTooltip: "快递小哥认证奖励 500,000 米拉"
          },
          {
            datetime: "05-30 20:20",
            source: "现金返利",
            mira: 0,
            coin: 0,
            cash: 54600,
            cashTooltip:
              "本人返利：¥200,000 × 70% × 30% = ¥42,000；团队返利：¥300,000 × 70% × 30% × 20% = ¥12,600；合计 ¥54,600"
          }
        ]
      }
    ],
    levelTimeline: [
      { date: "2024-03-01", label: "达成米拉三星", note: "累计 200 万米拉" },
      { date: "2024-04-01", label: "达成米拉六星", note: "累计 3200 万米拉" },
      { date: "2024-05-01", label: "签约米拉合伙人", note: "解锁线下签约" }
    ],
    teamSnapshot: {
      totalDownlines: 68,
      active30d: 52,
      level50: 18,
      monthMira: 23000000,
      uplink: { name: "Legendary Admin", tier: "殿堂合伙人" },
      ranking: [
        { name: "赵珑", tier: "米拉六星", mira: 4200000 },
        { name: "陈曦", tier: "米拉五星", mira: 3100000 },
        { name: "小悟", tier: "米拉四星", mira: 2800000 }
      ]
    }
  },
  {
    key: "partner-suheng",
    label: "苏衡 · 米拉五星",
    userStats: {
      name: "苏衡",
      id: "LP-118822",
      tier: "米拉五星",
      tierBadge: "coin",
      availableCoin: 12800,
      availableCash: 0,
      cumulativeMira: 12500000,
      inviteLink: "https://mirpartners.com/join/LP-118822",
      nextTier: {
        name: "米拉六星",
        required: 30000000
      }
    },
    currentMonth: {
      miraEarned: 2_200_000,
      coinEarned: 6_300,
      cashEarned: 0,
      retentionNeeded: 400_000
    },
    privileges: [
      { label: "专属推广链接", granted: true },
      { label: "推广素材包", granted: true },
      { label: "共创训练营", granted: true },
      { label: "专属客服", granted: false },
      { label: "共创顾问", granted: false },
      { label: "线上签约", granted: false },
      { label: "线下签约", granted: false },
      { label: "新游分成竞拍", granted: false },
      { label: "专属后台", granted: false },
      { label: "特邀访谈", granted: false },
      { label: "名人堂年会", granted: false }
    ],
    earningsHistory: [
      {
        month: "2024年02月",
        coin: 2200,
        cash: 0,
        mira: 3000000,
        tier: "米拉三星",
        details: [
          {
            datetime: "02-05 10:10",
            source: "本人充值",
            mira: 2000000,
            coin: 0,
            cash: 0,
            miraTooltip: "本人充值 ¥20,000 × 100 = 2,000,000 米拉"
          },
          {
            datetime: "02-25 15:40",
            source: "官方任务",
            mira: 1000000,
            coin: 0,
            cash: 0,
            miraTooltip: "春节任务奖励 1,000,000 米拉"
          },
          {
            datetime: "02-28 21:12",
            source: "充值返利",
            mira: 0,
            coin: 2200,
            cash: 0,
            coinTooltip: "本人返利：¥20,000 × 70% × 15% = 2,100；自留 90% = 1,890；团队奖励 310 枚"
          }
        ]
      },
      {
        month: "2024年03月",
        coin: 4100,
        cash: 0,
        mira: 4200000,
        tier: "米拉四星",
        details: [
          {
            datetime: "03-04 12:01",
            source: "本人充值",
            mira: 3000000,
            coin: 0,
            cash: 0,
            miraTooltip: "¥30,000 × 100 = 3,000,000 米拉"
          },
          {
            datetime: "03-26 16:30",
            source: "注册奖励",
            mira: 500000,
            coin: 0,
            cash: 0,
            miraTooltip: "注册 5 人 × 100,000"
          },
          {
            datetime: "03-31 22:30",
            source: "充值返利",
            mira: 0,
            coin: 4100,
            cash: 0,
            coinTooltip: "本人返利：¥30,000 × 70% × 18% = 3,780 枚；上级分润 320 枚"
          }
        ]
      },
      {
        month: "2024年04月",
        coin: 0,
        cash: 0,
        mira: 5000000,
        tier: "米拉五星",
        details: [
          {
            datetime: "04-10 09:45",
            source: "本人充值",
            mira: 4000000,
            coin: 0,
            cash: 0,
            miraTooltip: "¥40,000 × 100 = 4,000,000 米拉"
          },
          {
            datetime: "04-16 20:22",
            source: "直播任务 30h",
            mira: 1500000,
            coin: 0,
            cash: 0,
            miraTooltip: "30 小时档奖励 1,500,000 米拉"
          },
          {
            datetime: "04-30 18:55",
            source: "团队返利",
            mira: 0,
            coin: 0,
            cash: 0,
            coinTooltip: "无团队交易，未获得返利"
          }
        ]
      }
    ],
    levelTimeline: [
      { date: "2023-12-01", label: "达成米拉三星", note: "累计 150 万米拉" },
      { date: "2024-02-15", label: "达成米拉四星", note: "累计 420 万米拉" },
      { date: "2024-04-30", label: "晋升米拉五星", note: "解锁团队返利" }
    ],
    teamSnapshot: {
      totalDownlines: 0,
      active30d: 0,
      level50: 0,
      monthMira: 0,
      uplink: { name: "城市运营官", tier: "传奇合伙人" },
      ranking: []
    }
  },
  {
    key: "partner-lanxi",
    label: "岚溪 · 米拉二星",
    userStats: {
      name: "岚溪",
      id: "LP-095510",
      tier: "米拉二星",
      tierBadge: "coin",
      availableCoin: 520,
      availableCash: 0,
      cumulativeMira: 620000,
      inviteLink: "https://mirpartners.com/join/LP-095510",
      nextTier: {
        name: "米拉三星",
        required: 1000000
      }
    },
    currentMonth: {
      miraEarned: 120000,
      coinEarned: 360,
      cashEarned: 0,
      retentionNeeded: 80000
    },
    privileges: [
      { label: "专属推广链接", granted: true },
      { label: "推广素材包", granted: false },
      { label: "共创训练营", granted: false },
      { label: "专属客服", granted: false },
      { label: "共创顾问", granted: false },
      { label: "线上签约", granted: false },
      { label: "线下签约", granted: false },
      { label: "新游分成竞拍", granted: false },
      { label: "专属后台", granted: false },
      { label: "特邀访谈", granted: false },
      { label: "名人堂年会", granted: false }
    ],
    earningsHistory: [
      {
        month: "2024年05月",
        coin: 360,
        cash: 0,
        mira: 320000,
        tier: "米拉二星",
        details: [
          {
            datetime: "05-02 13:33",
            source: "本人充值",
            mira: 80000,
            coin: 0,
            cash: 0,
            miraTooltip: "¥800 × 100 = 80,000 米拉"
          },
          {
            datetime: "05-13 19:02",
            source: "抖音直播 10h",
            mira: 50000,
            coin: 0,
            cash: 0,
            miraTooltip: "直播 10 小时档奖励 50,000 米拉"
          },
          {
            datetime: "05-29 22:45",
            source: "本人返利",
            mira: 0,
            coin: 360,
            cash: 0,
            coinTooltip: "¥800 × 70% × 12% = 67.2 枚，自留 100%"
          }
        ]
      }
    ],
    levelTimeline: [
      { date: "2024-01-01", label: "注册米拉萌芽", note: "完成实名认证" },
      { date: "2024-02-10", label: "晋升米拉一星", note: "累计 12 万米拉" },
      { date: "2024-03-22", label: "晋升米拉二星", note: "累计 50 万米拉" }
    ],
    teamSnapshot: {
      totalDownlines: 0,
      active30d: 0,
      level50: 0,
      monthMira: 0,
      uplink: null,
      ranking: []
    }
  }
];

const DEFAULT_USER_KEY = "partner-lanxi";
const PRIMARY_USER_KEY = "partner-linxi";
function InfoValue({ note, children }: { note?: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);

  if (!note) {
    return <>{children}</>;
  }

  return (
    <span className={styles.infoWrapper}>
      <span>{children}</span>
      <button
        type="button"
        className={styles.infoButton}
        aria-label="查看计算说明"
        onClick={() => setOpen((prev) => !prev)}
        onBlur={() => setOpen(false)}
      >
        i
      </button>
      {open ? (
        <span role="tooltip" className={styles.infoTooltip}>
          {note}
        </span>
      ) : null}
    </span>
  );
}

function ExpandableRow({ row }: { row: EarningsHistoryRow }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <tr>
        <td>{row.month}</td>
        <td>{row.mira.toLocaleString()}</td>
        <td>{row.tier}</td>
        <td>{row.coin ? `${row.coin.toLocaleString()} 枚` : "—"}</td>
        <td>{row.cash ? `¥${row.cash.toLocaleString()}` : "—"}</td>
        <td>
          <button type="button" className={styles.accordionBtn} onClick={() => setOpen((prev) => !prev)}>
            {open ? "收起" : "明细"}
          </button>
        </td>
      </tr>
      {open ? (
        <tr>
          <td colSpan={6}>
            <div className={styles.detailTableWrapper}>
              <table className={styles.detailTable}>
                <thead>
                  <tr>
                    <th>日期/时间</th>
                    <th>来源</th>
                    <th>米拉</th>
                    <th>COIN</th>
                    <th>现金</th>
                  </tr>
                </thead>
                <tbody>
                  {row.details.map((detail, idx) => (
                    <tr key={`${row.month}-${idx}`}>
                      <td>{detail.datetime}</td>
                      <td>{detail.source}</td>
                      <td>
                        {detail.mira ? (
                          <InfoValue note={detail.miraTooltip}>
                            {detail.mira.toLocaleString()}
                          </InfoValue>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td>
                        {detail.coin ? (
                          <InfoValue note={detail.coinTooltip}>
                            {detail.coin.toLocaleString()} 枚
                          </InfoValue>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td>
                        {detail.cash ? (
                          <InfoValue note={detail.cashTooltip}>
                            ¥{detail.cash.toLocaleString()}
                          </InfoValue>
                        ) : (
                          "—"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </td>
        </tr>
      ) : null}
    </>
  );
}

export default function PartnerDashboardPage() {
  const [showPrivileges, setShowPrivileges] = useState(false);
  const [showRecruitModal, setShowRecruitModal] = useState(false);
  const [showUplinkModal, setShowUplinkModal] = useState(false);
  const [uplinkInput, setUplinkInput] = useState("");
  const [copied, setCopied] = useState<"link" | "code" | null>(null);
  const [activeKey, setActiveKey] = useState(DEFAULT_USER_KEY);

  const activeUser = useMemo(() => {
    return (
      mockUsers.find((user) => user.key === activeKey) ??
      mockUsers.find((user) => user.key === DEFAULT_USER_KEY) ??
      mockUsers[0]
    );
  }, [activeKey]);

  const { userStats, privileges, earningsHistory, levelTimeline, teamSnapshot, currentMonth } = activeUser;

  const tierProgress = Math.min(
    Math.round((userStats.cumulativeMira / userStats.nextTier.required) * 100),
    100
  );

  const handleCopy = (value: string, type: "link" | "code") => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(value).then(() => {
        setCopied(type);
        setTimeout(() => setCopied(null), 2000);
      });
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = value;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    }
  };

  const handleBindUplink = () => {
    setActiveKey(PRIMARY_USER_KEY);
    setUplinkInput("");
    setShowUplinkModal(false);
  };

  return (
    <div className={styles.wrapper}>
      <section className={styles.gridTwo}>
        <div className={styles.card}>
          <h2>个人概况</h2>
          <div className={styles.profileRow}>
            <div>
              <strong>{userStats.name}</strong>
              <p>合伙人编号：{userStats.id}</p>
            </div>
            <div>
              <span className={styles.badge}>{userStats.tier}</span>
              <p>当前积分：{userStats.cumulativeMira.toLocaleString()} 米拉</p>
            </div>
            <div>
              <p>
                升至 {userStats.nextTier.name} 需：
                {Math.max(userStats.nextTier.required - userStats.cumulativeMira, 0).toLocaleString()} 米拉
              </p>
              <div className={styles.progress}>
                <span style={{ width: `${tierProgress}%` }} />
              </div>
            </div>
          </div>
          <div className={styles.kpiRow}>
            <div className={styles.kpi}>
              <strong>{userStats.availableCoin.toLocaleString()} 枚</strong>
              <span>可用 COIN</span>
            </div>
            <div className={styles.kpi}>
              <strong>¥{userStats.availableCash.toLocaleString()}</strong>
              <span>可提现现金</span>
            </div>
          </div>
        </div>
        <div className={styles.card}>
          <h2>本月指标</h2>
          <div className={styles.kpiRow}>
            <div className={styles.kpi}>
              <strong>{currentMonth.miraEarned.toLocaleString()} 米拉</strong>
              <span>本月获得米拉</span>
            </div>
            <div className={styles.kpi}>
              <strong>
                {currentMonth.coinEarned ? `${currentMonth.coinEarned.toLocaleString()} 枚` : "0 枚"}
              </strong>
              <span>本月获得 COIN</span>
            </div>
            <div className={styles.kpi}>
              <strong>¥{currentMonth.cashEarned.toLocaleString()}</strong>
              <span>本月现金返利</span>
            </div>
            <div className={styles.kpi}>
              <strong>
                {currentMonth.retentionNeeded > 0
                  ? `保级还需 ${currentMonth.retentionNeeded.toLocaleString()} 米拉`
                  : "保级还需 0 米拉"}
              </strong>
              <span>
                {currentMonth.retentionNeeded > 0 ? "本月尚未达成保级" : "本月已达成保级"}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.card}>
        <h2>权益与激励</h2>
        <div className={styles.advanceRow}>
          <div>
            <span className={styles.badge}>{userStats.tier}</span>
            <p>当前返利模式：现金 · 30% 分成</p>
          </div>
          <div>
            <span className={styles.badge}>{userStats.nextTier.name}</span>
            <p>下一等级返利：现金 · 40% 分成</p>
          </div>
        </div>
        <button
          type="button"
          className={styles.accordionBtn}
          onClick={() => setShowPrivileges((prev) => !prev)}
        >
          权益清单 {showPrivileges ? "▲" : "▼"}
        </button>
        {showPrivileges ? (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>权益</th>
                  <th>状态</th>
                </tr>
              </thead>
              <tbody>
                {privileges.map((item) => (
                  <tr key={item.label}>
                    <td>{item.label}</td>
                    <td>{item.granted ? "已解锁" : "待升级"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </section>

      <section className={styles.card}>
        <h2>收益与积分历史</h2>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>月份</th>
                <th>米拉累计</th>
                <th>星级</th>
                <th>COIN 返利</th>
                <th>现金分成</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {earningsHistory.map((row) => (
                <ExpandableRow key={row.month} row={row} />
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className={styles.gridTwo}>
        <div className={styles.card}>
          <h2>等级时间轴</h2>
          <div className={styles.timeline}>
            {levelTimeline.map((item) => (
              <div key={item.date} className={styles.timelineItem}>
                <strong>{item.label}</strong>
                <span>{item.date}</span>
                <span>{item.note}</span>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.card}>
          <h2>团队概况</h2>
          <div className={styles.kpiRow}>
            <div className={styles.kpi}>
              <strong>{teamSnapshot.totalDownlines}</strong>
              <span>总下线</span>
            </div>
            <div className={styles.kpi}>
              <strong>{teamSnapshot.active30d}</strong>
              <span>30 天活跃</span>
            </div>
            <div className={styles.kpi}>
              <strong>{teamSnapshot.level50}</strong>
              <span>已达 50 级</span>
            </div>
          </div>
          <p>本月团队米拉贡献：{teamSnapshot.monthMira.toLocaleString()}</p>
          <p>
            直属上线：
            {teamSnapshot.uplink ? (
              `${teamSnapshot.uplink.name} · ${teamSnapshot.uplink.tier}`
            ) : (
              <>
                暂无
                <button
                  type="button"
                  className={styles.inlineLink}
                  onClick={() => setShowUplinkModal(true)}
                >
                  添加
                </button>
              </>
            )}
          </p>
          <button
            type="button"
            className={styles.primaryBtn}
            onClick={() => setShowRecruitModal(true)}
          >
            发展团队
          </button>
          <ul className={styles.list}>
            {teamSnapshot.ranking.length ? (
              teamSnapshot.ranking.map((member) => (
                <li key={member.name}>
                  <span>{member.name}</span>
                  <span>{member.tier} · {member.mira.toLocaleString()} 米拉</span>
                </li>
              ))
            ) : (
              <li className={styles.emptyState}>暂无下线数据</li>
            )}
          </ul>
        </div>
      </section>

      <div className={styles.userSwitcher}>
        <label htmlFor="user-switch">切换模拟用户</label>
        <select
          id="user-switch"
          value={activeKey}
          onChange={(event) => setActiveKey(event.target.value)}
        >
          {mockUsers.map((user) => (
            <option key={user.key} value={user.key}>
              {user.label}
            </option>
          ))}
        </select>
      </div>

      {showRecruitModal ? (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true">
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>发展团队</h3>
              <button
                type="button"
                className={styles.closeBtn}
                aria-label="关闭弹窗"
                onClick={() => setShowRecruitModal(false)}
              >
                ×
              </button>
            </div>
            <p className={styles.modalIntro}>分享专属信息，让好友成为您的下线伙伴。</p>
            <div className={styles.copyBlock}>
              <span className={styles.copyLabel}>邀请链接</span>
              <code>{userStats.inviteLink}</code>
              <button
                type="button"
                onClick={() => handleCopy(userStats.inviteLink, "link")}
              >
                {copied === "link" ? "已复制" : "复制"}
              </button>
            </div>
            <div className={styles.copyBlock}>
              <span className={styles.copyLabel}>合伙人编号</span>
              <code>{userStats.id}</code>
              <button
                type="button"
                onClick={() => handleCopy(userStats.id, "code")}
              >
                {copied === "code" ? "已复制" : "复制"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {showUplinkModal ? (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true">
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>添加直属上线</h3>
              <button
                type="button"
                className={styles.closeBtn}
                aria-label="关闭弹窗"
                onClick={() => setShowUplinkModal(false)}
              >
                ×
              </button>
            </div>
            <p className={styles.modalIntro}>输入上线合伙人编号，完成绑定关系。</p>
            <input
              type="text"
              value={uplinkInput}
              onChange={(event) => setUplinkInput(event.target.value)}
              className={styles.inputField}
              placeholder="请输入合伙人编号，如 LP-123456"
            />
            <button type="button" className={styles.primaryBtn} onClick={handleBindUplink}>
              确认绑定
            </button>
            <p className={styles.warningText}>添加上线合伙人之后不可撤销不可修改</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
