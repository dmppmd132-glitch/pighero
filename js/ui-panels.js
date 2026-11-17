/* ===== 畫面改善：技能樹（六角蜂巢）與背包／角色介面 ===== */
const G9={open:null,sel:null,tab:"all",msg:"",cf:null,skn:"c"};
const esc9=t=>String(t).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const JOBI9={knight:"🛡️",mage:"🔮",priest:"✨",assassin:"🗡️",berserker:"🪓",archer:"🏹",summoner:"📜",samurai:"⚔️"};
const RARC9=["#8a6840","#4a7fb5","#8a57c4","#b8820a"],SL9={weapon:"武器",armor:"防具",acc:"飾品"},SI9={weapon:"🗡️",armor:"🥋",acc:"💍"};
function ic9(it){const n=it.n;return/劍|刀/.test(n)?"🗡️":/鎧|盔|盾/.test(n)?"🛡️":/甲|衣|袍/.test(n)?"🥋":/戒/.test(n)?"💍":/鍊|鏈/.test(n)?"📿":/符/.test(n)?"🧿":/章/.test(n)?"🏅":SI9[it.s]||"📦"}
function ui9close(){const o=document.getElementById("ui9");if(o)o.remove();G9.open=null}
function ui9mount(kind){let o=document.getElementById("ui9");if(!o||G9.open!==kind){ui9close();o=document.createElement("div");o.id="ui9";o.className="ui9";o.addEventListener("click",ui9click);document.body.appendChild(o)}G9.open=kind;ui9render()}
function ui9render(){const o=document.getElementById("ui9");if(!o)return;o.innerHTML=G9.open==="sk"?sk9():inv9()}
function act9(fn,snd){say("");fn();G9.msg=$("message").textContent.split("\n").filter(Boolean).slice(0,2).join(" ");if(snd)sfx8(snd);ui9render()}
function ui9click(e){const t=e.target;if(t&&t.id==="ui9"){ui9close();return}const b=t&&t.closest&&t.closest("[data-act]");if(!b)return;const a=b.dataset.act,id=+b.dataset.id;
if(a==="close")return ui9close();
if(a==="tab"){G9.tab=b.dataset.tab;G9.cf=null;G9.msg="";return ui9render()}
if(a==="sel"){G9.sel=id;G9.cf=null;G9.msg="";return ui9render()}
if(a==="skn"){G9.skn=b.dataset.k;G9.msg="";return ui9render()}
if(a==="job"){ui9close();return jobMenu()}
if(a==="learn"){const nm=b.dataset.k;const ok=learnTreeSkill(nm);G9.msg=ok?"✨ 習得「"+nm+"」！":($("message").textContent||"無法學習此技能").split("\n")[0];if(ok)sfx8("chest");return ui9render()}
if(a==="promo")return act9(()=>promoteTo(b.dataset.k),"lvl");
if(a==="do"){const d=b.dataset.do;if(d==="sell"&&G9.cf!==id){G9.cf=id;return ui9render()}G9.cf=null;if(d==="equip")act9(()=>equipItem(id));else if(d==="enh")act9(()=>enhance(id));else if(d==="sell")act9(()=>sellItem(id));else if(d==="unequip")act9(()=>unequip(b.dataset.slot))}}
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&G9.open)ui9close()});
/* --- 背包／角色 --- */
function cell9(it){return`<button class="cell9 r${it.rar}${G9.sel===it.id?" on":""}" data-act="sel" data-id="${it.id}" title="${esc9(itemDesc(it))}"><span>${ic9(it)}</span>${it.lv?`<i>+${it.lv}</i>`:""}</button>`}
function inv9(){ensureEq();const eq=p.equip,items=p.inv.filter(x=>G9.tab==="all"||x.s===G9.tab),f=G9.sel!=null?findItem(G9.sel):null;if(!f)G9.sel=null;
const slot=s=>`<div class="slw9">${eq[s]?cell9(eq[s]):`<div class="cell9 empty">${SI9[s]}</div>`}<small>${SL9[s]}</small></div>`;
let det;if(f){const it=f.it,bag=f.at==="bag",cur=eq[it.s],cost=enhCost(it),maxed=it.lv>=MAX_ENH;let cmp="";if(bag&&cur){if(cur.st===it.st){const d=itemVal(it)-itemVal(cur);cmp=d>0?` <b style="color:#2e8b3e">▲${d}</b>`:d<0?` <b style="color:#c0392b">▼${-d}</b>`:" ＝"}else cmp="（屬性與目前裝備不同）"}
det=`<div class="nm9" style="color:${RARC9[it.rar]}">${esc9(itemName(it))} <small>［${RAR[it.rar]}］</small></div><div>${STAT_N[it.st]} +${itemVal(it)}${cmp}｜${bag?"背包":"已裝備"}</div><div class="sm9">強化：${maxed?"已達上限":cost+" G，成功率 "+Math.round(enhRate(it)*100)+"%"}${bag?"｜出售 "+sellPrice(it)+" G":""}</div><div class="btns9">${bag?`<button class="b9 g" data-act="do" data-do="equip" data-id="${it.id}">裝備</button>`:`<button class="b9" data-act="do" data-do="unequip" data-id="${it.id}" data-slot="${f.at}">卸下</button>`}<button class="b9" data-act="do" data-do="enh" data-id="${it.id}" ${maxed||p.gold<cost?"disabled":""}>強化</button>${bag?`<button class="b9 r" data-act="do" data-do="sell" data-id="${it.id}">${G9.cf===it.id?"⚠️ 再按確認出售":"出售"}</button>`:""}</div>`}
else det=`<div class="sm9">點選物品查看詳情。稀有以上裝備只能靠戰鬥掉落，商店販售普通品質裝備。</div>`;
const cells=items.map(cell9).join("")+Array.from({length:Math.max(0,BAG_MAX-items.length)},()=>'<div class="cell9 empty"></div>').join("");
const tabs=[["all","🎒"],["weapon","🗡️"],["armor","🥋"],["acc","💍"]].map(x=>`<button class="tab9${G9.tab===x[0]?" on":""}" data-act="tab" data-tab="${x[0]}" aria-label="${x[0]}">${x[1]}</button>`).join("");
return`<div class="wrap9"><section class="pn9"><div class="hd9">⭐ 角色<button class="x9 b9" data-act="close" aria-label="關閉">✕</button></div><div class="inner9"><div class="who9">${esc9(p.name)}｜${esc9(p.job)} Lv.${p.lv}</div><div class="doll9">${slot("armor")}<div class="hero9">🐷</div><div class="slw9 col">${slot("weapon")}${slot("acc")}</div></div><div class="st9"><span>⚔️ ${effectiveAtk()}</span><span>🛡️ ${effectiveDef()}</span><span>❤️ ${p.hp}/${p.maxHp}</span><span>💧 ${p.mp}/${p.maxMp}</span></div><div class="st9"><span>🪙 ${p.gold}</span><span>🧪 ${p.potions}</span></div></div></section><section class="pn9"><div class="hd9">🎒 物品欄 <span class="cnt9">${p.inv.length}/${BAG_MAX}</span></div><div class="inner9"><div class="invbody9"><div class="grid9">${cells}</div><div class="tabs9">${tabs}</div></div><div class="det9">${G9.msg?`<div class="msg9">${esc9(G9.msg)}</div>`:""}${det}</div></div></section></div>`}
/* --- 技能樹（六角蜂巢） --- */
function sk9(){ensureEq();const key=p.jobKey||"knight",J=JOBS[key],tree=SKILL_TREES[key],L=p.learnedSkills||{},SP=p.skillPoints||0,promos=PROMOTIONS[key]||[],S=34,
P=(q,r)=>[S*1.7320508*(q+r/2),S*1.5*r],HP=(cx,cy,rad)=>[0,1,2,3,4,5].map(k=>{const a=(60*k+30)*Math.PI/180;return(cx+rad*Math.cos(a)).toFixed(1)+","+(cy+rad*Math.sin(a)).toFixed(1)}).join(" "),
LA=[[-1,0],[-2,0],[-2,1],[-3,0],[-3,1],[-3,2],[-1,1],[-2,2]],RP=[[1,0],[2,0],[2,-1],[3,0],[1,-1],[2,-2]],RR=[[3,-1],[3,-2]];
const nodes=[{id:"c",ty:"core",nm:J.name,ic:JOBI9[key]||"🐷",q:0,r:0,on:true}];let ai=0,pi=0;
tree.forEach(s=>{const on=!!L[key+":"+s[0]],req=skillPrereq(key,s[0]);if(s[1]==="active"){const ix=ai++,pos=LA[ix%LA.length];nodes.push({id:"a"+ix,ty:"act",s,nm:s[0],ic:s[3]>0?"⚔️":"🌀",q:pos[0],r:pos[1],t:ix+1,on,req,prev:ix?"a"+(ix-1):"c",can:!on&&SP>=1&&(!req||!!L[key+":"+req])})}else{const ix=pi++,pos=RP[ix%RP.length];nodes.push({id:"p"+ix,ty:"pas",s,nm:s[0],ic:"🔰",q:pos[0],r:pos[1],t:ix+1,on,req,prev:ix?"p"+(ix-1):"c",can:!on&&SP>=1&&(!req||!!L[key+":"+req])})}});
promos.forEach((x,i)=>{const pos=RR[i%2],on=p.promotionKey===x[0];nodes.push({id:"r"+i,ty:"pro",pr:x,nm:x[0],ic:"👑",q:pos[0],r:pos[1],t:"Lv10",on,can:!p.promotionKey&&p.lv>=10&&SP>=3})});
const dist=(a,b)=>{const dq=a.q-b.q,dr=a.r-b.r;return(Math.abs(dq)+Math.abs(dr)+Math.abs(dq+dr))/2},occ={};nodes.forEach(n=>occ[n.q+","+n.r]=1);
let bd="";for(let q=-4;q<=4;q++)for(let r=-3;r<=3;r++){if(occ[q+","+r])continue;const c=P(q,r);if(Math.abs(c[0])>225||Math.abs(c[1])>125)continue;bd+=`<polygon class="bd9" points="${HP(c[0],c[1],S-2)}"/>`}
let lines="";nodes.forEach((n,i)=>{if(!i)return;const j=n.prev?nodes.findIndex(m=>m.id===n.prev):-1;if(j<0)return;const m=nodes[j],a=P(n.q,n.r),b=P(m.q,m.r);lines+=`<line x1="${a[0].toFixed(1)}" y1="${a[1].toFixed(1)}" x2="${b[0].toFixed(1)}" y2="${b[1].toFixed(1)}" class="ln9${n.on&&m.on?" lit":""}"/>`});
const sel=nodes.find(n=>n.id===G9.skn)||nodes[0];
const hx=nodes.map(n=>{const c=P(n.q,n.r),x=c[0].toFixed(1),y=c[1],locked=n.ty!=="core"&&!n.on&&n.req&&!L[key+":"+n.req],tip=n.on?"已學習":locked?`先學會「${n.req}」`:SP<1?"需要技能點":"可以學習";return`<g data-act="skn" data-k="${n.id}" aria-label="${esc9(n.nm)}"><title>${esc9(tip)}</title><polygon class="hx9 ${n.ty} ${n.on?"on":"off"}${locked?" locked":""}${n.can?" can":""}${n===sel?" sel":""}" points="${HP(c[0],y,S-2)}"/><text class="ic9t" x="${x}" y="${(y+2).toFixed(1)}">${locked?"🔒":n.ic}</text><text class="nm9t" x="${x}" y="${(y+16).toFixed(1)}">${esc9(n.nm.slice(0,5))}</text>${n.t?`<text class="nu9t ${n.ty}" x="${(c[0]-18).toFixed(1)}" y="${(y-14).toFixed(1)}">${n.t}</text>`:""}${locked?`<text class="req9t" x="${x}" y="${(y+27).toFixed(1)}">前置</text>`:""}${n.on&&n.ty!=="core"?`<text class="ck9t" x="${(c[0]+19).toFixed(1)}" y="${(y-14).toFixed(1)}">✓</text>`:""}</g>`}).join("");
const bt=h=>`<div class="btns9">${h}</div>`;let d;
if(sel.ty==="core")d=`<div class="nm9">${JOBI9[key]||""} ${esc9(J.name)}${p.promotionKey?" → "+esc9(p.promotionKey):""}</div><div>${esc9(J.desc||"")}</div><div class="sm9">專屬技能：${esc9(J.skill)}（${J.cost} MP）｜被動：${esc9(J.passive)}（${esc9(J.passiveDesc)}）</div>`+bt(`<button class="b9 g" data-act="job">🔁 切換職業</button>`);
else if(sel.ty==="pro"){const x=sel.pr;d=`<div class="nm9" style="color:#9a6b00">👑 ${esc9(x[0])}</div><div>${esc9(x[3])}</div><div class="sm9">永久加成：${esc9(x[1])} +${x[2]}｜需求 Lv.10、3 技能點</div>`+bt(sel.on?`<button class="b9" disabled>✓ 已轉職</button>`:`<button class="b9 g" data-act="promo" data-k="${esc9(x[0])}" ${sel.can?"":"disabled"}>進階轉職（3 點）</button>`)+(!sel.on&&!sel.can?`<div class="sm9">${p.promotionKey?"已完成進階轉職。":p.lv<10?"尚未達到 Lv.10。":"技能點不足。"}</div>`:"")}
else{const s=sel.s,b=TREE_B[s[0]],act=s[1]==="active",req=sel.req,blocked=req&&!L[key+":"+req];d=`<div class="nm9">${sel.ic} ${esc9(s[0])} <small>［${act?"主動":"被動"}］</small></div><div>${act?`消耗 ${s[2]} MP｜${s[3]>0?"效果倍率 ×"+s[3]:"輔助／特殊效果"}`:(b?`${STAT_N[b[0]]} +${b[1]}`:"戰鬥中自動生效的被動強化")}</div>${req?`<div class="sm9">前置技能：${esc9(req)}${blocked?"（尚未學習）":"（已學習）"}</div>`:""}`+bt(sel.on?`<button class="b9" disabled>✓ 已學習</button>`:`<button class="b9 g" data-act="learn" data-k="${esc9(s[0])}" ${SP>=1&&!blocked?"":"disabled"}>${blocked?"🔒 尚未解鎖":"學習（1 點）"}</button>`)+(!sel.on&&blocked?`<div class="sm9">請先學會「${esc9(req)}」，才能解鎖這個格子。</div>`:!sel.on&&SP<1?`<div class="sm9">技能點不足，升級可獲得技能點。</div>`:"")}
return`<div class="wrap9" style="grid-template-columns:1fr"><section class="pn9"><div class="hd9">🌟 技能樹｜${esc9(p.job)}<span class="sp9"></span><span class="chip9">Lv.${p.lv}</span><span class="chip9">⭐ 技能點 ${SP}</span><button class="x9 b9" data-act="close" aria-label="關閉">✕</button></div><svg viewBox="-250 -150 500 300" role="img" aria-label="技能樹">${bd}${lines}${hx}</svg><div class="lg9"><span>🟧 主動</span><span>🟪 被動</span><span>🟨 進階轉職</span><span>⚪ 閃爍＝可學習</span></div><div class="inner9 det9">${G9.msg?`<div class="msg9">${esc9(G9.msg)}</div>`:""}${d}</div></section></div>`}
/* --- 掛接原有選單 --- */
equipMenu=function(){if(inBattle)return;ensureEq();G9.msg="";ui9mount("inv")};
bagMenu=function(){equipMenu()};
slotMenu=function(s){if(inBattle)return;ensureEq();G9.sel=p.equip[s]?p.equip[s].id:null;ui9mount("inv")};
itemMenu=function(id){if(inBattle)return;G9.sel=id;ui9mount("inv")};
skillMenu=function(){if(inBattle)return;ensureEq();G9.msg="";G9.skn="c";ui9mount("sk")};
