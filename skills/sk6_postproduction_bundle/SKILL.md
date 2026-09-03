# SKILL: sk6_postproduction_bundle（字幕 / TTS配音 / 剪映模板批量生成）

## 一、职责边界
**做什么**：从 SK3 的分镜时间轴自动生成后期三件套：
1. **SRT 字幕**：每段视频独立 1 份 SRT + 1 份全片统一拼接 SRT
   - **字幕默认不带角色名前缀**（如「塔薇：」「马库斯：」，用户可通过配置开关开启），这是之前用户确认的标准
2. **TTS 配音清单**：每段语速/字数/配音角色/情绪/推荐 TTS 引擎参数，用户按清单去任意 TTS 平台配音
3. **剪映傻瓜教程**：分镜步骤化，用户零基础按步骤点按钮就能拼接 9 段视频 + 字幕 + TTS 配音

**不做什么**：
- 不调用 TTS 接口真的发音
- 不打开剪映软件自动操作
- 不导出最终成片 MP4

## 二、智能串并行（D3 要求）
- **前置依赖**：只依赖 SK3 分镜脚本的时间轴（台词+秒数）
- **可以完全并行的步骤（节省总时间）**：
  - 与「用户画图/生成关键帧/生成视频」**完全并行**
  - 与 SK4 提示词生成 **并行**
  - 不需要等视频生成出来，只要分镜时间轴齐了就能生成字幕/TTS

## 三、输入输出
### 输入
- SK3：所有 `storyboard-script.md` 里的 B 表（每段台词起止秒、原文、字数）
- SK0 project-base-config.md：`voiceoverMode`（决定是否开 TTS 参数）/ `namingConvention`
### 输出
| 输出 | 路径 |
|---|---|
| 每段独立 SRT（N 段 × 1） | `05_final-deliverables/subtitles/sub-shot-<ID>.srt` |
| 全片统一拼接 SRT（1 份） | `05_final-deliverables/subtitles/full-film-unified.srt` |
| 全片 TTS 配音清单（1 份）| `05_final-deliverables/tts/tts-voiceover-full.md` |
| 剪映傻瓜操作手册（1 份）| `05_final-deliverables/tutorials/jianying-step-by-step.md` |

## 四、硬规则
### SRT 字幕规范
- 编码：UTF-8 强制
- 字幕前缀：**默认**不带「<角色名>：」（用户可通过 `subtitleShowSpeakerPrefix = true` 配置项开启前缀模式）
- 单条字幕最大字数：中文建议 ≤ 18 字 / 行，超了换行两行
- 时间轴严格对齐 SK3 的 L 列嘴型窗口起止秒
### TTS 语速规范
- 中文自然朗读基准：3.5 字/秒 = 普通慢速
- 短视频 4.0 字/秒 = 自然流畅（推荐默认）
- 上限 4.5 字/秒：机械感强，只在超字数压缩时用
### 剪映傻瓜手册
- 每步：一句话说明 + 按钮路径（例：「顶部菜单 → 文字 → 导入SRT → 选 `sub-shot-1A.srt`」）
- 零基础用户能照着点，不用懂剪辑术语

## 五、执行步骤
1. 读 SK3 的 B 表每段 shot ID / 台词起止秒 / 原文 / 字数
2. 生成 N 段 sub-shot-XX.srt（标准 SRT 序号+时间轴格式）
3. 累计偏移时间轴生成 full-film-unified.srt
4. 按角色+情绪分类生成 TTS 清单（角色→情绪→字数→预计时长→引擎建议）
5. 生成剪映 7 步傻瓜教程：导入素材→拖轨道→导入字幕→导入配音→对齐→加转场→导出成片
