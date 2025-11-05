import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from '@/pages/Landing.jsx'
import AuthPage from '@/pages/Auth.jsx'
import DashboardPage from '@/pages/Dashboard.jsx'
import FishListPage from '@/pages/FishList.jsx'
import FishDetailPage from '@/pages/FishDetail.jsx'
import MapScreen from '@/pages/MapScreen.jsx'
import DiaryPage from '@/pages/Diary.jsx'
import DiaryAddPage from '@/pages/DiaryAdd.jsx'
import FeedPage from '@/pages/Feed.jsx'
import MarketBoatsPage from '@/pages/MarketBoats.jsx'
import PremiumPage from '@/pages/Premium.jsx'
import NotFoundPage from '@/pages/NotFound.jsx'
import { AppShell } from '@/components/layout/AppShell.jsx'
import { AuthProvider } from '@/contexts/AuthContext.jsx'
import { AppDataProvider } from '@/contexts/AppDataContext.jsx'
import './App.css'

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AuthProvider>
        <AppDataProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route element={<AppShell />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/fish" element={<FishListPage />} />
              <Route path="/fish/:id" element={<FishDetailPage />} />
              <Route path="/map" element={<MapScreen />} />
              <Route path="/diary" element={<DiaryPage />} />
              <Route path="/diary/new" element={<DiaryAddPage />} />
              <Route path="/feed" element={<FeedPage />} />
              <Route path="/market" element={<MarketBoatsPage />} />
              <Route path="/premium" element={<PremiumPage />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AppDataProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
