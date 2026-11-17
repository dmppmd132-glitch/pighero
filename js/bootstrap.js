/* ===== 啟動入口 ===== */
// 所有資料、函式與全域狀態載入完成後才初始化畫面，避免模組順序造成未定義錯誤。
hud();
if(typeof refreshMap==="function")refreshMap();
if(typeof switchTab==="function")switchTab("adventure");
