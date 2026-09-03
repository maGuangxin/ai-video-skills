# 项目基础配置表（SK0 产物模板 · 结构化 + 专业 + 可校验）

> ⚠️本文档是全项目「唯一真相源」，所有后续 Skill 读此文件配置，不读其他地方。
> 未回答的项统一填 `⚠️待用户确认`，禁止脑补填默认值。
> 校验 Schema：`ai-video-skills/schemas/project-config.schema.json`（JSON Schema Draft 7，必填字段缺 = 后续 Skill 不启动）。

---

## 一、项目元信息
| 字段 | 值 | 备注 |
|---|---|---|
| 语义化项目英文名 | `<由用户Q12和Q1回答合成，例：cafe-first-meet-v1>` | 用于根目录命名 |
| 绝对路径（本机） | `<用户Q12选择>` | 例：`/Users/xxx/Desktop/cafe-first-meet-v1` |
| Skill 包版本 | `v1.0.0`（来自 `ai-video-skills/VERSION`） | |
| 创建时间 | `<自动填 ISO8601 时间>` | |
| 用户入口类型（Q1） | `<①~⑥枚举值，与schemas一致>` | |

---

## 二、生产平台与输出硬参数（SK3 拆分镜必看）
| 字段 | 值 | 硬限制（来自平台） |
|---|---|---|
| 目标平台（Q3） | `<①~④枚举>` | ①豆包=10s/段硬锁；②即梦=20s；③自定义 |
| 单段最长秒数 | `<自动换算：豆包=10 / 即梦=20 / API=用户填>` | SK3 拆分镜**不得超过这个值** |
| 总目标时长范围（Q2） | `<①~④>` | 例：30~90s |
| 画面比例（Q4） | `<9:16 / 16:9 / 1:1>` | 所有提示词、构图、景别统一按这个比例 |
| 台词配音方案（Q6） | `<①~④>` | ①=默认TTS，SK4 自动开出口型 6 正词 7 禁词 |

---

## 三、美术风格 + 3 大核心技术开关矩阵（来自 `style-presets.yaml`）
| 字段 | 值 |
|---|---|
| 美术风格（Q5） | `<8种风格枚举或自定义>` |
| ▶️ 风格 ID 自动匹配： | `<cinematic-realistic-3d / semi-realistic-game-cg / us-cartoon / jp-anime / chinese-gufeng-handpaint / cyberpunk-neon / sci-fi-realistic / custom>` |
| 写实3次夹攻法（SK4提示词夹头/中/尾3次） | `<自动=写实类true / 卡通风false / 半写实partial>` |
| 完整前缀强制复制法（SK1角色完整3行直接粘） | `<所有风格=true>` |
| 百分比特权 + 家具厘米锚点法（SK3+SK4比例控制） | `<写实/科幻/赛博=true，其他=false>` |
| 口型6正词7禁词精确到秒段 | `<有台词模式=全部true>` |
| 6大类负向词桶（48条） | `<写实类全6桶=true，卡通类关闭cartoonStyling桶>` |

---

## 四、角色清单（Q7 循环填入，每角色对应 `schemas/character.schema.json`）
| # | char ID（例：char-alex-cafe-male） | 语义名 | 10项锚点一句话摘要（10项全有才算齐）|
|---|---|---|---|
| 1 | `<必填>` | | `<种族+性别+年龄+身高体型+职业+发型发色+瞳色+9~12件标志性装备+性格+关系>` ⚠️缺项打`⚠️待确认` |
| 2 | | | |
| … | | | |

---

## 五、场景清单（Q8 循环填入，对应 `schemas/scene.schema.json`）
| # | scene ID（例：scene-cafe-interior-day）| 语义名 | 5项锚点一句话摘要 | 写实家具锚点厘米数（仅写实风格自动附）|
|---|---|---|---|---|
| 1 | `<必填>` | | `<时段+核心家具+光线主色温+情绪>` | 例：餐椅=45 / 咖啡桌=74（写实风格自动来自 cinematic-knowledge furniture cm） |
| 2 | | | | |
| … | | | | |

---

## 六、核心爆点（Q9 填入，拆分镜第一优先级：**爆点中间不切段**）
| # | 爆点名 | 发生分镜/角色/场景 | 中间是否严格不切 |
|---|---|---|---|
| 1 | `<必填>` | | ✅ 严格不切（mustNotSplitInMiddle = true）|
| 2 | | | ✅ |

---

## 七、项目规范（Q10 / Q11）
| 字段 | 值 |
|---|---|
| 文件命名规范（Q10） | `<english-semantic / mixed-cn-en / english-ids-only>`，完整规则见 `lib/naming-rules.yaml` |
| 临时文件清理策略（Q11） | `<per-stage-suggestion-list / per-stage-reminder-only / end-of-project-once>` |
| 临时工作区目录 | 固定：`99_temporary-workspace/` |

---

## 八、校验结论
- 核心必填字段总数：`schemas/project-config.schema.json: required` 中 14 项
- 已填 ✅：`<X>`
- 缺项 ⚠️待确认：`<Y>`
- **校验结论**：`<全部通过 / 还有缺项不允许继续后续 Skill>`
