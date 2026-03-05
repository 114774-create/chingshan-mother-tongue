import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ChevronLeft, ChevronRight, BookOpen, Calendar, Music, Globe, MessageSquare, ArrowRight, Megaphone, Image } from "lucide-react";
import MainLayout from "@/components/MainLayout";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// ── Hero Banner ───────────────────────────────────────────────────────────────
const DEFAULT_SLIDES = [
  {
    id: 1,
    title: "青山國小母語教育",
    subtitle: "傳承母語文化，豐富語言生命",
    imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&q=80",
  },
  {
    id: 2,
    title: "本土語多媒體影音館",
    subtitle: "生動有趣的本土語教學影音資源",
    imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80",
  },
  {
    id: 3,
    title: "母語日活動",
    subtitle: "歡慶臺灣母語日，共同守護語言文化",
    imageUrl: "https://images.unsplash.com/photo-1529390079861-591de354faf5?w=1200&q=80",
  },
];

function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const { data: slides } = trpc.bannerSlides.list.useQuery();
  const displaySlides = (slides && slides.length > 0) ? slides : DEFAULT_SLIDES;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % displaySlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [displaySlides.length]);

  const prev = () => setCurrent((c) => (c - 1 + displaySlides.length) % displaySlides.length);
  const next = () => setCurrent((c) => (c + 1) % displaySlides.length);

  return (
    <div className="relative overflow-hidden" style={{ height: "420px" }}>
      {displaySlides.map((slide, i) => (
        <div
          key={slide.id}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <img
            src={slide.imageUrl}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to right, oklch(0.18 0.03 200 / 0.80) 0%, oklch(0.18 0.03 200 / 0.40) 60%, transparent 100%)" }} />
          <div className="absolute inset-0 flex items-center px-12">
            <div className="max-w-lg animate-fade-in-up">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-0.5 w-8" style={{ background: "oklch(0.65 0.12 75)" }} />
                <span className="text-xs font-medium tracking-widest uppercase" style={{ color: "oklch(0.75 0.10 75)" }}>青山國小</span>
              </div>
              <h1 className="text-3xl font-serif font-bold text-white mb-3 leading-tight">{slide.title}</h1>
              <p className="text-base text-white/80 mb-6">{slide.subtitle}</p>
              <Link href="/media-gallery">
                <Button className="text-sm font-medium text-white border-white/30 hover:bg-white/10"
                  style={{ background: "oklch(0.38 0.12 163 / 0.80)", border: "1px solid oklch(0.65 0.12 163 / 0.50)" }}>
                  探索影音館 <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Controls */}
      <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-all"
        style={{ background: "oklch(0 0 0 / 0.30)", color: "white" }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "oklch(0 0 0 / 0.50)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "oklch(0 0 0 / 0.30)")}>
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-all"
        style={{ background: "oklch(0 0 0 / 0.30)", color: "white" }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "oklch(0 0 0 / 0.50)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "oklch(0 0 0 / 0.30)")}>
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {displaySlides.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            className="rounded-full transition-all"
            style={{
              width: i === current ? "24px" : "8px",
              height: "8px",
              background: i === current ? "oklch(0.65 0.12 75)" : "white/50",
            }} />
        ))}
      </div>
    </div>
  );
}

// ── Quick Links ───────────────────────────────────────────────────────────────
const QUICK_LINKS = [
  { href: "/curriculum-plan", icon: BookOpen, label: "課程計畫", color: "oklch(0.38 0.12 163)" },
  { href: "/mother-tongue-day", icon: Calendar, label: "母語日活動", color: "oklch(0.55 0.15 45)" },
  { href: "/media-gallery", icon: Music, label: "影音館", color: "oklch(0.45 0.15 300)" },
  { href: "/feedback", icon: MessageSquare, label: "交流分享", color: "oklch(0.50 0.15 220)" },
  { href: "/related-websites", icon: Globe, label: "相關網站", color: "oklch(0.55 0.12 163)" },
  { href: "/photo-album", icon: Image, label: "活動相簿", color: "oklch(0.55 0.15 75)" },
];

function QuickLinks() {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 py-5 px-6"
      style={{ background: "white", borderBottom: "1px solid var(--border)" }}>
      {QUICK_LINKS.map(({ href, icon: Icon, label, color }) => (
        <Link key={href} href={href}>
          <div className="flex flex-col items-center gap-2 p-3 rounded-xl cursor-pointer transition-all group"
            onMouseEnter={(e) => (e.currentTarget.style.background = "oklch(0.96 0.01 155)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
              style={{ background: `${color}15` }}>
              <Icon className="w-5 h-5" style={{ color }} />
            </div>
            <span className="text-xs font-medium text-center" style={{ color: "var(--foreground)" }}>{label}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}

// ── Announcements ─────────────────────────────────────────────────────────────
function AnnouncementsSection() {
  const { data: announcements } = trpc.announcements.list.useQuery();

  return (
    <div className="content-card">
      <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "oklch(0.38 0.12 163 / 0.10)" }}>
            <Megaphone className="w-4 h-4" style={{ color: "oklch(0.38 0.12 163)" }} />
          </div>
          <h2 className="text-base font-serif font-bold" style={{ color: "var(--foreground)" }}>最新公告</h2>
        </div>
        <Link href="/mother-tongue-day">
          <span className="text-xs flex items-center gap-1 cursor-pointer" style={{ color: "oklch(0.38 0.12 163)" }}>
            更多 <ArrowRight className="w-3 h-3" />
          </span>
        </Link>
      </div>
      <div className="divide-y" style={{ borderColor: "var(--border)" }}>
        {announcements && announcements.length > 0 ? (
          announcements.slice(0, 5).map((ann) => (
            <div key={ann.id} className="flex items-start gap-3 px-5 py-3 hover:bg-muted/30 transition-colors">
              <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: "oklch(0.38 0.12 163)" }} />
              <div className="flex-1 min-w-0">
                {ann.linkUrl ? (
                  <a href={ann.linkUrl} target="_blank" rel="noopener noreferrer"
                    className="text-sm font-medium hover:underline" style={{ color: "var(--foreground)" }}>
                    {ann.title}
                  </a>
                ) : (
                  <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{ann.title}</p>
                )}
                {ann.content && <p className="text-xs mt-0.5 line-clamp-1" style={{ color: "var(--muted-foreground)" }}>{ann.content}</p>}
              </div>
              <span className="text-xs flex-shrink-0" style={{ color: "var(--muted-foreground)" }}>
                {new Date(ann.publishedAt).toLocaleDateString("zh-TW", { month: "2-digit", day: "2-digit" })}
              </span>
            </div>
          ))
        ) : (
          <div className="px-5 py-8 text-center">
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>目前尚無公告</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Recent Photos ─────────────────────────────────────────────────────────────
function RecentPhotosSection() {
  const { data: photos } = trpc.photos.list.useQuery();
  const recent = photos?.slice(0, 6) ?? [];

  return (
    <div className="content-card">
      <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "oklch(0.55 0.15 75 / 0.10)" }}>
            <Image className="w-4 h-4" style={{ color: "oklch(0.55 0.15 75)" }} />
          </div>
          <h2 className="text-base font-serif font-bold" style={{ color: "var(--foreground)" }}>活動照片</h2>
        </div>
        <Link href="/photo-album">
          <span className="text-xs flex items-center gap-1 cursor-pointer" style={{ color: "oklch(0.38 0.12 163)" }}>
            更多 <ArrowRight className="w-3 h-3" />
          </span>
        </Link>
      </div>
      {recent.length > 0 ? (
        <div className="grid grid-cols-3 gap-1 p-2">
          {recent.map((photo) => (
            <div key={photo.id} className="aspect-square overflow-hidden rounded-lg cursor-pointer group">
              <img src={photo.imageUrl} alt={photo.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
            </div>
          ))}
        </div>
      ) : (
        <div className="px-5 py-8 text-center">
          <Image className="w-8 h-8 mx-auto mb-2 opacity-30" style={{ color: "var(--muted-foreground)" }} />
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>尚無活動照片</p>
        </div>
      )}
    </div>
  );
}

// ── Recent Videos ─────────────────────────────────────────────────────────────
function RecentVideosSection() {
  const { data: videos } = trpc.videos.list.useQuery();
  const recent = videos?.slice(0, 3) ?? [];

  function getYouTubeId(url: string): string | null {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  }

  return (
    <div className="content-card">
      <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "oklch(0.45 0.15 300 / 0.10)" }}>
            <Music className="w-4 h-4" style={{ color: "oklch(0.45 0.15 300)" }} />
          </div>
          <h2 className="text-base font-serif font-bold" style={{ color: "var(--foreground)" }}>精選影音</h2>
        </div>
        <Link href="/media-gallery">
          <span className="text-xs flex items-center gap-1 cursor-pointer" style={{ color: "oklch(0.38 0.12 163)" }}>
            更多 <ArrowRight className="w-3 h-3" />
          </span>
        </Link>
      </div>
      {recent.length > 0 ? (
        <div className="p-4 space-y-3">
          {recent.map((video) => {
            const ytId = getYouTubeId(video.videoUrl);
            const thumb = video.thumbnailUrl ?? (ytId ? `https://img.youtube.com/vi/${ytId}/mqdefault.jpg` : null);
            return (
              <a key={video.id} href={video.videoUrl} target="_blank" rel="noopener noreferrer"
                className="flex gap-3 group cursor-pointer">
                <div className="w-24 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                  {thumb ? (
                    <img src={thumb} alt={video.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Music className="w-6 h-6 opacity-30" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium line-clamp-2 group-hover:underline" style={{ color: "var(--foreground)" }}>{video.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">{video.language}</Badge>
                    <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>{video.category}</span>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      ) : (
        <div className="px-5 py-8 text-center">
          <Music className="w-8 h-8 mx-auto mb-2 opacity-30" style={{ color: "var(--muted-foreground)" }} />
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>尚無影音資源</p>
        </div>
      )}
    </div>
  );
}

// ── Main Home Page ────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <MainLayout>
      <HeroBanner />
      <QuickLinks />
      <div className="p-5 space-y-5 stagger-children">
        {/* Welcome */}
        <div className="content-card p-6 animate-fade-in-up">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg, oklch(0.38 0.12 163), oklch(0.50 0.10 163))" }}>
              <span className="text-xl font-bold text-white font-serif">青</span>
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold mb-2" style={{ color: "var(--foreground)" }}>歡迎來到青山國小母語網站</h2>
              <p className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                本網站致力於推廣本土語言教育，提供豐富的母語學習資源，包含教學影音、活動照片、課程計畫等，
                歡迎親師生共同使用，一起守護臺灣珍貴的語言文化資產。
              </p>
            </div>
          </div>
        </div>

        {/* Two-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 animate-fade-in-up">
          <AnnouncementsSection />
          <RecentPhotosSection />
        </div>

        <div className="animate-fade-in-up">
          <RecentVideosSection />
        </div>
      </div>
    </MainLayout>
  );
}
