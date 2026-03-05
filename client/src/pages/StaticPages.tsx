import { useState } from "react";
import { trpc } from "@/lib/trpc";
import MainLayout from "@/components/MainLayout";
import { GraduationCap, Users, BookOpen, Globe, MessageSquare, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// ── Page Wrapper ──────────────────────────────────────────────────────────────
function PageWrapper({ number, title, icon: Icon, color, description, children }: {
  number: string;
  title: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <MainLayout>
      <div className="p-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}1a` }}>
              <Icon className="w-5 h-5" style={{ color }} />
            </div>
            <div>
              <p className="text-xs font-medium" style={{ color: "oklch(0.38 0.12 163)" }}>{number}</p>
              <h1 className="text-2xl font-serif font-bold" style={{ color: "oklch(0.18 0.02 200)" }}>{title}</h1>
            </div>
          </div>
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>{description}</p>
        </div>
        {children}
      </div>
    </MainLayout>
  );
}

// ── 03. Teacher Certification ─────────────────────────────────────────────────
const TEACHERS = [
  { name: "陳○○", subject: "閩南語", level: "中高級", grade: "1-2年級", note: "臺語認證中高級" },
  { name: "林○○", subject: "客家語", level: "中高級", grade: "3-4年級", note: "客語認證中高級" },
  { name: "王○○", subject: "閩南語", level: "高級", grade: "5-6年級", note: "臺語認證高級" },
  { name: "張○○", subject: "原住民族語", level: "中高級", grade: "1-3年級", note: "阿美語認證中高級" },
];

export function TeacherCertificationPage() {
  return (
    <PageWrapper number="03" title="現職老師參與本土語言認證達中高級以上資格及實際授課一覽表"
      icon={GraduationCap} color="oklch(0.42 0.12 220)"
      description="本校現職教師積極參與本土語言能力認證，提升教學品質">
      <div className="bg-white rounded-xl border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: "oklch(0.38 0.12 163)" }}>
                {["教師姓名", "授課語言", "認證等級", "授課年級", "備註"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-sm font-medium text-white">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TEACHERS.map((t, i) => (
                <tr key={i} className="border-t border-border transition-colors"
                  style={{ background: i % 2 === 0 ? "white" : "oklch(0.98 0.005 150)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "oklch(0.94 0.02 155)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = i % 2 === 0 ? "white" : "oklch(0.98 0.005 150)")}>
                  <td className="px-4 py-3 text-sm font-medium">{t.name}</td>
                  <td className="px-4 py-3 text-sm">{t.subject}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium text-white"
                      style={{ background: t.level === "高級" ? "oklch(0.55 0.14 45)" : "oklch(0.38 0.12 163)" }}>
                      {t.level}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">{t.grade}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: "var(--muted-foreground)" }}>{t.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="mt-4 text-xs" style={{ color: "var(--muted-foreground)" }}>
        ※ 資料依個資保護法規定，教師姓名以○○代替。如需詳細資料，請洽本校教務處。
      </p>
    </PageWrapper>
  );
}

// ── 04. Community Resources ───────────────────────────────────────────────────
const COMMUNITY_ITEMS = [
  { title: "社區耆老語言傳承計畫", desc: "邀請社區長輩進入校園，以生動活潑的方式傳授本土語言與文化知識，讓學生直接接觸真實的語言使用情境。", tag: "社區合作" },
  { title: "家庭母語角設置推廣", desc: "鼓勵家長在家中設置母語角，提供母語繪本、音樂及遊戲，創造家庭母語學習環境。", tag: "家庭參與" },
  { title: "母語日親子共學活動", desc: "每年母語日舉辦親子共學活動，邀請家長一同參與，增進親子間的母語交流。", tag: "親子活動" },
  { title: "社區文化踏查課程", desc: "結合社區文化資源，帶領學生走訪社區，認識在地歷史與語言文化。", tag: "文化踏查" },
];

export function CommunityResourcesPage() {
  return (
    <PageWrapper number="04" title="結合社區、家庭資源推動本土語言教學及母語日活動"
      icon={Users} color="oklch(0.55 0.14 45)"
      description="整合社區與家庭資源，共同推動本土語言教育，建立多元學習環境">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 stagger-children">
        {COMMUNITY_ITEMS.map((item, i) => (
          <div key={i} className="content-card p-5 animate-fade-in-up">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: "oklch(0.55 0.14 45 / 0.1)" }}>
                <Users className="w-4 h-4" style={{ color: "oklch(0.55 0.14 45)" }} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <h3 className="font-medium text-sm" style={{ color: "oklch(0.18 0.02 200)" }}>{item.title}</h3>
                  <span className="px-2 py-0.5 rounded-full text-xs" style={{ background: "oklch(0.88 0.06 85)", color: "oklch(0.25 0.04 85)" }}>
                    {item.tag}
                  </span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>{item.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
}

// ── 06. Special Curriculum ────────────────────────────────────────────────────
const SPECIAL_ITEMS = [
  { title: "閩南語歌謠創作課程", result: "學生創作10首原創閩南語歌謠，並於成果發表會演唱", year: "2024" },
  { title: "客家文化深耕課程", result: "結合客家飲食、服飾、音樂，設計跨領域統整課程", year: "2024" },
  { title: "原住民族語繪本製作", result: "學生以原住民族語創作繪本，並出版校內繪本集", year: "2023" },
  { title: "多語言校園廣播", result: "每週輪流以不同本土語言進行校園廣播，增加語言接觸機會", year: "2023" },
];

export function SpecialCurriculumPage() {
  return (
    <PageWrapper number="06" title="青山特色課程與學習成果"
      icon={BookOpen} color="oklch(0.38 0.12 163)"
      description="青山國小發展具在地特色的本土語課程，展現豐碩的學習成果">
      <div className="space-y-4 stagger-children">
        {SPECIAL_ITEMS.map((item, i) => (
          <div key={i} className="content-card p-5 animate-fade-in-up">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: "oklch(0.38 0.12 163 / 0.1)" }}>
                <span className="font-serif font-bold text-sm" style={{ color: "oklch(0.38 0.12 163)" }}>
                  {item.year}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="font-serif font-semibold mb-1.5" style={{ color: "oklch(0.18 0.02 200)" }}>{item.title}</h3>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "oklch(0.38 0.12 163)" }} />
                  <p className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>{item.result}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
}

// ── 08. Related Websites ──────────────────────────────────────────────────────
const WEBSITES = [
  { name: "教育部本土語言教育資源網", url: "https://blgjh.moe.edu.tw/", desc: "教育部提供的本土語言教育資源與政策說明" },
  { name: "臺灣閩南語常用詞辭典", url: "https://twblg.dict.edu.tw/", desc: "教育部臺灣閩南語常用詞辭典線上查詢" },
  { name: "客家語言學習網", url: "https://www.hakka.gov.tw/", desc: "客家委員會提供的客家語學習資源" },
  { name: "原住民族語言線上學習網", url: "https://alilin.apc.gov.tw/", desc: "原住民族委員會原住民族語言線上學習平台" },
  { name: "教育部語文成就獎", url: "https://language.moe.gov.tw/", desc: "教育部語文相關競賽與獎項資訊" },
  { name: "臺南市本土語言教育資源中心", url: "https://www.tnc.edu.tw/", desc: "臺南市政府教育局本土語言教育相關資源" },
];

export function RelatedWebsitesPage() {
  return (
    <PageWrapper number="08" title="本土語相關網站"
      icon={Globe} color="oklch(0.45 0.14 25)"
      description="精選本土語言學習相關網站，提供豐富的線上學習資源">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 stagger-children">
        {WEBSITES.map((site, i) => (
          <a key={i} href={site.url} target="_blank" rel="noopener noreferrer"
            className="content-card p-5 animate-fade-in-up block group">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors"
                style={{ background: "oklch(0.45 0.14 25 / 0.1)" }}>
                <Globe className="w-4 h-4" style={{ color: "oklch(0.45 0.14 25)" }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <h3 className="font-medium text-sm truncate transition-colors group-hover:text-primary" style={{ color: "oklch(0.18 0.02 200)" }}>
                    {site.name}
                  </h3>
                  <Globe className="w-3 h-3 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "oklch(0.38 0.12 163)" }} />
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "var(--muted-foreground)" }}>{site.desc}</p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </PageWrapper>
  );
}

// ── 09. Feedback ──────────────────────────────────────────────────────────────
export function FeedbackPage() {
  const [form, setForm] = useState({ name: "", email: "", role: "訪客", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const { data: feedbacks } = trpc.feedbacks.list.useQuery();
  const createFeedback = trpc.feedbacks.create.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      setForm({ name: "", email: "", role: "訪客", message: "" });
    },
    onError: () => toast.error("提交失敗，請稍後再試"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.message) return toast.error("請填寫姓名與留言內容");
    createFeedback.mutate(form);
  };

  return (
    <PageWrapper number="09" title="交流分享回饋區"
      icon={MessageSquare} color="oklch(0.42 0.12 163)"
      description="歡迎親師生留言交流，分享您的學習心得與建議">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
          <h3 className="font-serif font-bold mb-4" style={{ color: "oklch(0.18 0.02 200)" }}>留言板</h3>
          {submitted ? (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 mx-auto mb-3" style={{ color: "oklch(0.38 0.12 163)" }} />
              <p className="font-medium mb-1" style={{ color: "oklch(0.18 0.02 200)" }}>感謝您的留言！</p>
              <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>您的留言將在審核後顯示</p>
              <Button className="mt-4" variant="outline" onClick={() => setSubmitted(false)}>再次留言</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="name" className="text-sm mb-1.5 block">姓名 *</Label>
                  <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="您的姓名" />
                </div>
                <div>
                  <Label htmlFor="role" className="text-sm mb-1.5 block">身份</Label>
                  <select
                    id="role"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="w-full h-10 px-3 rounded-md border text-sm"
                    style={{ borderColor: "var(--border)", background: "var(--input)" }}
                  >
                    {["學生", "家長", "教師", "訪客"].map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <Label htmlFor="email" className="text-sm mb-1.5 block">電子郵件（選填）</Label>
                <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" />
              </div>
              <div>
                <Label htmlFor="message" className="text-sm mb-1.5 block">留言內容 *</Label>
                <Textarea id="message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="請輸入您的留言、心得或建議..." rows={4} />
              </div>
              <Button type="submit" disabled={createFeedback.isPending} className="w-full gap-2 text-white" style={{ background: "oklch(0.38 0.12 163)" }}>
                <Send className="w-4 h-4" />
                {createFeedback.isPending ? "提交中..." : "送出留言"}
              </Button>
            </form>
          )}
        </div>

        {/* Approved Feedbacks */}
        <div>
          <h3 className="font-serif font-bold mb-4" style={{ color: "oklch(0.18 0.02 200)" }}>留言區</h3>
          <div className="space-y-3">
            {feedbacks && feedbacks.length > 0 ? (
              feedbacks.map((fb) => (
                <div key={fb.id} className="bg-white rounded-xl border border-border p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                        style={{ background: "oklch(0.38 0.12 163)" }}>
                        {fb.name.charAt(0)}
                      </div>
                      <span className="font-medium text-sm">{fb.name}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}>
                        {fb.role}
                      </span>
                    </div>
                    <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                      {new Date(fb.createdAt).toLocaleDateString("zh-TW")}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: "oklch(0.30 0.02 200)" }}>{fb.message}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-8 rounded-xl border border-dashed border-border">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30" style={{ color: "oklch(0.38 0.12 163)" }} />
                <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>目前尚無留言，歡迎第一個留言！</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
