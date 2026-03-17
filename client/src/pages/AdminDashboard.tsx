import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Upload, LogOut, Trash2, Pencil, Plus, Check, X, Image, Music, BookOpen, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// 頁面選項定義
const PAGE_OPTIONS = [
  { value: "home", label: "首頁公告" },
  { value: "curriculum-plan", label: "01 本土語課程計畫" },
  { value: "mother-tongue-day", label: "02 母語日活動實施計畫及成果" },
  { value: "teacher-certification", label: "03 現職老師認證與授課一覽表" },
  { value: "community-resources", label: "04 結合社區家庭資源" },
  { value: "self-made-materials", label: "05 自編本土語教材" },
  { value: "special-curriculum", label: "06 青山特色課程與學習成果" },
  { value: "media-gallery", label: "07 本土語多媒體影音館" },
  { value: "related-websites", label: "08 本土語相關網站" },
  { value: "feedback", label: "09 交流分享回饋區" },
  { value: "photo-album", label: "活動相簿" },
];

function PageSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <Label>顯示於哪個頁面 *</Label>
      <select
        className="mt-1 w-full h-10 px-3 rounded-md border text-sm bg-white"
        value={value}
        onChange={e => onChange(e.target.value)}
      >
        {PAGE_OPTIONS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
      </select>
    </div>
  );
}

// ─────────────────────────────────────────────
// 1. Banner 輪播管理
// ─────────────────────────────────────────────
function BannerManager() {
  const utils = trpc.useUtils();
  const { data: banners } = trpc.bannerSlides.listAll.useQuery();
  const createMutation = trpc.bannerSlides.create.useMutation({
    onSuccess: () => { utils.bannerSlides.listAll.invalidate(); utils.bannerSlides.list.invalidate(); toast.success("Banner 已新增"); resetForm(); }
  });
  const deleteMutation = trpc.bannerSlides.delete.useMutation({
    onSuccess: () => { utils.bannerSlides.listAll.invalidate(); utils.bannerSlides.list.invalidate(); toast.success("已刪除"); }
  });
  const uploadMutation = trpc.bannerSlides.uploadImage.useMutation();

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [link, setLink] = useState("");
  const [uploading, setUploading] = useState(false);

  const resetForm = () => { setTitle(""); setSubtitle(""); setLink(""); };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!title.trim()) { toast.error("請先填寫 Banner 標題"); return; }
    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (ev) => {
        try {
          const base64 = ev.target?.result as string;
          const result = await uploadMutation.mutateAsync({ base64, fileName: file.name, mimeType: file.type });
          await createMutation.mutateAsync({ title, subtitle: subtitle || undefined, imageUrl: result.url, imageKey: result.key, externalLink: link || undefined, sortOrder: (banners?.length ?? 0) + 1 });
        } catch { toast.error("上傳失敗，請確認 S3 設定"); }
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch { toast.error("讀取檔案失敗"); setUploading(false); }
    e.target.value = "";
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif font-bold border-b pb-4">首頁 Banner 輪播管理</h2>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 space-y-3">
        <p className="font-semibold text-blue-900">新增 Banner（Banner 固定顯示於首頁輪播）</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div><Label>標題 *</Label><Input className="mt-1" value={title} onChange={e => setTitle(e.target.value)} placeholder="青山國小母語教育" /></div>
          <div><Label>副標題</Label><Input className="mt-1" value={subtitle} onChange={e => setSubtitle(e.target.value)} placeholder="傳承母語文化" /></div>
          <div><Label>點擊連結（選填）</Label><Input className="mt-1" value={link} onChange={e => setLink(e.target.value)} placeholder="https://..." /></div>
          <div><Label>圖片 *</Label><Input className="mt-1" type="file" accept="image/*" onChange={handleUpload} disabled={uploading} /></div>
        </div>
        {uploading && <p className="text-sm text-blue-700">上傳中...</p>}
      </div>
      <div className="space-y-3">
        <h3 className="font-semibold">現有 Banner（共 {banners?.length ?? 0} 張）</h3>
        {banners?.length === 0 && <p className="text-sm text-muted-foreground py-4 text-center">尚無 Banner</p>}
        {banners?.map((b) => (
          <div key={b.id} className="flex items-center gap-4 border rounded-lg p-3 bg-white">
            <img src={b.imageUrl} alt={b.title} className="w-24 h-16 object-cover rounded" />
            <div className="flex-1">
              <p className="font-medium">{b.title}</p>
              {b.subtitle && <p className="text-sm text-muted-foreground">{b.subtitle}</p>}
            </div>
            <Button size="sm" variant="outline" className="text-red-600" onClick={() => deleteMutation.mutate({ id: b.id })}><Trash2 className="w-4 h-4" /></Button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 2. 影音管理
// ─────────────────────────────────────────────
function VideoManager() {
  const utils = trpc.useUtils();
  const { data: videos } = trpc.videos.listAll.useQuery();
  const createMutation = trpc.videos.create.useMutation({
    onSuccess: () => { utils.videos.listAll.invalidate(); utils.videos.list.invalidate(); toast.success("影片已新增"); resetForm(); }
  });
  const deleteMutation = trpc.videos.delete.useMutation({
    onSuccess: () => { utils.videos.listAll.invalidate(); utils.videos.list.invalidate(); toast.success("已刪除"); }
  });
  const updateMutation = trpc.videos.update.useMutation({
    onSuccess: () => { utils.videos.listAll.invalidate(); utils.videos.list.invalidate(); toast.success("已更新"); setEditId(null); }
  });

  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("閩南語");
  const [category, setCategory] = useState("一般");
  const [pageKey, setPageKey] = useState("media-gallery");
  const [editId, setEditId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editPageKey, setEditPageKey] = useState("media-gallery");

  const resetForm = () => { setTitle(""); setVideoUrl(""); setDescription(""); setLanguage("閩南語"); setCategory("一般"); setPageKey("media-gallery"); };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif font-bold border-b pb-4">影音管理</h2>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 space-y-3">
        <p className="font-semibold text-blue-900">新增影片</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div><Label>標題 *</Label><Input className="mt-1" value={title} onChange={e => setTitle(e.target.value)} placeholder="閩南語童謠教學" /></div>
          <div><Label>YouTube 連結 *</Label><Input className="mt-1" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..." /></div>
          <div><Label>語言</Label>
            <select className="mt-1 w-full h-10 px-3 rounded-md border text-sm bg-white" value={language} onChange={e => setLanguage(e.target.value)}>
              {["閩南語","客家語","原住民族語","新住民語文","一般"].map(l => <option key={l}>{l}</option>)}
            </select>
          </div>
          <div><Label>分類</Label><Input className="mt-1" value={category} onChange={e => setCategory(e.target.value)} placeholder="童謠、故事、對話..." /></div>
          <div className="md:col-span-2"><Label>描述</Label><Input className="mt-1" value={description} onChange={e => setDescription(e.target.value)} placeholder="影片簡介" /></div>
          <div className="md:col-span-2"><PageSelect value={pageKey} onChange={setPageKey} /></div>
        </div>
        <Button onClick={() => { if (!title.trim() || !videoUrl.trim()) { toast.error("請填寫標題和影片連結"); return; } createMutation.mutate({ title, videoUrl, description: description || undefined, language, category, pageKey }); }} disabled={createMutation.isPending} className="bg-green-600 hover:bg-green-700 text-white"><Plus className="w-4 h-4 mr-2" />新增影片</Button>
      </div>
      <div className="space-y-3">
        <h3 className="font-semibold">現有影片（共 {videos?.length ?? 0} 筆）</h3>
        {videos?.length === 0 && <p className="text-sm text-muted-foreground py-4 text-center">尚無影片</p>}
        {videos?.map((v) => (
          <div key={v.id} className="border rounded-lg p-4 bg-white">
            {editId === v.id ? (
              <div className="space-y-2">
                <Input value={editTitle} onChange={e => setEditTitle(e.target.value)} placeholder="標題" />
                <Input value={editUrl} onChange={e => setEditUrl(e.target.value)} placeholder="YouTube 連結" />
                <Input value={editDesc} onChange={e => setEditDesc(e.target.value)} placeholder="描述" />
                <PageSelect value={editPageKey} onChange={setEditPageKey} />
                <div className="flex gap-2">
                  <Button size="sm" className="bg-green-600 text-white" onClick={() => updateMutation.mutate({ id: v.id, title: editTitle, videoUrl: editUrl, description: editDesc, pageKey: editPageKey })}><Check className="w-4 h-4 mr-1" />儲存</Button>
                  <Button size="sm" variant="outline" onClick={() => setEditId(null)}><X className="w-4 h-4 mr-1" />取消</Button>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <p className="font-medium">{v.title}</p>
                  <p className="text-xs text-muted-foreground">{v.language} · {v.category}</p>
                  <p className="text-xs text-blue-600 truncate">{v.videoUrl}</p>
                  <p className="text-xs mt-1 px-2 py-0.5 rounded-full bg-green-100 text-green-800 inline-block">
                    → {PAGE_OPTIONS.find(p => p.value === v.pageKey)?.label ?? v.pageKey}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => { setEditId(v.id); setEditTitle(v.title); setEditUrl(v.videoUrl); setEditDesc(v.description ?? ""); setEditPageKey(v.pageKey ?? "media-gallery"); }}><Pencil className="w-4 h-4" /></Button>
                  <Button size="sm" variant="outline" className="text-red-600" onClick={() => deleteMutation.mutate({ id: v.id })}><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 3. 照片相簿管理
// ─────────────────────────────────────────────
function PhotoManager() {
  const utils = trpc.useUtils();
  const { data: photos } = trpc.photos.listAll.useQuery();
  const uploadMutation = trpc.upload.uploadBase64.useMutation();
  const createMutation = trpc.photos.create.useMutation({
    onSuccess: () => { utils.photos.listAll.invalidate(); utils.photos.list.invalidate(); toast.success("照片已新增"); resetForm(); }
  });
  const deleteMutation = trpc.photos.delete.useMutation({
    onSuccess: () => { utils.photos.listAll.invalidate(); utils.photos.list.invalidate(); toast.success("已刪除"); }
  });

  const [title, setTitle] = useState("");
  const [album, setAlbum] = useState("母語日活動");
  const [year, setYear] = useState("113");
  const [pageKey, setPageKey] = useState("photo-album");
  const [uploading, setUploading] = useState(false);

  const resetForm = () => { setTitle(""); setAlbum("母語日活動"); setYear("113"); setPageKey("photo-album"); };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!title.trim()) { toast.error("請先填寫照片標題"); return; }
    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (ev) => {
        try {
          const base64Data = (ev.target?.result as string).split(",")[1];
          const result = await uploadMutation.mutateAsync({ fileName: file.name, base64Data, contentType: file.type });
          await createMutation.mutateAsync({ title, imageUrl: result.url, imageKey: result.key, albumName: album, year, pageKey });
        } catch { toast.error("上傳失敗"); }
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch { toast.error("讀取檔案失敗"); setUploading(false); }
    e.target.value = "";
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif font-bold border-b pb-4">照片相簿管理</h2>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 space-y-3">
        <p className="font-semibold text-blue-900">上傳照片</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div><Label>照片標題 *</Label><Input className="mt-1" value={title} onChange={e => setTitle(e.target.value)} placeholder="母語日活動合照" /></div>
          <div><Label>相簿名稱</Label><Input className="mt-1" value={album} onChange={e => setAlbum(e.target.value)} placeholder="母語日活動" /></div>
          <div><Label>學年度</Label><Input className="mt-1" value={year} onChange={e => setYear(e.target.value)} placeholder="113" /></div>
          <div><Label>選擇圖片 *</Label><Input className="mt-1" type="file" accept="image/*" onChange={handleUpload} disabled={uploading} /></div>
          <div className="md:col-span-2"><PageSelect value={pageKey} onChange={setPageKey} /></div>
        </div>
        {uploading && <p className="text-sm text-blue-700">上傳中...</p>}
      </div>
      <div>
        <h3 className="font-semibold mb-3">現有照片（共 {photos?.length ?? 0} 張）</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {photos?.map((p) => (
            <div key={p.id} className="relative group rounded-lg overflow-hidden border bg-white">
              <img src={p.imageUrl} alt={p.title} className="w-full aspect-square object-cover" />
              <div className="p-2">
                <p className="text-xs font-medium truncate">{p.title}</p>
                <p className="text-xs text-muted-foreground">{p.albumName} · {p.year}</p>
                <p className="text-xs mt-1 px-1.5 py-0.5 rounded-full bg-green-100 text-green-800 inline-block truncate max-w-full">
                  → {PAGE_OPTIONS.find(opt => opt.value === p.pageKey)?.label ?? p.pageKey}
                </p>
              </div>
              <button className="absolute top-2 right-2 w-7 h-7 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => deleteMutation.mutate({ id: p.id })}>
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          {photos?.length === 0 && <p className="text-sm text-muted-foreground py-4 col-span-4 text-center">尚無照片</p>}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 4. 課程計畫管理
// ─────────────────────────────────────────────
function PlanManager() {
  const utils = trpc.useUtils();
  const { data: plans } = trpc.plans.listAll.useQuery();
  const createMutation = trpc.plans.create.useMutation({
    onSuccess: () => { utils.plans.listAll.invalidate(); toast.success("計畫已新增"); resetForm(); }
  });
  const deleteMutation = trpc.plans.delete.useMutation({
    onSuccess: () => { utils.plans.listAll.invalidate(); toast.success("已刪除"); }
  });

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [externalUrl, setExternalUrl] = useState("");
  const [type, setType] = useState<"mother_tongue_day"|"curriculum_plan"|"teaching_material"|"other">("curriculum_plan");
  const [year, setYear] = useState("113");

  const resetForm = () => { setTitle(""); setDescription(""); setExternalUrl(""); setType("curriculum_plan"); setYear("113"); };

  const TYPE_LABELS: Record<string, string> = {
    mother_tongue_day: "02 母語日活動",
    curriculum_plan: "01 課程計畫",
    teaching_material: "05 自編教材",
    other: "其他",
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif font-bold border-b pb-4">課程計畫管理</h2>
      <p className="text-sm text-muted-foreground -mt-4">計畫類型即對應前台頁面：課程計畫→01、母語日活動→02、自編教材→05</p>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 space-y-3">
        <p className="font-semibold text-blue-900">新增計畫</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div><Label>標題 *</Label><Input className="mt-1" value={title} onChange={e => setTitle(e.target.value)} placeholder="113學年度課程計畫" /></div>
          <div><Label>類型（對應前台頁面）</Label>
            <select className="mt-1 w-full h-10 px-3 rounded-md border text-sm bg-white" value={type} onChange={e => setType(e.target.value as any)}>
              <option value="curriculum_plan">01 本土語課程計畫</option>
              <option value="mother_tongue_day">02 母語日活動實施計畫及成果</option>
              <option value="teaching_material">05 自編本土語教材</option>
              <option value="other">其他</option>
            </select>
          </div>
          <div><Label>學年度</Label><Input className="mt-1" value={year} onChange={e => setYear(e.target.value)} placeholder="113" /></div>
          <div><Label>外部連結（Google Drive 等）</Label><Input className="mt-1" value={externalUrl} onChange={e => setExternalUrl(e.target.value)} placeholder="https://drive.google.com/..." /></div>
          <div className="md:col-span-2"><Label>描述</Label><Textarea className="mt-1" value={description} onChange={e => setDescription(e.target.value)} placeholder="計畫簡介" rows={2} /></div>
        </div>
        <Button onClick={() => { if (!title.trim()) { toast.error("請填寫標題"); return; } createMutation.mutate({ title, description: description || undefined, externalUrl: externalUrl || undefined, type, year }); }} disabled={createMutation.isPending} className="bg-green-600 hover:bg-green-700 text-white"><Plus className="w-4 h-4 mr-2" />新增</Button>
      </div>
      <div className="space-y-3">
        <h3 className="font-semibold">現有計畫（共 {plans?.length ?? 0} 筆）</h3>
        {plans?.length === 0 && <p className="text-sm text-muted-foreground py-4 text-center">尚無計畫</p>}
        {plans?.map((p) => (
          <div key={p.id} className="flex items-start gap-3 border rounded-lg p-4 bg-white">
            <div className="flex-1">
              <p className="font-medium">{p.title}</p>
              <p className="text-xs text-muted-foreground">{p.year}學年度</p>
              <p className="text-xs mt-1 px-2 py-0.5 rounded-full bg-green-100 text-green-800 inline-block">→ {TYPE_LABELS[p.type]}</p>
              {p.externalUrl && <a href={p.externalUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline ml-2">開啟連結</a>}
            </div>
            <Button size="sm" variant="outline" className="text-red-600" onClick={() => deleteMutation.mutate({ id: p.id })}><Trash2 className="w-4 h-4" /></Button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 5. 公告管理
// ─────────────────────────────────────────────
function AnnouncementManager() {
  const utils = trpc.useUtils();
  const { data: announcements } = trpc.announcements.listAll.useQuery();
  const createMutation = trpc.announcements.create.useMutation({
    onSuccess: () => { utils.announcements.listAll.invalidate(); utils.announcements.list.invalidate(); toast.success("公告已新增"); setTitle(""); setContent(""); setPageKey("home"); }
  });
  const deleteMutation = trpc.announcements.delete.useMutation({
    onSuccess: () => { utils.announcements.listAll.invalidate(); utils.announcements.list.invalidate(); toast.success("已刪除"); }
  });
  const updateMutation = trpc.announcements.update.useMutation({
    onSuccess: () => { utils.announcements.listAll.invalidate(); utils.announcements.list.invalidate(); toast.success("已更新"); setEditId(null); }
  });

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [pageKey, setPageKey] = useState("home");
  const [editId, setEditId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editPageKey, setEditPageKey] = useState("home");

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif font-bold border-b pb-4">公告管理</h2>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 space-y-3">
        <p className="font-semibold text-blue-900">新增公告</p>
        <div><Label>標題 *</Label><Input className="mt-1" value={title} onChange={e => setTitle(e.target.value)} placeholder="113學年度母語日活動通知" /></div>
        <div><Label>內容</Label><Textarea className="mt-1" value={content} onChange={e => setContent(e.target.value)} placeholder="公告內容..." rows={3} /></div>
        <PageSelect value={pageKey} onChange={setPageKey} />
        <Button onClick={() => { if (!title.trim()) { toast.error("請填寫標題"); return; } createMutation.mutate({ title, content, pageKey }); }} disabled={createMutation.isPending} className="bg-green-600 hover:bg-green-700 text-white"><Plus className="w-4 h-4 mr-2" />新增公告</Button>
      </div>
      <div className="space-y-3">
        <h3 className="font-semibold">現有公告（共 {announcements?.length ?? 0} 筆）</h3>
        {announcements?.length === 0 && <p className="text-sm text-muted-foreground py-4 text-center">尚無公告</p>}
        {announcements?.map((a) => (
          <div key={a.id} className="border rounded-lg p-4 bg-white">
            {editId === a.id ? (
              <div className="space-y-2">
                <Input value={editTitle} onChange={e => setEditTitle(e.target.value)} />
                <Textarea value={editContent} onChange={e => setEditContent(e.target.value)} rows={2} />
                <PageSelect value={editPageKey} onChange={setEditPageKey} />
                <div className="flex gap-2">
                  <Button size="sm" className="bg-green-600 text-white" onClick={() => updateMutation.mutate({ id: a.id, title: editTitle, content: editContent, pageKey: editPageKey })}><Check className="w-4 h-4 mr-1" />儲存</Button>
                  <Button size="sm" variant="outline" onClick={() => setEditId(null)}><X className="w-4 h-4 mr-1" />取消</Button>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <p className="font-medium">{a.title}</p>
                  {a.content && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{a.content}</p>}
                  <p className="text-xs mt-1 px-2 py-0.5 rounded-full bg-green-100 text-green-800 inline-block">
                    → {PAGE_OPTIONS.find(p => p.value === a.pageKey)?.label ?? a.pageKey}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => { setEditId(a.id); setEditTitle(a.title); setEditContent(a.content ?? ""); setEditPageKey(a.pageKey ?? "home"); }}><Pencil className="w-4 h-4" /></Button>
                  <Button size="sm" variant="outline" className="text-red-600" onClick={() => deleteMutation.mutate({ id: a.id })}><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Dashboard
// ─────────────────────────────────────────────
const SECTIONS = [
  { id: "banner", label: "Banner 輪播", icon: Upload },
  { id: "videos", label: "影音管理", icon: Music },
  { id: "photos", label: "照片相簿", icon: Image },
  { id: "plans", label: "課程計畫", icon: BookOpen },
  { id: "announcements", label: "公告管理", icon: Megaphone },
];

export default function AdminDashboard() {
  const { user, loading, isAuthenticated } = useAuth();
  const [active, setActive] = useState("banner");
  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => { localStorage.removeItem("admin_password"); window.location.href = "/login"; }
  });

  if (loading) return <div className="flex items-center justify-center h-screen text-sm">載入中...</div>;

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">管理員權限不足</h1>
          <Button onClick={() => window.location.href = getLoginUrl()}>返回登入</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-56 bg-white border-r flex flex-col">
        <div className="p-5 border-b">
          <h1 className="font-serif font-bold text-lg">管理後台</h1>
          <p className="text-xs text-muted-foreground mt-0.5">青山國小母語網站</p>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {SECTIONS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActive(id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm flex items-center gap-2.5 transition-colors ${active === id ? "bg-blue-100 text-blue-900 font-semibold" : "text-gray-700 hover:bg-gray-100"}`}>
              <Icon className="w-4 h-4 flex-shrink-0" />{label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t">
          <Button variant="outline" className="w-full text-sm" onClick={() => logoutMutation.mutate()}>
            <LogOut className="w-4 h-4 mr-2" />登出
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl">
          {active === "banner" && <BannerManager />}
          {active === "videos" && <VideoManager />}
          {active === "photos" && <PhotoManager />}
          {active === "plans" && <PlanManager />}
          {active === "announcements" && <AnnouncementManager />}
        </div>
      </div>
    </div>
  );
}
