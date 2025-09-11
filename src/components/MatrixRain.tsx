import React, { memo } from 'react';
import { useMatrixRain } from '../hooks/useMatrixRain';
import { MatrixRainProps } from '../types';

const MatrixRain: React.FC<MatrixRainProps> = memo(({ isPlaying, speed, density, color, soundEnabled }) => {
  const { canvasRef, performance } = useMatrixRain({
    isPlaying,
    speed,
    density,
    color,
    soundEnabled
  });

  return (
    <div className="relative w-full h-full overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
        style={{ 
          background: 'radial-gradient(circle at center, #000011 0%, #000000 100%)',
          imageRendering: 'pixelated'
        }}
      />
      
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 left-4 z-10 bg-black/80 text-green-400 font-mono text-xs p-2 rounded">
          <div>FPS: {performance.fps}</div>
          <div>Drops: {performance.dropCount}</div>
          <div>Frame: {performance.frameTime.toFixed(1)}ms</div>
        </div>
      )}
    </div>
  );
});

MatrixRain.displayName = 'MatrixRain';

export default MatrixRain;