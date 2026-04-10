import { HashRouter, Routes, Route, useLocation } from 'react-router-dom'
import Nav from './components/Nav'
import Home from './pages/Home'
import System from './pages/System'
import Typography from './pages/Typography'
import SpacingPage from './pages/SpacingPage'
import LayoutPage from './pages/LayoutPage'
import Signals from './pages/Signals'
import NewsPage from './pages/test/NewsPage'
import JazzPage from './pages/test/JazzPage'
import TrackerPage from './pages/test/TrackerPage'
import ObservatoryPage from './pages/test/ObservatoryPage'
import RoamPage from './pages/test/RoamPage'
import HollowWirePage from './pages/test/HollowWirePage'
import TradingPage from './pages/test/TradingPage'
import BacklogPage from './pages/BacklogPage'
import SkillPage from './pages/SkillPage'
import TrainingPage from './pages/TrainingPage'

/* AppShell hides the FIBO nav on /test/* routes.
 * Test pages get the full viewport — they render their own headers.
 * Must be a child of HashRouter to use useLocation. */
function AppShell() {
  const { pathname } = useLocation()
  const isTest = pathname.startsWith('/test/')

  return (
    <>
      {!isTest && <Nav />}
      <main style={{ paddingTop: isTest ? 0 : 'var(--nav-h)' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/system" element={<System />} />
          <Route path="/typography" element={<Typography />} />
          <Route path="/spacing" element={<SpacingPage />} />
          <Route path="/layout" element={<LayoutPage />} />
          <Route path="/signals" element={<Signals />} />
          <Route path="/test/news" element={<NewsPage />} />
          <Route path="/test/jazz" element={<JazzPage />} />
          <Route path="/test/tracker" element={<TrackerPage />} />
          <Route path="/test/observatory" element={<ObservatoryPage />} />
          <Route path="/test/roam" element={<RoamPage />} />
          <Route path="/test/hollow-wire" element={<HollowWirePage />} />
          <Route path="/test/trading" element={<TradingPage />} />
          <Route path="/backlog" element={<BacklogPage />} />
          <Route path="/skill" element={<SkillPage />} />
          <Route path="/training" element={<TrainingPage />} />
        </Routes>
      </main>
    </>
  )
}

export default function App() {
  return (
    <HashRouter>
      <AppShell />
    </HashRouter>
  )
}
