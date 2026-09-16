# 明日方舟 × 終末地｜GRYPHLINE STORE

版本 v2.0.0，2026-09-16。已確認 V6 構圖正式實作，佩麗卡播放與失敗備援已做 Windows Edge 測試。

## 預覽

- 自適應：https://dodolalaowo.github.io/endfield-queue/
- 電腦：https://dodolalaowo.github.io/endfield-queue/?view=tv
- 手機：https://dodolalaowo.github.io/endfield-queue/?view=mobile
- 固定佩麗卡：加 `character=perlica`；固定阿米婭：加 `character=amiya`。
- `motion=off` 關閉動態；參數以 `&` 組合。舊 male / female 分別對應 perlica / amiya。

## 已確認設計

維持單一900px斷點：小於900手機360px基準，其他電腦1920px基準。雙 Logo 終末地左、明日方舟右，手機說明靠右。DAY與039四角框中心對齊。

佩麗卡以官方3D影片半身呈現；阿米婭為彩色前景偏右下、27%後景頭肩偏左上，後景四周漸隱、白底、淡RHODES ISLAND字，沒有黑色色塊。前後景6.5秒單程反向微移，桌機14/20px、手機5/7px。每12秒輪替一次，0.85秒淡入淡出。號碼及公告不跟著移動。

## 播放可靠性

官方佩麗卡原片3840×1080約4.9MB，另製作桌機283KB／手機227KB的H.264無音軌版本。保留原片與透明遮罩。首屏先顯示彩色靜態圖，兩格不同媒體時間成功合成後才顯示影片。

首格逾時10秒或播放中4秒無新格會退回靜態，最多重試一次；自動播放拒絕、WebGL不可用或context lost直接備援。背景分頁、離場及減少動態停止解碼。阿米婭用圖片，不建立第二個video；圖片decode失敗時保留現有完整角色。

使用者首次開啟卡住的設備尚未確認，不能把本機成功等同全部設備修復。iPhone Safari、Android Chrome及實際鎖屏尚未測試。詳見 [驗證紀錄](verification/v6/VALIDATION.md)。

## 本機使用與修改

```sh
node serve.cjs 8090
```

開啟 http://127.0.0.1:8090/ 。請使用 HTTP，file:// 可能限制影片合成。

- `content.js`：活動、DAY、號碼、公告、輪替及素材設定。號碼保持字串，例如 `'039'`。
- `ui.css`：叫號面板、字型與兩版基礎配置。
- `v6.css`：V6雙Logo、人物構圖與邊緣淡化。
- `runtime.js`：內容、縮放、光學置中、角色及頁面生命週期。
- `video-player.js`：佩麗卡透明影片合成與有上限的恢復流程。
- `assets/`：官方原素材、播放用版本、完整字型與授權。
- `handoff-v6/`：當時核准的靜態示意與重建腳本；正式網站已完成移植。
- `verification/v6/`：正式頁截圖與驗證結果。舊 verification 根目錄圖片屬v1歷史。

目前仍是展示前端，號碼／時間為設定值，尚未串接叫號後台。

## 驗證

需 Node.js、Playwright、Edge。

```sh
node verify.cjs
node verification/check-player.cjs
node verification/render-v6.cjs
```

`PREVIEW_URL` 可切換正式頁驗證網址，播放器故障注入測試固定使用本機8090。包含320–1920px、899/900邊界、DAY置中、長公告、冷載入、慢網路、實際畫面變化、輪替、停格／拒絕／WebGL失敗備援與60秒循環。完整結果及實機限制見驗證紀錄。

## 接手

先讀 HANDOFF.md、此文件、SOURCES.md，再讀 verification/v6/VALIDATION.md。以GitHub main最新版為準，修改後測試再推送，Pages自動重新部署。原始模板與已確認示意保留。
