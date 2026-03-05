import { useState, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import {
  LayoutDashboard, Film, Image, FileText, Bell, Settings,
  Plus, Pencil, Trash2, Check, X, Upload, Link, Eye, EyeOff,
  Video, Calendar, BookOpen, LogOut, ChevronRight, BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// ── Admin Sidebar ─────────────────────────────────────────────────────────────
const ADMIN_SECTIONS = [
  { id: "overview", label: "總覽", icon: LayoutDashboard },
  { id: "videos", label: "影音管理", icon: Film },
  { id: "photos", label: "照片管理", icon: Image },
  { id: "plans", label: "計畫連結管理", icon: FileText },
  { id: "announcements", label: "最新消息管理", icon: Bell },
  { id: "feedbacks", label: "留言審核", icon: Settings },
];

// ── Overview Stats ────────────────────────────────────────────────────────────
function OverviewSection() {
  const { data: stats } = trpc.dashboard.stats.useQuery();
  const cards = [
    { label: "教學影音", value: stats?.videos ?? 0, icon: Video, color: "oklch(0.45 0.14 25)" },
    { label: "活動照片", value: stats?.photos ?? 0, icon: Image, color: "oklch(0.42 0.12 220)" },
    { label: "最新消息", value: stats?.announcements ?? 0, icon: Bell, color: "oklch(0.38 0.12 163)" },
    { label: "留言回饋", value: stats?.feedbacks ?? 0, icon: BarChart3, color: "oklch(0.55 0.14 45)" },
  ];

  return (
    <div>
      <h2 className="text-xl font-serif font-bold mb-5" style={{ color: "oklch(0.18 0.02 200)" }}>管理總覽</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl border border-border p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${card.color}1a` }}>
                <card.icon className="w-5 h-5" style={{ color: card.color }} />
              </div>
            </div>
            <p className="text-3xl font-bold font-serif mb-1" style={{ color: "oklch(0.18 0.02 200)" }}>{card.value}</p>
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>{card.label}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
        <h3 className="font-medium mb-3" style={{ color: "oklch(0.18 0.02 200)" }}>快速操作</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "新增影音", icon: Film, section: "videos" },
            { label: "上傳照片", icon: Image, section: "photos" },
            { label: "更新計畫", icon: FileText, section: "plans" },
            { label: "發布消息", icon: Bell, section: "announcements" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-colors"
              style={{ background: "oklch(0.94 0.02 155)" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "oklch(0.88 0.04 155)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "oklch(0.94 0.02 155)")}>
              <item.icon className="w-4 h-4" style={{ color: "oklch(0.38 0.12 163)" }} />
              <span className="text-sm font-medium" style={{ color: "oklch(0.18 0.02 200)" }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Video Management ──────────────────────────────────────────────────────────
function VideoManagement() {
  const utils = trpc.useUtils();
  const { data: videos, isLoading } = trpc.videos.adminList.useQuery();
  const createVideo = trpc.videos.create.useMutation({ onSuccess: () => { utils.videos.adminList.invalidate(); toast.success("影音已新增"); setShowForm(false); resetForm(); } });
  const updateVideo = trpc.videos.update.useMutation({ onSuccess: () => { utils.videos.adminList.invalidate(); toast.success("影音已更新"); setEditId(null); } });
  const deleteVideo = trpc.videos.delete.useMutation({ onSuccess: () => { utils.videos.adminList.invalidate(); toast.success("影音已刪除"); } });

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ title: "", description: "", videoUrl: "", language: "閩南語", category: "一般", sortOrder: 0 });

  const resetForm = () => setForm({ title: "", description: "", videoUrl: "", language: "閩南語", category: "一般", sortOrder: 0 });

  const handleSubmit = () => {
    if (!form.title || !form.videoUrl) return toast.error("請填寫標題與影音連結");
    if (editId) {
      updateVideo.mutate({ id: editId, ...form });
    } else {
      createVideo.mutate(form);
    }
  };

  const startEdit = (v: any) => {
    setEditId(v.id);
    setForm({ title: v.title, description: v.description ?? "", videoUrl: v.videoUrl, language: v.language, category: v.category, sortOrder: v.sortOrder });
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-serif font-bold" style={{ color: "oklch(0.18 0.02 200)" }}>教學影音管理</h2>
        <Button onClick={() => { setShowForm(!showForm); setEditId(null); resetForm(); }} className="gap-2 text-white" style={{ background: "oklch(0.38 0.12 163)" }}>
          <Plus className="w-4 h-4" /> 新增影音
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-border p-5 mb-5 shadow-sm animate-fade-in">
          <h3 className="font-medium mb-4" style={{ color: "oklch(0.18 0.02 200)" }}>{editId ? "編輯影音" : "新增影音"}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label className="text-sm mb-1.5 block">影音標題 *</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="例：閩南語童謠教學" />
            </div>
            <div className="md:col-span-2">
              <Label className="text-sm mb-1.5 block">影音連結 * (YouTube / 其他平台)</Label>
              <div className="flex gap-2">
                <Link className="w-4 h-4 mt-3 flex-shrink-0" style={{ color: "var(--muted-foreground)" }} />
                <Input value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} placeholder="https://www.youtube.com/watch?v=..." />
              </div>
            </div>
            <div>
              <Label className="text-sm mb-1.5 block">語言別</Label>
              <select value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })}
                className="w-full h-10 px-3 rounded-md border text-sm" style={{ borderColor: "var(--border)" }}>
                {["閩南語", "客家語", "原住民族語", "新住民語文", "一般"].map((l) => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <Label className="text-sm mb-1.5 block">分類</Label>
              <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="童謠、故事、歌謠..." />
            </div>
            <div className="md:col-span-2">
              <Label className="text-sm mb-1.5 block">說明</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="影音說明..." rows={2} />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <Button onClick={handleSubmit} disabled={createVideo.isPending || updateVideo.isPending} className="gap-2 text-white" style={{ background: "oklch(0.38 0.12 163)" }}>
              <Check className="w-4 h-4" /> {editId ? "更新" : "新增"}
            </Button>
            <Button variant="outline" onClick={() => { setShowForm(false); setEditId(null); }}>取消</Button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="space-y-3">
        {isLoading ? Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-16 rounded-xl animate-pulse" style={{ background: "var(--muted)" }} />
        )) : videos?.map((v) => (
          <div key={v.id} className="bg-white rounded-xl border border-border p-4 flex items-center gap-3 shadow-sm">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "oklch(0.45 0.14 25 / 0.1)" }}>
              <Film className="w-5 h-5" style={{ color: "oklch(0.45 0.14 25)" }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{v.title}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge className="text-xs text-white" style={{ background: "oklch(0.38 0.12 163)", border: "none" }}>{v.language}</Badge>
                <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>{v.category}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button size="sm" variant="ghost" onClick={() => updateVideo.mutate({ id: v.id, isActive: !v.isActive })}>
                {v.isActive ? <Eye className="w-4 h-4" style={{ color: "oklch(0.38 0.12 163)" }} /> : <EyeOff className="w-4 h-4" style={{ color: "var(--muted-foreground)" }} />}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => startEdit(v)}>
                <Pencil className="w-4 h-4" style={{ color: "oklch(0.55 0.14 45)" }} />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => { if (confirm("確定刪除？")) deleteVideo.mutate({ id: v.id }); }}>
                <Trash2 className="w-4 h-4" style={{ color: "oklch(0.55 0.20 25)" }} />
              </Button>
            </div>
          </div>
        ))}
        {!isLoading && (!videos || videos.length === 0) && (
          <div className="text-center py-10 rounded-xl border border-dashed border-border">
            <Film className="w-10 h-10 mx-auto mb-2 opacity-30" style={{ color: "oklch(0.38 0.12 163)" }} />
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>尚無影音資源，點擊「新增影音」開始新增</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Photo Management ──────────────────────────────────────────────────────────
function PhotoManagement() {
  const utils = trpc.useUtils();
  const { data: photos, isLoading } = trpc.photos.adminList.useQuery();
  const createPhoto = trpc.photos.create.useMutation({ onSuccess: () => { utils.photos.adminList.invalidate(); toast.success("照片已新增"); setShowForm(false); resetForm(); } });
  const deletePhoto = trpc.photos.delete.useMutation({ onSuccess: () => { utils.photos.adminList.invalidate(); toast.success("照片已刪除"); } });
  const uploadBase64 = trpc.upload.uploadBase64.useMutation();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", imageUrl: "", albumName: "母語日活動", year: new Date().getFullYear().toString() });
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const resetForm = () => { setForm({ title: "", description: "", imageUrl: "", albumName: "母語日活動", year: new Date().getFullYear().toString() }); setPreviewUrl(""); };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return toast.error("檔案大小不可超過 5MB");
    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const base64 = (ev.target?.result as string).split(",")[1];
        const result = await uploadBase64.mutateAsync({ base64, contentType: file.type, folder: "photos", filename: file.name });
        setForm((f) => ({ ...f, imageUrl: result.url }));
        setPreviewUrl(result.url);
        setUploading(false);
        toast.success("照片上傳成功");
      };
      reader.readAsDataURL(file);
    } catch {
      toast.error("上傳失敗，請稍後再試");
      setUploading(false);
    }
  };

  const handleSubmit = () => {
    if (!form.title || !form.imageUrl) return toast.error("請填寫標題並上傳照片");
    createPhoto.mutate(form);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-serif font-bold" style={{ color: "oklch(0.18 0.02 200)" }}>活動照片管理</h2>
        <Button onClick={() => { setShowForm(!showForm); resetForm(); }} className="gap-2 text-white" style={{ background: "oklch(0.38 0.12 163)" }}>
          <Plus className="w-4 h-4" /> 上傳照片
        </Button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-border p-5 mb-5 shadow-sm animate-fade-in">
          <h3 className="font-medium mb-4" style={{ color: "oklch(0.18 0.02 200)" }}>上傳新照片</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Upload Area */}
            <div className="md:col-span-2">
              <Label className="text-sm mb-1.5 block">照片上傳 *</Label>
              <div
                className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors"
                style={{ borderColor: previewUrl ? "oklch(0.38 0.12 163)" : "var(--border)" }}
                onClick={() => fileRef.current?.click()}
              >
                {previewUrl ? (
                  <div className="relative">
                    <img src={previewUrl} alt="預覽" className="max-h-40 mx-auto rounded-lg object-cover" />
                    <p className="text-xs mt-2" style={{ color: "oklch(0.38 0.12 163)" }}>點擊更換照片</p>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-8 h-8 mx-auto mb-2 opacity-40" style={{ color: "oklch(0.38 0.12 163)" }} />
                    <p className="text-sm font-medium" style={{ color: "oklch(0.18 0.02 200)" }}>
                      {uploading ? "上傳中..." : "點擊或拖曳上傳照片"}
                    </p>
                    <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>支援 JPG、PNG，最大 5MB</p>
                  </div>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </div>
            <div>
              <Label className="text-sm mb-1.5 block">照片標題 *</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="例：母語日活動精彩瞬間" />
            </div>
            <div>
              <Label className="text-sm mb-1.5 block">相簿名稱</Label>
              <Input value={form.albumName} onChange={(e) => setForm({ ...form, albumName: e.target.value })} placeholder="母語日活動" />
            </div>
            <div>
              <Label className="text-sm mb-1.5 block">年份</Label>
              <Input value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} placeholder="2024" />
            </div>
            <div>
              <Label className="text-sm mb-1.5 block">說明</Label>
              <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="照片說明..." />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <Button onClick={handleSubmit} disabled={createPhoto.isPending || uploading} className="gap-2 text-white" style={{ background: "oklch(0.38 0.12 163)" }}>
              <Check className="w-4 h-4" /> 儲存照片
            </Button>
            <Button variant="outline" onClick={() => { setShowForm(false); resetForm(); }}>取消</Button>
          </div>
        </div>
      )}

      {/* Photo Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {isLoading ? Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-square rounded-xl animate-pulse" style={{ background: "var(--muted)" }} />
        )) : photos?.map((p) => (
          <div key={p.id} className="relative aspect-square rounded-xl overflow-hidden group shadow-sm">
            <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-300 flex flex-col items-center justify-center gap-2">
              <p className="text-white text-xs text-center px-2 opacity-0 group-hover:opacity-100 transition-opacity font-medium">{p.title}</p>
              <Button size="sm" variant="destructive" className="opacity-0 group-hover:opacity-100 transition-opacity gap-1"
                onClick={() => { if (confirm("確定刪除此照片？")) deletePhoto.mutate({ id: p.id }); }}>
                <Trash2 className="w-3 h-3" /> 刪除
              </Button>
            </div>
            {!p.isActive && (
              <div className="absolute top-2 right-2">
                <span className="px-1.5 py-0.5 rounded text-xs bg-black/60 text-white">隱藏</span>
              </div>
            )}
          </div>
        ))}
      </div>
      {!isLoading && (!photos || photos.length === 0) && (
        <div className="text-center py-10 rounded-xl border border-dashed border-border">
          <Image className="w-10 h-10 mx-auto mb-2 opacity-30" style={{ color: "oklch(0.38 0.12 163)" }} />
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>尚無照片，點擊「上傳照片」開始新增</p>
        </div>
      )}
    </div>
  );
}

// ── Plans Management ──────────────────────────────────────────────────────────
function PlansManagement() {
  const utils = trpc.useUtils();
  const { data: plans, isLoading } = trpc.plans.adminList.useQuery();
  const createPlan = trpc.plans.create.useMutation({ onSuccess: () => { utils.plans.adminList.invalidate(); toast.success("計畫已新增"); setShowForm(false); resetForm(); } });
  const updatePlan = trpc.plans.update.useMutation({ onSuccess: () => { utils.plans.adminList.invalidate(); toast.success("計畫已更新"); setEditId(null); setShowForm(false); } });
  const deletePlan = trpc.plans.delete.useMutation({ onSuccess: () => { utils.plans.adminList.invalidate(); toast.success("計畫已刪除"); } });

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ type: "mother_tongue_day" as const, title: "", description: "", externalUrl: "", year: new Date().getFullYear().toString() });

  const resetForm = () => setForm({ type: "mother_tongue_day", title: "", description: "", externalUrl: "", year: new Date().getFullYear().toString() });

  const TYPE_LABELS: Record<string, string> = {
    mother_tongue_day: "母語日實施計畫",
    curriculum_plan: "本土語課程計畫",
    teaching_material: "自編教材",
    other: "其他",
  };

  const handleSubmit = () => {
    if (!form.title) return toast.error("請填寫計畫標題");
    if (editId) {
      updatePlan.mutate({ id: editId, ...form });
    } else {
      createPlan.mutate(form);
    }
  };

  const startEdit = (p: any) => {
    setEditId(p.id);
    setForm({ type: p.type, title: p.title, description: p.description ?? "", externalUrl: p.externalUrl ?? "", year: p.year });
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-serif font-bold" style={{ color: "oklch(0.18 0.02 200)" }}>計畫連結管理</h2>
        <Button onClick={() => { setShowForm(!showForm); setEditId(null); resetForm(); }} className="gap-2 text-white" style={{ background: "oklch(0.38 0.12 163)" }}>
          <Plus className="w-4 h-4" /> 新增計畫
        </Button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-border p-5 mb-5 shadow-sm animate-fade-in">
          <h3 className="font-medium mb-4" style={{ color: "oklch(0.18 0.02 200)" }}>{editId ? "編輯計畫" : "新增計畫連結"}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm mb-1.5 block">計畫類型 *</Label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                className="w-full h-10 px-3 rounded-md border text-sm" style={{ borderColor: "var(--border)" }}>
                {Object.entries(TYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div>
              <Label className="text-sm mb-1.5 block">學年度</Label>
              <Input value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} placeholder="2024" />
            </div>
            <div className="md:col-span-2">
              <Label className="text-sm mb-1.5 block">計畫標題 *</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="例：113學年度臺灣母語日實施計畫" />
            </div>
            <div className="md:col-span-2">
              <Label className="text-sm mb-1.5 block">外部連結（Google Drive / 學校網站等）</Label>
              <div className="flex gap-2 items-center">
                <Link className="w-4 h-4 flex-shrink-0" style={{ color: "var(--muted-foreground)" }} />
                <Input value={form.externalUrl} onChange={(e) => setForm({ ...form, externalUrl: e.target.value })} placeholder="https://..." />
              </div>
            </div>
            <div className="md:col-span-2">
              <Label className="text-sm mb-1.5 block">說明</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="計畫說明..." rows={2} />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <Button onClick={handleSubmit} disabled={createPlan.isPending || updatePlan.isPending} className="gap-2 text-white" style={{ background: "oklch(0.38 0.12 163)" }}>
              <Check className="w-4 h-4" /> {editId ? "更新" : "新增"}
            </Button>
            <Button variant="outline" onClick={() => { setShowForm(false); setEditId(null); }}>取消</Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {isLoading ? Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-16 rounded-xl animate-pulse" style={{ background: "var(--muted)" }} />
        )) : plans?.map((p) => (
          <div key={p.id} className="bg-white rounded-xl border border-border p-4 flex items-center gap-3 shadow-sm">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "oklch(0.55 0.14 45 / 0.1)" }}>
              <FileText className="w-5 h-5" style={{ color: "oklch(0.55 0.14 45)" }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{p.title}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge variant="secondary" className="text-xs">{p.year}</Badge>
                <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>{TYPE_LABELS[p.type]}</span>
                {p.externalUrl && <span className="text-xs" style={{ color: "oklch(0.38 0.12 163)" }}>有連結</span>}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button size="sm" variant="ghost" onClick={() => startEdit(p)}>
                <Pencil className="w-4 h-4" style={{ color: "oklch(0.55 0.14 45)" }} />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => { if (confirm("確定刪除？")) deletePlan.mutate({ id: p.id }); }}>
                <Trash2 className="w-4 h-4" style={{ color: "oklch(0.55 0.20 25)" }} />
              </Button>
            </div>
          </div>
        ))}
        {!isLoading && (!plans || plans.length === 0) && (
          <div className="text-center py-10 rounded-xl border border-dashed border-border">
            <FileText className="w-10 h-10 mx-auto mb-2 opacity-30" style={{ color: "oklch(0.38 0.12 163)" }} />
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>尚無計畫，點擊「新增計畫」開始新增</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Announcements Management ──────────────────────────────────────────────────
function AnnouncementsManagement() {
  const utils = trpc.useUtils();
  const { data: items, isLoading } = trpc.announcements.adminList.useQuery();
  const createItem = trpc.announcements.create.useMutation({ onSuccess: () => { utils.announcements.adminList.invalidate(); toast.success("消息已新增"); setShowForm(false); resetForm(); } });
  const updateItem = trpc.announcements.update.useMutation({ onSuccess: () => { utils.announcements.adminList.invalidate(); toast.success("消息已更新"); setEditId(null); setShowForm(false); } });
  const deleteItem = trpc.announcements.delete.useMutation({ onSuccess: () => { utils.announcements.adminList.invalidate(); toast.success("消息已刪除"); } });

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ title: "", content: "", linkUrl: "" });

  const resetForm = () => setForm({ title: "", content: "", linkUrl: "" });

  const handleSubmit = () => {
    if (!form.title) return toast.error("請填寫消息標題");
    if (editId) {
      updateItem.mutate({ id: editId, ...form });
    } else {
      createItem.mutate(form);
    }
  };

  const startEdit = (item: any) => {
    setEditId(item.id);
    setForm({ title: item.title, content: item.content ?? "", linkUrl: item.linkUrl ?? "" });
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-serif font-bold" style={{ color: "oklch(0.18 0.02 200)" }}>最新消息管理</h2>
        <Button onClick={() => { setShowForm(!showForm); setEditId(null); resetForm(); }} className="gap-2 text-white" style={{ background: "oklch(0.38 0.12 163)" }}>
          <Plus className="w-4 h-4" /> 新增消息
        </Button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-border p-5 mb-5 shadow-sm animate-fade-in">
          <h3 className="font-medium mb-4" style={{ color: "oklch(0.18 0.02 200)" }}>{editId ? "編輯消息" : "新增消息"}</h3>
          <div className="space-y-4">
            <div>
              <Label className="text-sm mb-1.5 block">消息標題 *</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="例：113學年度母語日活動公告" />
            </div>
            <div>
              <Label className="text-sm mb-1.5 block">連結（選填）</Label>
              <Input value={form.linkUrl} onChange={(e) => setForm({ ...form, linkUrl: e.target.value })} placeholder="https://..." />
            </div>
            <div>
              <Label className="text-sm mb-1.5 block">內容說明（選填）</Label>
              <Textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="消息詳細說明..." rows={3} />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <Button onClick={handleSubmit} disabled={createItem.isPending || updateItem.isPending} className="gap-2 text-white" style={{ background: "oklch(0.38 0.12 163)" }}>
              <Check className="w-4 h-4" /> {editId ? "更新" : "發布"}
            </Button>
            <Button variant="outline" onClick={() => { setShowForm(false); setEditId(null); }}>取消</Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {isLoading ? Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-16 rounded-xl animate-pulse" style={{ background: "var(--muted)" }} />
        )) : items?.map((item) => (
          <div key={item.id} className="bg-white rounded-xl border border-border p-4 flex items-center gap-3 shadow-sm">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "oklch(0.38 0.12 163 / 0.1)" }}>
              <Bell className="w-5 h-5" style={{ color: "oklch(0.38 0.12 163)" }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{item.title}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                {new Date(item.publishedAt).toLocaleDateString("zh-TW")}
                {item.linkUrl && <span className="ml-2 text-primary">有連結</span>}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button size="sm" variant="ghost" onClick={() => updateItem.mutate({ id: item.id, isActive: !item.isActive })}>
                {item.isActive ? <Eye className="w-4 h-4" style={{ color: "oklch(0.38 0.12 163)" }} /> : <EyeOff className="w-4 h-4" style={{ color: "var(--muted-foreground)" }} />}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => startEdit(item)}>
                <Pencil className="w-4 h-4" style={{ color: "oklch(0.55 0.14 45)" }} />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => { if (confirm("確定刪除？")) deleteItem.mutate({ id: item.id }); }}>
                <Trash2 className="w-4 h-4" style={{ color: "oklch(0.55 0.20 25)" }} />
              </Button>
            </div>
          </div>
        ))}
        {!isLoading && (!items || items.length === 0) && (
          <div className="text-center py-10 rounded-xl border border-dashed border-border">
            <Bell className="w-10 h-10 mx-auto mb-2 opacity-30" style={{ color: "oklch(0.38 0.12 163)" }} />
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>尚無消息，點擊「新增消息」開始發布</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Feedback Management ───────────────────────────────────────────────────────
function FeedbackManagement() {
  const utils = trpc.useUtils();
  const { data: feedbacks, isLoading } = trpc.feedbacks.adminList.useQuery();
  const approveFeedback = trpc.feedbacks.approve.useMutation({ onSuccess: () => { utils.feedbacks.adminList.invalidate(); toast.success("審核狀態已更新"); } });
  const deleteFeedback = trpc.feedbacks.delete.useMutation({ onSuccess: () => { utils.feedbacks.adminList.invalidate(); toast.success("留言已刪除"); } });

  return (
    <div>
      <h2 className="text-xl font-serif font-bold mb-5" style={{ color: "oklch(0.18 0.02 200)" }}>留言審核</h2>
      <div className="space-y-3">
        {isLoading ? Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-20 rounded-xl animate-pulse" style={{ background: "var(--muted)" }} />
        )) : feedbacks?.map((fb) => (
          <div key={fb.id} className="bg-white rounded-xl border border-border p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="font-medium text-sm">{fb.name}</span>
                  <Badge variant="secondary" className="text-xs">{fb.role}</Badge>
                  {fb.isApproved
                    ? <Badge className="text-xs text-white" style={{ background: "oklch(0.38 0.12 163)", border: "none" }}>已審核</Badge>
                    : <Badge variant="destructive" className="text-xs">待審核</Badge>}
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "oklch(0.30 0.02 200)" }}>{fb.message}</p>
                <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>
                  {new Date(fb.createdAt).toLocaleString("zh-TW")}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button size="sm" variant="ghost" onClick={() => approveFeedback.mutate({ id: fb.id, isApproved: !fb.isApproved })}>
                  {fb.isApproved
                    ? <X className="w-4 h-4" style={{ color: "oklch(0.55 0.20 25)" }} />
                    : <Check className="w-4 h-4" style={{ color: "oklch(0.38 0.12 163)" }} />}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => { if (confirm("確定刪除此留言？")) deleteFeedback.mutate({ id: fb.id }); }}>
                  <Trash2 className="w-4 h-4" style={{ color: "oklch(0.55 0.20 25)" }} />
                </Button>
              </div>
            </div>
          </div>
        ))}
        {!isLoading && (!feedbacks || feedbacks.length === 0) && (
          <div className="text-center py-10 rounded-xl border border-dashed border-border">
            <Settings className="w-10 h-10 mx-auto mb-2 opacity-30" style={{ color: "oklch(0.38 0.12 163)" }} />
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>目前沒有待審核的留言</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Admin Dashboard ──────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const handleLogout = () => logout();
  const [activeSection, setActiveSection] = useState("overview");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--background)" }}>
        <div className="text-center">
          <div className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin mx-auto mb-3" style={{ borderColor: "oklch(0.38 0.12 163)" }} />
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>載入中...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "var(--background)" }}>
        <div className="w-full max-w-sm bg-white rounded-2xl border border-border p-8 shadow-lg text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: "linear-gradient(135deg, oklch(0.38 0.12 163), oklch(0.55 0.10 163))" }}>
            <span className="text-2xl font-bold text-white font-serif">青</span>
          </div>
          <h1 className="text-xl font-serif font-bold mb-2" style={{ color: "oklch(0.18 0.02 200)" }}>管理後台</h1>
          <p className="text-sm mb-6" style={{ color: "var(--muted-foreground)" }}>請登入以存取管理功能</p>
          <a href={getLoginUrl()}>
            <Button className="w-full text-white" style={{ background: "oklch(0.38 0.12 163)" }}>
              登入管理後台
            </Button>
          </a>
        </div>
      </div>
    );
  }

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "var(--background)" }}>
        <div className="w-full max-w-sm bg-white rounded-2xl border border-border p-8 shadow-lg text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "oklch(0.55 0.20 25 / 0.1)" }}>
            <X className="w-8 h-8" style={{ color: "oklch(0.55 0.20 25)" }} />
          </div>
          <h1 className="text-xl font-serif font-bold mb-2" style={{ color: "oklch(0.18 0.02 200)" }}>存取受限</h1>
          <p className="text-sm mb-6" style={{ color: "var(--muted-foreground)" }}>您沒有管理員權限。請聯絡網站管理員。</p>
          <Button variant="outline" onClick={handleLogout}>登出</Button>
        </div>
      </div>
    );
  }

  const SECTION_COMPONENTS: Record<string, React.ReactNode> = {
    overview: <OverviewSection />,
    videos: <VideoManagement />,
    photos: <PhotoManagement />,
    plans: <PlansManagement />,
    announcements: <AnnouncementsManagement />,
    feedbacks: <FeedbackManagement />,
  };

  return (
    <div className="min-h-screen flex" style={{ background: "oklch(0.96 0.01 155)" }}>
      {/* Admin Sidebar */}
      <aside className="w-56 flex-shrink-0 flex flex-col"
        style={{ background: "var(--sidebar)", borderRight: "1px solid var(--sidebar-border)" }}>
        {/* Header */}
        <div className="p-4 border-b" style={{ borderColor: "var(--sidebar-border)" }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, oklch(0.38 0.12 163), oklch(0.55 0.10 163))" }}>
              <span className="text-base font-bold text-white font-serif">青</span>
            </div>
            <div>
              <p className="text-xs font-bold" style={{ color: "var(--sidebar-primary)" }}>管理後台</p>
              <p className="text-xs opacity-60" style={{ color: "var(--sidebar-foreground)" }}>青山國小母語網站</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-2">
          {ADMIN_SECTIONS.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            return (
              <button key={section.id} onClick={() => setActiveSection(section.id)}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg mb-0.5 text-left transition-all duration-200"
                style={isActive
                  ? { background: "oklch(0.42 0.12 163 / 0.20)", color: "var(--sidebar-primary)", borderLeft: "3px solid var(--sidebar-primary)" }
                  : { color: "var(--sidebar-foreground)", borderLeft: "3px solid transparent" }}
                onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "var(--sidebar-accent)"; }}
                onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}>
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="text-xs font-medium">{section.label}</span>
                {isActive && <ChevronRight className="w-3 h-3 ml-auto opacity-60" />}
              </button>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="p-3 border-t" style={{ borderColor: "var(--sidebar-border)" }}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ background: "oklch(0.38 0.12 163)" }}>
              {user?.name?.charAt(0) ?? "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate" style={{ color: "var(--sidebar-foreground)" }}>{user?.name ?? "管理員"}</p>
              <p className="text-xs opacity-60" style={{ color: "var(--sidebar-foreground)" }}>管理員</p>
            </div>
          </div>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-colors"
            style={{ color: "oklch(0.65 0.20 25)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "oklch(0.55 0.20 25 / 0.1)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
            <LogOut className="w-3.5 h-3.5" />
            登出
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6 max-w-5xl">
          {SECTION_COMPONENTS[activeSection]}
        </div>
      </main>
    </div>
  );
}
