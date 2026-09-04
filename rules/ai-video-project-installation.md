# AI Video Project Installation Rules

## 1. 项目根目录安装态

当用户明确要求“当前项目在 IDE 内直接使用 Skill”时，必须检查：

1. `<project-root>/.trae/` 是否存在
2. `<project-root>/.trae/whoIam.md` 是否存在
3. `<project-root>/.trae/skills/` 是否存在
4. `<project-root>/.trae/rules/` 是否存在

未完成上述检查前，不得宣称 Skill 已在项目内生效。

## 2. 角色图片资产语义

角色图片资产必须明确区分为：

- `showcase_pack`
- `reference_pack`
- `pending_verification`

其中：

1. `showcase_pack` 仅用于展示与沟通，不得默认作为关键帧或视频生成输入
2. `reference_pack` 必须同时满足素材来源充分、provider 能力验证通过
3. `pending_verification` 在验证前不得升级为 `reference_pack`

## 3. provider 能力门禁

若 `identityConsistency` 或 `multiReferenceFusion` 为 `unsupported / unverified`：

1. 不得把生成图片宣称为可稳定约束人物的 `reference_pack`
2. 不得继续宣称后续关键帧和分镜视频已具备强人物约束

## 4. 命名语言分层

1. 业务目录路径语言跟随 `businessPathLanguage`
2. 业务文件名跟随 `artifactFileLanguage`
3. Skill ID、schema 字段、类型名、API 名固定使用英文
