import React, { useEffect, useState } from 'react';

const MatrixHero: React.FC = () => {
  const [displayText, setDisplayText] = useState('');
  const [subtitleText, setSubtitleText] = useState('');
  const [isGlitching, setIsGlitching] = useState(false);

  const fullTitle = 'MATRIX';
  const fullSubtitle = 'Welcome to the simulation';

  useEffect(() => {
    // Typewriter effect for title
    let currentIndex = 0;
    const titleInterval = setInterval(() => {
      if (currentIndex <= fullTitle.length) {
        setDisplayText(fullTitle.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(titleInterval);
        
        // Start subtitle after title completes
        let subtitleIndex = 0;
        const subtitleInterval = setInterval(() => {
          if (subtitleIndex <= fullSubtitle.length) {
            setSubtitleText(fullSubtitle.slice(0, subtitleIndex));
            subtitleIndex++;
          } else {
            clearInterval(subtitleInterval);
          }
        }, 50);
      }
    }, 100);

    return () => {
      clearInterval(titleInterval);
    };
  }, []);

  useEffect(() => {
    // Random glitch effect
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.9) {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 200);
      }
    }, 2000);

    return () => clearInterval(glitchInterval);
  }, []);

  const glitchText = (text: string) => {
    if (!isGlitching) return text;
    
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return text.split('').map(char => {
      if (Math.random() > 0.7) {
        return chars[Math.floor(Math.random() * chars.length)];
      }
      return char;
    }).join('');
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="text-center">
        <h1 className={`text-6xl md:text-8xl font-mono font-bold mb-6 transition-all duration-200 ${
          isGlitching ? 'animate-pulse' : ''
        }`}>
          <span className="text-green-400">
            {glitchText(displayText)}
          </span>
          <span className="text-green-400 animate-pulse ml-2">
            {displayText.length === fullTitle.length ? '_' : ''}
          </span>
        </h1>
        
        <p className="text-green-400/80 font-mono text-lg md:text-xl mb-8 opacity-0 animate-fade-in" style={{
          animationDelay: '1s',
          animationFillMode: 'forwards'
        }}>
          {subtitleText}
        </p>

        <div className="flex items-center justify-center space-x-8 opacity-0 animate-fade-in" style={{
          animationDelay: '2s',
          animationFillMode: 'forwards'
        }}>
          <div className="text-green-500/60 font-mono text-sm">
            <div className="animate-pulse">SYSTEM ONLINE</div>
            <div className="text-xs mt-1">V2.0 ENHANCED</div>
          </div>
          <div className="w-px h-8 bg-green-500/30"></div>
          <div className="text-green-500/60 font-mono text-sm">
            <div className="animate-pulse">NEURAL LINK</div>
            <div className="text-xs mt-1">CONNECTED</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
      `}</style>
    </div>
  );
};

export default MatrixHero;