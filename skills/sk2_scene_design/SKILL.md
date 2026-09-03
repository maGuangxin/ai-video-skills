# SKILL: sk2_scene_design（场景设定 & 统一视觉规范）

## 一、职责边界
**做什么**：根据 SK0 的风格 + 场景清单，为每个场景输出：
1. 8 章节完整设定文档（1 场景 1 份）
2. 3 机位视图提示词模板（全景 / 中景 / 特写）
3. 全局 4 大类统一视觉规范：整体美术风格 / 镜头语言规范 / 色彩体系 / 魔法特效风格规范

**不做什么**：
- 不真的画图，只输出文字模板让用户去豆包生图
- 不改角色（与 SK1 **完全并行可同时做**）

## 二、输入输出
### 输入
- `project-base-config.md: sceneRoster + artStyle`
### 输出
| 输出文件 | 路径 |
|---|---|
| 1 场景 1 份 8 章节设定 | `02_scene-design/docs/scene-<scene-id>-full-design.md` |
| 全局统一视觉规范 4 大类 | `00_project-config/unified-visual-spec.md` |

## 三、核心技术
- **家具参照物锚点法**（写实风格自动激活）：74cm 床 / 96cm 书桌 / 125cm 门把手 / 45cm 餐椅 / 92cm 厨房台面，写实风格自动写入真实高度（来源于 `cinematic-knowledge.yaml`）
- **灯光色温真实 CCT 值匹配**：2700K 暖黄室内 / 3200-4500K 黄金夕阳 / 5500K 白日 / 6500-8000K 冷蓝夜

## 四、执行步骤
1. 循环每个场景，读 style-presets 的对应风格模板
2. 写 scene-xxx-full-design.md 8 章节（对应 template）
3. 跨场景汇总成 unified-visual-spec.md（4 大类）
4. 写实风格自动附加家具 cm 锚点对照
