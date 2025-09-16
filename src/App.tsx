import React, { useState, useEffect } from 'react';
import MatrixRain from './components/MatrixRain';
import ControlPanel from './components/ControlPanel';
import MatrixHero from './components/MatrixHero';

function App() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(2);
  const [density, setDensity] = useState(1);
  const [color, setColor] = useState('#00ff00');
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate loading time for enhanced experience
    const timer = setTimeout(() => setIsLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Enhanced Matrix Rain Animation */}
      <MatrixRain
        isPlaying={isPlaying}
        speed={speed}
        density={density}
        color={color}
        soundEnabled={soundEnabled}
      />
      
      {/* Animated Hero Section */}
      <MatrixHero />

      {/* Enhanced Control Panel */}
      <ControlPanel
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        speed={speed}
        setSpeed={setSpeed}
        density={density}
        setDensity={setDensity}
        color={color}
        setColor={setColor}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
      />

      {/* Loading Overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-black flex items-center justify-center z-60">
          <div className="text-center">
            <div className="text-green-400 text-2xl font-mono font-bold mb-4 animate-pulse">
              INITIALIZING MATRIX...
            </div>
            <div className="w-64 h-1 bg-green-900 rounded-full overflow-hidden">
              <div className="h-full bg-green-400 animate-pulse" style={{
                width: '100%',
                animation: 'loading-bar 2s ease-in-out infinite'
              }}></div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes loading-bar {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}

export default App;