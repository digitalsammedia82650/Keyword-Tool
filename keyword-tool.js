/* ==========================================
   KEYWORD ARCHITECT PRO – CORE ENGINE
   POS-STYLE NOUN CHUNKING + SEO LOGIC
========================================== */

let selectedIntent = "auto";

/* ===== CONFIG ===== */

const STOP_WORDS = [
  "and","or","but","if","while","because",
  "a","an","the","this","that","these","those",
  "is","are","was","were","be","been","being",
  "of","from","by","as"
];

const PREPOSITIONS = ["for","in","to","near","with","without","on","at"];

const INTENT_TRIGGERS = {
  commercial: ["best","buy","cheap","price","pricing","review","top","vs"],
  informational: ["how","what","why","guide","tips","learn","examples"],
  local: ["near","near me","in"]
};

/* ===== UI ===== */

function setIntent(intent,btn){
    selectedIntent = intent;
    document.querySelectorAll(".intent-bar button")
        .forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
}

/* ===== HELPERS ===== */

function detectIntentAuto(phrase){
    for(const type in INTENT_TRIGGERS){
        if(INTENT_TRIGGERS[type].some(w => phrase.includes(w))){
            return type;
        }
    }
    return "general";
}

function clean(str){
    return str.replace(/\s+/g," ").trim();
}

/* ===== CORE EXTRACTION ===== */

function extractKeywords(){

    const seed = document.getElementById("seed").value.trim().toLowerCase();
    const text = document.getElementById("content").value;
    const manualLoc = document.getElementById("manualLocation").value.trim().toLowerCase();

    if(!seed || !text){
        alert("Seed keyword and content are required.");
        return;
    }

    const sentences = text
        .replace(/\n+/g," ")
        .split(/[.!?]+/);

    let results = [];

    sentences.forEach(sentence => {

        const words = sentence
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g," ")
            .split(/\s+/)
            .filter(Boolean);

        const seedIndex = words.indexOf(seed);
        if(seedIndex === -1) return;

        let phrase = [];

        /* ==== LEFT (Adjectives / Modifiers) ==== */
        for(let i = seedIndex - 1; i >= 0; i--){
            if(STOP_WORDS.includes(words[i])) break;
            phrase.unshift(words[i]);
            if(phrase.length >= 3) break;
        }

        /* ==== SEED ==== */
        phrase.push(seed);

        /* ==== RIGHT (Grammar-Safe Expansion) ==== */
        let usedPrep = false;

        for(let i = seedIndex + 1; i < words.length; i++){
            const w = words[i];

            if(STOP_WORDS.includes(w) && !PREPOSITIONS.includes(w)) break;

            phrase.push(w);

            if(PREPOSITIONS.includes(w)){
                usedPrep = true;
                continue;
            }

            if(usedPrep && phrase.length >= 7) break;
            if(!usedPrep && phrase.length >= 5) break;
        }

        let finalPhrase = clean(phrase.join(" "));
        const lastWord = finalPhrase.split(" ").slice(-1)[0];

        if(PREPOSITIONS.includes(lastWord)) return;
        if(finalPhrase.length <= seed.length) return;

        /* ==== LOCATION (AUTO + MANUAL) ==== */
        if(manualLoc && !finalPhrase.includes(manualLoc)){
            finalPhrase += " in " + manualLoc;
        }

        /* ==== INTENT ==== */
        const intent =
            selectedIntent === "auto"
            ? detectIntentAuto(finalPhrase)
            : selectedIntent;

        results.push(finalPhrase + (intent !== "general" ? ` [${intent}]` : ""));
    });

    /* ==== DEDUPLICATE ==== */
    const unique = [...new Set(results)];

    document.getElementById("output").value = unique.join("\n");
}
