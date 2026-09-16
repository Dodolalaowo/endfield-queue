# 示意圖 01 — 素材與重製記錄

本資料夾僅供版面確認，未修改正式網站。原站參考副本保存在 `../reference-assets/source/endfield-queue-main/`。

## 官方來源

- 終末地 Logo：沿用現有網站的 `assets/endfield-logo-original.svg`，其來源記錄見原站 SOURCES.md。
- 明日方舟 Logo：https://ak.gryphline.com/ 的原生 SVG `svg_def-title_arknights`，viewBox `0 0 254 119`，保留路徑，以 `<use>` 顯示。
- 佩麗卡待機影片：https://web-static.hg-cdn.com/endfield/official-v4/_next/static/media/video/idle.f95544.mp4
- 佩麗卡靜態圖：瀏覽器擷取影片 1 秒畫格，將左側 RGB 與右側灰階透明遮罩合成；輸出 1920 × 1080。保留原始影片。
- 阿米婭主立繪：https://web-static.hg-cdn.com/arknights/official/_next/static/media/amiya_e0.2c74e355.png
- 阿米婭官方背景：https://web-static.hg-cdn.com/arknights/official/_next/static/media/amiya_e1_styled.db35f491.png
- 字型：沿用原站 Noto Sans TC 與 Archivo，授權保留在原站參考副本 assets。

Logo 與人物未重繪。展示採等比例縮放、版面裁切、原有底部漸層。阿米婭深色幾何背景以 CSS 搭配官方背景素材組成。

## 輸出

- `desktop-perlica.png`、`desktop-amiya.png`：1920 × 1080。
- `mobile-perlica.png`、`mobile-amiya.png`：720 × 1406（360 × 703 CSS 像素，2 倍輸出）。
- `index.html`：可直接開啟的比較頁。
- `overview.png`：四張圖總覽。

## 重製

於工作區執行 `node preview.cjs 8080`，再執行 `node mockups/render.cjs`。渲染脚本使用本機 Edge 與已安裝的 Playwright。

`proposal.html` / `proposal.css` 為獨立示意稿，引用原站參考版型；尚非正式網站改版。`render-check.json` 記錄四張示意圖皆無 JavaScript 錯誤、圖片載入正常且無水平溢出。靜態示意圖不代表影片效能驗證。

## 第二版
手機雙 Logo 靠左，說明靠右。佩麗卡桌機上移 100px；阿米婭桌機上移 26px。手機佩麗卡上移 50px，阿米婭上移 40px，耳尖可覆蓋面板下緣。移除阿米婭深色背景，共用白底、黃色直帶與 ENDFIELD 裝飾字。第一版圖片保留於 v1/。本次仍為靜態示意稿，轉場尚未實作。

## 第三版（依最新黑底參考）
明日方舟 Logo 等比縮小約 23%。恢復官方 ami ya_e1_styled 後景（實際檔名 ami ya 中間無空白），黑底固定，後景人物左上、前景右下錯位。示意動畫前景向右、後景向左，6.5 秒單程往返；桌機 14/20px、手機 5/7px。正式網站未修改。

## 第四版：修正理解
保留前景偏右下、後景偏左上的構圖，移除黑色色塊。後景使用官方 amiya_e1.739a31c1.png 透明立繪，23% 不透明度；沿用縮小 Logo 及反向微移預覽。

## 第五版
依黑底參考的構圖改為白底：後景放大頭肩留在左上、漸層裁去下方身體；保留 RHODES ISLAND 淡字。阿米婭人物區取消黃色直帶與 ENDFIELD 裝飾字，維持前景及縮小 Logo 的位置。

## 第六版
阿米婭後景左右邊界及上下邊緣使用透明漸層，消除直切線；保持人物尺寸與定位。

