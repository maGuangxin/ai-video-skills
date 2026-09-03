# SKILL: sk3_storyboard_split（分镜拆分 & 四维对齐·智能分段）

## 一、职责边界
**做什么**：
1. **单段剧情入口**（SK0 Q1选④）：直接跳过拆分，输出 1 段单段 10s 3 件套
2. **多段剧情入口**（Q1选①②③⑤）：按 4 原则拆分成 N 段×`singleShotMaxSeconds`（豆包 10s 默认）
3. 每段输出 3 件套：分镜脚本.md / keyframe-constraints.md 首尾帧约束 / shot-XX-xxx 空子目录（给 SK4 填视频提示词）
4. 每段生成 **四维对齐表（Video 时长 / Action 动作时间戳 / Lip 嘴型窗口 / TTS 耗时校验）**
5. 跨段生成 **首尾帧嘴状态衔接表**，防止切镜头之间嘴型跳变

**拆分 4 原则（优先级从高到低，任何原则违反都禁止切分）**：
1. **爆点中间不切**（核心爆点 `mustNotSplitInMiddle = true`）
2. **单句台词中间不切**（台词窗口不跨段截断，每句台词完整独占 1 段 8s 窗口）
3. **只在自然动作断点切**（人物转身/走路结束/门关好/画面黑场等）
4. **长台词独占整段窗口**（>24字台词单独 1 段，不塞动作）

**不做什么**：
- 不写提示词全文（交给 SK4）
- 不画图，只写首尾帧精确描述+嘴状态

## 二、输入输出
### 输入
- `project-base-config.md: keyBeats + singleShotMaxSeconds + voiceoverMode`
- SK1 的 `character-consistency-rules.md`（身高差/比例信息）
- SK2 的 `scene-xxx-full-design.md`（家具锚点）
### 输出
| 输出文件 | 路径模板 |
|---|---|
| 每分镜 1 份分镜脚本（含四维对齐表）| `03_storyboard/storyboard-<ID>-<SEMANTIC>/storyboard-script.md` |
| 每分镜 1 份首尾帧约束 | `03_storyboard/storyboard-<ID>-<SEMANTIC>/keyframe-constraints.md` |
| 每段空 shot 目录 | `03_storyboard/storyboard-<ID>/shot-<ID>-<SEMANTIC>/`（空目录给 SK4）|

## 三、核心公式
- 单段台词字数硬上限 = 嘴型窗口秒数 × 4.0 字/秒
  - 豆包端 10s 默认 = 8s 嘴型窗口 × 4 = **32 字硬上限**
- TTS 预估时长秒数 = 中文字符数 ÷ 4.0 字/秒
- 如果字数超上限：**拆台词成两句 / 砍冗余词**，绝对不允许超 32 字塞一段

## 四、串并行
- **前置强制串行**：SK1 角色 + SK2 场景必须都完了（比例锚点才能写入拆分镜）
- **与 SK6 字幕模板可并行**：SK6 字幕只依赖拆分镜时间轴，不依赖提示词

## 五、执行步骤
1. 判断入口类型是单段剧情还是多段剧情
2. 多段：按 4 原则切分，每段时长 ≤ singleShotMaxSeconds
3. 每段生成动作时间轴，附秒数
4. 每段套用台词 32 字公式，超了就拆
5. 填充四维对齐表 + 首尾帧嘴状态衔接表
6. 建立分镜目录 + 每段空子目录
