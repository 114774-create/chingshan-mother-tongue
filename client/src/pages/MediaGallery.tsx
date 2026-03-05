import { useState } from "react";
import { trpc } from "@/lib/trpc";
import MainLayout from "@/components/MainLayout";
import { Play, X, ExternalLink, Music } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function getYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function getYouTubeThumbnail(url: string): string {
  const id = getYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : "";
}

const LANG_COLORS: Record<string, string> = {
  "閩南語": "oklch(0.38 0.12 163)",
  "客家語": "oklch(0.55 0.14 45)",
  "原住民族語": "oklch(0.45 0.14 25)",
  "新住民語文": "oklch(0.42 0.12 220)",
  "一般": "oklch(0.50 0.04 160)",
};

const DEFAULT_VIDEOS = [
  { id: 1, title: "閩南語童謠－天烏烏", description: "傳統閩南語童謠教學，適合低年級學生學習", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", language: "閩南語", category: "童謠", thumbnailUrl: null },
  { id: 2, title: "客家語日常對話教學", description: "客家語基礎日常用語，生活化情境教學", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", language: "客家語", category: "對話", thumbnailUrl: null },
  { id: 3, title: "原住民族語歌謠欣賞", description: "阿美族傳統歌謠，感受原住民文化之美", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", language: "原住民族語", category: "歌謠", thumbnailUrl: null },
  { id: 4, title: "閩南語故事－虎姑婆", description: "閩南語民間故事說唱，培養語感與聆聽能力", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", language: "閩南語", category: "故事", thumbnailUrl: null },
  { id: 5, title: "新住民語文－越南語問候", description: "越南語基礎問候語教學，認識多元文化", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", language: "新住民語文", category: "對話", thumbnailUrl: null },
  { id: 6, title: "客家語兒歌－月光光", description: "客家傳統兒歌，旋律優美易學易唱", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", language: "客家語", category: "童謠", thumbnailUrl: null },
];

export default function MediaGallery() {
  const { data: videos, isLoading } = trpc.videos.list.useQuery();
  const displayVideos = (videos && videos.length > 0) ? videos : DEFAULT_VIDEOS;

  const [selectedVideo, setSelectedVideo] = useState<typeof DEFAULT_VIDEOS[0] | null>(null);
  const [filterLang, setFilterLang] = useState<string>("全部");

  const languages = ["全部", ...Array.from(new Set(displayVideos.map((v) => v.language)))];
  const filtered = filterLang === "全部" ? displayVideos : displayVideos.filter((v) => v.language === filterLang);

  return (
    <MainLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "oklch(0.45 0.14 25 / 0.1)" }}>
              <Music className="w-5 h-5" style={{ color: "oklch(0.45 0.14 25)" }} />
            </div>
            <div>
              <p className="text-xs font-medium" style={{ color: "oklch(0.38 0.12 163)" }}>07</p>
              <h1 className="text-2xl font-serif font-bold" style={{ color: "oklch(0.18 0.02 200)" }}>
                本土語多媒體影音館
              </h1>
            </div>
          </div>
          <p className="text-sm ml-13" style={{ color: "var(--muted-foreground)" }}>
            收錄閩南語、客家語、原住民族語及新住民語文等豐富教學影音資源
          </p>
        </div>

        {/* Language Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => setFilterLang(lang)}
              className="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200"
              style={
                filterLang === lang
                  ? { background: "oklch(0.38 0.12 163)", color: "white" }
                  : { background: "oklch(0.94 0.02 155)", color: "oklch(0.50 0.04 160)", border: "1px solid oklch(0.88 0.02 155)" }
              }
            >
              {lang}
            </button>
          ))}
        </div>

        {/* Video Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl overflow-hidden animate-pulse">
                <div className="aspect-video" style={{ background: "var(--muted)" }} />
                <div className="p-4 space-y-2">
                  <div className="h-4 rounded" style={{ background: "var(--muted)" }} />
                  <div className="h-3 rounded w-2/3" style={{ background: "var(--muted)" }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
            {filtered.map((video) => {
              const ytId = getYouTubeId(video.videoUrl);
              const thumb = video.thumbnailUrl || (ytId ? getYouTubeThumbnail(video.videoUrl) : "");
              return (
                <div
                  key={video.id}
                  className="content-card cursor-pointer animate-fade-in-up"
                  onClick={() => setSelectedVideo(video as any)}
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video overflow-hidden group">
                    {thumb ? (
                      <img src={thumb} alt={video.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center" style={{ background: "oklch(0.94 0.02 155)" }}>
                        <Play className="w-12 h-12 opacity-30" style={{ color: "oklch(0.38 0.12 163)" }} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-90 group-hover:scale-100"
                        style={{ background: "oklch(0.45 0.14 25 / 0.9)" }}>
                        <Play className="w-5 h-5 text-white ml-0.5" />
                      </div>
                    </div>
                  </div>
                  {/* Info */}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h3 className="font-medium text-sm leading-snug" style={{ color: "oklch(0.18 0.02 200)" }}>
                        {video.title}
                      </h3>
                      <Badge className="text-xs flex-shrink-0 text-white"
                        style={{ background: LANG_COLORS[video.language] ?? "oklch(0.38 0.12 163)", border: "none" }}>
                        {video.language}
                      </Badge>
                    </div>
                    {video.description && (
                      <p className="text-xs line-clamp-2" style={{ color: "var(--muted-foreground)" }}>
                        {video.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {filtered.length === 0 && !isLoading && (
          <div className="text-center py-16">
            <Music className="w-12 h-12 mx-auto mb-3 opacity-30" style={{ color: "oklch(0.38 0.12 163)" }} />
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>目前尚無影音資源</p>
          </div>
        )}
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "oklch(0 0 0 / 0.75)" }}
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl animate-fade-in"
            style={{ background: "white" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div>
                <h3 className="font-serif font-bold" style={{ color: "oklch(0.18 0.02 200)" }}>
                  {selectedVideo.title}
                </h3>
                <Badge className="mt-1 text-xs text-white"
                  style={{ background: LANG_COLORS[selectedVideo.language] ?? "oklch(0.38 0.12 163)", border: "none" }}>
                  {selectedVideo.language}
                </Badge>
              </div>
              <button
                onClick={() => setSelectedVideo(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                style={{ background: "var(--muted)" }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {/* Video Embed */}
            <div className="aspect-video bg-black">
              {getYouTubeId(selectedVideo.videoUrl) ? (
                <iframe
                  src={`https://www.youtube.com/embed/${getYouTubeId(selectedVideo.videoUrl)}?autoplay=1`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                  <Play className="w-16 h-16 text-white/50" />
                  <a href={selectedVideo.videoUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white"
                    style={{ background: "oklch(0.38 0.12 163)" }}>
                    <ExternalLink className="w-4 h-4" />
                    開啟外部連結
                  </a>
                </div>
              )}
            </div>
            {/* Description */}
            {selectedVideo.description && (
              <div className="px-5 py-4">
                <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>{selectedVideo.description}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </MainLayout>
  );
}
