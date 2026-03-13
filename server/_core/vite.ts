import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// 在 ESM 模式下，我們需要這樣定義 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 在 Vercel 生產環境中，我們完全不需要 setupVite。
 * 這裡保留空函式是為了確保其他地方引用時不會報錯。
 */
export async function setupVite(app: Express, server: any) {
  console.log("Vercel 環境：跳過 Vite 設定，直接使用靜態檔案。");
}

/**
 * 這是 Vercel 運行的核心：直接把已經打包好的網頁（dist）拿給瀏覽器看。
 */
export function serveStatic(app: Express) {
  // 修正 Vercel 上的路徑判斷
  // 打包後的檔案通常在專案根目錄的 dist/public
  const rootDist = path.resolve(__dirname, "../../dist/public");
  const localPublic = path.resolve(__dirname, "../../public");
  
  // 自動偵測哪一個資料夾才是真的存在的
  let distPath = rootDist;
  if (!fs.existsSync(distPath)) {
    distPath = localPublic;
  }

  // 如果還是找不到，至少不要讓伺服器崩潰
  if (!fs.existsSync(distPath)) {
    console.warn(`[警告] 找不到靜態資料夾: ${distPath}`);
  }

  // 1. 提供靜態檔案服務
  app.use(express.static(distPath));

  // 2. 萬能路由：如果瀏覽器要找的不是 API，就通通給他 index.html
  app.use("*", (req, res, next) => {
    // 排除 API 請求，不要讓 API 也回傳 HTML
    if (req.originalUrl.startsWith("/api")) {
      return next();
    }

    const indexPath = path.resolve(distPath, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send("青山國小母語日網站：靜態網頁尚未建置完成，請檢查 Build Logs。");
    }
  });
}
