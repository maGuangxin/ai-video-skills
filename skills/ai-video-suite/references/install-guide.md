# 安装与接入指南

本套件是单一自包含 Skill（`skills/ai-video-suite/`），兼容 Agent Skills 开放标准（agentskills.io）：入口为带 frontmatter 的 SKILL.md，内部 references / lib / schemas / templates / scripts 全部随目录安装，无外部依赖路径。

## 方式一：安装器（推荐，跨 macOS / Windows / Linux）

在仓库根目录执行（需要 Node.js 16+，零依赖）：

```bash
node install.mjs                # 自动探测当前项目已装的 AI 工具，交互选择安装
node install.mjs --list         # 只列出可探测的工具与其 Skill 目录
node install.mjs --agent claude-code --scope user   # 指定工具与层级，非交互
node install.mjs --check        # 检查各目标是否已安装及版本
node install.mjs --uninstall --agent claude-code --scope user   # 卸载（先备份）
node install.mjs --path /自定义/skills目录            # 安装到任意自定义目录
```

安装器行为约定：

1. 覆盖已有安装前自动备份到同级 `ai-video-suite.backup-<时间戳>/`，失败即中止，不静默销毁
2. 只做文件复制，不联网、不执行任何 Skill 内容、不改系统配置
3. 自动探测基于目录标记（如 `.claude/`、`.cursor/`、`.trae/`、`.workbuddy/` 等），探测不到时列出全部支持的工具供选择

## 方式二：手动复制

把 `skills/ai-video-suite/` 整个目录复制到目标工具的 Skill 目录即可：

| 工具 | 用户级（全局） | 项目级 |
|---|---|---|
| Claude Code | `~/.claude/skills/` | `.claude/skills/` |
| Cursor | `~/.cursor/skills/` | `.cursor/skills/` |
| Codex CLI | `~/.codex/skills/` | `.codex/skills/` |
| Gemini CLI | `~/.gemini/skills/` | `.gemini/skills/` |
| GitHub Copilot | — | `.github/skills/` |
| Windsurf | `~/.codeium/windsurf/skills/` | `.windsurf/skills/` |
| Trae | — | `.trae/skills/` |
| WorkBuddy | `~/.workbuddy/skills/` | `.workbuddy/skills/` |
| 通用标准目录 | — | `.agents/skills/` |

Windows 下用户级目录形如 `C:\Users\<用户名>\.claude\skills\`。

## 方式三：Git Clone（便于更新）

```bash
git clone https://github.com/maGuangxin/ai-video-skills.git ~/.claude/skills/ai-video-src
# 然后把 ~/.claude/skills/ai-video-src/skills/ai-video-suite 复制或链接到 ~/.claude/skills/ai-video-suite
```

## 方式四：豆包电脑版（GUI 上传，无目录约定）

豆包不走文件系统目录，而是图形界面上传 Skill 目录或 zip 包：

1. 在豆包电脑版侧边栏进入「技能·连接器·伙伴」→「我的技能」
2. 点右上角「新建 — 上传技能」
3. 把本仓库的 `skills/ai-video-suite/` 目录（或它的 zip 压缩包）拖入即可

注意：

- 若弹出的是「替换」而不是「新建」，说明装过同名旧版——先到「我的技能」里删掉旧版再上传，否则旧版不报错地覆盖不掉
- 上传后在对话框输入 `/` 选中该技能，本轮对话才会携带它
- 豆包端对文件系统访问有权限弹窗，首次运行时按需允许

## 接入后验证

1. 对应工具的 Skill 列表中出现 `ai-video-suite`
2. 说"帮我做一个 AI 短视频"能触发入口路由
3. 按 `references/walkthrough-cafe-scene.md` 跑一次单段 smoke test

安装问题排查顺序：`node install.mjs --list` → 目标工具官方 Skill 文档 → 本文件方式二手动复制。
