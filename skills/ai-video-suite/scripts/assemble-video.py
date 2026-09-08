#!/usr/bin/env python3
"""assemble-video.py — 按 shot 顺序拼接视频片段为成片（依赖本机 ffmpeg）。

用法:
    python assemble-video.py --segments-dir 04_keyframes-assets --out full-film.mp4
    python assemble-video.py ... --srt subtitles/full-film-unified.srt   # 合入字幕轨
    python assemble-video.py ... --audio tts/voiceover-full.wav          # 合入配音轨

行为:
    1. 扫描 segments-dir 下 */segment.* （支持 mp4/mov/webm），按 shot 编号自然排序
    2. 校验时长并生成拼接清单；ffmpeg 缺失或片段缺失时打印组装顺序清单并以对应退出码退出
    3. 使用 concat demuxer 拼接；可选软字幕与音轨合入

退出码: 0 成功 / 1 参数或环境错误 / 2 ffmpeg 缺失 / 3 片段缺失
"""
import argparse
import json
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

VIDEO_EXTS = (".mp4", ".mov", ".webm")


def find_segments(segments_dir: Path):
    """返回按 shot 编号自然排序的 (shot_id, path) 列表。"""
    found = []
    for d in sorted(segments_dir.iterdir()):
        if not d.is_dir():
            continue
        for ext in VIDEO_EXTS:
            seg = d / f"segment{ext}"
            if seg.is_file():
                found.append((d.name, seg))
                break
    def sort_key(item):
        m = re.search(r"(\d+)", item[0])
        return (int(m.group(1)) if m else 10**9, item[0])
    return sorted(found, key=sort_key)


def probe_duration(path: Path):
    """用 ffprobe 取时长（秒）；失败返回 None。"""
    try:
        out = subprocess.run(
            ["ffprobe", "-v", "quiet", "-print_format", "json", "-show_format", str(path)],
            capture_output=True, text=True, check=True,
        ).stdout
        return float(json.loads(out)["format"]["duration"])
    except Exception:
        return None


def main():
    ap = argparse.ArgumentParser(description="按 shot 顺序拼接分镜片段")
    ap.add_argument("--segments-dir", required=True, help="04_keyframes-assets 目录")
    ap.add_argument("--out", required=True, help="输出成片路径")
    ap.add_argument("--srt", help="可选：合入的 SRT 字幕文件")
    ap.add_argument("--audio", help="可选：合入的配音音轨文件")
    args = ap.parse_args()

    segments_dir = Path(args.segments_dir)
    out_path = Path(args.out)
    if not segments_dir.is_dir():
        print(f"[ERROR] 片段目录不存在: {segments_dir}")
        sys.exit(1)

    segments = find_segments(segments_dir)
    if not segments:
        print(f"[ERROR] {segments_dir} 下未找到任何 */segment.* 片段")
        sys.exit(3)

    have_ffmpeg = shutil.which("ffmpeg") is not None
    print(f"[INFO] 共发现 {len(segments)} 个片段:")
    for shot_id, seg in segments:
        dur = probe_duration(seg) if have_ffmpeg else None
        print(f"  - {shot_id}: {seg.name}" + (f" ({dur:.1f}s)" if dur else ""))

    if not have_ffmpeg:
        print("\n[WARN] 未检测到 ffmpeg，无法自动组装。请按以下顺序在剪辑软件中拼接:")
        for i, (shot_id, seg) in enumerate(segments, 1):
            print(f"  {i}. {seg}")
        sys.exit(2)

    out_path.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile("w", suffix=".txt", delete=False, encoding="utf-8") as f:
        list_file = Path(f.name)
        for _, seg in segments:
            f.write(f"file '{seg.resolve().as_posix()}'\n")

    cmd = ["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(list_file)]
    if args.audio:
        cmd += ["-i", args.audio, "-map", "0:v:0", "-map", "1:a:0"]
    else:
        cmd += ["-map", "0"]
    if args.srt:
        srt = Path(args.srt).resolve().as_posix()
        # 字幕滤镜需要重编码视频
        cmd += ["-vf", f"subtitles='{srt}'", "-c:v", "libx264", "-crf", "18", "-preset", "fast"]
    else:
        cmd += ["-c:v", "copy"]
    if args.audio:
        cmd += ["-c:a", "aac", "-b:a", "192k", "-shortest"]
    elif args.srt:
        cmd += ["-c:a", "copy"]
    cmd += [str(out_path)]

    print(f"[INFO] 组装中 -> {out_path}")
    result = subprocess.run(cmd, capture_output=True, text=True)
    list_file.unlink(missing_ok=True)
    if result.returncode != 0:
        print(f"[ERROR] ffmpeg 失败:\n{result.stderr[-1500:]}")
        sys.exit(1)

    dur = probe_duration(out_path)
    print(f"[OK] 成片已生成: {out_path}" + (f"（{dur:.1f}s）" if dur else ""))
    print("[OK] 建议抽查时间轴是否与 full-film-unified.srt 对齐")


if __name__ == "__main__":
    main()
