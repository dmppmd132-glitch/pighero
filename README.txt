豬豬勇者傳說 PWA 套件
====================
1. 把本資料夾所有檔案（index.html、manifest.webmanifest、sw.js、三張圖示）放到同一層，上傳到支援 HTTPS 的靜態網站（GitHub Pages / Netlify / Cloudflare Pages）。
2. 開啟網址，Chrome F12 → Application 檢查 Manifest 與 Service Worker。
3. 勾選 Offline 重新整理，仍可遊玩即成功。
4. 更新遊戲內容時：修改 index.html，並把 sw.js 第 2 行的版本號加 1（v1→v2）。
5. 換網址前，請先在遊戲內「存檔 → 匯出存檔」備份，到新網址再匯入。
注意：必須透過 http(s) 網址開啟；直接雙擊 index.html（file://）不會啟用離線功能。
