#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PACKAGE_ROOT="$SCRIPT_DIR"
DEFAULT_PROJECT_ROOT="$(cd "$PACKAGE_ROOT/.." && pwd)"
PROJECT_ROOT="${PROJECT_ROOT:-$DEFAULT_PROJECT_ROOT}"
TRAE_DIR="$PROJECT_ROOT/.trae"

usage() {
  cat <<'EOF'
Usage:
  ./ai-video-skills/apply-trae.sh init
  ./ai-video-skills/apply-trae.sh apply
  ./ai-video-skills/apply-trae.sh check
  ./ai-video-skills/apply-trae.sh all

Optional:
  PROJECT_ROOT=/absolute/project/root ./ai-video-skills/apply-trae.sh apply
EOF
}

ensure_project_root() {
  if [[ ! -d "$PROJECT_ROOT" ]]; then
    echo "❌ PROJECT_ROOT 不存在: $PROJECT_ROOT" >&2
    exit 1
  fi
}

init_whoiam() {
  ensure_project_root
  mkdir -p "$TRAE_DIR"
  if [[ -f "$TRAE_DIR/whoIam.md" ]]; then
    echo "ℹ️ 已存在: $TRAE_DIR/whoIam.md"
    return 0
  fi

  local username project_name
  read -r -p "username: " username
  read -r -p "projectName: " project_name

  cat > "$TRAE_DIR/whoIam.md" <<EOF
# whoIam

- username: ${username}
- projectName: ${project_name}
- aiDocPackage: ai-video-skills
EOF

  echo "✅ 已生成: $TRAE_DIR/whoIam.md"
}

apply_files() {
  ensure_project_root
  mkdir -p "$TRAE_DIR/skills" "$TRAE_DIR/rules"
  rm -rf "$TRAE_DIR/skills"
  rm -rf "$TRAE_DIR/rules"
  mkdir -p "$TRAE_DIR/skills" "$TRAE_DIR/rules"
  cp -R "$PACKAGE_ROOT/skills/." "$TRAE_DIR/skills/"
  cp -R "$PACKAGE_ROOT/rules/." "$TRAE_DIR/rules/"
  cp "$PACKAGE_ROOT/skills.manifest.yaml" "$TRAE_DIR/skills.manifest.yaml"
  echo "✅ 已同步 skills -> $TRAE_DIR/skills"
  echo "✅ 已同步 rules -> $TRAE_DIR/rules"
  echo "✅ 已同步 manifest -> $TRAE_DIR/skills.manifest.yaml"
}

check_files() {
  ensure_project_root
  local missing=0

  if [[ -d "$TRAE_DIR" ]]; then
    echo "✅ .trae: $TRAE_DIR"
  else
    echo "❌ 缺少目录: $TRAE_DIR"
    missing=1
  fi

  if [[ -f "$TRAE_DIR/whoIam.md" ]]; then
    echo "✅ whoIam.md"
  else
    echo "⚠️ 缺少: $TRAE_DIR/whoIam.md"
    missing=1
  fi

  if [[ -d "$TRAE_DIR/skills" ]]; then
    echo "✅ skills/"
  else
    echo "❌ 缺少: $TRAE_DIR/skills"
    missing=1
  fi

  if [[ -d "$TRAE_DIR/rules" ]]; then
    echo "✅ rules/"
  else
    echo "❌ 缺少: $TRAE_DIR/rules"
    missing=1
  fi

  if [[ -f "$TRAE_DIR/skills.manifest.yaml" ]]; then
    echo "✅ skills.manifest.yaml"
  else
    echo "⚠️ 缺少: $TRAE_DIR/skills.manifest.yaml"
    missing=1
  fi

  if [[ "$missing" -eq 0 ]]; then
    echo "✅ check 通过"
  else
    echo "⚠️ check 未通过，请先执行 init/apply"
    return 1
  fi
}

cmd="${1:-}"
case "$cmd" in
  init)
    init_whoiam
    ;;
  apply)
    apply_files
    ;;
  check)
    check_files
    ;;
  all)
    init_whoiam
    apply_files
    check_files
    ;;
  *)
    usage
    exit 1
    ;;
esac
