const content=document.getElementById('content');
const sidebar=document.getElementById('sidebar');
const overlay=document.getElementById('overlay');
const menu=document.getElementById('menuBtn');
const input=document.getElementById('searchInput');
const status=document.getElementById('searchStatus');
let mermaid;
const diagrams=[];
function theme(mode){document.documentElement.classList.toggle('light',mode==='light');try{localStorage.setItem('thesis-theme',mode);}catch{}}
try{theme(localStorage.getItem('thesis-theme')||'dark');}catch{theme('dark');}
function closeMenu(){sidebar.classList.remove('open');overlay.classList.remove('show');menu.setAttribute('aria-expanded','false');}
menu.addEventListener('click',()=>{sidebar.classList.add('open');overlay.classList.add('show');menu.setAttribute('aria-expanded','true');});
overlay.addEventListener('click',closeMenu);
sidebar.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.getElementById('themeToggle').addEventListener('click',()=>{theme(document.documentElement.classList.contains('light')?'dark':'light');if(mermaid)renderDiagrams();});
async function renderDiagrams(){
 mermaid.initialize({startOnLoad:false,theme:document.documentElement.classList.contains('light')?'default':'neutral',securityLevel:'strict'});
 for(const {node,source} of diagrams){node.removeAttribute('data-processed');node.textContent=source;try{await mermaid.run({nodes:[node]});}catch{node.textContent=source;node.classList.add('diagram-fallback');}}
}
if(content){
 const toc=document.getElementById('toc');
 content.querySelectorAll('h1,h2,h3').forEach(h=>{if(h.tagName==='H3'&&!h.textContent.includes('图'))return;const a=document.createElement('a');a.href='#'+h.id;a.textContent=h.textContent;a.className='level-'+h.tagName.slice(1);a.addEventListener('click',closeMenu);toc.append(a);});
 // Static article and navigation stay available if the diagram CDN cannot load.
 content.querySelectorAll('pre > code.language-mermaid').forEach(code=>{const wrap=document.createElement('div');wrap.className='mermaid-wrap';const node=document.createElement('div');node.className='mermaid';node.textContent=code.textContent;wrap.append(node);code.parentElement.replaceWith(wrap);diagrams.push({node,source:node.textContent});});
 if(diagrams.length)import('https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs').then(m=>{mermaid=m.default;renderDiagrams();}).catch(()=>{diagrams.forEach(({node})=>node.classList.add('diagram-fallback'));});
}
input.addEventListener('input',()=>{
 const q=input.value.trim().toLowerCase();
 if(!content){let hits=0;document.querySelectorAll('.resource-link').forEach(a=>{a.hidden=!!q&&!a.textContent.toLowerCase().includes(q);if(!a.hidden)hits++;});document.querySelectorAll('.resource-group').forEach(g=>g.hidden=![...g.querySelectorAll('.resource-link')].some(a=>!a.hidden));status.hidden=!q;status.textContent=`找到 ${hits} 个学习入口`;return;}
 content.querySelectorAll('mark.search-hit').forEach(m=>m.replaceWith(document.createTextNode(m.textContent)));content.normalize();status.hidden=!q;if(!q)return;
 const walker=document.createTreeWalker(content,NodeFilter.SHOW_TEXT,{acceptNode:n=>n.parentElement.closest('.mermaid-wrap,script,style,pre,code')?NodeFilter.FILTER_REJECT:n.nodeValue.toLowerCase().includes(q)?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT});const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
 nodes.forEach(n=>{const i=n.nodeValue.toLowerCase().indexOf(q);const frag=document.createDocumentFragment();frag.append(n.nodeValue.slice(0,i));const mark=document.createElement('mark');mark.className='search-hit';mark.textContent=n.nodeValue.slice(i,i+q.length);frag.append(mark,n.nodeValue.slice(i+q.length));n.replaceWith(frag);});status.textContent=`找到 ${nodes.length} 处匹配`;content.querySelector('mark')?.scrollIntoView({block:'center'});
});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();if(e.key==='/'&&!e.target.closest('input,textarea')){e.preventDefault();input.focus();}});
// Preserve incoming links to the original long-page chapter anchors.
if(!content&&location.hash)location.replace('./knowledge-map.html'+location.hash);
