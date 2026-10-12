// Teaching models are pure functions; real payment and messaging protocols are more complex.
const GuideModels={
 deliver(state,idempotent){return {deliveries:state.deliveries+1,effects:state.effects+(idempotent&&state.effects>0?0:1)};},
 capacity(replicas){return {application:replicas*100,total:Math.min(replicas*100,350,500),bottleneck:replicas*100<350?'应用实例':'数据库预算'};},
 payment:[
  {bank:'尚未执行',internal:'已受理',note:'已记录稳定交易号 P001，准备发送。'},
  {bank:'已成功',internal:'处理中',note:'银行完成了转账，但响应还未可靠到达本系统。银行事实与调用方观察不同。'},
  {bank:'已成功',internal:'待确认',note:'等待超时：不能判断为确定失败，也不能生成新流水重复放款。保留待确认状态。'},
  {bank:'已成功',internal:'已确认成功',note:'按原流水查询银行权威结果，确认成功后完成内部状态迁移；回调和对账也可提供核验事实。'},
  {bank:'已成功',internal:'已完成记账',note:'以原业务流水幂等记账。银行只执行一笔，内部记录恢复对齐，异常有可追溯处置。'}
 ]
};
if(typeof module!=='undefined')module.exports=GuideModels;
if(typeof document!=='undefined'){
 const $=id=>document.getElementById(id);
 const lessons=[...document.querySelectorAll('.lesson')];let group='all';
 let understood=new Set();try{const list=JSON.parse(localStorage.getItem('architecture-terms-understood')||'[]');if(Array.isArray(list))understood=new Set(list);}catch{}
 function updateProgress(){lessons.forEach(c=>{const b=c.querySelector('.save-lesson');const done=understood.has(c.id);b.setAttribute('aria-pressed',String(done));b.textContent=done?'✓ 已理解':'○ 已理解';});$('understoodCount').textContent=`已理解 ${lessons.filter(c=>understood.has(c.id)).length} / ${lessons.length}`;try{localStorage.setItem('architecture-terms-understood',JSON.stringify([...understood]));}catch{}}
 updateProgress();
 lessons.forEach(c=>{
  c.querySelector('.save-lesson').addEventListener('click',()=>{understood.has(c.id)?understood.delete(c.id):understood.add(c.id);updateProgress();});
  c.querySelectorAll('[data-step]').forEach(b=>b.addEventListener('click',()=>{c.querySelectorAll('[data-step]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));c.querySelectorAll('[data-node]').forEach(n=>n.classList.toggle('is-active',n.dataset.node===b.dataset.step));c.querySelector('.step-caption').textContent=b.dataset.note;}));
  c.querySelector('.copy-essay').addEventListener('click',async e=>{try{await navigator.clipboard.writeText(c.querySelector('.essay-text').textContent);e.target.textContent='已复制';}catch{e.target.textContent='请选中文字复制';}});
 });
 function filter(){const q=$('termSearch').value.trim().toLowerCase();let total=0;lessons.forEach(c=>{c.hidden=(group!=='all'&&c.dataset.group!==group)||(!!q&&!c.textContent.toLowerCase().includes(q));if(!c.hidden)total++;});document.querySelectorAll('.lesson-group').forEach(s=>s.hidden=![...s.querySelectorAll('.lesson')].some(c=>!c.hidden));document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter===group)));$('termStatus').textContent=`显示 ${total} / ${lessons.length} 节讲解`;$('emptyResults').hidden=total>0;}
 document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{group=b.dataset.filter;filter();}));$('termSearch').addEventListener('input',filter);
 function reset(){group='all';$('termSearch').value='';filter();}$('clearFilter').addEventListener('click',reset);
 $('expandAll').addEventListener('click',()=>lessons.filter(c=>!c.hidden).forEach(c=>c.querySelector('.lesson-details').open=true));$('collapseAll').addEventListener('click',()=>lessons.forEach(c=>c.querySelector('.lesson-details').open=false));
 function openHash(){let id;try{id=decodeURIComponent(location.hash.slice(1));}catch{return;}const target=$(id);if(!target)return;reset();if(target.classList.contains('lesson'))target.querySelector('.lesson-details').open=true;requestAnimationFrame(()=>target.scrollIntoView({block:'start'}));}
 addEventListener('hashchange',openHash);if(location.hash)openHash();
 try{document.documentElement.classList.toggle('light',localStorage.getItem('thesis-theme')==='light');}catch{}
 $('guideTheme').addEventListener('click',()=>{const light=document.documentElement.classList.toggle('light');try{localStorage.setItem('thesis-theme',light?'light':'dark');}catch{}});
 let delivery={deliveries:0,effects:0};
 function resetDelivery(){delivery={deliveries:0,effects:0};$('deliveries').textContent=0;$('effects').textContent=0;$('deliveryExplain').textContent='同一事件 E001，业务效果从零开始。点击投递，然后模拟确认丢失再投递。';}
 $('redeliver').addEventListener('click',()=>{const idempotent=$('demoIdempotent').checked;delivery=GuideModels.deliver(delivery,idempotent);$('deliveries').textContent=delivery.deliveries;$('effects').textContent=delivery.effects;$('deliveryExplain').textContent=delivery.deliveries===1?'首次事件执行一次。现在假设业务提交后 ACK 丢失，下一次点击模拟 Broker 重投。':idempotent?'稳定事件 ID 被识别，重复投递复用原结果，业务入账保持一次。':'没有业务幂等，每次重投都再次入账；Broker 并不能替你撤销重复副作用。';});$('resetDelivery').addEventListener('click',resetDelivery);$('demoIdempotent').addEventListener('change',resetDelivery);
 let paymentStep=0;function payment(){const s=GuideModels.payment[paymentStep];$('bankState').textContent=s.bank;$('internalState').textContent=s.internal;$('paymentExplain').textContent=s.note;$('advancePayment').disabled=paymentStep===GuideModels.payment.length-1;}
 $('advancePayment').addEventListener('click',()=>{paymentStep=Math.min(paymentStep+1,GuideModels.payment.length-1);payment();});$('resetPayment').addEventListener('click',()=>{paymentStep=0;payment();});payment();
 function capacity(){const n=Number($('replicas').value);const s=GuideModels.capacity(n);$('replicaValue').value=n;$('appCapacity').value=s.application;$('appValue').textContent=s.application;$('totalCapacity').value=s.total;$('totalValue').textContent=s.total;$('capacityExplain').textContent=`当前瓶颈：${s.bottleneck}。${s.total===350?'继续增加应用实例不能突破数据库 350 请求/秒的预算。':'增加实例暂时可提高应用侧上限，但到数据库预算后会停止增长。'}`;}$('replicas').addEventListener('input',capacity);capacity();
}
