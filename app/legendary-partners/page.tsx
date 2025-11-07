"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./page.module.css";

const scenarios = {
  joined: {
    label: "已加入合伙人计划",
    profile: {
      name: "林夕",
      tier: "米拉合伙人",
      isPartner: true,
      centerLink: "/legendary-partners/dashboard"
    }
  },
  guest: {
    label: "尚未加入（体验模式）",
    profile: {
      name: "林夕",
      tier: "尚未加入",
      isPartner: false,
      centerLink: "/legendary-partners"
    }
  }
} as const;

const highlights = [
  {
    title: "全民参与",
    description: "没门槛，无套路，全民可参与的传奇创业计划"
  },
  {
    title: "是兄弟一起上",
    description:
      "团队裂变收益 + 自身返利，充值、推广、任务三重积分，最快 3 个月晋升传奇合伙人"
  },
  {
    title: "高收益",
    description: "最高 80% 结算比例，铸就你的传奇！"
  }
];

const journeySteps = [
  {
    title: "兄弟们我回来了！",
    detail:
      "还记得当年一起攻沙的兄弟们吗，现在你们不仅可以一起在游戏里战斗，也能同时一起赚钱！分享你的合伙人链接，邀请兄弟们再创辉煌！"
  },
  {
    title: "每一步都算数！",
    detail:
      "把传奇合伙人计划融入你的生活中，身边的每个人都可能是你团队的一员！滴滴司机和外卖小哥加入计划能获得额外积分奖励，帮助你快速成长！"
  },
  {
    title: "重要的事情说三遍！",
    detail:
      "你的直播间还有更大的价值！现在开始直播我们的游戏，就可以根据直播时长获得高额积分奖励，从直播间到合伙人，就差你的行动了！"
  }
];

export default function LegendaryPartnersHomePage() {
  const [scenarioKey, setScenarioKey] = useState<keyof typeof scenarios>("guest");
  const [uplinkCode, setUplinkCode] = useState("");
  const [joinFeedback, setJoinFeedback] = useState<string | null>(null);
  const [showUplinkModal, setShowUplinkModal] = useState(false);

  useEffect(() => {
    setJoinFeedback(null);
    setUplinkCode("");
    setShowUplinkModal(false);
  }, [scenarioKey]);

  const userProfile = scenarios[scenarioKey].profile;
  const hasJoined = userProfile.isPartner;

  const handleJoin = (mode: "self" | "uplink") => {
    if (mode === "self") {
      setScenarioKey("joined");
      setJoinFeedback("已提交加入申请，我们将为你创建专属团队与编号");
      return;
    }

    const code = uplinkCode.trim();
    if (!code) {
      setJoinFeedback("请输入想加入团队的上线合伙人编号");
      return;
    }
    setScenarioKey("joined");
    setJoinFeedback(`已提交加入申请，上线编号：${code}`);
    setShowUplinkModal(false);
  };

  return (
    <div className={styles.wrapper}>
      <section className={styles.hero}>
        <span className={styles.eyebrow}>Legendary Partners · 登录成功</span>
        <h1>传奇合伙人计划入口</h1>
        <p>
          从个人玩家到签约股东，每一步成长都能积累米拉积分、解锁返利权益。
          在这里了解计划亮点、绑定团队，或直接进入合伙人中心管理你的收益。
        </p>
      </section>
      <div className={styles.floatingSwitch}>
        <label htmlFor="scenario-switch">模拟状态</label>
        <select
          id="scenario-switch"
          value={scenarioKey}
          onChange={(event) => setScenarioKey(event.target.value as keyof typeof scenarios)}
        >
          {Object.entries(scenarios).map(([key, value]) => (
            <option key={key} value={key}>
              {value.label}
            </option>
          ))}
        </select>
      </div>

      <section className={styles.grid}>
        {highlights.map((item) => (
          <div key={item.title} className={styles.card}>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        ))}
      </section>
      <div>
        <Link href="/legendary-partners/ecosystem" className={styles.ecosystemLink}>
          了解完整的传奇合伙人计划 →
        </Link>
      </div>

      {hasJoined ? (
        <section className={styles.centerCard}>
          <div>
            <span className={styles.badge}>当前等级 · {userProfile.tier}</span>
            <h3>欢迎回来，{userProfile.name}</h3>
            <p>你已加入传奇合伙人计划，可以随时前往合伙人中心查看积分、收益与团队情况。</p>
          </div>
          <Link href={userProfile.centerLink} className={styles.linkBtn}>
            进入合伙人中心 →
          </Link>
        </section>
      ) : null}

      {!hasJoined ? (
        <section className={styles.joinCard}>
          <div>
            <h3>加入传奇合伙人计划</h3>
            <p>输入邀请人的合伙人编号，或直接提交申请让官方为你分配战队生态。</p>
          </div>
          <button type="button" className={styles.joinBtn} onClick={() => handleJoin("self")}>
            加入传奇合伙人计划，创建自己的团队
          </button>
          <div className={styles.divider}>或</div>
          <p className={styles.subCopy}>你也可以选择加入一个已有的强大团队，成为他们的一份子</p>
          <div className={styles.inputRow}>
            <span className={styles.hint}>请输入邀请你的合伙人编号，我们将为你绑定该团队。</span>
            <button type="button" className={styles.linkBtn} onClick={() => setShowUplinkModal(true)}>
              提交团队加入申请
            </button>
          </div>
          <span className={styles.warning}>成功加入后即可开启积分与返利统计</span>
          {joinFeedback ? <p className={styles.hint}>{joinFeedback}</p> : null}
        </section>
      ) : null}

      <section>
        <h3>成长旅程一览</h3>
        <div className={styles.steps}>
          {journeySteps.map((step) => (
            <div key={step.title} className={styles.step}>
              <strong>{step.title}</strong>
              <span>{step.detail}</span>
            </div>
          ))}
        </div>
      </section>

      {showUplinkModal ? (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true">
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>加入已有团队</h3>
              <button
                type="button"
                className={styles.closeBtn}
                aria-label="关闭弹窗"
                onClick={() => setShowUplinkModal(false)}
              >
                ×
              </button>
            </div>
            <p className={styles.modalIntro}>输入上级合伙人编号后，系统将同步该团队的返利与培训体系。</p>
            <input
              className={styles.inputField}
              placeholder="例如 LP-168888"
              value={uplinkCode}
              onChange={(event) => setUplinkCode(event.target.value)}
            />
            <p className={styles.warning}>添加上线合伙人之后不可撤销不可修改</p>
            <button type="button" className={styles.joinBtn} onClick={() => handleJoin("uplink")}>
              确认加入团队
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
