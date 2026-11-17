/* ===== 分頁導覽與水彩地圖 ===== */
const TAB_ITEMS={
  adventure:[
    ["💬 和村長交談",()=>mapTalk("mayor")],
    ["🌿 前往村外探索",()=>mapMove(1)],
    ["🏪 商店",()=>mapTalk("shop")]
  ],
  status:[
    ["📜 角色狀態／裝備背包",showStatus],
    ["🛡️ 職業選擇",jobMenu],
    ["✨ 技能樹",skillMenu],
    ["🐷 夥伴與寵物",teamMenu]
  ],
  quests:[
    ["📖 主線劇情",storyLog],
    ["📜 任務日誌",questLog],
    ["🗺️ 地圖與 BOSS",areaMenu]
  ],
  settings:[
    ["💾 儲存進度",saveGame],
    ["📂 載入進度",loadGame],
    ["⚙️ 設定",g8Settings]
  ]
};
function switchTab(name){
  const items=TAB_ITEMS[name]||TAB_ITEMS.adventure;
  document.querySelectorAll(".tab-button").forEach(b=>b.classList.toggle("active",b.dataset.tab===name));
  const panel=$("tabPanel");
  if(!panel)return;
  panel.dataset.tab=name;
  panel.innerHTML="";
  items.forEach(([label,fn])=>{
    const b=document.createElement("button");
    b.className="tab-action"; b.type="button"; b.textContent=label; b.onclick=fn; panel.appendChild(b);
  });
}
function mapTalk(kind){
  if(inBattle)return;
  if(kind==="mayor"){p.loc=0;updateMapPlayer(0);townMenu();return}
  if(kind==="shop"){p.loc=0;updateMapPlayer(0);shopMenu();return}
  if(kind==="gardener"){say("園丁：「中央噴水池的水，來自北方的精靈泉。最近森林裡好像有奇怪的腳印……」");return}
  if(kind==="traveler"){say("旅人：「沿著石板路往外走吧！每一片森林，都藏著一段勇者故事。」");return}
  say("波波在地圖上眨了眨眼。點選地點就能前往探索，或從下方分頁查看冒險功能。");
}
function mapMove(index){
  if(inBattle)return;
  ensureEq();
  const a=p.area||0, point=REG[a]&&REG[a].L[index];
  if(!point||point[1]==="hidden"&&!p.w.hid[a]){say("這條路目前還沒有通往那裡。 ");return}
  goLoc(index);
  updateMapPlayer(index);
}
function updateMapPlayer(index){
  const player=$("hero"); if(!player)return;
  player.dataset.loc=String(index);
  player.classList.remove("at-village","at-field","at-forest","at-stone");
  player.classList.add(["at-village","at-field","at-forest","at-stone"][index]||"at-field");
}
function refreshMap(){
  const a=p&&p.area||0, reg=typeof REG!=="undefined"?REG[a]:null;
  const labels=["波波新手村","雜貨店","野花森林","草原小徑","遺跡"];
  document.querySelectorAll(".map-node .node-label").forEach((el,i)=>{el.textContent=labels[i]||el.textContent});
  updateMapPlayer(p&&p.loc||0);
}

/* 寶可夢式城鎮自由行走 */
let townPos={x:50,y:55};
let townFacing="down";
const TOWN_SPOTS=[
  {x:20,y:25,name:"村長家",action:()=>mapTalk("mayor")},
  {x:80,y:25,name:"雜貨店",action:()=>mapTalk("shop")},
  {x:34,y:48,name:"園丁",action:()=>mapTalk("gardener")},
  {x:66,y:48,name:"旅人",action:()=>mapTalk("traveler")}
];
function paintTownPlayer(){
  const player=$("hero"); if(!player)return;
  player.classList.remove("facing-down","facing-up","facing-left","facing-right");
  player.classList.add("facing-"+townFacing);
  player.style.left=townPos.x+"%"; player.style.top=townPos.y+"%";
  player.dataset.townX=Math.round(townPos.x); player.dataset.townY=Math.round(townPos.y);
}
function walkMap(dx,dy){
  if(inBattle)return;
  if(dx<0)townFacing="left"; else if(dx>0)townFacing="right"; else if(dy<0)townFacing="up"; else if(dy>0)townFacing="down";
  townPos.x=Math.max(10,Math.min(90,townPos.x+dx*6));
  townPos.y=Math.max(12,Math.min(88,townPos.y+dy*7));
  paintTownPlayer();
  const nearby=TOWN_SPOTS.find(s=>Math.abs(s.x-townPos.x)<9&&Math.abs(s.y-townPos.y)<10);
  if(nearby)say(`你來到「${nearby.name}」附近。再走近一點，或點擊地圖上的人物／建築互動。`);
  else say("波波在新手村的石板路上散步。探索看看吧！");
}
function walkMapTo(kind){
  const spot=TOWN_SPOTS.find(s=>kind==="mayor"?s.name==="村長家":kind==="shop"?s.name==="雜貨店":false);
  if(spot){townPos.x=spot.x;townPos.y=spot.y+10;paintTownPlayer();spot.action();}
}
function interactNearby(){
  const nearby=TOWN_SPOTS.find(s=>Math.abs(s.x-townPos.x)<10&&Math.abs(s.y-townPos.y)<11);
  if(nearby)nearby.action();else say("附近沒有可以互動的人物或建築。再走幾步看看吧！");
}
const _oldRefreshMap=refreshMap;
refreshMap=function(){_oldRefreshMap();paintTownPlayer()};
