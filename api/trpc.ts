import { createHTTPHandler } from '@trpc/server/adapters/node-http';
import { appRouter } from '../server/routers'; // 請確認你的 router 路徑
// 如果你有 context 也要引入

const handler = createHTTPHandler({
  router: appRouter,
  createContext: () => ({}), // 根據你的 server/_core/index.ts 修改
});

export default function (req: any, res: any) {
  // 處理 CORS（如果需要）
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  return handler(req, res);
}
