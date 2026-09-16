# V6 正式版 v2.0.0 驗證

2026-09-16，Windows Edge Chromium。手機測試是 390×844 觸控模擬，不是 iPhone / Android 實機。

## 首次開啟卡住

使用者只確認發生在首次開啟；設備、瀏覽器及網路仍未知，尚未在該實機重現根因。
檢查到原流程使用 3840×1080 / 30fps、約 12.6Mbps 的佩麗卡原片，且原播放器沒有首格逾時或停格監測，video 使用 display:none。這些是已修正的風險，不宣稱已證實其中某項是使用者原故障的根因。

新版本桌機 1920×540、手機 1280×360（左右 RGB/alpha，合成後分別 960×540 / 640×360），H.264 yuv420p、24fps、faststart、無音軌。原片 4,908,113 bytes；桌機 283,397 bytes，手機 226,560 bytes。原片留存 assets，不作首屏下載。

## 播放流程

- 先有彩色靜態備援，兩次不同媒體時間的畫格成功合成後顯示影片。
- 不依賴 requestVideoFrameCallback；rAF 按媒體時間取新格，上限24fps，避免部分設備 callback 不回來後永久停格。
- video 保持1px可布局、muted、playsinline，避免 display:none；頁面隱藏及離場會停止解碼。
- 10秒未形成首格、4秒沒有新格，退回靜態。最多一次延遲重試，桌機重試改用手機片源，之後保持靜態並停止下載。
- 自動播放拒絕、WebGL 不可用／context lost／合成失敗直接降級。不得以無限重試或重載整页恢復。
- 輪替前等待阿米婭兩張圖片 decode 完成；失敗時保留完整佩麗卡畫面。

## 已測證據

`player-results.json`：冷快取桌機／觸控模擬、實際時間與合成格前進、角色畫布兩次截圖像素不同、慢網路（300ms latency / 90KB/s）、拒絕 autoplay、影片缺檔、play Promise 永遠 pending、解碼停止、無 WebGL、context lost、stop/start 恢復、60秒循環（約19次原片循環）。首格數值是本機測量，不是跨設備速度保證。

`site-results.json`：320–1920px、899/900斷點、前導零、DAY置中、長公告、四張V6截圖、佩麗卡→阿米婭→佩麗卡、阿米婭微移、單一 decoder、手機素材選擇、模擬 visibilitychange、動態中切 reduced-motion、影片與阿米婭素材失敗備援。

沒有 iPhone Safari、Android Chrome 實機或實際鎖屏測試；visibility 是確定性事件模擬。60秒循環不能代表展場數小時穩定性，實機首次開啟與長時間現場試跑仍需確認。

## 重跑

安裝 Node.js、Playwright 與 Edge，執行 `node serve.cjs 8090`。

```sh
node verify.cjs
node verification/check-player.cjs
node verification/render-v6.cjs
```

網站測試可使用 `PREVIEW_URL` 切到公開網址。播放器故障注入測試固定用本機8090，不放入觀眾介面。
