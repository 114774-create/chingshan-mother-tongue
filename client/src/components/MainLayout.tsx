import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Home, BookOpen, Calendar, GraduationCap, Users, FileText, BookMarked, Music, Globe, MessageSquare, Settings } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "首頁", icon: Home, number: null },
  { href: "/curriculum-plan", label: "本土語課程計畫", icon: BookOpen, number: "01" },
  { href: "/mother-tongue-day", label: "母語日活動實施計畫及成果", icon: Calendar, number: "02" },
  { href: "/teacher-certification", label: "現職老師參與本土語言認證達中高級以上資格及實際授課一覽表", icon: GraduationCap, number: "03" },
  { href: "/community-resources", label: "結合社區、家庭資源推動本土語言教學及母語日活動", icon: Users, number: "04" },
  { href: "/self-made-materials", label: "自編本土語教材", icon: FileText, number: "05" },
  { href: "/special-curriculum", label: "青山特色課程與學習成果", icon: BookMarked, number: "06" },
  { href: "/media-gallery", label: "本土語多媒體影音館", icon: Music, number: "07" },
  { href: "/related-websites", label: "本土語相關網站", icon: Globe, number: "08" },
  { href: "/feedback", label: "交流分享回饋區", icon: MessageSquare, number: "09" },
];

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--background)" }}>
      {/* Top Header */}
      <header className="sticky top-0 z-40 flex-shrink-0"
        style={{ background: "linear-gradient(135deg, oklch(0.50 0.15 180), oklch(0.45 0.12 180))", borderBottom: "1px solid oklch(0.60 0.12 180)" }}>
        <div className="flex items-center h-14 px-4 gap-3">
          {/* Mobile menu toggle */}
          <button
            className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
            style={{ color: "white" }}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-2.5 cursor-pointer">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: "linear-gradient(135deg, oklch(0.70 0.18 50), oklch(0.65 0.16 45))" }}>
                <span className="text-sm font-bold text-white font-serif">青</span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-bold text-white font-serif leading-tight">青山國小母語網站</p>
                <p className="text-xs opacity-60 text-white leading-tight">Chingshan Elementary School</p>
              </div>
            </div>
          </Link>

          <div className="flex-1" />

          {/* Admin Login Link */}
          <Link href="/login">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer"
              style={{ color: "oklch(0.95 0.02 50)", background: "oklch(0.70 0.18 50 / 0.15)" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "oklch(0.70 0.18 50 / 0.25)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "oklch(0.70 0.18 50 / 0.15)")}>
              <Settings className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">管理後台</span>
            </div>
          </Link>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`
            fixed lg:sticky top-14 left-0 z-30 h-[calc(100vh-3.5rem)] overflow-y-auto flex-shrink-0
            transition-transform duration-300 ease-in-out
            ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}
          style={{
            width: "260px",
            background: "linear-gradient(180deg, oklch(0.35 0.10 180) 0%, oklch(0.30 0.08 180) 100%)",
            borderRight: "1px solid oklch(0.50 0.10 180)",
          }}
        >
          {/* School name in sidebar */}
          <div className="px-4 py-4 border-b" style={{ borderColor: "oklch(0.50 0.10 180)" }}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: "oklch(0.70 0.18 50 / 0.25)" }}>
                <span className="text-sm font-bold font-serif" style={{ color: "oklch(0.85 0.16 50)" }}>青</span>
              </div>
              <div>
                <p className="text-xs font-bold font-serif" style={{ color: "oklch(0.95 0.02 200)" }}>青山國小母語網站</p>
                <p className="text-xs opacity-70" style={{ color: "oklch(0.85 0.02 200)" }}>本土語教育資源中心</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-2">
            {NAV_ITEMS.map((item) => {
              const isActive = item.href === "/" ? location === "/" : location.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className="flex items-start gap-2.5 px-3 py-2.5 rounded-lg mb-0.5 cursor-pointer transition-all duration-200 group"
                    style={isActive
                      ? { background: "oklch(0.70 0.18 50 / 0.20)", borderLeft: "3px solid oklch(0.70 0.18 50)" }
                      : { borderLeft: "3px solid transparent" }}
                    onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLDivElement).style.background = "oklch(0.70 0.18 50 / 0.08)"; }}
                    onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
                    onClick={() => setMobileOpen(false)}
                  >
                    {/* Number badge */}
                    {item.number ? (
                      <div className="flex-shrink-0 w-6 h-6 rounded flex items-center justify-center mt-0.5"
                        style={{
                          background: isActive ? "oklch(0.70 0.18 50 / 0.30)" : "oklch(0.70 0.18 50 / 0.10)",
                          color: isActive ? "oklch(0.85 0.16 50)" : "oklch(0.75 0.12 50)",
                        }}>
                        <span className="text-xs font-bold leading-none">{item.number}</span>
                      </div>
                    ) : (
                      <div className="flex-shrink-0 w-6 h-6 rounded flex items-center justify-center mt-0.5"
                        style={{ background: isActive ? "oklch(0.70 0.18 50 / 0.30)" : "transparent" }}>
                        <Icon className="w-3.5 h-3.5" style={{ color: isActive ? "oklch(0.85 0.16 50)" : "oklch(0.80 0.05 200)" }} />
                      </div>
                    )}
                    <span
                      className="text-xs leading-snug"
                      style={{
                        color: isActive ? "oklch(0.95 0.02 50)" : "oklch(0.85 0.02 200)",
                        fontWeight: isActive ? "600" : "400",
                      }}
                    >
                      {item.label}
                    </span>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 mt-auto border-t" style={{ borderColor: "oklch(0.50 0.10 180)" }}>
            <p className="text-xs text-center opacity-50" style={{ color: "oklch(0.85 0.02 200)" }}>
              © 青山國小 版權所有
            </p>
          </div>
        </aside>

        {/* Mobile overlay */}
        {mobileOpen && (
          <div
            className="fixed inset-0 z-20 lg:hidden"
            style={{ background: "oklch(0 0 0 / 0.5)" }}
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 overflow-auto min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
