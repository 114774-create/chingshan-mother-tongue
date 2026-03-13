import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function setupVite(app: any, server: any) {
  // 生產環境不執行
}

export function serveStatic(app: any) {
  const distPath = path.resolve(__dirname, "../../dist/public");
  
  if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
  }

  app.use("*", (req: any, res: any, next: any) => {
    if (req.originalUrl.startsWith("/api")) return next();
    
    const indexPath = path.resolve(distPath, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send("青山國小網站：請確認 Build 資料夾路徑。");
    }
  });
}
