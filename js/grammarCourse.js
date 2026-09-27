// 英文法コース: the structure of 関正生『真・英文法大全』(KADOKAWA) for use with your own copy of the book.
// Chapter / section numbers, headings and page numbers follow the book so every section can be ticked off.
// The "points" and questions are original material written for this app (not taken from the book):
// read the book for its explanations, then check your understanding here.
//
// pdf: [first, last] page of the scanned PDF (pages the scanner dropped make it differ from `book`).
// Questions: {t:'choice', q, o:[correct first...], e} | {t:'fill', q, a:[accepted...], e} | {t:'order', ja, a, e}
// pattern: regular expression to find real examples in the bundled books (optional).

export const BOOK = { title: '真・英文法大全', author: '関正生', publisher: 'KADOKAWA' };

export const CHAPTERS = [
  {
    n: 1,
    title: '時制(1)',
    part: 'Part 1 英文法の大枠を掴む',
    toc: { book: 41, pdf: 41 },
    intro: { book: [42, 43], pdf: [42, 43] },
    sections: [
      {
        id: '1-1-1', title: '現在形の考え方', book: 44, pdf: [44, 46],
        points: [
          '現在形は「今この瞬間」だけでなく、過去・現在・未来にわたって繰り返されること（習慣・性質・一般的な事実）を表す。',
          '「今まさに〜している最中」は現在形ではなく進行形で表す。',
          '三人称単数・現在なら動詞に -s / -es を付ける。',
        ],
        pattern: String.raw`\b(he|she|it)\s+(always\s+|usually\s+|often\s+|sometimes\s+|never\s+)?(goes|says|makes|takes|comes|gets|knows|likes|loves|wants|lives|works|eats|drinks|plays|reads|sees|thinks|seems|looks|means)\b`,
        questions: [
          { t: 'choice', q: 'My father ( ) coffee every morning.', o: ['drinks', 'is drinking', 'drank', 'drink'], e: 'every morning（毎朝）＝繰り返しの習慣なので現在形。主語が三人称単数なので drinks。' },
          { t: 'choice', q: 'The earth ( ) around the sun.', o: ['goes', 'is going', 'went', 'has gone'], e: 'いつの時代も変わらない一般的な事実は現在形。' },
          { t: 'fill', q: 'She usually ___ up at six. (get)', a: ['gets'], e: 'usually（普段）＝習慣。三単現の s を忘れずに。' },
          { t: 'order', ja: '私は毎週日曜日に祖母を訪ねます。', a: 'I visit my grandmother every Sunday.', e: '毎週の習慣なので現在形 visit。' },
        ],
      },
      {
        id: '1-1-2', title: '過去形', book: 47, pdf: [47, 48],
        points: [
          '過去形は、今とは切り離された過去の出来事・状態を表す。',
          'yesterday / last 〜 / 〜 ago / when I was a child など、過去を示す語句とよく一緒に使われる。',
          '過去形で言うと「今はそうではない」含みが出ることがある（I lived in Osaka. → 今は住んでいない）。',
        ],
        pattern: String.raw`\b(yesterday|ago|last (night|year|week|month|summer))\b`,
        questions: [
          { t: 'choice', q: 'I ( ) him at the station two days ago.', o: ['met', 'have met', 'meet', 'am meeting'], e: '〜 ago は過去の一時点。現在完了とは一緒に使えない。' },
          { t: 'choice', q: 'When I was a child, I ( ) afraid of dogs.', o: ['was', 'am', 'have been', 'will be'], e: 'when I was a child ＝ 過去。今とは切り離された状態なので過去形。' },
          { t: 'fill', q: 'We ___ to Kyoto last summer. (go)', a: ['went'], e: 'last summer は過去。go の過去形は went。' },
          { t: 'order', ja: '彼女は昨夜8時間眠った。', a: 'She slept for eight hours last night.', e: 'last night ＝ 過去形 slept。' },
        ],
      },
      {
        id: '1-2-1', title: '現在形の発展用法', book: 49, pdf: [49, 50],
        points: [
          '時刻表・予定表のように「確定している未来」は現在形で表せる（The train leaves at 7:30.）。',
          '料理の手順・道案内・実況など、目の前で順に起こることを述べるときにも現在形を使う。',
          '物語で、過去の出来事を現在形で語って臨場感を出すこともある。',
        ],
        questions: [
          { t: 'choice', q: 'Hurry up! The last bus ( ) at 10:15.', o: ['leaves', 'left', 'has left', 'is left'], e: '時刻表で決まっている未来は現在形。' },
          { t: 'choice', q: 'The concert ( ) at 7 p.m. tomorrow.', o: ['starts', 'started', 'has started', 'starting'], e: '予定表どおりに決まっている未来なので現在形。' },
          { t: 'fill', q: 'Our flight ___ in Sydney at 6 a.m. tomorrow. (arrive)', a: ['arrives'], e: '飛行機の到着時刻は確定した予定 → 現在形。' },
          { t: 'choice', q: '（料理の手順）First, you ( ) the onions into small pieces.', o: ['cut', 'cutting', 'had cut', 'will have cut'], e: '手順を順に説明するときは現在形。' },
        ],
      },
      {
        id: '1-2-2', title: '時制の一致', book: 51, pdf: [51, 52],
        points: [
          '主節の動詞が過去形になると、that節などの中の動詞も過去側にずらすのが原則（He said that he was tired.）。',
          '現在形→過去形、過去形→過去完了形（または過去形のまま）、will→would のようにずれる。',
          '今も変わらない事実・習慣・歴史上の事実などは、ずらさなくてもよい。',
        ],
        pattern: String.raw`\b(said|thought|knew|believed|told \w+) that\b`,
        questions: [
          { t: 'choice', q: 'He said that he ( ) hungry.', o: ['was', 'is being', 'will be', 'has been'], e: '主節が過去（said）なので、that節も過去形にずらす。' },
          { t: 'choice', q: 'She told me that she ( ) come to the party.', o: ['would', 'will', 'shall', 'must to'], e: '主節が過去なので will → would。' },
          { t: 'choice', q: 'Our teacher said that light ( ) faster than sound.', o: ['travels', 'has traveled', 'will travel', 'traveling'], e: '今も変わらない事実なので、ずらさずに現在形でよい（traveled も誤りではない）。' },
          { t: 'fill', q: 'I thought that you ___ at home. (be)', a: ['were'], e: '主節 thought（過去）に合わせて were。' },
        ],
      },
      {
        id: '1-3-1', title: '進行形の意味・用法', book: 53, pdf: [53, 54],
        points: [
          '進行形（be + -ing）は「動作の途中」＝まだ終わっていない一時的なことを表す。',
          '今まさに〜している、だけでなく「最近一時的に〜している」も表せる（I\'m staying at a hotel this week.）。',
          '現在形との違い：He plays tennis.（テニスをする人だ）／He is playing tennis.（今している）',
        ],
        pattern: String.raw`\b(am|is|are)\s+(?!(?:nothing|something|anything|everything|thing|king|ring|morning|evening|during|spring|string|wing|ceiling|building|feeling|meaning|wedding)\b)\w+ing\b`,
        questions: [
          { t: 'choice', q: 'Be quiet! The baby ( ).', o: ['is sleeping', 'sleeps', 'slept', 'has slept'], e: '今まさに眠っている途中なので現在進行形。' },
          { t: 'choice', q: 'I ( ) at my uncle\'s house until I find an apartment.', o: ['am staying', 'stay', 'stayed', 'was stay'], e: '部屋が見つかるまでの一時的な状態 → 進行形。' },
          { t: 'fill', q: 'Look! It ___ outside. (snow)', a: ['is snowing', "'s snowing"], e: 'Look!（見て）＝今起きている → 現在進行形。' },
          { t: 'order', ja: '彼らは今、夕食を作っているところです。', a: 'They are cooking dinner now.', e: '動作の途中 → are cooking。' },
        ],
      },
      {
        id: '1-3-2', title: '進行形にできない動詞', book: 55, pdf: [55, 57],
        points: [
          'know / like / love / want / believe / belong / own / resemble など「状態」を表す動詞は、原則として進行形にしない。',
          '同じ動詞でも意味で判断する：have（持っている）は状態だが、have lunch（食べる）は動作なので進行形にできる。',
          'see / hear / smell などが「自然に見える・聞こえる」の意味のときも進行形にしない。',
        ],
        questions: [
          { t: 'choice', q: 'I ( ) the answer to this question.', o: ['know', 'am knowing', 'knowing', 'have been knowing'], e: 'know は状態動詞なので進行形にしない。' },
          { t: 'choice', q: 'This bag ( ) to my sister.', o: ['belongs', 'is belonging', 'belonging', 'is belonged'], e: 'belong（所属している）は状態動詞。' },
          { t: 'choice', q: 'We ( ) lunch now. Can I call you back?', o: ['are having', 'have', 'had', 'have had'], e: 'have lunch は「食べる」という動作なので進行形にできる。' },
          { t: 'fill', q: 'She ___ her mother very much. (resemble)', a: ['resembles'], e: 'resemble（似ている）は状態動詞 → 現在形。' },
        ],
      },
      {
        id: '1-3-3', title: 'あえて進行形を使うパターン', book: 58, pdf: [58, 59],
        points: [
          '状態を表す動詞でも「一時的」「今だけ」を強調したいときは進行形にできる（You are being very kind today.）。',
          'always / constantly + 進行形 で「いつも〜してばかり」という話し手の感情（不満・驚き）を表す。',
          '変化の途中（get better, become colder など）も進行形でよく表す。',
        ],
        pattern: String.raw`\b(am|is|are|was|were) (always|constantly|forever) \w+ing\b`,
        questions: [
          { t: 'choice', q: 'He ( ) complaining about his job.', o: ['is always', 'always was being', 'has always', 'always is being'], e: 'always + 進行形 ＝「いつも〜してばかり」（不満）。' },
          { t: 'choice', q: 'You ( ) very quiet today. Is something wrong?', o: ['are being', 'be', 'being', 'have being'], e: '「今日に限って」静か ＝ 一時的 → be being。' },
          { t: 'choice', q: 'His English ( ) better and better.', o: ['is getting', 'gets being', 'get', 'was get'], e: '変化の途中 → 進行形。' },
          { t: 'fill', q: 'My sister ___ her keys! (always / lose)', a: ['is always losing'], e: 'いつも鍵をなくしてばかり → is always losing。' },
        ],
      },
      {
        id: '1-3-4', title: '「予定」を表す進行形', book: 60, pdf: [60, 62],
        points: [
          '現在進行形で「すでに準備が進んでいる近い未来の予定」を表せる（I\'m meeting Ken tomorrow.）。',
          'will は「その場で決めた意志・予測」、be going to は「前から考えていた意図・前兆」、進行形は「手配済みの予定」というイメージ。',
          'tomorrow / next week など未来を表す語句と一緒に使うことが多い。',
        ],
        questions: [
          { t: 'choice', q: 'I ( ) my dentist at three tomorrow. I\'ve already made an appointment.', o: ['am seeing', 'see', 'saw', 'have seen'], e: '予約済みの予定 → 現在進行形。' },
          { t: 'choice', q: 'We ( ) to Hawaii next month. We\'ve booked the tickets.', o: ['are flying', 'fly', 'flew', 'were flying'], e: 'チケットも取ってある予定 → 現在進行形。' },
          { t: 'choice', q: 'A: The phone is ringing.  B: OK, I ( ) it.', o: ['will get', 'am getting', 'got', 'have got'], e: 'その場で決めた意志は will。' },
          { t: 'fill', q: 'What ___ this weekend? (you / do)', a: ['are you doing'], e: '週末の予定を尋ねる定番 → What are you doing ...?' },
        ],
      },
      {
        id: '1-3-5', title: '過去進行形 (was -ing)', book: 62, pdf: [62, 64],
        points: [
          'was / were + -ing で「過去のある時点で進行中だった動作」を表す。',
          '過去形の when節と組み合わせて「〜していたら、…した」を表す（I was taking a shower when the phone rang.）。',
          '物語で「その時、何が起きていたか」という背景を描くのによく使われる。',
        ],
        pattern: String.raw`\b(was|were)\s+(?!(?:nothing|something|anything|everything|thing|king|ring|morning|evening|during|spring|string|wing|ceiling|building|feeling|meaning|wedding)\b)\w+ing\b`,
        questions: [
          { t: 'choice', q: 'I ( ) TV when my mother came home.', o: ['was watching', 'watched', 'am watching', 'have watched'], e: '母が帰ってきた時点で見ている途中だった → 過去進行形。' },
          { t: 'choice', q: 'What ( ) at eight last night?', o: ['were you doing', 'did you doing', 'are you doing', 'you were doing'], e: '過去の一時点で何をしている途中だったか → were you doing。' },
          { t: 'fill', q: 'It ___ when we left the house. (rain)', a: ['was raining'], e: '家を出た時点で降っている途中 → was raining。' },
          { t: 'order', ja: '彼が電話してきたとき、私は寝ていた。', a: 'I was sleeping when he called me.', e: '背景（寝ていた）＝過去進行形、出来事（電話）＝過去形。' },
        ],
      },
      {
        id: '1-3-6', title: '未来進行形 (will be -ing)', book: 64, pdf: [64, 65],
        points: [
          'will be + -ing で「未来のある時点で進行中の動作」を表す（This time tomorrow, I\'ll be flying to Paris.）。',
          '「このまま行けば自然にそうなる」という成り行きの未来も表す。',
          'Will you be -ing ...? は相手の予定を丁寧に尋ねる言い方になる。',
        ],
        pattern: String.raw`\bwill be\s+(?!(?:nothing|something|anything|everything|thing|king|ring|morning|evening|during|spring|string|wing|ceiling|building|feeling|meaning|wedding)\b)\w+ing\b`,
        questions: [
          { t: 'choice', q: 'This time next week, we ( ) on the beach.', o: ['will be lying', 'will lie being', 'are lain', 'lay'], e: '来週の今ごろ（未来の一時点）に進行中 → will be -ing。' },
          { t: 'choice', q: 'Don\'t call me at nine. I ( ) a meeting then.', o: ['will be having', 'will have had', 'am had', 'have'], e: '9時の時点で会議の途中 → 未来進行形。' },
          { t: 'fill', q: 'At 10 a.m. tomorrow, I ___ an exam. (take)', a: ['will be taking', "'ll be taking"], e: '明日10時の時点で進行中 → will be taking。' },
          { t: 'choice', q: '( ) you be using the printer this afternoon?', o: ['Will', 'Are', 'Do', 'Have'], e: 'Will you be -ing? ＝ 相手の予定を丁寧に尋ねる。' },
        ],
      },
    ],
  },
  {
    n: 2,
    title: '時制(2)',
    part: 'Part 1 英文法の大枠を掴む',
    toc: { book: 67, pdf: 66 },
    intro: { book: [68, 69], pdf: [67, 68] },
    sections: [
      {
        id: '2-1-1', title: '現在完了形の「イメージ」と「3用法」', book: 70, pdf: [69, 73],
        points: [
          'have + 過去分詞 は「過去の出来事を今に結びつけて述べる」形。過去から現在までの“線”のイメージ。',
          '3用法：完了・結果（just, already, yet）／経験（ever, never, 〜 times）／継続（for, since）。',
          '継続用法は状態動詞で使うのが基本（I have known him for ten years.）。',
        ],
        pattern: String.raw`\b(have|has)\s+(just\s+|already\s+|never\s+|ever\s+)?(been|done|seen|gone|known|had|made|taken|written|lived|\w+ed)\b`,
        questions: [
          { t: 'choice', q: 'I ( ) my homework. I can go out now.', o: ['have just finished', 'just finished had', 'finish', 'am finishing'], e: '「今ちょうど終えた（だから今出かけられる）」→ 完了用法。' },
          { t: 'choice', q: '( ) you ever eaten natto?', o: ['Have', 'Did', 'Are', 'Do'], e: 'ever ＝ 経験を尋ねる → Have you ever + 過去分詞?' },
          { t: 'fill', q: 'They ___ each other since childhood. (know)', a: ['have known', "'ve known"], e: 'since（〜以来）＋ 状態動詞 know → 継続用法 have known。' },
          { t: 'order', ja: '私は3回ロンドンに行ったことがある。', a: 'I have been to London three times.', e: '経験 → have been to 〜。' },
        ],
      },
      {
        id: '2-1-2', title: '現在完了形の注意事項', book: 75, pdf: [74, 77],
        points: [
          'yesterday / 〜 ago / last year / When 〜? など「過去の一時点」を明示する語句とは一緒に使えない。',
          'have been to（行ったことがある・行ってきた）と have gone to（行ってしまって今ここにいない）を区別する。',
          'since の後ろは起点（2010, I was a child）、for の後ろは期間（three years）。',
        ],
        questions: [
          { t: 'choice', q: 'I ( ) him yesterday.', o: ['saw', 'have seen', 'have been seeing', 'has seen'], e: 'yesterday（過去の一時点）とは現在完了は使えない。' },
          { t: 'choice', q: 'Where is Tom? — He ( ) to the bank. He\'ll be back soon.', o: ['has gone', 'has been', 'have gone', 'had been'], e: '行ってしまって今いない → has gone to。' },
          { t: 'choice', q: 'When ( ) your wallet?', o: ['did you lose', 'have you lost', 'have you been losing', 'you lost'], e: 'When は過去の一時点を尋ねるので過去形。' },
          { t: 'fill', q: 'I have lived here ___ 2015.', a: ['since'], e: '2015 は起点 → since。期間なら for。' },
        ],
      },
      {
        id: '2-2-1', title: '過去完了形の「イメージ」と「3用法」', book: 79, pdf: [78, 83],
        points: [
          'had + 過去分詞 は「過去のある時点」を基準に、それまでの完了・経験・継続を表す。',
          '過去の2つの出来事のうち、より前のことを示す（大過去）：When I arrived, the train had left.',
          '基準になる過去の時点（when節・by then など）がセットで必要。',
        ],
        pattern: String.raw`\bhad\s+(already\s+|never\s+|just\s+)?(been|done|seen|gone|known|made|taken|left|\w+ed)\b`,
        questions: [
          { t: 'choice', q: 'When I got to the station, the train ( ).', o: ['had already left', 'already leaves', 'has already left', 'is leaving'], e: '駅に着いた（過去）時点ですでに出発していた → 過去完了。' },
          { t: 'choice', q: 'She ( ) in Paris for five years before she moved to London.', o: ['had lived', 'has lived', 'lives', 'is living'], e: 'ロンドンに移る（過去）までの継続 → 過去完了。' },
          { t: 'fill', q: 'I ___ such a beautiful sunset until then. (never / see)', a: ['had never seen'], e: 'その時（過去）までの経験 → had never seen。' },
          { t: 'order', ja: '私が起きたとき、彼はもう出かけていた。', a: 'He had already gone out when I woke up.', e: '起きた時点（過去）より前に完了 → had already gone out。' },
        ],
      },
      {
        id: '2-3-1', title: '未来完了形の「イメージ」と「3用法」', book: 84, pdf: [83, 86],
        points: [
          'will have + 過去分詞 は「未来のある時点」までの完了・経験・継続を表す。',
          'by 〜（〜までに）、by the time 〜 などの期限とよく一緒に使う。',
          'by the time / when などの節の中は、未来のことでも現在形（Chapter 3 の「現在形の特別用法」）。',
        ],
        pattern: String.raw`\bwill have (been|done|gone|finished|seen|made|had|left|become|read|written|\w+ed)\b`,
        questions: [
          { t: 'choice', q: 'I ( ) the report by five o\'clock.', o: ['will have finished', 'have finished', 'had finished', 'finish'], e: '5時（未来）までに完了 → 未来完了。' },
          { t: 'choice', q: 'By next April, we ( ) married for ten years.', o: ['will have been', 'have been', 'had been', 'are'], e: '来年4月（未来）までの継続 → will have been。' },
          { t: 'choice', q: 'By the time you ( ) back, I will have cleaned the room.', o: ['come', 'will come', 'will have come', 'came'], e: 'by the time の節の中は未来のことでも現在形。' },
          { t: 'fill', q: 'If I read this book again, I ___ it three times. (read)', a: ['will have read', "'ll have read"], e: 'もう一度読めば（未来）3回の経験 → will have read。' },
        ],
      },
      {
        id: '2-4-1', title: '現在完了進行形 (have been -ing)', book: 87, pdf: [86, 89],
        points: [
          'have been + -ing は「過去から今まで、ずっと〜し続けている」ことを表す。',
          '動作動詞の継続は現在完了進行形、状態動詞の継続は現在完了形が基本（I have been waiting ... / I have known ...）。',
          '直前まで続いていた動作の結果にも使う（You\'re out of breath. Have you been running?）。',
        ],
        pattern: String.raw`\b(have|has|had)\s+been\s+(?!(?:nothing|something|anything|everything|thing|king|ring|morning|evening|during|spring|string|wing|ceiling|building|feeling|meaning|wedding)\b)\w+ing\b`,
        questions: [
          { t: 'choice', q: 'I ( ) for you for over an hour!', o: ['have been waiting', 'am waiting', 'waited', 'have waited being'], e: '1時間以上ずっと待ち続けている（動作の継続）→ 現在完了進行形。' },
          { t: 'choice', q: 'She ( ) him since high school.', o: ['has known', 'has been knowing', 'is knowing', 'knows'], e: 'know は状態動詞なので、継続でも現在完了形。' },
          { t: 'fill', q: 'It ___ since this morning. (rain)', a: ['has been raining', "'s been raining"], e: '朝からずっと降り続いている → has been raining。' },
          { t: 'order', ja: '彼女は3時間ずっとピアノを練習している。', a: 'She has been practicing the piano for three hours.', e: '動作の継続 → has been practicing。' },
        ],
      },
      {
        id: '2-4-2', title: '現在完了形を使った慣用表現', book: 90, pdf: [89, 92],
        points: [
          'It has been ＋期間＋ since 〜 ／ 期間 have passed since 〜「〜してから（期間）になる」。',
          'This is the first time (that) I have 〜「〜するのはこれが初めてだ」。',
          'How long have you 〜? で「どのくらい（ずっと）〜しているか」を尋ねる。',
        ],
        pattern: String.raw`\b(it'?s|it has) been (\w+ )?(years?|months?|weeks?|days?|hours?|a long time)\b|\bhave passed since\b|\bthe first time\b`,
        questions: [
          { t: 'choice', q: 'It ( ) three years since we moved here.', o: ['has been', 'is being', 'was', 'will be'], e: 'It has been ＋期間＋ since ... ＝「…してから〜になる」。' },
          { t: 'choice', q: 'This is the first time I ( ) a horse.', o: ['have ridden', 'ride', 'rode', 'am riding'], e: 'This is the first time ＋ 現在完了（経験）。' },
          { t: 'fill', q: 'How long ___ English? (you / study)', a: ['have you studied', 'have you been studying'], e: '期間を尋ねる → How long have you studied / been studying ...?' },
          { t: 'order', ja: '最後に会ってから5年がたった。', a: 'Five years have passed since we last met.', e: '期間 have passed since 〜。' },
        ],
      },
    ],
  },
  {
    n: 3,
    title: '接続詞',
    part: 'Part 1 英文法の大枠を掴む',
    toc: { book: 95, pdf: 93 },
    intro: { book: [97, 98], pdf: [95, 96] },
    sections: [
      {
        id: '3-1-1', title: '等位接続詞の基本（その1）メジャーな等位接続詞 and / but / or', book: 99, pdf: [97, 100],
        points: [
          'and / but / or は、文法的に同じ種類のもの（語と語・句と句・文と文）を対等につなぐ。',
          '何と何をつないでいるかを見極めるのが読解のカギ。',
          '命令文, and 〜「そうすれば〜」／命令文, or 〜「さもないと〜」。',
        ],
        questions: [
          { t: 'choice', q: 'I wanted to go out, ( ) it was raining hard.', o: ['but', 'and', 'or', 'so that'], e: '「出かけたかった、しかし雨」→ 逆接の but。' },
          { t: 'choice', q: 'Would you like tea ( ) coffee?', o: ['or', 'but', 'so', 'nor'], e: '「AかB」の選択 → or。' },
          { t: 'choice', q: 'Study hard, ( ) you\'ll pass the exam.', o: ['and', 'or', 'but', 'so that'], e: '命令文, and 〜「そうすれば〜」。' },
          { t: 'order', ja: '急ぎなさい、さもないと遅れますよ。', a: "Hurry up, or you'll be late.", e: '命令文, or 〜「さもないと〜」。' },
        ],
      },
      {
        id: '3-1-2', title: '等位接続詞の基本（その2）and / but / or 以外', book: 103, pdf: [101, 102],
        points: [
          'so「だから」（結果）、for「というのも〜だから」（理由を後から補足・やや堅い）。',
          'nor は否定の後で「〜もまた…ない」。後ろは倒置になる（nor did I）。',
          'yet は but に近い「それでも」。',
        ],
        pattern: String.raw`, (so|yet|nor|for) (I|you|he|she|it|we|they)\b`,
        questions: [
          { t: 'choice', q: 'It was late, ( ) we took a taxi.', o: ['so', 'for', 'nor', 'yet'], e: '「遅かった、だから」→ 結果の so。' },
          { t: 'choice', q: 'He didn\'t call me, ( ) did he send an email.', o: ['nor', 'or', 'so', 'but'], e: '否定の後の「〜もまた…ない」→ nor ＋ 倒置（did he）。' },
          { t: 'choice', q: 'She was tired, ( ) she kept working.', o: ['yet', 'so', 'for', 'nor'], e: '「疲れていた、それでも」→ yet。' },
          { t: 'choice', q: 'We stayed inside, ( ) it was very cold.', o: ['for', 'so', 'nor', 'yet'], e: '理由を後から補足する for（というのも〜だから）。' },
        ],
      },
      {
        id: '3-1-3', title: '等位接続詞を使った重要表現', book: 105, pdf: [103, 105],
        points: [
          'both A and B（AもBも）／ either A or B（AかB）／ neither A nor B（AもBも〜ない）。',
          'not A but B（AではなくB）、not only A but (also) B ＝ B as well as A（AだけでなくBも）。',
          '主語になるとき、動詞は原則として近いほう（B）に合わせる（Either you or he is ...）。',
        ],
        pattern: String.raw`\b(both \w+ and|either \w+ or|neither \w+ nor|not only)\b`,
        questions: [
          { t: 'choice', q: '( ) my brother and I like baseball.', o: ['Both', 'Either', 'Neither', 'Not only'], e: 'A and B とセット → both A and B。' },
          { t: 'choice', q: 'She speaks not only English ( ) Chinese.', o: ['but also', 'and also', 'or', 'as well'], e: 'not only A but also B。' },
          { t: 'choice', q: 'Neither you nor he ( ) wrong.', o: ['is', 'are', 'be', 'were being'], e: '動詞は近いほう（he）に合わせる → is。' },
          { t: 'order', ja: '彼女は歌手ではなく女優だ。', a: 'She is not a singer but an actress.', e: 'not A but B「AではなくB」。' },
        ],
      },
      {
        id: '3-1-4', title: '長文で必要とされる等位接続詞の考え方', book: 107, pdf: [105, 106],
        points: [
          'and / but / or の後ろの形を見て、前にある「同じ形」を探す（並列の発見）。',
          'to不定詞と to不定詞、-ing と -ing、節と節など。後ろ側の to などが省略されることもある。',
          '並列がつかめると、長い文でも構造が一気に見える。',
        ],
        questions: [
          { t: 'choice', q: 'I like swimming, running, and ( ).', o: ['cycling', 'to cycle', 'cycle', 'cycled'], e: 'swimming, running と同じ -ing 形で並べる。' },
          { t: 'choice', q: 'He decided to quit his job and ( ) his own business.', o: ['start', 'starting', 'started', 'starts'], e: 'to quit と (to) start が並列。to は省略されている。' },
          { t: 'choice', q: 'The key to success is not what you know but ( ).', o: ['who you know', 'knowing who', 'you know who', 'to know who'], e: 'what you know（名詞節）と who you know（名詞節）が並列。' },
          { t: 'choice', q: 'She opened the window and ( ) the fresh air in.', o: ['let', 'letting', 'to let', 'lets being'], e: 'opened（過去形）と let（過去形）が並列。' },
        ],
      },
      {
        id: '3-2-1', title: '従属接続詞の形と用語', book: 109, pdf: [107, 109],
        points: [
          '従属接続詞（when, if, because など）は〈接続詞＋S＋V〉のカタマリ（従属節）をつくり、主節に意味を添える。',
          '形は (When S\'V\'), SV. ＝ SV (when S\'V\')。前に来たらカンマで区切ることが多い。',
          '従属節は副詞の働き（副詞節）が基本。等位接続詞と違い、節ごと文の前後に動かせる。',
        ],
        pattern: String.raw`\b(when|because|if|though|although|while|until|before|after)\b`,
        questions: [
          { t: 'choice', q: '( ) it was raining, we stayed home.', o: ['Because', 'But', 'And', 'So'], e: '文頭に置けるのは従属接続詞。等位接続詞は文頭の節をつくれない。' },
          { t: 'choice', q: 'I\'ll wait here ( ) you come back.', o: ['until', 'and', 'but', 'or'], e: '「戻るまで」→ until。' },
          { t: 'fill', q: '___ I was a student, I lived in Kyoto.', a: ['When', 'While'], e: '「学生だったころ」→ When（While も可）。' },
          { t: 'order', ja: '疲れていたので、早く寝た。', a: 'I went to bed early because I was tired.', e: 'SV because S\'V\'。' },
        ],
      },
      {
        id: '3-2-2', title: '前置詞と接続詞の区別', book: 112, pdf: [110, 111],
        points: [
          '後ろに名詞（句）が来れば前置詞、S＋V が来れば接続詞。',
          'because of / due to（前）↔ because（接）、during（前）↔ while（接）、despite / in spite of（前）↔ although / though（接）。',
          'before / after / until / since は前置詞にも接続詞にもなる。',
        ],
        questions: [
          { t: 'choice', q: 'The game was canceled ( ) the heavy rain.', o: ['because of', 'because', 'while', 'although'], e: '後ろが名詞（the heavy rain）→ 前置詞 because of。' },
          { t: 'choice', q: 'I fell asleep ( ) the movie.', o: ['during', 'while', 'although', 'because'], e: '後ろが名詞 → 前置詞 during。S＋V なら while。' },
          { t: 'choice', q: '( ) he was tired, he kept studying.', o: ['Although', 'Despite', 'In spite of', 'During'], e: '後ろが S＋V → 接続詞 although。' },
          { t: 'choice', q: '( ) his hard work, he failed the exam.', o: ['Despite', 'Although', 'Though', 'Because'], e: '後ろが名詞 → 前置詞 despite。' },
        ],
      },
      {
        id: '3-2-3', title: '従属接続詞一覧（その1）時・条件を表す従属接続詞', book: 114, pdf: [112, 115],
        points: [
          '時：when, while, before, after, until（〜までずっと）, since（〜以来）, as soon as（〜するとすぐ）, every time（〜するたびに）, by the time（〜するまでに）, once（いったん〜すると）。',
          '条件：if, unless, as long as, in case, provided (that) など。',
          'until は継続の終点、by the time は期限（その時までに完了）。',
        ],
        pattern: String.raw`\b(as soon as|every time|by the time)\b`,
        questions: [
          { t: 'choice', q: 'Please call me ( ) you arrive at the airport.', o: ['as soon as', 'until', 'since', 'though'], e: '「着いたらすぐに」→ as soon as。' },
          { t: 'choice', q: '( ) I hear this song, I remember my high school days.', o: ['Every time', 'Until', 'Unless', 'Although'], e: '「聞くたびに」→ every time。' },
          { t: 'choice', q: 'I\'ve been busy ( ) I started this job.', o: ['since', 'until', 'by the time', 'while'], e: '「始めて以来ずっと」→ since（主節は現在完了）。' },
          { t: 'choice', q: 'You must finish the report ( ) the boss comes back.', o: ['by the time', 'until', 'since', 'as long'], e: '「戻るまでに（期限）」→ by the time。until は「ずっと」。' },
        ],
      },
      {
        id: '3-2-4', title: '従属接続詞一覧（その2）時・条件以外の従属接続詞', book: 118, pdf: [116, 120],
        points: [
          '理由：because（直接の理由）、since / as（相手もわかっている理由）。',
          '譲歩：though / although（〜だけれど）、even though（実際に〜なのに）、even if（仮に〜だとしても）。',
          '対比：while / whereas（〜なのに対して）、様態：as（〜のように）。',
        ],
        pattern: String.raw`\b(although|though|even if|even though|whereas)\b`,
        questions: [
          { t: 'choice', q: '( ) it\'s your birthday, let\'s eat out tonight.', o: ['Since', 'Unless', 'Though', 'Until'], e: 'お互いにわかっている理由 → since。' },
          { t: 'choice', q: '( ) it rains tomorrow, the game will be held.', o: ['Even if', 'Even though', 'Because', 'Since'], e: '「仮に雨が降っても」→ even if。even though は事実に使う。' },
          { t: 'choice', q: 'My brother is tall, ( ) I am short.', o: ['whereas', 'because', 'unless', 'since'], e: '「〜なのに対して」→ whereas。' },
          { t: 'choice', q: 'Do it ( ) I told you.', o: ['as', 'unless', 'though', 'whereas'], e: '「言ったように」→ 様態の as。' },
        ],
      },
      {
        id: '3-3-1', title: '"左→右"に意味をとる接続詞', book: 123, pdf: [121, 122],
        points: [
          '英文は左から右へ読み、従属節を後ろから訳し上げずに意味をとると速く正確に読める（RSVPの読み方と同じ）。',
          'A until B「Aして、ついにB」、A before B「AしてからB」、…, when 〜「…していると、そのとき〜」のように前から理解する。',
          '日本語訳に引きずられず、出てきた順に状況を思い浮かべるのがコツ。',
        ],
        pattern: String.raw`, when\b|\bbefore long\b`,
        questions: [
          { t: 'choice', q: 'We walked and walked ( ) we reached the lake.', o: ['until', 'unless', 'since', 'whereas'], e: '「歩きに歩いて、ついに湖に着いた」→ until を前から読む。' },
          { t: 'choice', q: 'It will not be long ( ) spring comes.', o: ['before', 'until', 'since', 'when'], e: 'It will not be long before 〜「まもなく〜する」。' },
          { t: 'choice', q: '"I was about to leave, when the phone rang." の自然な意味は？', o: ['出かけようとしていると、そのとき電話が鳴った', '電話が鳴ったときに出かける予定だった', '電話が鳴るまで出かけるつもりだった', '電話が鳴ったので出かけるのをやめた'], e: '…, when 〜 は「…していると、そのとき〜」と前から読む。' },
        ],
      },
      {
        id: '3-3-2', title: '細かい注意が必要な従属接続詞（その1）as long as と as far as の判別', book: 125, pdf: [123, 124],
        points: [
          'as long as ＝「〜する限り（条件）」「〜する間は（時間）」：You can stay as long as you like.',
          'as far as ＝「〜する範囲では（範囲・程度）」：as far as I know（私の知る限り）。',
          '「条件」なら as long as、「範囲」なら as far as と判断する。',
        ],
        pattern: String.raw`\bas (long|far) as\b`,
        questions: [
          { t: 'choice', q: '( ) I know, he has never been late.', o: ['As far as', 'As long as', 'As soon as', 'As well as'], e: '「私の知る範囲では」→ as far as。' },
          { t: 'choice', q: 'You can borrow my bike ( ) you bring it back by Friday.', o: ['as long as', 'as far as', 'as soon as', 'as well as'], e: '「金曜までに返すなら（条件）」→ as long as。' },
          { t: 'choice', q: '( ) I\'m concerned, the plan is fine.', o: ['As far as', 'As long as', 'As soon as', 'So long'], e: 'as far as I\'m concerned「私に関する限り（私の考えでは）」。' },
        ],
      },
      {
        id: '3-3-3', title: '細かい注意が必要な従属接続詞（その2）in case', book: 126, pdf: [124, 125],
        points: [
          'in case S\'V\' ＝「〜するといけないから／〜する場合に備えて」。アメリカ英語では「もし〜なら」の意味でも使う。',
          'in case の節の中は、未来のことでも現在形（will は使わない）。',
          '前置詞の in case of 〜「〜の場合には」と区別する。',
        ],
        pattern: String.raw`\bin case\b`,
        questions: [
          { t: 'choice', q: 'Take an umbrella ( ) it rains.', o: ['in case', 'unless', 'so that', 'even if'], e: '「雨が降るといけないから」→ in case。' },
          { t: 'choice', q: '( ) fire, break the glass.', o: ['In case of', 'In case', 'Unless', 'Even if'], e: '後ろが名詞（fire）→ in case of。' },
          { t: 'choice', q: 'I\'ll write down the address in case I ( ) it.', o: ['forget', 'will forget', 'forgot', 'forgetting'], e: 'in case の節の中は現在形。' },
        ],
      },
      {
        id: '3-3-4', title: '細かい注意が必要な従属接続詞（その3）unless の本当の意味', book: 127, pdf: [125, 127],
        points: [
          'unless ＝「〜しない限り」。唯一の例外となる条件を表す（〜という場合を除いて）。',
          'if not と近いが、「それ以外のあらゆる場合は…」という含みが強い。仮定法とはふつう一緒に使わない。',
          'unless の節の中も、未来のことは現在形で表す。',
        ],
        pattern: String.raw`\bunless\b`,
        questions: [
          { t: 'choice', q: 'You won\'t pass the exam ( ) you study harder.', o: ['unless', 'if', 'because', 'since'], e: '「もっと勉強しない限り」→ unless。' },
          { t: 'choice', q: 'I\'ll go hiking tomorrow unless it ( ).', o: ['rains', 'will rain', 'rained', 'is going rain'], e: 'unless の節の中は現在形。' },
          { t: 'choice', q: '( ) you hurry, you\'ll miss the train.', o: ['Unless', 'If', 'As', 'When'], e: '「急がない限り、乗り遅れる」→ unless。' },
        ],
      },
      {
        id: '3-3-5', title: '従属節内での "s+be" の省略', book: 129, pdf: [127, 128],
        points: [
          'when / while / though / if などの節で、主語が主節と同じ（または it）で be動詞があるとき、「S＋be」をまとめて省略できる。',
          '省略すると、接続詞の直後に分詞・形容詞・前置詞句が来る（While in London, ... / Though tired, ...）。',
          'if necessary / if possible / when asked などは決まり文句として覚えておく。',
        ],
        pattern: String.raw`\b(when|while|though|although|if) (young|necessary|possible|asked|told|finished)\b|\bwhile (in|at|on)\b`,
        questions: [
          { t: 'choice', q: '( ) in Japan, she learned to cook sushi.', o: ['While', 'During', 'For', 'Since at'], e: 'While (she was) in Japan → S＋be の省略。' },
          { t: 'choice', q: 'Call me if ( ).', o: ['necessary', 'it necessary', 'necessity', 'necessarily'], e: 'if (it is) necessary「必要なら」。' },
          { t: 'choice', q: 'Though ( ), he kept walking.', o: ['tired', 'tiring', 'tire', 'he tired'], e: 'Though (he was) tired。' },
        ],
      },
      {
        id: '3-4-1', title: '接続詞 that の基本', book: 131, pdf: [129, 132],
        points: [
          'that S\'V\' は「S\'V\'ということ」という名詞のカタマリ（名詞節）をつくり、主語・目的語・補語になる。',
          '動詞の目的語の that はよく省略される（I think (that) he is right.）。',
          '主語になる that節は、ふつう形式主語 it を使って後ろに回す（It is true that ...）。',
        ],
        pattern: String.raw`\b(think|believe|know|say|said|hope|feel|felt) that\b|\bit (is|was) \w+ that\b`,
        questions: [
          { t: 'choice', q: 'I believe ( ) he is honest.', o: ['that', 'what', 'which', 'if that'], e: '「彼は正直だということ」→ that節（目的語）。' },
          { t: 'choice', q: '( ) is surprising that she quit her job.', o: ['It', 'That', 'What', 'This'], e: '形式主語 it ＋ that節。' },
          { t: 'choice', q: 'The problem is ( ) we don\'t have enough time.', o: ['that', 'what', 'which', 'whether that'], e: '補語の that節「〜ということ」。' },
          { t: 'order', ja: '彼が来ないのは明らかだ。', a: "It is clear that he won't come.", e: 'It is 形容詞 that 〜。' },
        ],
      },
      {
        id: '3-4-2', title: '同格の that', book: 135, pdf: [133, 135],
        points: [
          '名詞＋that S\'V\' で「S\'V\'という名詞」と、名詞の中身を説明する（the fact that ...）。',
          '関係代名詞の that と違い、同格の that の後ろは欠けている要素のない完全な文。',
          'fact / news / idea / belief / rumor / possibility / hope などの名詞がよく使われる。',
        ],
        pattern: String.raw`\bthe (fact|news|idea|belief|rumor|hope|possibility|feeling) that\b`,
        questions: [
          { t: 'choice', q: 'I heard the news ( ) he won the prize.', o: ['that', 'which', 'what', 'where'], e: 'news の中身（彼が賞を取った）を説明 → 同格の that。' },
          { t: 'choice', q: 'There is a possibility ( ) the train will be late.', o: ['that', 'which', 'what', 'of'], e: 'possibility の中身を説明する同格の that。' },
          { t: 'choice', q: '同格の that を含む文はどれ？', o: ['The idea that we should wait is reasonable.', 'The idea that he suggested is reasonable.', 'The book that I bought is interesting.', 'This is the man that helped me.'], e: 'that の後ろが完全な文（we should wait）なら同格。suggested の目的語が欠けている文は関係代名詞。' },
        ],
      },
      {
        id: '3-4-3', title: '"前置詞＋接続詞 that" という特殊パターン', book: 138, pdf: [136, 136],
        points: [
          '前置詞の後ろには原則として that節を置けない。',
          '例外：in that 〜「〜という点で」、except (that) 〜「〜ということを除けば」。',
        ],
        pattern: String.raw`\bin that (he|she|it|they|we|you|I|there|his|her|their|the)\b|\bexcept that\b`,
        questions: [
          { t: 'choice', q: 'Humans differ from other animals ( ) they can use language.', o: ['in that', 'that', 'in which that', 'for that'], e: '「〜という点で」→ in that。' },
          { t: 'choice', q: 'The room is nice ( ) it\'s a little small.', o: ['except that', 'in that', 'so that', 'now that'], e: '「少し狭いことを除けば」→ except that。' },
        ],
      },
      {
        id: '3-4-4', title: '副詞節の that について', book: 139, pdf: [137, 138],
        points: [
          '感情の形容詞の後ろの that は「〜して（感情の原因）」：I\'m glad (that) you came.',
          'be sure / be afraid / be aware + that節 もよく使う形。',
          'now that 〜「今や〜だから」も that を使った副詞節。',
        ],
        pattern: String.raw`\b(glad|sorry|sure|afraid|happy|surprised|aware) that\b|\bnow that\b`,
        questions: [
          { t: 'choice', q: 'I\'m sorry ( ) I couldn\'t help you.', o: ['that', 'what', 'which', 'if that'], e: '感情の原因 → sorry that 〜。' },
          { t: 'choice', q: '( ) you are 20, you can vote.', o: ['Now that', 'So that', 'In that', 'Except that'], e: '「今や20歳なのだから」→ now that。' },
          { t: 'choice', q: 'She was afraid ( ) she would fail.', o: ['that', 'what', 'whether that', 'of that'], e: 'be afraid that 〜「〜ではないかと心配だ」。' },
        ],
      },
      {
        id: '3-4-5', title: 'so 〜 that ... 構文の基本', book: 141, pdf: [139, 140],
        points: [
          'so 形容詞/副詞 that S\'V\' ＝「とても〜なので…」（結果）／「…するほど〜」（程度）。',
          '名詞があるときは such (a) 形容詞＋名詞 that ...。',
          '会話では that がよく省略される。',
        ],
        pattern: String.raw`\bso \w+ that\b|\bsuch an? \w+ \w+ that\b`,
        questions: [
          { t: 'choice', q: 'It was ( ) hot that we went swimming.', o: ['so', 'such', 'too', 'very'], e: '後ろが形容詞のみ → so 〜 that。' },
          { t: 'choice', q: 'It was ( ) a good movie that I watched it twice.', o: ['such', 'so', 'too', 'very'], e: '後ろが a＋形容詞＋名詞 → such 〜 that。' },
          { t: 'order', ja: '彼はとても速く走ったので、誰も追いつけなかった。', a: 'He ran so fast that nobody could catch him.', e: 'so 副詞 that 〜。' },
        ],
      },
      {
        id: '3-4-6', title: 'so 〜 that ... の発展事項', book: 143, pdf: [141, 142],
        points: [
          '文頭に So 形容詞 を出すと、後ろは倒置になる：So tired was she that she fell asleep.',
          '否定文では「…するほど〜ではない」と程度の意味になりやすい：He is not so old that he can\'t work.',
          'such that / such as to など、such を使った堅い形もある。',
        ],
        questions: [
          { t: 'choice', q: 'So angry ( ) that he couldn\'t speak.', o: ['was he', 'he was', 'he is being', 'did he'], e: '文頭に So angry → 倒置で was he。' },
          { t: 'choice', q: 'He is not so busy ( ) he can\'t help us.', o: ['that', 'as', 'so', 'then'], e: 'not so 〜 that ...「…するほど〜ではない」。' },
        ],
      },
      {
        id: '3-4-7', title: 'so that 〜 について（so 〜 that ... との区別）', book: 145, pdf: [143, 145],
        points: [
          'so that S\' can/will V\' ＝「S\'が〜できるように」（目的）。',
          ', so that 〜 のようにカンマがあると「その結果〜」（結果）の意味になりやすい。',
          'so 〜 that ...（程度・結果）とは、so と that が離れているか、くっついているかで区別する。',
        ],
        pattern: String.raw`\bso that\b`,
        questions: [
          { t: 'choice', q: 'Speak louder ( ) everyone can hear you.', o: ['so that', 'such that', 'so as', 'in that'], e: '「皆に聞こえるように」→ 目的の so that。' },
          { t: 'choice', q: 'I got up early so that I ( ) catch the first train.', o: ['could', 'would have', 'can\'t', 'must'], e: 'so that S can/could V ＝ 目的。主節が過去なので could。' },
          { t: 'choice', q: 'He missed the bus, ( ) he was late for school.', o: ['so that', 'in order that', 'so as to', 'such that'], e: 'カンマ＋so that ＝「その結果」。' },
        ],
      },
      {
        id: '3-4-8', title: '名詞節をつくる if / whether', book: 148, pdf: [146, 151],
        points: [
          'if / whether S\'V\' は「S\'V\'かどうか」という名詞節もつくる（I wonder if/whether ...）。',
          'whether は主語・補語・前置詞の後ろにも置けるが、if は主に動詞の目的語に限られる。whether A or B / whether or not も whether を使う。',
          '副詞節の if（もし〜なら）と違い、名詞節の中では未来のことに will を使う（I don\'t know if he will come.）。',
        ],
        pattern: String.raw`\b(wonder|ask|asked|know|sure|see) (if|whether)\b`,
        questions: [
          { t: 'choice', q: 'I\'m not sure ( ) he will come.', o: ['whether', 'that', 'what', 'unless'], e: '「来るかどうか」→ whether（if も可）。' },
          { t: 'choice', q: '( ) he will agree is uncertain.', o: ['Whether', 'If', 'That if', 'What'], e: '主語になる「〜かどうか」は whether。if は使えない。' },
          { t: 'choice', q: 'I don\'t know if it ( ) tomorrow.', o: ['will rain', 'rains', 'rained', 'raining'], e: '名詞節の if の中は、未来なら will を使う。' },
          { t: 'choice', q: 'It depends on ( ) you have time.', o: ['whether', 'if', 'that', 'what if'], e: '前置詞の後ろは whether。' },
        ],
      },
      {
        id: '3-5-1', title: '「現在形の特別用法」基本ルールの詳述', book: 154, pdf: [152, 153],
        points: [
          '時・条件を表す副詞節（when, if, before, after, until, as soon as, by the time, unless など）の中では、未来のことでも現在形を使う。',
          '未来のある時点までの完了を表すときは、節の中は現在完了形（until he has finished）。',
          '主節は未来の形（will など）のまま：If it rains tomorrow, I will stay home.',
        ],
        questions: [
          { t: 'choice', q: 'If it ( ) tomorrow, the game will be canceled.', o: ['rains', 'will rain', 'rained', 'is going rain'], e: '条件の副詞節の中 → 未来でも現在形。' },
          { t: 'choice', q: 'I\'ll call you when I ( ) at the station.', o: ['arrive', 'will arrive', 'arrived', 'have arrive'], e: '時の副詞節の中 → 現在形。' },
          { t: 'choice', q: 'Let\'s wait until he ( ) his homework.', o: ['has finished', 'will finish', 'will have finished', 'had finished'], e: '「終えるまで」＝未来の完了 → 節の中は現在完了形（finishes も可）。' },
          { t: 'fill', q: 'As soon as I ___ home, I\'ll send you an email. (get)', a: ['get'], e: 'as soon as の節の中は現在形。' },
        ],
      },
      {
        id: '3-5-2', title: '副詞節と名詞節の判別', book: 156, pdf: [154, 155],
        points: [
          '「現在形の特別用法」が使われるのは副詞節だけ。名詞節（〜かどうか・いつ〜か）なら、未来のことには will を使う。',
          '判別：その節を取り除いても文が成り立つなら副詞節、動詞の目的語など文に欠かせないなら名詞節。',
          'I don\'t know when he will come.（名詞節）／ Tell me when he comes.（副詞節「来たら」）。',
        ],
        questions: [
          { t: 'choice', q: 'I don\'t know when she ( ) back.', o: ['will come', 'comes', 'came', 'coming'], e: 'know の目的語（いつ戻るか）＝名詞節 → will を使う。' },
          { t: 'choice', q: 'Please tell me when she ( ) back.', o: ['comes', 'will come', 'came', 'has come back'], e: '「戻ってきたら教えて」＝副詞節 → 現在形。' },
          { t: 'choice', q: 'Do you know if it ( ) tomorrow?', o: ['will snow', 'snows', 'snowed', 'is snow'], e: 'know の目的語（雪が降るかどうか）＝名詞節 → will。' },
        ],
      },
    ],
  },
  {
    "n": 4, "title": "仮定法", "part": "Part 1 英文法の大枠を掴む",
    "toc": {"book": 159, "pdf": 156}, "intro": {"book": [160, 162], "pdf": [157, 159]},
    "sections": [
      {
        "id": "4-1-1", "title": "仮定法過去", "book": 163, "pdf": [160, 161],
        "points": [
          "仮定法過去は「今の事実に反する仮定」：If S 過去形, S would / could / might 原形。",
          "if節の be動詞は主語に関係なく were が原則（口語では was も使われる）。",
          "形は過去形でも意味は「現在」。実現の可能性が低い・ない想定を表す。",
        ],
        "pattern": "\\bif (I|he|she|it) were\\b",
        "questions": [
          {"t": "choice", "q": "If I ( ) rich, I would travel around the world.", "o": ["were", "am", "will be", "be"], "e": "主節が would travel → 今の事実に反する仮定なので if節は過去形 were。"},
          {"t": "choice", "q": "If she knew his phone number, she ( ) him.", "o": ["would call", "will call", "calls", "has called"], "e": "if節が過去形（knew）の仮定法過去 → 主節は would＋原形。"},
          {"t": "fill", "q": "If I ___ you, I wouldn't do that. (be)", "a": ["were"], "e": "If I were you「私があなたなら」は定型表現。be動詞は were。"},
          {"t": "order", "ja": "時間があれば、あなたを手伝えるのに。", "a": "If I had time, I could help you.", "e": "If S 過去形, S could 原形。「今は時間がない」ことが前提。"},
        ],
      },
      {
        "id": "4-1-2", "title": "仮定法過去完了", "book": 165, "pdf": [162, 163],
        "points": [
          "仮定法過去完了は「過去の事実に反する仮定」：If S had p.p., S would / could / might have p.p.。",
          "if節は過去完了、主節は「助動詞の過去形＋have p.p.」。両方の形をセットで覚える。",
          "現在の反事実は過去形、過去の反事実は過去完了と、時制を1つ前にずらすのが仮定法の基本。",
        ],
        "pattern": "\\bif (I|you|he|she|we|they) had (been|known|not)\\b",
        "questions": [
          {"t": "choice", "q": "If I had left home earlier, I ( ) the train.", "o": ["would have caught", "would catch", "will catch", "had caught"], "e": "if節が had left（過去の反事実）→ 主節は would have p.p.。"},
          {"t": "choice", "q": "If he ( ) harder, he would have passed the exam.", "o": ["had studied", "studied", "has studied", "would study"], "e": "主節が would have passed → if節は過去完了 had studied。"},
          {"t": "fill", "q": "If you had told me, I would have ___ you. (help)", "a": ["helped"], "e": "would have＋過去分詞 → helped。"},
          {"t": "order", "ja": "雨が降らなかったら、私たちは出かけていただろう。", "a": "If it had not rained, we would have gone out.", "e": "If S had not p.p., S would have p.p.「〜しなかったら…しただろう」。"},
        ],
      },
      {
        "id": "4-1-3", "title": "仮定法の概念・感覚", "book": 167, "pdf": [164, 165],
        "points": [
          "仮定法は「現実から距離を置く」言い方。動詞の時制を1つ過去にずらして「現実ではない」ことを示す。",
          "仮定法過去は形が過去でも意味は現在、仮定法過去完了は形が過去完了でも意味は過去。",
          "If I win（勝つかも）と If I won（まず勝てないが）の違いは、話し手が感じる実現の可能性。",
        ],
        "questions": [
          {"t": "choice", "q": "「If I were a bird, I could fly to you.」が表しているのは？", "o": ["今の事実に反する想像", "過去の事実に反する想像", "過去に実際にあったこと", "未来に確実に起こること"], "e": "仮定法過去 → 形は過去でも「今」の反事実。"},
          {"t": "choice", "q": "「宝くじに当たったら（まず当たらないだろうが）家を買うよ」に最も合う英文は？", "o": ["If I won the lottery, I would buy a house.", "If I win the lottery, I would buy a house.", "If I won the lottery, I will buy a house.", "If I had won the lottery, I will buy a house."], "e": "可能性が低い想定 → 仮定法過去（won … would buy）。if節と主節の形をそろえる。"},
          {"t": "choice", "q": "I'm sick today. If I ( ) sick, I would go to the party.", "o": ["weren't", "am not", "won't be", "haven't been"], "e": "実際は病気 → その反対を仮定法過去で表す（weren't）。"},
          {"t": "fill", "q": "He isn't here now. If he ___ here, he would help us. (be)", "a": ["were", "was"], "e": "今の事実（ここにいない）に反する仮定 → were（口語では was も可）。"},
        ],
      },
      {
        "id": "4-1-4", "title": "仮定法のセンスを磨く", "book": 169, "pdf": [166, 168],
        "points": [
          "実現の可能性があるなら直説法（If it rains, I will…）、ないなら仮定法（If I were…, I would…）。",
          "文中の but / actually / in fact などは「現実」を示す手がかり。その反対側が仮定法になる。",
          "would / could / might が見えたら「仮定法かも」と疑い、何が現実かを確認する。",
        ],
        "questions": [
          {"t": "choice", "q": "I don't have a car. If I ( ) one, I would drive you home.", "o": ["had", "have", "will have", "had had"], "e": "現実は「車がない」→ 今の反事実なので仮定法過去 had。"},
          {"t": "choice", "q": "If it ( ) tomorrow, we will stay home.", "o": ["rains", "rained", "had rained", "would rain"], "e": "主節が will → 普通の条件（直説法）。条件節は未来でも現在形。"},
          {"t": "choice", "q": "I would help you, but I ( ) too busy right now.", "o": ["am", "were", "would be", "had been"], "e": "but の後は「現実」→ 直説法 am。前半の would help が仮定。"},
          {"t": "fill", "q": "I'd buy it, but it's too expensive. If it ___ cheaper, I'd buy it. (be)", "a": ["were", "was"], "e": "現実は「高い」→ 今の反事実なので仮定法過去 were（口語では was も可）。"},
        ],
      },
      {
        "id": "4-1-5", "title": "仮定法の「公式」（応用公式）", "book": 172, "pdf": [169, 169],
        "points": [
          "混合型：If S had p.p.（過去の反事実）, S would 原形（今の反事実）。主節に now などがあることが多い。",
          "逆の混合型：If S 過去形（今も変わらない事実に反する）, S would have p.p.（過去の結果）。",
          "if節と主節の「時」を別々に判断し、それぞれに公式を当てはめるのがコツ。",
        ],
        "questions": [
          {"t": "choice", "q": "If I had taken the medicine last night, I ( ) better now.", "o": ["would feel", "would have felt", "will feel", "felt"], "e": "if節は過去（last night）、主節は今（now）→ would＋原形。"},
          {"t": "choice", "q": "If she were not so shy, she ( ) to the party yesterday.", "o": ["would have gone", "would go", "will go", "had gone"], "e": "内気なのは今も続く性格（仮定法過去）、行かなかったのは過去（yesterday）→ would have p.p.。"},
          {"t": "fill", "q": "If he had saved money then, he ___ rich now.", "a": ["would be", "could be", "might be", "'d be"], "e": "過去の反事実 → 今の結果なので would＋原形（be）。"},
          {"t": "choice", "q": "If I had not met him then, I ( ) where I am today.", "o": ["wouldn't be", "wouldn't have been", "won't be", "am not"], "e": "会ったのは過去、今の自分は現在 → wouldn't＋原形。"},
        ],
      },
      {
        "id": "4-1-6", "title": "「未来」の仮定法の公式（should / were to 〜を使った仮定法）", "book": 173, "pdf": [170, 174],
        "points": [
          "If S should 原形「万一〜なら」：可能性は低いがゼロではない。主節は命令文や will でもよい。",
          "If S were to 原形「仮に〜なら」：実現不可能な想定にも使える。主節は would などの過去形。",
          "should は主節に命令文・直説法がきてもよいが、were to の主節は仮定法（would 等）にする。",
        ],
        "pattern": "\\bif (I|you|he|she|it|we|they|anyone) (should|were to)\\b",
        "questions": [
          {"t": "choice", "q": "If you ( ) see Tom, please tell him to call me.", "o": ["should", "were to", "would", "had"], "e": "「万一会ったら」＋主節が命令文 → should。were to の主節は would 等になる。"},
          {"t": "choice", "q": "If the sun ( ) rise in the west, I would not change my mind.", "o": ["were to", "should", "will", "is to"], "e": "太陽が西から昇ることはありえない → 実現不可能な想定は were to。"},
          {"t": "fill", "q": "If it ___ rain tomorrow, the game will be canceled. (万一)", "a": ["should"], "e": "「万一〜なら」→ If S should 原形。主節は will でもよい。"},
          {"t": "order", "ja": "仮に勝ったとしたら、あなたはどうしますか。", "a": "If you were to win, what would you do?", "e": "If S were to 原形, S would 原形「仮に〜なら…」。"},
        ],
      },
      {
        "id": "4-2-1", "title": "if省略による「倒置」", "book": 178, "pdf": [175, 176],
        "points": [
          "if を省略すると疑問文の語順に倒置：If I were → Were I、If I had p.p. → Had I p.p.。",
          "If S should も Should S になる。倒置できるのは were / had / should で、一般動詞の過去形は不可。",
          "否定は Had it not been for 〜 のように not を主語の後ろに置く（Hadn't it … とはしない）。",
        ],
        "pattern": "\\b(had it not been for|were it not for|should you need)\\b",
        "questions": [
          {"t": "choice", "q": "( ) I known the truth, I would have told you.", "o": ["Had", "If", "Were", "Should"], "e": "If I had known の if を省略 → Had I known。"},
          {"t": "choice", "q": "( ) you need any help, please call me.", "o": ["Should", "Had", "Were", "Would"], "e": "If you should need の if を省略 → Should you need。"},
          {"t": "choice", "q": "( ) it not for water, no living thing could survive.", "o": ["Were", "Had", "Should", "If"], "e": "If it were not for 〜 → Were it not for 〜「〜がなければ」。"},
          {"t": "fill", "q": "___ he been more careful, the accident wouldn't have happened.", "a": ["had"], "e": "If he had been → Had he been（仮定法過去完了の倒置）。"},
        ],
      },
      {
        "id": "4-2-2", "title": "「if節がない」仮定法", "book": 180, "pdf": [177, 181],
        "points": [
          "主語・副詞句・不定詞などに条件が隠れることがある：A wise man would 〜「賢い人なら〜だろう」。",
          "without / but for 〜「〜がなければ（なかったら）」、otherwise「そうでなければ」が if節の代わりになる。",
          "would / could があるのに if がないときは、文のどこかに条件が隠れていると考える。",
        ],
        "questions": [
          {"t": "choice", "q": "( ) your help, I would have failed.", "o": ["Without", "Unless", "If", "Except"], "e": "後ろが名詞 → Without 〜「〜がなかったら」＝ If it had not been for 〜。"},
          {"t": "choice", "q": "I left early; ( ), I would have missed the train.", "o": ["otherwise", "however", "therefore", "besides"], "e": "otherwise「そうでなければ（早く出なかったら）」が条件の代わり。"},
          {"t": "choice", "q": "「A true friend would not say such a thing.」で条件（〜なら）の意味を含むのは？", "o": ["A true friend", "would", "not say", "such a thing"], "e": "主語 A true friend に「本当の友達なら」という条件が隠れている。"},
          {"t": "order", "ja": "水がなければ、私たちは生きられないだろう。", "a": "Without water, we could not live.", "e": "Without 〜 ＝ If it were not for 〜。主節は could＋原形。"},
        ],
      },
      {
        "id": "4-3-1", "title": "仮定法の基本的な慣用表現", "book": 185, "pdf": [182, 183],
        "points": [
          "It is (about / high) time S 過去形「もう〜してもよい頃だ」：まだしていないことへの不満を含む。",
          "If it were not for 〜「(今)〜がなければ」、If it had not been for 〜「(過去に)〜がなかったら」。",
          "If only 〜!「〜でさえあればなあ」は I wish より強い願望を表す。",
        ],
        "pattern": "\\b(high|about) time (you|we|they|he|she|I)\\b|\\bif only\\b|\\bif it (were|had) not (been )?for\\b",
        "questions": [
          {"t": "choice", "q": "It's time you ( ) to bed.", "o": ["went", "go", "will go", "have gone"], "e": "It is time S 過去形「もう〜する時間だ」。"},
          {"t": "choice", "q": "If it ( ) for his advice, I would have failed.", "o": ["had not been", "were not", "is not", "has not been"], "e": "主節が would have failed（過去）→ If it had not been for 〜。"},
          {"t": "choice", "q": "If it ( ) not for the sun, nothing could live.", "o": ["were", "had", "is", "has been"], "e": "主節が could live（今）→ If it were not for 〜「〜がなければ」。"},
          {"t": "fill", "q": "___ only I had listened to her!", "a": ["if"], "e": "If only 〜!「〜でさえあればなあ」。過去への後悔なので had p.p.。"},
        ],
      },
      {
        "id": "4-3-2", "title": "I wish 〜「〜ならなあ」", "book": 187, "pdf": [184, 187],
        "points": [
          "I wish S 過去形「(今)〜ならなあ」、I wish S had p.p.「(あの時)〜だったらなあ」。",
          "I wish S would 〜 は「〜してくれればいいのに」という相手や状況への不満・願い。",
          "実現の可能性がある願望には I hope（＋直説法）を使う。I wish と混同しない。",
        ],
        "pattern": "\\bI wish\\b",
        "questions": [
          {"t": "choice", "q": "I wish I ( ) taller.", "o": ["were", "am", "will be", "have been"], "e": "今の事実に反する願望 → I wish S 過去形（be は were）。"},
          {"t": "choice", "q": "I wish I ( ) harder when I was a student.", "o": ["had studied", "studied", "would study", "have studied"], "e": "学生時代（過去）への後悔 → I wish S had p.p.。"},
          {"t": "choice", "q": "I ( ) you will pass the exam.", "o": ["hope", "wish", "want", "would"], "e": "実現可能な願い＋will → hope。wish は仮定法（過去形など）をとる。"},
          {"t": "fill", "q": "I wish it ___ stop raining. (〜してくれればいいのに)", "a": ["would"], "e": "I wish S would 〜「〜してくれればいいのに」。"},
        ],
      },
      {
        "id": "4-3-3", "title": "as if 〜「まるで〜のように」", "book": 191, "pdf": [188, 189],
        "points": [
          "as if S 過去形「まるで〜であるかのように」は主節と同じ時のこと。",
          "as if S had p.p.「まるで〜だったかのように」は主節より前のこと。",
          "as though も同じ意味。口語では as if の後に直説法（He talks as if he knows.）も使う。",
        ],
        "pattern": "\\bas (if|though)\\b",
        "questions": [
          {"t": "choice", "q": "He talks as if he ( ) everything.", "o": ["knew", "know", "had been known", "knowing"], "e": "話すのと同時の内容 → as if S 過去形。"},
          {"t": "choice", "q": "She looked as if she ( ) a ghost.", "o": ["had seen", "sees", "has seen", "would see"], "e": "見えた時点より前に幽霊を見た → as if S had p.p.。"},
          {"t": "fill", "q": "He treats me as ___ I were a child.", "a": ["if", "though"], "e": "as if / as though「まるで〜のように」。"},
          {"t": "order", "ja": "彼女はまるで何も起こらなかったかのように微笑んだ。", "a": "She smiled as if nothing had happened.", "e": "微笑んだ時点より前のこと → as if＋過去完了。"},
        ],
      },
    ],
  },
  {
    "n": 5, "title": "助動詞", "part": "Part 1 英文法の大枠を掴む",
    "toc": {"book": 193, "pdf": 190}, "intro": {"book": [195, 196], "pdf": [192, 193]},
    "sections": [
      {
        "id": "5-1-1", "title": "助動詞の基本情報とwill", "book": 197, "pdf": [194, 197],
        "points": [
          "助動詞の後は必ず動詞の原形。助動詞は2つ重ねられない（will can ではなく will be able to）。",
          "will は「〜だろう（未来・推量）」「〜するつもりだ（意志）」。Will you 〜? は依頼。",
          "won't は「どうしても〜しない（拒絶）」の意味にもなる：The door won't open.",
        ],
        "questions": [
          {"t": "choice", "q": "She will ( ) speak French well next year.", "o": ["be able to", "can", "could", "may"], "e": "助動詞は2つ重ねられない → will be able to。"},
          {"t": "choice", "q": "The door ( ) open. It must be locked.", "o": ["won't", "will", "shall", "mustn't"], "e": "won't「どうしても〜しない」（拒絶）。物が主語でも使う。"},
          {"t": "choice", "q": "( ) you open the window, please?", "o": ["Will", "Shall", "Must", "Should"], "e": "Will you 〜?「〜してくれますか」（依頼）。"},
          {"t": "fill", "q": "I'll call you when I ___ home. (get)", "a": ["get"], "e": "時を表す when節では未来のことも現在形（will は使わない）。"},
        ],
      },
      {
        "id": "5-1-2", "title": "may", "book": 201, "pdf": [198, 200],
        "points": [
          "may の2大意味は「〜してもよい（許可）」と「〜かもしれない（推量）」。",
          "May I 〜? への答えは Sure. / Of course. が自然。Yes, you may. は上から目線に響く。",
          "祈願の May S 原形!「〜しますように」（May you be happy!）もある。",
        ],
        "questions": [
          {"t": "choice", "q": "( ) I use your phone? — Sure, go ahead.", "o": ["May", "Must", "Need", "Will"], "e": "May I 〜?「〜してもいいですか」（許可を求める）。"},
          {"t": "choice", "q": "Take an umbrella. It ( ) rain this afternoon.", "o": ["may", "must not", "dare", "need"], "e": "「雨が降るかもしれない」→ 推量の may。"},
          {"t": "choice", "q": "「He may be sick.」の意味は？", "o": ["彼は病気かもしれない", "彼は病気に違いない", "彼は病気のはずがない", "彼は病気になってもよい"], "e": "may＋be ＝「〜かもしれない」（推量）。"},
          {"t": "fill", "q": "___ you be happy forever!", "a": ["may"], "e": "祈願の May S 原形!「〜しますように」。"},
        ],
      },
      {
        "id": "5-1-3", "title": "must", "book": 204, "pdf": [201, 202],
        "points": [
          "must の2大意味は「〜しなければならない（義務）」と「〜に違いない（強い推量）」。",
          "must not は「〜してはいけない（禁止）」。「〜する必要はない」は don't have to / need not。",
          "must には過去形・未来形がないので、had to / will have to で代用する。",
        ],
        "questions": [
          {"t": "choice", "q": "He has been working all day. He ( ) be tired.", "o": ["must", "can't", "may not", "need not"], "e": "一日中働いた → 「疲れているに違いない」（推量の must）。"},
          {"t": "choice", "q": "You ( ) touch this button. It's dangerous.", "o": ["must not", "don't have to", "need not", "must"], "e": "危険だから「触ってはいけない」→ 禁止の must not。"},
          {"t": "choice", "q": "I ( ) get up early yesterday.", "o": ["had to", "must", "have to", "will have to"], "e": "yesterday（過去）の義務 → had to。must に過去形はない。"},
          {"t": "fill", "q": "We will ___ to wait for an hour. (must を使わずに)", "a": ["have"], "e": "未来の義務は will have to（will must は不可）。"},
        ],
      },
      {
        "id": "5-1-4", "title": "have to 〜", "book": 206, "pdf": [203, 204],
        "points": [
          "have to 〜「〜しなければならない」は規則など外部の事情による義務。過去は had to、未来は will have to。",
          "don't have to 〜 は「〜する必要はない」（不必要）で、must not（禁止）とはまったく違う。",
          "疑問文は Do I have to 〜?。発音は have to が「ハフタ」、has to が「ハスタ」のようになる。",
        ],
        "pattern": "\\b(have|has|had) to\\b",
        "questions": [
          {"t": "choice", "q": "「You don't have to come.」の意味は？", "o": ["来る必要はない", "来てはいけない", "来なければならない", "来るかもしれない"], "e": "don't have to ＝ 不必要。禁止（must not）と混同しない。"},
          {"t": "choice", "q": "( ) I have to finish this today?", "o": ["Do", "Am", "Must", "Is"], "e": "have to は一般動詞扱い → 疑問文は Do I have to 〜?。"},
          {"t": "fill", "q": "She ___ to leave early yesterday. (have)", "a": ["had"], "e": "過去の義務 → had to。"},
          {"t": "order", "ja": "明日は早く起きる必要はない。", "a": "You don't have to get up early tomorrow.", "e": "don't have to 〜「〜する必要はない」。"},
        ],
      },
      {
        "id": "5-1-5", "title": "can", "book": 208, "pdf": [205, 209],
        "points": [
          "can は「〜できる（能力）」「〜してもよい（許可）」「〜することがある（可能性）」。",
          "can't は「〜のはずがない」（強い否定の推量）で、must（〜に違いない）の反対。",
          "未来・完了では can が使えないので will be able to / have been able to とする。",
        ],
        "questions": [
          {"t": "choice", "q": "That ( ) be true. He was with me all day.", "o": ["can't", "must", "has to", "need"], "e": "一日中一緒にいた → 「本当のはずがない」→ can't。"},
          {"t": "choice", "q": "I haven't ( ) to sleep well recently.", "o": ["been able", "could", "can", "able"], "e": "現在完了では can が使えない → have been able to。"},
          {"t": "choice", "q": "( ) I borrow your pen? — Of course.", "o": ["Can", "Must", "Need", "Have"], "e": "Can I 〜?「〜してもいい？」（許可）。"},
          {"t": "fill", "q": "Anyone ___ make mistakes. (〜することがある)", "a": ["can"], "e": "可能性の can「(誰でも)〜することがある」。"},
        ],
      },
      {
        "id": "5-1-6", "title": "shall", "book": 213, "pdf": [210, 212],
        "points": [
          "Shall I 〜?「(私が)〜しましょうか」は申し出、Shall we 〜?「(一緒に)〜しましょうか」は提案。",
          "Let's 〜, shall we? のように付加疑問にも使う。",
          "法律・契約文の shall は「〜するものとする」（規定・義務）を表す。",
        ],
        "pattern": "\\bshall (I|we)\\b",
        "questions": [
          {"t": "choice", "q": "( ) I carry your bag? — Yes, please.", "o": ["Shall", "Will", "Must", "Do"], "e": "Shall I 〜?「〜しましょうか」（申し出）→ Yes, please.。"},
          {"t": "choice", "q": "Let's go for a walk, ( )?", "o": ["shall we", "will you", "don't we", "do we"], "e": "Let's 〜 の付加疑問は shall we?。"},
          {"t": "choice", "q": "( ) we dance? — Sure.", "o": ["Shall", "Will", "Must", "Have"], "e": "Shall we 〜?「(一緒に)〜しましょうか」（提案）。"},
          {"t": "order", "ja": "窓を開けましょうか。", "a": "Shall I open the window?", "e": "申し出の Shall I 〜?。"},
        ],
      },
      {
        "id": "5-2-1", "title": "「助動詞の過去形」の心構え", "book": 216, "pdf": [213, 213],
        "points": [
          "would / could / might / should は「過去」よりも「控えめ・丁寧」や「仮定」を表すことが多い。",
          "過去形の助動詞は現在形より確信度が下がる：will > would、can > could、may > might。",
          "純粋に過去の意味で使うのは、時制の一致や過去の習慣・能力を表すときなど。",
        ],
        "questions": [
          {"t": "choice", "q": "( ) you tell me the way to the station? (丁寧な依頼)", "o": ["Could", "Must", "Shall", "Need"], "e": "Could you 〜? は Can you 〜? より丁寧な依頼。過去の意味ではない。"},
          {"t": "choice", "q": "「It might rain.」と「It will rain.」を比べると？", "o": ["might の方が確信度が低い", "might は過去の推量を表す", "2つは同じ意味", "will の方が確信度が低い"], "e": "過去形の助動詞は「控えめ」→ 確信度が下がる。"},
          {"t": "choice", "q": "He said he ( ) come to the party.", "o": ["would", "will be", "is", "has"], "e": "said（過去）に合わせた時制の一致 → will が would になる。"},
          {"t": "fill", "q": "I ___ like a cup of coffee, please. (丁寧に)", "a": ["would"], "e": "would like ＝ want の丁寧な言い方。"},
        ],
      },
      {
        "id": "5-2-2", "title": "would", "book": 217, "pdf": [214, 215],
        "points": [
          "would は will の過去（時制の一致）のほか、wouldn't で「どうしても〜しなかった」（過去の拒絶）。",
          "would (often) 〜「よく〜したものだ」は過去の不規則な習慣。動作動詞にだけ使う。",
          "Would you 〜? は丁寧な依頼、would like to 〜 は want to の丁寧形。",
        ],
        "questions": [
          {"t": "choice", "q": "When I was a child, I ( ) often go fishing with my father.", "o": ["would", "will", "should", "must"], "e": "過去の習慣「よく〜したものだ」→ would (often)。"},
          {"t": "choice", "q": "The engine ( ) start, no matter how hard I tried.", "o": ["wouldn't", "won't", "shouldn't", "mustn't"], "e": "過去の拒絶「どうしても〜しなかった」→ wouldn't（tried に合わせて過去）。"},
          {"t": "choice", "q": "( ) you mind opening the window?", "o": ["Would", "Should", "Must", "Shall"], "e": "Would you mind 〜ing?「〜していただけますか」（丁寧な依頼）。"},
          {"t": "order", "ja": "彼女はどうしても私の言うことを聞こうとしなかった。", "a": "She wouldn't listen to me.", "e": "wouldn't ＝ 過去の強い拒絶。"},
        ],
      },
      {
        "id": "5-2-3", "title": "could", "book": 219, "pdf": [216, 219],
        "points": [
          "could「〜できた」は過去の一般的な能力。一度きりの成功には was able to / managed to を使う。",
          "否定の couldn't は一度きりのことにも使える（I couldn't find it.）。",
          "Could you 〜? は丁寧な依頼。It could be true.「本当かもしれない」のように可能性も表す。",
        ],
        "questions": [
          {"t": "choice", "q": "He ran fast and ( ) catch the last train.", "o": ["was able to", "could", "can", "is able to"], "e": "過去の一度きりの成功 → was able to（肯定の could は一般的な能力に使う）。"},
          {"t": "choice", "q": "I ( ) swim when I was five.", "o": ["could", "can", "will be able to", "am able to"], "e": "過去の一般的な能力 → could。"},
          {"t": "choice", "q": "( ) you help me with my homework? (丁寧な依頼)", "o": ["Could", "Must", "Shall", "Need"], "e": "Could you 〜?「〜していただけますか」。"},
          {"t": "fill", "q": "I looked everywhere, but I ___ find my key. (否定)", "a": ["couldn't", "could not", "wasn't able to", "was not able to"], "e": "否定なら一度きりのことにも couldn't が使える。"},
        ],
      },
      {
        "id": "5-2-4", "title": "might", "book": 223, "pdf": [220, 221],
        "points": [
          "might は may より控えめな推量「(ひょっとすると)〜かもしれない」。過去ではなく現在・未来のことを表す。",
          "時制の一致で may は might になる：He said he might be late.",
          "Might I 〜? はとても丁寧な（やや改まった）許可の求め方。",
        ],
        "questions": [
          {"t": "choice", "q": "Take your coat. It ( ) get cold later.", "o": ["might", "must", "need", "shall"], "e": "「寒くなるかもしれない」→ 推量の might。"},
          {"t": "choice", "q": "She said that she ( ) be late.", "o": ["might", "might have", "must have", "has"], "e": "may の時制の一致 → might＋原形。"},
          {"t": "choice", "q": "「It might be true.」の意味に最も近いのは？", "o": ["ひょっとすると本当かもしれない", "本当に違いない", "本当だったかもしれない", "本当のはずがない"], "e": "might＋原形は現在の控えめな推量。過去の意味ではない。"},
          {"t": "fill", "q": "I'm not sure, but he ___ know the answer. (may より控えめに)", "a": ["might"], "e": "may より確信度が低い推量 → might。"},
        ],
      },
      {
        "id": "5-2-5", "title": "should", "book": 225, "pdf": [222, 223],
        "points": [
          "should の2大意味は「〜すべきだ（義務・助言）」と「〜のはずだ（当然の推量）」。",
          "義務の強さは must > should。「〜すべきではない」は should not。",
          "推量の should は「予定通りなら〜のはず」：He should be home by now.",
        ],
        "questions": [
          {"t": "choice", "q": "You look tired. You ( ) go to bed early.", "o": ["should", "would", "had", "did"], "e": "「早く寝るべきだ」（助言）→ should。"},
          {"t": "choice", "q": "「You shouldn't eat so much.」の意味は？", "o": ["そんなに食べるべきではない", "そんなに食べてはいけなかった", "そんなに食べる必要はない", "そんなに食べたはずがない"], "e": "should not ＝「〜すべきではない」。"},
          {"t": "choice", "q": "The package was sent three days ago, so it ( ) arrive today.", "o": ["should", "would have", "must have", "had"], "e": "「(予定通りなら)今日着くはずだ」→ 推量の should＋原形。"},
          {"t": "fill", "q": "He left an hour ago. He ___ be home by now. (はずだ)", "a": ["should", "ought to"], "e": "当然の推量「〜のはずだ」→ should（ought to も可）。"},
        ],
      },
      {
        "id": "5-2-6", "title": "ought to 〜", "book": 227, "pdf": [224, 225],
        "points": [
          "ought to 〜 は should とほぼ同じで「〜すべきだ」「〜のはずだ」。",
          "否定は ought not to 〜（not の位置に注意）。疑問は Should I 〜? を使うのが普通。",
          "ought to have p.p.「〜すべきだったのに」は should have p.p. と同じ意味。",
        ],
        "pattern": "\\bought( not)? to\\b",
        "questions": [
          {"t": "choice", "q": "You ( ) not to drive so fast.", "o": ["ought", "should", "must", "need"], "e": "否定は ought not to 〜。to があるので ought を選ぶ。"},
          {"t": "choice", "q": "You ought ( ) see a doctor.", "o": ["to", "for", "that", "be"], "e": "ought の後には to＋原形が続く。"},
          {"t": "choice", "q": "「You ought to have come earlier.」の意味は？", "o": ["もっと早く来るべきだったのに", "もっと早く来たに違いない", "もっと早く来なければならない", "もっと早く来る必要はなかった"], "e": "ought to have p.p. ＝「〜すべきだったのに」（非難・後悔）。"},
          {"t": "fill", "q": "You ___ to have told him the truth.", "a": ["ought"], "e": "ought to have p.p.「〜すべきだったのに」。"},
        ],
      },
      {
        "id": "5-3-1", "title": "may / might を使った熟語", "book": 229, "pdf": [226, 228],
        "points": [
          "may well 〜「〜するのももっともだ」「たぶん〜するだろう」。",
          "may [might] as well 〜「〜したほうがいい（どうせなら）」。might as well A as B「BするくらいならAしたほうがまし」。",
          "so that S may [can] 〜「Sが〜するために」（目的）も may を使う表現。",
        ],
        "pattern": "\\bmay well\\b|\\b(may|might) as well\\b",
        "questions": [
          {"t": "choice", "q": "He has lost his job. He ( ) be upset.", "o": ["may well", "had well", "as well", "well as"], "e": "「動揺するのももっともだ」→ may well 〜。"},
          {"t": "choice", "q": "The last bus has gone. We ( ) walk home.", "o": ["might as well", "as well as", "may so well", "as good as"], "e": "「(どうせなら)歩いて帰ったほうがいい」→ might as well 〜。"},
          {"t": "choice", "q": "You ( ) as well throw your money away as lend it to him.", "o": ["might", "will", "must", "should"], "e": "might as well A as B「Bするくらいなら A したほうがまし」。"},
          {"t": "fill", "q": "You ___ well be surprised at the news.", "a": ["may", "might"], "e": "may well 〜「〜するのももっともだ」。"},
        ],
      },
      {
        "id": "5-3-2", "title": "shouldの特別用法（仮定法現在の代わりに使う）", "book": 232, "pdf": [229, 233],
        "points": [
          "suggest / insist / demand / propose などの後の that節は「原形」または「should＋原形」。",
          "主語や主節の時制に関係なく原形：He insisted that she go.（goes / went にしない）。否定は not＋原形。",
          "insist などが「事実を主張する」意味なら普通の時制：He insisted that he was innocent.",
        ],
        "pattern": "\\b(suggested|insisted|demanded|proposed|recommended) that\\b",
        "questions": [
          {"t": "choice", "q": "The doctor suggested that he ( ) smoking.", "o": ["stop", "stops", "stopped", "will stop"], "e": "提案の suggest → that節は原形（または should stop）。"},
          {"t": "choice", "q": "She insisted that he ( ) there alone.", "o": ["not go", "not goes", "not went", "no go"], "e": "要求の insist → that節は原形。否定は not＋原形。"},
          {"t": "fill", "q": "They demanded that the meeting ___ postponed. (be)", "a": ["be", "should be"], "e": "要求の demand → 原形 be（または should be）。"},
          {"t": "choice", "q": "He insisted that he ( ) innocent.", "o": ["was", "be", "should be", "were"], "e": "この insist は「(事実だと)主張する」→ 普通の時制の一致で was。"},
        ],
      },
      {
        "id": "5-3-3", "title": "suggest型形容詞の使い方", "book": 237, "pdf": [234, 235],
        "points": [
          "It is necessary / essential / important / vital / imperative that S (should) 原形。",
          "that節の動詞は原形（または should＋原形）。主語が三人称単数でも -s をつけない。",
          "否定は not＋原形：It is important that he not be late.",
        ],
        "questions": [
          {"t": "choice", "q": "It is necessary that every student ( ) the rules.", "o": ["follow", "following", "followed", "to follow"], "e": "necessary の後の that節 → 原形（should follow も可）。"},
          {"t": "choice", "q": "It is essential that she ( ) present at the meeting.", "o": ["be", "is being", "being", "to be"], "e": "essential の後の that節 → 原形 be。"},
          {"t": "fill", "q": "It is important that he ___ be late again. (否定)", "a": ["not", "should not", "shouldn't"], "e": "原形の否定は not＋原形（should not も可）。"},
          {"t": "order", "ja": "彼が医者に診てもらうことが絶対に必要だ。", "a": "It is essential that he see a doctor.", "e": "It is essential that S 原形。主語が he でも sees にしない。"},
        ],
      },
      {
        "id": "5-3-4", "title": "感情形容詞の語法", "book": 239, "pdf": [236, 236],
        "points": [
          "It is strange / surprising / natural / a pity that S should 〜「〜するなんて（驚き・意外・当然・残念）」。",
          "この should は「べき」と訳さず、話し手の感情や判断を強める。should なしで普通の時制も使える。",
          "過去のことなら should have p.p.：It is strange that he should have said so.「言ったなんて」。",
        ],
        "questions": [
          {"t": "choice", "q": "It is strange that he ( ) say such a thing.", "o": ["should", "need", "would have", "ought"], "e": "感情・判断（strange）の後の that節 → should＋原形「〜するなんて」。"},
          {"t": "choice", "q": "「It is a pity that you should miss the party.」の should の働きは？", "o": ["残念だという気持ちを強める", "義務（〜すべき）を表す", "推量（〜のはず）を表す", "過去を表す"], "e": "感情の should は訳さず、気持ちを強める働き。"},
          {"t": "choice", "q": "It is natural that parents ( ) worry about their children.", "o": ["should", "shall", "ought", "had"], "e": "当然（natural）の判断 → that S should 原形。"},
          {"t": "fill", "q": "It is surprising that she should ___ said that.", "a": ["have"], "e": "過去のことに対する驚き → should have p.p.。"},
        ],
      },
      {
        "id": "5-4-1", "title": "助動詞need", "book": 240, "pdf": [237, 237],
        "points": [
          "need が助動詞として使えるのは主に否定文・疑問文：You need not 〜「〜する必要はない」、Need I 〜?。",
          "肯定文では一般動詞 need to 〜 を使う（He needs to 〜）。",
          "need not have p.p. は「〜する必要はなかったのに（実際はした）」。didn't need to 〜 と区別する。",
        ],
        "pattern": "\\bneed(n't| not)\\b",
        "questions": [
          {"t": "choice", "q": "You ( ) not worry about it.", "o": ["need", "needs", "don't need", "needed"], "e": "助動詞 need は3単現の -s も過去形もなく、need not＋原形。"},
          {"t": "choice", "q": "( ) I come tomorrow? — No, you needn't.", "o": ["Need", "Have", "Am", "Did"], "e": "助動詞 need の疑問文 Need I 〜? → No, you needn't.。"},
          {"t": "choice", "q": "He ( ) to see a doctor.", "o": ["needs", "need", "need not", "needn't"], "e": "肯定文では一般動詞 need to 〜 → 三人称単数 needs。"},
          {"t": "fill", "q": "You ___ have bought milk. We already had some. (必要はなかったのに)", "a": ["needn't", "need not"], "e": "need not have p.p.「(実際は買ったが)買う必要はなかったのに」。"},
        ],
      },
      {
        "id": "5-4-2", "title": "助動詞dare", "book": 241, "pdf": [238, 238],
        "points": [
          "dare は「思い切って〜する」。助動詞としては主に否定・疑問で使う：I dare not 〜「とても〜できない」。",
          "一般動詞としても使える：He doesn't dare (to) 〜。",
          "How dare you 〜!「よくも〜できるね」は怒りを表す決まり文句。",
        ],
        "pattern": "\\bhow dare\\b|\\bdared? not\\b|\\bdaren't\\b",
        "questions": [
          {"t": "choice", "q": "How ( ) you speak to me like that!", "o": ["dare", "need", "must", "should"], "e": "How dare you 〜!「よくも〜できるね」（怒り）。"},
          {"t": "choice", "q": "He doesn't dare ( ) the question.", "o": ["to ask", "asking", "asked", "asks"], "e": "一般動詞の dare → dare (to) 原形。"},
          {"t": "fill", "q": "I ___ not ask him for more money. (dare を使って)", "a": ["dare", "dared"], "e": "助動詞 dare の否定 dare not＋原形「とても〜できない」。"},
          {"t": "order", "ja": "よくもそんなことが言えるね。", "a": "How dare you say such a thing!", "e": "How dare S 原形!。dare の後は原形。"},
        ],
      },
      {
        "id": "5-4-3", "title": "had better", "book": 242, "pdf": [239, 240],
        "points": [
          "had better 原形「〜したほうがいい（さもないと困る）」。目上の人に使うと命令・脅しに聞こえる。",
          "否定は had better not 原形（not の位置に注意）。to は入らない。",
          "短縮形は You'd better。口語では had が落ちて You better とも言う。",
        ],
        "pattern": "(\\bhad|'d) better\\b",
        "questions": [
          {"t": "choice", "q": "You ( ) see a doctor right away.", "o": ["had better", "have better", "had better to", "better had"], "e": "had better＋原形。to は入れない。"},
          {"t": "choice", "q": "You had better ( ) late.", "o": ["not be", "not to be", "don't be", "be not"], "e": "否定は had better not＋原形。"},
          {"t": "fill", "q": "It's getting dark. We'd better ___ home. (go)", "a": ["go"], "e": "'d better ＝ had better → 後ろは原形。"},
          {"t": "order", "ja": "彼にそのことを言わないほうがいい。", "a": "You had better not tell him about it.", "e": "had better not＋原形。"},
        ],
      },
      {
        "id": "5-4-4", "title": "used to 〜", "book": 244, "pdf": [241, 241],
        "points": [
          "used to 原形「(以前は)よく〜した」（過去の習慣）、「(以前は)〜だった」（過去の状態）。今は違うことを含む。",
          "be used to 〜ing「〜に慣れている」とは別物。こちらの to は前置詞で、後ろは名詞・動名詞。",
          "否定は didn't use to 〜、疑問は Did S use to 〜?。",
        ],
        "pattern": "\\b(I|you|he|she|it|we|they|there)\\s+used to\\b|\\bused to be\\b",
        "questions": [
          {"t": "choice", "q": "There ( ) be a big tree here.", "o": ["used to", "is used to", "was used to", "uses to"], "e": "過去の状態「以前は〜があった」→ There used to be 〜。"},
          {"t": "choice", "q": "I'm used to ( ) up early.", "o": ["getting", "get", "got", "have got"], "e": "be used to 〜ing「〜に慣れている」。to は前置詞。"},
          {"t": "choice", "q": "She ( ) to eat meat, but now she's a vegetarian.", "o": ["used", "is used", "was used", "uses"], "e": "「以前は食べていた（今は違う）」→ used to＋原形。"},
          {"t": "fill", "q": "___ you use to play tennis?", "a": ["did"], "e": "used to の疑問文は Did S use to 〜?。"},
        ],
      },
      {
        "id": "5-5-1", "title": "would vs. used to 〜", "book": 245, "pdf": [242, 243],
        "points": [
          "would は過去の「動作」の習慣だけ。used to は動作にも「状態」にも使える。",
          "be / have / live / know など状態を表す動詞には would は使えない：There used to be 〜。",
          "used to は「今は違う」という対比を含む。would は often / sometimes を伴い、懐かしむ感じが出る。",
        ],
        "questions": [
          {"t": "choice", "q": "Long ago, there ( ) a castle on this hill.", "o": ["used to be", "would be", "was used to", "would"], "e": "過去の状態（be）→ used to。would は状態には使えない。"},
          {"t": "choice", "q": "I ( ) live in Osaka, but now I live in Tokyo.", "o": ["used to", "would", "was used to", "would often"], "e": "live は状態動詞＋「今は違う」→ used to。"},
          {"t": "choice", "q": "On Sundays, my grandfather ( ) take me fishing.", "o": ["would", "used", "was used to", "would have"], "e": "過去の動作の習慣「よく〜してくれたものだ」→ would。"},
          {"t": "fill", "q": "He ___ to be shy, but now he's very outgoing.", "a": ["used"], "e": "be（状態）なので would は不可 → used to be。"},
        ],
      },
      {
        "id": "5-5-2", "title": "will vs. be going to 〜", "book": 247, "pdf": [244, 244],
        "points": [
          "be going to は「前から決めている予定・意図」や「今の兆候から見て〜しそうだ」。",
          "will は「その場で決めた意志」や単純な未来・予測。",
          "電話が鳴った瞬間の「私が出ます」は I'll get it.（その場の決定）。",
        ],
        "questions": [
          {"t": "choice", "q": "Look at those dark clouds. It's ( ) rain.", "o": ["going to", "will", "about", "go to"], "e": "目の前の兆候（黒い雲）から判断 → be going to。"},
          {"t": "choice", "q": "The phone is ringing. — OK, I ( ) answer it.", "o": ["will", "am going to", "was going to", "going to"], "e": "その場で決めたこと → will。"},
          {"t": "choice", "q": "I've bought some paint. I ( ) paint my room this weekend.", "o": ["am going to", "am going", "will be", "would"], "e": "ペンキを買った＝前から決めていた予定 → be going to。"},
          {"t": "fill", "q": "We are ___ to have a party tomorrow.", "a": ["going"], "e": "決まっている予定 → be going to 〜。"},
        ],
      },
      {
        "id": "5-5-3", "title": "must vs. have to 〜", "book": 248, "pdf": [245, 245],
        "points": [
          "must は話し手の主観的な義務感（「〜しなきゃ」）、have to は規則など外部の事情による義務。",
          "否定で意味が大きく変わる：must not＝禁止、don't have to＝不必要。",
          "過去・未来は have to で代用する（had to / will have to）。",
        ],
        "questions": [
          {"t": "choice", "q": "You ( ) park here. It's against the law.", "o": ["must not", "don't have to", "needn't", "have to"], "e": "法律違反＝「止めてはいけない」→ 禁止の must not。"},
          {"t": "choice", "q": "You ( ) come if you don't want to.", "o": ["don't have to", "must not", "have to", "must"], "e": "「来たくないなら来なくていい」→ 不必要の don't have to。"},
          {"t": "choice", "q": "I ( ) finish this report by tomorrow, so I can't go out tonight.", "o": ["have to", "must not", "don't have to", "had to"], "e": "今夜出かけられない理由 → 締め切りによる義務 have to。"},
          {"t": "fill", "q": "Last week I ___ to work on Saturday. (have)", "a": ["had"], "e": "must に過去形はない → had to。"},
        ],
      },
      {
        "id": "5-6-1", "title": "助動詞＋have p.p. の基本", "book": 249, "pdf": [246, 247],
        "points": [
          "「助動詞＋have p.p.」は過去のことに対する今の推量。must have p.p.「〜したに違いない」。",
          "may [might] have p.p.「〜したかもしれない」、can't [cannot] have p.p.「〜したはずがない」。",
          "助動詞の後は原形なので、過去を表すには have p.p. を使う（must went は不可）。",
        ],
        "pattern": "\\b(must|may|might|can't|cannot|couldn't) have been\\b",
        "questions": [
          {"t": "choice", "q": "The ground is wet. It ( ) rained last night.", "o": ["must have", "can't have", "need have", "must"], "e": "地面がぬれている → 「雨が降ったに違いない」→ must have p.p.。"},
          {"t": "choice", "q": "He ( ) said that. He's always so kind.", "o": ["can't have", "must have", "has to have", "need"], "e": "いつも親切な人 → 「言ったはずがない」→ can't have p.p.。"},
          {"t": "fill", "q": "I can't find my wallet. I ___ have left it on the train. (〜したかもしれない)", "a": ["may", "might", "could"], "e": "may [might] have p.p.「〜したかもしれない」。"},
          {"t": "order", "ja": "彼は道に迷ったにちがいない。", "a": "He must have lost his way.", "e": "must have p.p.「〜したに違いない」。"},
        ],
      },
      {
        "id": "5-6-2", "title": "助動詞＋have p.p. の応用", "book": 251, "pdf": [248, 249],
        "points": [
          "should [ought to] have p.p.「〜すべきだったのに」。否定 shouldn't have p.p. は「〜すべきではなかった」。",
          "need not have p.p.「〜する必要はなかったのに（実際はした）」。",
          "could have p.p.「〜できただろうに／〜したかもしれない」は、実現しなかった可能性を表す。",
        ],
        "pattern": "\\b(should|ought to|need not|needn't) have\\b",
        "questions": [
          {"t": "choice", "q": "I failed the test. I ( ) studied harder.", "o": ["should have", "must have", "need have", "can't have"], "e": "不合格 → 「もっと勉強すべきだったのに」→ should have p.p.。"},
          {"t": "choice", "q": "You ( ) brought an umbrella. It didn't rain after all.", "o": ["needn't have", "must have", "should have", "can't have"], "e": "結局雨は降らなかった → 「持ってくる必要はなかったのに」。"},
          {"t": "choice", "q": "You were lucky. You ( ) been killed.", "o": ["could have", "must have", "should have", "needn't have"], "e": "「死んでいたかもしれない（実際は助かった）」→ could have p.p.。"},
          {"t": "fill", "q": "You ___ have told her. She's very upset now. (〜すべきではなかったのに)", "a": ["shouldn't", "should not"], "e": "shouldn't have p.p.「〜すべきではなかったのに」（後悔・非難）。"},
        ],
      },
      {
        "id": "5-6-3", "title": "\"助動詞の過去形＋have p.p.\"の総整理", "book": 253, "pdf": [250, 252],
        "points": [
          "would / could / might have p.p.「〜しただろう／できただろう／したかもしれない」は仮定法過去完了の主節の形。",
          "should have p.p. には「〜すべきだったのに」（後悔）と「〜したはずだ」（推量）の2つの意味がある。",
          "could / might have p.p. は if節がなくても「(ひょっとすると)〜したかもしれない」という推量になる。",
        ],
        "questions": [
          {"t": "choice", "q": "If I had known you were busy, I ( ) you yesterday.", "o": ["would have helped", "will help", "would help", "had helped"], "e": "yesterday の反事実 → 主節は would have p.p.。"},
          {"t": "choice", "q": "「I could have won the race.」の意味は？", "o": ["レースに勝てただろうに（実際は勝てなかった）", "レースに勝つことができた（実際に勝った）", "レースに勝つべきだった", "レースに勝ったはずがない"], "e": "could have p.p. ＝ 実現しなかった可能性「〜できただろうに」。"},
          {"t": "choice", "q": "He left three hours ago. He ( ) arrived by now.", "o": ["should have", "can't have", "needn't have", "should"], "e": "「(予定通りなら)もう着いたはずだ」→ 推量の should have p.p.。"},
          {"t": "fill", "q": "Thanks for your help. Without it, I ___ have finished in time. (〜できなかっただろう)", "a": ["couldn't", "could not"], "e": "Without 〜 が条件 → couldn't have p.p.「〜できなかっただろう」。"},
        ],
      },
      {
        "id": "5-6-4", "title": "助動詞＋have p.p. の短縮形と発音・リスニングのコツ", "book": 256, "pdf": [253, 257],
        "points": [
          "口語では have が弱まり should've / would've / could've / must've と短縮される。",
          "'ve は弱く「ァヴ」と発音され of と同じ音に聞こえるが、should of と書くのは誤り。",
          "聞き取りでは「助動詞＋弱い /əv/＋過去分詞」のまとまりを意識する（例：shoulda / woulda とも聞こえる）。",
        ],
        "questions": [
          {"t": "choice", "q": "「should've」のもとの形は？", "o": ["should have", "should of", "should give", "should leave"], "e": "'ve は have の短縮形。of と書くのは誤り。"},
          {"t": "choice", "q": "I ( ) called you, but my phone was dead.", "o": ["would've", "would of", "will've", "will of"], "e": "would have の短縮 → would've。of は誤り。"},
          {"t": "fill", "q": "She must've ___ tired. (be)", "a": ["been"], "e": "must've ＝ must have → 後ろは過去分詞 been。"},
          {"t": "order", "ja": "君はもっと早くパーティーに来るべきだったのに。", "a": "You should've come to the party earlier.", "e": "should've ＝ should have p.p.「〜すべきだったのに」。"},
        ],
      },
    ],
  },
  {
    "n": 6, "title": "冠詞", "part": "Part 2 品詞の力・文型の威力",
    "toc": {"book": 261, "pdf": 258}, "intro": {"book": [262, 263], "pdf": [259, 260]},
    "sections": [
      {
        "id": "6-1-1", "title": "theの感覚", "book": 264, "pdf": [261, 263],
        "points": [
          "the は「話し手と聞き手の間で、どれのことか1つに決まる」ときに使う。",
          "前に出た名詞、状況から明らかなもの、唯一のもの（the sun）、最上級・序数詞（the first）には the。",
          "初めて話題にする、相手がどれか特定できないものには a / an を使う。",
        ],
        "questions": [
          {"t": "choice", "q": "I bought a book and a pen. ( ) book was expensive.", "o": ["The", "A", "An", "Any"], "e": "2回目に出てきた book は「さっきの本」と特定されるので the。"},
          {"t": "choice", "q": "( ) sun rises in the east.", "o": ["The", "A", "An", "Some"], "e": "太陽は1つしかない → the sun。"},
          {"t": "choice", "q": "Mt. Everest is ( ) highest mountain in the world.", "o": ["the", "a", "an", "some"], "e": "最上級は「1つに決まる」ので the。"},
          {"t": "fill", "q": "This is ___ first time I've visited Kyoto.", "a": ["the"], "e": "序数詞（first）の前は the。"},
        ],
      },
      {
        "id": "6-1-2", "title": "the＋複数形", "book": 267, "pdf": [264, 264],
        "points": [
          "the＋複数形は「特定のグループ全員」を指す。無冠詞の複数形は「一般の〜」。",
          "the＋姓の複数形＝「〜家の人々／〜夫妻」：the Smiths。",
          "山脈・諸島・複数形の国名にも the：the Alps, the Philippines, the United States。",
        ],
        "questions": [
          {"t": "choice", "q": "( ) Tanakas are coming to dinner tonight.", "o": ["The", "A", "An", "Some"], "e": "the＋姓の複数形で「田中家の人たち／田中夫妻」。"},
          {"t": "choice", "q": "「私は犬（というもの）が好きだ」を正しく表すのは？", "o": ["I like dogs.", "I like the dogs.", "I like a dog.", "I like dog."], "e": "一般の犬は無冠詞の複数形。the dogs は特定の犬たち、無冠詞単数の dog は「犬の肉」に聞こえる。"},
          {"t": "choice", "q": "We went hiking in ( ) Alps last summer.", "o": ["the", "a", "an", "some"], "e": "山脈名は the＋複数形。"},
          {"t": "order", "ja": "スミス夫妻は大阪に引っ越す予定だ。", "a": "The Smiths are going to move to Osaka.", "e": "the＋姓の複数形は複数扱い → are。"},
        ],
      },
      {
        "id": "6-2-1", "title": "aの感覚", "book": 268, "pdf": [265, 267],
        "points": [
          "a / an は「たくさんある中の、どれでもいい1つ」。相手にとって初出・不特定のものに付ける。",
          "数えられる名詞の単数形にだけ付く。綴りではなく発音で a / an を選ぶ（an hour, a university）。",
          "「1つの」のほか「〜につき」（twice a week）の意味もある。",
        ],
        "questions": [
          {"t": "choice", "q": "It took ( ) hour to get there.", "o": ["an", "a", "the", "some"], "e": "hour の h は発音しない（母音で始まる）→ an。"},
          {"t": "choice", "q": "She is ( ) university student.", "o": ["a", "an", "any", "much"], "e": "university は /j/ の子音で始まる → a。"},
          {"t": "choice", "q": "I go to the gym three times ( ) week.", "o": ["a", "the", "an", "one"], "e": "a＋単位を表す名詞で「〜につき」。"},
          {"t": "fill", "q": "There is ___ apple on the table.", "a": ["an"], "e": "apple は母音で始まる → an。"},
        ],
      },
      {
        "id": "6-2-2", "title": "\"冠詞＋固有名詞\"の考え方", "book": 271, "pdf": [268, 269],
        "points": [
          "固有名詞はもともと1つに決まるので、普通は冠詞を付けない（Tokyo, Mary）。",
          "a＋固有名詞＝「〜という人」「〜のような人」「〜の作品・製品」：a Mr. Brown, a Picasso。",
          "川・海・船・新聞などの名前には the：the Nile, the Pacific。the Edison of Japan（日本のエジソン）も。",
        ],
        "questions": [
          {"t": "choice", "q": "「加藤さんという方」から電話があった：( ) Mr. Kato called you while you were out.", "o": ["A", "The", "An", "Some"], "e": "知らない人について「〜という人」→ a＋人名。"},
          {"t": "choice", "q": "The museum has ( ) Picasso.", "o": ["a", "an", "much", "many"], "e": "a＋画家名で「〜の作品1点」。"},
          {"t": "choice", "q": "We took a boat trip down ( ) Thames.", "o": ["the", "a", "an", "some"], "e": "川の名前には the。"},
          {"t": "order", "ja": "彼は日本のエジソンと呼ばれている。", "a": "He is called the Edison of Japan.", "e": "of Japan で限定され「日本における（唯一の）エジソン」→ the。"},
        ],
      },
    ],
  },
  {
    "n": 7, "title": "名詞", "part": "Part 2 品詞の力・文型の威力",
    "toc": {"book": 273, "pdf": 270}, "intro": {"book": [274, 275], "pdf": [271, 272]},
    "sections": [
      {
        "id": "7-1-1", "title": "可算名詞（複数形について）", "book": 276, "pdf": [273, 279],
        "points": [
          "可算名詞は、単数なら a / an などを付け、複数なら -s / -es を付ける。裸の単数形では使えない。",
          "不規則な複数形：child→children, foot→feet, mouse→mice。sheep, fish は単複同形。",
          "glasses, scissors, jeans などは常に複数形。数えるときは a pair of 〜。",
        ],
        "questions": [
          {"t": "choice", "q": "There are three ( ) in the park.", "o": ["children", "child", "childs", "childrens"], "e": "child の複数形は children（-s は付けない）。"},
          {"t": "choice", "q": "My ( ) are sore after the long walk.", "o": ["feet", "foot", "foots", "feets"], "e": "foot の複数形は feet。動詞が are なので複数形。"},
          {"t": "choice", "q": "I need a new pair of ( ).", "o": ["shoes", "shoe", "shoeses", "a shoe"], "e": "a pair of の後ろは複数形。"},
          {"t": "fill", "q": "Two ___ were running around the kitchen. (mouse)", "a": ["mice"], "e": "mouse の複数形は mice。"},
        ],
      },
      {
        "id": "7-1-2", "title": "総称用法「○○というものすべて」", "book": 283, "pdf": [280, 281],
        "points": [
          "「〜というもの」は3通り：Dogs are 〜（無冠詞複数・最も普通）／A dog is 〜／The dog is 〜（堅い）。",
          "a＋単数は「どの1匹をとっても」の感覚なので、絶滅・発明など種全体の話には使えない。",
          "不可算名詞は無冠詞のまま総称になる：Water boils at 100℃.",
        ],
        "questions": [
          {"t": "choice", "q": "「私は猫が好きだ」として最も自然なのは？", "o": ["I like cats.", "I like a cat.", "I like the cat.", "I like cat."], "e": "好き嫌いの対象は無冠詞の複数形で「猫というもの」。"},
          {"t": "choice", "q": "( ) are becoming extinct in many parts of the world.", "o": ["Tigers", "A tiger", "The tiger", "Tiger"], "e": "動詞が are → 複数形の Tigers。a tiger は「1匹」なので絶滅の話にはなじまない。"},
          {"t": "choice", "q": "( ) was invented in the 19th century.", "o": ["The telephone", "A telephone", "Telephones", "Telephone"], "e": "発明品を種類全体として言うときは the＋単数。"},
          {"t": "order", "ja": "犬は人間の最良の友だ。", "a": "Dogs are man's best friend.", "e": "無冠詞複数形で犬全般を表す。"},
        ],
      },
      {
        "id": "7-2-1", "title": "不可算名詞のイメージ", "book": 285, "pdf": [282, 285],
        "points": [
          "不可算名詞は「決まった形・区切りがない」もの：物質（water, bread）や抽象概念（advice, information）。",
          "a / an を付けず、複数形にもしない。many ではなく much、few ではなく little を使う。",
          "advice, information, news, homework, equipment は日本人が数えてしまいがちな不可算名詞。",
        ],
        "pattern": "\\b(much|little) (money|water|time|food|information|advice)\\b",
        "questions": [
          {"t": "choice", "q": "Could you give me some ( )?", "o": ["advice", "advices", "an advice", "many advice"], "e": "advice は不可算 → 複数形も a も不可。"},
          {"t": "choice", "q": "I don't have ( ) money with me.", "o": ["much", "many", "a few", "a"], "e": "money は不可算 → much。"},
          {"t": "choice", "q": "He gave me ( ) about the job.", "o": ["some useful information", "a useful information", "some useful informations", "many useful information"], "e": "information は不可算。some は可算・不可算両方に使える。"},
          {"t": "fill", "q": "There ___ a lot of information on this website. (be)", "a": ["is"], "e": "不可算名詞は単数扱い → is。"},
        ],
      },
      {
        "id": "7-2-2", "title": "ひとまとめ概念の名詞", "book": 289, "pdf": [286, 287],
        "points": [
          "furniture, baggage, machinery, clothing, mail は「いろいろな物の集まり」を表す総称で不可算。",
          "個々の物は chair, suitcase, machine のような可算名詞で言う。",
          "数えるときは a piece of furniture、量は much / little で表す。",
        ],
        "questions": [
          {"t": "choice", "q": "We bought some new ( ) for the living room.", "o": ["furniture", "furnitures", "a furniture", "the furnitures"], "e": "furniture は総称の不可算名詞 → 複数形にしない。"},
          {"t": "choice", "q": "How much ( ) do you have?", "o": ["baggage", "baggages", "suitcase", "bags"], "e": "How much に続くのは不可算名詞 → baggage。"},
          {"t": "choice", "q": "There are only three ( ) in the room.", "o": ["chairs", "furnitures", "furniture", "pieces furniture"], "e": "個々の家具は chair など可算名詞で数える。"},
          {"t": "fill", "q": "She has two ___ of luggage. (piece)", "a": ["pieces"], "e": "luggage は不可算 → two pieces of luggage。"},
        ],
      },
      {
        "id": "7-2-3", "title": "不可算名詞を使って「数」を伝える", "book": 291, "pdf": [288, 289],
        "points": [
          "容器・単位で数える：a cup of coffee, a slice of bread, a sheet of paper。",
          "複数にするのは単位の方：two cups of coffee（× two cups of coffees）。",
          "a piece of は advice, news, furniture など抽象名詞・総称名詞にも使える。",
        ],
        "pattern": "\\b(a|two|three) (cups?|glass(es)?|pieces?|slices?|sheets?|loa(f|ves)|bottles?|bowls?) of\\b",
        "questions": [
          {"t": "choice", "q": "I had two ( ) of tea this morning.", "o": ["cups", "cup", "teas", "cup's"], "e": "複数にするのは単位の cup → two cups of tea。"},
          {"t": "choice", "q": "Could I have a ( ) of paper?", "o": ["sheet", "cup", "glass", "loaf"], "e": "紙1枚は a sheet of paper。"},
          {"t": "choice", "q": "Let me give you a ( ) of advice.", "o": ["piece", "sheet", "slice", "bar"], "e": "抽象名詞 advice は a piece of で数える。"},
          {"t": "fill", "q": "Please buy two ___ of bread. (loaf)", "a": ["loaves"], "e": "パンの一斤は a loaf、複数形は loaves。"},
        ],
      },
      {
        "id": "7-3-1", "title": "可算・不可算の感覚", "book": 293, "pdf": [290, 292],
        "points": [
          "同じ名詞でも、形・区切りのある「個体」なら可算、「材料・性質」なら不可算。",
          "glass（ガラス）/ a glass（コップ）、paper（紙）/ a paper（新聞・論文）、hair（髪全体）/ a hair（1本の毛）。",
          "迷ったら「具体的な1つの形が思い浮かぶか」で判断する。",
        ],
        "questions": [
          {"t": "choice", "q": "This bottle is made of ( ).", "o": ["glass", "a glass", "glasses", "the glasses"], "e": "材料としてのガラスは不可算。"},
          {"t": "choice", "q": "I read ( ) every morning on the train.", "o": ["a paper", "paper", "papers of", "a papers"], "e": "「新聞」の意味の paper は可算 → a paper。"},
          {"t": "choice", "q": "She has long black ( ).", "o": ["hair", "hairs", "a hair", "hair's"], "e": "髪の毛全体は不可算。a hair は「1本の毛」。"},
          {"t": "order", "ja": "コップ一杯の水をもらえますか。", "a": "Can I have a glass of water?", "e": "コップは可算（a glass）、水は不可算。"},
        ],
      },
      {
        "id": "7-3-2", "title": "不可算名詞→可算名詞となる現象", "book": 296, "pdf": [293, 293],
        "points": [
          "不可算名詞でも「種類」「1回の出来事」「1杯・1個の商品」を表すと可算になる。",
          "French wines（ワインの種類）、a fire（1件の火事）、two coffees（コーヒー2杯）。",
          "抽象名詞＋形容詞で「〜な1つの経験」：have a good time, a good knowledge of 〜。",
        ],
        "questions": [
          {"t": "choice", "q": "There was ( ) near the station last night.", "o": ["a fire", "fire", "fires", "much fire"], "e": "1件の火事という出来事は可算 → a fire。"},
          {"t": "choice", "q": "This shop sells many different ( ).", "o": ["cheeses", "cheese", "a cheese", "much cheese"], "e": "「種類」を数えるときは可算 → many different cheeses。"},
          {"t": "choice", "q": "We had ( ) time at the party.", "o": ["a wonderful", "wonderful", "wonderfuls", "an wonderful"], "e": "形容詞付きの time は「1つの経験」→ a wonderful time。"},
          {"t": "fill", "q": "Two ___, please. (coffee)", "a": ["coffees"], "e": "注文の「コーヒー2杯」は可算扱いできる。"},
        ],
      },
      {
        "id": "7-4-1", "title": "集合名詞（複数のものが集合して1つの名詞をつくり上げる）", "book": 297, "pdf": [294, 294],
        "points": [
          "family, team, class などは集団を1つと見れば単数扱い、構成員を意識すれば複数扱い（主に英）。",
          "police, cattle は形は単数でも常に複数扱い：The police are 〜。",
          "people は「人々」なら複数扱い。「民族・国民」の意味では可算（a people, peoples）。",
        ],
        "questions": [
          {"t": "choice", "q": "The police ( ) looking for the missing boy.", "o": ["are", "is", "was", "has"], "e": "police は常に複数扱い。"},
          {"t": "choice", "q": "My family ( ) a large one. There are eight of us.", "o": ["is", "are", "have", "be"], "e": "「大家族だ」は家族という1つの集団の話 → 単数扱いで is（a large one = a large family）。"},
          {"t": "choice", "q": "( ) people were at the concert.", "o": ["Many", "Much", "A", "Little"], "e": "people（人々）は複数扱い → many。"},
          {"t": "fill", "q": "The cattle ___ grazing in the field. (be)", "a": ["are", "were"], "e": "cattle は常に複数扱い。"},
        ],
      },
      {
        "id": "7-4-2", "title": "その他の注意すべき名詞", "book": 298, "pdf": [295, 297],
        "points": [
          "形は複数でも単数扱い：news、学問名（mathematics, physics, economics）。",
          "時間・金額・距離をひとまとまりと見ると単数扱い：Ten years is a long time.",
          "相互複数：shake hands, change trains, make friends with のように相手が2つ以上なら複数形。",
        ],
        "questions": [
          {"t": "choice", "q": "The news ( ) surprising.", "o": ["was", "were", "are", "have"], "e": "news は -s で終わるが不可算・単数扱い。"},
          {"t": "choice", "q": "Mathematics ( ) my favorite subject.", "o": ["is", "are", "were", "have"], "e": "学問名は単数扱い。"},
          {"t": "choice", "q": "I changed ( ) at Shinjuku.", "o": ["trains", "train", "a train", "the train"], "e": "乗り換えには2本の電車が関わる → change trains。"},
          {"t": "fill", "q": "She shook ___ with the guests. (hand)", "a": ["hands"], "e": "握手はお互いの手 → shake hands。"},
        ],
      },
    ],
  },
  {
    "n": 8, "title": "代名詞", "part": "Part 2 品詞の力・文型の威力",
    "toc": {"book": 301, "pdf": 298}, "intro": {"book": [302, 303], "pdf": [299, 300]},
    "sections": [
      {
        "id": "8-1-1", "title": "人称代名詞の基本", "book": 304, "pdf": [301, 302],
        "points": [
          "主格（I, he）・所有格（my, his）・目的格（me, him）・所有代名詞（mine, his）を使い分ける。",
          "動詞や前置詞の後ろは目的格：between you and me（× I）。",
          "所有代名詞は「所有格＋名詞」の代わり。a friend of mine のように a と所有格は並べない。",
        ],
        "questions": [
          {"t": "choice", "q": "This is between you and ( ).", "o": ["me", "I", "my", "mine"], "e": "前置詞 between の後ろは目的格。"},
          {"t": "choice", "q": "This bag isn't mine. It's ( ).", "o": ["hers", "her", "she", "her's"], "e": "「彼女のもの」は所有代名詞 hers（アポストロフィなし）。"},
          {"t": "choice", "q": "He is a friend of ( ).", "o": ["mine", "me", "my", "I"], "e": "a friend of＋所有代名詞 →「私の友人の1人」。"},
          {"t": "fill", "q": "Let ___ help you. (I)", "a": ["me"], "e": "let の目的語は目的格 → me。"},
        ],
      },
      {
        "id": "8-1-2", "title": "人称代名詞の応用と限定詞", "book": 306, "pdf": [303, 304],
        "points": [
          "a / the / this / my / some / no などの限定詞は、名詞の前に1つだけ置く。",
          "所有格も限定詞の仲間：× a my friend → a friend of mine、this book of mine。",
          "性別を特定しない単数（everyone など）は they / their で受けるのが現代英語で一般的。",
        ],
        "questions": [
          {"t": "choice", "q": "I really like ( ) new car of yours.", "o": ["that", "your", "a your", "the your"], "e": "限定詞は1つだけ。that＋名詞＋of yours の形にする。"},
          {"t": "choice", "q": "Everyone has ( ) own opinion.", "o": ["their", "they", "them", "theirs"], "e": "everyone は their で受けるのが一般的。own の前は所有格。"},
          {"t": "choice", "q": "「彼の友人の1人」を正しく表すのは？", "o": ["a friend of his", "a his friend", "his a friend", "a friend of him"], "e": "a と his は並べられない → a friend of his。"},
          {"t": "order", "ja": "あなたのこの計画はうまくいくと思う。", "a": "I think this plan of yours will work.", "e": "this と your は並べられない → this plan of yours。"},
        ],
      },
      {
        "id": "8-1-3", "title": "再帰代名詞（-self型の代名詞）", "book": 308, "pdf": [305, 306],
        "points": [
          "主語と目的語が同じ人・物なら目的語は -self：He hurt himself.（him だと別人になる）",
          "強調用法：I made it myself.（自分で）。この -self は省略しても文が成立する。",
          "慣用表現：by oneself（ひとりで）, enjoy oneself, help oneself to 〜, make oneself at home。",
        ],
        "pattern": "\\b(myself|yourself|himself|herself|itself|ourselves|yourselves|themselves)\\b",
        "questions": [
          {"t": "choice", "q": "Please help ( ) to the cake.", "o": ["yourself", "you", "your", "yours"], "e": "help oneself to 〜「〜を自由に取って食べる」。"},
          {"t": "choice", "q": "We enjoyed ( ) at the party.", "o": ["ourselves", "us", "ourself", "our"], "e": "enjoy oneself「楽しむ」。主語 we → ourselves。"},
          {"t": "choice", "q": "She lives by ( ).", "o": ["herself", "her", "hers", "she"], "e": "by oneself「ひとりで」。"},
          {"t": "fill", "q": "He cut ___ while cooking. (he)", "a": ["himself"], "e": "主語と目的語が同一人物 → himself。"},
        ],
      },
      {
        "id": "8-1-4", "title": "「一般の人」を表す代名詞（you / we / they の区別）", "book": 310, "pdf": [307, 308],
        "points": [
          "you：話し手も聞き手も含む「人は誰でも」。口語で最もよく使う。",
          "we：話し手が属する集団（私たち日本人・人間など）を代表して言う。",
          "they：話し手・聞き手を含まない「その土地の人々・関係者」。They say 〜「〜だそうだ」。",
        ],
        "pattern": "\\bthey say\\b",
        "questions": [
          {"t": "choice", "q": "「（日本人の私が言う）日本では車は左側通行だ」：In Japan, ( ) drive on the left.", "o": ["we", "they", "it", "one"], "e": "話し手自身が属する集団 → we。"},
          {"t": "choice", "q": "( ) never know what will happen.", "o": ["You", "They", "It", "He"], "e": "誰にでも当てはまる一般論 → you（You never know.）。"},
          {"t": "choice", "q": "「オーストラリアでは英語が話されている」：( ) speak English in Australia.", "o": ["They", "We", "It", "One"], "e": "話し手・聞き手を含まない、その土地の人々 → they。"},
          {"t": "order", "ja": "彼はいい医者だそうだ。", "a": "They say he is a good doctor.", "e": "They say 〜「（世間では）〜と言われている」。"},
        ],
      },
      {
        "id": "8-2-1", "title": "itの特別用法（その1）漠然としたit", "book": 312, "pdf": [309, 309],
        "points": [
          "天候・寒暖・時間・距離・明暗を表す文の主語は it（訳さない）：It's raining.",
          "It takes＋時間＋to do「〜するのに…かかる」、How far is it to 〜? など定型表現が多い。",
          "状況の it：How's it going? / Take it easy. / That's it. も漠然とその場の状況を指す。",
        ],
        "pattern": "\\bit (is|was|'s) (raining|snowing|getting dark|getting cold|cold|dark)\\b",
        "questions": [
          {"t": "choice", "q": "( ) rained a lot last night.", "o": ["It", "There", "That", "Weather"], "e": "天候の it。"},
          {"t": "choice", "q": "( ) takes about two hours to get there by car.", "o": ["It", "That", "This", "There"], "e": "It takes＋時間＋to do。"},
          {"t": "choice", "q": "( ) is ten minutes' walk from here to the station.", "o": ["It", "This", "There", "That"], "e": "距離・時間の it。"},
          {"t": "fill", "q": "___ is getting colder day by day.", "a": ["it"], "e": "寒暖を表す it。"},
        ],
      },
      {
        "id": "8-2-2", "title": "itの特別用法（その2）仮主語・仮目的語のit", "book": 313, "pdf": [310, 311],
        "points": [
          "長い主語（to不定詞・that節など）は後ろに回し、主語の位置に仮主語 it を置く：It is important to 〜.",
          "SVOC の O が長いときは仮目的語 it：I found it difficult to 〜. / make it a rule to 〜。",
          "仮目的語の it は省略できない：× I found difficult to 〜。",
        ],
        "pattern": "\\bit (is|was) (easy|hard|difficult|important|impossible|necessary) (to|for)\\b|\\b(find|found|make|made|think|thought) it (easy|hard|difficult|impossible)\\b",
        "questions": [
          {"t": "choice", "q": "( ) is difficult to learn a new language.", "o": ["It", "That", "This", "There"], "e": "to learn 以下が真主語。仮主語は it。"},
          {"t": "choice", "q": "I found ( ) easy to answer the question.", "o": ["it", "that", "this", "what"], "e": "to answer 以下が真目的語。仮目的語 it を置く。"},
          {"t": "fill", "q": "It is strange ___ he didn't come.", "a": ["that"], "e": "that 節が真主語。"},
          {"t": "order", "ja": "彼女は毎朝走ることにしている。", "a": "She makes it a rule to run every morning.", "e": "make it a rule to do「〜することにしている」。it は仮目的語。"},
        ],
      },
      {
        "id": "8-2-3", "title": "itにまつわる細かいこと", "book": 315, "pdf": [312, 312],
        "points": [
          "強調構文 It is X that 〜：X を強調。It is と that を除いて文が成立すれば強調構文。",
          "It is＋期間＋since 〜「〜して…になる」、It won't be long before 〜「まもなく〜」。",
          "It seems that S V ＝ S seems to V。It is said that 〜 も S is said to 〜 にできる。",
        ],
        "pattern": "\\bit (is|was) said that\\b|\\bit won't be long before\\b",
        "questions": [
          {"t": "choice", "q": "It was Ken ( ) broke the window.", "o": ["who", "what", "which", "where"], "e": "強調構文。強調するものが人なら that の代わりに who も使える。"},
          {"t": "choice", "q": "It ( ) three years since we moved here.", "o": ["has been", "is being", "was", "will be"], "e": "It has been＋期間＋since 〜「〜してから…になる」。"},
          {"t": "choice", "q": "It won't be long ( ) spring comes.", "o": ["before", "after", "until", "since"], "e": "It won't be long before 〜「まもなく〜」。"},
          {"t": "fill", "q": "It is said ___ he was a great pianist.", "a": ["that"], "e": "It is said that 〜 ＝ He is said to have been 〜。"},
        ],
      },
      {
        "id": "8-2-4", "title": "the other vs. another", "book": 316, "pdf": [313, 315],
        "points": [
          "another＝an＋other「（不特定の）もう1つ・別の1つ」。単数名詞と使う。",
          "the other＝「2つのうちの残りの1つ」。残りが1つに決まるので the。",
          "one 〜, the other …（2つの場合）。another three days「さらに3日」のように数詞＋複数名詞も可。",
        ],
        "pattern": "\\bthe other (one|hand|side)\\b|\\banother\\b",
        "questions": [
          {"t": "choice", "q": "I have two brothers. One lives in Tokyo, and ( ) lives in Osaka.", "o": ["the other", "another", "other", "the others"], "e": "2人のうち残りの1人 → the other。"},
          {"t": "choice", "q": "I've finished my coffee. Could I have ( ) cup?", "o": ["another", "the other", "other", "others"], "e": "「もう1杯」→ another。"},
          {"t": "choice", "q": "To know is one thing; to teach is ( ).", "o": ["another", "the other", "other", "others"], "e": "A is one thing; B is another.「A と B は別物だ」。"},
          {"t": "fill", "q": "I'll stay here for ___ three days. (さらに3日)", "a": ["another"], "e": "another＋数詞＋複数名詞「さらに〜」。"},
        ],
      },
      {
        "id": "8-2-5", "title": "the others vs. others など", "book": 319, "pdf": [316, 317],
        "points": [
          "the others＝「残り全部」（特定）。others＝「他の人・物（の一部）」（不特定）。",
          "Some 〜, others …「〜する人もいれば、…する人もいる」。",
          "3つの場合：one 〜, another …, the other …（最後の1つ）。",
        ],
        "pattern": "\\bthe others\\b",
        "questions": [
          {"t": "choice", "q": "Some people like summer; ( ) like winter.", "o": ["others", "the other", "another", "other"], "e": "Some 〜, others …「〜な人もいれば…な人もいる」。"},
          {"t": "choice", "q": "Ten students came. Three of them stayed, and ( ) went home.", "o": ["the others", "others", "another", "the other"], "e": "残りの7人全員 → the others。"},
          {"t": "choice", "q": "I have three pens. One is red, another is blue, and ( ) is black.", "o": ["the other", "another", "others", "the others"], "e": "3本のうち最後の1本 → the other（単数）。"},
          {"t": "fill", "q": "Be kind to ___. (他人)", "a": ["others"], "e": "不特定の「他の人々」→ others。"},
        ],
      },
      {
        "id": "8-2-6", "title": "it vs. one vs. that「それ」の表し方", "book": 321, "pdf": [318, 321],
        "points": [
          "it＝前に出た「その物そのもの」（the＋名詞）。one＝同じ種類の不特定の1つ（a＋名詞）。",
          "that＝the＋名詞の代わりで、of 〜 などの修飾語が付く比較文に多い。複数なら those。",
          "one は可算名詞の代わりだけ。不可算名詞を受けるなら that を使う。",
        ],
        "pattern": "\\b(that|those) of the\\b",
        "questions": [
          {"t": "choice", "q": "I lost my umbrella, so I have to buy ( ).", "o": ["one", "it", "that", "them"], "e": "なくした傘そのものではなく「傘を1本」→ one。"},
          {"t": "choice", "q": "I lost my umbrella, but I found ( ) under my desk.", "o": ["it", "one", "that", "ones"], "e": "なくした傘そのもの → it。"},
          {"t": "choice", "q": "The population of Tokyo is larger than ( ) of Osaka.", "o": ["that", "it", "one", "this"], "e": "the population の繰り返しを避ける → that of 〜。"},
          {"t": "fill", "q": "The ears of a rabbit are longer than ___ of a cat.", "a": ["those"], "e": "複数名詞 the ears の繰り返しを避ける → those。"},
        ],
      },
      {
        "id": "8-3-1", "title": "2 vs. 3以上", "book": 325, "pdf": [322, 323],
        "points": [
          "2つ（2人）には both / either / neither / between、3つ以上には all / any / none / among。",
          "both A and B / either A or B / neither A nor B。either / neither 単独なら単数扱いが原則。",
          "2者の比較で「〜の方」は the＋比較級：the taller of the two。",
        ],
        "questions": [
          {"t": "choice", "q": "I have two sisters. ( ) of them are married.", "o": ["Both", "All", "Either", "Neither"], "e": "2人とも＋複数動詞 are → both。all は3人以上。"},
          {"t": "choice", "q": "There are two roads. You can take ( ) road.", "o": ["either", "any", "all", "both"], "e": "2つのうちどちらでも → either＋単数名詞。"},
          {"t": "choice", "q": "I asked three people, but ( ) of them knew the answer.", "o": ["none", "neither", "either", "both"], "e": "3人以上で「誰も〜ない」→ none。"},
          {"t": "fill", "q": "The money was divided ___ the two brothers.", "a": ["between"], "e": "2者の間 → between。"},
        ],
      },
      {
        "id": "8-3-2", "title": "most vs. almost など", "book": 327, "pdf": [324, 327],
        "points": [
          "most は形容詞「たいていの」：most people。「〜のほとんど」は most of the＋名詞。",
          "almost は副詞なので名詞を直接修飾できない：almost all (the) students（× almost students）。",
          "most of の後ろは the / my / these などの付いた名詞か代名詞：× most of students。",
        ],
        "pattern": "\\bmost of (the|my|his|her|their|them|us)\\b|\\balmost (all|every)\\b",
        "questions": [
          {"t": "choice", "q": "( ) students in this class have smartphones.", "o": ["Most", "Almost", "Most of", "Almost of"], "e": "無冠詞の名詞の前 → 形容詞の most。most of なら the が必要。"},
          {"t": "choice", "q": "( ) of my friends live in Tokyo.", "o": ["Most", "Almost", "Mostly", "The most"], "e": "most of＋my 〜「〜のほとんど」。almost は副詞で of の前に単独では置けない。"},
          {"t": "choice", "q": "( ) all the guests arrived on time.", "o": ["Almost", "Most", "Mostly", "Most of"], "e": "all を修飾する副詞 → almost all。"},
          {"t": "order", "ja": "彼はほとんど毎日泳ぎに行く。", "a": "He goes swimming almost every day.", "e": "almost は every を修飾する副詞。"},
        ],
      },
      {
        "id": "8-3-3", "title": "「部分のof」があるときの「主語と動詞の一致」", "book": 331, "pdf": [328, 328],
        "points": [
          "most of / some of / half of / the rest of などは、of の後ろの名詞に動詞を一致させる。",
          "Half of the cake was eaten. / Half of the students were absent.",
          "one of＋複数名詞は「1つ」なので単数扱い：One of my friends lives in Paris.",
        ],
        "questions": [
          {"t": "choice", "q": "Most of the money ( ) spent on food.", "o": ["was", "were", "have", "are"], "e": "money は不可算 → 単数扱い。"},
          {"t": "choice", "q": "Some of the students ( ) absent today.", "o": ["are", "is", "was", "has"], "e": "students は複数 → 複数扱い。"},
          {"t": "choice", "q": "One of my friends ( ) in Canada.", "o": ["lives", "live", "are living", "have lived"], "e": "主語の中心は one → 単数扱い。"},
          {"t": "fill", "q": "The rest of the apples ___ rotten. (be ※現在形)", "a": ["are"], "e": "the rest of の後ろ apples が複数 → are。"},
        ],
      },
    ],
  },
  {
    "n": 9, "title": "形容詞", "part": "Part 2 品詞の力・文型の威力",
    "toc": {"book": 333, "pdf": 329}, "intro": {"book": [334, 335], "pdf": [330, 331]},
    "sections": [
      {
        "id": "9-1-1", "title": "形容詞の2用法", "book": 336, "pdf": [332, 335],
        "points": [
          "名詞の前に置く限定用法（a happy girl）と、補語になる叙述用法（She is happy）がある。",
          "asleep, awake, alive, afraid, alone など a- で始まる形容詞は叙述用法のみ（× an asleep baby）。",
          "main, only, elder, mere などは限定用法のみ（× The reason is main.）。",
        ],
        "pattern": "\\b(is|was|are|were|fell|fall) (fast )?(asleep|awake|alive|afraid)\\b",
        "questions": [
          {"t": "choice", "q": "Look at the ( ) baby.", "o": ["sleeping", "asleep", "sleep", "slept"], "e": "asleep は名詞の前に置けない → sleeping。"},
          {"t": "choice", "q": "The fish is still ( ).", "o": ["alive", "live", "life", "lives"], "e": "補語の位置 → alive（live は名詞の前でのみ「生きている」）。"},
          {"t": "choice", "q": "Tom is the ( ) person who knows the secret.", "o": ["only", "alone", "lonely", "one"], "e": "名詞の前 → only。alone は叙述用法のみ。"},
          {"t": "fill", "q": "The cat is fast ___. (sleep)", "a": ["asleep"], "e": "be fast asleep「ぐっすり眠っている」。"},
        ],
      },
      {
        "id": "9-1-2", "title": "制限がある形容詞（人を主語にしない形容詞）", "book": 340, "pdf": [336, 336],
        "points": [
          "convenient, possible, necessary などは物・事が主語。人は主語にしない（× I am convenient.）。",
          "人を表したいときは It is 〜 for 人 to do：It is necessary for you to go.",
          "逆に able, happy, glad, sorry などは人が主語：× It is able for me to 〜 → I am able to 〜。",
        ],
        "questions": [
          {"t": "choice", "q": "Please come when ( ) convenient for you.", "o": ["it is", "you are", "you will be", "it will"], "e": "convenient は人を主語にしない → it is。"},
          {"t": "choice", "q": "( ) is impossible for me to finish this today.", "o": ["It", "I", "This", "There"], "e": "impossible は人を主語にしない → 仮主語 It。"},
          {"t": "choice", "q": "「彼はその箱を持ち上げることができる」を正しく表すのは？", "o": ["He is able to lift the box.", "It is able for him to lift the box.", "He is possible to lift the box.", "He is possible lifting the box."], "e": "able は人が主語、possible は人を主語にしない。"},
          {"t": "order", "ja": "私がそこへ行く必要がありますか。", "a": "Is it necessary for me to go there?", "e": "necessary は人を主語にしない → It is necessary for 人 to do。"},
        ],
      },
      {
        "id": "9-1-3", "title": "形容詞の位置（前か後ろか？）", "book": 341, "pdf": [337, 340],
        "points": [
          "-thing / -body / -one を修飾する形容詞は後ろに置く：something cold, anyone interesting。",
          "形容詞に語句が付いて長くなると名詞の後ろへ：a basket full of apples。",
          "前後で意味が変わる形容詞：the present members（現在の）/ the members present（出席している）。",
        ],
        "pattern": "\\b(something|anything|nothing|someone|anyone|somebody) (new|good|bad|wrong|strange|special|interesting|cold|hot|else)\\b",
        "questions": [
          {"t": "choice", "q": "I want something ( ).", "o": ["cold to drink", "to drink cold", "cold drink", "drink cold"], "e": "something＋形容詞＋to不定詞の語順。"},
          {"t": "choice", "q": "He has a basket ( ) apples.", "o": ["full of", "fully of", "full with", "filling"], "e": "full of apples が長いので名詞の後ろから修飾。"},
          {"t": "choice", "q": "「出席していたメンバーは全員賛成した」：All the members ( ) agreed.", "o": ["present", "presented", "presence", "presently"], "e": "名詞の後ろの present は「出席している」。"},
          {"t": "fill", "q": "Is there anything ___ in today's paper? (面白い)", "a": ["interesting"], "e": "anything＋形容詞の語順。"},
        ],
      },
      {
        "id": "9-1-4", "title": "形容詞の順番", "book": 345, "pdf": [341, 342],
        "points": [
          "複数の形容詞は「評価→大小→新旧→形→色→出所→材料」の順が基本。",
          "例：a beautiful small old wooden box（評価→大小→新旧→材料）。",
          "冠詞・所有格などの限定詞が最初、次に序数、その次に数詞：the first three days。",
        ],
        "questions": [
          {"t": "choice", "q": "She was wearing a ( ) dress.", "o": ["beautiful long red", "red long beautiful", "long red beautiful", "beautiful red long"], "e": "評価（beautiful）→大きさ（long）→色（red）。"},
          {"t": "choice", "q": "He bought ( ) car.", "o": ["a new black Japanese", "a Japanese black new", "a black new Japanese", "a new Japanese black"], "e": "新旧（new）→色（black）→出所（Japanese）。"},
          {"t": "choice", "q": "( ) days were very busy.", "o": ["The first three", "The three first", "First the three", "Three the first"], "e": "限定詞→序数→数詞の順。"},
          {"t": "order", "ja": "彼女は小さな古い木の箱を持っている。", "a": "She has a small old wooden box.", "e": "大小→新旧→材料の順。"},
        ],
      },
      {
        "id": "9-1-5", "title": "形容詞の品詞変化（ハイフン形容詞 / the＋形容詞）", "book": 347, "pdf": [343, 345],
        "points": [
          "「数詞-名詞」をハイフンでつなぐと形容詞になり、名詞は単数形：a ten-year-old boy, a five-minute walk。",
          "the＋形容詞＝「〜な人々」で複数扱い：the rich, the young, the elderly。",
          "the＋形容詞が抽象的な「〜なもの」を表すこともある：the unknown（未知のもの）。",
        ],
        "pattern": "\\b[a-z]+-(year|minute|hour|day|week)-old\\b|\\b[a-z]+-(minute|hour|day|week) (walk|drive|trip|break)\\b",
        "questions": [
          {"t": "choice", "q": "He is a ( ) boy.", "o": ["ten-year-old", "ten-years-old", "ten years-old", "ten-year-olds"], "e": "ハイフンでつないだ形容詞の中の名詞は単数形。"},
          {"t": "choice", "q": "The rich ( ) not always happy.", "o": ["are", "is", "was", "has"], "e": "the＋形容詞「〜な人々」は複数扱い。"},
          {"t": "choice", "q": "We should help ( ).", "o": ["the poor", "poor", "the poors", "a poor"], "e": "the poor「貧しい人々」。形容詞なので -s は付けない。"},
          {"t": "fill", "q": "It's a ten-___ walk to the station. (minute)", "a": ["minute"], "e": "ハイフン形容詞の中は単数形 → ten-minute。"},
        ],
      },
      {
        "id": "9-2-1", "title": "見た目が似ている形容詞（forgetful / forgettable など）", "book": 350, "pdf": [346, 350],
        "points": [
          "forgetful（忘れっぽい）/ forgettable（忘れられやすい）のように語尾で意味が変わる。",
          "sensitive（敏感な）/ sensible（分別のある）、economic（経済の）/ economical（節約になる）。",
          "considerate（思いやりのある）/ considerable（かなりの）、industrious（勤勉な）/ industrial（産業の）。",
        ],
        "questions": [
          {"t": "choice", "q": "My grandmother is getting ( ); she often forgets where she puts her glasses.", "o": ["forgetful", "forgettable", "forgotten", "forgetting"], "e": "forgetful「忘れっぽい」。forgettable は「忘れられやすい」。"},
          {"t": "choice", "q": "This car is very ( ); it uses little gas.", "o": ["economical", "economic", "economy", "economics"], "e": "economical「節約になる」。economic は「経済の」。"},
          {"t": "choice", "q": "It was very ( ) of you to help me.", "o": ["considerate", "considerable", "consider", "considering"], "e": "considerate「思いやりのある」。considerable は「かなりの」。"},
          {"t": "fill", "q": "She is very ___ to criticism. (sensitive / sensible のどちらか)", "a": ["sensitive"], "e": "sensitive to 〜「〜に敏感な」。sensible は「分別のある」。"},
        ],
      },
      {
        "id": "9-2-2", "title": "単語の相性（コロケーション）", "book": 355, "pdf": [351, 352],
        "points": [
          "形容詞と名詞には決まった相性がある：heavy rain / heavy traffic（× strong rain）。",
          "population, audience, income の大小は large / small で表す（× many / much）。",
          "price は high / low（× expensive / cheap）。コーヒーの濃さは strong / weak。",
        ],
        "questions": [
          {"t": "choice", "q": "We had ( ) rain last night.", "o": ["heavy", "strong", "big", "many"], "e": "「大雨」は heavy rain。"},
          {"t": "choice", "q": "Tokyo has a very ( ) population.", "o": ["large", "many", "much", "wide"], "e": "population の大小は large / small。"},
          {"t": "choice", "q": "The price of this watch is too ( ).", "o": ["high", "expensive", "big", "much"], "e": "price は high / low。expensive は物が主語のとき。"},
          {"t": "fill", "q": "There was ___ traffic on the road this morning. (交通量が多い)", "a": ["heavy"], "e": "「交通量が多い」は heavy traffic。"},
        ],
      },
      {
        "id": "9-2-3", "title": "数量形容詞（数の大小を表す形容詞）", "book": 357, "pdf": [353, 355],
        "points": [
          "可算名詞には many / a few / few、不可算名詞には much / a little / little を使う。",
          "a の有無で意味が変わる：a few friends（少しはいる）/ few friends（ほとんどいない）。",
          "quite a few は「かなり多くの」。肯定文では many / much より a lot of が自然なことが多い。",
        ],
        "pattern": "\\bquite a few\\b|\\ba few\\b",
        "questions": [
          {"t": "choice", "q": "There is ( ) milk left. Let's buy some.", "o": ["little", "few", "a few", "many"], "e": "milk は不可算。「ほとんどない」から買いに行く → little。"},
          {"t": "choice", "q": "I have ( ) friends here, so I'm not lonely.", "o": ["a few", "few", "little", "much"], "e": "可算で「少しはいる」→ a few。"},
          {"t": "choice", "q": "( ) people came to the party. There were more than fifty.", "o": ["Quite a few", "Few", "A little", "Little"], "e": "quite a few「かなり多くの」。"},
          {"t": "fill", "q": "How ___ money do you need?", "a": ["much"], "e": "money は不可算 → how much。"},
        ],
      },
      {
        "id": "9-2-4", "title": "数・量どちらにも使える形容詞", "book": 360, "pdf": [356, 357],
        "points": [
          "a lot of / lots of / plenty of / some / any / no / enough は可算・不可算どちらにも使える。",
          "more / most も両方に使える：more books / more water。",
          "much / little は不可算、many / few / a number of は可算専用。数は fewer、量は less が原則。",
        ],
        "pattern": "\\bplenty of\\b",
        "questions": [
          {"t": "choice", "q": "We have ( ) time, so don't hurry.", "o": ["plenty of", "many", "a number of", "few"], "e": "time は不可算。plenty of は可算・不可算どちらにも使える。"},
          {"t": "choice", "q": "There aren't ( ) chairs for everyone.", "o": ["enough", "much", "little", "a great deal of"], "e": "enough は可算にも使える。much / little / a great deal of は不可算用。"},
          {"t": "choice", "q": "She has ( ) books than I do.", "o": ["more", "much", "many", "most"], "e": "than があるので比較級 more。more は可算・不可算両用。"},
          {"t": "fill", "q": "There were ___ mistakes in his report than in mine. (少ない)", "a": ["fewer"], "e": "可算名詞の「より少ない」は fewer。"},
        ],
      },
      {
        "id": "9-2-5", "title": "numberを使った表現", "book": 362, "pdf": [358, 360],
        "points": [
          "a number of＋複数名詞「いくつかの・多くの」は複数扱い。the number of＋複数名詞「〜の数」は単数扱い。",
          "数の大小は large / small で表す：a large number of 〜（× a many number of）。",
          "量には amount を使う：a large amount of money。",
        ],
        "pattern": "\\b(a|the) (large |small |great )?number of\\b",
        "questions": [
          {"t": "choice", "q": "The number of students ( ) increasing.", "o": ["is", "are", "have", "were"], "e": "the number of 〜「〜の数」→ 単数扱い。"},
          {"t": "choice", "q": "A number of people ( ) waiting outside.", "o": ["were", "was", "has", "is"], "e": "a number of 〜「多くの〜」→ 複数扱い。"},
          {"t": "choice", "q": "A ( ) number of tourists visit Kyoto every year.", "o": ["large", "many", "much", "lot"], "e": "number の大小は large / small。"},
          {"t": "fill", "q": "He spent a large ___ of money on the car.", "a": ["amount", "sum"], "e": "不可算名詞の量は a large amount of（金額なら sum も可）。"},
        ],
      },
      {
        "id": "9-2-6", "title": "each / every / either の特徴", "book": 365, "pdf": [361, 363],
        "points": [
          "each「それぞれの」は2つ以上について単数扱い。代名詞でも使える：Each of them has 〜。",
          "every「どれもみな」は3つ以上で単数扱い。代名詞にならない（× every of）。every＋数詞＋複数名詞「〜ごとに」。",
          "either「どちらか一方」は2つ。on either side of 〜 は「両側に」の意味になる。",
        ],
        "pattern": "\\beach of\\b|\\bevery (two|three|four|five|other) [a-z]+s?\\b|\\bon either side\\b",
        "questions": [
          {"t": "choice", "q": "( ) of the students has a computer.", "o": ["Each", "Every", "All", "Both"], "e": "of を伴い単数動詞 has → each。every of は不可。"},
          {"t": "choice", "q": "Every student ( ) to wear a uniform.", "o": ["has", "have", "are", "were"], "e": "every＋単数名詞は単数扱い。"},
          {"t": "choice", "q": "There are trees on ( ) side of the street.", "o": ["either", "every", "all", "both"], "e": "on either side of 〜「〜の両側に」。both なら sides になる。"},
          {"t": "fill", "q": "The Olympics are held every four ___. (year)", "a": ["years"], "e": "every＋数詞＋複数名詞「〜ごとに」。"},
        ],
      },
    ],
  },
  {
    "n": 10, "title": "副詞", "part": "Part 2 品詞の力・文型の威力",
    "toc": {"book": 369, "pdf": 364}, "intro": {"book": [370, 371], "pdf": [365, 366]},
    "sections": [
      {
        "id": "10-1-1", "title": "副詞の認識（名詞との区別）", "book": 372, "pdf": [367, 368],
        "points": [
          "home / abroad / overseas / upstairs / downstairs / here / there は名詞ではなく副詞として使うのが基本。",
          "副詞なので前置詞は不要：go home（×go to home）、go abroad（×go to abroad）。",
          "yesterday / last year / next week / this morning など時を表す語句も副詞的に使い、前に前置詞を置かない。",
        ],
        "pattern": "\\b(go|goes|went|gone|going|come|comes|came|coming|get|gets|got|run|ran) (home|abroad|overseas|upstairs|downstairs)\\b",
        "questions": [
          {"t": "choice", "q": "He went ( ) last year to study art.", "o": ["abroad", "to abroad", "in abroad", "at abroad"], "e": "abroad は副詞なので前置詞をつけない。"},
          {"t": "choice", "q": "I got ( ) very late last night.", "o": ["home", "to home", "at home", "in home"], "e": "get home「家に着く」。home は副詞なので to は不要。"},
          {"t": "fill", "q": "My room is ___ . Please come up. (上の階に)", "a": ["upstairs"], "e": "upstairs「上の階に」は副詞。"},
          {"t": "order", "ja": "下に降りて朝食を食べよう。", "a": "Let's go downstairs and have breakfast.", "e": "go downstairs：downstairs は副詞なので前置詞なし。"},
        ],
      },
      {
        "id": "10-1-2", "title": "副詞の語尾", "book": 374, "pdf": [369, 371],
        "points": [
          "形容詞＋-ly で副詞になるのが基本：careful → carefully、quick → quickly。",
          "friendly / lovely / lonely / costly / elderly など「名詞＋-ly」の語は形容詞なので注意。",
          "fast / hard / early / late / high などは形容詞と副詞が同じ形（×fastly）。",
        ],
        "questions": [
          {"t": "choice", "q": "次のうち、形容詞であるものはどれか。", "o": ["lovely", "slowly", "quickly", "carefully"], "e": "lovely は love（名詞）＋ly で形容詞。他は形容詞＋ly の副詞。"},
          {"t": "choice", "q": "She spoke to me in a ( ) way.", "o": ["friendly", "friend", "friendship", "friendliness"], "e": "名詞 way を修飾するので形容詞 friendly。"},
          {"t": "choice", "q": "The train was running very ( ).", "o": ["fast", "fastly", "faster", "fastest"], "e": "fast は副詞も同じ形。fastly という語はない。"},
          {"t": "fill", "q": "He drove ___ so that nobody would get hurt. (careful)", "a": ["carefully"], "e": "動詞 drove を修飾するので副詞 carefully。"},
        ],
      },
      {
        "id": "10-1-3", "title": "副詞の働き（形容詞と区別しながら）", "book": 377, "pdf": [372, 375],
        "points": [
          "副詞は名詞以外（動詞・形容詞・他の副詞・文全体）を修飾する。名詞を修飾するのは形容詞。",
          "副詞は補語（C）になれない：look / sound / taste / feel の後ろは形容詞（×look happily）。",
          "very quickly（副詞を修飾）、terribly cold（形容詞を修飾）のように程度を加える働きも重要。",
        ],
        "questions": [
          {"t": "choice", "q": "This soup tastes ( ).", "o": ["delicious", "deliciously", "wonderfully", "perfectly"], "e": "taste の後ろは補語 → 形容詞。副詞は補語になれない。"},
          {"t": "choice", "q": "She sang ( ) at the concert.", "o": ["beautifully", "beautiful", "beauty", "beautify"], "e": "動詞 sang を修飾するので副詞。"},
          {"t": "choice", "q": "It was a ( ) cold morning.", "o": ["terribly", "terrible", "terror", "terrify"], "e": "形容詞 cold を修飾するのは副詞 terribly。"},
          {"t": "fill", "q": "He looked ___ when he heard the news. (sad)", "a": ["sad"], "e": "look＋形容詞（C）。sadly にはしない。"},
        ],
      },
      {
        "id": "10-1-4", "title": "接続副詞", "book": 381, "pdf": [376, 378],
        "points": [
          "however / therefore / moreover / otherwise / nevertheless などは意味上つなぐが、品詞は副詞。",
          "接続詞ではないので、2つの文をコンマだけでつなげない：; or ピリオドで区切って使う。",
          "otherwise＝「さもないと」、moreover＝「さらに」、therefore＝「それゆえ」、however＝「しかし」。",
        ],
        "pattern": "\\b(however|therefore|moreover|nevertheless|furthermore),",
        "questions": [
          {"t": "choice", "q": "I was very tired. ( ), I kept working.", "o": ["However", "Therefore", "Moreover", "Otherwise"], "e": "「疲れていた。しかし働き続けた」→ 逆接の However。"},
          {"t": "choice", "q": "This car is cheap. ( ), it uses very little fuel.", "o": ["Moreover", "However", "Otherwise", "Therefore"], "e": "長所に長所を加える →「さらに」Moreover。"},
          {"t": "choice", "q": "次のうち、接続詞ではなく副詞なので、2つの節をコンマだけでつなげないのはどれか。", "o": ["however", "but", "although", "because"], "e": "however は副詞。but / although / because は接続詞。"},
          {"t": "fill", "q": "Hurry up; ___ , you'll miss the bus. (さもないと)", "a": ["otherwise"], "e": "otherwise「さもないと」は接続副詞。"},
        ],
      },
      {
        "id": "10-2-1", "title": "「副詞の位置」の概観", "book": 384, "pdf": [379, 381],
        "points": [
          "様態の副詞（well / quietly など）は原則として文末。動詞と目的語の間に割り込ませない。",
          "文末に副詞が並ぶときは「場所 → 時」の順が普通：went there yesterday。",
          "luckily / fortunately などの文修飾副詞は文頭に置いて文全体を修飾することが多い。",
        ],
        "questions": [
          {"t": "choice", "q": "She speaks ( ).", "o": ["English very well", "very well English", "English well very", "well very English"], "e": "動詞＋目的語のあとに副詞。speak well English は誤り。"},
          {"t": "choice", "q": "He opened ( ).", "o": ["the door quietly", "quietly the door", "the quietly door", "door the quietly"], "e": "動詞と目的語の間に副詞を入れない。"},
          {"t": "choice", "q": "We went ( ).", "o": ["there yesterday", "yesterday there", "there at yesterday", "to there yesterday"], "e": "場所 → 時の順。there / yesterday は副詞なので前置詞不要。"},
          {"t": "order", "ja": "幸運にも、私たちは最終電車に間に合った。", "a": "Luckily, we caught the last train.", "e": "文修飾副詞 luckily は文頭に置いてコンマで区切る。"},
        ],
      },
      {
        "id": "10-2-2", "title": "位置が決まっている副詞（その1）enough", "book": 387, "pdf": [382, 383],
        "points": [
          "副詞 enough は修飾する形容詞・副詞の後ろに置く：old enough / fast enough。",
          "名詞を修飾する enough（形容詞）は前に置く：enough money / enough time。",
          "〜 enough to V「Vするほど〜／Vするのに十分〜」の形で頻出。",
        ],
        "pattern": "\\b(old|big|large|strong|brave|kind|lucky|fast|clever|wise|foolish|tall|warm|near|close|long|hard|good|well|rich|small) enough\\b",
        "questions": [
          {"t": "choice", "q": "He is not ( ) to drive a car.", "o": ["old enough", "enough old", "as old enough", "enough older"], "e": "副詞 enough は形容詞の後ろ。"},
          {"t": "choice", "q": "Do we have ( ) to buy the tickets?", "o": ["enough money", "enoughly money", "enough of money", "much enough money"], "e": "名詞の前に enough。enough of は the / my などが続くときだけ。"},
          {"t": "fill", "q": "She didn't run fast ___ to catch the bus.", "a": ["enough"], "e": "副詞 fast の後ろに enough。"},
          {"t": "order", "ja": "この部屋は私たち全員が入れるほど広くない。", "a": "This room isn't large enough for all of us.", "e": "large enough for 〜「〜にとって十分な広さ」。"},
        ],
      },
      {
        "id": "10-2-3", "title": "位置が決まっている副詞（その2）頻度の副詞", "book": 389, "pdf": [384, 385],
        "points": [
          "always / usually / often / sometimes / seldom / never などの頻度の副詞は一般動詞の前に置く。",
          "be動詞・助動詞があるときはその後ろ：She is always late. / I have never seen it.",
          "語順の目安は「not の位置」と同じ場所と覚えると迷わない。",
        ],
        "pattern": "\\b(always|usually|often|sometimes|seldom|rarely|never)\\b",
        "questions": [
          {"t": "choice", "q": "She ( ) late for work.", "o": ["is never", "never is", "is ever", "never be"], "e": "be動詞の後ろに頻度の副詞。"},
          {"t": "choice", "q": "I ( ) breakfast at seven.", "o": ["usually have", "have usually", "usually has", "am usually have"], "e": "一般動詞の前に頻度の副詞。"},
          {"t": "fill", "q": "He ___ goes to bed before ten. (いつも)", "a": ["always"], "e": "always は一般動詞 goes の前。"},
          {"t": "order", "ja": "彼は約束に決して遅れない。", "a": "He is never late for appointments.", "e": "be動詞 is の後ろに never。"},
        ],
      },
      {
        "id": "10-2-4", "title": "位置が決まっている副詞（その3）特殊な語順になる「わがまま副詞」", "book": 391, "pdf": [386, 388],
        "points": [
          "so / as / too / how は「形容詞＋a＋名詞」の語順をとる：so kind a man、too difficult a question。",
          "such / quite / what は普通の語順：such a kind man、what a kind man。",
          "as good a player as 〜「〜と同じくらい上手な選手」のように比較でもこの語順になる。",
        ],
        "questions": [
          {"t": "choice", "q": "It was ( ) that nobody could answer it.", "o": ["so difficult a question", "a so difficult question", "so a difficult question", "difficult so a question"], "e": "so＋形容詞＋a＋名詞の語順。"},
          {"t": "choice", "q": "She is ( ) pianist as her mother.", "o": ["as good a", "a as good", "as a good", "good as a"], "e": "as＋形容詞＋a＋名詞＋as。"},
          {"t": "choice", "q": "It was ( ) nice day that we went on a picnic.", "o": ["such a", "so a", "too a", "how a"], "e": "such は such a＋形容詞＋名詞の普通の語順。"},
          {"t": "order", "ja": "それは私には難しすぎる問題だ。", "a": "That is too difficult a question for me.", "e": "too＋形容詞＋a＋名詞。"},
        ],
      },
      {
        "id": "10-2-5", "title": "熟語での「副詞の位置」", "book": 394, "pdf": [389, 391],
        "points": [
          "pick up / turn off などの「動詞＋副詞」では、目的語が名詞なら副詞の前後どちらでもよい。",
          "目的語が代名詞（it / them）なら必ず動詞と副詞の間：turn it off（×turn off it）。",
          "look for / look after などの「動詞＋前置詞」は常に前置詞の後ろに目的語：look for it。",
        ],
        "pattern": "\\b(pick|picked|put|take|took|taken|turn|turned|give|gave|bring|brought|throw|threw|set|call|called|let|carry|carried|cut|shut) (it|them|him|her|me|us) (up|down|off|on|away|out|back)\\b",
        "questions": [
          {"t": "choice", "q": "誤っている英文はどれか。", "o": ["Turn on it.", "Turn it on.", "Turn the light on.", "Turn on the light."], "e": "代名詞 it は turn と on の間に置く。"},
          {"t": "choice", "q": "Your shoes are dirty. Take ( ) before you come in.", "o": ["them off", "off them", "off their", "their off"], "e": "代名詞 them は take と off の間。"},
          {"t": "choice", "q": "I've lost my key. I'm looking ( ).", "o": ["for it", "it for", "it after", "after it"], "e": "look for は動詞＋前置詞なので for の後ろに it。"},
          {"t": "order", "ja": "この紙にそれを書き留めてください。", "a": "Please write it down on this paper.", "e": "write it down：代名詞は動詞と副詞の間。"},
        ],
      },
      {
        "id": "10-3-1", "title": "「用法」がまぎらわしいもの", "book": 397, "pdf": [392, 394],
        "points": [
          "ago は「今から〜前」で過去形と使う。before は「（過去のある時点から）〜前」で過去完了とも使う。",
          "否定文の「〜も」は too ではなく either：I don't, either.",
          "very は原級を、much / far は比較級を強める：much better（×very better）。",
        ],
        "questions": [
          {"t": "choice", "q": "She told me that she had met him three years ( ).", "o": ["before", "ago", "since", "yet"], "e": "過去のある時点から見た「〜前」は before。ago は今が基準。"},
          {"t": "choice", "q": "I don't like coffee. — I don't, ( ).", "o": ["either", "too", "also", "neither"], "e": "否定文の「〜もまた」は either。"},
          {"t": "choice", "q": "This book is ( ) more interesting than that one.", "o": ["much", "very", "so", "too"], "e": "比較級を強めるのは much。"},
          {"t": "fill", "q": "I haven't eaten lunch ___ . (まだ)", "a": ["yet"], "e": "否定文の「まだ」は yet。"},
        ],
      },
      {
        "id": "10-3-2", "title": "「意味」がまぎらわしいもの", "book": 400, "pdf": [395, 396],
        "points": [
          "-ly がつくと意味が変わる語がある：hard（熱心に）/ hardly（ほとんど〜ない）。",
          "late（遅く）/ lately（最近）、near（近くに）/ nearly（ほとんど）、high（高く）/ highly（非常に）。",
          "most（最も）/ mostly（たいてい）、short（短く）/ shortly（まもなく）も区別する。",
        ],
        "questions": [
          {"t": "choice", "q": "He worked ( ) to pass the exam.", "o": ["hard", "hardly", "hardness", "harden"], "e": "「熱心に働いた」は hard。hardly は「ほとんど〜ない」。"},
          {"t": "choice", "q": "I haven't seen him ( ).", "o": ["lately", "late", "later", "latest"], "e": "「最近」は lately。現在完了とよく使う。"},
          {"t": "choice", "q": "It's ( ) five o'clock. Let's go home.", "o": ["nearly", "near", "nearby", "nearer"], "e": "「ほとんど・もう少しで」は nearly。"},
          {"t": "fill", "q": "She is a ___ respected doctor. (high)", "a": ["highly"], "e": "highly は「非常に」。high は「高く（物理的に）」。"},
        ],
      },
      {
        "id": "10-3-3", "title": "almostの使い方", "book": 402, "pdf": [397, 398],
        "points": [
          "almost は副詞なので名詞を直接修飾できない：×almost students → most students / almost all the students。",
          "almost は all / every / no / nothing / always などを修飾する：almost everyone、almost always。",
          "most of の後ろには the / my などがつく：most of the students（×most of students）。",
        ],
        "pattern": "\\balmost (all|every|everyone|everybody|everything|no|nothing|nobody|always|never)\\b",
        "questions": [
          {"t": "choice", "q": "( ) students in this class like music.", "o": ["Most", "Almost", "Almost of", "Most of"], "e": "名詞を直接修飾するのは形容詞 most。Most of なら the が必要。"},
          {"t": "choice", "q": "( ) of the students passed the test.", "o": ["Almost all", "Almost", "All almost", "Almost every"], "e": "almost は all を修飾して almost all of the 〜。"},
          {"t": "choice", "q": "It's ( ) time for dinner.", "o": ["almost", "most", "mostly", "the most"], "e": "「もうすぐ〜」は almost。"},
          {"t": "order", "ja": "ほとんどすべての人がその歌を知っている。", "a": "Almost everyone knows that song.", "e": "almost everyone「ほとんど全員」。"},
        ],
      },
      {
        "id": "10-4-1", "title": "副詞の強調用法", "book": 404, "pdf": [399, 399],
        "points": [
          "比較級の強調は much / far / even / still、最上級の強調は by far / the very。",
          "否定の強調は not 〜 at all「全く〜ない」、by no means「決して〜ない」。",
          "the very＋名詞は「まさにその〜」。very better のように比較級を very で強めるのは誤り。",
        ],
        "pattern": "(\\bnot|n't) \\w+( \\w+)? at all\\b|\\bby far\\b",
        "questions": [
          {"t": "choice", "q": "This bag is ( ) heavier than that one.", "o": ["far", "very", "so", "too"], "e": "比較級を強めるのは far / much など。"},
          {"t": "choice", "q": "She is ( ) the best player on the team.", "o": ["by far", "very", "much more", "so"], "e": "最上級を強めるのは by far。"},
          {"t": "choice", "q": "I don't like him ( ).", "o": ["at all", "in all", "after all", "above all"], "e": "not 〜 at all「全く〜ない」。"},
          {"t": "fill", "q": "This is the ___ book I've been looking for. (まさにその)", "a": ["very"], "e": "the very＋名詞「まさにその〜」。"},
        ],
      },
      {
        "id": "10-4-2", "title": "副詞の限定用法", "book": 405, "pdf": [400, 400],
        "points": [
          "only / even / just / also などは直後の語句を限定する。置く位置で意味が変わる。",
          "alone は名詞の後ろに置いて「〜だけ」：Money alone cannot make you happy.",
          "Even a child 〜「子どもでさえ〜」のように名詞の前にも置ける。",
        ],
        "questions": [
          {"t": "choice", "q": "( ) a child can solve this puzzle.", "o": ["Even", "Very", "Much", "Ever"], "e": "名詞を限定して「〜でさえ」は even。"},
          {"t": "choice", "q": "Money ( ) cannot make you happy.", "o": ["alone", "lonely", "single", "lone"], "e": "名詞の後ろに置く alone「〜だけ」。"},
          {"t": "fill", "q": "I didn't buy anything. I ___ looked. (見ただけ)", "a": ["just", "only"], "e": "just / only で動詞 looked を限定。"},
          {"t": "order", "ja": "彼女だけがその答えを知っていた。", "a": "Only she knew the answer.", "e": "only を she の直前に置いて限定。"},
        ],
      },
      {
        "id": "10-4-3", "title": "副詞の同格用法", "book": 406, "pdf": [401, 401],
        "points": [
          "here / there などの副詞のあとに前置詞句を並べ、同じ場所を具体的に言い換えることがある（同格）。",
          "here in Japan＝「ここ日本では」、there on the table＝「あそこ、テーブルの上に」。",
          "時の副詞も同様：tomorrow at ten「明日の10時に」。",
        ],
        "pattern": "\\b(here|there) (in|at|on) (the|this|that|our|my)\\b",
        "questions": [
          {"t": "choice", "q": "It's very hot ( ) in Kyoto in summer.", "o": ["here", "this", "it", "where"], "e": "here と in Kyoto が同格。「ここ京都は」。"},
          {"t": "choice", "q": "Let's meet tomorrow ( ) ten o'clock.", "o": ["at", "in", "on", "for"], "e": "tomorrow を at ten o'clock で具体化。時刻は at。"},
          {"t": "fill", "q": "People are very friendly ___ in this town. (ここ)", "a": ["here"], "e": "here と in this town が同格。"},
          {"t": "order", "ja": "父はここ東京で生まれた。", "a": "My father was born here in Tokyo.", "e": "here in Tokyo：here を in Tokyo で言い換える。"},
        ],
      },
    ],
  },
  {
    "n": 11, "title": "文型", "part": "Part 2 品詞の力・文型の威力",
    "toc": {"book": 407, "pdf": 402}, "intro": {"book": [408, 409], "pdf": [403, 404]},
    "sections": [
      {
        "id": "11-1-1", "title": "自動詞と他動詞の考え方", "book": 410, "pdf": [405, 409],
        "points": [
          "目的語をとらない動詞が自動詞、目的語を必要とする動詞が他動詞。",
          "他動詞なのに前置詞をつけやすい語に注意：discuss / marry / reach / enter / approach（×discuss about）。",
          "逆に自動詞には前置詞が必要：apologize to / arrive at / agree with / graduate from。",
        ],
        "questions": [
          {"t": "choice", "q": "We discussed ( ) for hours.", "o": ["the problem", "about the problem", "on the problem", "with the problem"], "e": "discuss は他動詞。about は不要。"},
          {"t": "choice", "q": "She married ( ) last year.", "o": ["a doctor", "with a doctor", "to a doctor", "for a doctor"], "e": "marry は他動詞。get married to なら to が必要。"},
          {"t": "choice", "q": "We finally ( ) the hotel.", "o": ["reached", "arrived", "got", "came"], "e": "目的語を直接とれるのは他動詞 reach。arrive は at / in が必要。"},
          {"t": "fill", "q": "I apologized ___ her for being late.", "a": ["to"], "e": "apologize は自動詞。apologize to 人 for 〜。"},
        ],
      },
      {
        "id": "11-1-2", "title": "「セット」で整理する動詞（lie / lay など）", "book": 415, "pdf": [410, 411],
        "points": [
          "lie（横たわる）lie-lay-lain は自動詞、lay（横たえる）lay-laid-laid は他動詞。",
          "rise（上がる）rise-rose-risen は自動詞、raise（上げる）は他動詞。",
          "lie の過去形 lay と lay の原形が同じ形なので、目的語の有無で判断する。",
        ],
        "questions": [
          {"t": "choice", "q": "He ( ) on the sofa and fell asleep.", "o": ["lay", "laid", "lied", "lain"], "e": "目的語なし「横になった」→ lie の過去形 lay。"},
          {"t": "choice", "q": "She ( ) the baby on the bed.", "o": ["laid", "lay", "lied", "lain"], "e": "目的語 the baby あり → lay の過去形 laid。"},
          {"t": "choice", "q": "Please ( ) your hand if you have a question.", "o": ["raise", "rise", "arise", "rose"], "e": "目的語 your hand あり → 他動詞 raise。"},
          {"t": "fill", "q": "The sun ___ in the east. (rise)", "a": ["rises"], "e": "目的語なしの自動詞 rise。一般的事実なので現在形。"},
        ],
      },
      {
        "id": "11-2-1", "title": "5文型の全体像と考え方（予想と修正）", "book": 417, "pdf": [412, 414],
        "points": [
          "文型は動詞で予想し、後ろの形で修正する：make なら SVO / SVOO / SVOC の可能性がある。",
          "O と C の区別：O は S と別物、C は S や O とイコール（主語・述語の関係）になる。",
          "前置詞句や副詞は M（修飾語）で、文型の要素には数えない。",
        ],
        "questions": [
          {"t": "choice", "q": "She made him a cake. の文型は？", "o": ["SVOO", "SVOC", "SVO", "SVC"], "e": "him ≠ a cake。「彼にケーキを作った」→ SVOO。"},
          {"t": "choice", "q": "She made him happy. の文型は？", "o": ["SVOC", "SVOO", "SVO", "SVC"], "e": "him＝happy の関係 → SVOC。"},
          {"t": "choice", "q": "The leaves turned red. の文型は？", "o": ["SVC", "SVO", "SV", "SVOC"], "e": "the leaves＝red の関係 → SVC。"},
          {"t": "order", "ja": "その知らせは彼を悲しませた。", "a": "The news made him sad.", "e": "make O C「O を C にする」の SVOC。"},
        ],
      },
      {
        "id": "11-2-2", "title": "第1文型 SV(M)", "book": 420, "pdf": [415, 417],
        "points": [
          "SV(M) は動詞だけで文が完成し、あとは修飾語。live in 〜 / go to 〜 など。",
          "第1文型で意外な意味になる動詞：matter（重要だ）、do（十分だ）、work（うまくいく）、pay（割に合う）。",
          "There is 〜 の文も第1文型（主語は is の後ろの名詞）。",
        ],
        "questions": [
          {"t": "choice", "q": "It doesn't ( ) what you say.", "o": ["matter", "mind", "care", "count on"], "e": "matter「重要だ」の第1文型。"},
          {"t": "choice", "q": "I'm sure this plan will ( ).", "o": ["work", "play", "act", "run"], "e": "work「うまくいく」。"},
          {"t": "choice", "q": "Any pen will ( ).", "o": ["do", "make", "have", "take"], "e": "do「十分だ・間に合う」。"},
          {"t": "order", "ja": "私の祖母は田舎に住んでいる。", "a": "My grandmother lives in the country.", "e": "live＋M（in the country）の第1文型。"},
        ],
      },
      {
        "id": "11-2-3", "title": "第2文型 SVC", "book": 423, "pdf": [418, 423],
        "points": [
          "SVC は S＝C の関係。C には名詞か形容詞がくる（副詞は不可）。",
          "be / become / get / grow / turn / go / come / look / seem / sound / feel / taste / remain / keep などが代表。",
          "go は悪い変化（go bad）、come は良い状態へ（come true）に使うことが多い。",
        ],
        "pattern": "\\b(come|comes|came) true\\b|\\b(go|goes|went|gone) (bad|mad|blind|deaf|sour)\\b|\\b(grow|grows|grew|grown) (old|dark|cold|tired)\\b",
        "questions": [
          {"t": "choice", "q": "The milk has gone ( ).", "o": ["bad", "badly", "to bad", "in bad"], "e": "go bad「腐る」。C は形容詞。"},
          {"t": "choice", "q": "Your idea sounds ( ).", "o": ["interesting", "interestingly", "interest", "interested"], "e": "sound＋形容詞。アイデアが「おもしろい」→ interesting。"},
          {"t": "choice", "q": "Her dream finally came ( ).", "o": ["true", "truly", "truth", "truer"], "e": "come true「実現する」。"},
          {"t": "fill", "q": "Please keep ___ during the test. (quiet)", "a": ["quiet"], "e": "keep＋形容詞「〜のままでいる」。"},
        ],
      },
      {
        "id": "11-2-4", "title": "第3文型 SVO", "book": 429, "pdf": [424, 424],
        "points": [
          "SVO は S≠O。O には名詞・代名詞のほか、to不定詞・動名詞・that節もくる。",
          "He became a doctor（C：彼＝医者）と He met a doctor（O：彼≠医者）を区別する。",
          "enjoy oneself のように再帰代名詞が O になる形も第3文型。",
        ],
        "questions": [
          {"t": "choice", "q": "次のうち第3文型（SVO）の文はどれか。", "o": ["He met a famous doctor.", "He became a famous doctor.", "He is a famous doctor.", "He remained a doctor."], "e": "he ≠ doctor なのは met の文だけ。他は SVC。"},
          {"t": "choice", "q": "Did you enjoy ( ) at the party?", "o": ["yourself", "you", "your", "yours"], "e": "enjoy oneself「楽しむ」。"},
          {"t": "choice", "q": "I finished ( ) the report.", "o": ["writing", "to write", "write", "written"], "e": "finish は動名詞を O にとる。"},
          {"t": "order", "ja": "彼女はその問題について何も言わなかった。", "a": "She said nothing about the problem.", "e": "said＋O（nothing）の第3文型。"},
        ],
      },
      {
        "id": "11-3-1", "title": "第4文型 SVOO（その1）give型・buy型", "book": 430, "pdf": [425, 428],
        "points": [
          "SVOO は「人に物を〜する」。SVO＋前置詞に書きかえると give型は to、buy型は for を使う。",
          "give型（相手が必要）：give / show / tell / teach / lend / send / sell / hand。",
          "buy型（自分でする行為）：buy / make / cook / find / get / choose。",
        ],
        "questions": [
          {"t": "choice", "q": "He gave the book ( ) me.", "o": ["to", "for", "of", "with"], "e": "give型 → to。"},
          {"t": "choice", "q": "My mother made a cake ( ) me.", "o": ["for", "to", "of", "at"], "e": "make は buy型 → for。"},
          {"t": "choice", "q": "Could you lend ( )?", "o": ["me your bike", "your bike me", "to me your bike", "me to your bike"], "e": "SVOO の語順は「人＋物」。"},
          {"t": "fill", "q": "I bought a present ___ my sister.", "a": ["for"], "e": "buy は buy型 → for。"},
        ],
      },
      {
        "id": "11-3-2", "title": "第4文型 SVOO（その2）take型", "book": 434, "pdf": [429, 430],
        "points": [
          "take型は to / for で書きかえにくい SVOO：take 人 時間、cost 人 お金、save 人 手間。",
          "It takes 人 時間 to V「人がVするのに時間がかかる」は頻出の形。",
          "cost は「（お金・犠牲が）かかる」、save は「（手間・時間を）省く」。",
        ],
        "questions": [
          {"t": "choice", "q": "It ( ) me two hours to finish the work.", "o": ["took", "spent", "needed", "made"], "e": "It takes 人 時間 to V。"},
          {"t": "choice", "q": "This watch ( ) me 30,000 yen.", "o": ["cost", "spent", "paid", "took"], "e": "物が主語で「人にお金がかかる」→ cost。"},
          {"t": "choice", "q": "The new computer ( ) me a lot of time. (時間を節約してくれた)", "o": ["saved", "spent", "took", "made"], "e": "save 人 時間「人の時間を省く」。"},
          {"t": "order", "ja": "駅まで歩いて10分かかった。", "a": "It took me ten minutes to walk to the station.", "e": "It took 人 時間 to V。"},
        ],
      },
      {
        "id": "11-3-3", "title": "第4文型 SVOO（その3）その他のSVOO", "book": 436, "pdf": [431, 431],
        "points": [
          "ask 人 a favor（頼みごとをする）、owe 人 お金（借りがある）、envy 人 物（うらやむ）。",
          "do 人 good / harm「人のためになる／害になる」、wish 人 luck「人の幸運を祈る」。",
          "これらは to / for で単純に書きかえられないので、形ごと覚える。",
        ],
        "questions": [
          {"t": "choice", "q": "May I ask you ( )?", "o": ["a favor", "a help", "your favor", "for favor"], "e": "ask 人 a favor「人に頼みごとをする」。"},
          {"t": "choice", "q": "Too much sugar will do you ( ).", "o": ["harm", "hurt", "badly", "injure"], "e": "do 人 harm「人に害を与える」。"},
          {"t": "choice", "q": "I envy ( ) your good memory.", "o": ["you", "to you", "for you", "of you"], "e": "envy 人 物「人の物をうらやむ」。前置詞は不要。"},
          {"t": "order", "ja": "私たちはあなたの幸運を祈っています。", "a": "We wish you the best of luck.", "e": "wish 人 luck の SVOO。"},
        ],
      },
      {
        "id": "11-4-1", "title": "第5文型 SVOC", "book": 437, "pdf": [432, 435],
        "points": [
          "SVOC は O＝C の関係（O が C である／C する）。C には名詞・形容詞・分詞などがくる。",
          "make / keep / leave / find / call / elect などが代表。C に副詞は置けない。",
          "The news made her happy.＝「その知らせで彼女は喜んだ」と O と C を主語・述語として読む。",
        ],
        "questions": [
          {"t": "choice", "q": "The news made her ( ).", "o": ["happy", "happily", "happiness", "to happy"], "e": "her＝happy の SVOC。C に副詞は不可。"},
          {"t": "choice", "q": "Please leave the door ( ).", "o": ["open", "openly", "opening", "to open"], "e": "leave O C「O を C のままにしておく」。open は形容詞。"},
          {"t": "fill", "q": "They elected him ___ of the club. (主将)", "a": ["captain", "the captain"], "e": "elect O C。役職名は無冠詞が普通。"},
          {"t": "order", "ja": "窓を開けたままにしておかないで。", "a": "Don't leave the window open.", "e": "leave O C の SVOC。"},
        ],
      },
      {
        "id": "11-4-2", "title": "第5文型をとる動詞の詳細（使役・知覚動詞）", "book": 441, "pdf": [436, 439],
        "points": [
          "使役動詞 make / have / let＋O＋原形。have / get は O＋過去分詞で「〜してもらう・される」。",
          "知覚動詞 see / hear / feel / watch＋O＋原形（全部）／ -ing（途中）／過去分詞（受け身）。",
          "受動態では原形が to不定詞になる：He was made to wait.",
        ],
        "questions": [
          {"t": "choice", "q": "My mother made me ( ) my room.", "o": ["clean", "to clean", "cleaning", "cleaned"], "e": "使役 make＋O＋原形。"},
          {"t": "choice", "q": "I had my bike ( ) yesterday.", "o": ["repaired", "repair", "to repair", "repairing"], "e": "自転車は「修理される」側 → 過去分詞。"},
          {"t": "choice", "q": "I heard someone ( ) my name.", "o": ["call", "to call", "called", "calls"], "e": "知覚動詞＋O＋原形。someone が「呼ぶ」側なので過去分詞は不可。"},
          {"t": "fill", "q": "He was made ___ for two hours. (wait)", "a": ["to wait"], "e": "使役 make の受動態では to不定詞になる。"},
        ],
      },
      {
        "id": "11-4-3", "title": "使役もどき（keep / leave / get）の語法", "book": 445, "pdf": [440, 441],
        "points": [
          "keep / leave＋O＋-ing「O を〜させたままにする」、＋過去分詞「O を〜されたままにする」。",
          "get は O＋to V（〜させる・してもらう）、O＋過去分詞（〜してもらう）。原形はとらない。",
          "keep は意図的に、leave は放置の感じ：keep you waiting / leave the water running。",
        ],
        "questions": [
          {"t": "choice", "q": "I'm sorry to have kept you ( ).", "o": ["waiting", "wait", "to wait", "waited"], "e": "keep O -ing「O を〜させたままにする」。"},
          {"t": "choice", "q": "I got my father ( ) me to the station.", "o": ["to drive", "drive", "driven", "drove"], "e": "get＋O＋to V。原形は不可。"},
          {"t": "choice", "q": "Don't leave the water ( ).", "o": ["running", "run", "to run", "ran"], "e": "leave O -ing「O を〜したままにする」。"},
          {"t": "fill", "q": "I got my hair ___ yesterday. (cut)", "a": ["cut"], "e": "髪は「切られる」側 → 過去分詞 cut。"},
        ],
      },
      {
        "id": "11-4-4", "title": "命名・希望系の動詞", "book": 447, "pdf": [442, 442],
        "points": [
          "命名・選出系 call / name / elect / appoint は O＋C（名詞）。call him as Tom のように as は入れない。",
          "希望系 want / like / wish は O＋to V：I want you to come.",
          "O が「される」側なら O＋過去分詞：I want this work finished by noon.",
        ],
        "questions": [
          {"t": "choice", "q": "Everyone calls ( ).", "o": ["him Tom", "Tom him", "him as Tom", "to him Tom"], "e": "call O C。as は不要。"},
          {"t": "choice", "q": "I want this letter ( ) today.", "o": ["sent", "send", "sending", "to sending"], "e": "手紙は「送られる」側 → want O 過去分詞。"},
          {"t": "choice", "q": "My parents want me ( ) a doctor.", "o": ["to become", "become", "becoming", "that I become"], "e": "want 人 to V。"},
          {"t": "fill", "q": "I'd like you ___ this box to the kitchen. (carry)", "a": ["to carry"], "e": "would like 人 to V。"},
        ],
      },
      {
        "id": "11-4-5", "title": "\"SV 人 to 原形\"の形をとる動詞", "book": 448, "pdf": [443, 443],
        "points": [
          "tell / ask / advise / allow / enable / force / encourage / expect / persuade は「人 to V」をとる。",
          "suggest / demand / insist / explain は「人 to V」をとらない：suggest that he (should) go。",
          "O と to V は主語・述語の関係：told me to go＝「私が行く」ように言った。",
        ],
        "pattern": "\\b(told|asked|advised|allowed|forced|encouraged|persuaded|ordered|begged|wanted) (me|him|her|us|them|you) to\\b",
        "questions": [
          {"t": "choice", "q": "The doctor advised him ( ) smoking.", "o": ["to stop", "stop", "stopping", "stopped"], "e": "advise 人 to V。"},
          {"t": "choice", "q": "She ( ) me to go home. の空所に入らない動詞はどれか。", "o": ["suggested", "told", "asked", "wanted"], "e": "suggest は 人 to V の形をとらない。"},
          {"t": "choice", "q": "This money will enable you ( ) abroad.", "o": ["to study", "study", "studying", "for studying"], "e": "enable 人 to V「人が V できるようにする」。"},
          {"t": "order", "ja": "母は私に早く寝るように言った。", "a": "My mother told me to go to bed early.", "e": "tell 人 to V。"},
        ],
      },
      {
        "id": "11-4-6", "title": "helpの語法", "book": 449, "pdf": [444, 444],
        "points": [
          "help＋O＋(to) 原形：to は省略可能で、原形の方が口語的。",
          "「人の宿題を手伝う」は help 人 with 物。×help my homework。",
          "cannot help -ing「〜せずにはいられない」も合わせて覚える。",
        ],
        "pattern": "\\bhelp(s|ed|ing)? (me|him|her|us|them|you) (with|to)\\b|\\bcould(n't| not) help \\w+ing\\b",
        "questions": [
          {"t": "choice", "q": "Could you help me ( ) this box?", "o": ["carry", "carrying", "carried", "to carrying"], "e": "help O 原形（to carry も可）。"},
          {"t": "choice", "q": "My brother helped me ( ) my homework.", "o": ["with", "for", "to", "on"], "e": "help 人 with 物。"},
          {"t": "choice", "q": "誤っている英文はどれか。", "o": ["He helped my homework.", "He helped me with my homework.", "He helped me do my homework.", "He helped me to do my homework."], "e": "help の O は「人」。物を直接 O にしない。"},
          {"t": "fill", "q": "I couldn't help ___ when I saw his face. (laugh)", "a": ["laughing"], "e": "cannot help -ing「〜せずにはいられない」。"},
        ],
      },
      {
        "id": "11-4-7", "title": "regard型の動詞", "book": 450, "pdf": [445, 446],
        "points": [
          "regard A as B「A を B とみなす」。as が C のしるしになる。",
          "同じ形：look on A as B / think of A as B / see A as B / refer to A as B / describe A as B。",
          "consider は as なしで consider A (to be) B とするのが基本。",
        ],
        "pattern": "\\b(regard|regards|regarded) \\w+( \\w+)? as\\b|\\b(think|thinks|thought) of \\w+( \\w+)? as\\b|\\blook(s|ed)? (up)?on \\w+( \\w+)? as\\b",
        "questions": [
          {"t": "choice", "q": "We regard him ( ) our leader.", "o": ["as", "to", "for", "by"], "e": "regard A as B。"},
          {"t": "choice", "q": "They think ( ) him as a genius.", "o": ["of", "to", "for", "with"], "e": "think of A as B。"},
          {"t": "choice", "q": "Everyone looks ( ) her as a hero.", "o": ["on", "into", "for", "after"], "e": "look on A as B「A を B とみなす」。"},
          {"t": "order", "ja": "私たちはその計画を失敗だとみなした。", "a": "We regarded the plan as a failure.", "e": "regard A as B。"},
        ],
      },
      {
        "id": "11-4-8", "title": "SVOCの自然な訳し方", "book": 452, "pdf": [447, 449],
        "points": [
          "SVOC を直訳（S は O を C にする）すると不自然になりやすい。",
          "S を原因・理由として訳し、O と C を「主語＋述語」でまとめると自然：「S によって O が C になる」。",
          "find O C は「O が C だとわかる」、What made you 〜? は「なぜ〜したの？」と訳す。",
        ],
        "questions": [
          {"t": "choice", "q": "This medicine will make you feel better. の自然な訳は？", "o": ["この薬を飲めば気分がよくなるだろう。", "この薬はあなたが気分がよくなることを作るだろう。", "この薬はあなたをよい気分に作るだろう。", "この薬はあなたの気分を作るだろう。"], "e": "S を条件・原因として訳し、O と C を「あなたが気分がよくなる」とまとめる。"},
          {"t": "choice", "q": "What made you so angry? の自然な訳は？", "o": ["どうしてそんなに怒ったの？", "何があなたをそんなに作ったの？", "あなたは何をそんなに怒らせたの？", "何があなたを怒りに作ったの？"], "e": "What made 〜 は「なぜ〜」と理由で訳すと自然。"},
          {"t": "choice", "q": "I found the movie boring. の自然な訳は？", "o": ["その映画は見てみたら退屈だった。", "私は退屈な映画を見つけた。", "私は映画を退屈に見つけた。", "私は映画が退屈するのを見つけた。"], "e": "find O C「O が C だとわかる」。"},
          {"t": "order", "ja": "その歌を聞くといつも幸せな気分になる。", "a": "That song always makes me happy.", "e": "S を原因として訳すと自然になる SVOC。"},
        ],
      },
      {
        "id": "11-4-9", "title": "知らない動詞の意味もわかる（SVOCの場合）", "book": 455, "pdf": [450, 455],
        "points": [
          "SVOC では「V した結果、O が C になる」と読めば、知らない動詞でも意味が推測できる。",
          "kick the door open＝「蹴ってドアを開ける」、paint the wall white＝「壁を白く塗る」。",
          "O と C の主語・述語関係を先に押さえ、動詞は「その手段」と考えるのがコツ。",
        ],
        "pattern": "\\b(pushed|kicked|pulled|threw|swung|flung|broke|burst) (the |a |his |her |its )?(door|gate|window|lid) open\\b|\\b(painted|wiped|licked|scrubbed|swept) (the |a |his |her |its )?\\w+ (clean|white|red|black|dry)\\b|\\bset (him|her|them|it|me|us) free\\b",
        "questions": [
          {"t": "choice", "q": "He kicked the door open. の意味は？", "o": ["彼はドアを蹴って開けた。", "彼は開いたドアを蹴った。", "彼はドアを開けてから蹴った。", "彼はドアを蹴ったが開かなかった。"], "e": "蹴った結果 the door＝open になった。"},
          {"t": "choice", "q": "She painted the wall white. の意味は？", "o": ["彼女は壁を白く塗った。", "彼女は白い壁に絵を描いた。", "彼女は壁の白い部分を塗った。", "彼女は白い絵の具で壁に絵を描いた。"], "e": "塗った結果 the wall＝white になった。"},
          {"t": "fill", "q": "Wipe the table ___ before dinner. (きれいに)", "a": ["clean"], "e": "拭いた結果 the table＝clean になる SVOC。"},
          {"t": "order", "ja": "彼女は髪を短く切ってもらった。", "a": "She had her hair cut short.", "e": "her hair が cut され、その結果 short になる。"},
        ],
      },
    ],
  },
  {
    "n": 12, "title": "不定詞", "part": "Part 3 「準動詞」を攻略する",
    "toc": {"book": 461, "pdf": 456}, "intro": {"book": [463, 465], "pdf": [458, 460]},
    "sections": [
      {
        "id": "12-1-1", "title": "3用法の詳述", "book": 466, "pdf": [461, 463],
        "points": [
          "不定詞（to＋原形）は文中で名詞・形容詞・副詞の3つの働きをする。",
          "名詞的＝主語・目的語・補語、形容詞的＝直前の名詞を修飾、副詞的＝動詞・形容詞・文全体を修飾。",
          "用法は形では区別できない。文中の位置と役割で判断する。",
        ],
        "questions": [
          {"t": "choice", "q": "I have a lot of homework to do. の to do の用法は？", "o": ["形容詞的用法", "名詞的用法", "副詞的用法（目的）", "副詞的用法（感情の原因）"], "e": "直前の名詞 homework を修飾している → 形容詞的用法。"},
          {"t": "choice", "q": "My dream is to travel around the world. の to travel の用法は？", "o": ["名詞的用法", "形容詞的用法", "副詞的用法（目的）", "副詞的用法（結果）"], "e": "is の補語「旅行すること」→ 名詞的用法。"},
          {"t": "choice", "q": "She went to the library to study. の to study の用法は？", "o": ["副詞的用法（目的）", "名詞的用法", "形容詞的用法", "副詞的用法（結果）"], "e": "「勉強するために」行った → 動詞 went を修飾する副詞的用法（目的）。"},
          {"t": "order", "ja": "彼には手伝ってくれる人が必要だ。", "a": "He needs someone to help him.", "e": "someone を to help him が後ろから修飾（形容詞的用法）。"},
        ],
      },
      {
        "id": "12-1-2", "title": "名詞的用法", "book": 469, "pdf": [464, 466],
        "points": [
          "名詞的用法「〜すること」は主語・目的語・補語になる。",
          "主語に置くと長くなるので It is ... to 〜 の形式主語構文にするのが普通。",
          "SVOC の O に不定詞は直接置けない。find it easy to 〜 のように形式目的語 it を使う。",
        ],
        "questions": [
          {"t": "choice", "q": "( ) is important to eat breakfast every day.", "o": ["It", "That", "This", "There"], "e": "形式主語 It。真の主語は to eat breakfast every day。"},
          {"t": "choice", "q": "I found ( ) difficult to answer the question.", "o": ["it", "that", "its", "what"], "e": "形式目的語 it を置き、真の目的語 to answer ... を後ろに回す。"},
          {"t": "fill", "q": "My plan is ___ Kyoto next spring. (visit)", "a": ["to visit"], "e": "補語になる名詞的用法「訪れること」。"},
          {"t": "order", "ja": "英語を話すことは簡単ではない。", "a": "It is not easy to speak English.", "e": "It is ＋形容詞＋ to 〜 の形式主語構文。"},
        ],
      },
      {
        "id": "12-1-3", "title": "形容詞的用法", "book": 472, "pdf": [467, 473],
        "points": [
          "形容詞的用法は名詞の直後に置き「〜するための／〜すべき」と名詞を修飾する。",
          "名詞と不定詞の関係は、主語（someone to help）・目的語（something to eat）・同格（a plan to leave）の3型。",
          "前置詞で終わる形に注意：a house to live in / a pen to write with。",
        ],
        "questions": [
          {"t": "choice", "q": "They are looking for a house to live ( ).", "o": ["in", "at", "on", "for"], "e": "live in a house の関係 → a house to live in。前置詞を落とさない。"},
          {"t": "choice", "q": "Do you have anything ( )? I need a pen or a pencil.", "o": ["to write with", "to write", "writing with", "written"], "e": "「それを使って書くもの」→ write with anything → anything to write with。"},
          {"t": "fill", "q": "She was the first woman ___ the prize. (win)", "a": ["to win", "who won"], "e": "the first 〜 to ...「…した最初の〜」。名詞を不定詞が修飾する。"},
          {"t": "order", "ja": "心配することは何もない。", "a": "There is nothing to worry about.", "e": "worry about nothing の関係 → nothing to worry about。"},
        ],
      },
      {
        "id": "12-1-4", "title": "副詞的用法の役割と全体像", "book": 479, "pdf": [474, 474],
        "points": [
          "副詞的用法は動詞・形容詞・文全体を修飾し、目的・結果・感情の原因・判断の根拠などを表す。",
          "意味は「目的・結果系」「理由系」「熟語系（too 〜 to / enough to など）」に整理できる。",
          "形は同じなので、前にある動詞や形容詞（glad, surprised, must be など）を手がかりに意味を決める。",
        ],
        "questions": [
          {"t": "choice", "q": "I was glad to hear the news. の to hear の意味は？", "o": ["感情の原因「〜して」", "目的「〜するために」", "結果「その結果〜」", "条件「〜すれば」"], "e": "感情の形容詞 glad の後 → 感情の原因「聞いてうれしい」。"},
          {"t": "choice", "q": "He must be rich to buy such a car. の to buy の意味は？", "o": ["判断の根拠「〜するとは」", "目的「〜するために」", "結果「その結果〜」", "感情の原因「〜して」"], "e": "must be rich という判断の根拠 →「あんな車を買うとは」。"},
          {"t": "choice", "q": "This water is safe to drink. の to drink は何を修飾している？", "o": ["形容詞 safe", "名詞 water", "動詞 is", "文全体"], "e": "「飲むのに安全だ」→ 形容詞 safe を修飾する副詞的用法。"},
          {"t": "fill", "q": "We were surprised ___ the result. (see)", "a": ["to see"], "e": "surprised の後 → 感情の原因「結果を見て驚いた」。"},
        ],
      },
      {
        "id": "12-1-5", "title": "副詞的用法の意味(1) 目的・結果系 ①目的「〜するために」", "book": 480, "pdf": [475, 475],
        "points": [
          "目的「〜するために」は動詞の後に to 〜 を置く。文頭に出すこともできる（To catch the train, he ran.）。",
          "目的をはっきり示したいときは in order to 〜 / so as to 〜 を使う。",
          "否定の目的「〜しないように」は not to 単独より in order not to / so as not to が普通。",
        ],
        "questions": [
          {"t": "choice", "q": "She got up early ( ) the first train.", "o": ["to catch", "catching", "for catching", "catch"], "e": "「始発に乗るために」→ 目的の to 不定詞。"},
          {"t": "choice", "q": "He studied hard ( ) fail the exam.", "o": ["so as not to", "not so as to", "in order to", "so that not"], "e": "「落ちないように」→ so as not to。not は to の直前。"},
          {"t": "fill", "q": "I went to the store ___ some milk. (buy)", "a": ["to buy"], "e": "「牛乳を買うために」→ 目的の to buy。"},
          {"t": "order", "ja": "彼は電車に間に合うように走った。", "a": "He ran to catch the train.", "e": "ran の目的を to catch the train で表す。"},
        ],
      },
      {
        "id": "12-1-6", "title": "副詞的用法の意味(1) 目的・結果系 ②結果「その結果〜だ」", "book": 481, "pdf": [476, 478],
        "points": [
          "結果の不定詞は「…して、その結果〜」と前から訳す。本人の意図しない結果が多い。",
          "定番：grow up to be 〜「成長して〜になる」、live to be 〜「〜歳まで生きる」、wake up to find 〜「目覚めると〜」。",
          ", only to 〜「…したが結局〜しただけ」、, never to 〜「そして二度と〜しなかった」は残念な結果。",
        ],
        "pattern": "\\bgrew up to be\\b|\\blived to be\\b|, only to\\b|, never to\\b",
        "questions": [
          {"t": "choice", "q": "He hurried to the station, ( ) find that the train had left.", "o": ["only to", "so as to", "in order to", "enough to"], "e": "急いだが結局…だった → , only to 〜（失望の結果）。"},
          {"t": "choice", "q": "The boy grew up ( ) a famous pianist.", "o": ["to be", "being", "for being", "so as to be"], "e": "grow up to be 〜「成長して〜になる」。目的ではなく結果。"},
          {"t": "fill", "q": "My grandmother lived ___ ninety. (be)", "a": ["to be"], "e": "live to be 〜「〜歳まで生きた」（結果）。"},
          {"t": "order", "ja": "彼は故郷を離れ、二度と戻らなかった。", "a": "He left his hometown, never to return.", "e": ", never to 〜「そして二度と〜しなかった」。"},
        ],
      },
      {
        "id": "12-1-7", "title": "副詞的用法の意味(2) 理由系", "book": 484, "pdf": [479, 479],
        "points": [
          "感情を表す形容詞（glad, sorry, surprised など）の後の to 〜 は感情の原因「〜して」。",
          "判断の根拠「〜するとは」は must / can't や How 〜! など話し手の判断を示す表現とともに使う。",
          "人の性質を評価する形容詞（kind, careless など）は It is 〜 of 人 to ... でも表せる。",
        ],
        "questions": [
          {"t": "choice", "q": "I'm sorry ( ) you waiting.", "o": ["to keep", "keep", "kept", "to be kept"], "e": "「待たせてすみません」→ 感情の原因 to keep。"},
          {"t": "choice", "q": "He must be a fool ( ) such a thing.", "o": ["to believe", "believing", "believes", "believed"], "e": "「そんなことを信じるとは」→ 判断の根拠の to 不定詞。"},
          {"t": "choice", "q": "It was careless ( ) you to leave the door open.", "o": ["of", "for", "to", "with"], "e": "careless は人の性質を評価する形容詞 → of 人。"},
          {"t": "fill", "q": "She was surprised ___ him there. (see)", "a": ["to see"], "e": "surprised の後 → 感情の原因「彼をそこで見て驚いた」。"},
        ],
      },
      {
        "id": "12-1-8", "title": "副詞的用法の意味(3) 熟語系", "book": 485, "pdf": [480, 483],
        "points": [
          "too 〜 to ...「…するには〜すぎる／〜すぎて…できない」。not がなくても否定の意味になる。",
          "〜 enough to ...「…するのに十分〜」。enough は形容詞・副詞の後に置く（old enough）。",
          "文の主語が不定詞の目的語と同じなら繰り返さない：This box is too heavy for me to carry.（×carry it）",
        ],
        "pattern": "\\btoo \\w+ to\\b|\\benough to\\b",
        "questions": [
          {"t": "choice", "q": "This tea is too hot ( ).", "o": ["to drink", "to drink it", "drinking it", "that I drink"], "e": "主語 This tea が drink の目的語なので it は不要。"},
          {"t": "choice", "q": "He is ( ) to drive a car.", "o": ["old enough", "enough old", "too old enough", "so old"], "e": "enough は形容詞の後ろ → old enough to 〜。"},
          {"t": "fill", "q": "The question was ___ difficult for me to answer. (〜すぎて)", "a": ["too"], "e": "too 〜 to ...「難しすぎて答えられなかった」。"},
          {"t": "order", "ja": "彼女は親切にも私を手伝ってくれた。", "a": "She was kind enough to help me.", "e": "kind enough to 〜「親切にも〜する」。"},
        ],
      },
      {
        "id": "12-2-1", "title": "不定詞の意味上の主語（for 人 to 〜「人が〜する」）", "book": 489, "pdf": [484, 485],
        "points": [
          "不定詞の動作をする人が文の主語と違うときは for 人 to 〜 で示す：It is hard for me to get up early.",
          "kind / careless / wise など人の性質を評価する形容詞では of 人 を使う：It is kind of you to help me.",
          "形容詞的・副詞的用法でも使える：a book for children to read / I waited for the bus to come.",
        ],
        "questions": [
          {"t": "choice", "q": "It is necessary ( ) you to see a doctor.", "o": ["for", "of", "to", "with"], "e": "necessary は人の性質ではない → for 人 to 〜。"},
          {"t": "choice", "q": "It was very nice ( ) you to invite me.", "o": ["of", "for", "to", "by"], "e": "nice（親切な）は人の性質を評価 → of you。"},
          {"t": "fill", "q": "This book is easy ___ children to read.", "a": ["for"], "e": "read する人＝children → for children to read。"},
          {"t": "order", "ja": "彼が遅刻するのは珍しい。", "a": "It is unusual for him to be late.", "e": "意味上の主語 for him を to の前に置く。"},
        ],
      },
      {
        "id": "12-2-2", "title": "不定詞の否定形（not to 〜）と分離不定詞", "book": 491, "pdf": [486, 487],
        "points": [
          "不定詞の否定は not / never を to の直前に置く：not to 〜 / never to 〜。",
          "tell 人 not to 〜「〜しないように言う」と don't tell 人 to 〜「〜するようには言わない」は別の意味。",
          "to と原形の間に副詞を入れた to really understand を分離不定詞という。口語では普通だが、堅い文では避けられることもある。",
        ],
        "pattern": "\\bnot to\\b",
        "questions": [
          {"t": "choice", "q": "My mother told me ( ) late.", "o": ["not to be", "to be not", "don't be", "not be"], "e": "不定詞の否定は not を to の前に → not to be。"},
          {"t": "choice", "q": "I promised ( ) the secret to anyone.", "o": ["never to tell", "to tell never", "tell never", "never tell"], "e": "never も to の前に置く → never to tell。"},
          {"t": "choice", "q": "分離不定詞になっているのはどれか？", "o": ["I want to really understand this.", "I want to understand this really.", "I really want to understand this.", "I want really to understand this."], "e": "to と原形 understand の間に副詞 really が入っているもの。"},
          {"t": "order", "ja": "遅れないように気をつけなさい。", "a": "Be careful not to be late.", "e": "careful not to 〜「〜しないように気をつける」。"},
        ],
      },
      {
        "id": "12-2-3", "title": "完了不定詞（to have p.p.）", "book": 493, "pdf": [488, 491],
        "points": [
          "完了不定詞 to have p.p. は、不定詞の内容が述語動詞の時点より「前」であることを示す。",
          "She seems to have been rich.＝ It seems that she was (has been) rich.「金持ちだったようだ」。",
          "hoped / intended to have p.p. は「〜するつもりだったが実現しなかった」を表す（やや堅い）。",
        ],
        "pattern": "\\b(?:seems?|seemed|appears?|appeared|(?:is|are|was|were) said) to have\\b",
        "questions": [
          {"t": "choice", "q": "He seems ( ) ill last week.", "o": ["to have been", "to be", "being", "to have being"], "e": "「先週病気だった」は seems（現在）より前 → to have been。"},
          {"t": "choice", "q": "It seems that she was rich. ＝ She seems ( ) rich.", "o": ["to have been", "to be", "being", "that she was"], "e": "that 節が過去（主節より前）→ 完了不定詞。to be なら「今金持ちらしい」。"},
          {"t": "fill", "q": "They are said ___ this old house in 1920. (build)", "a": ["to have built"], "e": "1920年は are said より前 → to have built。"},
          {"t": "order", "ja": "彼女は若い頃美人だったらしい。", "a": "She seems to have been beautiful in her youth.", "e": "過去のことを seems で推測 → seems to have been。"},
        ],
      },
      {
        "id": "12-2-4", "title": "代不定詞", "book": 497, "pdf": [492, 492],
        "points": [
          "前に出た動詞句の繰り返しを避け、to だけを残す用法を代不定詞という：I'd like to, but I can't.",
          "want / like / love / try / hope / have to / ought to などの後でよく使う。",
          "否定は not to：He told me to go, but I decided not to.",
        ],
        "questions": [
          {"t": "choice", "q": "Would you like to join us? — I'd love ( ).", "o": ["to", "to do", "to it", "doing"], "e": "to join you の繰り返しを避けて to だけ残す（代不定詞）。"},
          {"t": "choice", "q": "You don't have to come if you don't want ( ).", "o": ["to", "to do", "doing", "for"], "e": "want to come の come を省略 → want to。"},
          {"t": "fill", "q": "Go to bed now. — But I don't want ___!", "a": ["to"], "e": "want to go to bed を to だけで代用。"},
          {"t": "order", "ja": "来たければ一緒に来てもいいよ。", "a": "You can come with us if you want to.", "e": "文末の to は to come with us の代わり。"},
        ],
      },
      {
        "id": "12-3-1", "title": "in order to 〜 / so as to 〜", "book": 498, "pdf": [493, 494],
        "points": [
          "in order to 〜 / so as to 〜 は目的「〜するために」をはっきり示す表現。",
          "否定形は in order not to 〜 / so as not to 〜。not は to の直前に置く。",
          "so as to は文頭に置くのを避けるのが普通。文頭では In order to 〜 を使う。",
        ],
        "pattern": "\\bin order (?:not )?to\\b|\\bso as (?:not )?to\\b",
        "questions": [
          {"t": "choice", "q": "She left early ( ) miss the last bus.", "o": ["so as not to", "not so as to", "so not as to", "as so not to"], "e": "否定の目的 → so as not to（not は to の直前）。"},
          {"t": "choice", "q": "( ) to pass the exam, she studied every night.", "o": ["In order", "So that", "Such as", "As well"], "e": "文頭で目的を示す → In order to 〜。so that の後は S＋V。"},
          {"t": "fill", "q": "We got up early in order ___ be late. (〜しないように)", "a": ["not to"], "e": "in order not to 〜「〜しないように」。"},
          {"t": "order", "ja": "彼女は写真を撮るためにカメラを持ってきた。", "a": "She brought a camera in order to take pictures.", "e": "目的を in order to 〜 で明示する。"},
        ],
      },
      {
        "id": "12-3-2", "title": "so 〜 as to ... と so as to 〜 の区別", "book": 500, "pdf": [495, 496],
        "points": [
          "so as to 〜 は目的「〜するために」。so と as は離れない。",
          "so ＋形容詞・副詞＋ as to 〜 は程度・結果「…するほど〜／とても〜なので…」で、so 〜 that ... に近い。",
          "such ＋名詞＋ as to 〜 も程度：He is not such a fool as to believe it.「それを信じるほど愚かではない」。",
        ],
        "questions": [
          {"t": "choice", "q": "He was so kind ( ) show me the way.", "o": ["as to", "that", "so as to", "enough to"], "e": "so 〜 as to ...「親切にも道を教えてくれた」。"},
          {"t": "choice", "q": "Would you be ( ) kind as to open the window?", "o": ["so", "too", "very", "such"], "e": "Would you be so kind as to 〜?「〜していただけますか」。"},
          {"t": "choice", "q": "次のうち「目的」を表すのはどれか？", "o": ["He left early so as to catch the bus.", "He was so tired as to fall asleep at once.", "He was so kind as to help me.", "He is not so foolish as to do that."], "e": "so as to が離れていない最初の文だけが目的。他は so 〜 as to の程度。"},
          {"t": "fill", "q": "She is not ___ a fool as to believe such a story.", "a": ["such"], "e": "名詞（a fool）を含むので such 〜 as to ...。"},
        ],
      },
      {
        "id": "12-3-3", "title": "不定詞を使った色々な慣用表現", "book": 502, "pdf": [497, 499],
        "points": [
          "独立不定詞は文全体を修飾する決まり文句：to tell the truth / so to speak / needless to say。",
          "to begin with「まず第一に」、to make matters worse「さらに悪いことに」、not to mention 〜「〜は言うまでもなく」。",
          "have only to 〜「〜しさえすればよい」、be about to 〜「まさに〜しようとしている」も頻出。",
        ],
        "pattern": "\\bto tell (?:you )?the truth\\b|\\bto be honest\\b|\\bso to speak\\b|\\bneedless to say\\b|\\bto make matters worse\\b|\\bto begin with\\b|\\bstrange to say\\b",
        "questions": [
          {"t": "choice", "q": "To ( ) the truth, I don't like him.", "o": ["tell", "say", "speak", "talk"], "e": "to tell the truth「実を言うと」。tell the truth の組み合わせ。"},
          {"t": "choice", "q": "He is, so to ( ), a walking dictionary.", "o": ["speak", "tell", "talk", "mention"], "e": "so to speak「いわば」。"},
          {"t": "choice", "q": "( ) to say, health is more important than money.", "o": ["Needless", "Useless", "Careless", "Endless"], "e": "needless to say「言うまでもなく」。"},
          {"t": "fill", "q": "It was cold, and ___ make matters worse, it began to rain.", "a": ["to"], "e": "to make matters worse「さらに悪いことに」。"},
        ],
      },
      {
        "id": "12-4-1", "title": "前置詞toと不定詞to", "book": 505, "pdf": [500, 501],
        "points": [
          "不定詞の to の後は動詞の原形、前置詞の to の後は名詞・動名詞。",
          "look forward to / be used to / object to / when it comes to の to は前置詞 → -ing。",
          "見分け方：to の後に普通の名詞を置けるなら前置詞（I look forward to the party.）。",
        ],
        "pattern": "\\blook(?:s|ed|ing)? forward to\\b|\\bwhen it comes to\\b",
        "questions": [
          {"t": "choice", "q": "I'm looking forward to ( ) you again.", "o": ["seeing", "see", "saw", "be seen"], "e": "look forward to の to は前置詞 → 動名詞 seeing。"},
          {"t": "choice", "q": "He is used to ( ) up early.", "o": ["getting", "get", "got", "have got"], "e": "be used to -ing「〜に慣れている」。used to 原形「以前は〜した」と区別。"},
          {"t": "choice", "q": "When it comes to ( ), she is the best in our class.", "o": ["cooking", "cook", "cooked", "be cooking"], "e": "when it comes to 〜「〜のこととなると」の to は前置詞。"},
          {"t": "fill", "q": "She objected to ___ treated like a child. (be)", "a": ["being"], "e": "object to -ing「〜に反対する」→ being treated。"},
        ],
      },
      {
        "id": "12-4-2", "title": "「（目的語に）toをとる動詞」の特徴", "book": 507, "pdf": [502, 505],
        "points": [
          "to 不定詞は「これから〜する」という未来志向。want / hope / decide / promise などが to をとる。",
          "refuse「〜するのを拒む」、fail「〜しない・できない」、manage「なんとか〜する」も to をとる。",
          "enjoy / finish / mind / avoid などは -ing をとるので混同しない。",
        ],
        "questions": [
          {"t": "choice", "q": "We decided ( ) a new car.", "o": ["to buy", "buying", "buy", "bought"], "e": "decide は未来のことを決める → to 不定詞。"},
          {"t": "choice", "q": "She refused ( ) my question.", "o": ["to answer", "answering", "answer", "answered"], "e": "refuse to 〜「〜するのを拒む」。"},
          {"t": "choice", "q": "目的語に to 不定詞をとらない動詞はどれか？", "o": ["enjoy", "hope", "promise", "expect"], "e": "enjoy は -ing をとる（enjoy swimming）。他は to 不定詞。"},
          {"t": "fill", "q": "He finally managed ___ the door. (open)", "a": ["to open"], "e": "manage to 〜「なんとか〜する」。"},
        ],
      },
      {
        "id": "12-4-3", "title": "be to構文", "book": 511, "pdf": [506, 510],
        "points": [
          "be to 〜 は「予定・義務・可能・運命・意図」を表す。どれかは文脈で決める。",
          "可能は否定＋受動が多い（was not to be seen「見られなかった」）。意図は if 節で使う（If you are to succeed, 〜）。",
          "運命は過去形が多い：He was never to see his home again.「二度と故郷を見ることはなかった」。",
        ],
        "pattern": "\\b(?:was|were) never to\\b|\\bnot to be (?:seen|found|heard)\\b",
        "questions": [
          {"t": "choice", "q": "The meeting is to be held next Monday. の be to の意味は？", "o": ["予定", "義務", "可能", "運命"], "e": "next Monday という未来の時 →「開かれる予定だ」。"},
          {"t": "choice", "q": "Not a star was to be seen in the sky. の be to の意味は？", "o": ["可能", "予定", "意図", "運命"], "e": "否定＋受動 →「星ひとつ見えなかった」（可能）。"},
          {"t": "choice", "q": "If you ( ) to succeed, you must work harder.", "o": ["are", "will", "would", "being"], "e": "if 節の be to 〜 は意図「成功したいなら」。"},
          {"t": "fill", "q": "You ___ to finish this report by Friday. (be動詞・現在)", "a": ["are"], "e": "be to 〜 の義務「金曜までに終えなければならない」。"},
        ],
      },
    ],
  },
  {
    "n": 13, "title": "動名詞", "part": "Part 3 「準動詞」を攻略する",
    "toc": {"book": 517, "pdf": 511}, "intro": {"book": [518, 519], "pdf": [512, 513]},
    "sections": [
      {
        "id": "13-1-1", "title": "動名詞の働き", "book": 520, "pdf": [514, 516],
        "points": [
          "動名詞 -ing は「〜すること」の意味で、名詞と同じく主語・目的語・補語・前置詞の目的語になる。",
          "前置詞の後に動詞を置くときは必ず動名詞（不定詞は不可）：He left without saying goodbye.",
          "動詞の性質も残るので、目的語や副詞を伴える：Reading books quickly is not easy.",
        ],
        "questions": [
          {"t": "choice", "q": "She is good at ( ) the piano.", "o": ["playing", "play", "to play", "played"], "e": "前置詞 at の後 → 動名詞。"},
          {"t": "choice", "q": "( ) too much is bad for your health.", "o": ["Eating", "Eat", "Ate", "Eaten"], "e": "主語「食べすぎること」→ 動名詞 Eating。"},
          {"t": "fill", "q": "He left without ___ goodbye. (say)", "a": ["saying"], "e": "前置詞 without の後 → saying。"},
          {"t": "order", "ja": "私の趣味は切手を集めることだ。", "a": "My hobby is collecting stamps.", "e": "補語の動名詞 collecting が目的語 stamps をとる。"},
        ],
      },
      {
        "id": "13-1-2", "title": "動名詞のバリエーション", "book": 523, "pdf": [517, 520],
        "points": [
          "意味上の主語は所有格か目的格を -ing の前に置く：Do you mind my (me) opening the window?",
          "否定は not / never を -ing の直前に置く：I'm sorry for not calling you.",
          "完了形 having p.p.（述語動詞より前のこと）、受動形 being p.p.（〜されること）もある。",
        ],
        "questions": [
          {"t": "choice", "q": "I'm proud of ( ) won the prize.", "o": ["having", "being", "to have", "have"], "e": "賞を取ったのは過去 → 完了動名詞 having won。"},
          {"t": "choice", "q": "He doesn't like ( ) treated like a child.", "o": ["being", "having", "been", "to being"], "e": "「扱われること」→ 受動の動名詞 being p.p.。"},
          {"t": "choice", "q": "I'm sorry for ( ) you earlier.", "o": ["not calling", "calling not", "no calling", "don't calling"], "e": "動名詞の否定は not を -ing の直前に。"},
          {"t": "fill", "q": "Do you mind ___ opening the window? (私が)", "a": ["my", "me"], "e": "意味上の主語は所有格 my（口語では目的格 me も可）。"},
        ],
      },
      {
        "id": "13-2-1", "title": "動名詞のイメージ（その1）反復", "book": 527, "pdf": [521, 523],
        "points": [
          "動名詞は「実際にしている・繰り返している」イメージ。enjoy / practice / mind / consider / imagine は -ing をとる。",
          "practice は「繰り返し練習する」、mind は「（〜するのが）気になる・嫌だ」と考えると覚えやすい。",
          "不定詞と対比：want to swim（まだしていない）⇔ enjoy swimming（実際にしている）。",
        ],
        "questions": [
          {"t": "choice", "q": "We enjoyed ( ) in the lake.", "o": ["swimming", "to swim", "swim", "swam"], "e": "enjoy は -ing をとる。"},
          {"t": "choice", "q": "She practices ( ) the violin every day.", "o": ["playing", "to play", "play", "played"], "e": "practice（繰り返し練習する）は -ing をとる。"},
          {"t": "choice", "q": "Would you mind ( ) the door?", "o": ["closing", "to close", "close", "closed"], "e": "mind は -ing をとる。Would you mind -ing?「〜していただけますか」。"},
          {"t": "fill", "q": "Have you considered ___ abroad? (study)", "a": ["studying"], "e": "consider（あれこれ考える）は -ing をとる。"},
        ],
      },
      {
        "id": "13-2-2", "title": "動名詞のイメージ（その2）中断", "book": 530, "pdf": [524, 524],
        "points": [
          "「していたことをやめる・終える」は -ing：stop / finish / give up / quit。",
          "stop to 〜 は「〜するために立ち止まる（手を止める）」。この to は目的の副詞的用法。",
          "give up / quit -ing は「（習慣を）やめる」の意味でよく使う。",
        ],
        "questions": [
          {"t": "choice", "q": "Have you finished ( ) the report?", "o": ["writing", "to write", "write", "written"], "e": "finish は -ing をとる。"},
          {"t": "choice", "q": "He gave up ( ) last year.", "o": ["smoking", "to smoke", "smoke", "smoked"], "e": "give up -ing「（習慣を）やめる」。"},
          {"t": "choice", "q": "Stop ( ) and listen to me.", "o": ["talking", "to talk", "talk", "talked"], "e": "「おしゃべりをやめて聞きなさい」→ stop -ing。"},
          {"t": "order", "ja": "彼は私に話しかけるために立ち止まった。", "a": "He stopped to talk to me.", "e": "stop to 〜「〜するために立ち止まる」。"},
        ],
      },
      {
        "id": "13-2-3", "title": "動名詞のイメージ（その3）逃避", "book": 531, "pdf": [525, 525],
        "points": [
          "「避ける・逃れる・先延ばしにする」系の動詞は -ing：avoid / escape / miss / put off / postpone / deny。",
          "deny -ing「〜したことを否定する」、escape -ing「〜するのを免れる」。",
          "目の前の行為から離れるイメージなので、未来に向かう to 不定詞とは相性が悪い。",
        ],
        "questions": [
          {"t": "choice", "q": "You should avoid ( ) out late at night.", "o": ["going", "to go", "go", "went"], "e": "avoid は -ing をとる。"},
          {"t": "choice", "q": "He denied ( ) the money.", "o": ["stealing", "to steal", "steal", "stolen"], "e": "deny -ing「〜したことを否定する」。"},
          {"t": "choice", "q": "Let's put off ( ) a decision until next week.", "o": ["making", "to make", "make", "made"], "e": "put off（延期する）は -ing をとる。"},
          {"t": "fill", "q": "She narrowly escaped ___ hit by a car. (be)", "a": ["being"], "e": "escape -ing →「車にひかれるのを免れた」being hit。"},
        ],
      },
      {
        "id": "13-2-4", "title": "toと-ingで意味が大きく変わる動詞", "book": 532, "pdf": [526, 529],
        "points": [
          "remember / forget -ing は「（過去に）〜したこと」、to 〜 は「（これから）〜すること」。",
          "regret to 〜「残念ながら〜する」⇔ -ing「〜したのを後悔する」。try to 〜「努める」⇔ -ing「試しにやる」。",
          "need -ing は「〜される必要がある」という受動の意味：The car needs washing.",
        ],
        "questions": [
          {"t": "choice", "q": "Don't forget ( ) this letter on your way.", "o": ["to mail", "mailing", "mail", "mailed"], "e": "これから出すこと → forget to 〜。"},
          {"t": "choice", "q": "I remember ( ) him at the party last year.", "o": ["meeting", "to meet", "meet", "met"], "e": "去年会ったこと（過去）→ remember -ing。"},
          {"t": "choice", "q": "We regret ( ) you that the flight has been canceled.", "o": ["to inform", "informing", "inform", "informed"], "e": "「残念ながらお知らせします」→ regret to 〜。"},
          {"t": "fill", "q": "This room needs ___ . (clean)", "a": ["cleaning", "to be cleaned"], "e": "need -ing ＝ need to be p.p.「掃除される必要がある」。"},
        ],
      },
      {
        "id": "13-3-1", "title": "前置詞がポイントになる慣用表現", "book": 536, "pdf": [530, 531],
        "points": [
          "on -ing「〜するとすぐに」、in -ing「〜するときに」、feel like -ing「〜したい気がする」。",
          "prevent / keep / stop O from -ing「O が〜するのを妨げる」。",
          "look forward to / be used to / What do you say to の to は前置詞なので -ing が続く。",
        ],
        "pattern": "\\bfe(?:el|els|lt) like (?:going|having|doing|eating|crying|laughing|dancing|singing|sleeping)\\b|\\bwhat do you say to\\b",
        "questions": [
          {"t": "choice", "q": "( ) arriving at the station, he called his wife.", "o": ["On", "In", "At", "By"], "e": "on -ing「〜するとすぐに」。"},
          {"t": "choice", "q": "I don't feel like ( ) out tonight.", "o": ["going", "to go", "go", "went"], "e": "feel like の like は前置詞 → -ing。"},
          {"t": "choice", "q": "The rain prevented us ( ) going out.", "o": ["from", "of", "to", "with"], "e": "prevent O from -ing「O が〜するのを妨げる」。"},
          {"t": "fill", "q": "What do you say ___ going for a walk?", "a": ["to"], "e": "What do you say to -ing?「〜するのはどう？」。"},
        ],
      },
      {
        "id": "13-3-2", "title": "文法的観点がポイントになる慣用表現", "book": 538, "pdf": [532, 535],
        "points": [
          "It is no use -ing「〜しても無駄だ」、There is no -ing「〜できない」、It goes without saying「言うまでもない」。",
          "cannot help -ing「〜せずにはいられない」、be worth -ing「〜する価値がある」。",
          "worth -ing の文では主語が -ing の目的語なので繰り返さない：This book is worth reading.（×reading it）",
        ],
        "pattern": "\\bno use \\w+ing\\b|\\bcan(?:'t|not) help \\w+ing\\b|\\bcould(?:n't| not) help \\w+ing\\b|\\bgoes without saying\\b",
        "questions": [
          {"t": "choice", "q": "There is no ( ) what will happen.", "o": ["telling", "to tell", "tell", "told"], "e": "There is no -ing「〜できない」→「何が起こるかわからない」。"},
          {"t": "choice", "q": "I couldn't help ( ) when I saw his face.", "o": ["laughing", "to laugh", "laugh", "laughed"], "e": "cannot help -ing「〜せずにはいられない」。"},
          {"t": "choice", "q": "This museum is worth ( ).", "o": ["visiting", "visiting it", "to visit", "being visited"], "e": "be worth -ing。主語 This museum が目的語なので it は不要。"},
          {"t": "fill", "q": "It is no use ___ to him. He never listens. (talk)", "a": ["talking"], "e": "It is no use -ing「〜しても無駄だ」。"},
        ],
      },
    ],
  },
  {
    "n": 14, "title": "分詞", "part": "Part 3 「準動詞」を攻略する",
    "toc": {"book": 543, "pdf": 536}, "intro": {"book": [544, 545], "pdf": [537, 538]},
    "sections": [
      {
        "id": "14-1-1", "title": "形容詞の意識と2種類の形", "book": 546, "pdf": [539, 541],
        "points": [
          "分詞は動詞を形容詞として使う形。-ing は「〜している（能動・進行）」、p.p. は「〜された（受動）」。",
          "自動詞の p.p. は「〜してしまった（完了）」：fallen leaves「落ち葉」、a retired teacher「退職した先生」。",
          "名詞が動作を「する側」か「される側」かで -ing と p.p. を選ぶ。",
        ],
        "questions": [
          {"t": "choice", "q": "Look at the ( ) baby. (泣いている)", "o": ["crying", "cried", "cry", "to cry"], "e": "赤ちゃんが泣いている（能動・進行）→ crying。"},
          {"t": "choice", "q": "The ground was covered with ( ) leaves.", "o": ["fallen", "fall", "fell", "to fall"], "e": "自動詞 fall の p.p. は完了「落ちてしまった葉」。"},
          {"t": "choice", "q": "I bought a ( ) car. (中古の)", "o": ["used", "using", "use", "to use"], "e": "車は使われた側 → used car。"},
          {"t": "fill", "q": "Be careful with the ___ glass. (break)", "a": ["broken"], "e": "グラスは割られた側 → broken。"},
        ],
      },
      {
        "id": "14-1-2", "title": "分詞の位置（分詞の前置修飾・後置修飾）", "book": 549, "pdf": [542, 543],
        "points": [
          "分詞1語なら名詞の前（a sleeping cat）、語句を伴えば名詞の後（a cat sleeping on the sofa）。",
          "後置修飾は「関係代名詞＋be」が省略された形と考えるとわかりやすい：a letter (which was) written in English。",
          "前置修飾は名詞の性質・分類、後置修飾はその場の具体的な動作を表しやすい。",
        ],
        "questions": [
          {"t": "choice", "q": "The boy ( ) with Tom is my brother.", "o": ["talking", "talked", "is talking", "talks"], "e": "with Tom を伴う分詞が The boy を後ろから修飾。述語動詞は is。"},
          {"t": "choice", "q": "This is a book ( ) by a famous writer.", "o": ["written", "writing", "wrote", "to write"], "e": "本は書かれた側。by 〜 を伴うので後置 → written。"},
          {"t": "fill", "q": "Do you know the man ___ over there? (stand)", "a": ["standing"], "e": "over there を伴うので名詞の後に置く → standing。"},
          {"t": "order", "ja": "ベンチに座っている女性は私のおばだ。", "a": "The woman sitting on the bench is my aunt.", "e": "sitting on the bench が The woman を後置修飾。"},
        ],
      },
      {
        "id": "14-1-3", "title": "-ingとp.p.の判別", "book": 551, "pdf": [544, 545],
        "points": [
          "主語・述語で結んで判断：the dog barks → a barking dog／the window is broken → a broken window。",
          "SVOC の C も O との関係で判断：I saw him crossing the road.／I had my hair cut.（髪が切られる）",
          "keep O -ing / leave O p.p. / hear O p.p. など動詞＋O＋分詞の型でも同じ基準で選ぶ。",
        ],
        "questions": [
          {"t": "choice", "q": "I heard my name ( ) in the crowd.", "o": ["called", "calling", "to call", "call"], "e": "名前は呼ばれる側 → hear O p.p.。"},
          {"t": "choice", "q": "He kept me ( ) for an hour.", "o": ["waiting", "waited", "to wait", "wait"], "e": "私が待っている（能動）→ keep O -ing。"},
          {"t": "choice", "q": "She had her bike ( ) yesterday.", "o": ["repaired", "repairing", "repair", "to repair"], "e": "自転車は修理される側 → have O p.p.。"},
          {"t": "fill", "q": "Who is the girl ___ a red dress? (wear)", "a": ["wearing"], "e": "少女が着ている（能動）→ wearing。"},
        ],
      },
      {
        "id": "14-2-1", "title": "感情動詞の「用法」", "book": 553, "pdf": [546, 547],
        "points": [
          "surprise / excite / interest / bore など感情の動詞は「（人を）〜させる」という他動詞。",
          "人が感情を「抱く」ときは p.p.（I'm surprised）、物事が感情を「引き起こす」ときは -ing（surprising news）。",
          "人が主語でも -ing になりうる：He is boring.「彼は（人を）退屈させる人だ」。",
        ],
        "questions": [
          {"t": "choice", "q": "The game was very ( ).", "o": ["exciting", "excited", "excite", "to excite"], "e": "試合が人をわくわくさせる → exciting。"},
          {"t": "choice", "q": "I was ( ) at the news.", "o": ["surprised", "surprising", "surprise", "to surprise"], "e": "私が驚かされた → surprised。"},
          {"t": "choice", "q": "We were ( ) with his long speech.", "o": ["bored", "boring", "bore", "to bore"], "e": "私たちが退屈させられた → bored。"},
          {"t": "fill", "q": "This book is very ___ . (interest)", "a": ["interesting"], "e": "本が人に興味を起こさせる → interesting。"},
        ],
      },
      {
        "id": "14-2-2", "title": "様々な感情動詞", "book": 555, "pdf": [548, 550],
        "points": [
          "satisfy「満足させる」、disappoint「がっかりさせる」、embarrass「恥ずかしい思いをさせる」、frighten「怖がらせる」など。",
          "日本語の「〜する」につられない：「満足する」＝ be satisfied、「がっかりする」＝ be disappointed。",
          "前置詞もセットで覚える：be satisfied with / be disappointed at (with) / be tired of 〜（うんざりする）。",
        ],
        "questions": [
          {"t": "choice", "q": "I was ( ) with the result of the test.", "o": ["satisfied", "satisfying", "satisfy", "to satisfy"], "e": "私が満足させられた → be satisfied with。"},
          {"t": "choice", "q": "I felt ( ) when I fell down in front of everyone.", "o": ["embarrassed", "embarrassing", "embarrass", "to embarrass"], "e": "私が恥ずかしい思いをした → embarrassed。"},
          {"t": "choice", "q": "The movie was ( ). I expected much more.", "o": ["disappointing", "disappointed", "disappoint", "to disappoint"], "e": "映画が人をがっかりさせる → disappointing。"},
          {"t": "fill", "q": "The children were ___ by the loud noise. (frighten)", "a": ["frightened"], "e": "子どもたちが怖がらされた → frightened。"},
        ],
      },
    ],
  },
  {
    "n": 15, "title": "分詞構文", "part": "Part 3 「準動詞」を攻略する",
    "toc": {"book": 559, "pdf": 551}, "intro": {"book": [560, 561], "pdf": [552, 553]},
    "sections": [
      {
        "id": "15-1-1", "title": "-ingの用法識別", "book": 562, "pdf": [554, 554],
        "points": [
          "-ing は①進行形（be＋-ing）②動名詞 ③名詞を修飾する現在分詞 ④分詞構文 のどれかに見分ける。",
          "主語・目的語・前置詞の後なら動名詞、名詞の直後でその名詞を説明するなら分詞。",
          "文頭や文末でコンマをはさみ、文全体に情報を付け加えるなら分詞構文。",
        ],
        "questions": [
          {"t": "choice", "q": "Walking in the park, I met an old friend. の Walking は？", "o": ["分詞構文", "動名詞", "進行形", "名詞を修飾する分詞"], "e": "コンマで主節につながり「公園を歩いていて」→ 分詞構文。"},
          {"t": "choice", "q": "Walking in the park is good exercise. の Walking は？", "o": ["動名詞", "分詞構文", "進行形", "名詞を修飾する分詞"], "e": "文の主語「歩くこと」→ 動名詞。"},
          {"t": "choice", "q": "The man walking in the park is my father. の walking は？", "o": ["名詞を修飾する分詞", "動名詞", "分詞構文", "進行形"], "e": "The man を後ろから修飾する現在分詞。"},
          {"t": "choice", "q": "a sleeping bag の sleeping は？", "o": ["動名詞（用途「寝るための」）", "現在分詞（袋が眠っている）", "分詞構文", "進行形"], "e": "袋が眠るわけではない →「寝るための袋」という用途の動名詞。"},
        ],
      },
      {
        "id": "15-1-2", "title": "分詞構文の成り立ち", "book": 563, "pdf": [555, 556],
        "points": [
          "分詞構文は副詞節を短くした形：①接続詞を消す ②主節と同じ主語を消す ③動詞を -ing にする。",
          "副詞節が be 動詞なら being になり、しばしば省略される：(Being) tired, he went to bed.",
          "主節と主語が同じなのが前提。主語がずれたまま使うと誤り（懸垂分詞）になる。",
        ],
        "questions": [
          {"t": "choice", "q": "When he saw me, he ran away. を分詞構文にすると？", "o": ["Seeing me, he ran away.", "Saw me, he ran away.", "Seen me, he ran away.", "He seeing me, ran away."], "e": "接続詞と同じ主語を消し、saw → seeing。"},
          {"t": "choice", "q": "( ) from the hill, the town looks beautiful.", "o": ["Seen", "Seeing", "Saw", "See"], "e": "町は丘から「見られる」側 → (Being) seen。"},
          {"t": "fill", "q": "___ tired, she went to bed early. (be)", "a": ["being"], "e": "As she was tired → Being tired（Being は省略も可）。"},
          {"t": "order", "ja": "駅に着くと、彼は妹に電話した。", "a": "Arriving at the station, he called his sister.", "e": "When he arrived at the station → Arriving at the station。"},
        ],
      },
      {
        "id": "15-1-3", "title": "分詞構文の「意味」（その1）基本的発想", "book": 565, "pdf": [557, 560],
        "points": [
          "分詞構文の基本は「〜して、〜しながら」というゆるいつながり。無理に接続詞を1つに決めなくてよい。",
          "文末の分詞構文は「〜しながら（付帯状況）」「そして〜（連続動作）」になりやすい。",
          "文頭の分詞構文は「時」「理由」が多い。前後の内容から自然な意味を選ぶ。",
        ],
        "questions": [
          {"t": "choice", "q": "She sat on the sofa, reading a magazine. の意味に最も近いのは？", "o": ["雑誌を読みながら", "雑誌を読んだので", "雑誌を読んだけれど", "雑誌を読めば"], "e": "文末の分詞構文 → 付帯状況「〜しながら」。"},
          {"t": "choice", "q": "Feeling sick, I stayed home. の意味に最も近いのは？", "o": ["気分が悪かったので", "気分が悪いのに", "気分が悪ければ", "気分が悪くなるように"], "e": "文頭の分詞構文。家にいた理由 →「〜ので」。"},
          {"t": "fill", "q": "He came into the room, ___ a song. (sing)", "a": ["singing"], "e": "「歌いながら入ってきた」→ 付帯状況の singing。"},
          {"t": "order", "ja": "彼女は手を振りながら歩き去った。", "a": "She walked away, waving her hand.", "e": "文末の分詞構文 waving her hand が付帯状況を表す。"},
        ],
      },
      {
        "id": "15-1-4", "title": "分詞構文の「意味」（その2）細かいこと", "book": 569, "pdf": [561, 562],
        "points": [
          "条件「〜すれば」や譲歩「〜だけれど」の意味はまれ。条件は Turning to the left, you will ... のように主節が未来のときに多い。",
          "意味をはっきりさせるため接続詞を残すことがある：While walking, 〜 / When asked, 〜。",
          "with O -ing / p.p.「O を〜して／O が〜されて」は付帯状況を表す関連表現。",
        ],
        "pattern": "\\bwith (?:his|her|their|my|your|our) (?:arms|legs|eyes|mouth) (?:folded|crossed|closed|open|shut)\\b",
        "questions": [
          {"t": "choice", "q": "( ) reading the book, she fell asleep.", "o": ["While", "During", "For", "Since"], "e": "接続詞を残した分詞構文 While -ing。during は前置詞なので -ing 句と合わない。"},
          {"t": "choice", "q": "Turning to the left, you will find the post office. の意味に最も近いのは？", "o": ["左に曲がれば", "左に曲がったので", "左に曲がったけれど", "左に曲がりながら"], "e": "主節が will の未来 → 条件「〜すれば」。"},
          {"t": "choice", "q": "He was sitting with his arms ( ).", "o": ["folded", "folding", "fold", "to fold"], "e": "腕は組まれている側 → with O p.p.「腕を組んで」。"},
          {"t": "fill", "q": "When ___ about the accident, he said nothing. (ask)", "a": ["asked"], "e": "When he was asked → When asked（接続詞を残した形）。"},
        ],
      },
      {
        "id": "15-2-1", "title": "分詞構文のバリエーション（その1）否定形・完了形", "book": 571, "pdf": [563, 564],
        "points": [
          "否定は not / never を分詞の前に置く：Not knowing what to do, 〜「どうしてよいかわからず」。",
          "主節より前のことは完了形 Having p.p.：Having finished my homework, I went out.",
          "受動の Being p.p. / Having been p.p. は Being / Having been を省略し p.p. で始めることが多い。",
        ],
        "questions": [
          {"t": "choice", "q": "( ) what to say, I kept silent.", "o": ["Not knowing", "Knowing not", "Don't knowing", "No knowing"], "e": "分詞構文の否定は not を分詞の前に。"},
          {"t": "choice", "q": "( ) the work the day before, he had nothing to do today.", "o": ["Having finished", "Finishing", "Finished", "To finish"], "e": "前日のこと（主節より前）→ 完了形 Having finished。"},
          {"t": "choice", "q": "( ) in simple English, this book is easy to read.", "o": ["Written", "Writing", "Having written", "To write"], "e": "本は書かれた側。(Being / Having been) written → Written。"},
          {"t": "order", "ja": "宿題を終えてから、彼はテレビを見た。", "a": "Having finished his homework, he watched TV.", "e": "宿題を終えたのが先 → Having p.p.。"},
        ],
      },
      {
        "id": "15-2-2", "title": "分詞構文のバリエーション（その2）意味上の主語", "book": 573, "pdf": [565, 567],
        "points": [
          "分詞構文の主語が主節と違うときは、分詞の前にその主語を置く（独立分詞構文）：The weather being fine, 〜。",
          "天候の it や There is 構文も残す：It being rainy, 〜 / There being no bus, 〜。",
          "主語を置かないと、主節の主語が分詞の主語だと誤解される点に注意。",
        ],
        "questions": [
          {"t": "choice", "q": "( ) fine, we went on a picnic.", "o": ["It being", "Being", "It was", "Having"], "e": "天候の it は主節の we と違う → It being fine。"},
          {"t": "choice", "q": "( ) no bus service, we had to walk.", "o": ["There being", "Being", "There was", "It being"], "e": "There is 構文 → There being 〜。"},
          {"t": "fill", "q": "School ___ over, the children ran home. (be)", "a": ["being"], "e": "School が意味上の主語 → School being over。"},
          {"t": "order", "ja": "日が沈んだので、私たちは帰宅した。", "a": "The sun having set, we went home.", "e": "主語 The sun を残し、先に起きたので having set。"},
        ],
      },
      {
        "id": "15-2-3", "title": "分詞構文の慣用表現", "book": 576, "pdf": [568, 574],
        "points": [
          "意味上の主語が一般の人のときは省略して慣用的に使う：generally speaking「一般的に言えば」、frankly speaking「率直に言えば」。",
          "judging from 〜「〜から判断すると」、considering 〜「〜を考えると」、speaking of 〜「〜と言えば」。",
          "weather permitting「天気がよければ」、all things considered「すべてを考慮すると」も頻出。",
        ],
        "questions": [
          {"t": "choice", "q": "( ) from his accent, he must be from the south.", "o": ["Judging", "Judged", "Judge", "Having judged"], "e": "judging from 〜「〜から判断すると」。"},
          {"t": "choice", "q": "( ) speaking, I don't like his idea.", "o": ["Frankly", "Frank", "Franker", "Frankness"], "e": "frankly speaking「率直に言えば」。"},
          {"t": "choice", "q": "We'll go hiking tomorrow, weather ( ).", "o": ["permitting", "permitted", "permits", "to permit"], "e": "weather permitting「天気がよければ」（独立分詞構文）。"},
          {"t": "fill", "q": "___ of music, have you heard her new song? (speak)", "a": ["speaking"], "e": "speaking of 〜「〜と言えば」。"},
        ],
      },
    ],
  },
  {
    "n": 16, "title": "命令文／There is 構文", "part": "Part 4 「中学文法」を昇華させる",
    "toc": {"book": 583, "pdf": 575}, "intro": {"book": [584, 585], "pdf": [576, 577]},
    "sections": [
      {
        "id": "16-1-1", "title": "命令文の意味と使い方", "book": 586, "pdf": [578, 580],
        "points": [
          "命令文は主語 you を省略し、動詞の原形で始める。be動詞なら Be 〜。",
          "否定の命令は Don't＋原形（be動詞も Don't be 〜）。Never＋原形 はより強い禁止。",
          "Let's＋原形「〜しよう」、否定は Let's not＋原形。please を添えると丁寧になる。",
        ],
        "questions": [
          {"t": "choice", "q": "( ) quiet in the library.", "o": ["Be", "Are", "Being", "To be"], "e": "命令文は動詞の原形で始める → be動詞なら Be。"},
          {"t": "choice", "q": "( ) late for the meeting tomorrow.", "o": ["Don't be", "Don't", "Not be", "Doesn't be"], "e": "be動詞の否定命令も Don't be 〜。"},
          {"t": "fill", "q": "It's raining. Let's ___ go out today.", "a": ["not"], "e": "Let's の否定は Let's not＋原形。"},
          {"t": "order", "ja": "間違えることを恐れるな。", "a": "Don't be afraid of making mistakes.", "e": "Don't be＋形容詞 で「〜であるな」。"},
        ],
      },
      {
        "id": "16-1-2", "title": "命令文に＋αでくっつくもの", "book": 589, "pdf": [581, 584],
        "points": [
          "命令文, and 〜「…しなさい、そうすれば〜」／命令文, or 〜「…しなさい、さもないと〜」。",
          "名詞句＋and 〜 も同じ働き：One more step, and 〜「もう一歩で〜」。",
          "命令文の後に will you? / won't you? を付けると依頼・勧誘の調子が柔らかくなる。",
        ],
        "questions": [
          {"t": "choice", "q": "Study hard, ( ) you will pass the exam.", "o": ["and", "or", "but", "if"], "e": "「そうすれば合格する」→ 命令文, and 〜。"},
          {"t": "choice", "q": "Leave now, ( ) you'll miss the last train.", "o": ["or", "and", "but", "so"], "e": "「さもないと終電に遅れる」→ 命令文, or 〜。"},
          {"t": "choice", "q": "Open the window, ( ) you?", "o": ["will", "do", "don't", "are"], "e": "命令文の付加疑問は will you?（won't you? も可）。"},
          {"t": "fill", "q": "One more step, ___ you'll fall off the cliff.", "a": ["and"], "e": "名詞句＋and 〜「もう一歩進めば〜」。命令文, and と同じ発想。"},
        ],
      },
      {
        "id": "16-2-1", "title": "There is構文の「本当の考え方」", "book": 593, "pdf": [585, 588],
        "points": [
          "There is 構文は、聞き手にとって「新しい情報」である物・人の存在を初めて伝える形。",
          "後ろの名詞は a / some / no など不特定のものが普通。the や my 〜など特定のものは S is 〜 で表す。",
          "be動詞は後ろの名詞（意味上の主語）に一致させる：There is a 〜 / There are 〜s。",
        ],
        "pattern": "\\bthere (is|are|was|were)\\b",
        "questions": [
          {"t": "choice", "q": "There ( ) some apples in the basket.", "o": ["are", "is", "be", "has"], "e": "apples が複数 → There are。"},
          {"t": "choice", "q": "（どこにあるか聞かれて）「私の鍵は机の上にあります」の英訳として最も自然なものは？", "o": ["My key is on the desk.", "There is my key on the desk.", "There has my key on the desk.", "It has my key on the desk."], "e": "my key は特定の既知の物 → There is ではなく S is 〜 で表す。"},
          {"t": "choice", "q": "There ( ) a lot of snow last winter.", "o": ["was", "were", "is", "had"], "e": "snow は数えられない名詞 → 単数扱い。過去なので was。"},
          {"t": "fill", "q": "There ___ no one in the room when I came back. (be)", "a": ["was"], "e": "no one は単数扱い、過去の話 → was。"},
        ],
      },
      {
        "id": "16-2-2", "title": "There is 名詞 分詞（-ing / p.p.）", "book": 597, "pdf": [589, 590],
        "points": [
          "There is＋名詞＋-ing「〜が…している」、There is＋名詞＋p.p.「〜が…されている」。",
          "名詞と分詞の関係で選ぶ：名詞が「する」側なら -ing、「される」側なら p.p.。",
          "新しい情報を先に提示し、その様子を分詞で後から説明する語順になる。",
        ],
        "questions": [
          {"t": "choice", "q": "There is a man ( ) at the door.", "o": ["waiting", "waited", "to waiting", "waits"], "e": "男性が「待っている」→ 能動の -ing。"},
          {"t": "choice", "q": "There were two windows ( ) by the storm.", "o": ["broken", "breaking", "break", "to break"], "e": "窓は嵐に「割られた」→ 受動の p.p.。"},
          {"t": "fill", "q": "There's a dog ___ in the garden. (bark)", "a": ["barking"], "e": "犬が「吠えている」→ -ing。"},
          {"t": "order", "ja": "公園で遊んでいる子どもがたくさんいた。", "a": "There were many children playing in the park.", "e": "There were＋名詞＋-ing＋場所。"},
        ],
      },
    ],
  },
  {
    "n": 17, "title": "否定", "part": "Part 4 「中学文法」を昇華させる",
    "toc": {"book": 599, "pdf": 591}, "intro": {"book": [600, 600], "pdf": [592, 592]},
    "sections": [
      {
        "id": "17-1-1", "title": "全体否定と部分否定", "book": 601, "pdf": [593, 594],
        "points": [
          "not＋all / every / both / always / necessarily は「すべて〜というわけではない」＝部分否定。",
          "全体否定は no / none / never / neither や not ... any / not ... either で表す。",
          "2者の全否定は not ... either（＝neither）、3者以上は not ... any（＝none）。",
        ],
        "questions": [
          {"t": "choice", "q": "「金持ちがみんな幸せとは限らない」の英訳として正しいものは？", "o": ["Not all rich people are happy.", "No rich people are happy.", "Any rich people are not happy.", "Rich people are never happy."], "e": "Not all 〜 で部分否定。No / never は全体否定、Any 〜 not の語順は不可。"},
          {"t": "choice", "q": "I don't know ( ) of his parents. I've never met them.", "o": ["either", "both", "neither", "any"], "e": "2人とも知らない＝全体否定 → not ... either。not ... both は「両方とは限らない」。"},
          {"t": "choice", "q": "What the newspapers say is not ( ) true.", "o": ["necessarily", "never", "nothing", "none"], "e": "not necessarily「必ずしも〜ではない」＝部分否定。"},
          {"t": "fill", "q": "___ of the students passed the test. It was too difficult.（誰一人合格しなかった）", "a": ["None"], "e": "none of 〜「〜のうち誰も…ない」＝全体否定。"},
        ],
      },
      {
        "id": "17-1-2", "title": "二重否定", "book": 603, "pdf": [595, 595],
        "points": [
          "否定語を二つ重ねると強い肯定になる：never ... without -ing「〜すれば必ず…する」。",
          "not＋un- / in- などの否定の形容詞：not uncommon「珍しくない＝よくある」。",
          "There is no A without B「BのないAはない」も二重否定の典型。",
        ],
        "questions": [
          {"t": "choice", "q": "I never see this photo ( ) thinking of my grandmother.", "o": ["without", "with", "for", "unless"], "e": "never ... without -ing「〜すると必ず…する」。"},
          {"t": "choice", "q": "It is not ( ) for people to change jobs these days.（最近、転職は珍しくない）", "o": ["uncommon", "common", "usual", "frequent"], "e": "not uncommon ＝「珍しくない」。not common は「珍しい」になってしまう。"},
          {"t": "choice", "q": "There is no rule ( ) exceptions.（例外のない規則はない）", "o": ["without", "with", "and", "of"], "e": "no A without B「BのないAはない」。"},
          {"t": "order", "ja": "彼女は私に会うと必ずほほえむ。", "a": "She never sees me without smiling.", "e": "never ... without -ing で「会えば必ず〜」。"},
        ],
      },
      {
        "id": "17-1-3", "title": "notを使わない「否定表現」", "book": 604, "pdf": [596, 597],
        "points": [
          "hardly / scarcely は程度「ほとんど〜ない」、seldom / rarely は頻度「めったに〜ない」。",
          "few（数）/ little（量）は a がないと「ほとんどない」という否定の意味。",
          "far from / anything but / the last ... to do なども not なしで強い否定を表す。",
        ],
        "questions": [
          {"t": "choice", "q": "I could ( ) hear him because of the noise.", "o": ["hardly", "hard", "less", "few"], "e": "hardly「ほとんど〜ない」。hard は「熱心に」で意味が違う。"},
          {"t": "choice", "q": "He is ( ) a gentleman. He is always rude to people.", "o": ["anything but", "nothing but", "all but", "not only"], "e": "anything but ＝「決して〜ではない」。nothing but ＝ only、all but ＝ almost。"},
          {"t": "choice", "q": "She is the last person ( ) a lie.", "o": ["to tell", "telling", "told", "tells"], "e": "the last person to do「最も〜しそうにない人」。"},
          {"t": "fill", "q": "His explanation was far ___ satisfactory.（決して満足のいくものではない）", "a": ["from"], "e": "far from 〜「〜からほど遠い＝決して〜ではない」。"},
        ],
      },
      {
        "id": "17-2-1", "title": "noの発想", "book": 606, "pdf": [598, 598],
        "points": [
          "no＋名詞は「ゼロの〜」を示し、not a / not any より強い。主語にも立てられる（No one came.）。",
          "be no＋名詞 は強い否定で逆の評価を含む：He is no fool.「ばかどころか賢い」。",
          "no more than ＝ only「たった」、no less than ＝ as much / many as「〜も」。",
        ],
        "questions": [
          {"t": "choice", "q": "( ) student could answer the question.", "o": ["No", "Not", "None", "Nothing"], "e": "名詞の前に置いて「ゼロの〜」→ No。None は of 〜 か単独で使う。"},
          {"t": "choice", "q": "He is ( ) fool. He knew exactly what was going on.", "o": ["no", "not", "none", "never"], "e": "be no＋名詞「決して〜ではない」。not なら not a fool と冠詞が必要。"},
          {"t": "choice", "q": "I have ( ) than 1,000 yen with me, so I can't buy lunch for everyone.", "o": ["no more", "no less", "not less", "much more"], "e": "「たった千円しかない」→ no more than ＝ only。"},
          {"t": "order", "ja": "冷蔵庫には牛乳がまったく残っていない。", "a": "There is no milk left in the fridge.", "e": "no＋名詞で「ゼロ」。left は「残っている」の過去分詞。"},
        ],
      },
      {
        "id": "17-2-2", "title": "否定の範囲", "book": 607, "pdf": [599, 600],
        "points": [
          "not はふつう後ろに続く部分を否定する。not ... because 〜 は「〜だから…するのではない」とも読める。",
          "think / believe / suppose などは主節を否定するのが自然：I don't think he will come.",
          "that節を代用する I hope not / I'm afraid not は「〜でないといい／残念ながら〜ない」。",
        ],
        "questions": [
          {"t": "choice", "q": "「彼は来ないと思う」の最も自然な英訳は？", "o": ["I don't think he will come.", "I don't think he won't come.", "I think not he will come.", "I not think he will come."], "e": "英語では think 側を否定するのが自然（否定の繰り上げ）。"},
          {"t": "choice", "q": "I didn't marry her ( ) she was rich. I married her because I loved her.", "o": ["because", "so", "although", "if"], "e": "not ... because 〜「〜だから…したのではない」。because節まで否定が及ぶ。"},
          {"t": "choice", "q": "\"Will it rain tomorrow?\" \"I hope ( ).\"（降らないといいね）", "o": ["not", "no", "don't", "nothing"], "e": "I hope not ＝ I hope it won't rain。"},
          {"t": "order", "ja": "彼女がパーティーに来るとは思わない。", "a": "I don't think she will come to the party.", "e": "主節の think を否定する。"},
        ],
      },
      {
        "id": "17-2-3", "title": "否定と強調表現", "book": 609, "pdf": [601, 601],
        "points": [
          "not ... at all / not ... in the least / not ... a bit ＝「まったく〜ない」。",
          "by no means「決して〜ない」、not a single 〜「ただ一つの〜もない」も強い否定。",
          "no＋名詞 の後に whatever / whatsoever を置くと否定がさらに強まる。",
        ],
        "questions": [
          {"t": "choice", "q": "I'm not tired ( ) all.", "o": ["at", "in", "for", "by"], "e": "not ... at all「まったく〜ない」。"},
          {"t": "choice", "q": "There was not a ( ) person on the street.", "o": ["single", "only", "any", "some"], "e": "not a single 〜「一人も〜ない」。"},
          {"t": "choice", "q": "His answer was ( ) no means correct.", "o": ["by", "in", "at", "on"], "e": "by no means「決して〜ない」。"},
          {"t": "fill", "q": "She didn't understand the question in the ___.（少しも）", "a": ["least"], "e": "not ... in the least「少しも〜ない」。"},
        ],
      },
      {
        "id": "17-2-4", "title": "否定の位置", "book": 610, "pdf": [602, 603],
        "points": [
          "never / seldom / little / not until 〜 など否定語を文頭に出すと、後ろは疑問文の語順（倒置）。",
          "否定の相づち：Neither [Nor] do I.「私も〜ない」。肯定なら So do I.。",
          "不定詞・動名詞を否定するときは直前に not：not to do / not -ing。",
        ],
        "pattern": "\\b(never|seldom|rarely|hardly|little) (have|has|had|did|do|does|was|were|could) (i|he|she|we|they|you)\\b",
        "questions": [
          {"t": "choice", "q": "Never ( ) such a beautiful sunset.", "o": ["have I seen", "I have seen", "I saw", "seen I have"], "e": "否定語 Never が文頭 → 倒置（have I seen）。"},
          {"t": "choice", "q": "Not until he lost his health ( ) its value.", "o": ["did he realize", "he realized", "he did realize", "realized he"], "e": "Not until 〜 が文頭 → did he realize と倒置。"},
          {"t": "choice", "q": "I told him ( ) late again.", "o": ["not to be", "to be not", "don't be", "not be"], "e": "不定詞の否定は to の直前に not。"},
          {"t": "fill", "q": "\"I don't like horror movies.\" \"___ do I.\"", "a": ["Neither", "Nor"], "e": "否定文への同意は Neither [Nor] do I.。"},
        ],
      },
    ],
  },
  {
    "n": 18, "title": "疑問詞", "part": "Part 4 「中学文法」を昇華させる",
    "toc": {"book": 613, "pdf": 604}, "intro": {"book": [614, 615], "pdf": [605, 606]},
    "sections": [
      {
        "id": "18-1-1", "title": "疑問代名詞（who / whom / whose / which / what）", "book": 616, "pdf": [607, 607],
        "points": [
          "who（誰）、whom（誰を：口語では who）、whose（誰の・誰のもの）、which（どれ）、what（何）。",
          "疑問詞が主語のときは語順を変えず do も使わない：Who broke it?",
          "前置詞の直後では whom を使う：With whom 〜?（口語では Who 〜 with?）。",
        ],
        "questions": [
          {"t": "choice", "q": "( ) is this umbrella? — It's Tom's.", "o": ["Whose", "Who", "Whom", "Which"], "e": "「誰のもの」→ whose（単独で代名詞として使える）。"},
          {"t": "choice", "q": "「誰がこの絵を描いたの？」の英訳として正しいものは？", "o": ["Who painted this picture?", "Who did he paint this picture?", "Whom painted this picture?", "Who did painted this picture?"], "e": "主語を尋ねる who は平叙文の語順のまま、do は不要。"},
          {"t": "choice", "q": "With ( ) did you go to the concert?", "o": ["whom", "who", "whose", "which"], "e": "前置詞の直後は目的格 whom。"},
          {"t": "fill", "q": "___ are you waiting for? — My sister.", "a": ["Who", "Whom"], "e": "答えが人 → who（文語では whom）。"},
        ],
      },
      {
        "id": "18-1-2", "title": "疑問形容詞（which / what）", "book": 617, "pdf": [608, 608],
        "points": [
          "what / which は名詞の前について「何の〜／どの〜」という疑問形容詞になる。",
          "選択肢が限られているときは which＋名詞、不特定なら what＋名詞。",
          "whose＋名詞「誰の〜」も同じく名詞にかかる。",
        ],
        "questions": [
          {"t": "choice", "q": "( ) sport do you play, soccer or baseball?", "o": ["Which", "Who", "How", "Whose"], "e": "選択肢が示されている → which＋名詞。"},
          {"t": "choice", "q": "( ) car is parked outside? — It's my brother's.", "o": ["Whose", "Who's", "Whom", "What's"], "e": "「誰の車」→ whose＋名詞。Who's は Who is の短縮形。"},
          {"t": "fill", "q": "___ kind of music do you listen to?", "a": ["What"], "e": "what kind of 〜「どんな種類の〜」。"},
          {"t": "order", "ja": "どのバスが駅に行きますか。", "a": "Which bus goes to the station?", "e": "Which bus が主語 → 後ろは平叙文の語順。"},
        ],
      },
      {
        "id": "18-1-3", "title": "疑問副詞（when / where / why / how）", "book": 618, "pdf": [609, 610],
        "points": [
          "when（時）、where（場所）、why（理由）、how（方法・状態・程度）を尋ねる。",
          "how＋形容詞・副詞で程度：How long（期間）/ How often（頻度）/ How far（距離）。",
          "When は明確な過去の時を尋ねるので、現在完了とは使わない。",
        ],
        "questions": [
          {"t": "choice", "q": "( ) have you lived in this town? — For ten years.", "o": ["How long", "When", "How often", "How far"], "e": "期間を尋ねる → How long。When は現在完了と使わない。"},
          {"t": "choice", "q": "( ) do you go to the gym? — Twice a week.", "o": ["How often", "How long", "How many", "When"], "e": "頻度を尋ねる → How often。"},
          {"t": "choice", "q": "When ( ) to Kyoto? — Last summer.", "o": ["did you go", "have you gone", "have you been", "do you go"], "e": "When＋過去形。現在完了とは一緒に使わない。"},
          {"t": "fill", "q": "___ is the station from here? — About two kilometers.", "a": ["How far"], "e": "距離を尋ねる → How far。"},
        ],
      },
      {
        "id": "18-2-1", "title": "what や how を使った会話表現", "book": 620, "pdf": [611, 615],
        "points": [
          "What do you think of 〜?「〜をどう思う？」（How は不可）。What is S like?「Sはどんな感じ？」。",
          "How come S V?「どうして〜？」は後ろが平叙文の語順。What 〜 for? は「何のために」。",
          "What if 〜?「もし〜したらどうなる？／〜したらどう？」。",
        ],
        "pattern": "\\b(how come|what if)\\b",
        "questions": [
          {"t": "choice", "q": "( ) do you think of his new song?", "o": ["What", "How", "Which", "Why"], "e": "think の目的語を尋ねる → What do you think of 〜?。"},
          {"t": "choice", "q": "How come ( ) to the meeting yesterday?", "o": ["you didn't come", "didn't you come", "you not came", "did you not came"], "e": "How come の後は平叙文の語順（S＋V）。"},
          {"t": "choice", "q": "What is your new teacher ( )? — She's kind and funny.", "o": ["like", "about", "as", "for"], "e": "What is S like?「Sはどんな人？」。"},
          {"t": "fill", "q": "What did you do that ___?（何のためにそんなことをしたの）", "a": ["for"], "e": "What 〜 for?「何のために〜」。"},
        ],
      },
      {
        "id": "18-2-2", "title": "提案する表現", "book": 625, "pdf": [616, 618],
        "points": [
          "Why don't you 〜?「〜したらどう？」は相手への提案、Why don't we 〜? / Shall we 〜? は「一緒に〜しよう」。",
          "How about / What about の後は名詞か動名詞（to不定詞は不可）。",
          "Why not＋原形?「〜したらどう？」。単独の Why not? は「いいね、そうしよう」。",
        ],
        "pattern": "\\b(why don't (you|we)|shall we|how about)\\b",
        "questions": [
          {"t": "choice", "q": "How about ( ) out for dinner tonight?", "o": ["going", "go", "to go", "went"], "e": "How about は前置詞を含む → 動名詞。"},
          {"t": "choice", "q": "Why ( ) ask your teacher for help?", "o": ["don't you", "not you", "you don't", "aren't you"], "e": "Why don't you＋原形?「〜したらどう？」。"},
          {"t": "choice", "q": "Why not ( ) a taxi? It's raining hard.", "o": ["take", "taking", "to take", "took"], "e": "Why not＋原形?。"},
          {"t": "order", "ja": "今夜、映画を見に行きませんか。", "a": "Why don't we go to the movies tonight?", "e": "Why don't we 〜?「一緒に〜しない？」。"},
        ],
      },
      {
        "id": "18-3-1", "title": "間接疑問文", "book": 628, "pdf": [619, 620],
        "points": [
          "疑問文が文の一部になると「疑問詞＋S＋V」の平叙文の語順になり、do / does / did は消える。",
          "Yes / No で答える疑問文を埋め込むときは if / whether「〜かどうか」を使う。",
          "think / believe / suppose などが入ると疑問詞は文頭へ：Who do you think he is?",
        ],
        "questions": [
          {"t": "choice", "q": "Do you know where ( )?", "o": ["she lives", "does she live", "lives she", "she live"], "e": "間接疑問 → 疑問詞＋S＋V の語順。"},
          {"t": "choice", "q": "「彼は誰だと思う？」の英訳として正しいものは？", "o": ["Who do you think he is?", "Do you think who he is?", "Who do you think is he?", "Do you think who is he?"], "e": "Yes/No で答えない質問なので疑問詞を文頭に出し、残りは平叙文の語順。"},
          {"t": "choice", "q": "I wonder ( ) she will come to the party.", "o": ["if", "that", "what", "which"], "e": "「来るかどうか」→ if（＝whether）。"},
          {"t": "fill", "q": "Can you tell me what time it ___?", "a": ["is"], "e": "間接疑問なので what time it is の語順。"},
        ],
      },
      {
        "id": "18-3-2", "title": "疑問文の出だし", "book": 630, "pdf": [621, 621],
        "points": [
          "疑問文の出だしは元の文の動詞で決まる：be動詞→Is / Are、一般動詞→Do / Does / Did、完了形→Have / Has。",
          "疑問詞を使うときは「疑問詞＋疑問文の語順」。",
          "前置詞は文末に残すのが口語の基本：Where are you from? / What are you looking for?",
        ],
        "questions": [
          {"t": "choice", "q": "( ) your brother like cooking?", "o": ["Does", "Is", "Do", "Has"], "e": "一般動詞 like、主語は3人称単数 → Does。"},
          {"t": "choice", "q": "( ) you finished your homework yet?", "o": ["Have", "Did", "Are", "Do"], "e": "finished（過去分詞）と yet → 現在完了の疑問文 Have you 〜?。"},
          {"t": "choice", "q": "( ) are you looking for?", "o": ["What", "Where", "How", "Why"], "e": "look for の目的語を尋ねる → What。前置詞 for は文末に残る。"},
          {"t": "fill", "q": "Where ___ you from? — I'm from Osaka.", "a": ["are"], "e": "be from 〜「〜出身」→ Where are you from?。"},
        ],
      },
      {
        "id": "18-3-3", "title": "疑問詞＋to不定詞", "book": 631, "pdf": [622, 623],
        "points": [
          "疑問詞＋to不定詞で「〜すべきか」を表す名詞のカタマリ：how to do / what to do / where to go。",
          "「疑問詞＋S＋should＋原形」に書き換えられる。",
          "which / what＋名詞＋to do もある（which bus to take）。why to は使わない。",
        ],
        "pattern": "\\b(how|what|where|when|whether) to\\b",
        "questions": [
          {"t": "choice", "q": "I don't know ( ) to use this machine.", "o": ["how", "what", "why", "whom"], "e": "「使い方」→ how to use。use の目的語はすでにあるので what は不可。"},
          {"t": "choice", "q": "I couldn't decide ( ) to wear to the party.", "o": ["what", "how", "where", "who"], "e": "wear の目的語がない → what to wear「何を着るか」。"},
          {"t": "fill", "q": "She showed me ___ to make the cake.（作り方）", "a": ["how"], "e": "how to do「〜の仕方」。"},
          {"t": "order", "ja": "次に何をすべきか教えてください。", "a": "Please tell me what to do next.", "e": "tell＋人＋what to do。"},
        ],
      },
      {
        "id": "18-3-4", "title": "否定疑問文", "book": 633, "pdf": [624, 626],
        "points": [
          "Don't you 〜? / Isn't it 〜? は「〜ではないの？」と驚き・確認を表す否定疑問文。",
          "答え方は中身で決まる：内容が肯定なら Yes、否定なら No。",
          "日本語の「はい／いいえ」と逆になりやすい：Don't you like it? — No, I don't.（はい、好きではない）",
        ],
        "questions": [
          {"t": "choice", "q": "Don't you like coffee? — ( ). I never drink it.", "o": ["No, I don't", "Yes, I don't", "No, I do", "Yes, I do"], "e": "好きではない（否定の内容）→ No, I don't。"},
          {"t": "choice", "q": "Aren't you tired? — ( ). I walked for five hours.", "o": ["Yes, I am", "No, I am", "Yes, I'm not", "No, I'm not"], "e": "疲れている（肯定の内容）→ Yes, I am。"},
          {"t": "choice", "q": "( ) he come to school yesterday?", "o": ["Didn't", "Doesn't", "Wasn't", "Hasn't"], "e": "一般動詞 come、yesterday → Didn't。"},
          {"t": "fill", "q": "Isn't this your bag? — ___, it isn't. Mine is black.", "a": ["No"], "e": "内容が否定（私のではない）→ No。"},
        ],
      },
      {
        "id": "18-3-5", "title": "mindを使って「頼む」文", "book": 636, "pdf": [627, 628],
        "points": [
          "Would / Do you mind -ing?「〜していただけますか」。mind の後は動名詞。",
          "Do you mind if I 〜?「〜してもいいですか」で許可を求める。",
          "mind は「嫌だと思う」なので、OK なら Not at all. / Of course not. と否定で答える。",
        ],
        "pattern": "\\b(would|do) you mind\\b",
        "questions": [
          {"t": "choice", "q": "Would you mind ( ) the window?", "o": ["opening", "to open", "open", "opened"], "e": "mind の目的語は動名詞。"},
          {"t": "choice", "q": "Do you mind if I sit here? — ( ). Go ahead.", "o": ["Not at all", "Yes, I do", "I'm afraid I do", "Yes, I mind"], "e": "「気にしない＝どうぞ」→ 否定で答える。Yes は「困る」の意味になる。"},
          {"t": "fill", "q": "Would you mind ___ a little more slowly? (speak)", "a": ["speaking"], "e": "mind＋-ing。"},
          {"t": "order", "ja": "窓を閉めてもかまいませんか。", "a": "Do you mind if I close the window?", "e": "Do you mind if I 〜? で許可を求める。"},
        ],
      },
      {
        "id": "18-3-6", "title": "付加疑問文", "book": 638, "pdf": [629, 631],
        "points": [
          "肯定文には否定の付加疑問、否定文には肯定の付加疑問。主語は代名詞、動詞は be / 助動詞 / do。",
          "never / hardly などを含む文は否定文扱い → 肯定の付加疑問。",
          "Let's 〜, shall we? / 命令文, will you? / There is 〜, isn't there? は形で覚える。",
        ],
        "questions": [
          {"t": "choice", "q": "You're a student, ( )?", "o": ["aren't you", "are you", "don't you", "isn't it"], "e": "肯定の be動詞の文 → aren't you?。"},
          {"t": "choice", "q": "Let's go for a walk, ( )?", "o": ["shall we", "will you", "don't we", "let's we"], "e": "Let's 〜 の付加疑問は shall we?。"},
          {"t": "choice", "q": "She has never been to Kyoto, ( )?", "o": ["has she", "hasn't she", "does she", "didn't she"], "e": "never を含む否定文、現在完了 → has she?。"},
          {"t": "fill", "q": "There is a bank near here, ___ there?", "a": ["isn't"], "e": "There is 〜 の付加疑問は isn't there?。"},
        ],
      },
      {
        "id": "18-3-7", "title": "修辞疑問文（反語表現）", "book": 641, "pdf": [632, 632],
        "points": [
          "修辞疑問文は形は疑問文でも答えを求めず、強い主張を表す（反語）。",
          "肯定の修辞疑問は否定の主張：Who knows? ＝ Nobody knows.",
          "否定の修辞疑問は肯定の主張：Who doesn't know 〜? ＝ Everybody knows 〜.",
        ],
        "questions": [
          {"t": "choice", "q": "Who knows what will happen tomorrow? の意味として最も適切なものは？", "o": ["明日何が起こるかは誰にもわからない。", "明日何が起こるか知っている人を教えて。", "明日何が起こるかは誰でも知っている。", "明日何が起こるかを知っている人がいる。"], "e": "肯定の修辞疑問 → Nobody knows 〜 という否定の主張。"},
          {"t": "choice", "q": "What is the ( ) of worrying about it?（心配して何になるのか）", "o": ["use", "way", "matter", "fact"], "e": "What is the use of -ing? ＝ It is no use -ing「〜しても無駄だ」。"},
          {"t": "choice", "q": "Who ( ) love his own children?（自分の子を愛さない人などいない）", "o": ["doesn't", "does", "isn't", "hasn't"], "e": "否定の修辞疑問 → 「誰もが愛している」という肯定の主張。"},
          {"t": "fill", "q": "___ can tell?（＝Nobody can tell.）", "a": ["Who"], "e": "Who can tell?「誰にわかるだろうか（誰にもわからない）」。"},
        ],
      },
      {
        "id": "18-3-8", "title": "感嘆文", "book": 642, "pdf": [633, 634],
        "points": [
          "What (a / an)＋形容詞＋名詞＋S V! / How＋形容詞・副詞＋S V!",
          "名詞があれば What、形容詞・副詞だけなら How と覚える。",
          "数えられない名詞・複数名詞には a / an を付けない：What nice weather! / What beautiful flowers!",
        ],
        "questions": [
          {"t": "choice", "q": "( ) a beautiful day it is!", "o": ["What", "How", "So", "Which"], "e": "a beautiful day（名詞を含む）→ What。"},
          {"t": "choice", "q": "( ) fast he runs!", "o": ["How", "What", "Which", "Such"], "e": "副詞 fast だけ → How。"},
          {"t": "choice", "q": "What ( ) weather we're having!", "o": ["nice", "a nice", "nice a", "an nice"], "e": "weather は数えられない名詞 → a を付けない。"},
          {"t": "order", "ja": "彼らはなんて大きな家に住んでいるのだろう。", "a": "What a big house they live in!", "e": "What a＋形容詞＋名詞＋S V。前置詞 in が文末に残る。"},
        ],
      },
    ],
  },
  {
    "n": 19, "title": "前置詞", "part": "Part 4 「中学文法」を昇華させる",
    "toc": {"book": 645, "pdf": 635}, "intro": {"book": [646, 647], "pdf": [636, 637]},
    "sections": [
      {
        "id": "19-1-1", "title": "前置詞に関する文法的視点", "book": 648, "pdf": [638, 639],
        "points": [
          "前置詞の後ろは名詞・代名詞（目的格）・動名詞。動詞を置くなら -ing 形にする。",
          "前置詞＋名詞は、名詞を修飾する形容詞句か、動詞などを修飾する副詞句として働く。",
          "疑問文・関係詞節・受動態では前置詞が文末に取り残されることがある：What are you afraid of?",
        ],
        "questions": [
          {"t": "choice", "q": "Thank you for ( ) me.", "o": ["helping", "help", "to help", "helped"], "e": "前置詞 for の後 → 動名詞。"},
          {"t": "choice", "q": "This is between you and ( ).", "o": ["me", "I", "my", "mine"], "e": "前置詞 between の目的語 → 目的格 me。"},
          {"t": "choice", "q": "What are you afraid ( )?", "o": ["of", "to", "from", "at"], "e": "be afraid of 〜 の of が疑問文の文末に残る。"},
          {"t": "fill", "q": "He left without ___ goodbye. (say)", "a": ["saying"], "e": "前置詞 without の後 → 動名詞。"},
        ],
      },
      {
        "id": "19-1-2", "title": "at", "book": 650, "pdf": [640, 641],
        "points": [
          "at の核心は「一点」：時刻（at seven）、地点（at the station）。",
          "年齢・速度・値段・温度などの数値上の一点にも使う：at 20 / at 100 km an hour。",
          "狙いの一点：look at / aim at / laugh at。感情の原因（be surprised at）にも使う。",
        ],
        "questions": [
          {"t": "choice", "q": "The concert starts ( ) seven o'clock.", "o": ["at", "on", "in", "to"], "e": "時刻（時の一点）→ at。"},
          {"t": "choice", "q": "The car was running ( ) 100 kilometers an hour.", "o": ["at", "by", "in", "on"], "e": "速度（目盛り上の一点）→ at。"},
          {"t": "choice", "q": "Don't laugh ( ) me!", "o": ["at", "to", "on", "for"], "e": "笑う対象（狙いの一点）→ laugh at。"},
          {"t": "fill", "q": "I was surprised ___ the news.", "a": ["at", "by"], "e": "感情の原因 → be surprised at（by も可）。"},
        ],
      },
      {
        "id": "19-1-3", "title": "by", "book": 652, "pdf": [642, 644],
        "points": [
          "by の核心は「そばに」：by the window。そこから手段 by bus / by email（無冠詞）や受動態の行為者へ。",
          "期限「〜までに」は by、継続「〜までずっと」は until と区別する。",
          "差「〜だけ」（win by two points）、単位「〜単位で」（by the hour、the が必要）。",
        ],
        "questions": [
          {"t": "choice", "q": "Please finish the report ( ) Friday.", "o": ["by", "until", "since", "during"], "e": "finish は完了の動作 → 期限の by。until は継続。"},
          {"t": "choice", "q": "I usually go to work ( ) bus.", "o": ["by", "on", "with", "in"], "e": "交通手段 → by＋無冠詞の名詞。"},
          {"t": "choice", "q": "Our team lost the game ( ) two points.", "o": ["by", "with", "for", "at"], "e": "差を表す by「〜の差で」。"},
          {"t": "fill", "q": "In this job, we are paid by ___ hour.", "a": ["the"], "e": "単位の by は by the hour / by the dozen と the を付ける。"},
        ],
      },
      {
        "id": "19-1-4", "title": "for", "book": 655, "pdf": [645, 647],
        "points": [
          "for の核心は「〜に向かって」：leave for 〜（〜へ向けて出発）、目的 for fun、利益 for you。",
          "期間 for three years、交換 buy 〜 for ten dollars、賛成 for（⇔ against）。",
          "基準「〜にしては」：He looks young for his age.",
        ],
        "questions": [
          {"t": "choice", "q": "She left ( ) London yesterday.（ロンドンへ向けて出発した）", "o": ["for", "to", "at", "in"], "e": "leave for 〜「〜へ向けて出発する」。"},
          {"t": "choice", "q": "I bought this book ( ) ten dollars.", "o": ["for", "on", "with", "by"], "e": "交換・代価の for。"},
          {"t": "choice", "q": "Are you ( ) or against the plan?", "o": ["for", "with", "on", "at"], "e": "賛成 for ⇔ 反対 against。"},
          {"t": "fill", "q": "I've lived here ___ ten years.", "a": ["for"], "e": "期間の長さ → for。"},
        ],
      },
      {
        "id": "19-1-5", "title": "from", "book": 658, "pdf": [648, 649],
        "points": [
          "from の核心は「起点」：from Tokyo / from nine to five。",
          "原料（形が変わる）be made from、原因 suffer from、区別 tell A from B。",
          "分離・妨害：prevent / keep / stop A from -ing「Aが〜するのを妨げる」。",
        ],
        "questions": [
          {"t": "choice", "q": "Wine is made ( ) grapes.", "o": ["from", "of", "by", "with"], "e": "原料の形が変わる → made from。"},
          {"t": "choice", "q": "Can you tell a sheep ( ) a goat?", "o": ["from", "of", "to", "with"], "e": "tell A from B「AとBを区別する」。"},
          {"t": "choice", "q": "The heavy rain prevented us ( ) going out.", "o": ["from", "of", "to", "for"], "e": "prevent A from -ing「Aが〜するのを妨げる」。"},
          {"t": "fill", "q": "She is suffering ___ a bad cold.", "a": ["from"], "e": "suffer from 〜「〜に苦しむ」。原因の from。"},
        ],
      },
      {
        "id": "19-1-6", "title": "in", "book": 660, "pdf": [650, 652],
        "points": [
          "in の核心は「枠の中」：空間 in the box、時間の幅 in May / in 2020。",
          "in＋時間で「今から〜後に」：in ten minutes。after は未来の「今から〜後」には使わない。",
          "状態・服装・手段：in trouble / in red / in English。",
        ],
        "questions": [
          {"t": "choice", "q": "I'll be back ( ) ten minutes.", "o": ["in", "since", "at", "on"], "e": "「今から10分後」→ in。"},
          {"t": "choice", "q": "She was born ( ) 1995.", "o": ["in", "on", "at", "by"], "e": "年（時間の幅）→ in。"},
          {"t": "choice", "q": "Please write your answer ( ) English.", "o": ["in", "by", "with", "on"], "e": "言語という枠の中 → in English。"},
          {"t": "fill", "q": "The woman ___ red is my aunt.（赤い服を着た）", "a": ["in"], "e": "着用の in「〜を着て」。"},
        ],
      },
      {
        "id": "19-1-7", "title": "of", "book": 663, "pdf": [653, 657],
        "points": [
          "of の核心は「〜の一部・〜に属する」：one of my friends / the top of the hill。",
          "同格「〜という」：the city of Rome。性質：of＋抽象名詞 ＝ 形容詞（of importance ＝ important）。",
          "分離・除去：rob A of B / deprive A of B（AからBを奪う）。",
        ],
        "questions": [
          {"t": "choice", "q": "The thief robbed her ( ) her bag.", "o": ["of", "from", "for", "off"], "e": "rob＋人＋of＋物「人から物を奪う」。"},
          {"t": "choice", "q": "This matter is ( ) great importance.", "o": ["of", "in", "with", "for"], "e": "of＋抽象名詞 ＝ 形容詞（of importance ＝ important）。"},
          {"t": "choice", "q": "He is one ( ) my best friends.", "o": ["of", "in", "from", "for"], "e": "部分の of「〜のうちの一人」。"},
          {"t": "fill", "q": "We visited the city ___ Kyoto last year.", "a": ["of"], "e": "同格の of「京都という都市」。"},
        ],
      },
      {
        "id": "19-1-8", "title": "on", "book": 668, "pdf": [658, 661],
        "points": [
          "on の核心は「接触」：上だけでなく壁・天井にも on the wall / on the ceiling。",
          "特定の日・日付の朝など：on Monday / on the morning of May 5。",
          "依存 depend on、主題 a book on history、手段 on foot / on TV、継続 go on。",
        ],
        "questions": [
          {"t": "choice", "q": "There is a fly ( ) the ceiling.", "o": ["on", "in", "at", "over"], "e": "天井に接触している → on。"},
          {"t": "choice", "q": "We met ( ) the morning of May 5.", "o": ["on", "in", "at", "by"], "e": "特定の日の朝 → on（in the morning とは異なる）。"},
          {"t": "choice", "q": "I usually go to school ( ) foot.", "o": ["on", "by", "with", "in"], "e": "徒歩は on foot。"},
          {"t": "fill", "q": "Whether we go or not depends ___ the weather.", "a": ["on", "upon"], "e": "depend on 〜「〜次第だ」。"},
        ],
      },
      {
        "id": "19-1-9", "title": "to", "book": 672, "pdf": [662, 664],
        "points": [
          "to の核心は「到達点」：go to school / from A to B。",
          "動作・感情の向かう相手：give 〜 to / be kind to。to one's surprise「〜が驚いたことに」。",
          "比較・一致：prefer A to B / superior to、dance to the music。",
        ],
        "questions": [
          {"t": "choice", "q": "I prefer tea ( ) coffee.", "o": ["to", "than", "for", "from"], "e": "prefer A to B「BよりAを好む」。than は使わない。"},
          {"t": "choice", "q": "( ) my surprise, he passed the exam.", "o": ["To", "For", "In", "With"], "e": "to one's surprise「〜が驚いたことに」。"},
          {"t": "choice", "q": "They danced ( ) the music.", "o": ["to", "with", "by", "on"], "e": "音楽に合わせて → to（一致）。"},
          {"t": "fill", "q": "He was very kind ___ me when I was sick.", "a": ["to"], "e": "be kind to＋人。"},
        ],
      },
      {
        "id": "19-1-10", "title": "with", "book": 675, "pdf": [665, 668],
        "points": [
          "with の核心は「〜と一緒に」：同伴 with friends、道具 with a knife、所有 a girl with long hair。",
          "付帯状況 with＋O＋C「Oが〜の状態で」：with his eyes closed。",
          "原因 shake with cold、対立 fight with などにも広がる。",
        ],
        "questions": [
          {"t": "choice", "q": "Cut the paper ( ) scissors.", "o": ["with", "by", "in", "on"], "e": "道具 → with。"},
          {"t": "choice", "q": "Look at the girl ( ) long hair.", "o": ["with", "in", "of", "on"], "e": "身体的特徴を持っている → with。"},
          {"t": "choice", "q": "He was sitting with his eyes ( ).", "o": ["closed", "closing", "close", "to close"], "e": "目は「閉じられた」状態 → with O＋p.p.。"},
          {"t": "fill", "q": "She was shaking ___ cold.", "a": ["with", "from"], "e": "原因の with「寒さで」（from も可）。"},
        ],
      },
      {
        "id": "19-2-1", "title": "特に核心が大事な前置詞（その1）about / over / under", "book": 679, "pdf": [669, 671],
        "points": [
          "about の核心は「周り」：〜について（話題の周辺）、約〜（数値の周辺）。",
          "over は「上を覆う・弧を描いて越える」：over the wall / over 100（〜を超えて）/ over coffee（〜しながら）。",
          "under は「真下・覆われて」：under the table / under 18（〜未満）/ under construction（〜中）。",
        ],
        "questions": [
          {"t": "choice", "q": "The new bridge is ( ) construction.", "o": ["under", "over", "about", "in"], "e": "under construction「建設中」。"},
          {"t": "choice", "q": "We talked about it ( ) a cup of coffee.", "o": ["over", "about", "under", "on"], "e": "over＋飲食物「〜しながら」。"},
          {"t": "choice", "q": "I have ( ) 1,000 yen — maybe 980 or 1,020.", "o": ["about", "over", "under", "beyond"], "e": "数値の周辺 → about「約」。over は超過、under は未満。"},
          {"t": "fill", "q": "Children ___ 12 can enter the museum for free.（12歳未満）", "a": ["under"], "e": "under＋数値「〜未満」。"},
        ],
      },
      {
        "id": "19-2-2", "title": "特に核心が大事な前置詞（その2）against / beyond / behind", "book": 682, "pdf": [672, 674],
        "points": [
          "against の核心は「逆らう・ぶつかる」：反対、寄りかかる lean against、背景 against the sky。",
          "beyond は「向こう側・範囲を越えて」：beyond description / beyond my understanding。",
          "behind は「後ろ」：場所のほか遅れ behind schedule、背後の理由 the reason behind 〜。",
        ],
        "questions": [
          {"t": "choice", "q": "Are you for or ( ) the plan?", "o": ["against", "beyond", "behind", "over"], "e": "反対 → against。"},
          {"t": "choice", "q": "The beauty of the view was ( ) description.", "o": ["beyond", "against", "behind", "under"], "e": "beyond description「言葉で表せないほど」。"},
          {"t": "choice", "q": "The train was ten minutes ( ) schedule.", "o": ["behind", "beyond", "against", "after"], "e": "behind schedule「予定より遅れて」。"},
          {"t": "fill", "q": "The mountain looked beautiful ___ the blue sky.（青空を背景に）", "a": ["against"], "e": "背景の against。"},
        ],
      },
      {
        "id": "19-2-3", "title": "派生した意味に注意したい前置詞 after / through / across", "book": 685, "pdf": [675, 677],
        "points": [
          "after は「後」から「追いかける」へ：run after（追う）、look after（世話する）、name A after B。",
          "through は「貫通」：through the tunnel、期間の最初から最後まで all through the night。",
          "across は「横切って・向こう側に」：across the street。come across は「偶然出会う」。",
        ],
        "questions": [
          {"t": "choice", "q": "The police officer ran ( ) the thief.（泥棒を追いかけた）", "o": ["after", "through", "across", "into"], "e": "run after「〜を追いかける」。run into は「偶然出会う」。"},
          {"t": "choice", "q": "I came ( ) an old friend at the station.（偶然会った）", "o": ["across", "after", "through", "over"], "e": "come across「偶然出会う・見つける」。"},
          {"t": "choice", "q": "The train passed ( ) a long tunnel.", "o": ["through", "across", "after", "about"], "e": "トンネルを貫通する → through。"},
          {"t": "fill", "q": "There is a bank ___ the street.（通りの向こう側に）", "a": ["across"], "e": "across the street「通りの向こうに」。"},
        ],
      },
      {
        "id": "19-2-4", "title": "区別が必要な前置詞 between / among / beside / besides", "book": 688, "pdf": [678, 682],
        "points": [
          "between は「2つ（個別に意識されるもの）の間」、among は「3つ以上の集団の中」。",
          "beside は「〜のそばに」（場所）。",
          "besides は「〜に加えて・〜のほかに」。s の有無で意味が変わるので注意。",
        ],
        "questions": [
          {"t": "choice", "q": "The singer is popular ( ) young people.", "o": ["among", "between", "beside", "besides"], "e": "集団の中で → among。"},
          {"t": "choice", "q": "She sat ( ) me on the bench.", "o": ["beside", "besides", "among", "between"], "e": "「私の隣に」→ beside。between は2つのものが必要。"},
          {"t": "choice", "q": "( ) English, she speaks French and Chinese.", "o": ["Besides", "Beside", "Among", "Between"], "e": "「〜に加えて」→ besides。"},
          {"t": "fill", "q": "The secret is ___ you and me.", "a": ["between"], "e": "2者の間 → between。"},
        ],
      },
    ],
  },
  {
    "n": 20, "title": "受動態", "part": "Part 5 「構造」を意識する",
    "toc": {"book": 693, "pdf": 683}, "intro": {"book": [694, 695], "pdf": [684, 685]},
    "sections": [
      {
        "id": "20-1-1", "title": "受動態の形", "book": 696, "pdf": [686, 688],
        "points": [
          "受動態の基本形は「be動詞＋過去分詞」で、「〜される／〜された」を表す。",
          "時制は be動詞で表す：is done（現在）、was done（過去）、will be done（未来）。",
          "動作をした人・物は by 〜 で示すが、不要なら省略できる。",
        ],
        "questions": [
          {"t": "choice", "q": "This bridge ( ) in 1990.", "o": ["was built", "built", "was building", "has built"], "e": "橋は「建てられた」→ 過去の受動態 was built。"},
          {"t": "choice", "q": "The letter ( ) by my sister yesterday.", "o": ["was written", "is written", "wrote", "has been written"], "e": "yesterday があるので過去形 was written。現在完了は yesterday と一緒に使えない。"},
          {"t": "fill", "q": "English ___ in many countries. (speak)", "a": ["is spoken"], "e": "英語は「話されている」→ is＋過去分詞 spoken。"},
          {"t": "order", "ja": "この部屋は毎日掃除される。", "a": "This room is cleaned every day.", "e": "be＋過去分詞 is cleaned。"},
        ],
      },
      {
        "id": "20-1-2", "title": "受動態の「構造」と「色々な形」", "book": 699, "pdf": [689, 690],
        "points": [
          "進行形の受動態は「be being＋過去分詞」＝「〜されているところだ」。",
          "完了形の受動態は「have been＋過去分詞」、助動詞付きは「助動詞＋be＋過去分詞」。",
          "どの形でも「be＋過去分詞」の部分は崩さず、その前に進行・完了・助動詞を重ねる。",
        ],
        "questions": [
          {"t": "choice", "q": "The road ( ) now, so we have to take another way.", "o": ["is being repaired", "is repairing", "has repaired", "repairs"], "e": "道路は「修理されているところ」→ 進行形の受動態 is being repaired。"},
          {"t": "choice", "q": "The work must ( ) by Friday.", "o": ["be finished", "finished", "finish", "being finished"], "e": "助動詞の後は原形 → must be finished。"},
          {"t": "fill", "q": "The tickets have already ___ sold.", "a": ["been"], "e": "完了形の受動態 have been＋過去分詞。"},
          {"t": "order", "ja": "その車は昨年から使われていない。", "a": "The car has not been used since last year.", "e": "完了形の受動態の否定 has not been used。"},
        ],
      },
      {
        "id": "20-2-1", "title": "「主語を言いたくない」ときに使う受動態", "book": 701, "pdf": [691, 694],
        "points": [
          "動作主が不明・一般の人々・言うまでもない場合、受動態にして by 〜 を省略する。",
          "They speak French. → French is spoken. のように by them は言わない。",
          "be injured / be killed / be born など、動作主を言わないのが普通の表現も多い。",
        ],
        "questions": [
          {"t": "choice", "q": "My bike ( ) last night.", "o": ["was stolen", "stole", "was stealing", "has stolen"], "e": "誰が盗んだか分からない → 受動態 was stolen で動作主を言わない。"},
          {"t": "choice", "q": "They speak French in Quebec. を受動態にしたものは？", "o": ["French is spoken in Quebec.", "French was spoken in Quebec.", "French spoke in Quebec.", "French is speaking in Quebec."], "e": "現在形のまま is spoken。一般の人を指す they は by them として残さない。"},
          {"t": "fill", "q": "Rice ___ in this area. (grow)", "a": ["is grown"], "e": "「米が栽培されている」。育てる人は言う必要がないので by 〜 なし。"},
          {"t": "order", "ja": "彼はその事故でけがをした。", "a": "He was injured in the accident.", "e": "「けがをする」は be injured。動作主は言わない。"},
        ],
      },
      {
        "id": "20-2-2", "title": "「主語と目的語の位置を変えたい」ときに使う受動態", "book": 705, "pdf": [695, 698],
        "points": [
          "英語は「既に話題になっている情報」を主語に、「新しい情報」を文末に置く傾向がある。",
          "話題の物を主語にして受動態にすると、by 〜 の動作主が新情報として文末で強調される。",
          "「誰が〜したのか」に答えるときは、by 〜 を省略せずに言う。",
        ],
        "questions": [
          {"t": "choice", "q": "\"Who painted this picture?\" — \"It ( ) by Picasso.\"", "o": ["was painted", "painted", "has painted", "is painting"], "e": "話題の this picture を主語にし、新情報の Picasso を文末に → was painted by。"},
          {"t": "choice", "q": "\"Have you read this novel?\" — \"Yes. It was written ( ) a famous poet.\"", "o": ["by", "from", "with", "of"], "e": "動作主は by 〜 で示す。"},
          {"t": "fill", "q": "The telephone ___ invented by Bell.", "a": ["was"], "e": "過去の出来事 → was invented by 〜。発明者が文末の新情報。"},
          {"t": "order", "ja": "その歌は多くの若者に愛されている。", "a": "The song is loved by many young people.", "e": "話題の the song を主語にした受動態。"},
        ],
      },
      {
        "id": "20-3-1", "title": "「熟語動詞」の受動態", "book": 709, "pdf": [699, 700],
        "points": [
          "laugh at / take care of / speak to などの熟語動詞は、ひとまとまりで1つの動詞として受動態にする。",
          "前置詞は過去分詞の後に残す：be laughed at by 〜（at と by が並んでも正しい）。",
          "look after / carry out / put off なども同様：be looked after, be carried out。",
        ],
        "questions": [
          {"t": "choice", "q": "I was laughed ( ) by everyone.", "o": ["at", "by", "from", "with"], "e": "laugh at の at を残す → be laughed at by 〜。"},
          {"t": "choice", "q": "The baby is taken care ( ) by her grandmother.", "o": ["of", "by", "for", "with"], "e": "take care of 全体で1つの動詞 → be taken care of。"},
          {"t": "fill", "q": "I was spoken ___ by a stranger on the train.", "a": ["to"], "e": "speak to（話しかける）の受動態 → be spoken to。"},
          {"t": "order", "ja": "その犬は近所の人に世話をされている。", "a": "The dog is looked after by a neighbor.", "e": "look after の受動態 be looked after by 〜。"},
        ],
      },
      {
        "id": "20-3-2", "title": "「第4文型（SVOO）」の受動態", "book": 711, "pdf": [701, 702],
        "points": [
          "give / show / teach などの SVOO は、2つの目的語それぞれを主語にした受動態が作れる。",
          "「物」を主語にするときは人の前に to を置く：This watch was given to me.",
          "buy / make / cook などは「物」を主語にし for を使うのが普通。人を主語にすると不自然。",
        ],
        "questions": [
          {"t": "choice", "q": "I was ( ) this watch by my father.", "o": ["given", "giving", "gave", "give"], "e": "「人」を主語にした SVOO の受動態 → was given＋物。"},
          {"t": "choice", "q": "This watch was given ( ) me by my father.", "o": ["to", "for", "by", "with"], "e": "give は「物」を主語にすると to 人。"},
          {"t": "choice", "q": "This cake was made ( ) me by my mother.", "o": ["for", "to", "by", "of"], "e": "make は for 人 をとる動詞 → made for me。"},
          {"t": "order", "ja": "彼女は大学から奨学金を与えられた。", "a": "She was given a scholarship by the university.", "e": "人を主語にし、was given の後に物を置く。"},
        ],
      },
      {
        "id": "20-3-3", "title": "「第5文型（SVOC）」の受動態", "book": 713, "pdf": [703, 704],
        "points": [
          "SVOC の受動態は O を主語にし、C はそのまま過去分詞の後に残す：He was elected captain.",
          "使役・知覚の make / see / hear O do は、受動態では to 不定詞になる：be made to do。",
          "leave / keep O C も同様：The door was left open.（C は形容詞のまま）",
        ],
        "questions": [
          {"t": "choice", "q": "I was made ( ) for two hours.", "o": ["to wait", "wait", "waiting", "waited"], "e": "make O do の受動態は be made to do（to が必要）。"},
          {"t": "choice", "q": "The door was left ( ) all night.", "o": ["open", "opening", "to open", "opens"], "e": "leave O C の C（形容詞 open）はそのまま残る。"},
          {"t": "fill", "q": "The man was seen ___ enter the building.", "a": ["to"], "e": "see O do の受動態は be seen to do。"},
          {"t": "order", "ja": "私たちはその部屋を掃除させられた。", "a": "We were made to clean the room.", "e": "be made to do「〜させられる」。"},
        ],
      },
      {
        "id": "20-3-4", "title": "疑問詞と受動態", "book": 715, "pdf": [705, 705],
        "points": [
          "疑問詞が主語なら「疑問詞＋be＋過去分詞」：What was stolen?",
          "疑問詞が主語でなければ「疑問詞＋be＋S＋過去分詞」の語順：When was this built?",
          "「誰によって」は Who ... by? が普通。堅い形は By whom ...?",
        ],
        "questions": [
          {"t": "choice", "q": "( ) is this flower called in English?", "o": ["What", "How", "Which", "Who"], "e": "call O C の C を尋ねる → What is this called?（How は誤り）"},
          {"t": "choice", "q": "Where ( ) these shoes made?", "o": ["were", "did", "was", "have"], "e": "疑問詞＋be＋S＋過去分詞。主語 these shoes は複数 → were。"},
          {"t": "fill", "q": "When ___ this temple built? — In the 8th century.", "a": ["was"], "e": "過去の受動態の疑問文 → When was S built?"},
          {"t": "order", "ja": "この小説は誰によって書かれたのですか。", "a": "Who was this novel written by?", "e": "Who ... by? の形。by を文末に残す。"},
        ],
      },
      {
        "id": "20-4-1", "title": "受動態の「動作」と「状態」", "book": 716, "pdf": [706, 706],
        "points": [
          "be＋過去分詞は「〜される（動作）」と「〜されている（状態）」の両方を表しうる。",
          "動作・変化をはっきり示すには get＋過去分詞：get married（結婚する）、get lost（迷う）。",
          "be married は「結婚している」状態。期間を言うなら have been married for 〜。",
        ],
        "questions": [
          {"t": "choice", "q": "They ( ) married last year.", "o": ["got", "are", "have been", "get"], "e": "「結婚した」という動作・変化 → got married。last year は完了形と使えない。"},
          {"t": "choice", "q": "They ( ) married for ten years.", "o": ["have been", "got", "are", "get"], "e": "「10年間結婚している」状態の継続 → have been married。"},
          {"t": "fill", "q": "I ___ lost in the forest yesterday. (get)", "a": ["got"], "e": "「迷った」という変化 → got lost。"},
          {"t": "order", "ja": "私たちは雨でびしょぬれになった。", "a": "We got wet in the rain.", "e": "「〜になる」という変化は get で表す。"},
        ],
      },
      {
        "id": "20-4-2", "title": "think / say などの受動態", "book": 717, "pdf": [707, 708],
        "points": [
          "They say that S V. は It is said that S V. または S is said to V. と言い換えられる。",
          "that 節が主節より前の時を表すなら完了不定詞：He is said to have been rich.",
          "think / believe / report / know なども同じ形をとる。",
        ],
        "pattern": "\\b(is|are|was|were) (said|believed|thought|reported|supposed) to (be|have)\\b|\\bit (is|was) (said|believed|thought|reported) that\\b",
        "questions": [
          {"t": "choice", "q": "He is said ( ) rich.", "o": ["to be", "being", "that he is", "be"], "e": "S is said to V の形 → to be。"},
          {"t": "choice", "q": "She is said ( ) a famous singer when she was young.", "o": ["to have been", "to be", "being", "to had been"], "e": "「若い頃〜だった」と今言われている → 完了不定詞 to have been。"},
          {"t": "fill", "q": "___ is believed that the painting is a fake.", "a": ["It"], "e": "It is believed that S V の形式主語 It。"},
          {"t": "order", "ja": "その老人は100歳だと言われている。", "a": "The old man is said to be 100 years old.", "e": "S is said to be 〜。"},
        ],
      },
      {
        "id": "20-4-3", "title": "「特殊な受動態」を持つ動詞", "book": 719, "pdf": [709, 709],
        "points": [
          "感情を表す受動態は by 以外の前置詞をとる：be interested in / be surprised at など。",
          "be known to（人に）／for（理由）／as（資格）、be made of（材料）／from（原料）。",
          "被害は be caught in / be injured in など、前置詞 in をとるものが多い。",
        ],
        "pattern": "\\b(is|are|was|were|be|been) (interested in|surprised at|satisfied with|pleased with|covered with|known for|made of|made from|caught in)\\b",
        "questions": [
          {"t": "choice", "q": "Kyoto is known ( ) its old temples.", "o": ["for", "to", "as", "by"], "e": "有名な「理由」→ be known for。"},
          {"t": "choice", "q": "Wine is made ( ) grapes.", "o": ["from", "of", "by", "into"], "e": "原料が形を変えている → be made from。材料がそのまま見えるなら of。"},
          {"t": "choice", "q": "I was caught ( ) a shower on my way home.", "o": ["in", "by", "at", "with"], "e": "「にわか雨にあう」→ be caught in a shower。"},
          {"t": "fill", "q": "I am interested ___ Japanese history.", "a": ["in"], "e": "be interested in 〜「〜に興味がある」。"},
        ],
      },
    ],
  },
  {
    "n": 21, "title": "比較", "part": "Part 5 「構造」を意識する",
    "toc": {"book": 721, "pdf": 710}, "intro": {"book": [723, 724], "pdf": [712, 713]},
    "sections": [
      {
        "id": "21-1-1", "title": "as 〜 as の基本", "book": 725, "pdf": [714, 716],
        "points": [
          "as＋原級＋as 〜 で「〜と同じくらい…」。as と as の間は比較級にしない。",
          "名詞を比べるときは as many＋複数名詞 as / as much＋不可算名詞 as の形にする。",
          "2つ目の as の後は as I (can) / as I do のように、比べる形をそろえる。",
        ],
        "pattern": "\\bas (?!well\\b|soon\\b|long\\b|far\\b)\\w+ as\\b",
        "questions": [
          {"t": "choice", "q": "Tom is as ( ) as his father.", "o": ["tall", "taller", "tallest", "more tall"], "e": "as 〜 as の間は原級 → tall。"},
          {"t": "choice", "q": "I have as ( ) books as my brother.", "o": ["many", "much", "more", "a lot"], "e": "数えられる名詞 books → as many＋複数名詞 as。"},
          {"t": "fill", "q": "This bag is as heavy ___ that one.", "a": ["as"], "e": "as＋原級＋as の2つ目の as。"},
          {"t": "order", "ja": "彼女は私と同じくらい速く走れる。", "a": "She can run as fast as I can.", "e": "as fast as I can。比べる形（can run）をそろえる。"},
        ],
      },
      {
        "id": "21-1-2", "title": "not as 〜 as ...「…ほど〜ではない」", "book": 728, "pdf": [717, 718],
        "points": [
          "not as[so]＋原級＋as 〜 で「〜ほど…ではない」。",
          "「同じではない」ではなく「〜より劣る」の意味：A is not as tall as B ＝ B is taller than A。",
          "否定文では as の代わりに so も使える（not so 〜 as）。",
        ],
        "pattern": "(\\bnot|n't) (as|so) \\w+ as\\b",
        "questions": [
          {"t": "choice", "q": "This book is not ( ) interesting as that one.", "o": ["as", "more", "than", "very"], "e": "not as 〜 as「〜ほど…ではない」。"},
          {"t": "choice", "q": "Ken is not as tall as Mike. と同じ意味は？", "o": ["Mike is taller than Ken.", "Ken is taller than Mike.", "Ken and Mike are the same height.", "Mike is not as tall as Ken."], "e": "「ケンはマイクほど背が高くない」＝マイクの方が背が高い。"},
          {"t": "fill", "q": "My room isn't ___ big as yours.", "a": ["as", "so"], "e": "否定文では not as 〜 as / not so 〜 as のどちらも可。"},
          {"t": "order", "ja": "今日は昨日ほど寒くない。", "a": "Today is not as cold as yesterday.", "e": "not as＋原級＋as。"},
        ],
      },
      {
        "id": "21-1-3", "title": "as 〜 as を使った慣用表現", "book": 730, "pdf": [719, 722],
        "points": [
          "as 〜 as possible ＝ as 〜 as S can「できるだけ〜」。",
          "as many[much] as＋数量で「〜も（多い）」と数の多さを強調。as good as は「〜も同然」。",
          "not so much A as B は「A というよりむしろ B」。",
        ],
        "pattern": "\\bas \\w+ as (possible|\\w+ (can|could))\\b|\\bnot so much\\b|\\bas good as\\b",
        "questions": [
          {"t": "choice", "q": "Please call me as soon as ( ).", "o": ["possible", "possibly", "you possible", "can"], "e": "as soon as possible「できるだけ早く」。"},
          {"t": "choice", "q": "( ) as 500 people came to the concert.", "o": ["As many", "As much", "So much", "As more"], "e": "数えられる人数の多さを強調 → as many as「〜も」。"},
          {"t": "choice", "q": "This used car is as good ( ) new.", "o": ["as", "than", "like", "so"], "e": "as good as 〜「〜も同然」。"},
          {"t": "fill", "q": "He is not so much a scholar ___ a writer.", "a": ["as"], "e": "not so much A as B「A というよりむしろ B」。"},
        ],
      },
      {
        "id": "21-1-4", "title": "倍数表現", "book": 734, "pdf": [723, 724],
        "points": [
          "倍数表現は「X times as＋原級＋as 〜」。2倍は twice、半分は half。",
          "名詞を使って X times the size[number / length] of 〜 とも言える。",
          "倍数詞は as の前に置く。twice more as のようにしない。",
        ],
        "pattern": "\\b(twice|half|\\w+ times) as \\w+ as\\b",
        "questions": [
          {"t": "choice", "q": "This room is ( ) as large as mine.", "o": ["twice", "two", "second", "both"], "e": "「2倍」は twice as 〜 as。"},
          {"t": "choice", "q": "His car cost three times ( ) mine.", "o": ["as much as", "as many as", "more as", "than"], "e": "金額（不可算）→ three times as much as。"},
          {"t": "fill", "q": "The lake is ___ the size of that one. (3倍)", "a": ["three times"], "e": "X times the size of 〜「〜の X 倍の大きさ」。"},
          {"t": "order", "ja": "兄は私の半分しか本を持っていない。", "a": "My brother has half as many books as I do.", "e": "half as many＋名詞＋as「〜の半分の数の…」。"},
        ],
      },
      {
        "id": "21-2-1", "title": "比較級の基本", "book": 736, "pdf": [725, 726],
        "points": [
          "比較級は「-er than 〜」または「more＋原級＋than 〜」で「〜より…」。",
          "長い語（difficult, interesting など）や -ly 副詞は more を使う。hot → hotter など綴りにも注意。",
          "than の後は比べる形をそろえる：than I do / than I am。",
        ],
        "pattern": "\\b(?!other\\b|rather\\b)\\w+er than\\b|\\bmore \\w+ than\\b",
        "questions": [
          {"t": "choice", "q": "This problem is ( ) than that one.", "o": ["more difficult", "difficulter", "most difficult", "as difficult"], "e": "difficult は長い語 → more difficult than。"},
          {"t": "choice", "q": "My sister gets up ( ) than I do.", "o": ["earlier", "more early", "earliest", "early"], "e": "early の比較級は earlier（y → ier）。"},
          {"t": "fill", "q": "Today is ___ than yesterday. (hot)", "a": ["hotter"], "e": "短母音＋子音字 → 子音字を重ねて hotter。"},
          {"t": "order", "ja": "この箱はあの箱よりも重い。", "a": "This box is heavier than that one.", "e": "heavy → heavier than。"},
        ],
      },
      {
        "id": "21-2-2", "title": "不規則変化する単語", "book": 738, "pdf": [727, 729],
        "points": [
          "good / well → better → best、bad / ill → worse → worst。",
          "many / much → more → most、little → less → least（数えられない量）。",
          "far は距離なら farther / further、程度・追加なら further を使う。",
        ],
        "questions": [
          {"t": "choice", "q": "She sings ( ) than I do.", "o": ["better", "gooder", "more well", "best"], "e": "well（上手に）の比較級は better。"},
          {"t": "choice", "q": "His cold got ( ) yesterday.", "o": ["worse", "badder", "more bad", "worst"], "e": "bad の比較級は worse。"},
          {"t": "choice", "q": "I have ( ) money than you.", "o": ["less", "littler", "least", "fewer"], "e": "money は不可算 → little の比較級 less。fewer は可算名詞に使う。"},
          {"t": "fill", "q": "This is the ___ movie I have ever seen. (bad)", "a": ["worst"], "e": "bad の最上級は worst。"},
        ],
      },
      {
        "id": "21-2-3", "title": "最上級の基本", "book": 741, "pdf": [730, 733],
        "points": [
          "最上級は「the -est」または「the most＋原級」で「最も〜」。",
          "範囲が場所・集団なら in（in Japan, in the class）、複数のものなら of（of the three, of all）。",
          "副詞の最上級は the を省くことも多い：He runs (the) fastest.",
        ],
        "pattern": "\\bthe (best|worst|most \\w+)\\b",
        "questions": [
          {"t": "choice", "q": "Mt. Fuji is the highest mountain ( ) Japan.", "o": ["in", "of", "at", "on"], "e": "範囲が場所 → in。"},
          {"t": "choice", "q": "He is the tallest ( ) the three.", "o": ["of", "in", "at", "than"], "e": "複数のもの（the three）の中で → of。"},
          {"t": "fill", "q": "This is the ___ story of all. (interesting)", "a": ["most interesting"], "e": "長い語 → the most interesting。"},
          {"t": "order", "ja": "これは町で一番古い建物だ。", "a": "This is the oldest building in the town.", "e": "the＋最上級＋名詞＋in＋場所。"},
        ],
      },
      {
        "id": "21-3-1", "title": "「比較級・最上級」を使った基本表現", "book": 745, "pdf": [734, 736],
        "points": [
          "比較級 and 比較級 で「ますます〜」：colder and colder / more and more difficult。",
          "one of the＋最上級＋複数名詞「最も〜なものの1つ」。名詞は必ず複数形。",
          "2者の比較で「〜な方」は the＋比較級 of the two。最上級＋S have ever p.p.「今までで一番〜」。",
        ],
        "pattern": "\\b(\\w+er) and \\1\\b|\\bmore and more\\b|\\bone of the (best|worst|most \\w+|\\w+est)\\b",
        "questions": [
          {"t": "choice", "q": "It is getting ( ).", "o": ["colder and colder", "cold and cold", "colder and coldest", "more cold and cold"], "e": "比較級 and 比較級「ますます〜」。"},
          {"t": "choice", "q": "She is one of the best ( ) in the world.", "o": ["players", "player", "player's", "playing"], "e": "one of the＋最上級＋複数名詞。"},
          {"t": "choice", "q": "Tom is the ( ) of the two boys.", "o": ["taller", "tallest", "tall", "more tall"], "e": "2者のうち「〜な方」→ the＋比較級 of the two。"},
          {"t": "fill", "q": "This is the best pizza I have ___ eaten.", "a": ["ever"], "e": "最上級＋I have ever p.p.「今まで〜した中で一番」。"},
        ],
      },
      {
        "id": "21-3-2", "title": "\"実質\"最上級の表現", "book": 748, "pdf": [737, 737],
        "points": [
          "比較級＋than any other＋単数名詞 で、形は比較級でも意味は最上級になる。",
          "No other＋単数名詞＋is as[so] 〜 as / 比較級＋than も最上級の意味。",
          "Nothing is as 〜 as A. / Nothing is 比較級 than A. ＝「A ほど〜なものはない」。",
        ],
        "pattern": "\\bthan any other\\b|\\bnothing (is|was) (as|so|more) \\w+ (as|than)\\b",
        "questions": [
          {"t": "choice", "q": "Mt. Fuji is higher than any other ( ) in Japan.", "o": ["mountain", "mountains", "the mountains", "mountain's"], "e": "than any other の後は単数名詞。"},
          {"t": "choice", "q": "( ) other student in the class is as tall as Ken.", "o": ["No", "Not", "Any", "None"], "e": "No other＋単数名詞＋is as 〜 as ＝ Ken が一番背が高い。"},
          {"t": "choice", "q": "Nothing is ( ) important than health.", "o": ["more", "most", "as", "so"], "e": "than があるので比較級 → Nothing is more 〜 than。"},
          {"t": "order", "ja": "時間ほど大切なものはない。", "a": "Nothing is as precious as time.", "e": "Nothing is as 〜 as A「A ほど〜なものはない」。"},
        ],
      },
      {
        "id": "21-3-3", "title": "比較級・最上級の強調", "book": 749, "pdf": [738, 742],
        "points": [
          "比較級の強調は much / far / even / still / a lot。very は比較級に使えない。",
          "最上級の強調は by far / much（the の前）、または the very＋最上級（the の後）。",
          "even / still は「さらに・いっそう」と、もともと〜なものがもっと〜だという含み。",
        ],
        "pattern": "\\b(much|far|even|still|a lot) (\\w+er|more \\w+|less \\w+) than\\b|\\bby far the\\b|\\bthe very (best|worst)\\b",
        "questions": [
          {"t": "choice", "q": "This bag is ( ) cheaper than that one.", "o": ["much", "very", "more", "too"], "e": "比較級の強調は much。very は使えない。"},
          {"t": "choice", "q": "She is ( ) the best singer in our class.", "o": ["by far", "very", "more", "so"], "e": "最上級の強調 → by far the best。"},
          {"t": "choice", "q": "This is the ( ) best hotel in town.", "o": ["very", "much", "far", "even"], "e": "the と最上級の間に入れるのは very（the very best）。"},
          {"t": "fill", "q": "He is tall, but his brother is ___ taller. (さらに)", "a": ["even", "still"], "e": "「(もともと〜だが)さらに」→ even / still＋比較級。"},
        ],
      },
      {
        "id": "21-4-1", "title": "ラテン比較級（thanではなくtoをとるもの）", "book": 754, "pdf": [743, 744],
        "points": [
          "superior / inferior / senior / junior / prior などは than ではなく to をとる。",
          "これらは語自体が比較の意味を持つので more を付けない（more superior は誤り）。",
          "prefer A to B「B より A を好む」も同じ仲間。",
        ],
        "pattern": "\\b(superior|inferior|senior|junior|prior) to\\b",
        "questions": [
          {"t": "choice", "q": "This car is superior ( ) that one.", "o": ["to", "than", "from", "for"], "e": "superior to 〜「〜より優れている」。"},
          {"t": "choice", "q": "He is three years ( ) to me.", "o": ["senior", "older", "elder", "superior"], "e": "to をとるのは senior。older なら than me。"},
          {"t": "choice", "q": "I prefer tea ( ) coffee.", "o": ["to", "than", "from", "for"], "e": "prefer A to B「B より A を好む」。"},
          {"t": "fill", "q": "The meeting was held prior ___ the event.", "a": ["to"], "e": "prior to 〜「〜より前に」。"},
        ],
      },
      {
        "id": "21-4-2", "title": "\"the＋比較級\"を使った表現", "book": 756, "pdf": [745, 747],
        "points": [
          "The＋比較級 S V, the＋比較級 S V. で「〜すればするほど、ますます…」。",
          "all the＋比較級＋for[because] 〜 は「〜なので、それだけいっそう…」。",
          "この the は冠詞ではなく「その分だけ」を表す副詞。語順（the＋比較級が文頭）に注意。",
        ],
        "pattern": "\\bthe (more|less|better|worse|sooner|greater|higher|older|longer|harder|faster)\\b[^.!?]{0,40}, the (more|less|better|worse|sooner|greater|higher|older|longer|harder|faster)\\b|\\ball the (better|more|worse)\\b",
        "questions": [
          {"t": "choice", "q": "The more you practice, ( ) you will become.", "o": ["the better", "the best", "better", "more better"], "e": "The＋比較級 〜, the＋比較級 …「〜すればするほど…」。"},
          {"t": "choice", "q": "I like him all the ( ) for his faults.", "o": ["better", "best", "more good", "good"], "e": "all the＋比較級＋for 〜「〜のためにいっそう」。"},
          {"t": "fill", "q": "The older he grew, ___ wiser he became.", "a": ["the"], "e": "後半にも the＋比較級。"},
          {"t": "order", "ja": "高く登れば登るほど寒くなる。", "a": "The higher you climb, the colder it gets.", "e": "The＋比較級 S V, the＋比較級 S V。"},
        ],
      },
      {
        "id": "21-4-3", "title": "その他の「比較級を使った慣用表現」", "book": 759, "pdf": [748, 749],
        "points": [
          "know better than to do「〜するほど愚かではない」。no longer ＝ not 〜 any longer「もはや〜ない」。",
          "sooner or later「遅かれ早かれ」、more or less「多かれ少なかれ・ほぼ」。",
          "否定文＋much[still] less 〜「まして〜ない」。",
        ],
        "pattern": "\\bknows? better than\\b|\\bknew better than\\b|\\bno longer\\b|\\bsooner or later\\b|\\bmore or less\\b",
        "questions": [
          {"t": "choice", "q": "He knows better ( ) to tell a lie.", "o": ["than", "as", "not", "so"], "e": "know better than to do「〜するほど愚かではない」。"},
          {"t": "choice", "q": "She ( ) lives here. She moved to Osaka.", "o": ["no longer", "any longer", "not longer", "longer"], "e": "「もはや〜ない」→ no longer。any longer は not と組む。"},
          {"t": "choice", "q": "I can't speak French, ( ) Russian.", "o": ["much less", "much more", "still more", "no less"], "e": "否定文の後の「まして〜ない」→ much less。"},
          {"t": "fill", "q": "You will find out the truth sooner ___ later.", "a": ["or"], "e": "sooner or later「遅かれ早かれ」。"},
        ],
      },
      {
        "id": "21-4-4", "title": "比較対象の省略", "book": 761, "pdf": [750, 752],
        "points": [
          "文脈から明らかなとき than 以下は省略される：Could you speak more slowly?（今より）",
          "特定の相手と比べず漠然と程度を表す比較級もある：the younger generation、higher education。",
          "訳すときは「より〜」にこだわらず「若い世代」「高等教育」のように自然に訳す。",
        ],
        "questions": [
          {"t": "choice", "q": "Could you speak more ( )?", "o": ["slowly", "slower", "slowest", "slowlier"], "e": "than 以下（今の話し方より）が省略された形。副詞 slowly → more slowly。"},
          {"t": "choice", "q": "You look ( ) today. Did you sleep well?", "o": ["better", "best", "good than", "more well"], "e": "「(昨日より)元気そう」→ than 以下を省略した better。"},
          {"t": "choice", "q": "the younger generation の意味として最も適切なものは？", "o": ["若い世代", "2人のうち年下の方", "最も若い人", "若返った世代"], "e": "比べる相手のない比較級 → 漠然と「若い世代」。"},
          {"t": "fill", "q": "Many students go on to ___ education after high school. (高等教育)", "a": ["higher"], "e": "higher education「高等教育」。than を伴わない比較級。"},
        ],
      },
      {
        "id": "21-4-5", "title": "自者比較（1つの中で2つのものを比べる）", "book": 764, "pdf": [753, 753],
        "points": [
          "同じ人・物の2つの性質を比べるときは、短い語でも -er ではなく more A than B を使う。",
          "He is more clever than wise.「彼は賢いというより利口だ」＝ A というよりむしろ B の意味に近い。",
          "同じものの中で条件・場所を比べる最上級には the を付けない：The lake is deepest here.",
        ],
        "questions": [
          {"t": "choice", "q": "He is more ( ) than wise.", "o": ["clever", "cleverer", "cleverest", "cleverly"], "e": "同一人物の性質比較 → more＋原級＋than＋原級。"},
          {"t": "choice", "q": "「この湖はこの地点が一番深い」（同じ湖の中で場所を比べる）: This lake is ( ) at this point.", "o": ["deepest", "the deepest", "deeper", "deeply"], "e": "同じ湖の中で場所による比較 → the を付けない deepest。"},
          {"t": "fill", "q": "She is more shy ___ unfriendly.", "a": ["than"], "e": "more A than B「B というより A」。"},
          {"t": "order", "ja": "彼は教師というよりむしろ学者だ。", "a": "He is more a scholar than a teacher.", "e": "more A than B「B というより A」。"},
        ],
      },
      {
        "id": "21-5-1", "title": "no 比較級 than 〜 の基本と全体像", "book": 765, "pdf": [754, 757],
        "points": [
          "no＋比較級＋than 〜 は「差がゼロ」＋「話者の評価」を表す：no taller than ＝ 同じくらい低い。",
          "not＋比較級＋than は単に「〜より…ではない」という客観的な否定。",
          "A is no more B than C is D「A が B でないのは C が D でないのと同じ」（クジラの構文）。",
        ],
        "pattern": "\\bno (more|less|\\w+er)( \\w+){0,3} than\\b",
        "questions": [
          {"t": "choice", "q": "He is no richer than I am. の意味として最も適切なものは？", "o": ["彼は私と同様に金持ちではない。", "彼は私ほど金持ちではない。", "彼は私より少し金持ちだ。", "彼は私と同じくらい金持ちだ。"], "e": "no＋比較級 → 差はゼロで、「金持ちではない」という評価（as poor as I am）。"},
          {"t": "choice", "q": "A whale is no ( ) a fish than a horse is.", "o": ["more", "less", "better", "longer"], "e": "no more A than B「B と同様に A ではない」。"},
          {"t": "choice", "q": "The dog was no bigger than a cat. に最も近い意味は？", "o": ["The dog was as small as a cat.", "The dog was bigger than a cat.", "The dog was much smaller than a cat.", "The dog was as big as a horse."], "e": "no bigger than ＝ as small as「猫ほどの大きさしかない」。"},
          {"t": "fill", "q": "A bat is no more a bird ___ a rat is.", "a": ["than"], "e": "no more A than B の than。"},
        ],
      },
      {
        "id": "21-5-2", "title": "no 比較級 than 〜 を使った熟語", "book": 769, "pdf": [758, 759],
        "points": [
          "no more than ＝ only「〜しか」、no less than ＝ as many[much] as「〜も」。",
          "not more than ＝ at most「せいぜい」、not less than ＝ at least「少なくとも」。",
          "no better than 〜「〜も同然、〜にすぎない」。",
        ],
        "pattern": "\\b(no|not) (more|less) than\\b|\\bno better than\\b",
        "questions": [
          {"t": "choice", "q": "I have no more than 500 yen. の意味は？", "o": ["500円しか持っていない", "少なくとも500円は持っている", "500円も持っている", "500円より多く持っている"], "e": "no more than ＝ only「〜しか」（少なさを強調）。"},
          {"t": "choice", "q": "She paid ( ) 10,000 yen for the ticket. (1万円も払った)", "o": ["no less than", "no more than", "not more than", "not less than"], "e": "「〜も」と多さを強調 → no less than。"},
          {"t": "choice", "q": "He is no better than a thief. の意味は？", "o": ["彼は泥棒も同然だ", "彼は泥棒よりましだ", "彼は泥棒ではない", "彼は泥棒よりたちが悪い"], "e": "no better than 〜「〜も同然」。"},
          {"t": "fill", "q": "It will take ___ less than three hours. (少なくとも3時間はかかる)", "a": ["not"], "e": "not less than ＝ at least「少なくとも」。"},
        ],
      },
      {
        "id": "21-5-3", "title": "「noとnotの熟語」を整理する", "book": 771, "pdf": [760, 762],
        "points": [
          "no は「差ゼロ＋話者の気持ち（多い・少ないの強調）」、not は「単なる否定・範囲（せいぜい・少なくとも）」。",
          "no more A than B「B 同様 A でない」⇔ no less A than B「B に劣らず A だ」。",
          "no sooner 〜 than …「〜するとすぐに…」も no＋比較級＋than の仲間。",
        ],
        "pattern": "\\bno (more|less) \\w+ than\\b|\\bno sooner\\b|\\bnot (more|less) than\\b",
        "questions": [
          {"t": "choice", "q": "She is no less beautiful than her sister. の意味は？", "o": ["彼女は姉に劣らず美しい", "彼女は姉ほど美しくない", "彼女は姉より美しくない", "彼女は姉と同様に美しくない"], "e": "no less A than B「B に劣らず A」（B と同様に A だ）。"},
          {"t": "choice", "q": "not more than の意味として正しいものは？", "o": ["せいぜい・多くても", "たった・〜しか", "少なくとも", "〜も（多さの強調）"], "e": "not more than ＝ at most。たった＝no more than、少なくとも＝not less than、〜も＝no less than。"},
          {"t": "choice", "q": "I had no sooner arrived ( ) it began to rain.", "o": ["than", "when", "as", "then"], "e": "no sooner 〜 than …「〜するとすぐに…」。比較級 sooner なので than。"},
          {"t": "order", "ja": "彼はせいぜい20歳だ。", "a": "He is not more than twenty years old.", "e": "not more than ＝ at most「せいぜい」。"},
        ],
      },
    ],
  },
  {
    "n": 22, "title": "関係詞", "part": "Part 5 「構造」を意識する",
    "toc": {"book": 774, "pdf": 763}, "intro": {"book": [776, 778], "pdf": [765, 767]},
    "sections": [
      {
        "id": "22-1-1", "title": "関係詞の全体像", "book": 779, "pdf": [768, 769],
        "points": [
          "関係詞は、名詞（先行詞）の後ろに節をつなげて説明を加える語。関係代名詞・関係副詞・複合関係詞などがある。",
          "関係代名詞は節の中で主語・目的語など「名詞」の働き、関係副詞は「副詞」の働きをする。",
          "基本は先行詞が人なら who、物なら which、場所 where・時 when・理由 why。that は人にも物にも使える。",
        ],
        "questions": [
          {"t": "choice", "q": "I have a friend ( ) lives in Canada.", "o": ["who", "which", "where", "what"], "e": "先行詞が人（a friend）で、節内の主語が欠けている → 主格の who。"},
          {"t": "choice", "q": "This is the town ( ) I was born.", "o": ["where", "which", "who", "what"], "e": "I was born は完全な文。場所の先行詞＋完全文 → 関係副詞 where。"},
          {"t": "choice", "q": "The book ( ) you lent me was very interesting.", "o": ["that", "what", "where", "who"], "e": "先行詞が物で lent の目的語が欠けている → that（which も可）。what は先行詞をとらない。"},
          {"t": "order", "ja": "赤い屋根の家が見えますか。", "a": "Can you see the house which has a red roof?", "e": "the house を which has a red roof が後ろから説明する。"},
        ],
      },
      {
        "id": "22-1-2", "title": "関係代名詞の基本", "book": 781, "pdf": [770, 772],
        "points": [
          "主格 who / which / that、目的格 whom(who) / which / that、所有格 whose。先行詞と節内での働き（格）で選ぶ。",
          "目的格の関係代名詞は省略できることが多い：the man (whom) I met yesterday。",
          "節の中では先行詞にあたる語が欠けている。代名詞を重ねて入れない（×the book which I read it）。",
        ],
        "questions": [
          {"t": "choice", "q": "The woman ( ) I met yesterday is a doctor.", "o": ["whom", "whose", "which", "what"], "e": "先行詞は人、met の目的語が欠けている → 目的格 whom。"},
          {"t": "choice", "q": "The train ( ) leaves at seven is always crowded.", "o": ["which", "who", "whom", "whose"], "e": "先行詞が物で、leaves の主語が欠けている → 主格の which。"},
          {"t": "fill", "q": "The cake ___ she made was delicious. (1語)", "a": ["which", "that"], "e": "made の目的語が欠けている → 目的格 which / that。実際には省略も多い。"},
          {"t": "choice", "q": "正しい英文はどれか。", "o": ["This is the book I bought yesterday.", "This is the book which I bought it yesterday.", "This is the book who I bought yesterday.", "This is the book what I bought yesterday."], "e": "目的格の関係代名詞は省略可。it を重ねたり、物に who、先行詞の後に what を使うのは誤り。"},
        ],
      },
      {
        "id": "22-1-3", "title": "関係詞を含む文の「構造」と「意味」の把握", "book": 784, "pdf": [773, 776],
        "points": [
          "関係詞節を（ ）でくくり、先行詞にどこまでかかるかを見極める。節の終わりは本動詞の直前が目安。",
          "まず文全体の主語と動詞を確定する：The man [who called me] is my uncle. の本動詞は is。",
          "節内で何が欠けているか（主語か目的語か）を確認すると、構造と意味を正確につかめる。",
        ],
        "questions": [
          {"t": "choice", "q": "The students who passed the test ( ) very happy.", "o": ["were", "was", "being", "to be"], "e": "文の主語は The students（複数）。who passed the test は修飾部分 → were。"},
          {"t": "choice", "q": "The girl who my brother likes ( ) in Osaka.", "o": ["lives", "live", "living", "to live"], "e": "主語は The girl（単数）。直前の my brother likes は関係詞節 → lives。"},
          {"t": "choice", "q": "「The man who called me yesterday is my uncle.」の文全体の動詞はどれか。", "o": ["is", "called", "who", "yesterday"], "e": "who called me yesterday は The man を修飾する節。文の動詞は is。"},
          {"t": "order", "ja": "私が昨日会った男性は私の先生だ。", "a": "The man I met yesterday is my teacher.", "e": "The man を I met yesterday（目的格関係代名詞の省略）が修飾し、本動詞 is が続く。"},
        ],
      },
      {
        "id": "22-1-4", "title": "関係代名詞の応用", "book": 788, "pdf": [777, 779],
        "points": [
          "関係代名詞の直後に I think / I believe などが挟まる形がある：the man who I thought was honest。",
          "この形の who は was の主語なので主格。whom にしないよう注意（I thought を外して考える）。",
          "主格の関係代名詞に続く動詞は、先行詞の数・人称に一致させる。",
        ],
        "questions": [
          {"t": "choice", "q": "He is the man ( ) I believe is honest.", "o": ["who", "whom", "whose", "what"], "e": "I believe を外すと the man who is honest。who は is の主語なので主格。"},
          {"t": "choice", "q": "I have a friend who ( ) three languages.", "o": ["speaks", "speak", "speaking", "to speak"], "e": "先行詞 a friend は3人称単数 → speaks。"},
          {"t": "choice", "q": "These are the rules which ( ) changed last year.", "o": ["were", "was", "is", "has"], "e": "先行詞 the rules は複数、去年のこと → were。"},
          {"t": "order", "ja": "彼女が正直だと思っていた男が私をだました。", "a": "The man who she thought was honest deceived me.", "e": "who の後に she thought が挟まり、who は was の主語。本動詞は deceived。"},
        ],
      },
      {
        "id": "22-1-5", "title": "所有格", "book": 791, "pdf": [780, 781],
        "points": [
          "whose＋名詞 で「その〜が／その〜を」。先行詞は人でも物でもよい：a house whose roof is red。",
          "whose の直後には必ず名詞が来て、その名詞に冠詞はつけない（×whose the roof）。",
          "先行詞が物のとき、堅い文では the roof of which の形も使う。",
        ],
        "questions": [
          {"t": "choice", "q": "I know a girl ( ) father is a pilot.", "o": ["whose", "who", "whom", "which"], "e": "「その女の子の父親が」→ 所有格 whose＋名詞。"},
          {"t": "choice", "q": "Look at the mountain ( ) top is covered with snow.", "o": ["whose", "which", "what", "where"], "e": "「その山の頂上が」→ 先行詞が物でも whose を使う。"},
          {"t": "fill", "q": "He has a friend ___ sister is a famous singer. (1語)", "a": ["whose"], "e": "後ろに名詞 sister が続き「その友人の姉（妹）が」→ whose。"},
          {"t": "order", "ja": "屋根が赤い家が私の家だ。", "a": "The house whose roof is red is mine.", "e": "The house を whose roof is red が修飾し、本動詞 is が続く。"},
        ],
      },
      {
        "id": "22-1-6", "title": "「前置詞＋関係代名詞」の考え方", "book": 793, "pdf": [782, 784],
        "points": [
          "節内の前置詞は関係代名詞の前に出せる：the house in which he lives ＝ the house which he lives in。",
          "前置詞の直後では that や who は使えず（in whom / in which）、関係代名詞の省略もできない。",
          "どの前置詞かは節内の語法で決まる：depend on → on which / on whom、write with → with which。",
        ],
        "questions": [
          {"t": "choice", "q": "This is the house in ( ) he was born.", "o": ["which", "that", "where", "what"], "e": "前置詞 in の直後 → which。that は前置詞の後に置けない。"},
          {"t": "choice", "q": "The man with ( ) I talked was very kind.", "o": ["whom", "who", "that", "which"], "e": "前置詞の後で人を受ける → whom。who や that は不可。"},
          {"t": "choice", "q": "She is a friend ( ) I can always depend.", "o": ["on whom", "whom", "who", "to whom"], "e": "depend on 〜 の on が前に出た形 → on whom。"},
          {"t": "fill", "q": "The pen ___ which I wrote the letter was expensive. (1語)", "a": ["with"], "e": "write with a pen（ペンで書く）の with が which の前に出た形。"},
        ],
      },
      {
        "id": "22-1-7", "title": "関係代名詞thatについて", "book": 796, "pdf": [785, 786],
        "points": [
          "that は人にも物にも使え、主格・目的格になる。先行詞に最上級・序数・all・the only などがつくと好まれる。",
          "「人＋物（動物）」の先行詞には that を使う：the boy and his dog that …。",
          "that は非制限用法（カンマの後）や前置詞の直後には使えない。",
        ],
        "questions": [
          {"t": "choice", "q": "This is the best movie ( ) I have ever seen.", "o": ["that", "what", "whose", "where"], "e": "最上級のついた先行詞 → that が好まれる。seen の目的語が欠けている。"},
          {"t": "choice", "q": "Look at the boy and his dog ( ) are running in the park.", "o": ["that", "who", "which", "whom"], "e": "先行詞が「人＋動物」→ that。"},
          {"t": "choice", "q": "My father, ( ) is a doctor, is very busy.", "o": ["who", "that", "which", "whom"], "e": "カンマの後（非制限用法）に that は使えない。人で主格 → who。"},
          {"t": "order", "ja": "君に言えるのはこれで全部だ。", "a": "This is all that I can tell you.", "e": "先行詞 all → 関係代名詞は that が普通。"},
        ],
      },
      {
        "id": "22-2-1", "title": "関係副詞の考え方", "book": 798, "pdf": [787, 790],
        "points": [
          "関係副詞 where（場所）/ when（時）/ why（理由）/ how（方法）は、節の中で副詞の働きをする。",
          "関係副詞＝前置詞＋which：the town where I live ＝ the town in which I live。",
          "how は the way と並べない。the way S V か how S V のどちらか一方を使う。",
        ],
        "questions": [
          {"t": "choice", "q": "I remember the day ( ) we first met.", "o": ["when", "where", "which", "why"], "e": "時の先行詞＋完全文 → when。"},
          {"t": "choice", "q": "That is the reason ( ) she left early.", "o": ["why", "where", "which", "how"], "e": "the reason＋完全文 → why。"},
          {"t": "choice", "q": "このようにして彼はその問題を解いた。 This is ( ) he solved the problem.", "o": ["how", "the way how", "which", "what"], "e": "「方法」→ how（または the way）。the way how とは言わない。"},
          {"t": "fill", "q": "Kyoto is the city ___ I spent my childhood. (1語)", "a": ["where"], "e": "I spent my childhood は完全な文 → 場所の関係副詞 where（＝in which）。"},
        ],
      },
      {
        "id": "22-2-2", "title": "関係代名詞と関係副詞の判別", "book": 802, "pdf": [791, 794],
        "points": [
          "判断の決め手は先行詞ではなく後ろの節：名詞が欠けていれば関係代名詞、完全な文なら関係副詞。",
          "the town which I visited（visited の目的語が欠け）／the town where I live（完全な文）。",
          "先行詞が場所・時でも where / when になるとは限らない点に注意。",
        ],
        "questions": [
          {"t": "choice", "q": "This is the museum ( ) I visited last year.", "o": ["which", "where", "when", "what"], "e": "visited の目的語が欠けている → 関係代名詞 which。先行詞が場所でも where ではない。"},
          {"t": "choice", "q": "This is the museum ( ) I saw the famous painting.", "o": ["where", "which", "what", "who"], "e": "I saw the famous painting は完全な文 → 関係副詞 where。"},
          {"t": "choice", "q": "I'll never forget the summer ( ) we spent in Hawaii.", "o": ["which", "when", "where", "why"], "e": "spent の目的語が欠けている → which。先行詞が時でも when ではない。"},
          {"t": "fill", "q": "Do you know a place ___ we can eat lunch? (1語)", "a": ["where"], "e": "we can eat lunch は完全な文 → where。"},
        ],
      },
      {
        "id": "22-3-1", "title": "制限用法と非制限用法について", "book": 806, "pdf": [795, 797],
        "points": [
          "制限用法（カンマなし）は先行詞を絞り込み、非制限用法（カンマあり）は先行詞に補足説明を加える。",
          "two sons who are doctors は「医者の息子2人（他にもいるかも）」、, who are … は「息子は2人で共に医者」。",
          "非制限用法では that は使えず、目的格でも関係代名詞を省略できない。",
        ],
        "pattern": ",\\s*(who|whom|whose|which)\\b",
        "questions": [
          {"t": "choice", "q": "He has two daughters, ( ) live in Tokyo.", "o": ["who", "that", "which", "whom"], "e": "カンマの後の非制限用法。人で主格 → who。that は不可。"},
          {"t": "choice", "q": "「He has two sons, who are doctors.」の意味として正しいものは？", "o": ["息子は2人いて、2人とも医者だ", "医者の息子が2人いて、他にも息子がいるかもしれない", "医者になりたい息子が2人いる", "2人の医者に息子がいる"], "e": "非制限用法は補足説明。息子は2人だけで、その2人が医者。"},
          {"t": "choice", "q": "I lent him my bike, ( ) he never returned.", "o": ["which", "that", "what", "it"], "e": "非制限用法で目的格 → which（省略不可）。it だとカンマだけで2文をつなぐことになり誤り。"},
          {"t": "order", "ja": "兄は東京に住んでいるのだが、来週訪ねてくる。", "a": "My brother, who lives in Tokyo, will visit next week.", "e": "兄は1人なので絞り込む必要がない → カンマで挟む非制限用法。"},
        ],
      },
      {
        "id": "22-3-2", "title": "固有名詞の後にくる非制限用法", "book": 809, "pdf": [798, 799],
        "points": [
          "固有名詞や my mother など1つに決まる先行詞は絞り込む必要がないので、非制限用法（カンマ）を使う。",
          "Mr. Brown, who lives next door, is a teacher. のように、主語の直後に挿入される形が多い。",
          "固有名詞の後の関係詞に that は使えない。",
        ],
        "questions": [
          {"t": "choice", "q": "Paris, ( ) is the capital of France, is visited by millions of people.", "o": ["which", "that", "where", "what"], "e": "固有名詞＋カンマの非制限用法。is の主語が欠けている → which。"},
          {"t": "choice", "q": "I met Tom, ( ) I hadn't seen for years.", "o": ["whom", "that", "which", "whose"], "e": "人（Tom）で seen の目的語 → whom。非制限用法なので that は不可。"},
          {"t": "choice", "q": "We went to Nara, ( ) we saw many deer.", "o": ["where", "which", "that", "when"], "e": "we saw many deer は完全な文 → 関係副詞 where の非制限用法「そしてそこで」。"},
          {"t": "fill", "q": "My mother, ___ is seventy, still works every day. (1語)", "a": ["who"], "e": "母は1人 → 非制限用法。人で主格 → who。"},
        ],
      },
      {
        "id": "22-3-3", "title": "英会話で多用される非制限用法", "book": 811, "pdf": [800, 800],
        "points": [
          "会話では , which が前の文全体（または一部）を受け、「そしてそれは〜」と後から補足する形が多い。",
          "…, which is why 〜「だから〜なのだ」は、理由を先に言って結果を言い足す定番表現。",
          "カンマの後に it や that を置いて2文をつなぐのは誤り（×, it was a lie）。which を使う。",
        ],
        "questions": [
          {"t": "choice", "q": "He said he was ill, ( ) was not true.", "o": ["which", "that", "it", "what"], "e": "前の文の内容（彼が病気だと言ったこと）を受ける非制限用法の which。"},
          {"t": "choice", "q": "She missed the bus, ( ) is why she was late.", "o": ["which", "that", "what", "it"], "e": ", which is why 〜「だから〜なのだ」。"},
          {"t": "choice", "q": "「I passed the test, which surprised my parents.」の which が指すものは？", "o": ["私が試験に合格したこと", "the test", "my parents", "試験の難しさ"], "e": "両親を驚かせたのは「合格したこと」→ 前の文全体を受ける which。"},
          {"t": "order", "ja": "彼は遅れて来たが、それはいつものことだ。", "a": "He came late, which is usual for him.", "e": ", which が前の文の内容を受けて補足する。"},
        ],
      },
      {
        "id": "22-3-4", "title": "関係詞の「訳し方」のまとめ", "book": 812, "pdf": [801, 801],
        "points": [
          "制限用法は「〜する（名詞）」と後ろから前へ訳すのが基本。",
          "非制限用法や長い関係詞節は、前から「〜で、その人は…」「そしてそれは…」と訳し下すと自然。",
          "文脈により「〜だが」（逆接）や「〜なので」（理由）と訳すと自然な場合もある。",
        ],
        "questions": [
          {"t": "choice", "q": "「I have an uncle who lives in Kobe.」の訳として最も自然なものは？", "o": ["私には神戸に住んでいるおじがいる", "私はおじを持っていて、彼は神戸を住む", "神戸に住んでいるのはおじだけだ", "おじは以前神戸に住んでいた"], "e": "制限用法は後ろから前へ「神戸に住んでいるおじ」と訳す。"},
          {"t": "choice", "q": "「She gave me a watch, which I lost the next day.」の自然な訳は？", "o": ["彼女は私に時計をくれたが、私は翌日それをなくしてしまった", "彼女は私に、翌日なくすための時計をくれた", "彼女は翌日、私に時計をくれてなくした", "私が翌日なくした時計を、彼女が見つけてくれた"], "e": "非制限用法は前から訳し下す。ここでは「〜だが」と逆接でつなぐと自然。"},
          {"t": "choice", "q": "「The doctor, who had been working all night, looked tired.」の自然な訳は？", "o": ["その医者は一晩中働いていたので、疲れているように見えた", "一晩中働いていた医者たちの一人が、疲れているように見えた", "その医者は疲れているように見えたので、一晩中働いた", "その医者は一晩中働いていたが、疲れていないように見えた"], "e": "挿入された非制限用法が理由を補足している → 「〜なので」と訳すと自然。"},
          {"t": "order", "ja": "これが私が話していた本です。", "a": "This is the book I was talking about.", "e": "the book を I was talking about が修飾（目的格の省略＋前置詞が文末に残る形）。"},
        ],
      },
      {
        "id": "22-3-5", "title": "先行詞と関係詞が離れる場合", "book": 813, "pdf": [802, 802],
        "points": [
          "主語が長くなるのを避けるため、関係詞節が文末に回り先行詞と離れることがある：A man came in who was wearing a hat.",
          "先行詞の後に前置詞句が入り、関係詞と離れることもある：the letters from my uncle, which are …。",
          "関係詞がどの名詞を受けるかは、動詞の数（単数・複数）や意味から判断する。",
        ],
        "questions": [
          {"t": "choice", "q": "A man came in ( ) was carrying a big box.", "o": ["who", "which", "where", "what"], "e": "先行詞 A man と関係詞節が came in をはさんで離れた形。人で主格 → who。"},
          {"t": "choice", "q": "The letters from my uncle, which ( ) in English, are hard to read.", "o": ["are written", "is written", "writes", "writing"], "e": "which の先行詞は直前の my uncle ではなく The letters（複数）→ are written。"},
          {"t": "choice", "q": "「The time will come when you will understand this.」の when の先行詞は？", "o": ["The time", "you", "this", "will come"], "e": "when 節は文末に回っているが、先行詞は文頭の The time。「〜する時が来るだろう」。"},
          {"t": "fill", "q": "The day will come ___ everyone can travel to space. (1語)", "a": ["when"], "e": "先行詞 The day と関係副詞 when が will come をはさんで離れた形。"},
        ],
      },
      {
        "id": "22-3-6", "title": "関係代名詞whichの特別用法「補格」（補語が欠けたときの関係代名詞）", "book": 814, "pdf": [803, 803],
        "points": [
          "which は節内の補語（C）が欠けた位置を受けることがある：He is a genius, which his brother is not.",
          "人の性質・地位などの「状態」を受けるので、先行詞が人でも who ではなく which を使う。",
          "制限用法では that が普通で、省略も多い：He is not the man (that) he was.「以前の彼ではない」。",
        ],
        "questions": [
          {"t": "choice", "q": "She looked like a model, ( ) she was not.", "o": ["which", "who", "whom", "what"], "e": "she was not の後に補語（a model）が欠けている → 補語を受ける which。人でも who は使わない。"},
          {"t": "choice", "q": "He is not the man ( ) he was ten years ago.", "o": ["that", "whose", "where", "whom"], "e": "he was の補語が欠けている。制限用法で補語を受けるのは that（省略も可）。"},
          {"t": "fill", "q": "He is rich, ___ I am not. (1語)", "a": ["which"], "e": "I am not の後の補語 rich が欠けている → which。"},
          {"t": "order", "ja": "彼女はもはや以前の彼女ではない。", "a": "She is no longer the woman she was.", "e": "the woman の後に補語を受ける that が省略された形。"},
        ],
      },
      {
        "id": "22-4-1", "title": "「名詞＋前置詞＋関係代名詞」のパターン", "book": 815, "pdf": [804, 805],
        "points": [
          "some / all / both / most / none of whom[which] で「そのうちの〜」を表す。",
          "the roof of which のように「名詞＋of which」で所有を表すこともある（＝whose roof）。",
          "非制限用法で使い、前置詞の後なので them / it / that は使えない。",
        ],
        "pattern": "\\b(some|all|both|most|many|none|each|one|few|neither) of (whom|which)\\b",
        "questions": [
          {"t": "choice", "q": "I have two brothers, both of ( ) live abroad.", "o": ["whom", "them", "who", "that"], "e": "前置詞 of の後で人を受ける → whom。them だと接続詞がなくなり誤り。"},
          {"t": "choice", "q": "He bought ten books, most of ( ) were novels.", "o": ["which", "them", "what", "that"], "e": "物を受ける「そのうちのほとんど」→ most of which。"},
          {"t": "choice", "q": "I saw an old house, the roof ( ) was painted blue.", "o": ["of which", "which", "of whom", "whose"], "e": "the roof of which ＝ whose roof「その屋根が」。物なので of whom ではない。"},
          {"t": "order", "ja": "彼には息子が3人いて、その全員が教師だ。", "a": "He has three sons, all of whom are teachers.", "e": "all of whom「そのうち全員が」。"},
        ],
      },
      {
        "id": "22-4-2", "title": "「前置詞＋名詞＋前置詞＋関係代名詞」のパターン", "book": 817, "pdf": [806, 807],
        "points": [
          "「前置詞＋名詞＋of which」は、節内の前置詞句をまるごと前に出した形：at the foot of which。",
          "元の文に戻すとわかりやすい：at the foot of which we camped ← we camped at the foot of it。",
          "堅い書き言葉の表現。先頭の前置詞は、節内の動詞や名詞との結びつきで決まる。",
        ],
        "questions": [
          {"t": "choice", "q": "This is the hill, at the top ( ) there is an old castle.", "o": ["of which", "which", "of whom", "whose"], "e": "at the top of the hill → at the top of which。"},
          {"t": "choice", "q": "He showed me a big tree, in the shade ( ) we rested.", "o": ["of which", "which", "where", "of whom"], "e": "we rested in the shade of the tree → in the shade of which。"},
          {"t": "fill", "q": "This is the lake, ___ the center of which there is a small island. (1語)", "a": ["in", "at"], "e": "There is a small island in the center of the lake. の前置詞句が前に出た形。"},
          {"t": "choice", "q": "「the building, on the roof of which we stood」を元の節に戻したものは？", "o": ["we stood on the roof of the building", "we stood the roof of the building", "we stood on the building of the roof", "the building stood on the roof"], "e": "on the roof of which の which に the building を戻し、前置詞句を節の後ろに置く。"},
        ],
      },
      {
        "id": "22-4-3", "title": "その他の発展形（前置詞＋関係代名詞＋to不定詞 / 二重限定 / 主格の省略）", "book": 819, "pdf": [808, 809],
        "points": [
          "前置詞＋関係代名詞＋to不定詞「〜するための…」：a house in which to live ＝ a house to live in。",
          "二重限定：1つの先行詞に関係詞節を2つ重ねて絞り込む：the only person (that) I know who can …。",
          "主格の関係代名詞も、I think などが挟まる形では省略されることがある：the man I thought was honest。",
        ],
        "questions": [
          {"t": "choice", "q": "He needs a friend with ( ) to talk.", "o": ["whom", "who", "that", "him"], "e": "前置詞＋関係代名詞＋to不定詞。前置詞の後なので whom。＝a friend to talk with。"},
          {"t": "choice", "q": "She had no chair on which ( ) sit.", "o": ["to", "she", "for", "can"], "e": "on which to sit「座るための（いす）」。"},
          {"t": "choice", "q": "He is the only person ( ) I know who can speak Russian.", "o": ["that", "what", "whose", "where"], "e": "二重限定。the only person を that I know と who can speak Russian が重ねて絞り込む。"},
          {"t": "order", "ja": "私は正直だと思っていた男に裏切られた。", "a": "I was betrayed by the man I thought was honest.", "e": "the man (who) I thought was honest。I thought が挟まり主格の who が省略された形。"},
        ],
      },
      {
        "id": "22-5-1", "title": "whatの2つの特徴", "book": 821, "pdf": [810, 811],
        "points": [
          "what は先行詞を含む関係代名詞で「〜すること・もの」（＝the thing(s) which）。",
          "what の前に先行詞は置かない。what 節全体が名詞節となり、主語・目的語・補語になる。",
          "what 節の中では主語や目的語などの名詞が欠けている（不完全な文）。",
        ],
        "questions": [
          {"t": "choice", "q": "( ) he said was true.", "o": ["What", "That", "Which", "Who"], "e": "said の目的語が欠け、文の主語になる名詞節 → What「彼が言ったこと」。"},
          {"t": "choice", "q": "This is ( ) I wanted.", "o": ["what", "which", "that", "who"], "e": "先行詞がなく、wanted の目的語が欠けている → what「私が欲しかったもの」。"},
          {"t": "choice", "q": "Show me the thing ( ) you bought.", "o": ["which", "what", "whose", "where"], "e": "先行詞 the thing があるので what は使えない → which。"},
          {"t": "fill", "q": "I can't believe ___ I see. (1語)", "a": ["what"], "e": "先行詞がなく、see の目的語が欠けている → what「見ているもの」。"},
        ],
      },
      {
        "id": "22-5-2", "title": "関係代名詞whatの構造（thatとの区別 / 前置詞＋what）", "book": 823, "pdf": [812, 813],
        "points": [
          "接続詞 that の後は完全な文、関係代名詞 what の後は名詞が欠けた不完全な文。",
          "前置詞の後に what 節は置ける（listen to what he says）が、接続詞 that の節は原則置けない。",
          "意味の目安：what 節は「〜すること・もの」、that 節は「〜ということ」。",
        ],
        "questions": [
          {"t": "choice", "q": "I know ( ) she is honest.", "o": ["that", "what", "which", "who"], "e": "she is honest は完全な文 → 接続詞 that「〜ということ」。"},
          {"t": "choice", "q": "I don't understand ( ) you mean.", "o": ["what", "that", "which", "it"], "e": "mean の目的語が欠けている → what。"},
          {"t": "choice", "q": "Listen carefully to ( ) the teacher says.", "o": ["what", "that", "which", "who"], "e": "前置詞 to の後、says の目的語が欠けている → what。"},
          {"t": "fill", "q": "It is surprising ___ he won the race. (1語)", "a": ["that"], "e": "he won the race は完全な文 → 接続詞 that（It は形式主語）。"},
        ],
      },
      {
        "id": "22-5-3", "title": "関係代名詞whatを含む「慣用表現」", "book": 825, "pdf": [814, 816],
        "points": [
          "what S is「今のS」、what S was / used to be「以前のS」：He is not what he was.",
          "what is called / what we call「いわゆる」、what is more「さらに」、what is worse「さらに悪いことに」。",
          "A is to B what C is to D「AとBの関係は、CとDの関係と同じ」。",
        ],
        "pattern": "\\bwhat (is|was) (more|worse|called)\\b|\\bwhat (we|you|they) call\\b",
        "questions": [
          {"t": "choice", "q": "My parents made me ( ) I am today.", "o": ["what", "that", "which", "who"], "e": "what I am today「今日の私」。"},
          {"t": "choice", "q": "It was cold, and ( ) was worse, it began to rain.", "o": ["what", "that", "which", "it"], "e": "what was worse「さらに悪いことに」。"},
          {"t": "choice", "q": "He is ( ) is called a walking dictionary.", "o": ["what", "that", "which", "who"], "e": "what is called「いわゆる」。"},
          {"t": "fill", "q": "Reading is to the mind ___ food is to the body. (1語)", "a": ["what"], "e": "A is to B what C is to D「読書と精神の関係は、食べ物と体の関係と同じ」。"},
        ],
      },
      {
        "id": "22-6-1", "title": "複合関係詞（-ever）の「形」", "book": 828, "pdf": [817, 818],
        "points": [
          "複合関係代名詞 whoever / whichever / whatever と、複合関係副詞 whenever / wherever / however がある。",
          "先行詞を含み、名詞節（〜する人は誰でも）または副詞節（誰が〜しても）をつくる。",
          "whoever の形は節内の働きで決まる：節内で主語なら whoever、目的語なら whomever（口語では whoever）。",
        ],
        "pattern": "\\b(whoever|whomever|whatever|whichever|whenever|wherever)\\b",
        "questions": [
          {"t": "choice", "q": "( ) comes first will get the prize.", "o": ["Whoever", "Whomever", "Whatever", "However"], "e": "comes の主語が欠けた名詞節「最初に来た人は誰でも」→ Whoever。"},
          {"t": "choice", "q": "You can take ( ) of these three cakes you like.", "o": ["whichever", "whoever", "wherever", "however"], "e": "限られた選択肢（3つのケーキ）から「どれでも」→ whichever。"},
          {"t": "fill", "q": "Sit ___ you like. (どこでも好きなところに)", "a": ["wherever"], "e": "場所「どこでも」→ 複合関係副詞 wherever。"},
          {"t": "choice", "q": "「〜するときはいつでも」を表す語はどれか。", "o": ["whenever", "wherever", "whoever", "whatever"], "e": "時 → whenever。"},
        ],
      },
      {
        "id": "22-6-2", "title": "複合関係詞の「意味」", "book": 830, "pdf": [819, 821],
        "points": [
          "名詞節：whoever 〜「〜する人は誰でも」、whatever 〜「〜するものは何でも」。",
          "副詞節（譲歩）：whoever 〜「誰が〜しても」＝no matter who、whatever 〜「何を〜しても」＝no matter what。",
          "whenever / wherever は「〜するときはいつでも／どこでも」と「いつ／どこで〜しても」の両方の意味をもつ。",
        ],
        "questions": [
          {"t": "choice", "q": "( ) happens, I will support you.", "o": ["Whatever", "Whoever", "Wherever", "However"], "e": "happens の主語（出来事）が欠けた譲歩節「何が起ころうとも」→ Whatever。"},
          {"t": "choice", "q": "No matter who calls, don't open the door. ＝ ( ) calls, don't open the door.", "o": ["Whoever", "Whatever", "Whenever", "However"], "e": "no matter who ＝ whoever「誰が〜しても」。"},
          {"t": "choice", "q": "「Take whatever you want.」の意味は？", "o": ["欲しいものは何でも取りなさい", "何が欲しくても取ってはいけない", "欲しいときはいつでも取りなさい", "欲しい人は誰でも取りなさい"], "e": "take の目的語になる名詞節 → 「〜するものは何でも」。"},
          {"t": "fill", "q": "___ you go, you will find the same problem. (どこへ行っても)", "a": ["wherever", "no matter where"], "e": "譲歩の副詞節「どこへ行っても」→ wherever ＝ no matter where。"},
        ],
      },
      {
        "id": "22-6-3", "title": "複合関係詞の注意点（その1）分解", "book": 833, "pdf": [822, 823],
        "points": [
          "名詞節の複合関係詞は「any＋先行詞＋関係詞」に分解できる：whoever ＝ anyone who、whatever ＝ anything that。",
          "分解すると節内の格が見える：Give it to whoever wants it.（to の後でも、wants の主語なので whoever）。",
          "whenever ＝ at any time when、wherever ＝ at any place where と考えるとわかりやすい。",
        ],
        "questions": [
          {"t": "choice", "q": "Give this ticket to ( ) wants it.", "o": ["whoever", "whomever", "whatever", "whichever"], "e": "to anyone who wants it と分解。節内で wants の主語 → whoever（前置詞の後でも whomever にしない）。"},
          {"t": "choice", "q": "Whatever she cooks is delicious. ＝ ( ) she cooks is delicious.", "o": ["Anything that", "Everything what", "Something which", "Nothing that"], "e": "whatever ＝ anything that「〜するものは何でも」。"},
          {"t": "fill", "q": "Whoever breaks the rule will be punished. ＝ ___ who breaks the rule will be punished. (1語)", "a": ["anyone", "anybody"], "e": "whoever ＝ anyone who。"},
          {"t": "choice", "q": "I'll follow you ( ) you go.", "o": ["wherever", "whatever", "whoever", "whichever"], "e": "wherever ＝ to any place where「あなたが行くところならどこへでも」。"},
        ],
      },
      {
        "id": "22-6-4", "title": "複合関係詞の注意点（その2）howeverの使い方", "book": 835, "pdf": [824, 825],
        "points": [
          "譲歩の however は「however＋形容詞／副詞＋S V」の語順：However hard you try, …。",
          "形容詞・副詞を however から離さない（×However you try hard）。＝No matter how hard you try。",
          "「どんなやり方で〜しても」は however S V：However you do it, …。接続副詞の however「しかし」と区別。",
        ],
        "questions": [
          {"t": "choice", "q": "However ( ) you are, you must follow the rules.", "o": ["rich", "richly", "riches", "richness"], "e": "you are の補語になる形容詞が however の直後に来る → rich。"},
          {"t": "choice", "q": "( ) tired she was, she kept working.", "o": ["However", "Whatever", "Whoever", "Whenever"], "e": "however＋形容詞＋S V「どんなに疲れていても」。"},
          {"t": "choice", "q": "正しい英文はどれか。", "o": ["However hard he works, he never gets rich.", "However he works hard, he never gets rich.", "However works he hard, he never gets rich.", "However hard does he work, he never gets rich."], "e": "however＋副詞＋S V の語順。hard を however から離さず、倒置もしない。"},
          {"t": "fill", "q": "___ fast you run, you won't catch the bus. (どんなに速く走っても)", "a": ["however", "no matter how"], "e": "however＋副詞＋S V ＝ no matter how＋副詞＋S V。"},
        ],
      },
      {
        "id": "22-7-1", "title": "関係形容詞what", "book": 837, "pdf": [826, 827],
        "points": [
          "関係形容詞 what＋名詞 で「〜するすべての（名詞）」：what money I have ＝ all the money that I have。",
          "little / few を伴うと「少ないながらもすべての〜」：what little money I had「なけなしのお金」。",
          "後ろの名詞は不可算名詞か複数名詞が普通。",
        ],
        "questions": [
          {"t": "choice", "q": "I gave him ( ) money I had.", "o": ["what", "which", "that", "whose"], "e": "what＋名詞「持っていたお金を全部」。"},
          {"t": "choice", "q": "She lent me ( ) few books she had.", "o": ["what", "which", "that", "whose"], "e": "what few＋名詞「少ないながらも持っていた本すべて」。"},
          {"t": "fill", "q": "I will give you what help I can. ＝ I will give you ___ the help that I can. (1語)", "a": ["all"], "e": "what＋名詞 ＝ all the＋名詞＋that。"},
          {"t": "order", "ja": "私はなけなしのお金を全部彼に渡した。", "a": "I gave him what little money I had.", "e": "what little money I had「少ないながらも持っていたお金全部」。"},
        ],
      },
      {
        "id": "22-7-2", "title": "複合関係形容詞whatever", "book": 839, "pdf": [828, 828],
        "points": [
          "whatever＋名詞：名詞節「どんな〜でも」（＝any＋名詞＋that）、副詞節「どんな〜を…しても」（＝no matter what＋名詞）。",
          "Take whatever book you like.（どんな本でも）／Whatever problems you have, …（どんな問題があっても）。",
          "否定文・疑問文で名詞の後に置く whatever は強調：no doubt whatever「少しの疑いもない」。",
        ],
        "questions": [
          {"t": "choice", "q": "You can read ( ) book you like.", "o": ["whatever", "whoever", "however", "wherever"], "e": "whatever＋名詞「どんな本でも」。"},
          {"t": "choice", "q": "( ) mistakes you make, don't give up.", "o": ["Whatever", "However", "Whoever", "Wherever"], "e": "whatever＋名詞の譲歩節「どんな間違いをしても」。"},
          {"t": "choice", "q": "There is no doubt ( ) about it.", "o": ["whatever", "however", "whoever", "wherever"], "e": "no＋名詞＋whatever「少しも〜ない」の強調。"},
          {"t": "fill", "q": "No matter what excuse he makes, I won't believe him. ＝ ___ excuse he makes, I won't believe him. (1語)", "a": ["whatever"], "e": "no matter what＋名詞 ＝ whatever＋名詞。"},
        ],
      },
      {
        "id": "22-7-3", "title": "関係形容詞which / 複合関係形容詞whichever", "book": 840, "pdf": [829, 831],
        "points": [
          "関係形容詞 which＋名詞は、非制限用法で前の内容を受ける堅い表現。代表例は in which case「その場合には」。",
          "whichever＋名詞「どちらの〜でも」：限られた選択肢から選ぶときに使う：Take whichever seat you like.",
          "whatever は範囲を限らず、whichever は選択肢が限られているときに使う。",
        ],
        "questions": [
          {"t": "choice", "q": "It may rain, in ( ) case the game will be canceled.", "o": ["which", "what", "that", "whose"], "e": "in which case「その場合には」。which＋名詞が前の内容を受ける。"},
          {"t": "choice", "q": "There are two roads. ( ) road you take, you'll get to the station.", "o": ["Whichever", "Whoever", "However", "Wherever"], "e": "2本の道から「どちらの道を行っても」→ whichever＋名詞。"},
          {"t": "choice", "q": "He may be late, in which ( ) we will start without him.", "o": ["case", "time", "way", "reason"], "e": "in which case「その場合には」の決まった形。"},
          {"t": "order", "ja": "どれでもいちばん好きなバッグを取りなさい。", "a": "Take whichever bag you like best.", "e": "whichever＋名詞「どちらの〜でも」。"},
        ],
      },
      {
        "id": "22-7-4", "title": "疑似関係代名詞（as / than / but）", "book": 843, "pdf": [832, 833],
        "points": [
          "as は such / the same / as 〜 の後で関係代名詞として働く：the same watch as I lost。",
          "as は前後の文全体を受けることもある：As is often the case with him, he was late.「彼にはよくあることだが」。",
          "than は比較級の後（more money than is needed）、but は否定の先行詞の後で「〜しない…はない」（古風）。",
        ],
        "questions": [
          {"t": "choice", "q": "This is the same watch ( ) I lost last week.", "o": ["as", "what", "than", "whose"], "e": "the same 〜 as …「…と同じ〜」。as が lost の目的語を受ける疑似関係代名詞。"},
          {"t": "fill", "q": "___ is often the case with him, he was late for school. (1語)", "a": ["as"], "e": "As is often the case with 〜「〜にはよくあることだが」。as は後ろの文全体を受ける。"},
          {"t": "choice", "q": "He spent more money ( ) was necessary.", "o": ["than", "as", "which", "what"], "e": "比較級 more の後 → than。than が was の主語の働きをする。"},
          {"t": "choice", "q": "例外のない規則はない。 There is no rule ( ) has exceptions.", "o": ["but", "as", "than", "what"], "e": "否定の先行詞＋but「〜しない…はない」（＝that doesn't）。古風な表現。"},
        ],
      },
    ],
  },
  {
    "n": 23, "title": "強調構文・倒置", "part": "Part 5 「構造」を意識する",
    "toc": {"book": 845, "pdf": 834}, "intro": {"book": [846, 847], "pdf": [835, 836]},
    "sections": [
      {
        "id": "23-1-1", "title": "強調構文の成り立ちと従来の発想", "book": 848, "pdf": [837, 838],
        "points": [
          "It is 〜 that … で、〜の部分（主語・目的語・副詞句など）を強調する。「…なのは〜だ」。",
          "伝統的な判別法：It is と that を取り去っても文が成り立てば強調構文。",
          "形式主語構文（It is true that …など）は、It is と that を取り去ると文が成り立たない。",
        ],
        "questions": [
          {"t": "choice", "q": "It was Tom ( ) broke the window.", "o": ["that", "what", "which", "where"], "e": "強調構文 It was 〜 that …。主語 Tom を強調している。"},
          {"t": "choice", "q": "次のうち強調構文はどれか。", "o": ["It was in 2010 that I met her.", "It is true that he is rich.", "It is important that you come.", "It is said that he is rich."], "e": "It was と that を取り去ると I met her in 2010. が成り立つ → 強調構文。他は形式主語構文。"},
          {"t": "fill", "q": "It was yesterday ___ I saw him. (1語)", "a": ["that", "when"], "e": "副詞 yesterday を強調する強調構文。that が基本（時の強調では when も可）。"},
          {"t": "order", "ja": "私が欲しいのはこの本だ。", "a": "It is this book that I want.", "e": "目的語 this book を It is と that ではさんで強調する。"},
        ],
      },
      {
        "id": "23-1-2", "title": "強調構文の本当の考え方（基本形と頻出パターン）", "book": 850, "pdf": [839, 840],
        "points": [
          "強調構文は「他でもない〜が」と一点に焦点を当て、他の候補との対比を示す働きがある。",
          "頻出：It is not A but B that 〜／It is B, not A, that 〜「〜なのはAではなくBだ」。",
          "人を強調するときは that の代わりに who も使える。that 以下の動詞は強調される語に一致させる。",
        ],
        "questions": [
          {"t": "choice", "q": "It is not money ( ) love that makes people happy.", "o": ["but", "and", "or", "so"], "e": "It is not A but B that 〜「〜なのはAではなくBだ」。"},
          {"t": "choice", "q": "It was my sister, not I, ( ) broke the vase.", "o": ["who", "which", "what", "whom"], "e": "人（my sister）を強調 → that の代わりに who も使える。主語なので whom は不可。"},
          {"t": "choice", "q": "It is you who ( ) wrong.", "o": ["are", "is", "am", "be"], "e": "who 以下の動詞は強調されている you に一致させる → are。"},
          {"t": "order", "ja": "大切なのは結果ではなく努力だ。", "a": "It is effort, not results, that matters.", "e": "It is B, not A, that 〜。動詞は effort（単数）に一致して matters。"},
        ],
      },
      {
        "id": "23-1-3", "title": "強調構文の即断パターン", "book": 852, "pdf": [841, 843],
        "points": [
          "It is の直後に副詞（句・節）が来て that が続けば、強調構文と即断してよい。",
          "It is because 〜 that …「…なのは〜だからだ」は典型的な強調構文。",
          "It is の後が名詞で that 以下に主語・目的語が欠けていれば強調構文の可能性が高い（関係詞との区別は文脈で）。",
        ],
        "questions": [
          {"t": "choice", "q": "It was because he was ill ( ) he stayed home.", "o": ["that", "what", "which", "so"], "e": "It was because 〜 that …「…したのは〜だからだ」。"},
          {"t": "choice", "q": "It was in this room ( ) the meeting was held.", "o": ["that", "which", "what", "who"], "e": "It was＋副詞句（in this room）＋that → 強調構文。"},
          {"t": "choice", "q": "「It is only when we lose our health that we know its value.」の訳は？", "o": ["健康を失って初めて、その価値がわかる", "健康を失うときだけ、価値を知ることが唯一のことだ", "健康の価値を知ると、健康を失う", "健康を失っても、その価値はわからない"], "e": "It is only when 〜 that …「〜して初めて…」。副詞節を強調した強調構文。"},
          {"t": "fill", "q": "It was at the station ___ I lost my wallet. (1語)", "a": ["that"], "e": "副詞句 at the station を強調 → that。前置詞 at があるので where は重複になり不可。"},
        ],
      },
      {
        "id": "23-1-4", "title": "強調構文の訳し方", "book": 855, "pdf": [844, 845],
        "points": [
          "基本は that 以下から訳し、強調部分を最後に置いて「…なのは〜だ」とする。",
          "文が長いときは「まさに〜こそが…」と前から訳してもよい。",
          "It is not until A that B は「Aして初めてBする」と訳すのが定番。",
        ],
        "questions": [
          {"t": "choice", "q": "「It was John that told me the news.」の訳は？", "o": ["その知らせを私に伝えたのはジョンだった", "ジョンは私に伝えられた知らせだった", "その知らせはジョンのものだった", "ジョンにその知らせを伝えたのは私だった"], "e": "that 以下から訳し、強調された John を最後に「〜なのはジョンだった」。"},
          {"t": "choice", "q": "「It was not until last week that I heard about it.」の訳は？", "o": ["先週になって初めてそのことを聞いた", "先週まではそのことを聞いていた", "先週はそのことを聞かなかった", "先週までにそのことを聞き終えた"], "e": "It is not until A that B「Aして初めてB」。"},
          {"t": "order", "ja": "彼女が去年訪れたのはパリだった。", "a": "It was Paris that she visited last year.", "e": "目的語 Paris を強調。訳は that 以下から「〜なのはパリだった」。"},
        ],
      },
      {
        "id": "23-1-5", "title": "強調構文のバリエーション", "book": 857, "pdf": [846, 848],
        "points": [
          "疑問詞を強調すると「疑問詞＋is it that 〜?」の形：What is it that you want?",
          "間接疑問に入ると平叙文の語順に戻る：I wonder who it was that called me.",
          "It is not until A that B「Aして初めてB」、It is only 〜 that …「〜してようやく…」も頻出。",
        ],
        "pattern": "\\bit (is|was) not until\\b|\\b(who|what|where|when|why|how) (is|was) it that\\b",
        "questions": [
          {"t": "choice", "q": "What was it ( ) made you so angry?", "o": ["that", "what", "which", "it"], "e": "疑問詞 what を強調した強調構文：What was it that 〜?"},
          {"t": "choice", "q": "I wonder who ( ) that called me.", "o": ["it was", "was it", "it is being", "was"], "e": "間接疑問の中なので平叙文の語順 → who it was that 〜。"},
          {"t": "choice", "q": "It was not until he got home ( ) he noticed his mistake.", "o": ["that", "when", "since", "before"], "e": "It was not until A that B「Aして初めてB」。"},
          {"t": "order", "ja": "あなたが本当に欲しいものは何ですか。", "a": "What is it that you really want?", "e": "疑問詞 What を強調：What is it that 〜?"},
        ],
      },
      {
        "id": "23-2-1", "title": "任意倒置の全体像と第1文型・第2文型の倒置", "book": 860, "pdf": [849, 850],
        "points": [
          "任意倒置は、文のバランスや情報の流れのために語順を入れ替えるもので、文法上の義務ではない。",
          "第1文型：場所・方向の副詞（句）が文頭に出て V S の語順：Here comes the bus. / On the hill stood a church.",
          "第2文型：補語が文頭に出て C V S になる。主語が代名詞なら倒置しない（Here it comes.）。",
        ],
        "pattern": "\\b(here|there) (comes|goes|come|go) the\\b",
        "questions": [
          {"t": "choice", "q": "Here ( ) the bus!", "o": ["comes", "come", "coming", "is coming"], "e": "Here が文頭 → V S の倒置。主語 the bus は単数 → comes。"},
          {"t": "choice", "q": "（バスを指して）来たよ。 Here ( ).", "o": ["it comes", "comes it", "come it", "it coming"], "e": "主語が代名詞のときは倒置しない → Here it comes."},
          {"t": "choice", "q": "On the top of the hill ( ) an old castle.", "o": ["stands", "stand", "standing", "is stand"], "e": "場所の副詞句が文頭 → V S。主語 an old castle は単数 → stands。"},
          {"t": "fill", "q": "Happy ___ those who have true friends. (be動詞)", "a": ["are"], "e": "補語 Happy が文頭に出た C V S の倒置。主語 those は複数 → are。"},
        ],
      },
      {
        "id": "23-2-2", "title": "倒置の「背景」", "book": 862, "pdf": [851, 853],
        "points": [
          "英語は「旧情報→新情報」「短いもの→長いもの（文末重心）」の順を好み、これが倒置の背景にある。",
          "新情報や長い主語を文末に回すため、場所の副詞句などを前に出して V S の語順にする。",
          "前に出る語句は、前の文とのつながり（旧情報）をもつことが多い。",
        ],
        "questions": [
          {"t": "choice", "q": "任意倒置が起こる主な理由として正しいものはどれか。", "o": ["新しい情報や長い主語を文末に置くため", "疑問文にするため", "主語を省略するため", "時制をはっきりさせるため"], "e": "旧情報→新情報、文末重心の原則により、重要で長い主語が後ろに回る。"},
          {"t": "choice", "q": "We entered a large room. In the middle of it ( ) a big wooden table.", "o": ["stood", "standing", "it stood", "to stand"], "e": "前文を受ける旧情報（In the middle of it）を前に出し、新情報の主語を文末に置く → V S。"},
          {"t": "choice", "q": "次のうち自然な英文はどれか。", "o": ["Into the room ran a little boy.", "Into the room ran he.", "Into the room did run a boy.", "Into the room a little boy ran he."], "e": "方向の副詞句が文頭 → V S。ただし主語が代名詞なら倒置しない（Into the room he ran.）。"},
          {"t": "fill", "q": "Down ___ the rain. (come の過去形) 雨がどっと降ってきた。", "a": ["came"], "e": "方向の副詞 Down が文頭に出た V S の倒置。"},
        ],
      },
      {
        "id": "23-2-3", "title": "第3文型・第4文型・第5文型の倒置", "book": 865, "pdf": [854, 856],
        "points": [
          "第3文型では目的語を文頭に出して O S V とする。主語と動詞の語順は変えない：That I can't believe.",
          "目的語が前に出るのは、前の文とのつながりや対比を示すときが多い。",
          "第5文型で目的語が長いと、補語を前に出して V C O になる：make clear his intention。",
        ],
        "questions": [
          {"t": "choice", "q": "He made ( ) his intention to leave the company.", "o": ["clear", "clearly", "clarity", "it clear"], "e": "make O C の O が長いので V C O の語順：made clear his intention …。"},
          {"t": "choice", "q": "What he said I ( ) believe.", "o": ["could not", "not could", "could not it", "did not could"], "e": "目的語 What he said が文頭に出た O S V。S V の語順はそのまま。"},
          {"t": "choice", "q": "「That I cannot agree with.」の説明として正しいものは？", "o": ["with の目的語 That が文頭に出た倒置", "That が主語の普通の文", "命令文", "疑問文の語順"], "e": "I cannot agree with that. の目的語 that が前に出た形。"},
          {"t": "fill", "q": "___ he said I will never forget. (1語)", "a": ["what"], "e": "目的語 What he said が文頭に出た O S V。＝I will never forget what he said."},
        ],
      },
      {
        "id": "23-2-4", "title": "強制倒置の基本", "book": 868, "pdf": [857, 857],
        "points": [
          "否定語（never / little / hardly / not only など）が文頭に出ると、後ろは疑問文の語順になる（強制倒置）。",
          "一般動詞は do / does / did を使う：Never did I dream of it.",
          "so / neither / nor＋V＋S「〜もそうだ／〜もそうではない」も強制倒置。",
        ],
        "pattern": "\\b(never|seldom|rarely|little|hardly|scarcely) (did|do|does|had|have|has|was|were|could|can|would) (i|you|he|she|it|we|they)\\b|\\b(so|neither|nor) (do|does|did|am|is|are|was|were|have|has|can) (i|you|he|she|we|they)\\b",
        "questions": [
          {"t": "choice", "q": "Never ( ) such a beautiful sunset.", "o": ["have I seen", "I have seen", "I saw", "seen I have"], "e": "否定語 Never が文頭 → 疑問文の語順 have I seen。"},
          {"t": "choice", "q": "Little ( ) that he was being watched.", "o": ["did he know", "he knew", "he did know", "knew he"], "e": "否定の Little が文頭 → did he know「〜とは思いもしなかった」。"},
          {"t": "choice", "q": "I don't like coffee. — Neither ( ).", "o": ["do I", "I do", "am I", "I don't"], "e": "否定文を受けて「私もそうではない」→ Neither＋V＋S。like は一般動詞なので do。"},
          {"t": "fill", "q": "Not only ___ he sing, but he also dances. (1語)", "a": ["does"], "e": "Not only が文頭 → 疑問文の語順。現在・3人称単数の一般動詞 → does。"},
        ],
      },
      {
        "id": "23-2-5", "title": "強制倒置の応用", "book": 869, "pdf": [858, 860],
        "points": [
          "否定の副詞句や only＋副詞も文頭で倒置を起こす：Not until 〜 / Under no circumstances / Only then did I …。",
          "No sooner had S p.p. than 〜／Hardly [Scarcely] had S p.p. when [before] 〜「〜するとすぐに」。",
          "仮定法の if の省略による倒置：Had I known ＝ If I had known、Should you need ＝ If you should need。",
        ],
        "pattern": "\\bno sooner had\\b|\\bonly then (did|was|were|had|could)\\b",
        "questions": [
          {"t": "choice", "q": "No sooner had he arrived ( ) it began to rain.", "o": ["than", "when", "then", "that"], "e": "No sooner had S p.p. than 〜「〜するとすぐに」。"},
          {"t": "choice", "q": "Not until yesterday ( ) the truth.", "o": ["did I learn", "I learned", "I did learn", "learned I"], "e": "Not until 〜 が文頭 → 疑問文の語順 did I learn。"},
          {"t": "choice", "q": "( ) I known the truth, I would have told you.", "o": ["Had", "If", "Did", "Have"], "e": "If I had known の if を省略した倒置 → Had I known。"},
          {"t": "order", "ja": "そのとき初めて私は彼女の気持ちがわかった。", "a": "Only then did I understand her feelings.", "e": "Only＋副詞が文頭 → 疑問文の語順 did I understand。"},
        ],
      },
    ],
  },
];
