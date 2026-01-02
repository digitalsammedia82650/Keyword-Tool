
/* =====================================================
   GRAMMAR ENGINE
===================================================== */

const Grammar = {
    plural: (w) => w.endsWith('s') ? w : w + 's',
    article: (w) => /^[aeiou]/i.test(w) ? "an" : "a",
    
    blueprints: [
        (s) => `How to use ${Grammar.article(s)} ${s}`,
        (s) => `Best ${s} for professionals`,
        (s) => `Affordable ${Grammar.plural(s)} available online`,
        (s) => `Where to buy ${Grammar.article(s)} ${s}`,
        (s) => `Professional ${s} guide 2025`
    ]
};

/* ---- TOOL 1: QUERY BUILDER (MULTI-LOCATION) ---- */
function runQuery() {
    const seed = document.getElementById("seed").value.trim();
    const locInput = document.getElementById("location").value.trim();
    if (!seed) return alert("Enter a seed keyword");

    document.getElementById("preview-area").className = "kap-hidden";
    let locations = locInput ? locInput.split(',').map(l => l.trim()) : [""];
    let finalKeywords = [];

    locations.forEach(loc => {
        Grammar.blueprints.forEach(tpl => {
            let line = tpl(seed);
            if (loc) line += ` in ${loc}`;
            finalKeywords.push(line);
        });
        if(loc) finalKeywords.push(`${seed} near ${loc}`);
    });

    document.getElementById("output-text").value = finalKeywords.join("\n");
}

/* ---- TOOL 2: CONTENT EXTRACTOR (BOUNDARY LOGIC) ---- */
function runContent() {
    const seed = document.getElementById("content-seed").value.trim();
    const text = document.getElementById("content-input").value;
    if (!seed || !text) return alert("Enter keyword and content");

    document.getElementById("preview-area").className = "";

    /**
     * GRAMMAR LOGIC UPGRADE:
     * We split by:
     * 1. Newlines (\n) -> capturing headlines
     * 2. Punctuation (. ! ?) followed by space or end of string
     */
    const segments = text.split(/\n|(?<=[.!?])\s+/);
    
    let plainTextOutput = [];
    let htmlPreviewOutput = [];
    const seedRegex = new RegExp(`(${seed})`, 'gi');

    segments.forEach(seg => {
        let cleanSeg = seg.trim();
        if (!cleanSeg) return;

        if (cleanSeg.toLowerCase().includes(seed.toLowerCase())) {
            // Logic: It's a valid sentence/headline containing the seed
            plainTextOutput.push(cleanSeg);
            
            const highlighted = cleanSeg.replace(seedRegex, `<span class="highlight">$1</span>`);
            htmlPreviewOutput.push(`<div class="sentence-block">${highlighted}</div>`);
        }
    });

    document.getElementById("output-text").value = plainTextOutput.join("\n\n");
    document.getElementById("highlight-preview").innerHTML = htmlPreviewOutput.length 
        ? htmlPreviewOutput.join("") 
        : "No matches found.";
}

/* ---- UI ---- */
function kapSwitch(mode) {
    document.getElementById("tab-query").className = (mode === 'query' ? 'active' : '');
    document.getElementById("tab-content").className = (mode === 'content' ? 'active' : '');
    document.getElementById("kap-query").className = (mode === 'query' ? '' : 'kap-hidden');
    document.getElementById("kap-content").className = (mode === 'content' ? '' : 'kap-hidden');
    document.getElementById("output-text").value = "";
    document.getElementById("preview-area").className = "kap-hidden";
}

