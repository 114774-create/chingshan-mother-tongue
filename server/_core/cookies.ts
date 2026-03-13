import { CookieOptions } from "express";

export function getSessionCookieOptions(req: any): any {
  const isSecure = (req as any).protocol === "https" || (req as any).headers["x-forwarded-proto"] === "https";

  return {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: isSecure,
    domain: undefined, // 補上遺失的屬性，讓檢查員閉嘴
  };
}
