# sk7-media-production：媒体生产与成片组装

## 1. 作用

把 sk4 产出的每段 `video-prompt.md` 变成实际的视频片段，并组装为可用的分镜成片。标准输出：

1. `04_keyframes-assets/<shot-id>/keyframe.<ext>`（每个 shot 的关键帧图）
2. `04_keyframes-assets/<shot-id>/segment.<ext>`（每个 shot 的视频片段）
3. `05_final-deliverables/film/full-film.mp4`（组装成片，或组装清单）
4. `05_final-deliverables/film/production-log.md`（生产日志：每段结果、重试记录、失败原因）

## 2. 不做的事

- 不绕过用户确认直接调用计费 API（见第 7 节授权规则）
- 不静默覆盖已生成的关键帧或片段
- 不在工具不可用时伪造"已生产"状态
- 不修改 sk3/sk4 的提示词产物（发现缺陷退回对应模块）

## 3. 前置条件

- sk4 已生成全部目标 shot 的 video-prompt.md
- 模型能力画像与 provider capability preflight 已建立
- 音频路线已知（决定片段是否需要原生音频、TTS 是否由本模块外置处理）
- sk6 的 SRT 与 TTS 清单已生成（组装时合入字幕与配音轨）

## 4. 能力路由（关键分支）

| 环境 | 行为 |
|---|---|
| 当前 Agent 具备图片生成 + 视频生成工具，且凭据 ready | 自动生产：按第 6 节流程逐 shot 执行 |
| 仅有图片生成工具 | 生成全部关键帧，视频片段转为平台操作清单（每段附 prompt + 关键帧 + 参数建议） |
| 均不具备 | 完整降级：产出"生产任务清单"——每 shot 一条可直接复制到目标平台的任务（prompt、关键帧要求、时长、比例），用户手动执行后把片段放回 `04_keyframes-assets/<shot-id>/segment.<ext>`，重跑本模块组装 |
| ffmpeg 可用 | 自动组装成片（scripts/assemble-video.py） |
| ffmpeg 不可用 | 产出组装顺序清单（片段路径 + 时长 + 转场说明），交给剪辑软件或 sk6 手册 |

降级产物必须在 production-log.md 中标注"未自动生产"，进度总览中标记 `⏳待生产`。

## 5. 单个 shot 的生产流程

1. 读取该 shot 的 video-prompt.md 与 keyframe-constraints.md
2. 生成关键帧图（text-to-image，prompt 取自 firstRealismPinch + 角色/场景段）
3. 关键帧自查：对照 keyframe-constraints 检查构图、角色锚点、画面比例；不达标重生成，最多 2 次
4. 生成视频片段（image-conditioned-video 优先，其次 text-to-video），时长按分镜时间轴
5. 片段自查：时长偏差 ≤ 1 秒、动作时间轴吻合、无致命画面崩坏；不达标按 fallbackPlan3 处理（局部修复优先于整段重抽）
6. 结果写入 production-log.md（成功 / 重试 / 失败原因）

## 6. 批量执行顺序

1. 先生产无台词的 shot（无口型风险，验证整体流程）
2. 再生产有台词 shot（按音频路线决定静音或原生）
3. 全部片段就绪后运行组装
4. 组装后对照 sk6 的 full-film-unified.srt 抽查时间轴对齐

## 7. 授权规则（硬性）

- **费用授权**：首次调用图片/视频 API 前，向用户报备"将生产 N 个 shot ≈ M 次生成调用"，获得确认后才开始；中途新增调用超出报备量 20% 时再次确认
- **覆盖授权**：重试覆盖自己刚生成的片段无需确认；覆盖用户手动放回的片段前必须列出对象并确认
- **停止条件**：同一 shot 连续失败 3 次 → 停止该 shot，记录失败原因，继续其余 shot；失败 shot 超过总量 1/3 → 暂停整批，向用户汇报后再继续

## 8. 组装

```bash
python scripts/assemble-video.py --segments-dir 04_keyframes-assets --out 05_final-deliverables/film/full-film.mp4
```

脚本行为：按 shot 编号顺序拼接片段；可选 `--srt` 合入字幕轨、`--audio` 合入配音轨；ffmpeg 缺失时退出码 2 并输出组装顺序清单。脚本不可用时人工按 production-log 中的顺序清单组装。

## 9. 成功判定

1. 每个目标 shot 有 keyframe 与 segment（或已在 production-log 标注降级）
2. production-log.md 完整记录每段结果
3. 成片已生成（或组装清单已给出），时间轴与 SRT 抽查一致
4. 进度总览中各 shot 状态已更新

## 10. 失败判定

片段与分镜时间轴严重不符 / 失败 shot 未记录就宣称完成 / 覆盖用户素材未确认 / 工具不可用却报告已生产。
