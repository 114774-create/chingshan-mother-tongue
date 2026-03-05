# 青山國小母語網站 TODO

## 資料庫與架構
- [x] 建立 videos 資料表（教學影音連結）
- [x] 建立 photos 資料表（活動照片）
- [x] 建立 announcements 資料表（最新消息公告）
- [x] 建立 plans 資料表（實施計畫與課程計畫連結）
- [x] 建立 banner_slides 資料表（首頁輪播）
- [x] 建立 feedbacks 資料表（留言回饋）
- [x] 執行 db:push 建立資料表

## 後端 API（tRPC）
- [x] videos CRUD procedures
- [x] photos CRUD procedures
- [x] announcements CRUD procedures
- [x] plans CRUD procedures
- [x] banner_slides CRUD procedures
- [x] feedbacks CRUD procedures
- [x] S3 檔案上傳 procedure（照片 base64 上傳）
- [x] dashboard.stats 統計 procedure
- [x] admin 權限保護（adminProcedure）

## 前台頁面
- [x] 全域樣式（明亮活潑淺藍綠 + 活力橙黃主題、Noto Serif/Sans TC 字型）
- [x] 左側固定導覽列（首頁 + 01-09 項目，含編號）
- [x] 主佈局框架（MainLayout）
- [x] 頂部 Header（Logo + 管理後台連結）
- [x] 行動裝置漢堡選單
- [x] 首頁（橫幅輪播、快速連結、最新公告、活動照片、精選影音）
- [x] 01. 本土語課程計畫頁面
- [x] 02. 母語日活動實施計畫及成果頁面
- [x] 03. 現職老師認證一覽表頁面
- [x] 04. 結合社區家庭資源頁面
- [x] 05. 自編本土語教材頁面
- [x] 06. 青山特色課程與學習成果頁面
- [x] 07. 本土語多媒體影音館（YouTube 嵌入、語言篩選）
- [x] 08. 本土語相關網站頁面
- [x] 09. 交流分享回饋區（留言板）
- [x] 活動照片相簿（Lightbox 燈箱、相簿篩選）

## Admin Dashboard 後台
- [x] 後台登入保護（admin role）
- [x] 後台主頁（Dashboard 概覽統計）
- [x] 影音管理（新增/編輯/刪除/顯示切換）
- [x] 活動照片管理（S3 上傳/刪除）
- [x] 計畫連結管理（母語日/課程計畫/教材）
- [x] 最新消息公告管理
- [x] 留言審核功能

## 測試
- [x] videos CRUD 測試
- [x] photos 上傳測試
- [x] plans 更新測試
- [x] admin 權限保護測試
- [x] dashboard.stats 測試
- [x] auth.logout 測試
- [x] 共 16 個測試全部通過


## 後台功能優化（新增）
- [ ] 新增 pageContents 資料表（各分頁內容編輯）
- [ ] 新增後端 CRUD 路由（頁面內容）
- [ ] 新增後台「頁面內容編輯」功能（01-09 各頁）
- [ ] 新增後台「Banner 輪播管理」功能（上傳/排序/刪除）
- [ ] 調整全域色彩為明亮活潑風格
- [ ] 測試所有新功能
