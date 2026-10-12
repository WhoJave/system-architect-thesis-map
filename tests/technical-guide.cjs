const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const models=require(path.join(root,'technical-guide.js'));
// The same event must affect the ledger once with idempotency, repeatedly without it.
for(const protectedMode of [true,false]){let state={deliveries:0,effects:0};for(let n=0;n<10;n++)state=models.deliver(state,protectedMode);assert.equal(state.deliveries,10);assert.equal(state.effects,protectedMode?1:10);}
// Growing compute must not promise capacity beyond the database budget.
assert.equal(models.capacity(2).total,200);assert.equal(models.capacity(4).total,350);assert.equal(models.capacity(10).total,350);
// A lost response must preserve success at the bank and uncertainty internally.
const pending=models.payment.find(s=>s.internal==='待确认');assert.ok(pending);assert.equal(pending.bank,'已成功');assert.equal(models.payment.at(-1).internal,'已完成记账');assert.ok(!models.payment.some(s=>s.internal==='确定失败'));
const data=JSON.parse(fs.readFileSync(path.join(root,'data/technical-guide.json'),'utf8'));
const html=fs.readFileSync(path.join(root,'resources/architecture-terms.html'),'utf8');
const cardIds=new Set(data.cards.map(c=>c.id));assert.equal(cardIds.size,data.cards.length);
const groupIds=new Set(data.groups.map(g=>g.id));
for(const c of data.cards){assert.ok(groupIds.has(c.group));assert.ok(html.includes(`class="lesson" id="${c.id}"`));assert.ok(html.includes(`id="diagram-${c.id}"`));assert.ok(c.definition&&c.analogy&&c.case&&c.boundary&&c.writing&&c.recall&&c.answer);assert.ok(c.details.length>=3);for(const s of c.stages)assert.ok(s.label&&s.note);for(const ref of c.sources)assert.ok(data.sources[ref]);}
assert.equal((html.match(/<svg /g)||[]).length,data.cards.length);
const aliases=new Set(data.cards.flatMap(c=>c.aliases));
for(const term of ['幂等','Outbox','TCC','Saga','CAP','Cache-Aside','ACK','Partition','限界上下文','聚合根','HPA','RAG','Chunk','Embedding','Rerank','ReAct','Tool Calling','Human-in-the-loop'])assert.ok(aliases.has(term),term);
console.log('Passed: duplicate delivery, uncertain payment, capacity bottleneck; lesson references, diagrams and topic coverage.');
