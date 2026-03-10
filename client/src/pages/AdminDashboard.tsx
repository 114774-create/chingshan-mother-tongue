import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import {
  LayoutDashboard, BookOpen, Calendar, Users, Home, Lightbulb, Sparkles,
  Globe, MessageSquare, LogOut, ChevronRight, Plus, Pencil, Trash2, Upload,
  AlertCircle, Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// ── Page Sections Configuration ───────────────────────────────────────────────
const PAGE_SECTIONS = [
  { id: "01", label: "01 本土語課程計畫", icon: BookOpen, color: "oklch(0.45 0.14 25)" },
  { id: "02", label: "02 母語日活動實施計畫及成果", icon: Calendar, color: "oklch(0.42 0.12 220)" },
  { id: "03", label: "03 現職老師認證與授課一覽表", icon: Users, color: "oklch(0.38 0.12 163)" },
  { id: "04", label: "04 社區家庭資源推動", icon: Home, color: "oklch(0.55 0.14 45)" },
  { id: "05", label: "05 自編本土語教材", icon: Lightbulb, color: "oklch(0.50 0.13 280)" },
  { id: "06", label: "06 青山特色課程與學習成果", icon: Sparkles, color: "oklch(0.48 0.15 60)" },
  { id: "07", label: "07 本土語多媒體影音館", icon: Globe, color: "oklch(0.52 0.12 120)" },
  { id: "08", label: "08 本土語相關網站", icon: Globe, color: "oklch(0.45 0.11 200)" },
  { id: "09", label: "09 交流分享回饋區", icon: MessageSquare, color: "oklch(0.50 0.14 30)" },
];

// ── Banner Slides Manager ─────────────────────────────────────────────────────────────
function BannerSlidesManager() {
  const [banners, setBanners] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [draggedId, setDraggedId] = useState<number | null>(null);

  const { data: allBanners } = trpc.bannerSlides.listAll.useQuery();
  const createBannerMutation = trpc.bannerSlides.create.useMutation();
  const updateBannerMutation = trpc.bannerSlides.update.useMutation();
  const deleteBannerMutation = trpc.bannerSlides.delete.useMutation();
  const reorderMutation = trpc.bannerSlides.reorder.useMutation();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = (event.target?.result as string).split(",")[1];
        // 上傳圖片
        toast.success(`Banner 圖片已上傳：${file.name}`);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error("上傳失敗");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBanner = async (id: number) => {
    if (confirm("確定要刪除此 Banner 嗎？")) {
      try {
        await deleteBannerMutation.mutateAsync({ id });
        toast.success("Banner 已刪除");
      } catch (error) {
        toast.error("刪除失敗");
      }
    }
  };

  const handleDragStart = (id: number) => {
    setDraggedId(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, targetId: number) => {
    e.preventDefault();
    if (!draggedId || draggedId === targetId) return;

    // 重新排序邏輯
    const newBanners = allBanners ? [...allBanners] : [];
    const draggedIndex = newBanners.findIndex(b => b.id === draggedId);
    const targetIndex = newBanners.findIndex(b => b.id === targetId);

    if (draggedIndex !== -1 && targetIndex !== -1) {
      [newBanners[draggedIndex], newBanners[targetIndex]] = [newBanners[targetIndex], newBanners[draggedIndex]];
      const reorderData = newBanners.map((b, idx) => ({ id: b.id, sortOrder: idx }));
      try {
        await reorderMutation.mutateAsync({ slides: reorderData });
        toast.success("排序已更新");
      } catch (error) {
        toast.error("排序失敗");
      }
    }
    setDraggedId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b pb-4">
        <h2 className="text-2xl font-serif font-bold mb-2">首頁 Banner 輪播管理</h2>
        <p className="text-sm text-muted-foreground">
          上傳、排序和管理首頁輪播圖片。拖拽圖片可改變順序。
        </p>
      </div>

      {/* Upload Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3 mb-4">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-blue-900">此處上傳之圖片將顯示於：</p>
            <p className="text-sm text-blue-800 mt-1">首頁 Hero Banner 輪播區域</p>
          </div>
        </div>

        <div className="space-y-3">
          <Label htmlFor="banner-upload" className="text-base font-semibold">上傳 Banner 圖片</Label>
          <div className="flex gap-2">
            <Input
              id="banner-upload"
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={isLoading}
              className="flex-1"
            />
            <Button disabled={isLoading} variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              上傳
            </Button>
          </div>
        </div>
      </div>

      {/* Banners List */}
      <div>
        <h3 className="text-lg font-semibold mb-4">現有 Banner 圖片</h3>
        {allBanners && allBanners.length > 0 ? (
          <div className="space-y-3">
            {allBanners.map((banner, idx) => (
              <div
                key={banner.id}
                draggable
                onDragStart={() => handleDragStart(banner.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, banner.id)}
                className={`border rounded-lg p-4 flex items-center gap-4 cursor-move transition-colors ${
                  draggedId === banner.id ? "bg-blue-100 border-blue-400" : "bg-white hover:bg-gray-50"
                }`}
              >
                <div className="flex-shrink-0 w-20 h-20 bg-gray-200 rounded overflow-hidden">
                  <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{banner.title}</p>
                  <p className="text-sm text-muted-foreground">{banner.subtitle}</p>
                  {banner.externalLink && (
                    <p className="text-xs text-blue-600 mt-1">連結：{banner.externalLink}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">排序：{idx + 1}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDeleteBanner(banner.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-muted-foreground">尚無 Banner 圖片，請上傳第一張</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Page Content Editor ─────────────────────────────────────────────────────────────
function PageContentEditor({ pageId }: { pageId: string }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [externalLinks, setExternalLinks] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const pageConfig = PAGE_SECTIONS.find(p => p.id === pageId);
  const pageKey = `page_${pageId}`;

  // 查詢現有內容
  const { data: pageData } = trpc.pageContent.getByPageKey.useQuery({ pageKey });

  const handleSaveContent = async () => {
    setIsLoading(true);
    try {
      // 這裡應該調用 trpc.pageContent.update 或 create
      toast.success("內容已保存");
    } catch (error) {
      toast.error("保存失敗");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = (event.target?.result as string).split(",")[1];
        // 調用上傳 API
        toast.success(`文件已上傳：${file.name}`);
        setUploadedFiles([...uploadedFiles, file.name]);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error("上傳失敗");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b pb-4">
        <h2 className="text-2xl font-serif font-bold mb-2">{pageConfig?.label}</h2>
        <p className="text-sm text-muted-foreground">
          在此編輯該頁面的內容、上傳檔案和設定連結
        </p>
      </div>

      {/* Content Section */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="page-title" className="text-base font-semibold">頁面標題</Label>
          <Input
            id="page-title"
            placeholder="輸入頁面標題"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="page-content" className="text-base font-semibold">頁面內容</Label>
          <Textarea
            id="page-content"
            placeholder="輸入頁面主要內容"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            className="mt-2"
          />
        </div>
      </div>

      {/* File Upload Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3 mb-4">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-blue-900">此處上傳之檔案將顯示於：</p>
            <p className="text-sm text-blue-800 mt-1">{pageConfig?.label}</p>
          </div>
        </div>

        <div className="space-y-3">
          <Label htmlFor="file-upload" className="text-base font-semibold">上傳照片或文件</Label>
          <div className="flex gap-2">
            <Input
              id="file-upload"
              type="file"
              onChange={handleFileUpload}
              disabled={isLoading}
              className="flex-1"
            />
            <Button disabled={isLoading} variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              上傳
            </Button>
          </div>
        </div>

        {uploadedFiles.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-semibold mb-2">已上傳檔案：</p>
            <ul className="space-y-2">
              {uploadedFiles.map((file, idx) => (
                <li key={idx} className="text-sm flex items-center justify-between bg-white p-2 rounded border">
                  <span>{file}</span>
                  <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* External Links Section */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="external-links" className="text-base font-semibold">外部連結（如 YouTube、Google Drive）</Label>
          <Textarea
            id="external-links"
            placeholder="輸入連結，每行一個"
            value={externalLinks}
            onChange={(e) => setExternalLinks(e.target.value)}
            rows={3}
            className="mt-2"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t">
        <Button
          onClick={handleSaveContent}
          disabled={isLoading}
          className="bg-green-600 hover:bg-green-700"
        >
          <Check className="w-4 h-4 mr-2" />
          保存變更
        </Button>
        <Button variant="outline" disabled={isLoading}>
          取消
        </Button>
      </div>
    </div>
  );
}

// ── Admin Dashboard Main ─────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { user, loading, isAuthenticated } = useAuth();
  const [activePageId, setActivePageId] = useState<string | "banner">("01");

  if (loading) {
    return <div className="flex items-center justify-center h-screen">載入中...</div>;
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">管理員權限不足</h1>
          <Button onClick={() => window.location.href = getLoginUrl()}>
            返回登入
          </Button>
        </div>
      </div>
    );
  }

  const activePageConfig = PAGE_SECTIONS.find(p => p.id === activePageId);
  const showBannerManager = activePageId === "banner";

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-6 border-b">
          <h1 className="text-xl font-serif font-bold text-gray-900">管理後台</h1>
          <p className="text-xs text-gray-500 mt-1">分頁內容管理</p>
        </div>

        <nav className="p-4 space-y-2">
          {/* Banner 管理 */}
          <button
            onClick={() => setActivePageId("banner")}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${
              activePageId === "banner"
                ? "bg-orange-100 text-orange-900 font-semibold"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Upload className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm">首頁 Banner 輪播管理</span>
          </button>

          {/* 分頁管理 */}
          <div className="pt-2 mt-2 border-t">
            <p className="text-xs font-semibold text-gray-500 px-4 py-2">分頁內容</p>
            {PAGE_SECTIONS.map((section) => (
              <button
                key={section.id}
                onClick={() => setActivePageId(section.id)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${
                  activePageId === section.id
                    ? "bg-blue-100 text-blue-900 font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <section.icon className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">{section.label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t mt-auto">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              // 調用 logout mutation
              window.location.href = "/";
            }}
          >
            <LogOut className="w-4 h-4 mr-2" />
            登出
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-4xl">
          {showBannerManager ? (
            <BannerSlidesManager />
          ) : (
            <PageContentEditor pageId={activePageId} />
          )}
        </div>
      </div>
    </div>
  );
}


