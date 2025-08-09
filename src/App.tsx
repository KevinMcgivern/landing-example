import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Pause, Settings, Zap, Palette, Volume2, VolumeX } from 'lucide-react';

interface MatrixRainProps {
  isPlaying: boolean;
  speed: number;
  density: number;
  color: string;
  soundEnabled: boolean;
}

interface Drop {
  x: number;
  y: number;
  speed: number;
  length: number;
  chars: string[];
  opacity: number;
  maxLength: number;
}

const MatrixRain: React.FC<MatrixRainProps> = ({ isPlaying, speed, density, color, soundEnabled }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const dropsRef = useRef<Drop[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const katakana = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';

  useEffect(() => {
    if (soundEnabled) {
      audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmFgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
    }
  }, [soundEnabled]);

  const createDrop = useCallback((canvas: HTMLCanvasElement): Drop => {
    const allChars = chars + katakana;
    const length = Math.floor(Math.random() * 20) + 5;
    return {
      x: Math.random() * canvas.width,
      y: -Math.random() * canvas.height,
      speed: (Math.random() * 3 + 1) * speed,
      length,
      chars: Array.from({ length }, () => allChars[Math.floor(Math.random() * allChars.length)]),
      opacity: 0,
      maxLength: length
    };
  }, [speed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const initDrops = () => {
      dropsRef.current = Array.from({ length: Math.floor(density * 100) }, () => createDrop(canvas));
    };

    initDrops();

    const animate = () => {
      if (!isPlaying) return;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      dropsRef.current.forEach((drop, index) => {
        drop.y += drop.speed;
        
        if (drop.y > canvas.height) {
          dropsRef.current[index] = createDrop(canvas);
          return;
        }

        drop.chars.forEach((char, i) => {
          const y = drop.y - i * 15;
          if (y < 0) return;

          const opacity = i === 0 ? 1 : (drop.maxLength - i) / drop.maxLength;
          const brightness = i === 0 ? 255 : 200 - (i * 10);
          
          ctx.fillStyle = color === '#00ff00' 
            ? `rgba(0, ${brightness}, 0, ${opacity})`
            : color === '#00ffff'
            ? `rgba(0, ${brightness}, ${brightness}, ${opacity})`
            : `rgba(${brightness}, 0, ${brightness}, ${opacity})`;
          
          ctx.font = '15px monospace';
          ctx.fillText(char, drop.x, y);
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    if (isPlaying) {
      animate();
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, speed, density, color, createDrop]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ background: 'radial-gradient(circle at center, #000011 0%, #000000 100%)' }}
    />
  );
};

const ControlPanel: React.FC<{
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  speed: number;
  setSpeed: (speed: number) => void;
  density: number;
  setDensity: (density: number) => void;
  color: string;
  setColor: (color: string) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
}> = ({ isPlaying, setIsPlaying, speed, setSpeed, density, setDensity, color, setColor, soundEnabled, setSoundEnabled }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className={`bg-black/80 backdrop-blur-md border border-green-500/30 rounded-lg transition-all duration-300 ${isExpanded ? 'w-80' : 'w-auto'}`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-green-400" />
              <span className="text-green-400 font-mono text-sm">MATRIX</span>
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-green-400 hover:text-green-300 transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>

          {isExpanded && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-500/20 border border-green-500/50 rounded-md hover:bg-green-500/30 transition-colors"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span className="text-green-400 text-sm font-mono">{isPlaying ? 'PAUSE' : 'PLAY'}</span>
                </button>
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="p-2 bg-green-500/20 border border-green-500/50 rounded-md hover:bg-green-500/30 transition-colors"
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4 text-green-400" /> : <VolumeX className="w-4 h-4 text-green-400" />}
                </button>
              </div>

              <div>
                <label className="block text-green-400 text-xs font-mono mb-2">SPEED</label>
                <input
                  type="range"
                  min="0.5"
                  max="5"
                  step="0.1"
                  value={speed}
                  onChange={(e) => setSpeed(parseFloat(e.target.value))}
                  className="w-full h-2 bg-green-900/50 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-green-400 text-xs font-mono">{speed.toFixed(1)}x</span>
              </div>

              <div>
                <label className="block text-green-400 text-xs font-mono mb-2">DENSITY</label>
                <input
                  type="range"
                  min="0.1"
                  max="2"
                  step="0.1"
                  value={density}
                  onChange={(e) => setDensity(parseFloat(e.target.value))}
                  className="w-full h-2 bg-green-900/50 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-green-400 text-xs font-mono">{density.toFixed(1)}x</span>
              </div>

              <div>
                <label className="block text-green-400 text-xs font-mono mb-2">COLOR</label>
                <div className="flex space-x-2">
                  {['#00ff00', '#00ffff', '#ff00ff'].map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={`w-8 h-8 rounded-md border-2 transition-all ${color === c ? 'border-green-400 scale-110' : 'border-green-500/30'}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function App() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(2);
  const [density, setDensity] = useState(1);
  const [color, setColor] = useState('#00ff00');
  const [soundEnabled, setSoundEnabled] = useState(false);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <MatrixRain
        isPlaying={isPlaying}
        speed={speed}
        density={density}
        color={color}
        soundEnabled={soundEnabled}
      />
      
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl md:text-8xl font-mono font-bold text-green-400 mb-4 animate-pulse">
            MATRIX
          </h1>
          <p className="text-green-400/80 font-mono text-lg md:text-xl">
            Welcome to the simulation
          </p>
        </div>
      </div>

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
    </div>
  );
}

export default App;
