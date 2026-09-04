# SKILL: sk0b_missing_field_guide

## 1. 作用

本 Skill 是全局 pre-hook，用于在执行 `sk1` 到 `sk6` 之前检查关键输入是否缺失。

如果缺项存在，本 Skill 的职责不是继续执行，而是暂停并明确指出缺失内容。

## 2. 不做的事

- 不补写默认值
- 不替用户猜测事实
- 不在关键字段缺失时强行放行后续 Skill

## 3. 前置条件

- `sk0_project_init_guided` 已经生成 `00_project-config/project-base-config.md`
- 当前目标 Skill 已知

如果目标 Skill 未知，或 `project-base-config.md` 不存在，应立即暂停。

## 4. 必要输入

- `00_project-config/project-base-config.md`
- 当前目标 Skill 对应的 Schema 或约束文件
- `prompts.md`

## 5. 缺项判定

以下情况统一视为未完成：

- 字段缺失
- 字段值为空字符串
- 字段值为 `null`
- 字段值为 `⚠️待用户确认`
- 字段虽存在但含义不明确

## 6. 执行步骤

1. 确认当前目标 Skill
2. 读取对应 Schema 或该 Skill 的输入要求
3. 对照 `project-base-config.md` 检查关键字段
4. 缺项时更新 `00_project-config/pending-confirmations.md`
5. 如有必要，生成本轮缺项清单到 `99_temporary-workspace/`
6. 返回“允许启动”或“暂停启动”的明确结论

## 7. 固定输出话术

### 校验通过

```text
✅缺项校验通过，可以启动当前目标 Skill。
```

### 校验未通过

```text
⚠️当前步骤已暂停：仍有关键缺项未确认。
请先补齐 pending-confirmations.md 中的内容，再继续执行当前目标 Skill。
```

## 8. 跳步规则

- 本 Skill 本身不作为内容产出步骤跳过
- 进入 `sk1` 到 `sk6` 前，都应先执行本 Skill

## 9. 成功判定

满足以下条件时，判定为成功：

1. 已明确给出当前目标 Skill 是否允许启动
2. 新发现的缺项已写入 `pending-confirmations.md`
3. 没有在关键缺项存在时继续执行后续步骤

## 10. 失败判定

出现下列情况时，判定为失败或暂停：

1. `project-base-config.md` 不存在
2. 目标 Skill 未知
3. 发现缺项但未写入记录文件
4. 缺项未确认却错误放行
