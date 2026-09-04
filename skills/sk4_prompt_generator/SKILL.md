# SKILL: sk4_prompt_generator

## 1. 作用

本 Skill 用于基于分镜、角色和场景真相源生成每段 `video-prompt.md`。

标准输出为：

- `03_storyboard/storyboard-<id>-<semantic>/shot-<id>-<semantic>/video-prompt.md`

## 2. 不做的事

- 不调用视频生成服务
- 不重写前置步骤已经确认的角色前缀
- 不自行修改分镜时间轴

## 3. 前置条件

- `sk3_storyboard_split` 已完成
- 角色与场景真相源可读
- `sk0b_missing_field_guide` 已确认当前步骤关键字段齐全

如果 `sk3` 产物不存在或前置真相源不可读，应暂停。

## 4. 必要输入

- `03_storyboard/**/storyboard-script.md`
- `01_character-design/docs/character-consistency-rules.md`
- `00_project-config/unified-visual-spec.md`
- `00_project-config/project-base-config.md`
- `lib/style-presets.yaml`
- `lib/cinematic-knowledge.yaml`
- `outputs-template.md`

## 5. 缺项处理

当出现以下情况时，应暂停：

- 角色前缀缺失
- 场景规范缺失
- 动作时间轴缺失
- 台词窗口缺失
- 分镜连续性字段缺失
- 模型能力画像缺失，无法决定 prompt 模式

建议统一输出：

```text
⚠️当前步骤已暂停：提示词生成所需的前置产物不完整。
请先补齐角色规则、场景规范、分镜时间轴和连续性字段，再继续执行 sk4_prompt_generator。
```

## 6. 核心新增要求

本 Skill 需要根据模型能力和生产模式选择不同 prompt 结构。

至少支持：

1. `safe`：短 prompt、强角色锁定、强锚点、静音优先
2. `balanced`：加入 continuity block，可尝试短句口型
3. `expressive`：加入更丰富的镜头语言和中间锚点

每个 prompt 建议至少包含：

1. `global_invariants`
2. `shot_semantic_block`
3. `continuity_block`
4. `motion_and_dialogue_block`
5. `forbidden_drift_block`

## 7. 执行步骤

1. 读取项目配置中的模型能力画像与推荐生产模式
2. 读取分镜时间轴与 shot 连续性字段
3. 从角色真相源中直接引用角色前缀
4. 从场景真相源中引用场景与镜头依据
5. 按 `safe / balanced / expressive` 之一生成 `video-prompt.md`
6. 确保提示词与前置分镜、角色、场景和音频路线保持一致

## 8. 跳步规则

- 当入口为“已有提示词”时，可跳过本 Skill
- 一旦执行，不应再使用临时猜测内容替代前置真相源

## 9. 成功判定

满足以下条件时，判定为成功：

1. 每个目标 shot 目录下都生成了 `video-prompt.md`
2. 角色前缀来自真相源，而不是临时改写版本
3. 动作、台词、时间轴与 `sk3` 保持一致
4. prompt 模式与模型能力画像一致
5. 提示词中已包含连续性约束和漂移限制

建议成功输出：

```text
✅提示词已生成，可以继续执行 sk5_consistency_audit，或并行处理 sk6_postproduction_bundle。
```

## 10. 失败判定

出现下列情况时，判定为失败或暂停：

1. 关键前置文件缺失
2. 提示词内容与时间轴不一致
3. 角色前缀被擅自改写
4. 输出文件未生成
5. prompt 模式与模型能力不匹配
