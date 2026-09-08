# sk4-prompt-generator：提示词生成

## 1. 作用

基于分镜、角色和场景真相源生成每段 video-prompt.md，输出到 `03_storyboard/storyboard-<id>-<semantic>/shot-<id>-<semantic>/video-prompt.md`。

## 2. 不做的事

不调用视频生成服务；不重写前置步骤已确认的角色前缀；不自行修改分镜时间轴。

## 3. 前置条件

sk3 已完成；角色与场景真相源可读；sk0b 已确认关键字段齐全。前置产物不存在时暂停。

## 4. 必要输入

`03_storyboard/**/storyboard-script.md`、`01_character-design/docs/character-consistency-rules.md`、`00_project-config/unified-visual-spec.md`、`00_project-config/project-base-config.md`、`lib/style-presets.yaml`、`lib/cinematic-knowledge.yaml`、本目录 `outputs-template.md`。

## 5. 缺项处理

角色前缀 / 场景规范 / 动作时间轴 / 台词窗口 / 分镜连续性字段 / 模型能力画像缺失时暂停。统一输出：

```text
⚠️当前步骤已暂停：提示词生成所需的前置产物不完整。
请先补齐角色规则、场景规范、分镜时间轴和连续性字段，再继续执行 sk4-prompt-generator。
```

## 6. 提示词模式

按模型能力和生产模式选择结构：

1. `safe`：短 prompt、强角色锁定、强锚点、静音优先
2. `balanced`：加入 continuity block，可尝试短句口型
3. `expressive`：加入更丰富的镜头语言和中间锚点

每个 prompt 至少包含：`global_invariants`、`shot_semantic_block`、`continuity_block`、`motion_and_dialogue_block`、`forbidden_drift_block`。
负向词桶按风格激活，条数为建议下限而非精确值，平台差异由用户按需增删。

## 7. 执行步骤

1. 读取模型能力画像与推荐生产模式
2. 读取分镜时间轴与 shot 连续性字段
3. 从角色真相源逐字引用角色前缀
4. 从场景真相源引用场景与镜头依据
5. 按 safe/balanced/expressive 之一生成 video-prompt.md
6. 确保与前置分镜、角色、场景和音频路线一致

## 8. 跳步规则

入口为"已有提示词"时可跳过；一旦执行，不得用临时猜测内容替代前置真相源。

## 9. 成功判定

每个目标 shot 目录下生成了 video-prompt.md；角色前缀来自真相源；动作、台词、时间轴与 sk3 一致；prompt 模式与模型能力画像一致；含连续性约束和漂移限制。

## 10. 失败判定

关键前置文件缺失 / 内容与时间轴不一致 / 角色前缀被擅自改写 / 输出未生成 / 模式与模型能力不匹配。
