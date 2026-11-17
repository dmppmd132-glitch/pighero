/* ===== 全域遊戲狀態 ===== */
// 此檔案刻意放在 equipment.js 之後，確保 applyJob 初始化時可使用裝備加成函式。
let p={name:"波波",job:"見習勇者",lv:1,xp:0,next:20,hp:40,maxHp:40,mp:12,maxMp:12,atk:8,def:3,gold:0,potions:2,jobKey:"knight",skillPoints:0,learnedPassives:{},learnedSkills:{},inv:[],equip:{weapon:null,armor:null,acc:null},iid:0};
applyJob("knight",true);
let enemy=null,turn="player",inBattle=false,quest=false,won=false,log=[];
