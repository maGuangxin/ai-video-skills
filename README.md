# AI Video Skills Suite

一套面向短视频 AI 生成流程的 Skill 包，覆盖项目初始化、缺项补全、角色与场景设计、分镜拆分、提示词生成、一致性校验和后期交付。

这套 Skill 的重点不只是“写出分镜和提示词”，而是尽量把故事推进到**可剪辑、可落成完整视频**的程度。

## 先看这里

如果你是第一次使用，建议只按下面 5 步开始：

1. 阅读 `docs/install-guide-for-agents.md`
2. 如果希望 IDE 在项目内直接感知 Skill，先识别当前 IDE / Agent 的安装模式：
   - 如果当前 IDE 是 Trae，再执行项目根目录 `.trae` 安装
   - 如果是其他支持项目级 Skill 目录的 IDE / Agent，按其官方文档定位目录
   - 如果不支持项目级安装，则保留仓库旁路并手动读取 `SKILL.md`
3. 选择接入方式：
   - 能直接让 Agent 读取 Markdown 时，优先使用 `skills/*/SKILL.md` 手动调用方式
   - 只有在当前 Agent 明确支持 manifest 时，再尝试 `skills.manifest.yaml`
4. 运行 `examples/quickstart-cafe-scene/walkthrough.md`
5. 看到 smoke test 成功标准后，再进入真实项目

## 这套 Skill 重点解决什么

除了基础的角色、场景、分镜和提示词生成，这一版额外强化了 3 类问题：

1. 模型能力差异
2. 多镜头连续性
3. 音频、台词与口型路线选择

也就是说，这套 Skill 默认不假设所有模型都很强，而是先建立**模型能力画像**，再决定：

- 单段拆多长
- 是否优先静音视频
- 是否尝试原生台词
- 是否启用更强的连续性约束
- 是否优先走后期 TTS 兜底

## 3 分钟开始

### 你适合从哪个入口开始

| 你手上有什么 | 推荐入口 |
|---|---|
| 完整故事原文或完整剧本 | 从 `sk0_project_init_guided` 开始，走完整流程 |
| 只有剧情大纲 | 从 `sk0_project_init_guided` 开始，由 `sk0b_missing_field_guide` 补缺项 |
| 只有单段片段 | 用 `single_scene_clip_ready` 入口，先跑最小闭环 |
| 已有分镜 | `sk0` 后可跳到 `sk4` / `sk5` / `sk6` |
| 已有提示词 | `sk0` 后直接做 `sk5` + `sk6` |

### 第一次先跑哪一步

推荐先跑单段 smoke test：

1. 准备 `ai-video-skills/`
2. 如果当前 IDE 是 Trae 且目标是项目内安装，先跑 `apply-trae.sh` 或 `apply-trae.bat`
3. 如果是其他 IDE / Agent，先确认其项目级目录或降级为手动读取
4. 让 Agent 按顺序读取：
   - `skills/sk0_project_init_guided/SKILL.md`
   - `skills/sk0b_missing_field_guide/SKILL.md`
   - `skills/sk1_character_design/SKILL.md`
   - `skills/sk2_scene_design/SKILL.md`
   - `skills/sk3_storyboard_split/SKILL.md`
   - `skills/sk4_prompt_generator/SKILL.md`
   - `skills/sk5_consistency_audit/SKILL.md`
   - `skills/sk6_postproduction_bundle/SKILL.md`
5. 按 `examples/quickstart-cafe-scene/walkthrough.md` 提供的单段示例执行

### 什么算成功

首次 smoke test 满足下面 5 条，就可以认为接入基本可用：

1. 若目标是项目内安装，当前 IDE / Agent 对应安装态检查通过，或已明确记录 `manual-fallback`
2. Agent 能稳定读取 `skills/*/SKILL.md`
3. 能生成对应步骤要求的文档骨架和输出文件
4. `sk5_consistency_audit` 能产出明确的状态结果，而不是中途失控补写
5. Skill 能给出当前模型下更稳的生产路线，而不是默认所有能力都可用

### 出问题先看哪里

按这个顺序排查：

1. `docs/install-guide-for-agents.md`
2. `docs/dependency-flow.md`
3. `docs/faq.md`
4. 对应 Skill 目录下的 `SKILL.md`、`prompts.md`、`outputs-template.md`
5. `apply-trae.sh` / `apply-trae.bat`（仅 Trae）

## 接入方式

本仓库提供两种接入方式：

### 方式 A：manifest 接入

适用于当前 Agent 明确支持 YAML manifest 的情况。

- 入口文件：`skills.manifest.yaml`
- 是否能自动注册：取决于具体 Agent 版本和加载规则
- 使用前建议先看对应 Agent 的官方文档

### 方式 B：直接读取 `SKILL.md`

这是本仓库最稳妥的通用方式。

- 入口目录：`skills/<skill-id>/SKILL.md`
- 只要 Agent 能读取 Markdown，就可以按运行手册执行
- 不依赖 manifest 解析能力

## 8 个 Skills

| Skill ID | 作用 | 默认位置 |
|---|---|---|
| `sk0_project_init_guided` | 收集项目基础配置、模型能力画像与推荐生产路线 | `00_project-config/` |
| `sk0b_missing_field_guide` | 在每步执行前检查缺项并暂停追问 | `00_project-config/` |
| `sk1_character_design` | 输出角色设定、角色不变量和跨镜状态字段 | `01_character-design/` |
| `sk2_scene_design` | 输出场景设定、空间锚点、机位参考区与统一视觉规范 | `02_scene-design/` |
| `sk3_storyboard_split` | 生成分镜脚本、关键帧约束、连续性字段和 shot 目录 | `03_storyboard/` |
| `sk4_prompt_generator` | 按 `safe / balanced / expressive` 三模式生成每段 `video-prompt.md` | `03_storyboard/` |
| `sk5_consistency_audit` | 汇总状态并审计一致性、连续性与模型适配 | `00_project-config/` |
| `sk6_postproduction_bundle` | 生成字幕、TTS 清单、音频路线说明和剪映操作手册 | `05_final-deliverables/` |

## 推荐执行顺序

默认顺序：

`sk0 -> sk0b -> sk1 + sk2 -> sk3 -> sk4 -> sk5`

补充说明：

- `sk1` 与 `sk2` 可以并行
- `sk6` 在 `sk3` 之后即可启动，不必等待 `sk4`
- `sk4` 会根据模型能力画像选择 `safe / balanced / expressive`
- `sk6` 会根据音频路线选择 `mute_plus_tts / native_audio / hybrid`
- 具体跳步规则以 `docs/dependency-flow.md` 和各 `SKILL.md` 为准

## 目录分层

| 目录 | 用途 |
|---|---|
| `00_project-config/` | 项目基础配置、模型能力画像、待确认项、统一规范、进度总览 |
| `01_character-design/` | 角色设定、一致性规则、跨镜状态字段 |
| `02_scene-design/` | 场景设定、空间锚点与统一视觉规范 |
| `03_storyboard/` | 分镜、关键帧约束、shot 提示词 |
| `04_keyframes-assets/` | 关键帧及相关资产说明 |
| `05_final-deliverables/` | 字幕、TTS、音频路线说明、教程、最终交付物 |
| `99_temporary-workspace/` | 临时草稿、审计问题、清理建议 |

## 使用边界

- 不引入新依赖
- 不要求绑定某一个 Agent
- 不承诺所有 Agent 都能自动识别 manifest
- 不默认所有模型都支持长视频、原生台词或稳定口型
- 不把 `showcase_pack` 冒充为 `reference_pack`
- 遇到事实缺失时，正确行为是暂停并追问，不是补写默认值

## 文档入口

- 安装说明：`docs/install-guide-for-agents.md`
- 流程依赖：`docs/dependency-flow.md`
- 常见问题：`docs/faq.md`
- 示例 walkthrough：`examples/quickstart-cafe-scene/walkthrough.md`

## 版本信息

- 版本号见 `VERSION`
- 协议见 `LICENSE`
