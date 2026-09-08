#!/usr/bin/env node
/**
 * ai-video-skills 跨平台安装器
 *
 * 遵循 Agent Skills 开放标准（agentskills.io）的目录约定，把 skills/ai-video-suite
 * 安装到目标 AI 工具的 Skill 目录。零依赖，仅 Node.js 16+ 标准库，兼容 macOS / Windows / Linux。
 *
 * 用法:
 *   node install.mjs                                  # 交互模式：自动探测当前项目/本机已装的 AI 工具
 *   node install.mjs --list                           # 列出支持的工具与探测结果
 *   node install.mjs --agent claude-code              # 安装到指定工具（项目级）
 *   node install.mjs --agent claude-code --scope user # 安装到指定工具（用户级/全局）
 *   node install.mjs --agent trae,cursor              # 同时安装到多个工具
 *   node install.mjs --path /任意/skills目录           # 安装到自定义目录
 *   node install.mjs --check                          # 检查各目标安装状态与版本
 *   node install.mjs --uninstall --agent claude-code --scope user   # 卸载（自动备份）
 *
 * 安全约定:
 *   - 只做文件复制/重命名，不联网、不执行 Skill 内容、不修改系统配置
 *   - 覆盖已有安装前自动备份到同级 ai-video-suite.backup-<时间戳>/，失败即中止
 *   - 卸载 = 重命名到 ai-video-suite.uninstalled-<时间戳>/，不直接删除
 */

import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";
import readline from "node:readline/promises";

const SKILL_NAME = "ai-video-suite";
const REPO_ROOT = path.dirname(fileURLToPath(import.meta.url));
const SKILL_SRC = path.join(REPO_ROOT, "skills", SKILL_NAME);

// ─── 工具注册表：目录约定均来自各工具官方文档（2026-09 核对） ───
const AGENTS = [
  {
    id: "claude-code", label: "Claude Code",
    projectDir: ".claude/skills", userDir: ".claude/skills",
    detectProject: [".claude"], detectUser: [".claude"],
    docs: "https://code.claude.com/docs/en/skills",
  },
  {
    id: "cursor", label: "Cursor",
    projectDir: ".cursor/skills", userDir: ".cursor/skills",
    detectProject: [".cursor"], detectUser: [".cursor"],
    docs: "https://cursor.com/docs",
  },
  {
    id: "codex", label: "OpenAI Codex CLI",
    projectDir: ".codex/skills", userDir: ".codex/skills",
    detectProject: [".codex"], detectUser: [".codex"],
    docs: "https://developers.openai.com/codex",
  },
  {
    id: "gemini-cli", label: "Gemini CLI",
    projectDir: ".gemini/skills", userDir: ".gemini/skills",
    detectProject: [".gemini"], detectUser: [".gemini"],
    docs: "https://github.com/google-gemini/gemini-cli",
  },
  {
    id: "copilot", label: "GitHub Copilot (VS Code)",
    projectDir: ".github/skills", userDir: null,
    detectProject: [".github"], detectUser: [],
    docs: "https://code.visualstudio.com/docs",
  },
  {
    id: "windsurf", label: "Windsurf",
    projectDir: ".windsurf/skills", userDir: ".codeium/windsurf/skills",
    detectProject: [".windsurf"], detectUser: [".codeium"],
    docs: "https://docs.codeium.com",
  },
  {
    id: "trae", label: "Trae",
    projectDir: ".trae/skills", userDir: null,
    detectProject: [".trae"], detectUser: [],
    docs: "https://docs.trae.ai",
  },
  {
    id: "workbuddy", label: "WorkBuddy",
    projectDir: ".workbuddy/skills", userDir: ".workbuddy/skills",
    detectProject: [".workbuddy"], detectUser: [".workbuddy"],
    docs: "https://www.workbuddy.cn/docs/workbuddy/Overview",
  },
  {
    id: "agents-standard", label: "通用标准目录（Agent Skills）",
    projectDir: ".agents/skills", userDir: null,
    detectProject: [".agents"], detectUser: [],
    docs: "https://agentskills.io",
  },
];

// ─── 参数解析 ───
function parseArgs(argv) {
  const flags = { agents: [], scope: null, path: null, list: false, check: false, uninstall: false, force: false, help: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--list") flags.list = true;
    else if (a === "--check") flags.check = true;
    else if (a === "--uninstall") flags.uninstall = true;
    else if (a === "--force") flags.force = true;
    else if (a === "--help" || a === "-h") flags.help = true;
    else if (a === "--agent") flags.agents = (argv[++i] || "").split(",").map((s) => s.trim()).filter(Boolean);
    else if (a === "--scope") flags.scope = argv[++i];
    else if (a === "--path") flags.path = argv[++i];
    else { console.error(`[ERROR] 未知参数: ${a}（--help 查看用法）`); process.exit(1); }
  }
  return flags;
}

function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, "-").replace("T", "_").slice(0, 19);
}

const exists = (p) => fs.existsSync(p);

function detect(agent) {
  const inProject = agent.detectProject.some((m) => exists(path.join(process.cwd(), m)));
  const inUser = agent.detectUser.some((m) => exists(path.join(os.homedir(), m)));
  return { inProject, inUser };
}

function skillVersionFrom(file) {
  try {
    const text = fs.readFileSync(file, "utf8");
    const m = text.match(/version:\s*"?([^"\n]+)"?/);
    return m ? m[1].trim() : null;
  } catch { return null; }
}

function sourceVersion() {
  return skillVersionFrom(path.join(SKILL_SRC, "SKILL.md")) || "unknown";
}

// ─── 目标解析：返回 [{ agent, scope, skillsDir, dest }] ───
function resolveTargets(flags) {
  const targets = [];
  const scope = flags.scope;
  if (scope && scope !== "project" && scope !== "user") {
    console.error(`[ERROR] --scope 只支持 project 或 user，收到: ${scope}`);
    process.exit(1);
  }
  if (flags.path) {
    if (flags.agents.length || scope) console.error("[WARN] --path 与 --agent/--scope 同时给出时，仅 --path 生效");
    targets.push({ agent: null, scope: "custom", skillsDir: path.resolve(flags.path), dest: path.resolve(flags.path, SKILL_NAME) });
    return targets;
  }
  const list = AGENTS.filter((a) => flags.agents.includes(a.id));
  const unknown = flags.agents.filter((id) => !AGENTS.some((a) => a.id === id));
  if (unknown.length) {
    console.error(`[ERROR] 不支持的工具: ${unknown.join(", ")}。可用: ${AGENTS.map((a) => a.id).join(", ")}`);
    process.exit(1);
  }
  for (const agent of list) {
    if (scope === "project" || scope === null) {
      if (!agent.projectDir) { console.error(`[ERROR] ${agent.id} 不支持项目级安装`); process.exit(1); }
      targets.push({ agent, scope: "project", skillsDir: path.resolve(process.cwd(), agent.projectDir), dest: path.resolve(process.cwd(), agent.projectDir, SKILL_NAME) });
    }
    if (scope === "user") {
      if (!agent.userDir) { console.error(`[ERROR] ${agent.id} 不支持用户级安装`); process.exit(1); }
      targets.push({ agent, scope: "user", skillsDir: path.join(os.homedir(), agent.userDir), dest: path.join(os.homedir(), agent.userDir, SKILL_NAME) });
    }
  }
  return targets;
}

// ─── 安装 / 卸载 / 检查 ───
function installTo(target, flags) {
  if (!exists(SKILL_SRC) || !exists(path.join(SKILL_SRC, "SKILL.md"))) {
    console.error(`[ERROR] 源目录不完整: ${SKILL_SRC}`);
    process.exit(1);
  }
  fs.mkdirSync(target.skillsDir, { recursive: true });
  if (exists(target.dest)) {
    const backup = path.join(target.skillsDir, `${SKILL_NAME}.backup-${timestamp()}`);
    console.log(`[BACKUP] 已有安装，备份到: ${backup}`);
    fs.renameSync(target.dest, backup);
  }
  try {
    fs.cpSync(SKILL_SRC, target.dest, { recursive: true });
  } catch (err) {
    console.error(`[ERROR] 复制失败，中止（已有内容已在备份中）: ${err.message}`);
    process.exit(1);
  }
  if (!exists(path.join(target.dest, "SKILL.md"))) {
    console.error(`[ERROR] 安装结果校验失败: ${target.dest}/SKILL.md 不存在`);
    process.exit(1);
  }
  const where = target.agent ? `${target.agent.label}（${target.scope === "user" ? "用户级" : "项目级"}）` : `自定义目录`;
  console.log(`[OK] 已安装到 ${where}: ${target.dest}`);
  console.log(`[OK] 版本 v${sourceVersion()}；如需回滚，恢复同级 backup 目录即可`);
}

function uninstallFrom(target) {
  if (!exists(target.dest)) {
    console.log(`[SKIP] 目标未安装: ${target.dest}`);
    return;
  }
  const backup = path.join(target.skillsDir, `${SKILL_NAME}.uninstalled-${timestamp()}`);
  fs.renameSync(target.dest, backup);
  console.log(`[OK] 已卸载并保留备份: ${backup}`);
}

function checkTarget(target) {
  const dest = target.dest;
  const label = target.agent
    ? `${target.agent.label}（${target.scope === "user" ? "用户级" : "项目级"}）`
    : "自定义目录";
  if (exists(path.join(dest, "SKILL.md"))) {
    const v = skillVersionFrom(path.join(dest, "SKILL.md"));
    console.log(`[OK] ${label}: 已安装 v${v ?? "?"} -> ${dest}`);
    return true;
  }
  return false;
}

// ─── 交互模式 ───
async function interactive() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  console.log(`\nai-video-skills 安装器（源版本 v${sourceVersion()}）\n`);
  console.log("探测到的 AI 工具：");
  const detected = [];
  AGENTS.forEach((a, i) => {
    const d = detect(a);
    const marks = [d.inProject && "项目目录", d.inUser && "用户配置"].filter(Boolean).join(" + ");
    console.log(`  ${i + 1}. ${a.label}${marks ? `  [探测到: ${marks}]` : ""}`);
    if (marks) detected.push(i);
  });
  const detectedHint = detected.length ? `（回车默认选择探测到的: ${detected.map((i) => i + 1).join(",")}）` : "";
  const answer = (await rl.question(`\n选择要安装到的工具编号（逗号分隔）${detectedHint}: `)).trim();
  const picks = (answer || detected.map((i) => i + 1).join(","))
    .split(/[,\s]+/).map((n) => parseInt(n, 10) - 1).filter((n) => n >= 0 && n < AGENTS.length);
  if (!picks.length) { console.error("[ERROR] 未选择任何工具"); rl.close(); process.exit(1); }
  const chosen = picks.map((i) => AGENTS[i]);
  const userCapable = chosen.filter((a) => a.userDir);
  let scope = "project";
  if (userCapable.length) {
    const s = (await rl.question(`安装层级: 1=项目级（回车默认） 2=用户级/全局 [仅 ${userCapable.map((a) => a.label).join("、")} 支持用户级]: `)).trim();
    if (s === "2") scope = "user";
  }
  console.log(`\n将安装 ${SKILL_NAME} v${sourceVersion()} 到:`);
  for (const a of chosen) {
    const dir = scope === "user" ? a.userDir : a.projectDir;
    if (dir) console.log(`  - ${a.label}: ${scope === "user" ? path.join(os.homedir(), dir) : path.resolve(process.cwd(), dir)}${a.userDir && scope === "project" ? "" : ""}`);
  }
  const go = (await rl.question("确认执行? (y/N): ")).trim().toLowerCase();
  rl.close();
  if (go !== "y" && go !== "yes") { console.log("已取消"); process.exit(0); }
  return { agents: chosen.map((a) => a.id), scope };
}

// ─── 主流程 ───
function printHelp() {
  console.log(`ai-video-skills 安装器

用法:
  node install.mjs                                交互模式（自动探测 + 菜单选择）
  node install.mjs --list                         列出支持的工具与探测结果
  node install.mjs --agent <id[,id2...]>          指定工具（默认项目级）
  node install.mjs --agent <id> --scope user      指定工具 + 用户级
  node install.mjs --path <skills目录>            安装到自定义目录
  node install.mjs --check [--agent <id>]         检查安装状态与版本
  node install.mjs --uninstall --agent <id> --scope <project|user>   卸载（自动备份）

支持的工具: ${AGENTS.map((a) => a.id).join(", ")}

安全: 覆盖前自动备份；不联网；不执行 Skill 内容；卸载保留备份目录。`);
}

async function main() {
  const flags = parseArgs(process.argv.slice(2));
  if (flags.help) { printHelp(); return; }

  if (flags.list) {
    console.log(`\n支持的工具（源版本 v${sourceVersion()}）:\n`);
    for (const a of AGENTS) {
      const d = detect(a);
      console.log(`${a.label}  [${a.id}]`);
      console.log(`  项目级: ${a.projectDir ? path.resolve(process.cwd(), a.projectDir) : "不支持"}${d.inProject ? "  <- 探测到项目标记" : ""}`);
      console.log(`  用户级: ${a.userDir ? path.join(os.homedir(), a.userDir) : "不支持"}${d.inUser ? "  <- 探测到用户配置" : ""}`);
      console.log(`  文档: ${a.docs}\n`);
    }
    return;
  }

  if (flags.check) {
    let targets;
    if (flags.path) {
      targets = [{ agent: null, scope: "custom", skillsDir: path.resolve(flags.path), dest: path.resolve(flags.path, SKILL_NAME) }];
    } else if (flags.agents.length) {
      targets = resolveTargets({ ...flags, scope: null, path: null });
      targets.push(...resolveTargets({ ...flags, scope: "user", path: null }));
    } else {
      targets = [];
      for (const a of AGENTS) {
        if (a.projectDir) targets.push({ agent: a, scope: "project", dest: path.resolve(process.cwd(), a.projectDir, SKILL_NAME) });
        if (a.userDir) targets.push({ agent: a, scope: "user", dest: path.join(os.homedir(), a.userDir, SKILL_NAME) });
      }
    }
    let any = false;
    for (const t of targets) any = checkTarget(t) || any;
    if (!any) console.log("[MISSING] 所有目标均未安装");
    return;
  }

  let effective = flags;
  if (!flags.agents.length && !flags.path && process.stdin.isTTY) {
    const picked = await interactive();
    effective = { ...flags, agents: picked.agents, scope: picked.scope };
  } else if (!flags.agents.length && !flags.path) {
    console.error("[ERROR] 非交互环境需指定 --agent <id> 或 --path <目录>（--list 查看可选工具）");
    process.exit(1);
  }

  const targets = resolveTargets(effective);
  if (flags.uninstall) {
    for (const t of targets) uninstallFrom(t);
    return;
  }
  for (const t of targets) installTo(t, flags);
  console.log(`\n[DONE] 完成。接入验证见 skills/${SKILL_NAME}/references/install-guide.md`);
}

main().catch((err) => { console.error(`[ERROR] ${err.message}`); process.exit(1); });
