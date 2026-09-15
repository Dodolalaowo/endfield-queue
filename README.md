# 明日方舟：終末地｜GRYPHLINE STORE 叫號網站

版本：v1.0.2，2026-09-15。

依已確認的配置提案 04 製作。先複製星布谷地 v1.3，再替換內容、樣式與動畫；原始兩套模板保留。57 個原始模板檔案與交接包 MANIFEST 的 SHA256 相符。

## 線上預覽

- 自適應：https://dodolalaowo.github.io/endfield-queue/
- 電腦：https://dodolalaowo.github.io/endfield-queue/?view=tv
- 手機：https://dodolalaowo.github.io/endfield-queue/?view=mobile

## 開啟

在本資料夾執行：

```sh
node serve.cjs 8080
```

開啟 http://127.0.0.1:8080/ 。這是本機预覽，不是外部公開網址。

請以 HTTP 開啟以驗證影片透明合成；直接雙擊 index.html 的 file URL 可能因瀏覽器本機檔案限制降為靜態角色。

## 內容與設定

修改 `content.js`：活動名稱、區名、號碼、DAY、狀態、更新時間、公告與動態設定。`number: '039'` 必須保留字串；不會自動加號或更新時間。

目前為展示前端，未串接即時叫號／現場後台。所有時間及號碼均為設定值。

| 設定 | 功能 |
|---|---|
| motion.enabled | 開關全部動態 |
| motion.characters | 開關角色待機與輪替 |
| motion.background | 開關背景及局部框線動態 |
| motion.intervalMs | 男女輪替間隔，預設12000毫秒 |
| motion.fadeMs | 人物淡入淡出時間，預設850毫秒 |

預覽參數：`?view=mobile` 強制手機、`?view=tv` 強制電視、`?motion=off` 關閉全部動態、`?character=male` 或 `?character=female` 固定單一角色（仍保留待機動作）。可用 `&` 組合。

## 配置與動態

- 手機360 × 640與電腦1920 × 1080為基準。小於900px採手機；手機最大縮放1.6，短螢幕可捲動，長公告會延伸畫布。
- PC DAY 的黃底高度對齊039可見字高；字型載入後以 Canvas 字形度量計算號碼及DAY文字的光學位置。
- 手機依序為品牌、區名與大號碼、半身人物、公告。
- 角色採官網原始3D待機影片，以WebGL將左側RGB畫面與右側透明度遮罩合成，輸出960 × 540透明畫布；外層維持提案的半身裁切與下緣透明漸層。
- 男女每12秒輪替，約0.85秒淡入淡出。切換後暫停離場角色的影片，背景分頁停止影片。
- 系統「減少動態」、手動關閉動態時顯示靜態原始畫格；WebGL、影片或自動播放失敗時亦保留靜態圖。
- 背景僅有慢速斜格、淡地形線位移及局部短黃線。號碼與公告不閃爍。

## 檔案

- index.html：唯一網站入口。
- content.js：內容與設定。
- ui.css：已核准布局、字型、動態樣式。
- runtime.js：縮放、字形置中、影片合成與輪替。
- assets：官方人物、Logo、完整字型、原始字型與授權。
- serve.cjs：零套件本機HTTP伺服器。
- verify.cjs：自動化驗證；需Node.js、Playwright與可用Chromium／Edge。
- verification：測試紀錄及截圖。

## 驗證結果與限制

已使用 Edge Chromium 與內建瀏覽器驗證：

- 320、360、390、768、899、900、1366及1920px；無水平溢出，圖像與字型正常。
- 手機／電視強制切換、前導零039／0009、DAY12、長公告不被畫布截斷。
- 官方3D畫格持續更新、男女輪替、離場影片暫停。
- 手機觸控視窗模擬的播放、動態中切換減少動態、影片載入失敗備援。
- `?motion=off` 停止CSS偽元素動畫且不載入影片。

尚未進行 iPhone／Android 實機及Safari驗證；手機模擬不能替代實機測試。

測試：安裝Playwright後啟動預覽，再執行 `node verify.cjs`。如使用系統Edge，在PowerShell設定 `$env:BROWSER_CHANNEL='msedge'`。完整通過項目見 verification/results.json。

資產来源與字型授權見 SOURCES.md。

### v1.0.1 手機人物平衡
手機男角下移7px、女角上移7px；影片與靜態備援同步調整，PC維持原位。

### v1.0.2 數字框置中
PC與手機的DAY黃底、號碼均對齊四角定位框中心，上下留白已量測確認。保留手機角色7px平衡修正。

