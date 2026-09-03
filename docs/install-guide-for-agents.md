# docs: install-guide-for-agents（主流 Agent 安装指南 · 双模式兼容）

> 本 Skill 包同时兼容：
> 1. 模式 A（主模式，90% 主流 Agent 支持）：manifest 注册模式
> 2. 模式 B（fallback 老 Agent 兼容）：纯子目录 fallback 模式
>
> 所有模式无需修改本包任何文件。

---

## 1. 前置准备：获取 Skill 包（3 种方式任选其一）

### 方式 1：Git Clone（推荐，用户个人 Git 管理）
> 前置：用户已经有本 Skill 包的独立 Git 仓库 URL：https://github.com/maGuangxin/ai-video-skills.git
```bash
# 在任意项目根目录执行，会在项目根下生成 ai-video-skills/
cd <你的任意项目根>
git clone https://github.com/maGuangxin/ai-video-skills.git ai-video-skills
```

### 方式 2：Git Submodule（大型团队项目模块化推荐）
```bash
cd <你的任意项目根>
git submodule add https://github.com/maGuangxin/ai-video-skills.git ai-video-skills
git commit -m "add ai-video-skills submodule v1.0.0"
```

### 方式 3：手动下载解压（不使用任何版本管理，纯离线）
在浏览器下载 ZIP 解压，把整个文件夹改名为 `ai-video-skills/` 放在项目根。

---

## 2. Trae Agent 安装教程（manifest 模式 · 推荐）

### Step 1：打开 Trae 项目，确保项目根目录下有 `ai-video-skills/`（上文 3 种方式之一获取）
### Step 2：让 Trae 读取 skills.manifest.yaml 注册
> Trae 支持在用户提问时主动读取 manifest 清单。
> 在你的项目 `.trae/skills/`（如果 Trae 有技能目录，按 Trae 官方规范路径放，不同 Agent 路径略有差别）建立软链接：
```bash
# macOS / Linux
ln -s "$(pwd)/ai-video-skills" ".trae/skills/ai-video-skills"
# Windows (PowerShell)
New-Item -ItemType SymbolicLink -Path ".trae\skills\ai-video-skills" -Target "$(Get-Location)\ai-video-skills"
```
> ⚠️ 如果你的 Agent 不支持软链接，直接把整个 `ai-video-skills/` 文件夹复制粘贴到 `.trae/skills/` 下即可（纯子目录 fallback 模式，下面 4. 会详解）
### Step 3：验证
在 Trae 里提问：「列出当前项目已加载的 Skills」，看 manifest 中的 8 粒 Skill（sk0 / sk0b / sk1 / sk2 / sk3 / sk4 / sk5 / sk6）有没有全部显示。如有，安装成功。

---

## 3. Cursor / Claude Desktop / Continue.dev 通用 Agent 安装教程（双模式都通用）

### 3.1 模式 A：manifest 注册模式（Agent 支持 YAML manifest 时优先）
把 `ai-video-skills/skills.manifest.yaml` 的全路径，加入你 Agent 的「自定义 Skill 清单路径」配置项里（具体配置项名看 Agent 文档：Continue.dev 叫 customSkills.paths / Claude Desktop 叫 skills 配置项 / Cursor 叫 custom skills），Agent 启动时会自动扫 manifest，注册 8 粒 Skill。

### 3.2 模式 B：纯子目录 fallback 模式（老 Agent 不支持 manifest 兼容性兜底）
直接把 `ai-video-skills/` 整个文件夹复制/软链到 Agent 默认加载 Skill 的根目录下即可，不需要任何注册配置。Agent 会扫描子目录里的 `SKILL.md` 作为入口自动识别：
- Agent 会看到 `ai-video-skills/skills/<id>/SKILL.md` 每粒 3 件套
- 手动告诉 Agent：「遇到 ai-video 视频生成相关任务，先从 ai-video-skills/skills/sk0_project_init_guided/SKILL.md 开始执行，按 SKILL.md 里要求走流程，8 粒 Skill 的入口 SKILL.md 都在 skills/*/SKILL.md」，Agent 就能正常跑完整流程，不需要 manifest 解析能力。

---

## 4. 纯子目录 fallback 模式的详细手动调用方法（100% 兼容任意 Agent，哪怕完全不支持 manifest）

如果你的 Agent 完全不支持任何 Skill manifest / Skill 扫描机制，只要能读 Markdown 文件，就可以用以下手动调用协议，保证流程可跑：
> 告诉 Agent 一句话指令：
```
执行视频生成任务时，按顺序读取这 8 份 SKILL.md 作为运行手册，严格执行每个 SKILL.md 里「执行步骤」：
1. ai-video-skills/skills/sk0_project_init_guided/SKILL.md
2. ai-video-skills/skills/sk0b_missing_field_guide/SKILL.md
3. ai-video-skills/skills/sk1_character_design/SKILL.md
4. ai-video-skills/skills/sk2_scene_design/SKILL.md
5. ai-video-skills/skills/sk3_storyboard_split/SKILL.md
6. ai-video-skills/skills/sk4_prompt_generator/SKILL.md
7. ai-video-skills/skills/sk5_consistency_audit/SKILL.md
8. ai-video-skills/skills/sk6_postproduction_bundle/SKILL.md
```
只要 Agent 能按顺序读 Markdown 就能跑完整流程，不需要任何插件/安装动作。

---

## 5. 验证安装是否成功（3 步 smoke test）

1. 确认文件数 ≥ 32 份：`find ai-video-skills -type f | wc -l`（macOS/Linux），如果得到数字 ≥ 32 份，说明文件齐全。
2. 在一个空项目根目录，把 `ai-video-skills/templates/project-skeleton/` 复制过去，变成你新项目的 `00_project-config` ~ `99_temporary-workspace` 7 层结构。
3. 让 Agent 跑 examples/quickstart-cafe-scene/walkthrough.md，走完 8 粒 Skill，看能不能输出完整的 P6 咖啡示例文档，如果能走完 = 安装成功，所有 applied 状态升级为 verified。
