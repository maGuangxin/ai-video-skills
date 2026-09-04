# SKILL: sk5_consistency_audit

## 1. 作用

本 Skill 用于汇总角色、场景、分镜、提示词和后续生产状态，输出统一的项目进度总览。

标准输出为：

- `00_project-config/project-production-progress.md`

必要时可补充：

- `99_temporary-workspace/audit-issues-<timestamp>.md`

## 2. 不做的事

- 不直接改写前置产物
- 不在缺少事实依据时擅自打通过
- 不把“未生产”误判成“已通过”

## 3. 前置条件

- `sk4_prompt_generator` 已完成当前轮需要审计的提示词
- 角色、场景和分镜产物可读

如果当前入口允许跳过某些步骤，则应以现有资料为准进行状态判定，而不是补写前置内容。

## 4. 必要输入

- `03_storyboard/**/video-prompt.md`
- `01_character-design/docs/character-consistency-rules.md`
- `00_project-config/unified-visual-spec.md`
- `03_storyboard/**/storyboard-script.md`
- `03_storyboard/**/keyframe-constraints.md`
- `00_project-config/project-base-config.md`
- `lib/style-presets.yaml`

## 5. 状态判定

- `✅通过`：当前产物存在且达到本步骤最低要求
- `⏳待生产`：文档或结构已就绪，但图片、视频、音频等尚未生成
- `❌缺失`：关键文件或关键字段不存在
- `⚠️待用户确认`：事实不明，不能直接判定

## 6. 核心新增要求

本 Skill 不只审静态产物，还要审：

1. 角色一致性是否稳定
2. 相邻镜头的动作、视线、空间和情绪是否连贯
3. 摄像机逻辑是否合理
4. 当前 prompt 模式是否符合模型能力画像
5. 当前音频路线是否合理
6. 是否应该回退到更稳的生产路线
7. 当前项目是否处于有效的项目级 Skill 安装态
8. 当前角色图片资产是否存在 `showcase_pack / reference_pack` 语义混淆
9. 当前命名是否符合项目语言环境策略

## 7. 缺项处理

如果审计过程中发现前置事实缺失，应：

1. 标记为 `❌缺失` 或 `⚠️待用户确认`
2. 记录到进度总览或临时问题清单
3. 不直接修改原文件

建议统一输出：

```text
⚠️当前审计已完成，但仍存在缺失项、连续性问题或模型适配问题。
请根据 project-production-progress.md 中的结果补齐后再进入下一轮审计。
```

## 8. 执行步骤

1. 枚举当前项目中可审计的角色、场景、分镜、提示词和后续产物
2. 检查当前 IDE / Agent 对应的项目级安装态是否完整，或是否已明确降级为 `manual-fallback`
3. 根据当前风格与约束规则逐项检查
4. 审核角色一致性、镜头连续性、音频路线和 provider 适配
5. 审核角色图片资产的真实用途是否被正确标记
6. 审核当前目录名、文件名和产物名是否符合命名语言策略
7. 给每个检查项标记状态
8. 汇总结果到 `project-production-progress.md`
9. 输出下一步行动建议

## 9. 跳步规则

- 本 Skill 可在已有提示词或已有部分产物的项目中单独执行
- 但其职责是审计和标记，不是补写前置步骤

## 10. 成功判定

满足以下条件时，判定为成功：

1. `project-production-progress.md` 已生成
2. 所有已发现问题都归类到四档状态之一
3. 已包含模型适配与连续性检查结果
4. 输出中包含下一步建议
5. 已包含安装态、命名语言和参考资产语义检查结果

建议成功输出：

```text
✅一致性审计已完成，请根据 project-production-progress.md 中的状态继续补齐、回退或推进生产。
```

## 11. 失败判定

出现下列情况时，判定为失败或暂停：

1. 关键输入文件不可读
2. 状态结果无法落盘
3. 缺失项被错误判定为通过
4. 审计过程中直接改写了前置产物
5. 明显的模型适配问题未被识别
6. 明显的 `showcase_pack / reference_pack` 混淆未被识别
