# SKILL: sk1_character_design

## 1. 作用

本 Skill 用于输出角色设定文档和角色一致性规则，为后续分镜、提示词和关键帧提供角色真相源。

标准输出包括：

1. `01_character-design/docs/char-<char-id>-full-design.md`
2. `01_character-design/docs/character-consistency-rules.md`
3. `01_character-design/references/README.md` 中的参考资产状态说明（如目录已存在则按其语义输出）

## 2. 不做的事

- 不直接生成图片
- 不改写用户已经确认的角色核心事实
- 不在关键角色信息缺失时自行补写发色、体型、装备等内容
- 不把 `showcase_pack` 冒充为可用于关键帧/视频约束的 `reference_pack`

## 3. 前置条件

- `sk0_project_init_guided` 已完成
- `sk0b_missing_field_guide` 已确认角色相关字段足以启动

如果入口是“分镜现成”或“提示词现成”，只有在需要补角色真相源时才执行本 Skill。

## 4. 必要输入

- `00_project-config/project-base-config.md`
- `prompts.md`
- `outputs-template.md`
- `lib/style-presets.yaml`

如果 `characterRoster` 缺失或角色 ID 不明确，应暂停。

## 5. 缺项处理

当出现以下情况时，应退回 `sk0b_missing_field_guide`：

- 角色数量不明确
- 角色 ID 不明确
- 关键外观锚点缺失
- 用户提供的现有角色资料仍存在核心事实空缺

建议统一输出：

```text
⚠️当前步骤已暂停：角色相关关键信息不足，暂不能生成角色真相源。
请先补齐角色清单和核心锚点，再继续执行 sk1_character_design。
```

## 6. 核心新增要求

本 Skill 不只输出人物档案，还要输出视频控制字段。

至少应区分：

1. `hard_invariants`：绝不应漂移的角色事实
2. `soft_variants`：允许轻微变化的视觉细节
3. `story_driven_variants`：只允许按剧情变化的状态
4. `reference_asset_plan`：用于记录多角度参考与镜头绑定计划
5. `continuity_state_fields`：用于跨镜头追踪角色状态

此外必须把角色相关图片资产分成两类：

6. `showcase_pack`：用于角色展示、审阅和风格对齐，不得默认作为模型约束输入
7. `reference_pack`：仅当素材来源和 provider 能力都满足条件时，才允许作为关键帧和视频生成参考输入

## 6.1 reference 资产门禁

当且仅当以下条件同时满足时，才允许把图片资产标记为 `reference_pack`：

1. 来源属于真实用户素材，或经 provider 能力验证可稳定跟随原始素材
2. provider 的 `identity consistency` 状态为 `supported`
3. provider 的 `multi-reference fusion` 状态不是 `unsupported`
4. 当前角色至少具备足够的关键视角，或已明确其参考边界

若以上任一条件不满足，只能输出 `showcase_pack` 或 “待补参考图计划”，不得声称其可稳定约束人物。

建议统一暂停输出：

```text
⚠️当前步骤已暂停：现有素材或 provider 能力不足以生成可用于模型约束的 reference_pack。
当前只允许输出角色真相源与 showcase_pack，不得继续把展示图作为关键帧或视频生成参考图使用。
```

## 7. 执行步骤

1. 读取 `project-base-config.md` 中的角色清单
2. 读取 provider capability preflight 结果，确认 `showcase_pack / reference_pack` 的允许边界
3. 结合 `style-presets.yaml` 和 `outputs-template.md` 生成每个角色的完整设定
4. 为每个角色补齐不可变项、可变项、剧情变化项和参考图计划
5. 对每个参考资产明确标记其类型：`showcase_pack / reference_pack / pending`
6. 汇总角色设定，生成 `character-consistency-rules.md`
7. 确保后续 `sk4` 可以直接复用其中的角色前缀与规则，且不会误用 `showcase_pack`

## 8. 跳步规则

- 当入口为“已有分镜”或“已有提示词”且角色真相源已足够时，可跳过
- 一旦执行，则必须输出结构化角色设定和一致性规则

## 9. 成功判定

满足以下条件时，判定为成功：

1. 每个角色都有对应设定文件
2. `character-consistency-rules.md` 已生成
3. 不可变项、可变项和剧情变化项已区分清楚
4. 角色参考资产与跨镜状态字段可供 `sk3 / sk4 / sk5` 直接引用
5. 每个参考资产都已标明其真实用途，不存在 `showcase_pack / reference_pack` 混淆

建议成功输出：

```text
✅角色设定与一致性规则已生成，可以供后续分镜、提示词和连续性审计直接引用。
```

## 10. 失败判定

出现下列情况时，判定为失败或暂停：

1. 角色清单不完整
2. 关键角色事实缺失
3. 输出文件未生成
4. 生成内容与用户已确认事实冲突
5. 把展示图错误标记为 `reference_pack`
