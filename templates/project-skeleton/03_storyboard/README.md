# 03_storyboard / 分镜脚本（永久保留，核心生产产物）

> 所有分镜、片段、提示词的唯一真实目录。
> **目录结构规则（来自 lib/naming-rules.yaml）：**
```
03_storyboard/
└── storyboard-<ID>-<SEMANTIC>/        分镜目录
    ├── storyboard-script.md            【3 件套 1：分镜脚本 + 四维对齐表
    ├── keyframe-constraints.md      【3 件套 2：首帧/尾帧/嘴状态
    └── shot-<ID>-<SEMANTIC>/         每段一个片段目录
        └── video-prompt.md          【3 件套 3：SK4 生成的中英双语提示词
```

## 说明
- 3 件套 1 + 2 每分镜各 1 份
- 3 件套 3 每片段 1 份（命名统一 video-prompt.md，因为上级 shot-XX 目录自带完整语义 ID 和内容，避免文件名冗余）
- 旧作废文件统一移动到 `../../99_temporary-workspace/archive-old-storyboards/`，不要放在本目录造成混乱
