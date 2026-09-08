#!/usr/bin/env python3
"""validate-naming.py — 按 lib/naming-rules.yaml 校验目录与文件命名（只读）。

用法:
    python validate-naming.py [待校验目录，默认当前目录]

规则来源（单一来源）: ../lib/naming-rules.yaml
    - 禁止字符: < > : " / \\ | ? *
    - 版本号使用 v01/v02 两位数字
    - 禁止"最终/新版/真的不改了"式命名

退出码: 0 通过; 1 存在违规
"""
import re
import sys
from pathlib import Path

SKIP_DIRS = {".git", "node_modules", ".DS_Store", "__pycache__"}
BANNED_WORDS = ("最终", "新版", "真的不改", "定稿版", "最新")
VERSION_GOOD = re.compile(r"v\d{2,}$", re.IGNORECASE)
VERSION_BAD = re.compile(r"(最终|新版|真的不改|定稿|最新)", re.IGNORECASE)


def load_forbidden_chars():
    rules = Path(__file__).resolve().parent.parent / "lib" / "naming-rules.yaml"
    try:
        text = rules.read_text(encoding="utf-8")
        m = re.search(r"forbiddenCharacters:\s*['\"](.+?)['\"]", text)
        if m:
            chars = m.group(1)
            return "".join(re.findall(r"[^a-zA-Z\s]", chars)) or '<>:"/\\|?*'
    except OSError:
        pass
    return '<>:"/\\|?*'


def main():
    root = Path(sys.argv[1] if len(sys.argv) > 1 else ".").resolve()
    forbidden = load_forbidden_chars()
    violations = []

    for p in sorted(root.rglob("*")):
        if any(part in SKIP_DIRS or part.startswith(".git") for part in p.parts):
            continue
        name = p.name
        if name == ".DS_Store":
            continue
        if any(ch in name for ch in forbidden):
            violations.append(f"[非法字符] {p.relative_to(root)}")
        if VERSION_BAD.search(name):
            violations.append(f"[禁用版本词] {p.relative_to(root)}（应使用 v01/v02 数字版本号）")
        elif re.search(r"v\d{1}(?:\.|$)", name, re.IGNORECASE):
            violations.append(f"[版本号非两位] {p.relative_to(root)}（应使用 v01 而非 v1）")

    if violations:
        for v in violations:
            print(v)
        print(f"[FAIL] 共 {len(violations)} 处命名违规（规则来源: lib/naming-rules.yaml）")
        sys.exit(1)
    print("[OK] 命名校验通过")


if __name__ == "__main__":
    main()
