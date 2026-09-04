# storyboard-script.md

## A. 分镜基本信息
- 分镜 ID：
- 分镜语义名：
- 场景：
- 出场角色：
- 分镜总秒数：
- 拆分段数：
- 推荐生产模式：
- 实际拆镜依据：

## B. 四维对齐总表
| shot ID | 语义名 | 视频时长 | 动作时间轴 | 嘴型窗口 | 台词原文 | 字数 | TTS 预估时长 | 首帧嘴状态 | 尾帧嘴状态 | 备注 |
|---|---|---|---|---|---|---|---|---|---|---|
| shot-1A | | | | | | | | | | |
| shot-1B | | | | | | | | | | |

### 对齐检查
- 台词字数与窗口长度是否匹配
- TTS 预估时长是否可落在窗口内
- 关键爆点是否保持完整

## C. shot 连续性字段
### shot-<ID> <semantic-name>
- shotPurpose：
- cameraSide：
- cameraHeight：
- cameraDistance：
- subjectFacing：
- screenDirection：
- eyelineTarget：
- axisRelation：
- cutReason：
- transitionType：
- startComposition：
- endComposition：
- anchorPlan：
  - start_frame_anchor：
  - end_frame_anchor：
  - action_peak_anchor：
  - emotion_peak_anchor：
  - prop_continuity_anchor：
- forbiddenDrift：

## D. 逐段分镜脚本
### shot-<ID> <semantic-name>
- 景别：
- 构图：
- 光线：
- 动作时间轴：
  1. `<时间段 + 动作>`
  2. `<时间段 + 动作>`
  3. `<时间段 + 动作>`
- 台词原文：
- 口型时间段：

## E. 跨段衔接表
### E1. 动作衔接
| 上一段 | 尾动作 | 下一段 | 首动作 | 备注 |
|---|---|---|---|---|
| shot-1A | | shot-1B | | |

### E2. 视线衔接
| 上一段 | 尾视线 | 下一段 | 首视线 | 备注 |
|---|---|---|---|---|
| shot-1A | | shot-1B | | |

### E3. 空间衔接
| 上一段 | 尾空间关系 | 下一段 | 首空间关系 | 备注 |
|---|---|---|---|---|
| shot-1A | | shot-1B | | |

### E4. 情绪衔接
| 上一段 | 尾情绪 | 下一段 | 首情绪 | 备注 |
|---|---|---|---|---|
| shot-1A | | shot-1B | | |
