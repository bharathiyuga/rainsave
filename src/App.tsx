/**
 * RainRevive - Full-Stack Circular Sustainability Platform
 * "Don't waste a drop. Don't waste a space. Don't waste a material."
 */
import { NavigationProvider, useRouter } from './context/NavigationContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { RainCalculatorPage } from './pages/RainCalculatorPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { SubmitBuildingPage } from './pages/SubmitBuildingPage';
import { BuildingDetailPage } from './pages/BuildingDetailPage';
import { GreenPlanDetailPage } from './pages/GreenPlanDetailPage';
import { DashboardPage } from './pages/DashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { ImpactPage } from './pages/ImpactPage';
import { AuthPage } from './pages/AuthPage';

function RouterView() {
  const { currentPath } = useRouter();

  // Normalize path without trailing slash
  const path = currentPath.split('?')[0].replace(/\/$/, '') || '/';

  if (path === '/') return <HomePage />;
  if (path === '/rain-calculator') return <RainCalculatorPage />;
  if (path === '/projects' || path === '/revive-building') return <ProjectsPage />;
  if (path === '/submit-building') return <SubmitBuildingPage />;
  if (path.startsWith('/building/')) return <BuildingDetailPage />;
  if (path.startsWith('/green-plan/')) return <GreenPlanDetailPage />;
  if (path === '/dashboard') return <DashboardPage />;
  if (path === '/admin') return <AdminDashboardPage />;
  if (path === '/impact') return <ImpactPage />;
  if (path === '/login') return <AuthPage initialMode="login" />;
  if (path === '/signup') return <AuthPage initialMode="signup" />;

  // Default fallback
  return <HomePage />;
}

export default function App() {
  return (
    <NavigationProvider>
      <AuthProvider>
        <ToastProvider>
          <div className="min-h-screen flex flex-col bg-[#070c18] text-slate-100 selection:bg-emerald-500 selection:text-white antialiased font-sans">
            <Navbar />
            <main className="flex-1">
              <RouterView />
            </main>
            <Footer />
          </div>
        </ToastProvider>
      </AuthProvider>
    </NavigationProvider>
  );
}
