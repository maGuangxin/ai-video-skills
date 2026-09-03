# SKILL: sk0_project_init_guided

## 一、职责边界
**做什么**：通过 Agent 主动提问的方式逐项收集 12 项全局基础配置，生成《项目基础配置表.md》作为整个 Skill 包的唯一真相源（Single Source of Truth）。
**不做什么**：
- 不写剧情内容 / 不写角色设定 / 不写分镜 / 不写提示词
- 不脑补不填默认值，未回答的项必须标记 `⚠️待用户确认`
- 未完成 12 项核心必填项之前，禁止启动后续 SK1~SK6 任何 Skill

## 二、输入输出
### 输入（无前置 Skill，直接由用户触发）
- 用户自然语言描述（可以是完整故事、几句话、单段剧情、一张截图描述等任意形式）
- 调用话术模板：见 `prompts.md`（12 项逐项通俗提问，不带专业术语）

### 输出
| 输出文件 | 落盘路径（相对项目根目录） | 说明 |
|---|---|---|
| 项目基础配置表.md | `00_project-config/project-base-config.md` | 12 项配置完整结构化清单，100% 由用户回答填充，无脑补 |
| 缺项待确认清单.md | `00_project-config/pending-confirmations.md` | 本轮对话中用户未回答或回答不明确的项，逐条列清 |
| 项目目录骨架自动应用 | `<project-root>/` | 自动从 `templates/project-skeleton/` 复制 7 层职能目录到项目根 |

## 三、依赖关系
- **前置依赖**：无（SK0 是整个流程的入口点）
- **强制串行后续**：所有后续 Skill（SK1~SK6）必须读取本 Skill 输出的 `project-base-config.md`，配置不齐不启动

## 四、执行步骤
1. 从 `templates/project-skeleton/` 复制 7 层目录骨架到项目根目录
2. 逐条读 `prompts.md` 的 12 项提问话术，**按顺序一项一项问用户**（不要一次性抛 12 条）
3. 每一项用户回答后，结构化写入 `project-base-config.md` 对应字段
4. 未回答/回答模糊的项，写入 `pending-confirmations.md` 并打标 `⚠️待用户确认`
5. 12 项核心必填（`schemas/project-config.schema.json` 的 required 列表）全部填完后，输出「✅配置就绪，可以继续执行后续 Skill」；缺项时输出「⚠️还有 N 项待确认，确认完再继续」

## 五、配置项来源
12 项完整配置定义参考：
- 结构化 Schema：`schemas/project-config.schema.json`（Draft 7）
- 提问话术模板（通俗交互层）：`prompts.md`
- 产物格式模板（专业结构化层）：`outputs-template.md`
