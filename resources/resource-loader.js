(async()=>{
  const root=document.documentElement;
  const title=root.dataset.resourceTitle||document.title||"学习资源";
  const files=(root.dataset.resourceFiles||"").split(",").map(x=>x.trim()).filter(Boolean);
  const box=document.getElementById("loading");
  try{
    if(!files.length) throw new Error("未配置资源文件");
    if(typeof DecompressionStream==="undefined") throw new Error("当前浏览器不支持 DecompressionStream");
    const parts=await Promise.all(files.map(async p=>{
      const r=await fetch(p,{cache:"no-store"});
      if(!r.ok) throw new Error(`资源加载失败：${p} (${r.status})`);
      return r.text();
    }));
    const b64=parts.join("").replace(/\s+/g,"");
    const bin=atob(b64);
    const bytes=new Uint8Array(bin.length);
    for(let i=0;i<bin.length;i++) bytes[i]=bin.charCodeAt(i);
    const stream=new Blob([bytes]).stream().pipeThrough(new DecompressionStream("gzip"));
    const text=await new Response(stream).text();
    document.open();
    document.write(text);
    document.close();
  }catch(e){
    if(box){
      box.innerHTML=`<h1>${title}</h1><p class="muted">页面加载失败。请使用较新的 Chrome / Edge / Safari 浏览器后重试。</p><pre>${String(e)}</pre><p><a href="../index.html">← 返回学习主页</a></p>`;
    }
    console.error(e);
  }
})();
