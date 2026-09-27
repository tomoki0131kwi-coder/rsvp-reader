"""Build the bundled data for the RSVP reader.

Downloads (politely, with delays) and writes:
  data/library.json      bundled books (Gutenberg, Global Storybooks, VOA) with word counts and levels
  data/credits.json      per-story attribution for the Storybooks and VOA collections
  data/books/<id>.txt    book texts (Gutenberg header/footer removed; "# Title" lines mark stories)
  data/pron/<x>.txt      pronunciations (CMUdict converted to Japanese-dictionary IPA style)
  data/wordlists.json    word decks (Basic 850 / core 2000) by corpus frequency, with example sentences
  data/catalog.tsv       compact catalog of all English Gutenberg texts (for search)
  data/dict/<x>.txt      EJDict English-Japanese dictionary (CC0), split by letter

Usage:  python tools/build_data.py [--skip-dict] [--skip-catalog] [--skip-books] [--skip-storybooks] [--skip-voa] [--skip-wordlists]
Files that already exist are not downloaded again.
"""
import csv
import io
import json
import re
import sys
import time
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data"
CACHE = ROOT / "tools" / ".cache"  # raw downloads, not deployed
UA = {"User-Agent": "rsvp-reader-build/1.0 (personal extensive-reading app)"}

# Curated for extensive reading: (id, Japanese title, level 1-5 set by hand).
# Levels: 1 絵本 / 2 やさしい児童書 / 3 児童文学 / 4 一般小説 / 5 古典・難しめ
CURATED = [
    (14838, "ピーターラビット", 1), (14407, "ベンジャミンバニー", 1), (14837, "トムこねこ", 1),
    (14814, "あひるのジマイマ", 1), (14872, "りすのナトキン", 1), (45264, "2ひきのわるいねずみ", 1),
    (12103, "ティギーおばさん", 1), (11757, "ビロードのうさぎ", 1), (6936, "ロビンソン・クルーソー（一音節語版）", 1),
    (2557, "山のおばあさん西風", 2), (1825, "キツネのレディ", 2), (46866, "ウサギのピーター・コットンテール", 2),
    (15281, "ウィギリーおじさん", 2), (11339, "イソップ寓話", 2), (902, "幸福な王子", 2),
    (501, "ドリトル先生アフリカゆき", 2), (55, "オズの魔法使い", 2), (500, "ピノッキオ", 2),
    (7256, "賢者の贈り物", 3), (2781, "なぜなぜ物語", 3), (16, "ピーター・パン", 3),
    (11, "不思議の国のアリス", 3), (12, "鏡の国のアリス", 3), (2591, "グリム童話", 3),
    (1597, "アンデルセン童話", 3), (503, "あおいろの童話集", 3), (113, "秘密の花園", 3),
    (146, "小公女", 3), (1448, "ハイジ", 3), (1450, "少女ポリアンナ", 3), (1874, "若草の祈り", 3),
    (778, "砂の妖精", 3), (271, "黒馬物語", 3),
    (289, "たのしい川べ", 4), (236, "ジャングル・ブック", 4), (215, "野性の呼び声", 4), (45, "赤毛のアン", 4),
    (74, "トム・ソーヤーの冒険", 4), (46, "クリスマス・キャロル", 4), (120, "宝島", 4), (35, "タイム・マシン", 4),
    (103, "八十日間世界一周", 4), (1661, "シャーロック・ホームズの冒険", 4), (244, "緋色の研究", 4),
    (2852, "バスカヴィル家の犬", 4), (43, "ジキル博士とハイド氏", 4), (558, "三十九階段", 4), (910, "白い牙", 4),
    (36, "宇宙戦争", 4), (5230, "透明人間", 4), (2776, "O・ヘンリー短編集", 4), (514, "若草物語", 4),
    (5200, "変身", 4),
    (64317, "グレート・ギャツビー", 5), (84, "フランケンシュタイン", 5), (174, "ドリアン・グレイの肖像", 5),
    (76, "ハックルベリー・フィンの冒険", 5), (345, "ドラキュラ", 5), (1342, "高慢と偏見", 5),
    (41, "スリーピー・ホローの伝説", 5),
]

START_RE = re.compile(r"^\*\*\*\s*START OF (THE|THIS) PROJECT GUTENBERG.*$", re.M | re.I)
END_RE = re.compile(r"^\*\*\*\s*END OF (THE|THIS) PROJECT GUTENBERG.*$", re.M | re.I)


def fetch(url, retries=3):
    for i in range(retries):
        try:
            req = urllib.request.Request(url, headers=UA)
            with urllib.request.urlopen(req, timeout=120) as r:
                return r.read()
        except Exception as e:  # noqa: BLE001
            if i == retries - 1:
                raise
            print(f"  retry {url}: {e}")
            time.sleep(3)


def strip_gutenberg(text):
    text = text.replace("\r\n", "\n").replace("\r", "\n").lstrip("﻿")
    m = START_RE.search(text)
    if m:
        text = text[m.end():]
    m = END_RE.search(text)
    if m:
        text = text[: m.start()]
    return text.strip() + "\n"


def header_field(raw, name):
    m = re.search(rf"^{name}:\s*(.+(?:\n[ \t]+.+)*)", raw, re.M)
    return re.sub(r"\s+", " ", m.group(1)).strip() if m else ""


WORD_RE = re.compile(r"[A-Za-z]+(?:'[A-Za-z]+)?")
SENT_RE = re.compile(r"[.!?]+[\"')\]”’]*(\s|$)")
FUNCTION_WORDS = set("""
i me my mine myself you your yours yourself he him his himself she her hers herself it its itself we us our ours
ourselves they them their theirs themselves this that these those am is are was were be been being have has had
having do does did doing a an the and but if or because as until while of at by for with about against between
into through during before after above below to from up down in out on off over under again further then once
here there when where why how all any both each few more most other some such no nor not only own same so than
too very can will just should now oh ah mr mrs miss sir don't didn't can't won't it's i'm i'll i've i'd you're
you'll he's she's that's there's isn't wasn't aren't weren't couldn't wouldn't shouldn't hadn't hasn't haven't
let's what's o'clock yes ok
""".split())
IRREGULAR = set("""
said went gone came saw seen took taken made got gotten knew known thought told found gave given felt left kept
began begun brought stood heard ran sat held wrote written spoke spoken ate eaten fell fallen grew grown drew drawn
flew flown lay lain led met paid sent slept sold taught understood won wore worn woke broke broken chose chosen
caught fought bought threw thrown rose risen rode sang swam drank forgot hid hidden shook struck bore born tore torn
lost meant built spent cut put set shut hit hurt let read children men women feet teeth mice people better best
worse worst less least could would might must shall
""".split())


def analyze(text, common):
    text = re.sub(r"\[Illustration[^\]]*\]", " ", text, flags=re.I).replace("’", "'").replace("‘", "'")
    words = WORD_RE.findall(text)
    n = len(words) or 1
    lower_seen = {w for w in words if w.islower()}
    # Capitalized words never seen in lowercase are names (Alice, McGregor): not "hard vocabulary".
    rare = sum(1 for w in words if w.lower() not in common and (w.islower() or w.lower() in lower_seen))
    sentences = max(1, len(SENT_RE.findall(text)))
    rare_ratio = rare / n
    avg_len = n / sentences
    # Rough difficulty score (shown for reference; levels are set by hand).
    score = avg_len * 0.3 + rare_ratio * 100 * 0.8
    return len(words), round(avg_len, 1), round(rare_ratio * 100, 1), round(score, 2)


def load_common_words():
    raw = fetch("https://cdn.jsdelivr.net/gh/kujirahand/EJDict@master/frequency/2000.txt").decode("utf-8")
    common = {w.strip().lower() for w in raw.split() if w.strip()}
    # Treat simple inflections of common words as common, too.
    extra = set()
    for w in common:
        extra |= {w + "s", w + "es", w + "ed", w + "d", w + "ing", w + "er", w + "est", w + "ly"}
        if w.endswith("e"):
            extra.add(w[:-1] + "ing")
        if w.endswith("y"):
            extra |= {w[:-1] + "ies", w[:-1] + "ied"}
    return common | extra | FUNCTION_WORDS | IRREGULAR


def build_books():
    out = DATA / "books"
    out.mkdir(parents=True, exist_ok=True)
    CACHE.mkdir(parents=True, exist_ok=True)
    common = load_common_words()
    lib = []
    for gid, note, level in CURATED:
        dest = out / f"{gid}.txt"
        raw_cache = CACHE / f"raw-{gid}.txt"
        if not raw_cache.exists():
            print(f"download {gid} {note}")
            raw_cache.write_bytes(fetch(f"https://www.gutenberg.org/cache/epub/{gid}/pg{gid}.txt"))
            time.sleep(2)
        # Byte-exact cache; also repair caches written by an older version with doubled CRs.
        raw = raw_cache.read_bytes().decode("utf-8", "replace").replace("\r\r\n", "\n").replace("\r\n", "\n")
        body = strip_gutenberg(raw)
        dest.write_text(body, encoding="utf-8", newline="\n")
        words, avg_len, rare, score = analyze(body, common)
        entry = {
            "id": f"pg-{gid}",
            "gid": gid,
            "file": f"books/{gid}.txt",
            "source": "gutenberg",
            "title": header_field(raw, "Title"),
            "author": header_field(raw, "Author"),
            "ja": note,
            "words": words,
            "sentenceLen": avg_len,
            "rarePct": rare,
            "score": score,
            "level": level,
        }
        lib.append(entry)
        print(f"  {gid:>6} L{entry['level']} score={score:5.2f} sl={avg_len:5.1f} rare={rare:4.1f}% "
              f"{words:>7}w  {entry['title'][:40]} / {entry['author'][:25]}")
    save_part("gutenberg", lib)


# ---- library.json is merged from per-source parts so each source can be rebuilt on its own.
def save_part(name, entries, credits=None):
    CACHE.mkdir(parents=True, exist_ok=True)
    (CACHE / f"lib-{name}.json").write_text(json.dumps({"entries": entries, "credits": credits or {}}, ensure_ascii=False), encoding="utf-8")
    print(f"{name}: {len(entries)} books")


def write_library():
    lib, credits = [], {}
    for part in sorted(CACHE.glob("lib-*.json")):
        d = json.loads(part.read_text(encoding="utf-8"))
        lib += d["entries"]
        credits.update(d["credits"])
    lib.sort(key=lambda b: (b["level"], b["words"]))  # short books first within a level
    (DATA / "library.json").write_text(json.dumps(lib, ensure_ascii=False, indent=1), encoding="utf-8")
    (DATA / "credits.json").write_text(json.dumps(credits, ensure_ascii=False), encoding="utf-8")
    used = {b["file"].split("/")[-1] for b in lib}
    for f in (DATA / "books").glob("*.txt"):
        if f.name not in used:
            f.unlink()  # left over from an earlier build
    print(f"library.json: {len(lib)} books")


# ---- Global Storybooks (African Storybook + Pratham Books): short leveled picture-book stories, CC BY.
STORYBOOK_SOURCES = {
    "asp-source": "African Storybook",
    "pb-source": "Pratham Books (StoryWeaver)",
}
# (band, max words per story, stories per volume, level, Japanese name)
STORYBOOK_BANDS = [
    ("A", 150, 30, 0, "はじめての絵本"),
    ("B", 400, 20, 0, "やさしい絵本"),
    ("C", 1000, 12, 1, "絵本の読み物"),
    ("D", 10**9, 8, 1, "長めの読み物"),
]


def parse_storybook(md):
    title = md.split("\n", 1)[0].lstrip("# ").strip()
    body, _, meta = md.partition("\n* License")
    meta = "* License" + meta
    field = lambda k: (re.search(rf"^\* {k}: (.+)$", meta, re.M) or [None, ""])[1].strip()
    pages = []
    for page in body.split("\n##")[1:]:
        text = re.sub(r"\s+", " ", page).strip()
        if text:
            pages.append(text)
    return {
        "title": title, "pages": pages,
        "license": field("License").strip("[]"), "text": field("Text"), "illustration": field("Illustration"),
    }


def build_storybooks():
    import zipfile

    common = load_common_words()
    stories = []
    for repo, origin in STORYBOOK_SOURCES.items():
        zpath = CACHE / f"{repo}.zip"
        if not zpath.exists():
            print(f"download {repo}")
            zpath.write_bytes(fetch(f"https://codeload.github.com/global-asp/{repo}/zip/refs/heads/master"))
        z = zipfile.ZipFile(zpath)
        for name in sorted(n for n in z.namelist() if re.search(r"/en/\d{4}_.*\.md$", n)):
            s = parse_storybook(z.read(name).decode("utf-8"))
            if s["license"] != "CC-BY" or not s["pages"]:
                continue  # NC-licensed stories are left out so the app can be shared freely
            text = "\n\n".join(s["pages"])
            words, avg_len, rare, score = analyze(text, common)
            if words < 20:
                continue
            s.update(origin=origin, words=words, score=score, body=text)
            stories.append(s)

    out = DATA / "books"
    entries, credits = [], {}
    lower = 0
    for band, upper, per_volume, level, ja in STORYBOOK_BANDS:
        group = sorted((s for s in stories if lower < s["words"] <= upper), key=lambda s: (s["words"], s["score"]))
        lower = upper
        volumes = [group[i:i + per_volume] for i in range(0, len(group), per_volume)]
        for n, vol in enumerate(volumes, 1):
            book_id = f"sb-{band.lower()}{n}"
            text = "\n\n\n".join(f"# {s['title']}\n\n{s['body']}" for s in vol)
            (out / f"{book_id}.txt").write_text(text + "\n", encoding="utf-8", newline="\n")
            words, avg_len, rare, score = analyze(text, common)
            lo, hi = vol[0]["words"], vol[-1]["words"]
            entries.append({
                "id": book_id, "file": f"books/{book_id}.txt", "source": "storybooks",
                "title": f"Global Storybooks {band}{n}",
                "author": f"{len(vol)} stories · African Storybook / Pratham Books",
                "ja": f"{ja} {band}{n}（1話{lo}〜{hi}語・{len(vol)}話）",
                "words": words, "sentenceLen": avg_len, "rarePct": rare, "score": score, "level": level,
            })
            credits[book_id] = [
                {"title": s["title"], "text": s["text"], "illustration": s["illustration"], "origin": s["origin"], "license": "CC BY"}
                for s in vol
            ]
    save_part("storybooks", entries, credits)


# ---- VOA Learning English "American Stories": classic American literature retold for learners.
# Works of the US government (VOA) are public domain; all adapted originals are pre-1929 classics or folk tales.
VOA_EXTRA = ["https://learningenglish.voanews.com/api/zyg__l-vomx-tpetmty"]  # American Stories RSS feed
VOA_NOT_STORIES = ("oscar", "stores", "minari")
VOA_JA = {
    "the gift of the magi": "賢者の贈り物（やさしい版）", "the last leaf": "最後の一葉",
    "the tell-tale heart": "告げ口心臓", "the cask of amontillado": "アモンティリャードの酒樽",
    "the purloined letter": "盗まれた手紙", "the fall of the house of usher": "アッシャー家の崩壊",
    "the open boat": "オープン・ボート", "the blue hotel": "青いホテル", "rappaccini's daughter": "ラパチーニの娘",
    "the celebrated jumping frog of calaveras county": "キャラヴェラス郡の名高い跳び蛙",
    "chicken little": "チキン・リトル", "how the animals lost their tails": "動物たちがしっぽをなくしたわけ",
    "two thanksgiving day gentlemen": "感謝祭の二人の紳士", "the ambitious guest": "野心的な客",
    "the bride comes to yellow sky": "花嫁イエロー・スカイに来る", "the red calico": "赤いキャラコ",
    "athenaise": "アテネーズ", "the californian's tale": "カリフォルニア人の話", "the caliph, cupid and the clock": "カリフと恋の神と時計",
    "the line of least resistance": "最も抵抗の少ない道", "the exact science of matrimony": "結婚の精密科学",
    "luck": "幸運", "mammon and the archer": "マモンと射手", "a municipal report": "市の報告書",
    "the outcasts of poker flat": "ポーカー・フラットの追放者たち", "paul bunyan": "ポール・バニヤン",
    "paul's case": "ポールの場合", "pigs is pigs": "豚は豚", "the story of an eyewitness": "目撃者の話",
    "a white heron": "白鷺",
}
VOA_AUTHORS = {  # titles on VOA that don't name the author
    "a piece of red calico": "Frank R. Stockton", "the cask of amontillado": "Edgar Allan Poe",
    "the line of least resistance": "Edith Wharton", "chicken little": "Traditional", "paul bunyan": "American folk tale",
}
PART_WORDS = {"one": 1, "two": 2, "three": 3, "four": 4, "five": 5}


def voa_urls():
    urls = []
    for n in range(1, 5):
        path = CACHE / f"voa-sitemap-{n}.xml"
        if not path.exists():
            import gzip
            path.write_bytes(gzip.decompress(fetch(f"https://learningenglish.voanews.com/sitemap_428_{n}.xml.gz")))
            time.sleep(1)
        urls += [u for u in re.findall(r"<loc>([^<]+)</loc>", path.read_text(encoding="utf-8"))
                 if re.search(r"american-stor", u) and not any(w in u for w in VOA_NOT_STORIES)]
    for feed in VOA_EXTRA:
        urls += re.findall(r"<link>(https://learningenglish[^<]+/a/[^<]+)</link>", fetch(feed).decode("utf-8"))
    return list(dict.fromkeys(urls))


def voa_article(url):
    import html as htmlmod

    path = CACHE / "voa" / (re.search(r"(\d+)\.html$", url).group(1) + ".html")
    if not path.exists():
        path.parent.mkdir(parents=True, exist_ok=True)
        print(f"download {url}")
        path.write_bytes(fetch(url))
        time.sleep(1.5)
    s = path.read_text(encoding="utf-8")
    clean = lambda x: re.sub(r"\s+", " ", htmlmod.unescape(re.sub(r"<[^>]+>", "", x))).strip()
    h1 = re.search(r"<h1[^>]*>(.*?)</h1>", s, re.S)
    title = clean(h1.group(1)) if h1 else ""
    start = s.find('id="article-content"')
    if start < 0:
        return None
    paras = []
    raw_paras = []
    for p in re.findall(r"<p[^>]*>(.*?)</p>", s[start:], re.S):
        raw_paras += re.split(r"(?:<br\s*/?>\s*)+", p)  # some articles use <br> instead of <p>
    for p in raw_paras:
        t = clean(p)
        if not t or t.startswith("No media source"):
            continue
        low = t.lower()
        if low.startswith(("now it's your turn", "now it’s your turn", "___", "words in this story", "share", "we want to hear")):
            break
        if low.startswith("editor") or ("voa" in low and ("adapted" in low or "learning english" in low or "special english" in low)):
            continue
        if re.match(r"^(your )?(storyteller|narrator|producer|the producer)\b", low) or low.startswith(("i'm ", "i’m ")):
            continue
        paras.append(t)
    # The article's audio (the narrated story), for shadowing. Always https so it plays from an https page.
    mp3 = re.search(r"https?://[^\"' ]+?\.mp3", s)
    audio = mp3.group(0).replace("http://", "https://") if mp3 else ""
    return {"title": title, "paras": paras, "audio": audio}


def build_voa():
    common = load_common_words()
    stories = {}
    for url in voa_urls():
        a = voa_article(url)
        if not a or len(a["paras"]) < 5:
            continue
        m = re.search(r",?\s*Part\s+(One|Two|Three|Four|Five|\d)\b", a["title"], re.I)
        part = (PART_WORDS.get(m.group(1).lower()) or int(m.group(1))) if m else 1
        base = a["title"][: m.start()] if m else a["title"]
        m2 = re.match(r"^(?:American Stor(?:y|ies):?\s*)?['‘\"]?(.+?)[,']*['’\"]?,?\s+by\s+(.+?)[,.]?$", base.strip())
        name, author = (m2.group(1), m2.group(2)) if m2 else (base.strip(" '‘’\""), "")
        name = re.sub(r"[,'’\s]+An American Folk Tale$", "", name.strip(" ,'‘’\""), flags=re.I)
        author = author.replace("O.Henry", "O. Henry")
        key = re.sub(r"[^a-z ]", "", name.lower().replace("’", "'").replace("'", "")).strip()
        story = stories.setdefault(key, {"name": name, "author": author, "parts": {}})
        story["author"] = story["author"] or author or VOA_AUTHORS.get(key, "")
        # Duplicate URLs for the same part: keep the longer text.
        if len(" ".join(a["paras"])) > len(" ".join(story["parts"].get(part, {}).get("paras", []))):
            story["parts"][part] = {"paras": a["paras"], "audio": a["audio"]}

    out = DATA / "books"
    entries, credits = [], {}
    for key, st in sorted(stories.items()):
        parts = [st["parts"][k] for k in sorted(st["parts"])]
        if len(parts) > 1:
            text = "\n\n\n".join(f"# Part {i}\n\n" + "\n\n".join(p["paras"]) for i, p in enumerate(parts, 1))
        else:
            text = "\n\n".join(parts[0]["paras"])
        words, avg_len, rare, score = analyze(text, common)
        if words < 300:
            continue
        book_id = "voa-" + re.sub(r"\s+", "-", key)[:40]
        (out / f"{book_id}.txt").write_text(text + "\n", encoding="utf-8", newline="\n")
        ja_key = next((k for k in VOA_JA if re.sub(r"[^a-z ]", "", k.replace("'", "")) == key), None)
        entries.append({
            "id": book_id, "file": f"books/{book_id}.txt", "source": "voa",
            "title": st["name"], "author": f"{st['author'] or 'Traditional'} · VOA Learning English",
            "audio": [p["audio"] for p in parts],
            "ja": VOA_JA.get(ja_key, st["name"]) if ja_key else st["name"],
            "words": words, "sentenceLen": avg_len, "rarePct": rare, "score": score, "level": 2,
        })
        credits[book_id] = [{"title": st["name"], "text": f"Adapted by VOA Learning English from {st['author'] or 'a traditional tale'}",
                             "origin": "VOA Learning English", "license": "Public domain (U.S. government work)"}]
        print(f"  {book_id:<45} {words:>6}w parts={len(parts)} {st['name']} / {st['author']}")
    save_part("voa", entries, credits)


def short_author(authors):
    names = []
    for a in authors.split(";"):
        a = a.strip()
        if not a or "[" in a:  # skip illustrators, editors, translators...
            continue
        a = re.sub(r",\s*(-?\d{1,4}\??\s*(BCE|CE)?\??-?\s*(\d{1,4}\??\s*(BCE|CE)?)?|active.*)$", "", a).strip()
        a = re.sub(r"\s*\(.*?\)", "", a)
        parts = [p.strip() for p in a.split(",")]
        names.append(" ".join(parts[1:] + parts[:1]) if len(parts) >= 2 else parts[0])
    return "; ".join(names[:2])


def build_catalog():
    src = CACHE / "pg_catalog.csv"
    if not src.exists():
        CACHE.mkdir(parents=True, exist_ok=True)
        print("download pg_catalog.csv")
        src.write_bytes(fetch("https://www.gutenberg.org/cache/epub/feeds/pg_catalog.csv"))
    lines = []
    with open(src, encoding="utf-8", newline="") as f:
        for r in csv.DictReader(f):
            if r["Type"] != "Text" or r["Language"] != "en":
                continue
            title = re.sub(r"\s+", " ", r["Title"].split("\n")[0]).strip()[:160]
            flag = "c" if "Children" in r["Bookshelves"] else ""
            lines.append(f"{r['Text#']}\t{title}\t{short_author(r['Authors'])}\t{flag}")
    (DATA / "catalog.tsv").write_text("\n".join(lines) + "\n", encoding="utf-8", newline="\n")
    print(f"catalog.tsv: {len(lines)} entries, {(DATA / 'catalog.tsv').stat().st_size // 1024} KB")


def build_dict():
    out = DATA / "dict"
    out.mkdir(parents=True, exist_ok=True)
    for c in "abcdefghijklmnopqrstuvwxyz":
        dest = out / f"{c}.txt"
        if dest.exists():
            continue
        print(f"download dict {c}")
        dest.write_bytes(fetch(f"https://cdn.jsdelivr.net/gh/kujirahand/EJDict@master/src/{c}.txt"))
        time.sleep(0.5)
    print("dict: done")


# CMUdict (ARPAbet, American English) -> the IPA style used in Japanese English-Japanese
# dictionaries: /rʌ́n/, /bə́ːrd/, /wɔ́ːtər/, with the stress mark on the vowel.
ARPA_VOWELS = {
    "AA": "ɑ", "AE": "æ", "AW": "aʊ", "AY": "aɪ", "EH": "e", "EY": "eɪ", "IH": "ɪ",
    "OW": "oʊ", "OY": "ɔɪ", "UH": "ʊ",
}
ARPA_CONSONANTS = {
    "B": "b", "CH": "tʃ", "D": "d", "DH": "ð", "F": "f", "G": "g", "HH": "h", "JH": "dʒ", "K": "k",
    "L": "l", "M": "m", "N": "n", "NG": "ŋ", "P": "p", "R": "r", "S": "s", "SH": "ʃ", "T": "t",
    "TH": "θ", "V": "v", "W": "w", "Y": "j", "Z": "z", "ZH": "ʒ",
}
STRESS_MARK = {"1": "́", "2": "̀", "0": ""}


def arpabet_to_ipa(phones):
    out = []
    for ph in phones:
        base, stress = (ph[:-1], ph[-1]) if ph[-1].isdigit() else (ph, None)
        if stress is None:
            out.append(ARPA_CONSONANTS.get(base, ""))
            continue
        stressed = stress != "0"
        if base == "AH":
            v = "ʌ" if stressed else "ə"
        elif base == "ER":
            v = "əːr" if stressed else "ər"
        elif base == "IY":
            v = "iː" if stressed else "i"
        elif base == "UW":
            v = "uː" if stressed else "u"
        elif base == "AO":
            v = "ɔː" if stressed else "ɔ"
        else:
            v = ARPA_VOWELS.get(base, "")
        # Put the accent on the first letter of the vowel symbol (áɪ, ə́ːr).
        out.append(v[:1] + STRESS_MARK[stress] + v[1:] if v else "")
    return "".join(out)


def build_pron():
    out = DATA / "pron"
    out.mkdir(parents=True, exist_ok=True)
    src = CACHE / "cmudict.dict"
    if not src.exists():
        CACHE.mkdir(parents=True, exist_ok=True)
        print("download cmudict")
        src.write_bytes(fetch("https://raw.githubusercontent.com/cmusphinx/cmudict/master/cmudict.dict"))
        (out / "LICENSE.txt").write_bytes(fetch("https://raw.githubusercontent.com/cmusphinx/cmudict/master/LICENSE"))
    prons = {}
    for line in src.read_text(encoding="utf-8").splitlines():
        line = line.split("#")[0].strip()
        if not line:
            continue
        word, *phones = line.split()
        word = re.sub(r"\(\d+\)$", "", word).lower()
        ipa = arpabet_to_ipa(phones)
        variants = prons.setdefault(word, [])
        if ipa and ipa not in variants and len(variants) < 2:
            variants.append(ipa)
    by_letter = {}
    for word, variants in prons.items():
        c = word[0] if "a" <= word[0] <= "z" else "a"
        by_letter.setdefault(c, []).append(f"{word}\t{'|'.join(variants)}")
    for c, lines in by_letter.items():
        (out / f"{c}.txt").write_text("\n".join(sorted(lines)) + "\n", encoding="utf-8", newline="\n")
    print(f"pron: {len(prons)} words")


# ---- Word decks for the word book: EJDict's Basic English 850 and core 2000 lists, ordered by how
# often each word appears in the bundled books, each with a short example sentence from an easy book.
def build_wordlists():
    lists = {}
    for name, fname in (("basic850", "850"), ("core2000", "2000")):
        raw = fetch(f"https://cdn.jsdelivr.net/gh/kujirahand/EJDict@master/frequency/{fname}.txt").decode("utf-8")
        words = [w.strip().lower() for w in raw.split("\n") if re.fullmatch(r"[a-z][a-z'-]+", w.strip().lower())]
        lists[name] = [w for w in dict.fromkeys(words) if w not in FUNCTION_WORDS]

    def table(dirname):
        t = {}
        for f in (DATA / dirname).glob("*.txt"):
            for line in f.read_text(encoding="utf-8").split("\n"):
                head, _, value = line.partition("\t")
                for h in head.split(","):
                    t.setdefault(h.strip().lower(), value.strip())
        return t

    meanings, prons = table("dict"), table("pron")
    lib = json.loads((DATA / "library.json").read_text(encoding="utf-8"))
    # Easier sources first: example sentences are taken from the lowest level that has one.
    lib.sort(key=lambda b: (b["level"], b["words"]))
    freq = {}
    examples = {}
    targets = set(lists["core2000"]) | set(lists["basic850"])
    for book in lib:
        text = (DATA / book["file"]).read_text(encoding="utf-8")
        text = re.sub(r"^#.*$", " ", text, flags=re.M).replace("’", "'").replace("‘", "'")
        for w in re.findall(r"[a-z]+(?:'[a-z]+)?", text.lower()):
            freq[w] = freq.get(w, 0) + 1
        if book["level"] > 2:
            continue
        for sent in re.split(r"(?<=[.!?])[\"'”]?\s+", re.sub(r"\s+", " ", text)):
            n = len(sent.split())
            if not 6 <= n <= 16 or not re.fullmatch(r"[A-Z\"'“][\w\s,;:'\"“”.!?-]+[.!?\"'”]", sent):
                continue
            for w in set(re.findall(r"[a-z]+", sent.lower())) & targets:
                best = examples.get(w)
                # Prefer ~8-12 words from the easiest level.
                if best is None or (best["level"] == book["level"] and abs(n - 10) < abs(len(best["s"].split()) - 10)):
                    examples[w] = {"s": sent, "src": book.get("ja") or book["title"], "level": book["level"]}

    words = {}
    for w in targets:
        m = meanings.get(w)
        if not m:
            continue
        ex = examples.get(w)
        words[w] = {
            "m": " / ".join(m.split(" / ")[:4]),
            "p": prons.get(w, "").split("|")[0],
            "ex": ex["s"] if ex else "",
            "src": ex["src"] if ex else "",
        }
    out = {name: sorted((w for w in ws if w in words), key=lambda w: -freq.get(w, 0)) for name, ws in lists.items()}
    (DATA / "wordlists.json").write_text(json.dumps({"lists": out, "words": words}, ensure_ascii=False), encoding="utf-8")
    with_ex = sum(1 for w in words.values() if w["ex"])
    print(f"wordlists: {', '.join(f'{k} {len(v)}' for k, v in out.items())}; example sentences for {with_ex}/{len(words)}")


# ---- Levelled vocabulary for adaptive word learning: ~17,000 base forms ranked by general English
# frequency (wordfreq, CC BY-SA 4.0), in 9 bands from the most common words to rare ones.
VOCAB_BANDS = [(1, 0, 1000), (2, 1000, 2000), (3, 2000, 3000), (4, 3000, 4000), (5, 4000, 6000),
               (6, 6000, 8000), (7, 8000, 10000), (8, 10000, 13000), (9, 13000, 17000)]
VOCAB_BLOCKLIST = set("fuck fucking fucked shit bitch cunt twat dick pussy whore slut nigger nigga fag faggot cock porn".split())
POINTER_RE = re.compile(r"^([A-Za-z][A-Za-z-]*)の(過去分詞|過去形|過去|現在分詞|複数形|複数|三人称単数現在形?|比較級|最上級)[形]?$|^=\s*([A-Za-z][A-Za-z -]*)$")


def base_candidates(w):
    out = []
    rules = [(r"ies$", "y"), (r"ied$", "y"), (r"iest$", "y"), (r"ier$", "y"), (r"ves$", "f"), (r"ves$", "fe"),
             (r"(ss|sh|ch|x|z|o)es$", r"\1"), (r"s$", ""), (r"ed$", ""), (r"ed$", "e"), (r"ing$", ""), (r"ing$", "e"),
             (r"er$", ""), (r"er$", "e"), (r"est$", ""), (r"est$", "e"), (r"ly$", ""), (r"'s$", "")]
    for pat, rep in rules:
        if re.search(pat, w):
            out.append(re.sub(pat, rep, w))
    m = re.match(r"^(.*([bcdfgklmnprstvz]))\2(ed|ing|er|est)$", w)
    if m:
        out.append(m.group(1))
    return out


def build_vocab_levels():
    from wordfreq import top_n_list, word_frequency  # build-time only: pip install wordfreq

    # EJDict, keeping the case of headwords so proper nouns (only "Athens", never "athens") can be dropped.
    ej, lowercase_heads = {}, set()
    for f in (DATA / "dict").glob("*.txt"):
        for line in f.read_text(encoding="utf-8").split("\n"):
            head, _, meaning = line.partition("\t")
            for h in head.split(","):
                h = h.strip()
                if not h:
                    continue
                ej.setdefault(h.lower(), meaning.strip())
                if h[0].islower():
                    lowercase_heads.add(h.lower())
    prons = {}
    for f in (DATA / "pron").glob("*.txt"):
        for line in f.read_text(encoding="utf-8").split("\n"):
            head, _, value = line.partition("\t")
            if head:
                prons[head] = value.split("|")[0]

    def pointer_base(meaning):
        m = POINTER_RE.match(meaning)
        return (m.group(1) or m.group(3)).lower().strip() if m else None

    def lemma_of(w):
        if w in ej:
            base = pointer_base(ej[w])
            return base if base and base in ej and not pointer_base(ej[base]) else (None if base else w)
        for c in base_candidates(w):
            if c in ej and not pointer_base(ej[c]):
                return c
        return None

    freq, forms = {}, {}
    for w in top_n_list("en", 60000):
        if not re.fullmatch(r"[a-z][a-z'-]*", w):
            continue
        lem = lemma_of(w)
        if not lem or "'" in lem or lem in FUNCTION_WORDS or lem in VOCAB_BLOCKLIST or lem not in lowercase_heads or len(lem) < 2:
            continue
        freq[lem] = freq.get(lem, 0) + word_frequency(w, "en")
        forms[w] = lem
    ranked = sorted(freq, key=lambda x: -freq[x])[: VOCAB_BANDS[-1][2]]
    wanted = set(ranked)

    # Example sentences from the bundled books (easiest level first); inflected forms count too.
    lib = sorted(json.loads((DATA / "library.json").read_text(encoding="utf-8")), key=lambda b: (b["level"], b["words"]))
    sources, examples = [], {}
    for book in lib:
        text = re.sub(r"^#.*$", " ", (DATA / book["file"]).read_text(encoding="utf-8"), flags=re.M)
        text = re.sub(r"\s+", " ", text.replace("’", "'").replace("‘", "'"))
        src = len(sources)
        sources.append(book.get("ja") or book["title"])
        for sent in re.split(r"(?<=[.!?])[\"'”]?\s+", text):
            toks = sent.split()
            if not 6 <= len(toks) <= 18 or not re.fullmatch(r"[A-Z\"'“][\w\s,;:'\"“”.!?-]+[.!?\"'”]", sent):
                continue
            for k, t in enumerate(toks):
                lem = forms.get(re.sub(r"[^a-z'-]", "", t.lower()))
                if lem in wanted and (lem not in examples or (examples[lem][3] == book["level"] and abs(len(toks) - 11) < abs(len(examples[lem][0].split()) - 11))):
                    examples[lem] = (sent, k, src, book["level"])

    out = DATA / "vocab"
    out.mkdir(exist_ok=True)
    bands = []
    for band, a, b in VOCAB_BANDS:
        rows = []
        for w in ranked[a:b]:
            senses = [s for s in ej[w].split(" / ") if s][:3]
            ex = examples.get(w)
            rows.append([w, " / ".join(senses)[:160], prons.get(w, ""), ex[0] if ex else "", ex[1] if ex else -1, ex[2] if ex else -1])
        (out / f"L{band}.json").write_text(json.dumps({"band": band, "from": a + 1, "to": b, "words": rows}, ensure_ascii=False), encoding="utf-8")
        bands.append({"band": band, "from": a + 1, "to": min(b, len(ranked)), "size": len(rows), "withExample": sum(1 for r in rows if r[3])})
    (out / "index.json").write_text(json.dumps({"bands": bands, "sources": sources}, ensure_ascii=False), encoding="utf-8")
    for bd in bands:
        print(f"  L{bd['band']}: rank {bd['from']}-{bd['to']} ({bd['size']} words, {bd['withExample']} with examples)")


# ---- 瞬間英作文 (Japanese -> English) sentences from Tatoeba (CC BY 2.0 FR), in 5 levels.
# Tatoeba's favourite names are also dictionary words ("tom" = a male cat), so list them explicitly.
COMMON_NAMES = set("tom tom's mary mary's john jim bob mike jane ann nancy bill jack tony lucy kate betty paul ken meg judy dan".split())
COMPOSITION_LEVELS = 5
COMPOSITION_PER_LEVEL = 800
GRAMMAR_TAGS = [
    ("疑問文", r"\?$"),
    ("否定文", r"n't\b|\bnot\b|\bnever\b"),
    ("過去形", r"\b(was|were|did|went|came|saw|took|made|got|said|told|bought|\w+ed)\b"),
    ("未来", r"\b(will|won't|going to)\b"),
    ("現在完了", r"\b(have|has|haven't|hasn't)\s+(\w+\s+)?(been|\w+ed|done|seen|gone|made|had|taken|eaten|written|known|met|heard|come|become|lost|found)\b"),
    ("進行形", r"\b(am|is|are|was|were|'m|'re|'s)\s+\w+ing\b"),
    ("受動態", r"\b(is|are|was|were|be|been)\s+(\w+ed|made|done|written|known|born|given|taken|seen|built|spoken|sold|told)\b"),
    ("助動詞", r"\b(can|could|should|must|may|might|would|can't|couldn't|shouldn't)\b"),
    ("比較", r"\b(than|most|\w+est)\b"),
    ("不定詞", r"\bto\s+(be|go|do|have|make|get|see|come|take|know|say|eat|buy|help|find|play|study|learn|read|write|speak|meet|visit|use)\b"),
    ("関係詞", r"\b(who|which|whose|whom)\b"),
    ("接続詞", r"\b(because|when|if|while|although|though|until|before|after)\b"),
]


def build_composition():
    import bz2
    import random

    files = {
        "eng": "https://downloads.tatoeba.org/exports/per_language/eng/eng_sentences.tsv.bz2",
        "jpn": "https://downloads.tatoeba.org/exports/per_language/jpn/jpn_sentences.tsv.bz2",
        "links": "https://downloads.tatoeba.org/exports/per_language/eng/eng-jpn_links.tsv.bz2",
    }
    data = {}
    for name, url in files.items():
        path = CACHE / f"tatoeba-{name}.tsv.bz2"
        if not path.exists():
            print(f"download {url}")
            path.write_bytes(fetch(url))
        data[name] = bz2.decompress(path.read_bytes()).decode("utf-8")

    def sentences(text):
        out = {}
        for line in text.split("\n"):
            parts = line.split("\t")
            if len(parts) >= 3:
                out[parts[0]] = parts[2].strip()
        return out

    eng, jpn = sentences(data["eng"]), sentences(data["jpn"])
    # Vocabulary level of each word, from the levelled word lists (data/vocab).
    band_of = {}
    for band in range(1, 10):
        for row in json.loads((DATA / "vocab" / f"L{band}.json").read_text(encoding="utf-8"))["words"]:
            band_of.setdefault(row[0], band)

    def word_band(w):
        w = w.lower().strip("'")
        if w in FUNCTION_WORDS or w in band_of:
            return band_of.get(w, 1)
        for c in base_candidates(w):
            if c in band_of:
                return band_of[c]
        return 99

    pairs = {}
    for line in data["links"].split("\n"):
        a, _, b = line.partition("\t")
        en, ja = eng.get(a), jpn.get(b.strip())
        if not en or not ja or en in pairs:
            continue
        words = en.split()
        if not 3 <= len(words) <= 12 or len(ja) > 40 or re.search(r"[A-Za-z0-9]", ja):
            continue
        if not re.fullmatch(r"[A-Z][A-Za-z ,'?!.-]*[.?!]", en) or re.search(r"\s[A-Z](?!\b)|\s[A-HJ-Z]\b", " " + " ".join(words[1:])):
            continue  # capitalised words after the first are names; keep "I"
        first = words[0].strip(",").lower()
        if first in COMMON_NAMES or (first not in band_of and first not in FUNCTION_WORDS and first not in ("i", "i'm", "i'll", "i've", "i'd")):
            continue  # a sentence starting with a name ("Tom is ...")
        top = max(word_band(w) for w in re.findall(r"[A-Za-z']+", en))
        if top > 7:
            continue
        n = len(words)
        level = 1 if top <= 1 and n <= 7 else 2 if top <= 2 and n <= 9 else 3 if top <= 3 and n <= 10 else 4 if top <= 5 else 5
        tags = [name for name, pat in GRAMMAR_TAGS if re.search(pat, en, re.I)]
        pairs[en] = [int(a), en, ja, level, tags]

    rng = random.Random(42)
    items = []
    for level in range(1, COMPOSITION_LEVELS + 1):
        group = [p for p in pairs.values() if p[3] == level]
        rng.shuffle(group)
        items += group[:COMPOSITION_PER_LEVEL]
    tags = sorted({t for it in items for t in it[4]}, key=[n for n, _ in GRAMMAR_TAGS].index)
    (DATA / "composition.json").write_text(json.dumps({"tags": tags, "items": items}, ensure_ascii=False), encoding="utf-8")
    counts = {lv: sum(1 for it in items if it[3] == lv) for lv in range(1, 6)}
    print(f"composition: {len(items)} pairs from {len(pairs)} candidates, per level {counts}")


if __name__ == "__main__":
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    args = set(sys.argv[1:])
    if "--skip-dict" not in args:
        build_dict()
        build_pron()
    if "--skip-catalog" not in args:
        build_catalog()
    if "--skip-books" not in args:
        build_books()
    if "--skip-storybooks" not in args:
        build_storybooks()
    if "--skip-voa" not in args:
        build_voa()
    write_library()
    if "--skip-wordlists" not in args:
        build_wordlists()
        build_vocab_levels()
    if "--skip-composition" not in args:
        build_composition()
