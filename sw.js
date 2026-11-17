// 更新遊戲時，請把版本號 v1 改成 v2、v3……，玩家才會拿到新版
const CACHE = "pig-hero-v11";
const ASSETS = ["./", "./index.html", "./styles.css", "./js/compat.js", "./js/game-core.js", "./js/equipment.js", "./js/battle.js", "./js/party.js", "./js/world.js", "./js/story.js", "./js/state.js", "./js/platform.js", "./js/ui-panels.js", "./js/navigation.js", "./js/bootstrap.js", "./manifest.webmanifest", "./town-map-pixel.png", "./pig-adventurer-sprite.png", "./pig-adventurer-sprite-sheet.png", "./icon-192.png", "./icon-512.png", "./icon-512-maskable.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
      if (res.ok && new URL(e.request.url).origin === location.origin) {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
      }
      return res;
    }).catch(() => e.request.mode === "navigate" ? caches.match("./index.html") : undefined))
  );
});
