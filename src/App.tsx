import React, { useState, useEffect } from 'react';
import MatrixRain from './components/MatrixRain';
import ControlPanel from './components/ControlPanel';
import { MatrixProvider } from './contexts/MatrixContext';
import { useMatrix } from './contexts/MatrixContext';
import { Zap } from 'lucide-react';

const MatrixApp: React.FC = () => {
  const { settings } = useMatrix();
  const [showWelcome, setShowWelcome] = useState(true);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleMouseMove = () => setShowCursor(true);
    const handleMouseLeave = () => setShowCursor(false);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const currentTheme = THEMES.find(t => t.name === settings.theme) || THEMES[0];

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <MatrixRain
        isPlaying={settings.isPlaying}
        speed={settings.speed}
        density={settings.density}
        color={settings.color}
        soundEnabled={settings.soundEnabled}
      />
      
      {/* Welcome Screen */}
      {showWelcome && (
        <div className="absolute inset-0 flex items-center justify-center z-20 animate-fade-in">
          <div className="text-center">
            <h1 
              className="text-6xl md:text-8xl font-mono font-bold mb-4 animate-pulse"
              style={{ 
                color: currentTheme.colors.primary,
                textShadow: `0 0 20px ${currentTheme.colors.primary}50`
              }}
            >
              MATRIX
            </h1>
            <p 
              className="text-green-400/80 font-mono text-lg md:text-xl animate-fade-in-delay"
              style={{ color: currentTheme.colors.secondary }}
            >
              Welcome to the simulation
            </p>
          </div>
        </div>
      )}

      {/* Matrix Logo */}
      <div className="absolute top-4 left-4 z-30">
        <div 
          className="flex items-center space-x-3 p-3 rounded-lg backdrop-blur-sm"
          style={{ backgroundColor: `${currentTheme.colors.primary}10` }}
        >
          <Zap 
            className="w-6 h-6 animate-pulse" 
            style={{ color: currentTheme.colors.primary }}
          />
          <div>
            <h2 
              className="font-mono font-bold text-sm"
              style={{ color: currentTheme.colors.primary }}
            >
              MATRIX RAIN
            </h2>
            <p 
              className="text-xs font-mono"
              style={{ color: currentTheme.colors.secondary }}
            >
              Enhanced Edition
            </p>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 z-30">
        <div 
          className="p-3 rounded-lg backdrop-blur-sm text-xs font-mono"
          style={{ backgroundColor: `${currentTheme.colors.primary}10` }}
        >
          <p style={{ color: currentTheme.colors.secondary }}>
            Click the settings icon to customize your experience
          </p>
        </div>
      </div>

      {/* Custom Cursor */}
      {showCursor && (
        <div 
          className="fixed w-4 h-4 rounded-full pointer-events-none z-50 mix-blend-difference"
          style={{
            backgroundColor: currentTheme.colors.accent,
            boxShadow: `0 0 10px ${currentTheme.colors.accent}`,
            transform: 'translate(-50%, -50%)'
          }}
        />
      )}

      <ControlPanel />
    </div>
  );
};

const THEMES = [
  {
    name: 'Classic Green',
    colors: {
      primary: '#00ff00',
      secondary: '#00cc00',
      accent: '#00ffff'
    }
  }
] as const;

function App() {
  return (
    <MatrixProvider>
      <MatrixApp />
    </MatrixProvider>
  );
}

export default App;