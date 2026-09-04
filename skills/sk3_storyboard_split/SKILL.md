# SKILL: sk3_storyboard_split

## 1. 作用

本 Skill 用于生成统一结构的分镜目录、分镜脚本、关键帧约束和 shot 目录。

标准输出包括：

1. `03_storyboard/storyboard-<id>-<semantic>/storyboard-script.md`
2. `03_storyboard/storyboard-<id>-<semantic>/keyframe-constraints.md`
3. `03_storyboard/storyboard-<id>-<semantic>/shot-<id>-<semantic>/`

## 2. 不做的事

- 不生成最终提示词
- 不自行补写剧情节奏
- 不擅自切断核心爆点或完整台词

## 3. 前置条件

- 默认情况下，`sk1_character_design` 与 `sk2_scene_design` 已完成
- 若入口允许跳过前置设计，则应确认现有替代输入足够支撑分镜整理
- `sk0b_missing_field_guide` 已确认本步骤关键字段齐全

## 4. 必要输入

- `00_project-config/project-base-config.md`
- 角色与场景真相源，或可替代的现成资料
- `prompts.md`
- `outputs-template.md`

如果时间上限、角色 ID、场景 ID、关键台词或关键爆点不明确，应暂停。

## 5. 缺项处理

当出现以下情况时，应暂停并退回 `sk0b_missing_field_guide`：

- `singleShotMaxSeconds` 缺失
- 关键台词缺失
- 关键爆点缺失
- 角色或场景 ID 无法对齐
- 模型能力画像缺失，无法决定拆镜强度

建议统一输出：

```text
⚠️当前步骤已暂停：分镜拆分所需的关键输入不足。
请先补齐时间轴、角色场景标识、模型能力和关键剧情信息，再继续执行 sk3_storyboard_split。
```

## 6. 核心新增要求

本 Skill 不只拆镜，还要负责建立镜头连续性约束。

至少应处理：

1. 根据模型推荐稳定时长决定实际拆镜长度
2. 区分镜头目的：交代空间、推进动作、强化情绪、承接台词
3. 明确摄像机相对主体的位置、朝向和景别
4. 明确人物朝向、运动方向和视线目标
5. 明确切镜原因、转场类型和轴线关系
6. 为每个镜头规划锚点：首帧、尾帧、中间爆点帧、道具锚点、表情锚点

## 7. 执行步骤

1. 读取项目配置中的模型能力画像和推荐生产模式
2. 判断当前是单段入口还是多段入口
3. 按模型推荐稳定秒数、动作复杂度、台词复杂度决定拆镜长度
4. 为每个 shot 生成动作时间轴、嘴型窗口和连续性字段
5. 输出分镜脚本与关键帧约束
6. 创建对应 shot 目录，供后续步骤使用

## 8. 跳步规则

- 入口为“已有分镜”时，可跳过本 Skill
- 但如果执行本 Skill，则应把现有分镜整理为统一目录结构，而不是保留散乱状态

## 9. 成功判定

满足以下条件时，判定为成功：

1. 分镜目录结构已建立
2. `storyboard-script.md` 已生成
3. `keyframe-constraints.md` 已生成
4. shot 目录已创建
5. 每个 shot 至少包含时间轴、镜头连续性字段和锚点计划

建议成功输出：

```text
✅分镜结构、时间轴与连续性约束已生成，可以继续执行 sk4_prompt_generator 或 sk6_postproduction_bundle。
```

## 10. 失败判定

出现下列情况时，判定为失败或暂停：

1. 核心时间轴信息缺失
2. 关键台词或关键爆点无法判断
3. 输出目录未生成
4. 现有分镜无法整理为统一结构但仍继续执行
5. 缺少镜头连续性字段却进入后续 prompt 阶段
