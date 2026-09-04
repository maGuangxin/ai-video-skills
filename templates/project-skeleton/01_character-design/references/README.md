# 01_character-design / references / README

> 本目录用于存放角色相关图片资产。所有图片必须标注真实用途，禁止把展示图误当成模型约束参考图。

## 目录约定

| 子目录 | 用途 | 允许直接用于关键帧/视频生成 |
|---|---|---|
| `showcase-pack/` | 角色展示、风格审阅、沟通确认 | 否 |
| `reference-pack/` | 经验证可用于人物一致性约束的参考图 | 是 |
| `pending-verification/` | 待验证的候选参考图 | 否 |

## 使用规则

1. `showcase-pack/` 仅用于角色展示和风格对齐，不得默认作为关键帧或视频生成输入。
2. `reference-pack/` 只能放入真实用户素材或经 provider 能力验证通过的图片。
3. `pending-verification/` 中的图片在验证前不得升级为 `reference-pack/`。
4. 若 provider 的 `identityConsistency` 或 `multiReferenceFusion` 为 `unsupported / unverified`，不得创建可宣称稳定约束人物的 `reference-pack/`。

## 命名规则

1. 项目业务图片名应跟随项目语言环境。
2. Skill 内部 ID、schema 字段、类型名保持英文。
3. 不允许在同一批业务图片名中无规则中英混用。
