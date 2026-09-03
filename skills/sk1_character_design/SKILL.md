# SKILL: sk1_character_design（角色设定 & 风格前缀模板库）

## 一、职责边界
**做什么**：根据 SK0 配置的风格和角色锚点清单，为每个角色输出：
1. 完整角色设定 9 章节文档（单人一份）
2. 全局角色一致性约束文档：单人 / 双人 / 三人同框的 **完整前缀 3 行模板**（后续 SK4 提示词生成时强制直接复制粘贴，禁止 AI 简写，防细节遗漏变脸变色）
3. 12 条禁止事项清单 + 6 步一致性验证流程模板

**不做什么**：
- 不真的画图，只输出「角色多角度视图提示词」「情绪特写提示词」文字模板（用户拿提示词去豆包画图）
- 不改 SK0 已确认的基础配置，只扩展细节

## 二、输入输出
### 输入（强制串行依赖 SK0 + SK0b）
- `00_project-config/project-base-config.md` → characterRoster 字段

### 输出
| 输出文件 | 路径 |
|---|---|
| 每个角色完整设定 9 章节（1 角色 1 份） | `01_character-design/docs/char-<char-id>-full-design.md` |
| 全局角色一致性约束（含 3.1/3.2/3.3 完整前缀 3 行模板） | `01_character-design/docs/character-consistency-rules.md` |
| 临时：角色前缀实验版（如生成了多版） | `99_temporary-workspace/draft-versions/`（附清理建议） |

## 三、核心技术
- **完整前缀强制复制法**（写实风格自动激活）：把角色所有铠甲/服装/宝石/发型细节完整写成 3 行模板，后续 SK4 提示词中**必须直接复制粘贴原 3 行**，禁止 AI 自己改写或漏掉细节
- **写实风格额外激活**：如果 `artStyle ∈ {cinematic-realistic-3d, sci-fi-realistic}`，自动在 6 步检查清单中追加「比例校验」「细节 100% 匹配」两项死禁

## 四、执行步骤
1. 读 `project-base-config.md: characterRoster`，对每个角色循环
2. 读 `style-presets.yaml` 对应风格的前缀模板
3. 为每个角色写 `char-xxx-full-design.md`（9 章节，见 `outputs-template.md`）
4. 汇总所有角色 → 生成 `character-consistency-rules.md`：3.1 单人A前缀 / 3.2 单人B前缀 / 3.3 双人同框前缀（含百分比特权锚点+家具厘米数，写实风格自动激活）
5. 追加生成 12 禁清单 + 6 步验证流程
