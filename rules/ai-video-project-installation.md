# AI Video Project Installation Rules

## 1. 项目根目录安装态

当用户明确要求“当前项目在 IDE 内直接使用 Skill”时，必须检查：

1. 当前 IDE / Agent 类型是否已识别
2. 当前安装范围是否已识别：`current-ide / multi-ide / global / manual-fallback`
3. 若为 `current-ide`，检查当前 IDE 的默认安装目标
4. 若当前 IDE 为 Trae，检查：
   - `<project-root>/.trae/`
   - `<project-root>/.trae/whoIam.md`
   - `<project-root>/.trae/skills/`
   - `<project-root>/.trae/rules/`
5. 若当前 IDE 非 Trae，按该 IDE / Agent 官方文档检查其默认安装目录、配置文件和刷新方式
6. 若为 `multi-ide`，分别记录每个目标的安装目录和检查结果
7. 若为 `global`，记录全局目录来源与检查结果
8. 只有在前述方式不成立时，才允许 `manual-fallback`

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
