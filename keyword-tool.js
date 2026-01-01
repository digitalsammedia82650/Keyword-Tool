/* ============================================================
   KEYWORD ARCHITECT PRO – UNIFIED ENGINE
   Intent Detection + Grammar + POS-style Chunking
   No Libraries | SEO-Safe | Blogger-Safe
============================================================ */

/* =========================
   1. INTENT SIGNAL DICTIONARY
========================= */

const INTENT_SIGNALS = {
  "Local / Proximity": [
    "near me","nearby","closest","around here","within walking distance",
    "local","in city","zip code","open now","address","directions","map","store hours"
  ],
  "Informational (Interrogative)": [
    "how","what","who","where","why","when","which",
    "is it","can i","should i","does","meaning","definition"
  ],
  "Transactional (Action)": [
    "buy","order","purchase","shop","get","reserve","book",
    "schedule","hire","checkout","add to cart","online"
  ],
  "Commercial (Comparison)": [
    "vs","versus","alternative","comparison",
    "difference between","better than","competitors"
  ],
  "Commercial (Quality/Ranking)": [
    "best","top","rated","#1","review","testimonial",
    "pros and cons","recommended","is it worth it"
  ],
  "Transactional (Price/Value)": [
    "cheap","affordable","discount","coupon","promo",
    "sale","price","cost","budget","lowest price","wholesale"
  ],
  "Educational (Resource)": [
    "tutorial","guide","tips","checklist","examples","samples",
    "case study","whitepaper","facts","history",
    "statistics","documentation","for beginners"
  ],
  "Navigational (Brand Access)": [
    "login","sign in","sign up","official site","portal",
    "dashboard","homepage","support","contact","careers","jobs"
  ],
  "Utility (Asset/File)": [
    "download","install","pdf","excel","csv","png","svg",
    "plugin","extension","app","software","open source"
  ],
  "Temporal (Freshness)": [
    "new","latest","today","tonight","live",
    "current","forecast","release date","2026"
  ],
  "Technical (Problem Solving)": [
    "fix","repair","error","troubleshooting",
    "broken","not working","refund","cancel","remove"
  ],
  "Niche Audience": [
    "for kids","for seniors","for professionals",
    "for small business","for enterprise","for students"
  ]
};

/* =========================
   2. GRAMMAR RULE SET
========================= */

const GRAMMAR_RULES = {
  Interrogative: ["who","what","where","when","why","how","is","can","do","does"],
  Action_Verbs: ["buy","get","fix","download","order","book","find","clean"],
  Superlatives: ["best","top","cheapest","fastest","highest","worst"],
  Prepositions_Local: ["in","at","near","around","from"]
};

const STOP_WORDS = [
  "and","or","but","if","while","because",
  "a","an","the","this","that","these","those",
  "is","are","was","were","be","been","being",
  "of","from","by","as","with","without"
];

const PREPOSITIONS = ["for","in","to","near","with","without","on","at","around"];

/* =========================
   3. INTENT ANALYSIS
========================= */

function analyzeIntent(query) {
  query = query.toLowerCase();
  let detected = [];

  for (const intent in INTENT_SIGNALS) {
    if (INTENT_SIGNALS[intent].some(w => query.includes(w))) {
      detected.push(intent);
    }
  }

  return detected.length ? detected : ["General / Unclear"];
}

/* =========================
   4. GRAMMAR + INTENT ANALYZER
========================= */

function analyzeQuery(query) {
  query = query.toLowerCase();

  let grammarHits = [];
  let intentHits = [];

  for (const rule in GRAMMAR_RULES) {
    if (GRAMMAR_RULES[rule].some(w => query.split(" ").includes(w))) {
      grammarHits.push(rule);
    }
  }

  intentHits = analyzeIntent(query);

  if (grammarHits.includes("Interrogative") &&
      intentHits.includes("General / Unclear")) {
    intentHits = ["Informational (Implicit)"];
  }

  return {
    query,
    grammar: grammarHits,
    intent: intentHits
  };
}

/* =========================
   5. TOOL-1: QUERY BUILDER
   Seed + Location + Intent
========================= */

function buildQueries(seed, location = "", manualIntent = "auto") {
  seed = seed.toLowerCase();
  location = location.toLowerCase();

  let baseQueries = [];
  let intents = Object.keys(INTENT_SIGNALS);

  intents.forEach(intent => {
    INTENT_SIGNALS[intent].forEach(mod => {
      baseQueries.push(`${mod} ${seed}`);
      if (location) baseQueries.push(`${mod} ${seed} in ${location}`);
    });
  });

  return baseQueries.map(q => {
    const analysis = analyzeQuery(q);
    return {
      keyword: q,
      grammar: analysis.grammar,
      intent: manualIntent === "auto" ? analysis.intent : [manualIntent]
    };
  });
}

/* =========================
   6. TOOL-2: CONTENT EXTRACTOR
   Grammar-Aware
========================= */

function extractFromContent(seed, text) {
  seed = seed.toLowerCase();
  let results = [];

  const sentences = text.replace(/\n+/g," ").split(/[.!?]+/);

  sentences.forEach(sentence => {
    const words = sentence
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g,"")
      .split(/\s+/)
      .filter(Boolean);

    const idx = words.indexOf(seed);
    if (idx === -1) return;

    let phrase = [];

    /* LEFT: adjective modifiers */
    for (let i = idx - 1; i >= 0; i--) {
      if (STOP_WORDS.includes(words[i])) break;
      phrase.unshift(words[i]);
      if (phrase.length >= 3) break;
    }

    /* SEED */
    phrase.push(seed);

    /* RIGHT: noun + preposition logic */
    let prepUsed = false;
    for (let i = idx + 1; i < words.length; i++) {
      const w = words[i];
      if (STOP_WORDS.includes(w) && !PREPOSITIONS.includes(w)) break;
      phrase.push(w);
      if (PREPOSITIONS.includes(w)) prepUsed = true;
      if (prepUsed && phrase.length >= 7) break;
      if (!prepUsed && phrase.length >= 5) break;
    }

    let finalPhrase = phrase.join(" ").trim();
    const lastWord = finalPhrase.split(" ").pop();
    if (PREPOSITIONS.includes(lastWord)) return;

    const analysis = analyzeQuery(finalPhrase);
    results.push({
      keyword: finalPhrase,
      grammar: analysis.grammar,
      intent: analysis.intent
    });
  });

  return results;
}

/* =========================
   7. GLOBAL EXPORT (SAFE)
========================= */

window.KeywordArchitectPro = {
  analyzeQuery,
  analyzeIntent,
  buildQueries,
  extractFromContent
};
