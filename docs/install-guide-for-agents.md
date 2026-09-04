# 安装指南

本文档只回答 5 个问题：

1. 如何把 `ai-video-skills/` 放到项目里
2. 如何根据不同 IDE / Agent 选择安装模式
3. 哪种接入方式更稳
4. 第一次应该怎么验证
5. 失败时先排查什么

## 1. 获取仓库

任选一种方式即可：

### 方式 A：Git Clone

```bash
git clone https://github.com/maGuangxin/ai-video-skills.git ai-video-skills
```

### 方式 B：Git Submodule

```bash
git submodule add https://github.com/maGuangxin/ai-video-skills.git ai-video-skills
git submodule update --init --recursive
```

### 方式 C：下载 ZIP 后解压

把解压后的目录命名为 `ai-video-skills/`，放在项目根目录。

## 2. 按 IDE / Agent 选择安装模式

如果你的目标是“让当前项目在 IDE 里直接感知 Skill”，不要先假设所有 IDE 都走 `.trae/`。正确顺序是：

1. 先识别当前 IDE / Agent 类型
2. 再判断它支持哪种安装模式
3. 最后检查对应目录或降级方案

当前仓库目前支持 3 种模式：

### 2.1 Trae：项目级 `.trae/`

如果当前 IDE 是 Trae，可使用本仓库已提供的脚本闭环。

假设目录结构是：

```text
<project-root>/
├── ai-video-skills/
└── <你的项目文件>
```

在 `<project-root>/` 下执行：

```bash
./ai-video-skills/apply-trae.sh init
./ai-video-skills/apply-trae.sh apply
./ai-video-skills/apply-trae.sh check
```

### 2.2 Windows

在项目根目录执行：

```bat
ai-video-skills\apply-trae.bat init
ai-video-skills\apply-trae.bat apply
ai-video-skills\apply-trae.bat check
```

Trae 模式下，满足下面 5 条才算“项目级安装态成立”：

1. `<project-root>/.trae/` 存在
2. `<project-root>/.trae/whoIam.md` 存在
3. `<project-root>/.trae/skills/` 存在
4. `<project-root>/.trae/rules/` 存在
5. `<project-root>/.trae/skills.manifest.yaml` 存在

### 2.2 其他 IDE / Agent：项目级目录按官方文档

如果当前 IDE / Agent 也支持项目级 Skill 目录，但目录名、配置文件名或刷新方式与 Trae 不同：

1. 不要硬套 `.trae`
2. 先按该 IDE / Agent 官方文档确认项目级目录
3. 记录对应目录、配置文件和刷新方式
4. 再检查其是否已安装完成

当前仓库**不对其他 IDE 的项目级目录做硬编码**，以避免编造不存在的目录规则。

### 2.3 不支持项目级安装：仓库旁路 + 手动读取

如果当前 IDE / Agent 不支持项目级安装：

1. 保留完整的 `ai-video-skills/` 仓库目录
2. 不宣称 IDE 已项目级感知该 Skill
3. 改为手动让 Agent 读取 `skills/*/SKILL.md`
4. 这种模式下安装态结果应记录为 `manual-fallback`

## 3. 接入方式分层

为避免把兼容性说得过满，接入方式按确定性分为 3 层：

### 2.1 已验证可行：直接读取 `SKILL.md`

适用条件：

- Agent 能读取仓库内的 Markdown 文件
- 你愿意手动指定入口文件

使用方式：

直接让 Agent 按顺序读取 `skills/<skill-id>/SKILL.md`，把这些文件当作运行手册执行。

这是本仓库默认推荐的通用方式。

### 2.2 通用 fallback：复制整个目录并手动指定入口

适用条件：

- 不确定 Agent 是否支持 manifest
- 不确定 Agent 是否有 Skill 扫描能力
- Windows 软链接可能受权限限制

使用方式：

1. 保留完整目录 `ai-video-skills/`
2. 手动告诉 Agent 从 `skills/sk0_project_init_guided/SKILL.md` 开始
3. 按依赖关系继续读取后续 `SKILL.md`

只要 Agent 能读 Markdown，这种方式通常都能工作。

### 2.3 需按官方文档调整：manifest、软链接、自动扫描

适用条件：

- 当前 Agent 明确支持 YAML manifest
- 当前 Agent 明确支持自定义 Skill 目录或软链接

注意事项：

- `skills.manifest.yaml` 是否会被自动识别，取决于具体 Agent 与版本
- 技能目录位置、配置名称、刷新时机，以对应 Agent 官方文档为准
- 如果这一步不稳定，建议回退到 2.1 或 2.2

## 4. 最小成功标准

满足下面 4 条即可认为安装基本成功：

1. 工作区中存在完整的 `ai-video-skills/`
2. 若目标是项目内安装，则当前 IDE / Agent 对应安装态检查已通过，或已明确降级为 `manual-fallback`
3. Agent 至少能稳定读取 `skills/*/SKILL.md`
4. 能跑通 `examples/quickstart-cafe-scene/walkthrough.md` 的单段 smoke test

## 5. 手动调用模板

当 Agent 不支持 manifest 或你不想依赖自动扫描时，可以直接使用下面这段调用说明：

```text
执行视频生成任务时，请把以下文件当作运行手册，按依赖关系依次读取并执行：
1. ai-video-skills/skills/sk0_project_init_guided/SKILL.md
2. ai-video-skills/skills/sk0b_missing_field_guide/SKILL.md
3. ai-video-skills/skills/sk1_character_design/SKILL.md
4. ai-video-skills/skills/sk2_scene_design/SKILL.md
5. ai-video-skills/skills/sk3_storyboard_split/SKILL.md
6. ai-video-skills/skills/sk4_prompt_generator/SKILL.md
7. ai-video-skills/skills/sk5_consistency_audit/SKILL.md
8. ai-video-skills/skills/sk6_postproduction_bundle/SKILL.md

遇到缺项时，不要补写默认值，按对应 SKILL.md 的缺项规则暂停并追问。
```

## 6. Smoke Test

第一次建议只验证单段链路，不要直接上完整项目。

### 步骤

1. 确认 `ai-video-skills/` 目录完整
2. 如果目标是 Trae 项目内安装，先执行 `init -> apply -> check`
3. 如果目标是其他 IDE 项目内安装，先按官方文档确认目录与检查方式
4. 打开 `examples/quickstart-cafe-scene/walkthrough.md`
5. 让 Agent 按其中的单段示例依次执行 `sk0` 到 `sk6`
6. 最后检查 `sk5` 是否能输出明确状态

### 看到这些结果就算通过

- `00_project-config/project-base-config.md` 已生成
- 如果目标是项目内安装，当前 IDE / Agent 对应安装态检查通过，或已明确记录 `manual-fallback`
- `03_storyboard/` 下出现分镜与 shot 目录
- `video-prompt.md`、SRT、TTS 清单、进度总览能按规则生成
- 缺项时 Agent 会暂停确认，而不是直接脑补

## 7. Windows 补充说明

- 不确定软链接是否可用时，直接复制目录
- 不确定终端命令格式时，优先手动放置目录，不依赖命令行安装
- 文件命名避免 `<>:"/\\|?*`
- 优先使用相对路径，减少绝对路径差异带来的问题

## 8. 排查顺序

如果没有成功加载，按这个顺序排查：

1. 仓库目录是否完整
2. 若目标是 Trae 项目内安装，`.trae` 是否已执行 `init / apply / check`
3. 若目标是其他 IDE 项目内安装，是否已按官方文档确认对应目录和刷新方式
4. Agent 是否至少能读取 `SKILL.md`
5. 是否误以为 manifest 一定会被自动加载
6. 是否直接跳过了 `sk0` 或 `sk0b`
7. smoke test 是否先在单段示例上跑通
