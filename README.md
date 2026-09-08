# AI Video Skills Suite

一套面向短视频 AI 生成流程的 Skill，覆盖输入采集、项目初始化、缺项补全、角色与场景设计、分镜拆分（前3秒钩子 + 情绪节拍）、提示词生成、一致性校验、后期交付（字幕安全区 + BGM 音效）、媒体生产组装和发布包——从素材到可用成片再到发布建议的端到端流程。

这套 Skill 的重点不只是"写出分镜和提示词"，而是把故事推进到**可剪辑、可落成完整视频**的程度。

## 安装（跨 macOS / Windows / Linux）

本 Skill 遵循 [Agent Skills 开放标准](https://agentskills.io)，兼容 Claude Code、Cursor、Codex CLI、Gemini CLI、GitHub Copilot、Windsurf、Trae、WorkBuddy 等工具的 Skill 目录约定。安装器会**自动探测你当前使用的 AI 工具**，装到对应目录：

```bash
node install.mjs          # 交互模式：探测 + 选择工具与层级
node install.mjs --list   # 先看看探测到哪些工具
```

也可指定目标，或手动复制（详见 `skills/ai-video-suite/references/install-guide.md`）：

```bash
node install.mjs --agent claude-code --scope user   # 装到 Claude Code 用户级目录
node install.mjs --agent trae                       # 装到当前项目 .trae/skills/
node install.mjs --check                            # 检查安装状态与版本
```

安装器零依赖（Node.js 16+），不联网、不执行 Skill 内容；覆盖前自动备份，卸载保留备份。

## 使用说明（装好之后）

完整使用说明见 `skills/ai-video-suite/references/usage-guide.md`。快速上手：

**你可以给什么**——六种输入形式，入口都能接：

| 形式 | 示例 |
|---|---|
| 对话文本 | 直接粘贴故事、大纲、角色设定 |
| 文本文件 | "读一下 ~/story/chapter1.md"（.txt/.md 剧本，.csv/.json 已有分镜） |
| 纯图片 | 上传角色设定图 / 场景参考图 / 风格参考板（反推为草稿，等你确认） |
| 图文结合 | 剧本文件 + 参考图一起给 |
| 互联网资源 | "参考这个链接：https://..."（需登录的内容请自行粘贴） |
| 既有项目 | "继续上次的 XX 项目"（从第一个未完成步骤继续） |

**怎么说**——直接自然语言：

- "我想做一个 AI 短视频，从哪开始？"
- "把这份剧本做成短视频：<粘贴文本>"
- "用这张角色图和这段剧情，帮我出分镜"
- "把这些片段拼成成片"

**端到端流程**：`输入采集 → sk0 项目配置与模型画像 → sk0b 缺项预检 → sk1 角色设计 ∥ sk2 场景设计 → sk3 分镜拆分 → sk4 提示词生成 → sk5 一致性审计 → sk6 字幕/TTS/音频路线 → sk7 媒体生产与成片组装`

环境具备生成工具与 ffmpeg 时自动产出 `05_final-deliverables/film/full-film.mp4`；不具备时产出可直接复制到任何视频平台执行的生产任务清单 + 全部提示词与关键帧。

## 这套 Skill 重点解决什么

除了基础的角色、场景、分镜和提示词生成，这一版额外强化了 4 类问题：

1. 模型能力差异
2. 多镜头连续性
3. 音频、台词与口型路线选择
4. 多源输入与端到端成片（文本/图片/URL 素材 → 可用视频）

也就是说，这套 Skill 默认不假设所有模型都很强，而是先建立**模型能力画像**，再决定：单段拆多长、是否优先静音视频、是否尝试原生台词、是否启用更强的连续性约束、是否优先走后期 TTS 兜底。

## 3 分钟开始

| 你手上有什么 | 推荐入口 |
|---|---|
| 完整故事原文或完整剧本 | 从 sk0 开始，走完整流程 |
| 只有剧情大纲 | 从 sk0 开始，由 sk0b 补缺项 |
| 只有单段片段 | smoke test 快速模式，先跑最小闭环 |
| 已有分镜 | sk0 后可跳到 sk4 / sk5 / sk6 |
| 已有提示词 | sk0 后直接做 sk5 + sk6 |
| 已有片段，只差成片 | sk0 后直接进 sk7 组装 |

首次使用建议按 `skills/ai-video-suite/references/walkthrough-cafe-scene.md` 跑一次单段 smoke test。

### 什么算成功

首次 smoke test 满足下面 4 条，就可以认为接入基本可用：

1. 对应工具的 Skill 列表出现 `ai-video-suite`，说"帮我做一个 AI 短视频"能触发入口路由
2. Agent 能稳定读取 `skills/ai-video-suite/` 下的模块文件
3. 能生成对应步骤要求的文档骨架和输出文件
4. sk5 一致性审计能产出明确的四档状态结果，而不是中途失控补写

### 出问题先看哪里

按这个顺序排查：

1. `node install.mjs --check`（确认安装状态与版本）
2. `skills/ai-video-suite/references/install-guide.md`
3. `skills/ai-video-suite/references/dependency-flow.md`
4. `skills/ai-video-suite/references/faq.md`
5. 对应模块目录下的 `module.md`、`prompts.md`、`outputs-template.md`

## 目录结构

```
├── install.mjs                跨平台安装器（自动探测 AI 工具）
└── skills/
    └── ai-video-suite/        唯一的安装单元（自包含）
        ├── SKILL.md           入口：触发、路由、执行契约
        ├── references/        input-ingestion + sk0~sk8 模块 + 流程/规则/FAQ/使用与安装指南
        ├── lib/               风格预设、镜头知识、命名规则、模型能力预设
        ├── schemas/           项目配置 / 角色 / 场景 / 分镜 / 提示词 Schema
        ├── templates/         项目目录骨架（含素材清单与进度文档）
        └── scripts/           gen-srt / validate-naming / check_environment / assemble-video
```

## 推荐执行顺序

默认顺序：`sk0 -> sk0b -> sk1 + sk2 -> sk3 -> sk4 -> sk5`（`sk6` 在 `sk3` 后、`sk7` 在 `sk4`+`sk6` 后即可并行启动）。
具体跳步规则以 `references/dependency-flow.md` 和各模块 `module.md` 为准。

## 使用边界

- 不引入新依赖，不绑定某一个 AI 工具
- 不默认所有模型都支持长视频、原生台词或稳定口型
- 不把 showcase_pack 冒充为 reference_pack
- 图片/视频生成类调用执行前必须获得用户授权（费用、覆盖范围）
- 遇到事实缺失时，正确行为是暂停并追问，不是补写默认值

## 版本信息

- 版本号见 `VERSION`（同时同步在 SKILL.md frontmatter 的 metadata.version 中，两处一起改）
- 协议见 `LICENSE`（MIT）
