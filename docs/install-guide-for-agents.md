# 安装指南

本文档只回答 4 个问题：

1. 如何把 `ai-video-skills/` 放到项目里
2. 哪种接入方式更稳
3. 第一次应该怎么验证
4. 失败时先排查什么

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

## 2. 接入方式分层

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

## 3. 最小成功标准

满足下面 3 条即可认为安装基本成功：

1. 工作区中存在完整的 `ai-video-skills/`
2. Agent 至少能稳定读取 `skills/*/SKILL.md`
3. 能跑通 `examples/quickstart-cafe-scene/walkthrough.md` 的单段 smoke test

## 4. 手动调用模板

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

## 5. Smoke Test

第一次建议只验证单段链路，不要直接上完整项目。

### 步骤

1. 确认 `ai-video-skills/` 目录完整
2. 打开 `examples/quickstart-cafe-scene/walkthrough.md`
3. 让 Agent 按其中的单段示例依次执行 `sk0` 到 `sk6`
4. 最后检查 `sk5` 是否能输出明确状态

### 看到这些结果就算通过

- `00_project-config/project-base-config.md` 已生成
- `03_storyboard/` 下出现分镜与 shot 目录
- `video-prompt.md`、SRT、TTS 清单、进度总览能按规则生成
- 缺项时 Agent 会暂停确认，而不是直接脑补

## 6. Windows 补充说明

- 不确定软链接是否可用时，直接复制目录
- 不确定终端命令格式时，优先手动放置目录，不依赖命令行安装
- 文件命名避免 `<>:"/\\|?*`
- 优先使用相对路径，减少绝对路径差异带来的问题

## 7. 排查顺序

如果没有成功加载，按这个顺序排查：

1. 仓库目录是否完整
2. Agent 是否至少能读取 `SKILL.md`
3. 是否误以为 manifest 一定会被自动加载
4. 是否直接跳过了 `sk0` 或 `sk0b`
5. smoke test 是否先在单段示例上跑通
