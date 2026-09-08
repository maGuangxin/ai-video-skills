#!/usr/bin/env python3
"""gen-srt.py — 从分镜表生成分段 SRT 与全片合并 SRT。

用法:
    python gen-srt.py <storyboard-script.md 或 .csv> [--out-dir 05_final-deliverables/subtitles]

输入格式（markdown 表格行或 CSV 行，二选一，自动识别）:
    | shot-01 | 0.0 | 3.5 | 台词内容 |
    shot-01,0.0,3.5,台词内容
列依次为: shotId, 起始秒, 结束秒, 台词。

输出:
    <out-dir>/sub-<shotId>.srt      每段一个
    <out-dir>/full-film-unified.srt 全片合并

退出码: 0 成功; 1 输入解析失败; 2 时间轴冲突（冲突明细输出到 stderr）
"""
import argparse
import csv
import io
import re
import sys
from pathlib import Path


def parse_seconds(text):
    try:
        return float(str(text).strip())
    except (TypeError, ValueError):
        return None


def fmt_time(seconds):
    ms_total = int(round(seconds * 1000))
    if ms_total < 0:
        ms_total = 0
    h, rem = divmod(ms_total, 3600000)
    m, rem = divmod(rem, 60000)
    s, ms = divmod(rem, 1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"


def parse_rows(path):
    rows = []
    for raw in Path(path).read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line:
            continue
        if line.startswith("|"):
            cells = [c.strip() for c in line.strip("|").split("|")]
            if all(re.fullmatch(r":?-{2,}:?", c) for c in cells if c):
                continue  # 分隔行
            if len(cells) < 4 or cells[0].lower().startswith(("shotid", "shot id", "#")):
                if not parse_seconds(cells[1] if len(cells) > 1 else ""):
                    continue  # 表头
            rows.append(cells[:4])
        else:
            reader = csv.reader(io.StringIO(line))
            cells = next(reader, [])
            if len(cells) >= 4:
                rows.append([c.strip() for c in cells[:4]])
    parsed = []
    for cells in rows:
        shot_id, start, end, text = cells[0], parse_seconds(cells[1]), parse_seconds(cells[2]), cells[3]
        if not shot_id or start is None or end is None:
            print(f"[PARSE] 无法解析行: {cells}", file=sys.stderr)
            sys.exit(1)
        if not text:
            print(f"[WARN] {shot_id} 无台词，跳过该段字幕", file=sys.stderr)
            continue
        parsed.append((shot_id, start, end, text))
    return parsed


def validate_timeline(parsed):
    conflict = 0
    for i, (shot_id, start, end, _) in enumerate(parsed):
        if end <= start:
            print(f"[CONFLICT] {shot_id}: 结束秒 {end} <= 起始秒 {start}", file=sys.stderr)
            conflict += 1
        if i > 0:
            prev_end = parsed[i - 1][2]
            if start < prev_end:
                print(f"[CONFLICT] {shot_id}: 起始秒 {start} 与上一段结束秒 {prev_end} 重叠", file=sys.stderr)
                conflict += 1
    if conflict:
        sys.exit(2)
    total = parsed[-1][2] if parsed else 0
    if total > 3600:
        print(f"[WARN] 总时长 {total/60:.0f} 分钟超过 1 小时，请确认", file=sys.stderr)


def write_srt(entries, out_path):
    blocks = []
    for idx, (start, end, text) in enumerate(entries, 1):
        blocks.append(f"{idx}\n{fmt_time(start)} --> {fmt_time(end)}\n{text}\n")
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text("\n".join(blocks), encoding="utf-8")


def main():
    ap = argparse.ArgumentParser(description="从分镜表生成 SRT 字幕")
    ap.add_argument("input", help="storyboard-script.md 或 CSV 文件")
    ap.add_argument("--out-dir", default="05_final-deliverables/subtitles", help="输出目录")
    args = ap.parse_args()

    parsed = parse_rows(args.input)
    if not parsed:
        print("[PARSE] 未解析到任何有效行", file=sys.stderr)
        sys.exit(1)
    validate_timeline(parsed)

    out_dir = Path(args.out_dir)
    for shot_id, start, end, text in parsed:
        write_srt([(start, end, text)], out_dir / f"sub-{shot_id}.srt")
        print(f"[OK] sub-{shot_id}.srt")
    write_srt([(s, e, t) for _, s, e, t in parsed], out_dir / "full-film-unified.srt")
    print(f"[OK] full-film-unified.srt ({len(parsed)} 段)")


if __name__ == "__main__":
    main()
