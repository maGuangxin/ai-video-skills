#!/usr/bin/env python3
"""check_environment.py — provider 凭据只读检查（不输出凭据值，不做任何修改）。

用法:
    python check_environment.py

检查顺序:
    1. 常见 provider 环境变量（AGNES_API_KEY / OPENAI_API_KEY / ...）
    2. ~/.workbuddy/models.json 中自定义模型提供商的 apiKey 字段

输出三态:
    ready        凭据可发现
    partial      部分可发现
    needs_setup  未发现任何凭据

退出码: 0 ready / 1 partial / 2 needs_setup
"""
import json
import os
import sys
from pathlib import Path

ENV_KEYS = (
    "AGNES_API_KEY",
    "OPENAI_API_KEY",
    "ANTHROPIC_API_KEY",
    "DOUBAO_API_KEY",
    "ARK_API_KEY",
    "VOLCENGINE_API_KEY",
    "JIMENG_API_KEY",
)


def check_env_vars():
    return [k for k in ENV_KEYS if os.environ.get(k, "").strip()]


def check_workbuddy_models():
    path = Path.home() / ".workbuddy" / "models.json"
    if not path.is_file():
        return []
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return []
    found = []
    # 兼容两种结构：顶层数组（每项为提供商对象）或 {providers: {...}} / 顶层字典
    items = data if isinstance(data, list) else (
        data.get("providers", {}).items() if isinstance(data.get("providers", None), dict)
        else (data.items() if isinstance(data, dict) else [])
    )
    for item in items:
        if isinstance(item, tuple):
            name, conf = item
            label = f"models.json:{name}"
        else:
            conf = item
            name = conf.get("name") or conf.get("id") or "unnamed"
            label = f"models.json:{name}"
        if isinstance(conf, dict) and str(conf.get("apiKey", "")).strip():
            found.append(label)
    return found


def main():
    sources = [f"env:{k}" for k in check_env_vars()] + check_workbuddy_models()
    if not sources:
        print("needs_setup")
        print("未发现 provider 凭据。配置方式二选一:")
        print("  1. 设置环境变量，如 AGNES_API_KEY")
        print("  2. 在 ~/.workbuddy/models.json 的自定义模型提供商 apiKey 字段中配置")
        print("详见 references/provider-setup-guide.md")
        sys.exit(2)
    for s in sources:
        print(f"[FOUND] {s} (值不回显)")
    if len(sources) >= 2:
        print("ready")
        sys.exit(0)
    print("partial")
    sys.exit(1)


if __name__ == "__main__":
    main()
