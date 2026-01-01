/* =====================================================
   KEYWORD ARCHITECT PRO – LIGHT ENGINE
   Blogger-Safe | DOM-Driven Dictionaries
===================================================== */

function readList(id){
  const obj={};
  document.querySelectorAll(`#${id} li`).forEach(li=>{
    const key=li.getAttribute("data-key");
    const values=li.textContent
      .toLowerCase().split(",")
      .map(v=>v.trim()).filter(Boolean);
    obj[key]=values;
  });
  return obj;
}

function analyzeIntent(query){
  const dict=readList("kap-intents");
  query=query.toLowerCase();
  let hits=[];
  for(const k in dict){
    if(dict[k].some(w=>query.includes(w))) hits.push(k);
  }
  return hits.length?hits:["General"];
}

function analyzeQuery(query){
  const grammar=readList("kap-grammar");
  let gHits=[];
  for(const g in grammar){
    if(grammar[g].some(w=>query.split(" ").includes(w))) gHits.push(g);
  }
  return{query,grammar:gHits,intent:analyzeIntent(query)};
}

function buildQueries(seed,location="",manualIntent="auto"){
  const intents=readList("kap-intents");
  let out=[];
  for(const i in intents){
    intents[i].forEach(m=>{
      let q=`${m} ${seed}`;
      if(location) q+=` in ${location}`;
      const a=analyzeQuery(q);
      out.push({
        keyword:q,
        grammar:a.grammar,
        intent:manualIntent==="auto"?a.intent:[manualIntent]
      });
    });
  }
  return out;
}

function extractFromContent(seed,text){
  seed=seed.toLowerCase();
  return text.split(/[.!?]/).filter(s=>s.toLowerCase().includes(seed))
    .map(s=>{
      const a=analyzeQuery(s.toLowerCase());
      return{keyword:s.trim(),intent:a.intent,grammar:a.grammar};
    });
}

window.KeywordArchitectPro={
  analyzeQuery,
  analyzeIntent,
  buildQueries,
  extractFromContent
};
