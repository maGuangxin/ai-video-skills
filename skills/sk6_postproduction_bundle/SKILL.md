# SKILL: sk6_postproduction_bundle

## 1. 作用

本 Skill 用于基于分镜时间轴生成后期交付包。

标准输出包括：

1. `05_final-deliverables/subtitles/sub-shot-<id>.srt`
2. `05_final-deliverables/subtitles/full-film-unified.srt`
3. `05_final-deliverables/tts/tts-voiceover-full.md`
4. `05_final-deliverables/tutorials/jianying-step-by-step.md`
5. `05_final-deliverables/audio/voice-strategy.md`

## 2. 不做的事

- 不调用 TTS 服务实际生成音频
- 不自动操作剪映
- 不导出最终视频文件

## 3. 前置条件

- `sk3_storyboard_split` 已生成可用时间轴
- `project-base-config.md` 中的配音、模型能力和命名相关字段可读

本 Skill 不要求 `sk4_prompt_generator` 先完成。

## 4. 必要输入

- `03_storyboard/**/storyboard-script.md`
- `00_project-config/project-base-config.md`
- `outputs-template.md`

如果 shot ID、台词原文或起止秒缺失，应暂停。

## 5. 缺项处理

当出现以下情况时，应暂停并退回 `sk3_storyboard_split`：

- shot ID 缺失
- 台词原文缺失
- 起止秒缺失
- 时间轴无法对齐
- 音频路线缺失，无法决定走静音、原生还是混合

建议统一输出：

```text
⚠️当前步骤已暂停：后期交付包生成所需的时间轴或音频路由信息不完整。
请先补齐分镜时间轴、台词信息和音频路线，再继续执行 sk6_postproduction_bundle。
```

## 6. 核心新增要求

本 Skill 需要根据项目配置选择音频路线：

1. `mute_plus_tts`
2. `native_audio`
3. `hybrid`

同时要输出：

1. 当前为什么采用这条路线
2. 哪些镜头适合保留原生音频
3. 哪些镜头建议回退到 TTS
4. 剪辑阶段的连续性检查建议

## 7. 执行步骤

1. 读取分镜时间轴和项目配置中的音频路线
2. 生成分段 SRT
3. 生成全片统一 SRT
4. 根据音频路线生成 TTS 清单、审校说明或混合方案
5. 生成 `voice-strategy.md`
6. 生成面向普通用户的剪映操作手册

## 8. 跳步规则

- 在 `sk3` 完成后，本 Skill 可直接执行
- 不必等待 `sk4`
- 当项目明确关闭原生台词或口型能力不足时，应优先走静音 + TTS 路线

## 9. 成功判定

满足以下条件时，判定为成功：

1. 分段 SRT 已生成
2. 全片统一 SRT 已生成
3. TTS 清单已生成，或已明确标记当前不启用
4. `voice-strategy.md` 已生成
5. 剪映操作手册已生成

建议成功输出：

```text
✅后期交付包已生成，可以按当前音频路线并行推进视频生成、配音与剪辑整理。
```

## 10. 失败判定

出现下列情况时，判定为失败或暂停：

1. 时间轴信息缺失
2. 关键输出文件未生成
3. 字幕或 TTS 内容与分镜台词不一致
4. 音频路线与模型能力明显不匹配却未提示回退
