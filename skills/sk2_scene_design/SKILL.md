# SKILL: sk2_scene_design

## 1. 作用

本 Skill 用于输出场景设定文档和统一视觉规范，为后续分镜、提示词和关键帧提供场景真相源。

标准输出包括：

1. `02_scene-design/docs/scene-<scene-id>-full-design.md`
2. `00_project-config/unified-visual-spec.md`

## 2. 不做的事

- 不直接生成图片
- 不覆盖用户已经确认的场景事实
- 不在关键场景信息缺失时自行补写默认场景、默认光照或默认家具

## 3. 前置条件

- `sk0_project_init_guided` 已完成
- `sk0b_missing_field_guide` 已确认场景相关字段足以启动

如果入口是“分镜现成”或“提示词现成”，只有在需要补场景真相源时才执行本 Skill。

## 4. 必要输入

- `00_project-config/project-base-config.md`
- `prompts.md`
- `outputs-template.md`
- `lib/style-presets.yaml`
- `lib/cinematic-knowledge.yaml`

如果 `sceneRoster` 缺失或场景 ID、时段、空间结构不明确，应暂停。

## 5. 缺项处理

当出现以下情况时，应退回 `sk0b_missing_field_guide`：

- 场景 ID 不明确
- 时段不明确
- 空间结构不明确
- 核心家具或关键参照物缺失
- 场景中的主要空间关系无法描述

建议统一输出：

```text
⚠️当前步骤已暂停：场景相关关键信息不足，暂不能生成场景真相源。
请先补齐场景清单、空间结构和关键参照物，再继续执行 sk2_scene_design。
```

## 6. 核心新增要求

本 Skill 不只输出静态场景设定，还要输出跨镜头可复用的空间控制字段。

至少应区分：

1. `hard_scene_anchors`：跨镜头不应漂移的空间锚点
2. `soft_scene_variants`：允许轻微变化的环境细节
3. `story_driven_scene_changes`：只允许按剧情推进变化的场景状态
4. `camera_reference_zones`：可供 `sk3 / sk4` 引用的机位参考区域
5. `continuity_space_fields`：用于跨镜头追踪空间状态

## 7. 执行步骤

1. 读取 `project-base-config.md` 中的场景清单、风格信息和模型能力画像
2. 结合 `outputs-template.md` 为每个场景生成结构化设定文档
3. 为每个场景补齐空间锚点、可变项、剧情变化项和机位参考区
4. 汇总生成 `unified-visual-spec.md`
5. 在适用风格下补充家具尺度、光照、空间关系和镜头引用依据

## 8. 跳步规则

- 当入口为“已有分镜”或“已有提示词”且场景真相源已足够时，可跳过
- 一旦执行，则必须输出结构化场景设定和统一视觉规范

## 9. 成功判定

满足以下条件时，判定为成功：

1. 每个场景都有对应设定文件
2. `unified-visual-spec.md` 已生成
3. 每个场景都包含空间锚点、机位参考区和跨镜状态字段
4. 后续 `sk3` 和 `sk4` 可直接引用这些结果

建议成功输出：

```text
✅场景设定、空间锚点与统一视觉规范已生成，可以供后续分镜和提示词步骤直接引用。
```

## 10. 失败判定

出现下列情况时，判定为失败或暂停：

1. 场景清单不完整
2. 关键场景事实缺失
3. 输出文件未生成
4. 生成内容与用户已确认事实冲突
5. 缺少空间锚点却进入后续连续性设计步骤
