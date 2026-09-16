# 資產來源

使用者授權直接取用官網素材，供本品牌叫號網站提案及製作。官方資產的所有權及相關權利歸原權利人；不重繪Logo、人物，不調色或拉伸原圖。

## 官方來源，2026-09-15取得

參考主站：https://endfield.gryphline.com/zh-tw

輔助參考：https://www.gryphline.com/ja-jp/news

- Logo：主站 Header_logo__s3lE_ 原始SVG，viewBox 0 0 62.4 67.7，保存官方路徑。
- male-idle-original.mp4：https://web-static.hg-cdn.com/endfield/official-v4/_next/static/media/video/idle.810977.mp4
- female-idle-original.mp4：https://web-static.hg-cdn.com/endfield/official-v4/_next/static/media/video/idle.12d14a.mp4
- block-bg-original.svg：https://web-static.hg-cdn.com/endfield/official-v4/_next/static/media/block-bg.f05eda37.svg
- 男女3d-frame.png：將上列待機影片首格的RGB與透明遮罩合成，非AI生成或人物重繪。原始MP4保留。
- topography.svg：依已核准提案製作的裝飾曲線；不是官方地圖。

## 字型

- Noto Sans TC：https://github.com/google/fonts/tree/main/ofl/notosanstc
- Archivo：https://github.com/google/fonts/tree/main/ofl/archivo

兩字型採SIL Open Font License，授權原文分別保存在 assets/NotoSansTC-OFL.txt 與 assets/Archivo-OFL.txt。

完整可變字型TTF保留，轉為WOFF2以降低傳輸量，未刪除字集。Noto Sans TC用於繁體中文及資訊標籤，Archivo真實900字重用於號碼與DAY天數。沒有將系統Arial Black或微軟字型複製到網站。

靜態配置稿第四版的字型為系統字型；正式前端使用上述可隨網站交付的字型，保留粗字重及已核准的光學配置。

## V6 正式版新增素材（2026-09-16）

- 佩麗卡原片 assets/perlica-idle-original.mp4：https://web-static.hg-cdn.com/endfield/official-v4/_next/static/media/video/idle.f95544.mp4
- assets/perlica-desktop.mp4 / perlica-mobile.mp4：由原片等比例縮小、H.264 24fps faststart；維持左右RGB/alpha，不重繪、不改色。轉碼參數見 tools/transcode-perlica.ps1。
- assets/perlica-poster.png：瀏覽器擷取原片1秒畫格並合成右半透明遮罩。見 verification/extract-poster.cjs。
- assets/amiya.png：https://web-static.hg-cdn.com/arknights/official/_next/static/media/amiya_e0.2c74e355.png
- assets/amiya-e1.png：https://web-static.hg-cdn.com/arknights/official/_next/static/media/amiya_e1.739a31c1.png
- assets/arknights-logo.svg：https://ak.gryphline.com/ 原生 svg_def-title_arknights，保留官方路徑和原始比例。
- 阿米婭的27%後景、不同行進方向及邊缘淡化均為獨立CSS效果，不修改官方原圖；沒有採用黑底 styled 素材。

handoff-v6 的 SVG 包裝圖是核准構圖參考，不是正式頁人物素材。原男女管理員資產為歷史保留，正式頁不載入。
