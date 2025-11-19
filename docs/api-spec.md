# 传奇合伙人前后端接口规范（草案）

> 版本：v1.0（Mock 前端原型配套）  
> 所有接口均以 HTTPS + JSON 传输，示例路径使用 `/api/v1/...`。响应采用统一封装 `{ code, message, data }`，错误使用 HTTP 4xx/5xx + `{ code, message, details }`。

---

## 目录

1. [认证与会话](#认证与会话)
2. [门户（/legendary-partners）](#门户legendary-partners)
3. [加入流程与团队绑定](#加入流程与团队绑定)
4. [Dashboard 总览](#dashboard-总览)
5. [Dashboard 交互接口](#dashboard-交互接口)
6. [收益模拟器](#收益模拟器)
7. [生态说明（/legendary-partnersecosystem）](#生态说明legendary-partnersecosystem)
8. [导航与公共配置](#导航与公共配置)
9. [数据结构附录](#数据结构附录)

---

## 认证与会话

| 方法 | 路径 | 描述 |
| --- | --- | --- |
| `POST` | `/api/v1/auth/login` | 账号密码登录，返回 `{ token, userId, expires }`。 |
| `GET` | `/api/v1/auth/me` | 读取当前登录用户信息（姓名、手机号、邮箱、当前星级、是否已加入、`joinedAt` 等）。前端用来决定门户默认视图。 |

---

## 门户（/legendary-partners）

| 方法 | 路径 | 描述 |
| --- | --- | --- |
| `GET` | `/api/v1/portal/highlights` | 返回亮点卡片列表 `{ title, description, icon? }`。 |
| `GET` | `/api/v1/portal/journey` | 返回“成长旅程一览”文案，供模块动态化。 |
| `GET` | `/api/v1/portal/scenarios` | 返回“已加入 / 尚未加入”两种状态的展示文案与 CTA（按钮文本、跳转链接）。 |

---

## 加入流程与团队绑定

| 方法 | 路径 | 描述 |
| --- | --- | --- |
| `POST` | `/api/v1/partners/apply` | 请求体 `{ mode: "self" \| "uplink", uplinkCode? }`。返回 `{ status: "pending" \| "approved", assignedTier, reviewEta }`。 |
| `POST` | `/api/v1/partners/uplink` | 请求体 `{ uplinkCode }`。成功后不可撤销，返回最新团队信息或 `{ success, message }`。 |
| `GET` | `/api/v1/partners/invite-link` | 返回 `{ link, code }`，用于“发展团队”弹窗。 |

---

## Dashboard 总览

`GET /api/v1/dashboard/overview`

```jsonc
{
  "code": 0,
  "message": "ok",
  "data": {
    "userStats": { ...见附录 },
    "currentMonth": { ... },
    "privileges": [ ... ],
    "earningsHistory": [ ... ],
    "levelTimeline": [ ... ],
    "teamSnapshot": { ... },
    "notifications": [ ... ],
    "actions": {
      "canApplySettlement": true,
      "canInviteDownline": true
    }
  }
}
```

详见 [数据结构附录](#数据结构附录)。

---

## Dashboard 交互接口

| 方法 | 路径 | 描述 |
| --- | --- | --- |
| `GET` | `/api/v1/dashboard/earnings` | 查询某月收益明细，参数 `month=YYYY-MM&page=1&pageSize=20`。 |
| `GET` | `/api/v1/dashboard/team-ranking` | 下线排行榜，支持分页/筛选。 |
| `POST` | `/api/v1/settlements/apply` | 申请结算，体 `{ amount, method }`。 |
| `POST` | `/api/v1/partners/invite/bind` | Dashboard“添加直属上线”弹窗提交；请求 `{ uplinkCode }`，返回 `{ success, newTier?, message }`。 |

---

## 收益模拟器

| 方法 | 路径 | 描述 |
| --- | --- | --- |
| `POST` | `/api/v1/simulation/run` | 请求体与前端 `SimulationCore` 输入一致：`{ months: [{ selfRecharge, downlineRecharge, registrations, level50 }], tierOverrides?, specialBonuses?, shareRatioOverrides? }`。返回各月 `MonthResult`（米拉计算步骤、星级晋级情况、coin/cash 计算过程等）。 |
| `GET` | `/api/v1/simulation/presets` | 提供预设场景列表（官方三个月故事、直播加成场景等），便于前端下拉加载。 |

---

## 生态说明（/legendary-partners/ecosystem）

| 方法 | 路径 | 描述 |
| --- | --- | --- |
| `GET` | `/api/v1/ecosystem/sections` | 返回计划定位、米拉体系、考核规则等富文本/图片模块，供页面按模块渲染。 |
| `GET` | `/api/v1/ecosystem/tiers` | 返回星级矩阵： `{ name, threshold, coinRate, cashRate, privileges[] }`。 |
| `GET` | `/api/v1/ecosystem/mira-sources` | 返回米拉来源表格（用法、触发条件、上限、奖励）。 |

---

## 导航与公共配置

| 方法 | 路径 | 描述 |
| --- | --- | --- |
| `GET` | `/api/v1/navigation/routes` | 返回 `{ path, label }[]`，供面包屑/顶部导航使用。 |
| `GET` | `/api/v1/config/metadata` | 返回站点名称、Logo、SEO 描述等全局信息。 |

---

## 数据结构附录

### 1. `userStats`

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `userId` | `string` | 合伙人编号（例 `LP-203948`） |
| `name` | `string` | 显示姓名 |
| `tier` | `string` | 当前星级名称 |
| `tierBadge` | `"coin" \| "cash"` | 返利模式标签 |
| `availableCoin` | `number` | 可用 COIN |
| `availableCash` | `number` | 可提现现金（人民币） |
| `cumulativeMira` | `number` | 累计米拉积分 |
| `nextTier` | `{ name: string; required: number }` | 下一等级和所需米拉 |
| `monthlyRecharge` | `number` | 本人当月充值 |
| `teamRecharge` | `number` | 团队当月充值 |

### 2. `currentMonth`

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `miraEarned` | `number` | 本月新增米拉 |
| `coinEarned` | `number` | 本月 COIN 返利 |
| `cashEarned` | `number` | 本月现金返利 |
| `retentionNeeded` | `number` | 距离保级所需米拉（≤0 表示已达标） |
| `retentionStatus` | `"met" \| "warning"` | 保级状态 |
| `notes` | `string[]` | 额外提示（可选） |

### 3. `privileges[]`

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `label` | `string` | 权益名称 |
| `granted` | `boolean` | 是否解锁 |
| `category` | `string` (可选) | 权益分组 |

### 4. `earningsHistory[]`

```ts
type EarningDetail = {
  datetime: string;        // ISO8601
  source: string;
  mira: number;
  coin: number;
  cash: number;
  miraTooltip?: string;
  coinTooltip?: string;
  cashTooltip?: string;
};

type EarningsHistoryRow = {
  month: string;           // "2024年05月"
  tier: string;
  mira: number;
  coin: number;
  cash: number;
  details: EarningDetail[];
};
```

### 5. `levelTimeline[]`

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `date` | `string` | `YYYY-MM-DD` |
| `label` | `string` | 节点标题 |
| `note` | `string` | 备注 |

### 6. `teamSnapshot`

```ts
type TeamSnapshot = {
  totalDownlines: number;
  active30d: number;
  level50: number;
  monthMira: number;
  uplink?: { name: string; tier: string } | null;
  ranking: Array<{ name: string; tier: string; mira: number }>;
};
```

### 7. `notifications[]`

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `title` | `string` | 标题 |
| `detail` | `string` | 内容 |
| `type` | `"info" \| "warning" \| "success"` (可选) |
| `action` | `{ label: string; href: string }` (可选) |

---

## 其他建议

1. **权限与限流**：对加入/绑定等操作进行频率限制，并校验用户是否已具备合伙人资格。  
2. **实时性**：Dashboard 指标若需实时刷新，可追加 WebSocket/SSE 推送（米拉累积、团队充值等）。  
3. **多语言**：如需国际化，可在接口返回多语言字段或基于 `Accept-Language` 协商。  
4. **版本管理**：建议在 URI 中保留版本号（如 `/api/v1`），以便后续平滑升级。  
5. **安全**：所有敏感操作使用 HTTPS + JWT/Session；关键接口增加签名或二次确认。  

---

> 本规范基于当前前端原型的功能范围整理，可作为后端实现/联调的起点，后续可根据真实业务扩展。
