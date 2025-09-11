import { useEffect, useRef, useCallback, useState } from 'react';
import { MatrixRainProps, Drop, PerformanceStats } from '../types';
import { CHARACTERS, PERFORMANCE } from '../constants';
import { throttle } from '../utils';

export const useMatrixRain = ({
  isPlaying,
  speed,
  density,
  color,
  soundEnabled
}: MatrixRainProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const dropsRef = useRef<Drop[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastFrameRef = useRef<number>(0);
  const [performance, setPerformance] = useState<PerformanceStats>({
    fps: 0,
    frameTime: 0,
    dropCount: 0,
    lastFrameTime: performance.now()
  });

  const createDrop = useCallback((canvas: HTMLCanvasElement): Drop => {
    const allChars = CHARACTERS.all();
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

  const updatePerformance = useCallback(() => {
    const now = performance.now();
    const frameTime = now - performance.lastFrameTime;
    const fps = Math.round(1000 / frameTime);
    
    setPerformance(prev => ({
      fps,
      frameTime,
      dropCount: dropsRef.current.length,
      lastFrameTime: now
    }));
  }, [performance.lastFrameTime]);

  useEffect(() => {
    if (soundEnabled && !audioRef.current) {
      audioRef.current = new Audio('/sounds/matrix-rain.mp3');
      audioRef.current.loop = true;
      audioRef.current.volume = 0.3;
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [soundEnabled]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
    };

    resizeCanvas();
    window.addEventListener('resize', throttle(resizeCanvas, 250));

    const initDrops = () => {
      const dropCount = Math.min(
        Math.max(Math.floor(density * 100), PERFORMANCE.MIN_DROPS),
        PERFORMANCE.MAX_DROPS
      );
      dropsRef.current = Array.from({ length: dropCount }, () => createDrop(canvas));
    };

    initDrops();

    const animate = (timestamp: number) => {
      if (!isPlaying) return;

      const deltaTime = timestamp - lastFrameRef.current;
      if (deltaTime < 1000 / PERFORMANCE.TARGET_FPS) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      lastFrameRef.current = timestamp;
      updatePerformance();

      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      dropsRef.current.forEach((drop, index) => {
        drop.y += drop.speed * (deltaTime / 16.67);

        if (drop.y > canvas.height) {
          dropsRef.current[index] = createDrop(canvas);
          return;
        }

        drop.chars.forEach((char, i) => {
          const y = drop.y - i * 15;
          if (y < 0) return;

          const opacity = i === 0 ? 1 : Math.max(0, (drop.maxLength - i) / drop.maxLength);
          const brightness = i === 0 ? 255 : Math.max(100, 200 - (i * 10));
          
          const [r, g, b] = color === '#00ff00' 
            ? [0, brightness, 0]
            : color === '#00ffff'
            ? [0, brightness, brightness]
            : [brightness, 0, brightness];
          
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
          ctx.font = '15px monospace';
          ctx.fillText(char, drop.x / (window.devicePixelRatio || 1), y / (window.devicePixelRatio || 1));
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    if (isPlaying) {
      if (soundEnabled && audioRef.current) {
        audioRef.current.play().catch(console.warn);
      }
      animate(performance.now());
    } else if (audioRef.current) {
      audioRef.current.pause();
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [isPlaying, speed, density, color, soundEnabled, createDrop, updatePerformance]);

  return {
    canvasRef,
    performance
  };
};