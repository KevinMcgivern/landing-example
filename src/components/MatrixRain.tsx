import React, { useEffect, useRef, useCallback } from 'react';
import { MatrixRainProps } from '../types';
import { CHAR_SETS } from '../utils/constants';

interface Drop {
  x: number;
  y: number;
  speed: number;
  length: number;
  chars: string[];
  opacity: number;
  maxLength: number;
  trail: Array<{
    char: string;
    opacity: number;
  }>;
}

const MatrixRain: React.FC<MatrixRainProps> = ({ 
  isPlaying, 
  speed, 
  density, 
  color, 
  soundEnabled 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const dropsRef = useRef<Drop[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastTimeRef = useRef<number>(0);

  const createDrop = useCallback((canvas: HTMLCanvasElement): Drop => {
    const allChars = CHAR_SETS.latin + CHAR_SETS.katakana;
    const length = Math.floor(Math.random() * 25) + 8;
    return {
      x: Math.random() * canvas.width,
      y: -Math.random() * canvas.height,
      speed: (Math.random() * 4 + 2) * speed,
      length,
      chars: Array.from({ length }, () => allChars[Math.floor(Math.random() * allChars.length)]),
      opacity: 0,
      maxLength: length,
      trail: Array.from({ length: Math.floor(length * 0.7) }, () => ({
        char: allChars[Math.floor(Math.random() * allChars.length)],
        opacity: 0.8
      }))
    };
  }, [speed]);

  useEffect(() => {
    if (soundEnabled && !audioRef.current) {
      audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmFgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
      audioRef.current.volume = 0.3;
      audioRef.current.loop = true;
    }

    if (audioRef.current) {
      if (soundEnabled && isPlaying) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [soundEnabled, isPlaying]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      dropsRef.current = Array.from({ length: Math.floor(density * 150) }, () => createDrop(canvas));
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const animate = (currentTime: number) => {
      if (!isPlaying) return;

      const deltaTime = currentTime - lastTimeRef.current;
      if (deltaTime < 16) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      lastTimeRef.current = currentTime;

      // Enhanced fade effect with trail
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      dropsRef.current.forEach((drop, index) => {
        drop.y += drop.speed;
        
        if (drop.y > canvas.height + drop.length * 20) {
          dropsRef.current[index] = createDrop(canvas);
          return;
        }

        // Draw the main character (head)
        if (drop.y > 0) {
          const headY = drop.y;
          
          // Create glow effect
          ctx.shadowColor = color;
          ctx.shadowBlur = drop.opacity > 0.5 ? 10 : 5;
          
          // Draw head character
          ctx.font = 'bold 16px monospace';
          ctx.fillStyle = `rgba(255, 255, 255, ${drop.opacity})`;
          ctx.fillText(drop.chars[0], drop.x, headY);
          
          ctx.shadowBlur = 0;
        }

        // Draw the trail
        drop.chars.forEach((char: string, i: number) => {
          const y = drop.y - i * 16;
          if (y < 0) return;

          const opacity = Math.max(0, (drop.maxLength - i) / drop.maxLength * drop.opacity);
          const brightness = Math.max(100, 255 - (i * 8));
          
          // Create gradient effect based on distance from head
          const distanceFromHead = i;
          const intensity = Math.max(0.3, 1 - (distanceFromHead / drop.maxLength));
          
          ctx.font = '14px monospace';
          ctx.fillStyle = color === '#00ff00' 
            ? `rgba(0, ${brightness}, 0, ${opacity * intensity})`
            : color === '#00ffff'
            ? `rgba(0, ${brightness}, ${brightness}, ${opacity * intensity})`
            : `rgba(${brightness}, 0, ${brightness}, ${opacity * intensity})`;
          
          ctx.fillText(char, drop.x, y);
        });

        // Fade in effect
        if (drop.opacity < 1) {
          drop.opacity += 0.02;
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    if (isPlaying) {
      animationRef.current = requestAnimationFrame(animate);
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
      className="absolute inset-0 w-full h-full transition-opacity duration-1000"
      style={{ 
        background: 'radial-gradient(circle at center, #000011 0%, #000000 100%)',
        opacity: isPlaying ? 1 : 0.7
      }}
    />
  );
};

export default MatrixRain;