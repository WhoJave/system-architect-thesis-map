import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const config=JSON.parse(fs.readFileSync(path.join(root,'site-catalog.json'),'utf8'));
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
const external=url=>/^https:\/\//.test(url);
const items=config.groups.flatMap(g=>g.items);
const ids=new Set();
for(const item of items){
 if(ids.has(item.id))throw Error('Duplicate resource ID: '+item.id);ids.add(item.id);
 if(!external(item.url)&&(!/^[a-z0-9/-]+\.html$/.test(item.url)||!fs.existsSync(path.join(root,item.url))))throw Error('Invalid local page: '+item.url);
}
const href=(url,prefix)=>external(url)?url:prefix+url;
const attrs=item=>external(item.url)?' target="_blank" rel="noopener noreferrer"':'';
const nav=(file,prefix)=>`<nav class="sidebar-hub" aria-label="学习导航"><a href="${prefix}index.html"${file==='index.html'?' aria-current="page"':''}>学习主页</a>${config.groups.map(g=>`<div class="sidebar-hub-title">${esc(g.title)}</div>${g.items.map(i=>`<a href="${esc(href(i.url,prefix))}"${file===i.url?' aria-current="page"':''}${attrs(i)}>${esc(i.title)}</a>`).join('')}`).join('')}</nav>`;
const hub=`<section class="resource-hub"><div class="resource-groups">${config.groups.map((g,n)=>`<article class="resource-group"><span class="resource-kicker">${String(n+1).padStart(2,'0')}</span><h3>${esc(g.title)}</h3><p>${esc(g.description)}</p><div class="resource-links">${g.items.map(i=>`<a class="resource-link" href="${esc(href(i.url,'./'))}"${attrs(i)}><span>${esc(i.title)}</span><small>${esc(i.description)} →</small></a>`).join('')}</div></article>`).join('')}</div></section>`;
for(const filename of fs.readdirSync(root).filter(f=>f.endsWith('.html'))){const file=path.join(root,filename);let s=fs.readFileSync(file,'utf8');s=s.replace(/<!-- site-nav:start -->[\s\S]*?<!-- site-nav:end -->/,`<!-- site-nav:start -->${nav(filename,'./')}<!-- site-nav:end -->`);s=s.replace(/<!-- site-hub:start -->[\s\S]*?<!-- site-hub:end -->/,`<!-- site-hub:start -->${hub}<!-- site-hub:end -->`);fs.writeFileSync(file,s);}
// Standalone resources retain their own layouts and interactions.
for(const filename of [...items.filter(i=>!external(i.url)&&!fs.readFileSync(path.join(root,i.url),'utf8').includes('site-nav:start')).map(i=>i.url)]){
 const file=path.join(root,filename);const prefix=filename.includes('/')?'../':'./';let s=fs.readFileSync(file,'utf8');
 s=s.replace(/<script src="\.\.\/resource-nav\.js"><\/script>/g,'');
 const bar=`<!-- resource-nav:start --><nav class="site-resource-nav" aria-label="站点导航"><a href="${prefix}index.html">← 返回学习主页</a><details><summary>切换学习主题</summary><div>${config.groups.map(g=>`<strong>${esc(g.title)}</strong>${g.items.map(i=>`<a href="${esc(href(i.url,prefix))}"${attrs(i)}${i.url===filename?' aria-current="page"':''}>${esc(i.title)}</a>`).join('')}`).join('')}</div></details></nav><!-- resource-nav:end -->`;
 if(s.includes('<!-- resource-nav:start -->'))s=s.replace(/<!-- resource-nav:start -->[\s\S]*?<!-- resource-nav:end -->/,bar);else s=s.replace(/<body([^>]*)>/i,`<body$1>${bar}`);
 const css=`<link rel="stylesheet" href="${prefix}resource-nav.css">`;
 if(!s.includes('resource-nav.css'))s=s.replace('</head>',css+'</head>');fs.writeFileSync(file,s);
}
console.log(`Generated navigation for ${items.length} resources in ${config.groups.length} groups.`);
