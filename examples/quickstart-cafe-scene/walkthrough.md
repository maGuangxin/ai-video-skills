# Quickstart Walkthrough

这个示例只用于 smoke test，不追求展示全部能力。

目标是用一条最短链路验证：

1. Agent 能读取 `SKILL.md`
2. 依赖顺序能跑通
3. 缺项时会暂停而不是脑补

## 场景设定

- 角色：2 人
- 场景：1 个咖啡馆
- 剧情：单段 10 秒
- 入口：`single_scene_clip_ready`

## 建议执行顺序

1. `sk0_project_init_guided`
2. `sk0b_missing_field_guide`
3. `sk1_character_design`
4. `sk2_scene_design`
5. `sk3_storyboard_split`
6. `sk4_prompt_generator`
7. `sk6_postproduction_bundle`
8. `sk5_consistency_audit`

## 最小输入示例

### 项目基础信息

- 项目名：初次见面咖啡馆
- 时长：10 秒
- 画幅：9:16
- 风格：写实
- 有台词：有
- 角色数量：2
- 场景数量：1

### 单段剧情

男生把咖啡推给女生，微笑示意；女生脸红低头，小声说“谢谢”。

## 每一步只看什么结果

### `sk0_project_init_guided`

应该看到：

- `00_project-config/project-base-config.md`
- `00_project-config/pending-confirmations.md`

### `sk0b_missing_field_guide`

应该看到：

- 缺项被明确指出
- 缺项不足时会暂停，而不是继续往后生成

### `sk1_character_design`

应该看到：

- 角色设定文档
- `character-consistency-rules.md`

### `sk2_scene_design`

应该看到：

- 场景设定文档
- `unified-visual-spec.md`

### `sk3_storyboard_split`

应该看到：

- 分镜目录
- `storyboard-script.md`
- `keyframe-constraints.md`
- shot 子目录

### `sk4_prompt_generator`

应该看到：

- `video-prompt.md`

### `sk6_postproduction_bundle`

应该看到：

- 分段 SRT
- 全片统一 SRT
- TTS 清单
- 剪映操作手册

### `sk5_consistency_audit`

应该看到：

- `project-production-progress.md`
- 明确的状态结果，而不是笼统总结

## Smoke Test 成功标准

满足下面 4 条即可认为首次验证通过：

1. 8 个步骤都能被正确读取
2. 每一步都生成了对应的最小输出
3. 缺项时会暂停并提示确认
4. 最终能得到 `project-production-progress.md`

## 如果失败，先查什么

1. `docs/install-guide-for-agents.md`
2. `docs/dependency-flow.md`
3. 对应步骤的 `SKILL.md`
