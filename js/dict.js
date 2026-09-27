// Word lookup: EJDict (English-Japanese, CC0, bundled) and Free Dictionary API (English-English).

const tables = new Map(); // 'dict/a' -> Promise<Map<headword, string[]>>

const IRREGULAR = {
  was: 'be', were: 'be', been: 'be', am: 'be', is: 'be', are: 'be', had: 'have', has: 'have', did: 'do', does: 'do', done: 'do',
  went: 'go', gone: 'go', came: 'come', saw: 'see', seen: 'see', took: 'take', taken: 'take', made: 'make', said: 'say',
  got: 'get', gotten: 'get', knew: 'know', known: 'know', thought: 'think', told: 'tell', found: 'find', gave: 'give', given: 'give',
  felt: 'feel', left: 'leave', kept: 'keep', began: 'begin', begun: 'begin', brought: 'bring', stood: 'stand', heard: 'hear',
  ran: 'run', sat: 'sit', held: 'hold', wrote: 'write', written: 'write', spoke: 'speak', spoken: 'speak', ate: 'eat', eaten: 'eat',
  fell: 'fall', fallen: 'fall', grew: 'grow', grown: 'grow', drew: 'draw', drawn: 'draw', flew: 'fly', flown: 'fly',
  lay: 'lie', lain: 'lie', led: 'lead', met: 'meet', paid: 'pay', sent: 'send', slept: 'sleep', sold: 'sell', taught: 'teach',
  understood: 'understand', won: 'win', wore: 'wear', worn: 'wear', woke: 'wake', broke: 'break', broken: 'break', chose: 'choose',
  chosen: 'choose', caught: 'catch', fought: 'fight', bought: 'buy', sought: 'seek', threw: 'throw', thrown: 'throw', rose: 'rise',
  risen: 'rise', rode: 'ride', ridden: 'ride', sang: 'sing', sung: 'sing', swam: 'swim', drank: 'drink', drunk: 'drink',
  forgot: 'forget', forgotten: 'forget', hid: 'hide', hidden: 'hide', shook: 'shake', shaken: 'shake', struck: 'strike',
  bore: 'bear', born: 'bear', tore: 'tear', torn: 'tear', froze: 'freeze', frozen: 'freeze', stole: 'steal', stolen: 'steal',
  children: 'child', men: 'man', women: 'woman', feet: 'foot', teeth: 'tooth', mice: 'mouse', geese: 'goose', people: 'person',
  better: 'good', best: 'good', worse: 'bad', worst: 'bad', less: 'little', least: 'little', further: 'far', farther: 'far',
};

/** Load data/<dir>/<letter>.txt ("head1,head2<TAB>value" lines) into a Map. */
function loadTable(dir, c) {
  const id = `${dir}/${c}`;
  if (!tables.has(id)) {
    const p = fetch(`data/${id}.txt`)
      .then((r) => {
        if (!r.ok) throw new Error(r.status);
        return r.text();
      })
      .then((txt) => {
        const map = new Map();
        for (const line of txt.split('\n')) {
          const tab = line.indexOf('\t');
          if (tab < 1) continue;
          const meaning = line.slice(tab + 1).trim();
          for (const head of line.slice(0, tab).split(',')) {
            const key = head.trim().toLowerCase();
            if (!key) continue;
            if (!map.has(key)) map.set(key, []);
            map.get(key).push(meaning);
          }
        }
        return map;
      });
    p.catch(() => tables.delete(id));
    tables.set(id, p);
  }
  return tables.get(id);
}

const letterOf = (w) => (/[a-z]/.test(w[0]) ? w[0] : 'a');

/** Strip punctuation and possessives: '"Rabbit's,' -> "rabbit". */
export function cleanWord(token) {
  return token
    .replace(/[‘’]/g, "'")
    .replace(/^[^A-Za-z0-9]+|[^A-Za-z0-9]+$/g, '')
    .replace(/'s$/i, '')
    .toLowerCase();
}

/** Candidate base forms, most likely first. */
export function baseForms(w) {
  const c = [w];
  const add = (x) => x && x.length > 1 && !c.includes(x) && c.push(x);
  if (IRREGULAR[w]) add(IRREGULAR[w]);
  const rules = [
    [/ies$/, 'y'], [/ied$/, 'y'], [/iest$/, 'y'], [/ier$/, 'y'], [/ily$/, 'y'],
    [/ves$/, 'f'], [/ves$/, 'fe'], [/(ss|sh|ch|x|z|o)es$/, '$1'], [/s$/, ''],
    [/ed$/, ''], [/ed$/, 'e'], [/ing$/, ''], [/ing$/, 'e'], [/er$/, ''], [/er$/, 'e'], [/est$/, ''], [/est$/, 'e'], [/ly$/, ''],
  ];
  for (const [re, rep] of rules) if (re.test(w)) add(w.replace(re, rep));
  // running -> run, stopped -> stop
  const dbl = w.match(/^(.*([bcdfgklmnprstvz]))\2(ed|ing|er|est)$/);
  if (dbl) add(dbl[1]);
  return c;
}

/** Japanese meanings: [{word, meanings: string[]}], exact form first then base forms. */
export async function lookupJa(token) {
  const w = cleanWord(token);
  if (!w) return [];
  const results = [];
  for (const form of baseForms(w)) {
    const map = await loadTable('dict', letterOf(form));
    const m = map.get(form);
    if (m) results.push({ word: form, meanings: m, pron: await lookupPron(form) });
    if (results.length >= 2) break;
  }
  return results;
}

/** Pronunciations in Japanese-dictionary IPA style (from CMUdict), e.g. ["rʌ́n"]. */
export async function lookupPron(word) {
  try {
    const m = (await loadTable('pron', letterOf(word))).get(word);
    return m ? m[0].split('|') : [];
  } catch {
    return [];
  }
}

/** English definitions from freedictionaryapi.com: [{pos, defs: string[]}]. */
export async function lookupEn(token) {
  const w = cleanWord(token);
  for (const form of baseForms(w).slice(0, 3)) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 10000);
    try {
      const r = await fetch(`https://freedictionaryapi.com/api/v1/entries/en/${encodeURIComponent(form)}`, { signal: ctrl.signal });
      if (!r.ok) continue;
      const d = await r.json();
      const entries = (d.entries || [])
        .filter((e) => e.senses && e.senses.length)
        .slice(0, 4)
        .map((e) => ({
          pos: e.partOfSpeech,
          // "As an auxiliary verb:" is only a header; show its first sub-sense with it.
          defs: e.senses.slice(0, 3).map((s) => (/:$/.test(s.definition) && s.subsenses?.length ? `${s.definition} ${s.subsenses[0].definition}` : s.definition)),
        }));
      if (entries.length) return { word: form, entries };
    } finally {
      clearTimeout(t);
    }
  }
  return null;
}
