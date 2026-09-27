"""Generate the PWA icons (a word with a highlighted pivot letter between two guide ticks)."""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

OUT = Path(__file__).resolve().parent.parent / "icons"
BG = (35, 91, 86)
FG = (247, 244, 238)
ACCENT = (255, 122, 77)


def font(size):
    for name in ("arialbd.ttf", "DejaVuSans-Bold.ttf", "Arial Bold.ttf"):
        try:
            return ImageFont.truetype(name, size)
        except OSError:
            continue
    return ImageFont.load_default()


def draw_icon(size, safe):
    """safe: fraction of the canvas the artwork may use (maskable icons need padding)."""
    img = Image.new("RGB", (size, size), BG)
    d = ImageDraw.Draw(img)
    cx, cy = size / 2, size / 2
    span = size * safe
    # Guide lines with a notch above and below the pivot.
    lw = max(2, round(size * 0.018))
    gy = span * 0.28
    d.line([(cx - span * 0.42, cy - gy), (cx + span * 0.42, cy - gy)], fill=FG, width=lw)
    d.line([(cx - span * 0.42, cy + gy), (cx + span * 0.42, cy + gy)], fill=FG, width=lw)
    d.line([(cx, cy - gy), (cx, cy - gy + span * 0.08)], fill=ACCENT, width=lw * 2)
    d.line([(cx, cy + gy), (cx, cy + gy - span * 0.08)], fill=ACCENT, width=lw * 2)
    # "read" with the pivot letter "e" centered.
    f = font(round(span * 0.3))
    left, pivot, right = "r", "e", "ad"
    pw = d.textlength(pivot, font=f)
    lw_ = d.textlength(left, font=f)
    x0 = cx - pw / 2 - lw_
    y = cy
    d.text((x0, y), left, font=f, fill=FG, anchor="lm")
    d.text((x0 + lw_, y), pivot, font=f, fill=ACCENT, anchor="lm")
    d.text((x0 + lw_ + pw, y), right, font=f, fill=FG, anchor="lm")
    return img


if __name__ == "__main__":
    OUT.mkdir(exist_ok=True)
    draw_icon(192, 0.9).save(OUT / "icon-192.png")
    draw_icon(512, 0.9).save(OUT / "icon-512.png")
    draw_icon(512, 0.7).save(OUT / "icon-maskable-512.png")
    print("icons written to", OUT)
