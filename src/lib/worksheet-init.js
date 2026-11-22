// Behaviour of the DO, WHY, HOW worksheet page: builds the 10 format rows, works out the "x" multiplier,
// autosaves every field to this browser's localStorage, and handles "Copy my answers" and "Start over".
// Kept as the plain script from the standalone page so copy and logic edits port over directly.
export function initWorksheet() {
  const fwrapCheck = document.getElementById("formats");
  if (!fwrapCheck || fwrapCheck.dataset.ready) return; // React may run effects twice in development
  fwrapCheck.dataset.ready = "1";
  const KEY="dowhyhow-v1";
  const fwrap=document.getElementById("formats");
  for(let i=1;i<=10;i++){
    const r=document.createElement("div");r.className="frow";
    r.innerHTML=`<span class="i">${i}</span><input class="c-link" id="f${i}l" type="url" placeholder="Link" aria-label="Video ${i} link"><input class="c-fmt" id="f${i}f" type="text" placeholder="Format" aria-label="Video ${i} format"><input class="c-v" id="f${i}v" type="text" inputmode="numeric" placeholder="Views" aria-label="Video ${i} views"><input class="c-u" id="f${i}u" type="text" inputmode="numeric" placeholder="Usual" aria-label="Video ${i} usual views"><span class="mult" id="f${i}x"></span>`;
    fwrap.appendChild(r);
  }
  function num(s){if(!s)return NaN;s=String(s).trim().toLowerCase().replace(/,/g,"");const m=s.match(/^([\d.]+)\s*([km]?)/);if(!m)return NaN;let n=parseFloat(m[1]);if(m[2]==="k")n*=1e3;if(m[2]==="m")n*=1e6;return n}
  function mult(i){const v=num(document.getElementById(`f${i}v`).value),u=num(document.getElementById(`f${i}u`).value),el=document.getElementById(`f${i}x`);if(v>0&&u>0){const x=v/u;el.textContent=(x>=10?Math.round(x):x.toFixed(1))+"x";el.classList.toggle("hot",x>=5)}else{el.textContent="";el.classList.remove("hot")}}
  const fields=[...document.querySelectorAll(".wrap input, .wrap textarea:not(#copybox)")];
  function save(){const d={};fields.forEach(f=>d[f.id]=f.type==="checkbox"?f.checked:f.value);try{localStorage.setItem(KEY,JSON.stringify(d));setStatus("Saved in this browser.",true)}catch(e){setStatus("This browser won't save. Use Copy my answers before you leave.",false)}}
  function load(){try{const d=JSON.parse(localStorage.getItem(KEY)||"null");if(!d)return;fields.forEach(f=>{if(!(f.id in d))return;if(f.type==="checkbox")f.checked=!!d[f.id];else f.value=d[f.id]})}catch(e){}}
  let t;function setStatus(m,ok){const s=document.getElementById("status");s.textContent=m;s.classList.toggle("ok",!!ok);clearTimeout(t);if(ok)t=setTimeout(()=>{s.textContent="Your answers save as you type.";s.classList.remove("ok")},1800)}
  fields.forEach(f=>f.addEventListener(f.type==="checkbox"?"change":"input",()=>{const m=f.id.match(/^f(\d+)[vu]$/);if(m)mult(+m[1]);save()}));
  function v(id){return(document.getElementById(id).value||"").trim()}
  function summary(){
    const L=["DO → WHY → HOW Worksheet (Creative Mode)",""];
    const rows=[];for(let i=1;i<=10;i++){const l=v(`f${i}l`),f=v(`f${i}f`),a=v(`f${i}v`),u=v(`f${i}u`),x=document.getElementById(`f${i}x`).textContent;if(l||f||a||u)rows.push(`${i}. ${[l,f,a&&("views "+a),u&&("usual "+u),x].filter(Boolean).join(" | ")}`)}
    if(rows.length){L.push("MY 10 FORMATS",...rows,"")}
    L.push("THE VIDEO: "+[v("v-link"),v("v-views")&&("views "+v("v-views")),v("v-usual")&&("usual "+v("v-usual"))].filter(Boolean).join(" | "));
    L.push("DO: "+v("a-do"),"WHY: "+v("a-why"),"HOW:");["b1","b2","b3","b4"].forEach((b,i)=>{if(v(b))L.push(`  ${i+1}. ${v(b)}`)});
    L.push("","MY NICHE: "+v("niche"));["n1","n2","n3"].forEach((b,i)=>{if(v(b))L.push(`  ${i+1}. ${v(b)}`)});
    return L.join("\n");
  }
  document.getElementById("copy").addEventListener("click",()=>{
    const txt=summary();const box=document.getElementById("copybox");box.value=txt;
    const fallback=()=>{document.getElementById("copywrap").hidden=false;box.focus();box.select();setStatus("Select the text below and copy it.",false)};
    try{navigator.clipboard.writeText(txt).then(()=>setStatus("Copied. Paste it into Notes or anywhere.",true),fallback)}catch(e){fallback()}
  });
  let armed=false;const rb=document.getElementById("reset");
  rb.addEventListener("click",()=>{if(!armed){armed=true;rb.textContent="Tap again to clear";setTimeout(()=>{armed=false;rb.textContent="Start over"},3000);return}
    fields.forEach(f=>{if(f.type==="checkbox")f.checked=false;else f.value=""});for(let i=1;i<=10;i++)mult(i);armed=false;rb.textContent="Start over";save();setStatus("Cleared.",true)});
  load();for(let i=1;i<=10;i++)mult(i);
}
