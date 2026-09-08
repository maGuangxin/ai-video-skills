# sk2-scene-design：场景设定与统一视觉规范

## 1. 作用

输出场景设定文档和统一视觉规范，为分镜、提示词和关键帧提供场景真相源。标准输出：

1. `02_scene-design/docs/scene-<scene-id>-full-design.md`
2. `00_project-config/unified-visual-spec.md`

## 2. 不做的事

不直接生成图片；不覆盖用户已确认的场景事实；不在关键信息缺失时补写默认场景、光照或家具。

## 3. 前置条件

sk0 已完成；sk0b 已确认场景字段足以启动。入口为"分镜现成/提示词现成"时，只在需要补场景真相源时执行。

## 4. 必要输入

`00_project-config/project-base-config.md`、本目录 `prompts.md`、本目录 `outputs-template.md`、`lib/style-presets.yaml`、`lib/cinematic-knowledge.yaml`。
sceneRoster 缺失或场景 ID、时段、空间结构不明确时暂停。

## 5. 缺项处理

场景 ID / 时段 / 空间结构不明确、核心家具或参照物缺失、主要空间关系无法描述时，退回 sk0b。统一输出：

```text
⚠️当前步骤已暂停：场景相关关键信息不足，暂不能生成场景真相源。
请先补齐场景清单、空间结构和关键参照物，再继续执行 sk2-scene-design。
```

### 5.1 图片反推设定

用户提供了场景参考图时：按 `references/input-ingestion.md` §5.2 反推空间结构、时段、光照与关键参照物，生成标记 `⚠️来自图片反推` 的场景草稿；只描述可见内容，经用户确认后才进入场景真相源。

## 6. 空间控制字段

每个场景至少区分：

1. `hard_scene_anchors`：跨镜头不应漂移的空间锚点
2. `soft_scene_variants`：允许轻微变化的环境细节
3. `story_driven_scene_changes`：只允许按剧情推进变化的场景状态
4. `camera_reference_zones`：供 sk3/sk4 引用的机位参考区域
5. `continuity_space_fields`：跨镜头追踪空间状态

## 7. 执行步骤

1. 读取场景清单、风格信息和模型能力画像
2. 结合本目录 `outputs-template.md` 为每个场景生成结构化设定
3. 补齐空间锚点、可变项、剧情变化项和机位参考区
4. 汇总生成 unified-visual-spec.md
5. 在适用风格下补充家具尺度、光照、空间关系和镜头引用依据

## 8. 跳步规则

入口为"已有分镜/已有提示词"且场景真相源已足够时可跳过；一旦执行必须输出结构化设定和统一视觉规范。

## 9. 成功判定

每个场景有设定文件；unified-visual-spec.md 已生成；每场景含空间锚点、机位参考区和跨镜状态字段；sk3/sk4 可直接引用。

## 10. 失败判定

场景清单不完整 / 关键事实缺失 / 输出未生成 / 与用户确认事实冲突 / 缺空间锚点却进入后续连续性设计。
