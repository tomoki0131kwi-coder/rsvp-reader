"""Generate the PWA icons: two speech bubbles, 「英」 and "A" (Japanese <-> English), on the app's teal."""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

OUT = Path(__file__).resolve().parent.parent / "icons"
BG = (35, 91, 86)
CREAM = (247, 244, 238)
ACCENT = (255, 122, 77)
SS = 4  # draw large and scale down for smooth edges


def font(names, size):
    for name in names:
        try:
            return ImageFont.truetype(name, size)
        except OSError:
            continue
    return ImageFont.load_default()


def bubble(d, box, radius, tail, fill):
    """Rounded speech bubble; tail = three points of the little triangle."""
    d.rounded_rectangle(box, radius=radius, fill=fill)
    d.polygon(tail, fill=fill)


def draw_icon(size, safe):
    """safe: fraction of the canvas the artwork may use (maskable icons need more padding)."""
    S = size * SS
    img = Image.new("RGB", (S, S), BG)
    d = ImageDraw.Draw(img)
    span = S * safe
    ox = oy = (S - span) / 2  # top-left of the artwork area
    u = span / 100  # artwork units: 100 x 100

    # Big cream bubble with 「英」 (upper left), tail at bottom left.
    bx0, by0, bx1, by1 = ox + 6 * u, oy + 10 * u, ox + 70 * u, oy + 66 * u
    bubble(d, (bx0, by0, bx1, by1), 14 * u,
           [(bx0 + 14 * u, by1 - 2 * u), (bx0 + 30 * u, by1 - 2 * u), (bx0 + 10 * u, by1 + 14 * u)], CREAM)
    kanji = font(["YuGothB.ttc", "meiryob.ttc", "msgothic.ttc"], round(40 * u))
    d.text(((bx0 + bx1) / 2, (by0 + by1) / 2 + 1 * u), "英", font=kanji, fill=BG, anchor="mm")

    # Small orange bubble with "A" (lower right), outlined in teal so it sits on top of the big one.
    sx0, sy0, sx1, sy1 = ox + 50 * u, oy + 46 * u, ox + 94 * u, oy + 84 * u
    ring = 3.5 * u
    tail = [(sx1 - 22 * u, sy1 - 2 * u), (sx1 - 8 * u, sy1 - 2 * u), (sx1 - 4 * u, sy1 + 12 * u)]
    bubble(d, (sx0 - ring, sy0 - ring, sx1 + ring, sy1 + ring), 12 * u + ring,
           [(x, y + ring * (1 if k == 2 else 0)) for k, (x, y) in enumerate(tail)], BG)
    bubble(d, (sx0, sy0, sx1, sy1), 12 * u, tail, ACCENT)
    latin = font(["arialbd.ttf", "DejaVuSans-Bold.ttf"], round(28 * u))
    d.text(((sx0 + sx1) / 2, (sy0 + sy1) / 2 + 1 * u), "A", font=latin, fill=CREAM, anchor="mm")

    return img.resize((size, size), Image.LANCZOS)


if __name__ == "__main__":
    OUT.mkdir(exist_ok=True)
    draw_icon(192, 0.86).save(OUT / "icon-192.png")
    draw_icon(512, 0.86).save(OUT / "icon-512.png")
    draw_icon(512, 0.66).save(OUT / "icon-maskable-512.png")
    print("icons written to", OUT)
