# sk5-consistency-audit：一致性审计

## 1. 作用

汇总角色、场景、分镜、提示词和生产状态，输出统一进度总览：

- `00_project-config/project-production-progress.md`
- 必要时补充 `99_temporary-workspace/audit-issues-<timestamp>.md`

## 2. 不做的事

不直接改写前置产物；不在缺少事实依据时打通过；不把"未生产"误判成"已通过"。

## 3. 前置条件

sk4 已完成当前轮需要审计的提示词；角色、场景和分镜产物可读。入口允许跳过时，以现有资料做状态判定，不补写前置内容。

## 4. 必要输入

`03_storyboard/**/video-prompt.md`、`01_character-design/docs/character-consistency-rules.md`、`00_project-config/unified-visual-spec.md`、`03_storyboard/**/storyboard-script.md`、`03_storyboard/**/keyframe-constraints.md`、`00_project-config/project-base-config.md`、`lib/style-presets.yaml`。

## 5. 状态判定

- `✅通过`：产物存在且达到本步骤最低要求
- `⏳待生产`：文档/结构就绪，图片视频音频尚未生成
- `❌缺失`：关键文件或字段不存在
- `⚠️待用户确认`：事实不明，不能直接判定

## 6. 审计范围

1. 角色一致性是否稳定
2. 相邻镜头的动作、视线、空间和情绪是否连贯
3. 摄像机逻辑是否合理
4. prompt 模式是否符合模型能力画像
5. 音频路线是否合理，是否应回退到更稳路线
6. 角色图片资产是否存在 showcase_pack/reference_pack 语义混淆
7. 当前命名是否符合项目语言环境策略（可用 `scripts/validate-naming.py` 辅助，脚本不可用时人工比对）

## 7. 缺项处理

发现前置事实缺失时：标记 ❌缺失 或 ⚠️待用户确认，记录到进度总览或临时问题清单，不修改原文件。统一输出：

```text
⚠️当前审计已完成，但仍存在缺失项、连续性问题或模型适配问题。
请根据 project-production-progress.md 中的结果补齐后再进入下一轮审计。
```

## 8. 执行步骤

1. 枚举可审计的角色、场景、分镜、提示词和后续产物
2. 按风格与约束规则逐项检查
3. 审计角色一致性、镜头连续性、音频路线和 provider 适配
4. 审计图片资产真实用途标记与命名语言策略
5. 给每个检查项标记状态
6. 汇总到 project-production-progress.md 并输出下一步建议

## 9. 跳步规则

可在已有提示词或部分产物的项目中单独执行；职责是审计和标记，不是补写前置步骤。

## 10. 成功判定

project-production-progress.md 已生成；所有问题归入四档状态；含模型适配与连续性检查；含下一步建议。

## 11. 失败判定

关键输入不可读 / 状态无法落盘 / 缺失项被判为通过 / 审计中改写前置产物 / 明显适配问题或资产混淆未被识别。
