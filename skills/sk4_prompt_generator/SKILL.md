# SKILL: sk4_prompt_generator（提示词批量生成 · 全 Skill 包核心价值 Skill）

## 一、职责边界
**做什么**：根据 SK3 拆分好的每段视频，结合项目风格激活对应的核心技术开关，按 `schemas/prompt.schema.json` 为每段生成 1 份 `video-prompt.md`（中英双语 + 6 大类负向 + 翻车兜底 3 条）。

**激活的 3 大核心技术开关（完全来自 style-presets.yaml，不手写死写实）**：
1. **写实 3 次夹攻法**（写实风格=true，其他 false/partial）：提示词「开头权重最高处双写实前缀 / 角色段末尾二次材质写实 / 灯光魔法段末尾三次禁平光」，解决 Seedance 豆包端只有开头权重高的问题
2. **完整前缀强制复制法**（所有风格=true）：角色段必须从 `character-consistency-rules.md` 的 **3.1 / 3.2 / 3.3 直接复制粘贴原 3 行**，不允许 AI 自己简写或漏装备细节
3. **百分比特权 + 家具参照物锚点法**（写实/科幻/赛博=true）：在提示词开头写「角色 A 头顶 5-8% / 鞋底 10% / 角色 B 头顶 8-10%」+「床沿 74cm / 书桌 96cm / 门把手 125cm」真实 cm 数字

**额外配套激活**：口型 6 正词 7 禁词（有台词模式全段精确到秒段） + 6 大类 48 项负向词桶（写实风格 6 桶全开，卡通风格关闭 cartoonStyling13 桶）

**不做什么**：
- 不真的调用豆包 API 生成视频
- 不改分镜时间轴，只严格按 SK3 的时间戳写

## 二、输入输出
### 输入（强制串行依赖 SK3 + SK1）
- SK3 `storyboard-script.md`（每段动作时间戳 + 台词窗口）
- SK1 `character-consistency-rules.md: 3.1/3.2/3.3 三行前缀`
- SK2 `unified-visual-spec.md`
- `style-presets.yaml` 对应风格模板 + `cinematic-knowledge.yaml` 专业映射
### 输出
| 输出 | 路径模板 |
|---|---|
| 每段视频提示词（中英双语 + 负向 + 兜底）| `03_storyboard/storyboard-<ID>/shot-<ID>-<SEMANTIC>/video-prompt.md` |

## 三、执行步骤（每段视频循环）
1. 读 style-presets 的 artStyle，激活对应的 3 大技术开关
2. 写第 1 次写实夹攻前缀（对应开关开才写）
3. **角色段强制直接复制 3.1/3.2/3.3 三行原内容，不改写不漏项** → 末尾追加第 2 次材质写实夹攻
4. 写场景段 + cameraCinematicBlock（景别/构图/灯光/镜头/色彩全从 cinematic-knowledge 映射来专业词，用户不用懂）
5. 写动作时间戳 + 口型 6 正词 7 禁词精确到秒段
6. 写灯光魔法段 + 末尾第 3 次禁平光夹攻
7. 写 6 大类负向词桶（对应开关开的桶才写，卡通关 cartoonStyling 桶）
8. 写翻车兜底 3 条（豆包端局部修改：圈嘴/圈发色/圈卡通）
9. 合并为中文版 + 英文版，写入 video-prompt.md
