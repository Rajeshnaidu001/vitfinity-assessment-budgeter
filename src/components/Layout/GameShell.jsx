import { Outlet } from 'react-router-dom';
import ParticleField from '../Background/ParticleField';
import TopBar from '../HUD/TopBar';
import { useGame } from '../../context/GameContext';

/**
 * Persistent game shell layout
 * Contains particle background, HUD bar, and content area
 */
export default function GameShell() {
  const { state } = useGame();

  return (
    <div className="min-h-screen w-full relative">
      {/* Animated particle background */}
      <ParticleField />

      {/* Subtle grid overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(79, 140, 255, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(79, 140, 255, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
        aria-hidden="true"
      />

      {/* HUD bar (only when onboarded) */}
      {state.isOnboarded && <TopBar />}

      {/* Main content */}
      <main className={`relative z-10 ${state.isOnboarded ? 'pt-20' : ''}`}>
        <Outlet />
      </main>
    </div>
  );
}
