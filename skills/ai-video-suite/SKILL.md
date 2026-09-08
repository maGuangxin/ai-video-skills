---
name: ai-video-suite
description: 短视频 AI 生成全流程技能套件。当用户想用 AI 制作短视频（如"帮我做AI短视频""把这个故事做成视频""拆分镜""生成视频提示词""检查角色一致性""做字幕/TTS/剪映方案""把这些分镜片段拼成成片"）时使用。支持文本、文件、图片、图文、URL 等多种输入；按 输入采集→项目配置→缺项预检→角色/场景设计→分镜拆分→提示词生成→一致性审计→后期交付→媒体生产 的流水线推进：先建立模型能力画像，再决定拆镜强度、提示词模式（safe/balanced/expressive）与音频路线（静音+TTS/原生/混合）；关键事实缺失时暂停追问，不补写默认值。
license: MIT
metadata:
  version: "2.1.0"
  author: Project Distilled Team
  repo: https://github.com/maGuangxin/ai-video-skills
---

# AI 视频技能套件

## 触发场景

用户表达以下任一意图时激活本 Skill：

1. 从零开始做一个 AI 短视频（完整故事 / 大纲 / 单段片段）
2. 提供图片、文件或链接，希望转成短视频设定或分镜
3. 已有分镜或提示词，需要检查、补全、做后期或拼成成片
4. 涉及角色一致性、镜头连续性、参考图约束的 AI 视频问题

## 模块路由

本 Skill 是套件入口，只做路由和契约检查，实际执行由模块完成：

| 用户手上的东西 | 典型说法 | 模块 |
|---|---|---|
| 素材（文本/文件/图片/图文/URL） | "读一下这个文件""用这张图设定角色""参考这个链接" | `references/input-ingestion.md` |
| 什么都不确定 | "我想做个AI短视频，从哪开始" | `references/sk0-project-init/module.md` |
| 完整故事 / 剧本 | "把这个故事做成视频" | sk0 → 完整流程 |
| 只有剧情大纲 | "我有个剧情梗概" | sk0，由 sk0b 补缺项 |
| 单段片段 | "就这十几秒，先跑通一次" | sk0（smoke test 快速模式） |
| 已有分镜 | "分镜写好了，帮我出提示词" | sk0 → sk4 / sk5 / sk6 |
| 已有提示词 | "帮我检查这些提示词" | sk0 → sk5 + sk6 |
| 已有片段或想要成片 | "把这些片段拼成成片""直接生成视频" | `references/sk7-media-production/module.md` |
| 成片就绪，准备发布 | "帮我出封面和标题""给发布建议" | `references/sk8-publish-package/module.md` |
| 之前的项目 | "继续上次的 XX 项目" | input-ingestion §5.4 → 从未完成步骤继续 |

模块清单与职责：

| 模块 | 职责 |
|---|---|
| `input-ingestion` | 输入采集与素材归一化（文本/文件/图片/图文/URL/既有项目） |
| `sk0-project-init` | 项目配置访谈、模型能力画像、provider 预检、目录骨架 |
| `sk0b-missing-field-guide` | 全局缺项预检（进入任何模块前的 pre-hook） |
| `sk1-character-design` | 角色设定、三层控制字段、参考图资产门禁 |
| `sk2-scene-design` | 场景设定、空间锚点、统一视觉规范 |
| `sk3-storyboard-split` | 分镜拆分、时间轴、镜头连续性约束 |
| `sk4-prompt-generator` | 三模式视频提示词生成 |
| `sk5-consistency-audit` | 四档状态一致性审计与进度总览 |
| `sk6-postproduction-bundle` | SRT / TTS 清单 / 音频路线 / 剪辑操作手册 |
| `sk7-media-production` | 关键帧与片段生产、成片组装、降级任务清单 |

## 执行契约

1. 用户素材先经 input-ingestion 归一化并登记 `00_project-config/input-manifest.md`
2. 任何 sk1–sk8 模块启动前，sk0 产物（project-base-config.md + 模型能力画像）必须存在
3. 进入 sk1–sk8 前先过 sk0b 缺项预检
4. 关键事实缺失 → 暂停并写入 `00_project-config/pending-confirmations.md`，不补写默认值
5. 默认执行顺序与跳步规则见 `references/dependency-flow.md`（权威来源）
6. 图片/视频生成类调用执行前必须按 `references/project-rules.md` 第 6 节获得用户授权
7. 本 Skill 的安装由仓库根目录的 `install.mjs` 完成，Skill 运行期不做任何安装操作

## 路径约定

本文件及所有模块中出现的相对路径，一律相对**本 Skill 根目录**（`ai-video-suite/`）解析，包括 `references/`、`lib/`、`schemas/`、`templates/`、`scripts/`。产出型路径（如 `00_project-config/`）相对用户项目根目录。

## 套件不做的事

- 不调用图片 / 视频 / TTS 生成服务（sk7 在环境具备工具且经用户授权时除外）
- 不自动操作剪辑软件或导出成片（ffmpeg 自动组装除外）
- 不在事实缺失时猜测填充
- 不执行任何 IDE 安装、配置修改或环境变更

## 首次使用

建议先按 `references/walkthrough-cafe-scene.md` 跑一次单段 smoke test，再进入真实项目。完整使用说明见 `references/usage-guide.md`；常见问题见 `references/faq.md`；跨模块硬规则（资产语义、能力门禁、命名分层、输入信任分级、中途变更失效、生产授权）见 `references/project-rules.md`。
