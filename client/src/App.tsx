import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import MediaGallery from "./pages/MediaGallery";
import PhotoAlbum from "./pages/PhotoAlbum";
import { MotherTongueDayPage, CurriculumPlanPage, SelfMadeMaterialsPage } from "./pages/PlansPage";
import {
  TeacherCertificationPage,
  CommunityResourcesPage,
  SpecialCurriculumPage,
  RelatedWebsitesPage,
  FeedbackPage,
} from "./pages/StaticPages";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      {/* 01 */}
      <Route path="/curriculum-plan" component={CurriculumPlanPage} />
      {/* 02 */}
      <Route path="/mother-tongue-day" component={MotherTongueDayPage} />
      {/* 03 */}
      <Route path="/teacher-certification" component={TeacherCertificationPage} />
      {/* 04 */}
      <Route path="/community-resources" component={CommunityResourcesPage} />
      {/* 05 */}
      <Route path="/self-made-materials" component={SelfMadeMaterialsPage} />
      {/* 06 */}
      <Route path="/special-curriculum" component={SpecialCurriculumPage} />
      {/* 07 */}
      <Route path="/media-gallery" component={MediaGallery} />
      {/* 08 */}
      <Route path="/related-websites" component={RelatedWebsitesPage} />
      {/* 09 */}
      <Route path="/feedback" component={FeedbackPage} />
      {/* Login */}
      <Route path="/login" component={Login} />
      {/* Admin */}
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
