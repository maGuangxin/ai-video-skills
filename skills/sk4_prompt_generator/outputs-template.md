# video-prompt.md（单段视频提示词完整模板）

> **对应 shot ID**：shot-<ID> <SEMANTIC_NAME>
> **激活的 3 大核心技术开关（自动来自 style-presets.yaml）**：
> - 写实 3 次夹攻法 = <true / partial / false>
> - 完整前缀强制复制法 = <true 所有风格默认开>
> - 百分比特权 + 家具锚点法 = <true / false>
> **风格**：<cinematic-realistic-3d / ……>
> **时长**：<10>s &nbsp; **画幅**：<9:16 / 16:9 / 1:1>

---

## 🇨🇳 中文版（直接复制到豆包端）

---

### 【夹攻①·开头双写实前缀】（自动来自 style-presets.firstRealismPinchZh）
> <超写实真人比例真实3D电影级CG渲染……>

---

### 角色段（⚠️ **以下 3 行 = 从 character-consistency-rules.md 3.1 / 3.2 / 3.3 直接复制粘贴原文，无任何改写/删减**）
1. <3.1 单人A 第1行 完整10项细节 原封不动>
2. <3.2 单人B 第1行 原封不动>
3. <3.3 双人同框 第1行 + 百分比特权 马库斯头顶5-8% / 塔薇头顶8-10% / 两人鞋底都贴 10% 地面线 + 床沿 74cm 锚点 + 门把手 125cm 锚点 原封不动>

### 【夹攻②·角色末尾二次材质写实】（写实=true才写）
> <材质物理属性严格真实：金属拉丝……>

---

### 场景段（从 scene-xxx-full-design 直接搬）
> 场景：scene-<ID> + 时段 + 核心家具位置不变 + 环境色……

### 【摄影摄像专业参数块】（全部由 cinematic-knowledge.yaml 映射，用户不用懂）
| 参数项 | 专业值（自动映射，用户不说术语） |
|---|---|
| 景别（Shot Scale） | Medium Shot 50mm Standard Prime |
| 构图（Composition） | Rule of Thirds, left 1/3 line + nose room 2/3 right |
| 镜头（Lens） | 50mm f/1.4 Standard Prime, Rectilinear |
| 帧率/快门 | 24fps Cinematic Academy Standard 180° shutter 1/48s |
| 灯光（Lighting） | 2700K Practical Lamp + 45° Key Soft Box + 1.5:1 ratio Soft Fill |
| 色彩 | Rec.709 Gamma 2.4 + Teal & Orange Hollywood LUT |

---

### 动作时间轴 + 口型精确到秒段（严格按 SK3 四维对齐表写）
- 0.0s-2.5s：<动作>
- 2.5s-8.0s：<动作> + 台词「<原文>」口型时间窗（口型 6 正词精确到本秒段：mouth movement visible / jaw movement natural / natural lip-sync / lips animate while speaking / expressive lip motion / mandible oscillation while vowels）
- 8.0s-10.0s：<收尾动作>

### 灯光 / 魔法特效段
> <灯光描写> + （如有圣光/暗影：金色圣光粒子边缘金边轮廓光 / 紫黑暗影粒子）

### 【夹攻③·灯光段末尾三次禁平光】
> <灯光物理真实：三点布光真实阴影……禁止无阴影无方向卡通平光 Ambient 100%>

---

### 🚫 负向 6 大类词桶（6×8 = 48 项，风格自动开关）
> 1. 口型 7 禁（永久开）：static mouth / frozen lips / glued mouth / …… 7 项
> 2. 卡通 13 禁（卡通风关，其他全开）：cartoon style / anime illustration / 2D flat / chibi big head / …… 13 项
> 3. 材质 9 禁（写实风格开）：plastic skin / rubber material / flat solid color / …… 9 项
> 4. 比例 9 禁（写实风格开）：extra large head / compressed height difference / …… 9 项
> 5. 细节 10 禁（全风格开）：wrong hair color / missing armor / gem wrong color / …… 10 项
> 6. 基础 10 禁（全风格开）：low res / jpeg artifacts / watermark / extra limbs / …… 10 项

---

### 🆘 翻车兜底 3 条（豆包端局部修改省 85% 积分）
1. **嘴不动 → 局部修改**：圈选「嘴+下颌区域」+ 时间段 2.5-8.0s + 指令文本 = `<口型6正词再贴一遍>`
2. **卡通风化 → 局部修改**：圈选「整个人物主体」+ 指令文本 = `<重写实3次夹攻前缀再贴一遍>`
3. **发色渐变 / 宝石颜色错 → 局部修改**：圈选「头发+宝石区域」+ 指令文本 = `<纯深棕无挑染 / 仅暗紫色无杂色蓝红光>`

---

## 🇬🇧 English Version（备用平台用，内容严格=中文版逐句对应翻译，不含中文）
> <严格对应中文版逐段英文，不展开，全文翻译>
