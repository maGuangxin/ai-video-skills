# 项目基础配置表

> 本文件是项目级配置真相源。未确认的项统一标记为 `⚠️待用户确认`，不要补写默认事实。

## 一、项目元信息
| 字段 | 值 | 备注 |
|---|---|---|
| 项目语义名 | `<由用户输入整理>` | |
| 项目路径 | `<用户选择>` | 可为相对路径或绝对路径 |
| Skill 包版本 | `v1.0.0` | 来自 `VERSION` |
| 创建时间 | `<ISO8601>` | |
| 入口类型 | `<①~⑥>` | 与实际入口一致 |

## 二、项目级安装策略
| 字段 | 值 | 说明 |
|---|---|---|
| 当前 IDE / Agent 类型 | `<trae / generic-ide / unsupported-project-install / unknown>` | 先识别环境，再决定安装目录 |
| 是否要求安装到项目根目录 | `<true / false / ⚠️待用户确认>` | 若为 `true`，后续必须检查对应安装模式 |
| 安装模式 | `<trae-project-level / ide-project-level / repository-adjacent-manual / ⚠️待用户确认>` | |
| 安装检查目标路径 | `<具体路径 / 按 IDE 官方文档 / 不适用>` | |
| 项目级安装态检查结果 | `<passed / missing / partial / manual-fallback / ⚠️待用户确认>` | |
| Trae 检查项 | `<.trae / whoIam.md / skills / rules / manifest>` | 仅 Trae 模式必填 |
| 通用 IDE 检查项 | `<对应目录 / 配置文件 / 刷新方式>` | 仅 `ide-project-level` 模式必填 |
| 是否已执行安装或检查 | `<yes / no / ⚠️待用户确认>` | |
| 自动化安装支持 | `<trae-script / manual-only / ⚠️待用户确认>` | 目前只有 Trae 提供脚本闭环 |

## 三、模型能力画像
| 字段 | 值 | 说明 |
|---|---|---|
| 模型名称 | | |
| 模型厂商 | | |
| 单段硬上限秒数 | | |
| 单段推荐稳定秒数 | | 后续拆镜优先参考这一项 |
| 是否支持原生音频 | | |
| 是否支持原生台词 | | |
| 口型能力等级 | `<unsupported / rough / precise>` | |
| 口型稳定性 | `<low / medium / high>` | |
| 人物一致性能力 | `<low / medium / high>` | |
| 多镜连续性能力 | `<low / medium / high>` | |
| 是否支持参考图 | | |
| 是否支持首尾帧 | | |
| 是否支持中间锚点 | | |
| 是否支持局部修复 | | |

## 四、provider capability preflight
| 字段 | 值 | 说明 |
|---|---|---|
| 凭据状态 | `<available / missing / unverified>` | |
| textToImage | `<supported / unsupported / unverified>` | |
| imageToImage | `<supported / unsupported / unverified>` | |
| imageConditionedVideo | `<supported / unsupported / unverified>` | |
| identityConsistency | `<supported / unsupported / unverified>` | |
| multiReferenceFusion | `<supported / unsupported / unverified>` | |
| showcasePackSupport | `<supported / unsupported / unverified>` | |
| referencePackSupport | `<supported / unsupported / unverified>` | 若身份一致性或多参考融合未验证，则不得标记为 `supported` |

## 五、生产路线
| 字段 | 值 | 说明 |
|---|---|---|
| 推荐生产模式 | `<safe / balanced / expressive>` | |
| 推荐音频路线 | `<mute_plus_tts / native_audio / hybrid>` | |
| 是否建议优先静音视频 | | |
| 是否建议缩短单段长度 | | |
| 是否建议强依赖关键帧 | | |
| 是否允许直接产出 `reference_pack` | `<yes / no>` | 取决于 provider capability preflight |

## 六、平台与输出参数
| 字段 | 值 | 说明 |
|---|---|---|
| 目标平台 | `<①~④>` | |
| 单段实际拆镜秒数 | `<结合模型能力决定>` | 供 `sk3` 使用 |
| 总目标时长 | `<①~④>` | |
| 画面比例 | `<9:16 / 16:9 / 1:1>` | |
| 配音方案 | `<mute_plus_tts / native_audio / hybrid>` | |

## 七、风格配置
| 字段 | 值 |
|---|---|
| 美术风格 | `<风格枚举或自定义>` |
| 风格 ID | `<style-presets 对应值>` |
| 角色前缀引用规则 | `<启用 / 不启用>` |
| 比例与尺度锚点规则 | `<按风格决定>` |
| 口型相关规则 | `<按音频路线和模型能力决定>` |
| 负向规则集 | `<按风格决定>` |

## 八、角色清单
| # | char ID | 语义名 | 关键信息摘要 |
|---|---|---|---|
| 1 | `<必填>` | | `<种族、年龄、身高体型、职业、外观、服装、关系等>` |
| 2 | | | |

## 九、场景清单
| # | scene ID | 语义名 | 关键信息摘要 | 尺度参考 |
|---|---|---|---|---|
| 1 | `<必填>` | | `<时段、核心家具、光线、氛围等>` | `<按风格填写>` |
| 2 | | | | |

## 十、核心爆点
| # | 爆点名 | 发生位置 | 切分说明 |
|---|---|---|---|
| 1 | `<必填>` | | `<建议保持完整或待确认>` |
| 2 | | | |

## 十一、命名与临时文件策略
| 字段 | 值 | 说明 |
|---|---|---|
| namingConvention（兼容旧字段） | `<english-semantic / mixed-cn-en-ids / english-ids-only>` | |
| businessPathLanguage | `<zh-CN / en-US / mixed>` | 业务目录路径语言 |
| artifactFileLanguage | `<zh-CN / en-US / mixed>` | 业务产物文件名语言 |
| internalIdentifierLanguage | `en-US` | Skill ID、schema 字段、API 名保持英文 |
| 临时文件策略 | `<per-stage-suggestion-list / per-stage-reminder-only / end-of-project-once>` | |
| 临时工作区目录 | `99_temporary-workspace/` | |

## 十二、校验结论
- 已填项：`<X>`
- 待确认项：`<Y>`
- 项目级安装态：`<passed / missing / partial / manual-fallback / ⚠️待用户确认>`
- provider capability preflight：`<passed / blocked / partial>`
- 推荐生产模式：`<safe / balanced / expressive>`
- 推荐音频路线：`<mute_plus_tts / native_audio / hybrid>`
- 结论：`<可继续 / 需先补项 / 仅允许 showcase_pack>`
