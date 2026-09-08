# Provider 配置指南

本套件不内置任何 API 调用，但角色参考图、关键帧与视频生成需要 provider 凭据就绪。本文件说明凭据的存放、验证、轮换与撤销。

## 1. 凭据存放位置（按使用环境二选一）

1. **环境变量**：如 `AGNES_API_KEY`。适合命令行 / CI 场景
2. **工具配置文件**：如 WorkBuddy 的 `~/.workbuddy/models.json` 中自定义模型提供商的 `apiKey` 字段。适合在对话工具内直接调用

凭据值只存放在上述位置，**不得**写入项目文档、分镜、提示词或任何会进入 git 的文件。

## 2. 验证方法

配置后执行最小验证（只读检查，不产生费用高的调用）：

```bash
python scripts/check_environment.py
```

输出三态：

- `ready`：凭据可发现，跳过配置引导直接进入功能
- `partial`：部分可发现，核心流程继续，受影响功能（参考图约束、关键帧）标注限制
- `needs_setup`：未发现凭据，只展示缺失项与配置步骤

脚本只报告"可发现 / 不可发现"，**永不输出凭据值**。

## 3. 轮换与撤销

1. **轮换**：在 provider 控制台生成新 key → 更新环境变量或配置文件 → 重跑 check_environment.py 确认 `ready` → 在控制台作废旧 key
2. **撤销**：直接在 provider 控制台删除 key；本项目无需额外清理（凭据不在任何项目文件内）
3. 凭据疑似泄漏时：先撤销，再轮换，顺序不可反

## 4. provider 能力验证结论的记录

对 identityConsistency、multiReferenceFusion 等能力，验证方式为小规模实测（同一角色多角度生成后人工比对稳定性）。验证结论记录到 project-base-config.md 的 provider capability preflight 表，标注验证日期；未验证的能力一律记 `unverified`，不得凭模型宣传页直接标 `supported`。
