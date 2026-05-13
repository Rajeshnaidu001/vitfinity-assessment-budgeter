import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GameProvider, useGame } from './context/GameContext';
import GameShell from './components/Layout/GameShell';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Phase1 from './pages/phases/Phase1';
import Phase2 from './pages/phases/Phase2';
import Phase3 from './pages/phases/Phase3';
import Phase4 from './pages/phases/Phase4';
import Phase5 from './pages/phases/Phase5';

/**
 * Protected route wrapper — redirects to landing if not onboarded
 */
function ProtectedRoute({ children }) {
  const { state } = useGame();
  if (!state.isOnboarded) {
    return <Navigate to="/" replace />;
  }
  return children;
}

/**
 * Main App with routing
 */
export default function App() {
  return (
    <BrowserRouter>
      <GameProvider>
        <Routes>
          {/* Landing — standalone (no shell) */}
          <Route path="/" element={<Landing />} />

          {/* Game shell with HUD */}
          <Route element={<GameShell />}>
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/phase/1"
              element={
                <ProtectedRoute>
                  <Phase1 />
                </ProtectedRoute>
              }
            />
            <Route
              path="/phase/2"
              element={
                <ProtectedRoute>
                  <Phase2 />
                </ProtectedRoute>
              }
            />
            <Route
              path="/phase/3"
              element={
                <ProtectedRoute>
                  <Phase3 />
                </ProtectedRoute>
              }
            />
            <Route
              path="/phase/4"
              element={
                <ProtectedRoute>
                  <Phase4 />
                </ProtectedRoute>
              }
            />
            <Route
              path="/phase/5"
              element={
                <ProtectedRoute>
                  <Phase5 />
                </ProtectedRoute>
              }
            />
            {/* Future phases */}
            <Route
              path="/phase/:id"
              element={
                <ProtectedRoute>
                  <ComingSoon />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </GameProvider>
    </BrowserRouter>
  );
}

/**
 * Generic coming soon page for unbuilt phases
 */
function ComingSoon() {
  const { state } = useGame();
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="glass rounded-3xl p-10 text-center max-w-md">
        <div className="text-6xl mb-4">🌌</div>
        <h2 className="text-2xl font-bold text-starlight mb-2">Phase Under Construction</h2>
        <p className="text-moonbeam">
          This mission is still being prepared. Return to Mission Control and try an available phase!
        </p>
        <a
          href="/dashboard"
          className="inline-block mt-6 text-plasma-blue font-semibold hover:underline"
        >
          ← Back to Mission Control
        </a>
      </div>
    </div>
  );
}
