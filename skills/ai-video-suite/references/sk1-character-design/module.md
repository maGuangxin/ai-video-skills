# sk1-character-design：角色设定与一致性规则

## 1. 作用

输出角色设定文档和角色一致性规则，为分镜、提示词和关键帧提供角色真相源。标准输出：

1. `01_character-design/docs/char-<char-id>-full-design.md`
2. `01_character-design/docs/character-consistency-rules.md`
3. 参考资产状态说明（写入 `01_character-design/references/README.md` 语义）

## 2. 不做的事

- 不直接生成图片
- 不改写用户已确认的角色核心事实
- 不在关键信息缺失时自行补写发色、体型、装备
- 不把 showcase_pack 冒充为可用于关键帧/视频约束的 reference_pack

## 3. 前置条件

sk0 已完成；sk0b 已确认角色字段足以启动。入口为"分镜现成/提示词现成"时，只在需要补角色真相源时执行。

## 4. 必要输入

`00_project-config/project-base-config.md`、本目录 `prompts.md`、本目录 `outputs-template.md`、`lib/style-presets.yaml`。
characterRoster 缺失或角色 ID 不明确时暂停。

## 5. 缺项处理

角色数量/ID 不明确、关键外观锚点缺失、现有资料存在核心空缺时，退回 sk0b。统一输出：

```text
⚠️当前步骤已暂停：角色相关关键信息不足，暂不能生成角色真相源。
请先补齐角色清单和核心锚点，再继续执行 sk1-character-design。
```

### 5.1 图片反推设定

用户提供了角色图片时：

1. 按 `references/input-ingestion.md` §5.2 反推外观锚点，生成标记 `⚠️来自图片反推` 的角色草稿
2. 只描述图中可见内容，不虚构细节；用户口头补充与图片冲突时以用户说明为准并记录冲突
3. 反推草稿经用户确认后才成为角色真相源；图片本身的资产语义仍按第 7 节门禁判定

## 6. 角色控制字段

每个角色至少区分：
1. `hard_invariants`：绝不应漂移的角色事实
2. `soft_variants`：允许轻微变化的视觉细节
3. `story_driven_variants`：只允许按剧情变化的状态
4. `reference_asset_plan`：多角度参考与镜头绑定计划
5. `continuity_state_fields`：跨镜头追踪角色状态

## 7. reference 资产门禁

同时满足以下条件才允许标记为 reference_pack：

1. 来源为真实用户素材，或经 provider 能力验证可稳定跟随原始素材
2. provider 的 identityConsistency 为 supported
3. provider 的 multiReferenceFusion 不为 unsupported
4. 该角色具备足够关键视角，或已明确参考边界

任一不满足时只输出 showcase_pack 或"待补参考图计划"：

```text
⚠️当前步骤已暂停：现有素材或 provider 能力不足以生成可用于模型约束的 reference_pack。
当前只允许输出角色真相源与 showcase_pack，不得继续把展示图作为关键帧或视频生成参考图使用。
```

## 8. 执行步骤

1. 读取配置中的角色清单
2. 读取 provider capability preflight 结果，确认资产允许边界
3. 结合 `lib/style-presets.yaml` 与本目录 `outputs-template.md` 生成每个角色完整设定
4. 补齐不变项、可变项、剧情变化项和参考图计划
5. 每个参考资产标记：showcase_pack / reference_pack / pending_verification
6. 汇总生成 character-consistency-rules.md
7. 确保 sk4 可直接复用角色前缀且不会误用 showcase_pack

## 9. 跳步规则

入口为"已有分镜/已有提示词"且角色真相源已足够时可跳过；一旦执行必须输出结构化设定和一致性规则。

## 10. 成功判定

每个角色有设定文件；一致性规则已生成；三层控制字段区分清楚；参考资产可供 sk3/sk4/sk5 直接引用且无 showcase/reference 混淆。

## 11. 失败判定

角色清单不完整 / 关键事实缺失 / 输出未生成 / 与用户确认事实冲突 / 展示图被错标为 reference_pack。
