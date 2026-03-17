import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Lock, AlertCircle } from "lucide-react";

export default function Login() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [, setLocation] = useLocation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password === "114774") {
      localStorage.setItem("admin_password", password);
      setLocation("/admin");
    } else {
      setError("密碼錯誤");
      setPassword("");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.50 0.15 180), oklch(0.45 0.12 180))",
      }}
    >
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.70 0.18 50), oklch(0.65 0.16 45))",
            }}
          >
            <span className="text-2xl font-bold text-white font-serif">青</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">青山國小母語網站</h1>
          <p className="text-gray-600">管理後台登入</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">密碼</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                type="password"
                placeholder="輸入密碼"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                autoFocus
              />
            </div>
          </div>
          {error && (
            <div
              className="flex items-center gap-2 p-3 rounded-lg"
              style={{ background: "oklch(0.95 0.12 25 / 0.15)" }}
            >
              <AlertCircle
                className="w-4 h-4"
                style={{ color: "oklch(0.55 0.12 25)" }}
              />
              <span
                className="text-sm"
                style={{ color: "oklch(0.55 0.12 25)" }}
              >
                {error}
              </span>
            </div>
          )}
          <Button
            type="submit"
            className="w-full"
            style={{ background: "oklch(0.70 0.18 50)" }}
          >
            登入
          </Button>
        </form>
        <p className="text-xs text-center text-gray-500 mt-6">
          © 青山國小 版權所有
        </p>
      </Card>
    </div>
  );
}
