"""Turn your own scanned book PDF into a compact "book pack" the app can import on the phone.

The pack holds each page as a lighter JPEG plus the page's OCR text (for the in-app full-text search).
It is for private use on your own device: keep it out of anything you publish.

Usage:  python tools/book_pack.py "C:/path/to/book.pdf" [out.rsvpbook] [--width 1100] [--quality 60]

Format: b"RSVPBK01" | uint32 LE header length | header JSON (UTF-8) | page JPEGs back to back.
Header: {"title", "pages": [[offset, length], ...] (offsets from the end of the header), "text": [page text, ...]}
"""
import io
import json
import re
import struct
import sys
from concurrent.futures import ProcessPoolExecutor
from pathlib import Path

from PIL import Image
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parent.parent
_reader = None


def _init(path):
    global _reader
    _reader = PdfReader(path)


def _page(args):
    i, width, quality = args
    page = _reader.pages[i]
    text = re.sub(r"[ \t\u3000]+", " ", page.extract_text() or "").strip()
    imgs = page.images
    if not imgs:
        return i, b"", text
    im = max(imgs, key=lambda x: x.image.size[0] * x.image.size[1]).image.convert("RGB")
    im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
    # Whiten the paper and hide show-through from the back of the page; also compresses better.
    lo, hi = 25, 225
    im = im.point(lambda v: 0 if v <= lo else 255 if v >= hi else round((v - lo) * 255 / (hi - lo)))
    buf = io.BytesIO()
    im.save(buf, "JPEG", quality=quality, optimize=True, progressive=True)
    return i, buf.getvalue(), text


def detect_page_numbers(texts):
    """Printed page number of each scanned page, read from the OCR text at the bottom of the page.

    Scans can drop pages (e.g. the scanner's blank-page removal), so the book's numbering drifts away from
    the PDF's page order. Walk the pages in order and accept a printed number only if it continues the
    sequence (allowing a few skipped pages); OCR noise like "07" for 97 is matched on the last two digits.
    """
    def printed(text):
        # The page number is the last line; ignore numbers elsewhere (e.g. "see p.124").
        last = re.sub(r"[０-９]", lambda m: str(ord(m.group(0)) - 0xFF10), text.strip().split("\n")[-1] if text.strip() else "")
        m = re.fullmatch(r"\D{0,4}(\d{1,3})\D{0,4}", last.strip())
        return int(m.group(1)) if m else None

    seen = [printed(t) for t in texts]
    numbers, expected = [], 1
    for i, p in enumerate(seen):
        nxt = seen[i + 1] if i + 1 < len(seen) else None
        if p == expected:
            page = p
        elif p is not None and expected < p <= expected + 3 and (nxt is None or nxt == p + 1):
            page = p  # pages missing from the scan: confirmed by the next page continuing the sequence
        else:
            page = expected
        numbers.append(page)
        expected = page + 1
    return numbers


def renumber(pack):
    """Add page numbers to an existing pack (rewrites the header only)."""
    with open(pack, "rb") as f:
        assert f.read(8) == b"RSVPBK01"
        (n,) = struct.unpack("<I", f.read(4))
        header = json.loads(f.read(n))
        data = f.read()
    header["pageNo"] = detect_page_numbers(header["text"])
    have = set(header["pageNo"])
    header["missing"] = [p for p in range(1, max(have) + 1) if p not in have]
    raw = json.dumps(header, ensure_ascii=False).encode("utf-8")
    with open(pack, "wb") as f:
        f.write(b"RSVPBK01" + struct.pack("<I", len(raw)) + raw + data)
    return header


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    opts = dict(zip(sys.argv[1::1], sys.argv[2::1]))
    width = int(opts.get("--width", 1100))
    quality = int(opts.get("--quality", 60))
    src = Path(args[0])
    out = Path(args[1]) if len(args) > 1 else ROOT / "tools" / ".cache" / "book.rsvpbook"
    n = len(PdfReader(str(src)).pages)
    print(f"{src.name}: {n} pages -> {out}")
    results = [None] * n
    with ProcessPoolExecutor(initializer=_init, initargs=(str(src),)) as pool:
        for k, (i, jpg, text) in enumerate(pool.map(_page, [(i, width, quality) for i in range(n)], chunksize=4), 1):
            results[i] = (jpg, text)
            if k % 50 == 0:
                print(f"  {k}/{n}")
    pages, offset = [], 0
    for jpg, _ in results:
        pages.append([offset, len(jpg)])
        offset += len(jpg)
    texts = [t for _, t in results]
    numbers = detect_page_numbers(texts)
    missing = [p for p in range(1, max(numbers) + 1) if p not in set(numbers)]
    if missing:
        print(f"printed page numbers missing from the scan (check the paper book): {missing}")
    header = json.dumps({"title": src.stem, "pages": pages, "text": texts, "pageNo": numbers, "missing": missing}, ensure_ascii=False).encode("utf-8")
    out.parent.mkdir(parents=True, exist_ok=True)
    with open(out, "wb") as f:
        f.write(b"RSVPBK01")
        f.write(struct.pack("<I", len(header)))
        f.write(header)
        for jpg, _ in results:
            f.write(jpg)
    print(f"done: {out.stat().st_size / 1e6:.0f} MB ({offset / n / 1024:.0f} KB/page, text {len(header) / 1e6:.1f} MB)")


if __name__ == "__main__":
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    if "--renumber" in sys.argv:
        h = renumber(Path([a for a in sys.argv[1:] if not a.startswith("--")][0]))
        print(f"missing printed pages: {h['missing']}")
    else:
        main()
