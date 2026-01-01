/**
 * Keyword Architect Pro - Core Logic
 * Includes: Semantic Mixing and Natural Language Extraction
 */

let currentMode = 'mix';

/**
 * Switches between Mixer and Extractor modes
 */
function switchTab(mode) {
    currentMode = mode;
    // UI Logic: Update Tab Classes
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    if (event && event.target) {
        event.target.classList.add('active');
    }
    
    // UI Logic: Toggle Visibility
    const mixUI = document.getElementById('mix-ui');
    const extractUI = document.getElementById('extract-ui');
    if(mixUI && extractUI) {
        mixUI.style.display = mode === 'mix' ? 'block' : 'none';
        extractUI.style.display = mode === 'extract' ? 'block' : 'none';
    }
}

/**
 * Main Controller function
 */
function runTool() {
    if (currentMode === 'mix') {
        generateMix();
    } else {
        extractKeywords();
    }
}

/**
 * PSYCHOLOGY + GRAMMAR MIXER
 * Follows "Adjective-Noun-Location" syntax
 */
function generateMix() {
    const headVal = document.getElementById('seeds').value;
    const modVal = document.getElementById('mods').value;
    
    if (!headVal || !modVal) {
        alert("Please enter Head terms and Modifiers.");
        return;
    }

    const heads = headVal.split(',').map(s => s.trim()).filter(s => s);
    const mods = modVal.split(',').map(s => s.trim()).filter(s => s);
    let results = [];

    heads.forEach(h => {
        mods.forEach(m => {
            // Grammatical Logic: Detect Places for 'in' vs Attributes for 'for'
            const isPlace = /london|nyc|ny|city|india|usa|texas|miami|uk/i.test(m);
            let prep = isPlace ? 'in' : 'for';
            if (m.toLowerCase().includes('near me')) prep = ''; // 'near me' acts as its own prep

            // Push variations based on Search Psychology
            results.push(`${m} ${h}`);              // Trigger + Core
            results.push(`${h} ${prep} ${m}`);      // Core + Context
            results.push(`best ${h} ${prep} ${m}`); // High Intent Triple
        });
    });
    showResult(results);
}

/**
 * SEMANTIC EXTRACTOR
 * Scans text for seed context using N-Gram windows
 */
function extractKeywords() {
    const seed = document.getElementById('target-seed').value.trim().toLowerCase();
    const text = document.getElementById('para-input').value;
    
    if (!seed || !text) {
        alert("Please provide both a Target Seed and Text to scan.");
        return;
    }

    // Grammar-aware split: break into sentences to maintain semantic boundaries
    const sentences = text.split(/[.!?]+/);
    let foundPhrases = [];

    sentences.forEach(sentence => {
        if (sentence.toLowerCase().includes(seed)) {
            Co


nst words = sentence.trim().split(/\s+/);
            // Find index of seed word while ignoring punctuation
            const index = words.findIndex(w => w.toLowerCase().replace(/[^a-z]/g, '') === seed);
            
            if (index !== -1) {
                // Psychology: Grab 2 words before and after (The Context Window)
                let start = Math.max(0, index - 2);
                let end = Math.min(words.length, index + 3);
                
                let phrase = words.slice(start, end).join(' ');
                // Clean punctuation for SEO keyword use
                foundPhrases.push(phrase.replace(/[^\w\s]/gi, '').trim());
            }
        }
    });
    showResult(foundPhrases);
}

/**
 * Display and Deduplicate results
 */
function showResult(arr) {
    const output = document.getElementById('output');
    const resultArea = document.getElementById('result-area');
    
    // Psychology: Users want unique, non-repetitive results
    const unique = [...new Set(arr)];
    
    output.value = unique.join('\n');
    resultArea.style.display = 'block';
}

/**
 * Clipboard functionality
 */
function copyResult() {
    const textArea = document.getElementById('output');
    textArea.select();
    document.execCommand('copy');
    alert("Keywords copied to clipboard!");
}
