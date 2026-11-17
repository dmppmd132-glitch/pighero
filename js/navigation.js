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
  const labels=["村長家","草原小徑","野花森林","古老石碑"];
  document.querySelectorAll(".node-label").forEach((el,i)=>{if(reg&&reg.L[i])el.textContent=reg.L[i][0]||labels[i]});
  updateMapPlayer(p&&p.loc||0);
}
