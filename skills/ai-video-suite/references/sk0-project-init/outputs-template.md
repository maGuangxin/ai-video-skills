# 项目基础配置表

> 本文件是项目级配置真相源。未确认的项统一标记为 `⚠️待用户确认`，不要补写默认事实。
> 来自 `lib/model-capability-presets.yaml` 兜底的字段，标注"来自预设，未经用户确认"。

## 一、项目元信息
| 字段 | 值 | 备注 |
|---|---|---|
| 项目语义名 | `<由用户输入整理>` | |
| 项目路径 | `<用户选择>` | 可为相对路径或绝对路径 |
| 套件版本 | `<v2.0.0>` | 来自 SKILL.md metadata |
| 创建时间 | `<ISO8601>` | |
| 入口类型 | `<①~⑥>` | 与实际入口一致 |
| 素材清单 | `input-manifest.md` | 由 input-ingestion 生成；无外部素材时标"无" |

## 二、模型能力画像
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

## 三、provider capability preflight
| 字段 | 值 | 说明 |
|---|---|---|
| 凭据状态 | `<available / missing / unverified>` | 只记录状态，不记录值 |
| textToImage | `<supported / unsupported / unverified>` | |
| imageToImage | `<supported / unsupported / unverified>` | |
| imageConditionedVideo | `<supported / unsupported / unverified>` | |
| identityConsistency | `<supported / unsupported / unverified>` | |
| multiReferenceFusion | `<supported / unsupported / unverified>` | |
| showcasePackSupport | `<supported / unsupported / unverified>` | |
| referencePackSupport | `<supported / unsupported / unverified>` | 若身份一致性或多参考融合未验证，则不得标记为 `supported` |

## 四、生产路线
| 字段 | 值 | 说明 |
|---|---|---|
| 推荐生产模式 | `<safe / balanced / expressive>` | |
| 推荐音频路线 | `<mute_plus_tts / native_audio / hybrid>` | |
| 是否建议优先静音视频 | | |
| 是否建议缩短单段长度 | | |
| 是否建议强依赖关键帧 | | |
| 是否允许直接产出 `reference_pack` | `<yes / no>` | 取决于 provider capability preflight |

## 五、平台与输出参数
| 字段 | 值 | 说明 |
|---|---|---|
| 发布平台 | `<抖音 / 视频号 / 快手 / 小红书 / B站 / 其他>` | 影响字幕安全区、标题文案风格与发布包；sk6 与 sk8 按此项适配 |
| 完播率参考 | `<已向用户提示 / 无需提示>` | 用户选择总时长档位时的完播率参考提示（见 prompts.md Q2） |
| 视频模型平台档位 | `<①~④>` | 档位定义见 lib/model-capability-presets.yaml |
| 单段实际拆镜秒数 | `<结合模型能力决定>` | 供 sk3 使用 |
| 总目标时长 | `<①~④>` | |
| 画面比例 | `<9:16 / 16:9 / 1:1>` | 竖屏时字幕需避开平台安全区（见 sk6 字幕风格规则） |
| 配音方案 | `<mute_plus_tts / native_audio / hybrid>` | |

## 六、风格配置
| 字段 | 值 |
|---|---|
| 美术风格 | `<风格枚举或自定义>` |
| 风格 ID | `<style-presets 对应值>` |
| 角色前缀引用规则 | `<启用 / 不启用>` |
| 比例与尺度锚点规则 | `<按风格决定>` |
| 口型相关规则 | `<按音频路线和模型能力决定>` |
| 负向规则集 | `<按风格决定>` |

## 七、角色清单
| # | char ID | 语义名 | 关键信息摘要 |
|---|---|---|---|
| 1 | `<必填>` | | `<种族、年龄、身高体型、职业、外观、服装、关系等>` |
| 2 | | | |

## 八、场景清单
| # | scene ID | 语义名 | 关键信息摘要 | 尺度参考 |
|---|---|---|---|---|
| 1 | `<必填>` | | `<时段、核心家具、光线、氛围等>` | `<按风格填写>` |
| 2 | | | | |

## 九、核心爆点
| # | 爆点名 | 发生位置 | 切分说明 |
|---|---|---|---|
| 1 | `<必填>` | | `<建议保持完整或待确认>` |
| 2 | | | |

## 十、命名与临时文件策略
| 字段 | 值 | 说明 |
|---|---|---|
| businessPathLanguage | `<zh-CN / en-US / mixed>` | 业务目录路径语言 |
| artifactFileLanguage | `<zh-CN / en-US / mixed>` | 业务产物文件名语言 |
| internalIdentifierLanguage | `en-US` | 模块 ID、schema 字段、API 名保持英文 |
| 临时文件策略 | `<per-stage-suggestion-list / per-stage-reminder-only / end-of-project-once>` | |
| 临时工作区目录 | `99_temporary-workspace/` | |

## 十一、校验结论
- 已填项：`<X>`
- 待确认项：`<Y>`
- provider capability preflight：`<passed / blocked / partial>`
- 推荐生产模式：`<safe / balanced / expressive>`
- 推荐音频路线：`<mute_plus_tts / native_audio / hybrid>`
- 结论：`<可继续 / 需先补项 / 仅允许 showcase_pack>`
