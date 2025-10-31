"use client";

import styles from "./page.module.css";

const valueHighlights = [
  "构建全民收益体系：人人可赚，从首笔充值即可返利",
  "激活社交裂变：以团队贡献为基础的成长模型，促进自然扩散",
  "提供晋升通道：从米拉一星到十星，逐步过渡到签约制与股东制合作",
  "打造稳定分润生态：通过 MG 押金机制保障合规与长期合作"
];

const miraSources = [
  "自身及推广团队成员充值（按 1:100 获得米拉）",
  "游戏行为",
  "平台活动（如节日任务、赛事奖励、官方活动等）",
  "外部专项激励（如抖音传播任务、抖音直播任务、滴滴司机认证、外卖小哥认证等）"
];

type MiraSourceDetail = {
  type: string;
  source: string;
  trigger: string;
  formula: string;
  frequency: string;
  proof: string;
  notes?: string;
};

const miraSourceDetails: MiraSourceDetail[] = [
  {
    type: "充值",
    source: "本人充值（RMB）",
    trigger: "成功付费到账",
    formula: "米拉 = 充值金额 × 100",
    frequency: "无上限（大额需 KYC）",
    proof: "支付回执、充值订单"
  },
  {
    type: "充值",
    source: "直接邀请成员充值（一级）",
    trigger: "被邀请者充值且关系绑定",
    formula: "米拉 = 充值金额 × 100",
    frequency: "无上限",
    proof: "绑定关系记录、充值单"
  },
  {
    type: "充值",
    source: "二级邀请成员充值（间接/二级）",
    trigger: "间接成员充值（见第 4 节多方案）",
    formula: "米拉 = 间接充值 × 100 × 10%（即二级给上层 10% 米拉）",
    frequency: "无上限",
    proof: "充值单、邀请链路",
    notes: "见第 4 节详细策略"
  },
  {
    type: "游戏行为",
    source: "注册",
    trigger: "本人及成员注册",
    formula: "300",
    frequency: "20",
    proof: "系统事件日志"
  },
  {
    type: "游戏行为",
    source: "升级",
    trigger: "团队成员升至 20 级",
    formula: "300",
    frequency: "50",
    proof: "系统事件日志"
  },
  {
    type: "游戏行为",
    source: "升级",
    trigger: "团队成员升至 30 级",
    formula: "300",
    frequency: "50",
    proof: "系统事件日志"
  },
  {
    type: "游戏行为",
    source: "升级",
    trigger: "团队成员升至 40 级",
    formula: "500",
    frequency: "50",
    proof: "系统事件日志"
  },
  {
    type: "游戏行为",
    source: "升级",
    trigger: "团队成员升至 50 级",
    formula: "500",
    frequency: "50",
    proof: "系统事件日志"
  },
  {
    type: "游戏行为",
    source: "野外首领击杀",
    trigger: "击杀野外 BOSS 一次",
    formula: "500",
    frequency: "每日 1 次",
    proof: "系统事件日志",
    notes: "防刷：行为模式异常检测"
  },
  {
    type: "赛事/活动任务",
    source: "沙巴克城战获胜",
    trigger: "第一名会员",
    formula: "10,000",
    frequency: "活动期限定",
    proof: "活动专用条款、防作弊"
  },
  {
    type: "赛事/活动任务",
    source: "节日活动参与",
    trigger: "参与官方节日活动",
    formula: "200",
    frequency: "活动期限定",
    proof: "活动报名表、系统日志",
    notes: "配合节日活动开放"
  },
  {
    type: "赛事/活动任务",
    source: "限时挑战",
    trigger: "达成限时挑战目标",
    formula: "500",
    frequency: "活动期限定",
    proof: "系统事件日志",
    notes: "可组合定制活动"
  },
  {
    type: "外部专项激励",
    source: "抖音直播",
    trigger: "抖音绑定账号直播累计 ≥10 小时并含任务链接",
    formula: "50,000",
    frequency: "1",
    proof: "抖音数据截图/平台 API 回执 + 任务落地链接点击量",
    notes: "需第三方验证，直推须含推广链接并产生有效转化"
  },
  {
    type: "外部专项激励",
    source: "抖音直播",
    trigger: "抖音绑定账号直播累计 ≥30 小时并含任务链接",
    formula: "150,000",
    frequency: "1",
    proof: "抖音数据截图/平台 API 回执 + 任务落地链接点击量",
    notes: "需第三方验证，直推须含推广链接并产生有效转化"
  },
  {
    type: "外部专项激励",
    source: "抖音直播",
    trigger: "抖音绑定账号直播累计 ≥50 小时并含任务链接",
    formula: "300,000",
    frequency: "1",
    proof: "抖音数据截图/平台 API 回执 + 任务落地链接点击量",
    notes: "需第三方验证，直推须含推广链接并产生有效转化"
  },
  {
    type: "外部专项激励",
    source: "抖音直播",
    trigger: "抖音绑定账号直播累计 ≥100 小时并含任务链接",
    formula: "500,000",
    frequency: "1",
    proof: "抖音数据截图/平台 API 回执 + 任务落地链接点击量",
    notes: "需第三方验证，直推须含推广链接并产生有效转化"
  },
  {
    type: "外部专项激励",
    source: "抖音发布内容并附带任务链接",
    trigger: "单条内容达指定曝光/点击/转化（如曝光 ≥5k 且任务链接点击 ≥50）",
    formula: "基础奖励 10,000",
    frequency: "1",
    proof: "曝光截图/后台点击数据/落地页订单",
    notes: "作弊判定：刷量/水军剔除"
  },
  {
    type: "外部专项激励",
    source: "滴滴司机身份认证",
    trigger: "用户上传滴滴司机身份认证并通过平台核验",
    formula: "500,000",
    frequency: "1",
    proof: "接口认证、联合查验",
    notes: "要求与平台实名认证一致，防伪造"
  },
  {
    type: "外部专项激励",
    source: "快递小哥身份证认证",
    trigger: "用户上传快递平台身份认证并通过审核",
    formula: "500,000",
    frequency: "1",
    proof: "接口认证、联合查验",
    notes: "需人工/第三方交叉验证"
  },
  {
    type: "外部专项激励",
    source: "其他（如积分兑换购买）",
    trigger: "信用卡/航空公司积分兑换",
    formula: "包裹积分分包商品（例如 50 万积分）",
    frequency: "1",
    proof: "兑换码或跨号限次使用",
    notes: "兑换码需跨号限次使用"
  }
];

const benefitDefinitions = [
  { key: "link", label: "专属推广链接" },
  { key: "assets", label: "推广素材包" },
  { key: "academy", label: "共创训练营" },
  { key: "service", label: "专属客服" },
  { key: "consultant", label: "共创顾问" },
  { key: "signOnline", label: "线上签约" },
  { key: "signOffline", label: "线下签约" },
  { key: "auction", label: "新游分成竞拍" },
  { key: "dashboard", label: "专属后台" },
  { key: "interview", label: "特邀访谈" },
  { key: "annual", label: "名人堂年会" }
] as const;

type BenefitKey = (typeof benefitDefinitions)[number]["key"];

type Tier = {
  name: string;
  requirement: string;
  coinRebate: string;
  cashShare: string;
  description?: string;
  benefits: BenefitKey[];
};

const tiers: Tier[] = [
  {
    name: "米拉萌芽",
    requirement: "注册即得",
    coinRebate: "—",
    cashShare: "—",
    description: "入门身份，开启米拉成长旅程。",
    benefits: ["link", "assets"]
  },
  {
    name: "米拉一星",
    requirement: "100,000",
    coinRebate: "5%",
    cashShare: "—",
    benefits: ["link", "assets", "signOnline"]
  },
  {
    name: "米拉二星",
    requirement: "500,000",
    coinRebate: "10%",
    cashShare: "—",
    benefits: ["link", "assets", "signOnline"]
  },
  {
    name: "米拉三星",
    requirement: "1,000,000",
    coinRebate: "12%",
    cashShare: "—",
    benefits: ["link", "assets", "academy", "service", "signOnline"]
  },
  {
    name: "米拉四星",
    requirement: "5,000,000",
    coinRebate: "15%",
    cashShare: "—",
    benefits: ["link", "assets", "academy", "service", "signOnline"]
  },
  {
    name: "米拉五星",
    requirement: "10,000,000",
    coinRebate: "18%",
    cashShare: "—",
    benefits: ["link", "assets", "academy", "service", "signOnline"]
  },
  {
    name: "米拉六星",
    requirement: "30,000,000",
    coinRebate: "20%",
    cashShare: "—",
    benefits: ["link", "assets", "academy", "service", "signOnline"]
  },
  {
    name: "米拉合伙人",
    requirement: "50,000,000",
    coinRebate: "—",
    cashShare: "30%",
    benefits: [
      "link",
      "assets",
      "academy",
      "service",
      "consultant",
      "signOnline",
      "auction",
      "dashboard",
      "interview"
    ]
  },
  {
    name: "传奇合伙人",
    requirement: "100,000,000",
    coinRebate: "—",
    cashShare: "40%",
    benefits: [
      "link",
      "assets",
      "academy",
      "service",
      "consultant",
      "signOnline",
      "auction",
      "dashboard",
      "interview"
    ]
  },
  {
    name: "殿堂合伙人",
    requirement: "200,000,000",
    coinRebate: "—",
    cashShare: "50%",
    benefits: [
      "link",
      "assets",
      "academy",
      "service",
      "consultant",
      "signOnline",
      "auction",
      "dashboard",
      "interview"
    ]
  },
  {
    name: "特约股东",
    requirement: "定向邀请",
    coinRebate: "—",
    cashShare: "70%",
    benefits: [
      "link",
      "assets",
      "academy",
      "service",
      "consultant",
      "signOffline",
      "auction",
      "dashboard",
      "interview"
    ]
  },
  {
    name: "名人堂",
    requirement: "定向邀请",
    coinRebate: "—",
    cashShare: "80%",
    benefits: [
      "link",
      "assets",
      "academy",
      "service",
      "consultant",
      "signOffline",
      "auction",
      "dashboard",
      "interview",
      "annual"
    ]
  }
];

const settlementChannels = [
  {
    channel: "官网（支付宝/微信）",
    split: "0%",
    cost: "30%",
    settlement: "70%"
  },
  {
    channel: "官网游戏包内（安卓/PC）",
    split: "0%",
    cost: "30%",
    settlement: "70%"
  },
  {
    channel: "官方下载包内（iOS）",
    split: "30%",
    cost: "30%",
    settlement: "40%"
  },
  {
    channel: "渠道短链游戏包（安卓/PC）",
    split: "50%",
    cost: "30%",
    settlement: "20%"
  },
  {
    channel: "渠道短链游戏包（iOS）",
    split: "65%",
    cost: "30%",
    settlement: "5%"
  }
];

export default function LegendaryPartnersPage() {
  return (
    <main className={styles.wrapper}>
      <section className={styles.hero}>
        <span className={styles.tagline}>传奇合伙人计划</span>
        <h1>打造全民共创的裂变型游戏生态</h1>
        <p>
          “传奇合伙人计划”以米拉（Mira）为成长与增值核心，通过充值、推广、活跃等行为累计米拉星级，
          进阶成为传奇合伙人乃至特约股东，实现“玩得久、赚得多、能发展”的可持续成长路径。
        </p>
      </section>

      <section className={styles.section}>
        <h2>体系定位与价值</h2>
        <p>
          计划围绕“全民可参与、可成长、可盈利”三大目标构建，由米拉星级体系串联权益、奖励与晋升机制。
        </p>
        <ul className={styles.valueList}>
          {valueHighlights.map((value) => (
            <li key={value}>{value}</li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h2>米拉（Mira）成长体系</h2>
        <p>
          米拉是平台的成长凭证，可用于升级星级、解锁活动与权益；用户通过充值、推广、活跃等行为积累米拉，
          既能享受即时返利，也能够带动团队壮大，迈向签约制与股东制合作。
        </p>
        <div className={styles.notice}>
          <strong>米拉用途：</strong>升级星级、解锁平台活动与权益 | 团队共创成长与收益分润的核心衡量单位
        </div>
        <div className={styles.sourceSection}>
          <h3>米拉获取来源</h3>
          <ul className={styles.sourceList}>
            {miraSources.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className={styles.sourceTableWrapper}>
            <table className={styles.sourceTable}>
              <thead>
                <tr>
                  <th>类型</th>
                  <th>来源（行为）</th>
                  <th>触发条件</th>
                  <th>获取米拉</th>
                  <th>频率/上限</th>
                  <th>验证/证据</th>
                  <th>风控/备注</th>
                </tr>
              </thead>
              <tbody>
                {miraSourceDetails.map((detail, index) => (
                  <tr key={`${detail.source}-${index}`}>
                    <td>{detail.type}</td>
                    <td>{detail.source}</td>
                    <td>{detail.trigger}</td>
                    <td>{detail.formula}</td>
                    <td>{detail.frequency}</td>
                    <td>{detail.proof}</td>
                    <td>{detail.notes ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className={styles.assessment}>
          <h3>月度考核晋级与降级机制</h3>
          <div className={styles.assessmentBlock}>
            <h4>晋级机制</h4>
            <p>
              每自然月末系统自动考核本月累计积分是否达到下一星级阈值，达标即刻晋级并从当月起按新星级发放分成；未达标则进入保级评估环节。
            </p>
            <div className={styles.exampleCard}>
              <strong>示例：</strong>
              小李当前为积分二星（累计 50 万积分），月末若累计达到 150 万积分则晋升为积分三星，当月分成按积分三星发放；未达成则进入保级考核。
            </div>
          </div>
          <div className={styles.assessmentBlock}>
            <h4>保级 / 降级机制</h4>
            <p>
              系统根据团队新增积分自动判定：若连续两个月月度新增积分低于当前星级标准的 20%，则自动降级一级，降级当月按新星级结算。
            </p>
            <div className={styles.exampleCard}>
              <strong>示例：</strong>
              小李仍为积分二星（累计 50 万积分），若连续两个自然月新增积分均低于 10 万，则降为积分一星，并按一星比例发放当月分成。
            </div>
          </div>
        </div>
        <div className={styles.settlementSection}>
          <h3>结算比例与发放流程</h3>
          <p>
            结算由“分成比例 × 渠道可结算比例”共同决定，并在上下级之间按照 2:8 的分配规则执行。平台提供实时的积分与充值看板，支持随时发起结算申请。
          </p>
          <div className={styles.settlementOverview}>
            <div className={styles.settlementCard}>
              <strong>分成比例</strong>
              <span>发生充值行为的账号所对应星级的分成比例。</span>
            </div>
            <div className={styles.settlementCard}>
              <strong>可结算金额</strong>
              <span>根据充值渠道的运营成本和渠道分成，计算可结算比例。</span>
            </div>
            <div className={styles.settlementCard}>
              <strong>结算分配</strong>
              <span>上级账号获得 20%，充值账号获得 80%。</span>
            </div>
          </div>
          <div className={styles.exampleGroup}>
            <div className={styles.exampleCard}>
              <strong>示例 1：</strong>
              A 邀请 B 注册，A 为殿堂合伙人（分成比例 40%，现金结算），B 为积分六星（分成比例 20%，COIN 结算）。B 在官网/官方游戏包内充值 100 元，可结算金额 = 100 × 70% × 20% = 14 元；A 获得 14 × 20% = 2.8 元现金，B 获得 14 × 80% = 11.2 元 COIN。
            </div>
            <div className={styles.exampleCard}>
              <strong>示例 2：</strong>
              无人邀请的 C 为传奇合伙人（分成比例 30%，COIN 结算）。C 在官网/官方游戏包内充值 100 元，可结算金额 = 100 × 70% × 30% = 21 元；C 获得 21 × 100% = 21 元 COIN。
            </div>
          </div>
          <div className={styles.channelTableWrapper}>
            <table className={styles.channelTable}>
              <thead>
                <tr>
                  <th>充值渠道</th>
                  <th>渠道分成</th>
                  <th>运营成本</th>
                  <th>可结算金额 = 充值额 × (1 - 总成本)</th>
                </tr>
              </thead>
              <tbody>
                {settlementChannels.map((row) => (
                  <tr key={row.channel}>
                    <td>{row.channel}</td>
                    <td>{row.split}</td>
                    <td>{row.cost}</td>
                    <td>{row.settlement}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={styles.checklist}>
            <h4>结算周期 / 流程</h4>
            <ol>
              <li>用户可实时看到个人累计积分、当月累计积分（每日定时更新）。</li>
              <li>用户可实时查看当月个人、团队累计充值金额（每日定时更新）。</li>
              <li>系统实时展示可结算金额；每个自然月初完成上一自然月积分星级考核，并更新可结算金额。</li>
              <li>用户可随时申请结算，平台在次月 15 日（节假日顺延）以 COIN 或现金方式发放。</li>
            </ol>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h3>星级权益一览</h3>
        <div className={styles.tableWrapper}>
          <table className={styles.tierTable}>
            <thead>
              <tr>
                <th>星级</th>
                <th>累计获得米拉</th>
                <th>COIN 返利</th>
                <th>现金分成</th>
                {benefitDefinitions.map((benefit) => (
                  <th key={benefit.key}>{benefit.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tiers.map((tier) => (
                <tr key={tier.name}>
                  <td>
                    <div className={styles.tierName}>
                      <span>{tier.name}</span>
                      {tier.description ? (
                        <small className={styles.tierNote}>{tier.description}</small>
                      ) : null}
                    </div>
                  </td>
                  <td>{tier.requirement}</td>
                  <td>{tier.coinRebate}</td>
                  <td>{tier.cashShare}</td>
                  {benefitDefinitions.map((benefit) => (
                    <td key={benefit.key}>
                      {tier.benefits.includes(benefit.key as BenefitKey) ? (
                        <span className={styles.badgeYes}>有</span>
                      ) : (
                        <span className={styles.badgeNo}>—</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className={styles.footnote}>
          ※ 米拉星级对应的返利与分成比例基于团队贡献动态调整；MG 押金机制确保合作伙伴的长期激励与合规运营。
        </p>
      </section>
    </main>
  );
}
