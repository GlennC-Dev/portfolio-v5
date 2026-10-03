#!/usr/bin/env python3
"""
Barrel thumbnails for the Data Visualizations screenshots.

    python3 scripts/make-dataviz-thumbs.py      (needs: pip install pillow)

Reads every screenshot listed in src/data/dataviz.ts from public/project-photos/
and writes a 600x800 (3:4, the barrel's card shape) JPEG to
public/project-photos/thumbs/. Tall screenshots are cropped from the top
(the header and first charts); wide ones are shown whole on a dark card so
nothing is cut off. The full-size image is what the pop-up opens.

It also warns about screenshots on disk that have no entry in dataviz.ts and
entries whose file is missing, so a typo does not fail silently.
"""
import re, sys
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parent.parent
photos = root / "public" / "project-photos"
thumbs = photos / "thumbs"
data = (root / "src" / "data" / "dataviz.ts").read_text(encoding="utf-8")

W, H = 600, 800
BG = (30, 41, 59)

listed = re.findall(r"file:\s*'([^']+)'", data)
on_disk = sorted(p.name for p in photos.glob("projects_dataviz_*") if p.is_file())
thumbs.mkdir(parents=True, exist_ok=True)

for name in sorted(set(on_disk) - set(listed)):
    print(f"WARNING: {name} is in public/project-photos/ but has no entry in src/data/dataviz.ts")
missing = sorted(set(listed) - set(on_disk))
for name in missing:
    print(f"WARNING: dataviz.ts lists {name} but the file is not in public/project-photos/")

made = 0
for name in listed:
    src = photos / name
    if not src.exists():
        continue
    im = Image.open(src).convert("RGB")
    scale = W / im.width
    nh = max(1, round(im.height * scale))
    im = im.resize((W, nh), Image.LANCZOS)
    card = Image.new("RGB", (W, H), BG)
    if nh >= H:
        card.paste(im.crop((0, 0, W, H)), (0, 0))
    else:
        card.paste(im, (0, (H - nh) // 2))
    card.save(thumbs / (src.stem + ".jpeg"), "JPEG", quality=82, optimize=True)
    made += 1

print(f"{made} thumbnails written to {thumbs.relative_to(root)}")
sys.exit(1 if missing else 0)
