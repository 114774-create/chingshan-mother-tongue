import { useState } from "react";
import { trpc } from "@/lib/trpc";
import MainLayout from "@/components/MainLayout";
import { Image, X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

const DEFAULT_PHOTOS = [
  { id: 1, title: "客家舞蹈《客家風情》展演", albumName: "母語日活動", year: "2024", imageUrl: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&q=80", description: "舞蹈社團的孩子們穿著傳統客家花布衣裳，展現客家文化之美" },
  { id: 2, title: "客家舞蹈《豐慶秋歌》展演", albumName: "母語日活動", year: "2024", imageUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&q=80", description: "豐收主題舞蹈，展現客家農耕文化精神" },
  { id: 3, title: "學台語當著時－元宵節猜謎活動", albumName: "母語日活動", year: "2024", imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&q=80", description: "元宵節猜謎活動，用台語猜燈謎，趣味十足" },
  { id: 4, title: "本土語教學課堂", albumName: "教學活動", year: "2024", imageUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&q=80", description: "老師帶領學生進行本土語言教學活動" },
  { id: 5, title: "母語日成果發表會", albumName: "成果展示", year: "2024", imageUrl: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=80", description: "學生展示一年來的本土語學習成果" },
  { id: 6, title: "原住民族語文化體驗", albumName: "文化體驗", year: "2024", imageUrl: "https://images.unsplash.com/photo-1529390079861-591de354faf5?w=600&q=80", description: "體驗原住民族傳統文化，增進多元文化理解" },
  { id: 7, title: "閩南語說故事比賽", albumName: "競賽活動", year: "2023", imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80", description: "學生以閩南語說故事，展現語言學習成果" },
  { id: 8, title: "客家語歌謠演唱", albumName: "藝文展演", year: "2023", imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80", description: "學生演唱客家傳統歌謠，傳承客家文化" },
];

export default function PhotoAlbum() {
  const { data: photos, isLoading } = trpc.photos.list.useQuery();
  const { data: albums } = trpc.photos.albums.useQuery();
  const displayPhotos = (photos && photos.length > 0) ? photos : DEFAULT_PHOTOS;

  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [filterAlbum, setFilterAlbum] = useState<string>("全部");

  const albumNames = ["全部", ...Array.from(new Set(displayPhotos.map((p) => p.albumName)))];
  const filtered = filterAlbum === "全部" ? displayPhotos : displayPhotos.filter((p) => p.albumName === filterAlbum);

  const openPhoto = (idx: number) => setSelectedIdx(idx);
  const closePhoto = () => setSelectedIdx(null);
  const prevPhoto = () => setSelectedIdx((i) => (i !== null ? (i - 1 + filtered.length) % filtered.length : null));
  const nextPhoto = () => setSelectedIdx((i) => (i !== null ? (i + 1) % filtered.length : null));

  return (
    <MainLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "oklch(0.42 0.12 220 / 0.1)" }}>
              <Image className="w-5 h-5" style={{ color: "oklch(0.42 0.12 220)" }} />
            </div>
            <div>
              <p className="text-xs font-medium" style={{ color: "oklch(0.38 0.12 163)" }}>活動相簿</p>
              <h1 className="text-2xl font-serif font-bold" style={{ color: "oklch(0.18 0.02 200)" }}>
                活動照片展示
              </h1>
            </div>
          </div>
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
            記錄青山國小母語日活動、教學課程與文化體驗的精彩瞬間
          </p>
        </div>

        {/* Album Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {albumNames.map((name) => (
            <button
              key={name}
              onClick={() => setFilterAlbum(name)}
              className="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200"
              style={
                filterAlbum === name
                  ? { background: "oklch(0.38 0.12 163)", color: "white" }
                  : { background: "oklch(0.94 0.02 155)", color: "oklch(0.50 0.04 160)", border: "1px solid oklch(0.88 0.02 155)" }
              }
            >
              {name}
            </button>
          ))}
        </div>

        {/* Photo Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-xl animate-pulse" style={{ background: "var(--muted)" }} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 stagger-children">
            {filtered.map((photo, idx) => (
              <div
                key={photo.id}
                className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group animate-fade-in-up shadow-sm"
                onClick={() => openPhoto(idx)}
              >
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex flex-col items-center justify-center">
                  <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 mb-2" />
                  <p className="text-white text-xs text-center px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-medium leading-snug">
                    {photo.title}
                  </p>
                </div>
                {/* Album badge */}
                <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium text-white"
                    style={{ background: "oklch(0.38 0.12 163 / 0.85)" }}>
                    {photo.albumName}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {filtered.length === 0 && !isLoading && (
          <div className="text-center py-16">
            <Image className="w-12 h-12 mx-auto mb-3 opacity-30" style={{ color: "oklch(0.38 0.12 163)" }} />
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>此相簿尚無照片</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selectedIdx !== null && filtered[selectedIdx] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "oklch(0 0 0 / 0.90)" }}
          onClick={closePhoto}
        >
          {/* Close */}
          <button
            className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-white transition-colors z-10"
            style={{ background: "oklch(1 0 0 / 0.15)" }}
            onClick={closePhoto}
          >
            <X className="w-5 h-5" />
          </button>

          {/* Prev */}
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white transition-colors z-10"
            style={{ background: "oklch(1 0 0 / 0.15)" }}
            onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Next */}
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white transition-colors z-10"
            style={{ background: "oklch(1 0 0 / 0.15)" }}
            onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Image */}
          <div className="max-w-4xl max-h-[85vh] mx-4 animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <img
              src={filtered[selectedIdx].imageUrl}
              alt={filtered[selectedIdx].title}
              className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl"
            />
            <div className="mt-3 text-center">
              <p className="text-white font-medium">{filtered[selectedIdx].title}</p>
              {filtered[selectedIdx].description && (
                <p className="text-white/70 text-sm mt-1">{filtered[selectedIdx].description}</p>
              )}
              <p className="text-white/50 text-xs mt-1">
                {selectedIdx + 1} / {filtered.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
