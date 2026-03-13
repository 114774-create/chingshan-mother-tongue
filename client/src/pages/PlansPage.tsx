import { trpc } from "@/lib/trpc";
import MainLayout from "@/components/MainLayout";
import { FileText, ExternalLink, Download, Calendar, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PlansPageProps {
  type: "mother_tongue_day" | "curriculum_plan" | "teaching_material" | "other";
  title: string;
  number: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  color: string;
}

const DEFAULT_PLANS = {
  mother_tongue_day: [
    { id: 1, title: "113學年度臺灣母語日實施計畫", year: "2024", description: "本計畫依據教育部相關規定，規劃青山國小113學年度臺灣母語日各項活動", externalUrl: "#", fileUrl: null },
    { id: 2, title: "112學年度臺灣母語日實施計畫", year: "2023", description: "112學年度母語日活動實施計畫，包含各語言別活動安排", externalUrl: "#", fileUrl: null },
    { id: 3, title: "111學年度臺灣母語日實施計畫及成果", year: "2022", description: "111學年度母語日活動完整紀錄與成果報告", externalUrl: "#", fileUrl: null },
  ],
  curriculum_plan: [
    { id: 4, title: "113學年度本土語領域學習課程計畫", year: "2024", description: "113學年度各年級本土語言課程規劃，含閩南語、客家語、原住民族語及新住民語文", externalUrl: "#", fileUrl: null },
    { id: 5, title: "112學年度本土語領域學習課程計畫", year: "2023", description: "112學年度課程計畫，依課綱規範設計各年段學習目標", externalUrl: "#", fileUrl: null },
  ],
  teaching_material: [
    { id: 6, title: "自編閩南語教材－生活篇", year: "2024", description: "教師自編閩南語生活情境教材，貼近學生日常生活", externalUrl: "#", fileUrl: null },
    { id: 7, title: "自編客家語教材－文化篇", year: "2024", description: "結合客家文化特色設計的自編教材", externalUrl: "#", fileUrl: null },
  ],
  other: [
    { id: 8, title: "相關教學資源", year: "2024", description: "其他本土語教學相關資源與文件", externalUrl: "#", fileUrl: null },
  ],
};

function PlanCard({ plan }: { plan: typeof DEFAULT_PLANS.mother_tongue_day[0] }) {
  const url = plan.externalUrl || plan.fileUrl;
  return (
    <div className="content-card p-5 animate-fade-in-up">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="text-xs">
              {plan.year} 學年度
            </Badge>
          </div>
          <h3 className="font-serif font-semibold mb-2" style={{ color: "oklch(0.18 0.02 200)" }}>
            {plan.title}
          </h3>
          {plan.description && (
            <p className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
              {plan.description}
            </p>
          )}
        </div>
        <div className="flex-shrink-0 flex flex-col gap-2">
          {plan.externalUrl && plan.externalUrl !== "#" && (
            <a href={plan.externalUrl} target="_blank" rel="noopener noreferrer">
              <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                <ExternalLink className="w-3.5 h-3.5" />
                開啟連結
              </Button>
            </a>
          )}
          {plan.fileUrl && (
            <a href={plan.fileUrl} target="_blank" rel="noopener noreferrer" download>
              <Button size="sm" className="gap-1.5 text-xs text-white" style={{ background: "oklch(0.38 0.12 163)" }}>
                <Download className="w-3.5 h-3.5" />
                下載 PDF
              </Button>
            </a>
          )}
          {(!plan.externalUrl || plan.externalUrl === "#") && !plan.fileUrl && (
            <span className="text-xs px-3 py-1.5 rounded-lg" style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}>
              即將上傳
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function MotherTongueDayPage() {
  const { data: plans, isLoading } = trpc.plans.listByType.useQuery({ type: "mother_tongue_day" });
  const displayPlans = (plans && plans.length > 0) ? plans : DEFAULT_PLANS.mother_tongue_day;

  return (
    <MainLayout>
      <div className="p-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "oklch(0.55 0.14 45 / 0.1)" }}>
              <Calendar className="w-5 h-5" style={{ color: "oklch(0.55 0.14 45)" }} />
            </div>
            <div>
              <p className="text-xs font-medium" style={{ color: "oklch(0.38 0.12 163)" }}>02</p>
              <h1 className="text-2xl font-serif font-bold" style={{ color: "oklch(0.18 0.02 200)" }}>
                母語日活動實施計畫及成果
              </h1>
            </div>
          </div>
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
            臺灣母語日每年定期舉辦，透過豐富活動推廣本土語言文化
          </p>
        </div>
        <div className="space-y-4 stagger-children">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-28 rounded-xl animate-pulse" style={{ background: "var(--muted)" }} />
            ))
          ) : (
            displayPlans.map((plan) => <PlanCard key={plan.id} plan={plan as any} />)
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export function CurriculumPlanPage() {
  const { data: plans, isLoading } = trpc.plans.listByType.useQuery({ type: "curriculum_plan" });
  const displayPlans = (plans && plans.length > 0) ? plans : DEFAULT_PLANS.curriculum_plan;

  return (
    <MainLayout>
      <div className="p-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "oklch(0.38 0.12 163 / 0.1)" }}>
              <BookOpen className="w-5 h-5" style={{ color: "oklch(0.38 0.12 163)" }} />
            </div>
            <div>
              <p className="text-xs font-medium" style={{ color: "oklch(0.38 0.12 163)" }}>01</p>
              <h1 className="text-2xl font-serif font-bold" style={{ color: "oklch(0.18 0.02 200)" }}>
                本土語課程計畫
              </h1>
            </div>
          </div>
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
            青山國小本土語領域學習課程計畫，依課綱規範設計各年段學習目標
          </p>
        </div>
        <div className="space-y-4 stagger-children">
          {isLoading ? (
            Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-28 rounded-xl animate-pulse" style={{ background: "var(--muted)" }} />
            ))
          ) : (
            displayPlans.map((plan) => <PlanCard key={plan.id} plan={plan as any} />)
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export function SelfMadeMaterialsPage() {
  const { data: plans, isLoading } = trpc.plans.listByType.useQuery({ type: "teaching_material" });
  const displayPlans = (plans && plans.length > 0) ? plans : DEFAULT_PLANS.teaching_material;

  return (
    <MainLayout>
      <div className="p-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "oklch(0.42 0.12 220 / 0.1)" }}>
              <FileText className="w-5 h-5" style={{ color: "oklch(0.42 0.12 220)" }} />
            </div>
            <div>
              <p className="text-xs font-medium" style={{ color: "oklch(0.38 0.12 163)" }}>05</p>
              <h1 className="text-2xl font-serif font-bold" style={{ color: "oklch(0.18 0.02 200)" }}>
                自編本土語教材
              </h1>
            </div>
          </div>
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
            青山國小教師自行編製的本土語教材，貼近學生生活情境
          </p>
        </div>
        <div className="space-y-4 stagger-children">
          {isLoading ? (
            Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-28 rounded-xl animate-pulse" style={{ background: "var(--muted)" }} />
            ))
          ) : (
            displayPlans.map((plan) => <PlanCard key={plan.id} plan={plan as any} />)
          )}
        </div>
      </div>
    </MainLayout>
  );
}
