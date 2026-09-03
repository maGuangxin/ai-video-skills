# AI Video Skills Suite（v1.0.0）

一套面向 **短视频 AI 生成**的全流程 Skill 包。从故事原文 / 剧情大纲 / 甚至 **只有单段 10 秒剧情片段** 都能启动，支持 6 种入口，内建「通俗交互 → 专业电影术语」映射层，用户不懂摄影摄像知识也能产出专业级提示词和脚本。

## 一、安装 2 步走（主流 Agent 双模式兼容）

### 方式 A：标准推荐（Git Clone）
```bash
cd 你的项目根目录
git clone https://github.com/maGuangxin/ai-video-skills.git ai-video-skills
```
大多数主流 Agent 会自动识别 `ai-video-skills/skills.manifest.yaml` 并注册 8 粒 Skill，无需额外配置。

### 方式 B：Git Submodule（跟随你的项目版本走）
```bash
cd 你的项目根目录
git submodule add https://github.com/maGuangxin/ai-video-skills.git ai-video-skills
git submodule update --init --recursive
```

### 方式 C：老 Agent 兜底 Fallback（不识别 manifest）
不注册也能直接用：每粒 Skill 的执行入口直接就是 `ai-video-skills/skills/<skill-id>/SKILL.md`，Agent 打开此文件读参数即可。

---

## 二、8 粒 Skills 总览（串并行智能调度）

| Skill ID | 中文名 | 主要做什么 | 串并行关系 |
|---|---|---|---|
| `sk0_project_init_guided` | 项目基础配置引导（12 项 Agent 主动提问） | 逐项问清楚项目参数，生成全局《项目基础配置表》 | **强制串行第一步**，答完才能继续 |
| `sk0b_missing_field_guide` | 缺项补全引导引擎 | 全局 pre-hook：后续每步执行前扫缺项，缺就问用户，绝不脑补 | 全局绑定，自动触发 |
| `sk1_character_design` | 角色设定 & 前缀模板库 | 产出角色完整 9 章节设定 + 单人/双人/三人完整前缀 3 行模板 | **与 SK-2 场景 ↔ 完全并行**，互不依赖 |
| `sk2_scene_design` | 场景设定 & 统一视觉规范 | 产出场景 8 章节设定 + 全局统一视觉规范（4 大类） | **与 SK-1 ↔ 完全并行**，同时做节省时间 |
| `sk3_storyboard_split` | 分镜拆分 & 四维对齐 | 单段剧情直接落单段；多段剧情按 4 原则拆分，交付 3 件套脚本 | **强制串行**（SK-1+SK-2 全了才能拆） |
| `sk4_prompt_generator` | 提示词批量生成（核心 Skill） | 按风格自动激活 3 大核心技术，产出中英双语 + 6 大类负向 + 兜底 | **强制串行**（SK-3 完了才有动作时间戳） |
| `sk5_consistency_audit` | 一致性校验 & 四档打标 | 6 步检查清单按风格动态调整，✅/⏳/❌/⚠️ 四档状态 | **强制串行**（SK-4 完了才能校验提示词） |
| `sk6_postproduction_bundle` | 字幕 / TTS / 剪映模板 | N 段 SRT + 全片统一 SRT + TTS 配音清单 + 剪映傻瓜手册 | **与 SK-4/SK-5 + 用户画图生成视频 ↔ 完全并行**，和画图同时跑不卡时间 |

---

## 三、用户不懂摄影术语也能产出专业视频（通俗 ↔ 专业映射层）

内建 `lib/cinematic-knowledge.yaml` 专业领域知识库，用户全程回答人话：

| 用户回答的人话（通俗交互） | 自动写入产物的专业电影术语 |
|---|---|
| 「拍上半身腰部到头顶」 | Medium Shot (MS) 50mm f/2.8 standard prime |
| 「人物站在画面左边」 | Rule of Thirds, left 1/3 line + nose room 2/3 on right |
| 「暖黄灯光温馨感」 | 2700K Warm Practical Lamp + 45° Soft Box Key, 1.5:1 ratio |
| 「电影感强一点背景虚化」 | 50mm f/1.4 Standard Prime, Shallow Depth of Field Bokeh |
| 「标准电影感帧率」 | 24fps Cinematic Academy Standard, 180° shutter 1/48s |
| 「好莱坞暖冷对比色调」 | Rec.709 Gamma 2.4 Teal & Orange LUT, shadows teal highlights orange |

> ✅ 用户只说人话，专业术语由 Agent 自动配进提示词和脚本，生成质量直接提升。

---

## 四、6 种入口灵活支持（不强制必须完整故事原文）

| 入口编号 | 你手上有什么 | 能跳过哪些 Skill |
|---|---|---|
| ① | 完整故事原文小说 | 正常 8 粒全跑 |
| ② | 剧情大纲（几条节点） | 跳过原文 → 大纲处理，直接跑角色/场景 |
| ③ | 已经有角色清单 + 场景 + 1 段核心爆点 | 直接跑 SK-3 分镜拆分开始 |
| ④⭐ | **只有 1 段 10 秒剧情片段（最常用）** | 单段剧情不分镜，直接落 SK-3 单段 → SK-4 提示词，5 分钟出全套 |
| ⑤ | 分镜脚本台词已写好现成 | 跳过 SK-3 之前，直接跑 SK-4/SK-5/SK-6 |
| ⑥ | 视频提示词已写好现成，只做校验和字幕 | 直接跑 SK-5 校验 + SK-6 字幕 TTS |

---

## 五、目录三层职能清晰（过程产物 / 最终产物 / 临时文件严格分离）

| 目录层 | 路径 | 保留策略 | 典型内容 |
|---|---|---|---|
| 配置总览层 | `00_project-config/` | 永久保留 | 12 项配置表 / 缺项待确认 / 进度总览 / 关联关系 |
| 过程产物层 | `01_character-design/` `02_scene-design/` `03_storyboard/` `04_keyframes-assets/` | 永久保留 | 角色/场景/分镜/关键帧全套文档，每步可回溯 |
| 最终交付层 | `05_final-deliverables/` | 永久保留 | 视频片段 / SRT 字幕 / TTS 配音清单 / 剪映教程 / 完整成片 |
| 临时工作区 | `99_temporary-workspace/` | 每阶段出删除建议清单，**需您手动确认后才删（防误删）** | 草稿临时版 / 拆分镜缓存 / 提示词实验版 |

命名规范严格遵循 `lib/naming-rules.yaml`，禁止模糊命名「新建文件夹 / 图片1 / 最终最终版」等无效名。

---

## 六、快速跑最简示例

详见 `examples/quickstart-cafe-scene/walkthrough.md`：**2 角色 + 1 咖啡馆场景 + 单段 10 秒初次见面爆点片段**，完整走 8 粒 Skill，每步输入输出全展示，5 分钟走完一遍模板就会用。

---

## 七、版本 / 开源协议

- **版本号**：见根目录 `VERSION` 文件（当前 1.0.0，遵循 SemVer 语义化版本）
- **协议**：MIT（见 `LICENSE` 文件）
- **详细安装到具体 Agent 的教程**：见 `docs/install-guide-for-agents.md`
- **完整串并行依赖图**：见 `docs/dependency-flow.md`
- **常见问题 FAQ**：见 `docs/faq.md`
