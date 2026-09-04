# SKILL: sk0_project_init_guided

## 1. 作用

本 Skill 用于建立项目基础配置，是整个流程的起点。

执行结果应包括：

1. `00_project-config/project-base-config.md`
2. `00_project-config/pending-confirmations.md`
3. 项目目录骨架应用到项目根目录
4. 模型能力画像与推荐生产路线
5. 项目级 Skill 安装态检查结果（`.trae`）

## 2. 不做的事

- 不写角色设定
- 不写场景设定
- 不写分镜
- 不写提示词
- 不在关键事实缺失时补写默认值

## 3. 前置条件

- 无前置 Skill
- 项目根目录可写
- 默认使用相对路径描述产物位置
- 如果用户目标是“在当前项目 IDE 中直接使用 Skill”，则项目根目录必须允许创建或更新 `.trae/`

如果项目根目录不可写，应立即暂停。

## 4. 必要输入

- 用户提供的自然语言输入
- `prompts.md`
- `schemas/project-config.schema.json`
- `outputs-template.md`

如果这些参考文件缺失或不可读，应暂停。

## 5. 缺项处理

出现下列情况时，统一视为未完成：

- 用户未回答
- 用户回答含义不明确
- 同一个字段存在多个合理解释

处理规则：

1. 写入 `00_project-config/pending-confirmations.md`
2. 标记为 `⚠️待用户确认`
3. 不得补写默认值充数

建议统一输出：

```text
⚠️当前步骤已暂停：项目基础配置仍有待确认项。
请先补充或确认缺失信息，再继续执行后续 Skill。
```

## 6. 核心新增要求

除基础项目配置外，本 Skill 还需要建立模型能力画像，用于决定后续步骤的执行强度和路由。

至少应收集：

1. 模型名称与厂商
2. 单段硬上限秒数
3. 单段推荐稳定秒数
4. 是否支持原生音频
5. 是否支持原生台词
6. 口型能力等级
7. 人物一致性能力等级
8. 多镜连续性能力等级
9. 是否支持参考图
10. 是否支持首尾帧
11. 是否支持中间锚点
12. 是否支持局部修复
13. 推荐生产模式：`safe / balanced / expressive`
14. 推荐音频路线：`mute_plus_tts / native_audio / hybrid`
15. provider 是否支持 `showcase_pack`
16. provider 是否支持 `reference_pack`
17. provider 的身份一致性能力状态：`supported / unsupported / unverified`
18. provider 的多参考图融合能力状态：`supported / unsupported / unverified`

## 6.1 项目安装态新增要求

如果当前任务是“在项目内应用 Skill”，则不能只应用业务目录骨架，还必须检查项目级安装态：

1. `<project-root>/.trae/` 是否存在
2. `<project-root>/.trae/whoIam.md` 是否存在
3. `<project-root>/.trae/skills` 是否存在
4. `<project-root>/.trae/rules` 是否存在
5. 是否已执行过 `sync / apply / check`，或已明确记录未执行原因

若上述条件不成立，不得宣称“Skill 已安装到当前项目并可被 IDE 直接感知”。

## 6.2 provider capability preflight

在进入角色参考图、关键帧图或视频生成前，必须先建立 provider 能力预检结论，至少包含：

1. 是否有可用凭据（token / key）
2. 是否支持 text-to-image
3. 是否支持 image-to-image
4. 是否支持 image-conditioned-video
5. 是否支持 identity consistency
6. 是否支持 multi-reference fusion
7. 每个能力的状态必须标记为：`supported / unsupported / unverified`

若 `identity consistency` 或 `multi-reference fusion` 为 `unsupported / unverified`，不得把生成图片宣称为可稳定约束人物的 `reference_pack`。

## 7. 执行步骤

1. 从 `templates/project-skeleton/` 应用目录骨架到项目根目录
2. 如果用户目标包含 IDE 项目内使用，检查 `.trae` 安装态并记录缺失项
3. 按 `prompts.md` 中的顺序逐项提问，不要一次抛出全部问题
4. 将用户确认过的内容结构化写入 `project-base-config.md`
5. 将未确认或不明确的项写入 `pending-confirmations.md`
6. 对照 `schemas/project-config.schema.json` 的 required 字段，判断是否达到继续条件
7. 建立 provider capability preflight 结论
8. 结合模型能力画像，给出推荐的生产路线与约束强度

## 8. 跳步规则

- 本 Skill 不能跳过
- 无论用户从哪个入口进入，后续步骤都应先以本 Skill 产物为基础

## 9. 成功判定

满足以下条件时，判定为成功：

1. `project-base-config.md` 已生成
2. 关键字段已有明确值，或已明确标记为 `⚠️待用户确认`
3. 模型能力画像已建立
4. 已给出推荐生产模式与音频路线
5. 目录骨架已应用
6. 如果用户目标包含项目内使用，则 `.trae` 安装态已检查并记录结果
7. provider capability preflight 已完成

建议成功输出：

```text
✅项目基础配置与模型能力画像已建立。
请根据待确认项情况决定是否先执行 sk0b_missing_field_guide。
```

## 10. 失败判定

出现下列情况时，判定为失败或暂停：

1. 目录骨架未应用
2. `project-base-config.md` 未生成
3. 关键字段缺失但仍试图继续后续 Skill
4. 模型能力画像缺失
5. 参考文件不可读
6. 用户要求项目内安装，但 `.trae` 安装态未检查
7. 需要进入图片/视频阶段，但 provider capability preflight 缺失

## 11. 关联文件

- `prompts.md`
- `outputs-template.md`
- `schemas/project-config.schema.json`
