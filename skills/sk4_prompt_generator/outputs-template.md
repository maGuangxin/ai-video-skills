# video-prompt.md

> 对应 shot：`shot-<ID>`
> 风格：`<style-id>`
> 时长：`<seconds>`
> 画幅：`<ratio>`
> 生产模式：`<safe / balanced / expressive>`
> 音频路线：`<mute_plus_tts / native_audio / hybrid>`

## 中文版

### 1. global_invariants
> `<角色真相源、场景真相源、风格、比例、不可变项>`

### 2. shot_semantic_block
> `<这一镜要表达的剧情目的、镜头目的、情绪重点>`

### 3. continuity_block
> `<摄像机位置、人物朝向、视线目标、轴线关系、与上一镜和下一镜的承接关系>`

### 4. motion_and_dialogue_block
- `<时间段>`：`<动作>`
- `<时间段>`：`<动作 + 台词>`
- `<时间段>`：`<收尾动作>`
- `dialogue_route`：`<静音 / 原生音频 / 混合>`

### 5. camera_and_visual_block
| 参数项 | 值 |
|---|---|
| 景别 | |
| 构图 | |
| 镜头 | |
| 帧率 / 快门 | |
| 灯光 | |
| 色彩 | |

### 6. anchor_block
> `<首帧锚点、尾帧锚点、中间爆点帧、道具锚点、表情锚点>`

### 7. forbidden_drift_block
> `<本镜头禁止漂移的项：角色外观、服装、道具、背景、朝向、视线、机位等>`

### 8. fallback_block
1. `<局部修正策略 1>`
2. `<局部修正策略 2>`
3. `<回退到静音 + TTS 的策略>`

## English Version
> `<与中文版逐段对应的英文内容>`
