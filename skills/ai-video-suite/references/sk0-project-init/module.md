# sk0-project-init：项目初始化与模型能力画像

## 1. 作用

建立项目基础配置，是整个流程的起点。执行结果包括：

1. `00_project-config/project-base-config.md`
2. `00_project-config/pending-confirmations.md`
3. 项目目录骨架（`templates/project-skeleton/` 应用到项目根目录）
4. 模型能力画像与推荐生产路线
5. provider capability preflight 结论

## 2. 不做的事

- 不写角色、场景、分镜、提示词
- 不在关键事实缺失时补写默认值
- 不执行任何安装或环境变更（安装由仓库根目录 `install.mjs` 在 Skill 外完成）

## 3. 前置条件

- 无前置模块
- 项目根目录可写；不可写时立即暂停
- 产物位置默认用相对路径描述

## 4. 必要输入

用户自然语言输入、本目录 `prompts.md`、`schemas/project-config.schema.json`、本目录 `outputs-template.md`。
参考文件缺失或不可读时暂停。

## 5. 访谈结构（19 问，4 组）

按 `prompts.md` 逐项提问，一次只问一项：

- **A 组·项目基本信息**（Q1–Q9）：入口类型、总时长（附完播率参考提示）、发布平台、视频模型、单段时长、音频路线、口型能力、画面比例、美术风格
- **B 组·内容资产**（Q10–Q13）：角色清单、场景清单、核心爆点、镜头复杂度偏好
- **C 组·模型与 provider 能力**（Q14–Q17）：provider 凭据状态、参考图能力、身份一致性、多参考图融合
- **D 组·项目环境**（Q18–Q19）：项目落盘位置、命名语言策略

**smoke test 快速模式**：入口为单段片段时，只问 A 组的 Q1/Q2/Q4/Q5/Q6 + C 组 + D 组的命名策略；发布平台按"抖音"竖屏默认值填充并标注"来自预设，未经用户确认"。

**预设兜底**：用户答"不确定 / 按保守值"时，从 `lib/model-capability-presets.yaml` 取对应平台档位；无匹配平台时取 `unknown-conservative` 档。预设值必须在交付时告知用户，并保留修改入口。

## 6. 模型能力画像

至少收集：模型名称与厂商、单段硬上限秒数、单段推荐稳定秒数、原生音频 / 台词支持、口型能力等级、人物一致性等级、多镜连续性等级、参考图 / 首尾帧 / 中间锚点 / 局部修复支持、推荐生产模式（safe/balanced/expressive）、推荐音频路线（mute_plus_tts/native_audio/hybrid）、showcase_pack 与 reference_pack 支持状态、身份一致性与多参考融合能力状态（supported/unsupported/unverified）。

## 7. provider capability preflight

进入图片 / 视频生成阶段前必须建立，至少包含：凭据状态（available/missing/unverified，只记录状态不记录值）、textToImage、imageToImage、imageConditionedVideo、identityConsistency、multiReferenceFusion——每项标记 supported/unsupported/unverified。

凭据的配置方法、验证与撤销步骤见 `references/provider-setup-guide.md`。可用 `scripts/check_environment.py` 做只读检查（脚本不可用时按用户口述记录状态并标注"未验证"）。

若 identityConsistency 或 multiReferenceFusion 为 unsupported/unverified，不得把生成图片宣称为可稳定约束人物的 reference_pack。

## 8. 缺项处理

用户未回答、含义不明确、多解时：写入 pending-confirmations.md，标记 `⚠️待用户确认`，不补默认值充数。统一输出：

```text
⚠️当前步骤已暂停：项目基础配置仍有待确认项。
请先补充或确认缺失信息，再继续执行后续模块。
```

## 9. 执行步骤

1. 如用户提供了文本文件 / 图片 / 图文 / URL 等素材，先按 `references/input-ingestion.md` 归一化落盘并登记 input-manifest.md；图片反推与抓取内容作为待确认素材，访谈时逐项向用户确认
2. 应用 `templates/project-skeleton/` 目录骨架到项目根目录——把骨架**内部的** `00_project-config/`、`01_character-design/` 等子目录复制到项目根目录下；**不要把 `project-skeleton` 目录本身嵌套进项目根**（如项目根出现 `project-skeleton/` 即为操作错误，须将其内容上移一层）
3. 按第 5 节分组访谈（或 smoke test 快速模式）；已有素材能回答的问题先复述请用户确认，不重复提问
4. 确认过的内容写入 project-base-config.md；未确认项写入 pending-confirmations.md
5. 对照 `schemas/project-config.schema.json` 的 required 字段判断是否达到继续条件
6. 建立 provider capability preflight 结论
7. 结合模型能力画像给出推荐生产路线与约束强度

## 10. 跳步规则

本模块不能跳过。无论从哪个入口进入，后续步骤都以本模块产物为基础。

## 11. 成功判定

1. project-base-config.md 已生成，关键字段有值或标记待确认
2. 模型能力画像已建立（含预设来源标注）
3. 推荐生产模式与音频路线已给出
4. 目录骨架已应用
5. provider capability preflight 已完成

```text
✅项目基础配置与模型能力画像已建立。
请根据待确认项情况决定是否先执行 sk0b-missing-field-guide。
```

## 12. 失败判定

骨架未应用 / 配置未生成 / 关键字段缺失仍继续 / 画像缺失 / 参考文件不可读 / 需要进入图片视频阶段但 preflight 缺失。
