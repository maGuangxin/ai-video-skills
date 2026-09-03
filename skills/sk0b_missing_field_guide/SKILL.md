# SKILL: sk0b_missing_field_guide（缺项补全引导引擎 · 全局 pre-hook）

## 一、职责边界
**做什么**：每一个后续 Skill（SK1~SK6）**启动前自动触发本 Skill**，扫描该 Skill 的必填输入槽位，如果有缺失：
1. 不脑补、不编造、不填默认值
2. 生成一份「缺项待确认清单」，逐条列出：项目字段 / 为什么需要 / 建议填什么
3. 用用户最容易理解的话提问，不暴露专业术语
4. 把所有不确定项写入项目级 `pending-confirmations.md` 并打标 `⚠️待用户确认`

**不做什么**：
- 绝不帮用户填「可能是这个吧」的内容
- 绝不自动把缺项设为 SKILL 包的默认值（除非用户显式确认）
- 绝不跳过缺项继续启动后续 Skill（核心必填缺 = 停止，列清单给用户）

## 二、输入输出
### 输入
- `project-base-config.md`（来自 SK0）
- 目标 Skill 的必填 `required` 字段列表（读对应 Schema 的 `required`）

### 输出
| 输出 | 路径 |
|---|---|
| 追加更新缺项清单 | `00_project-config/pending-confirmations.md` |
| 本轮缺失项待确认清单（本次新增） | `99_temporary-workspace/missing-fields-<target-skill-id>-<timestamp>.md`（供清理建议） |

## 三、依赖关系
- **依赖**：SK0 先跑完
- **绑定关系**：所有 SK1~SK6 启动的 pre-hook，每步都先跑一遍本 Skill，缺就问，齐了才启动

## 四、执行步骤
1. 读取目标 Skill 的 Schema（例：启动 SK1 前读 `schemas/character.schema.json`）
2. 对照 `project-base-config.md` 中的对应字段值
3. 核心 required 字段如果是 `null` / `⚠️待用户确认` / 空字符串：
   - 追加到 `pending-confirmations.md`
   - 用 `prompts.md` 的通俗话逐项问用户
4. 全部填齐 → 返回「✅校验通过，可以启动目标 Skill」
5. 还有缺 → 返回「⚠️暂停启动，还有 N 项需要您确认：列清单」
