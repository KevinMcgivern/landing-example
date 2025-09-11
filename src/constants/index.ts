export const CHARACTERS = {
  latin: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  katakana: 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
  all: () => CHARACTERS.latin + CHARACTERS.katakana + CHARACTERS.symbols
};

export const THEMES: import('../types').Theme[] = [
  {
    name: 'Classic Green',
    colors: {
      primary: '#00ff00',
      secondary: '#00cc00',
      accent: '#00ffff',
      background: '#000000',
      text: '#00ff00'
    },
    settings: {
      speed: 2,
      density: 1,
      color: '#00ff00'
    }
  },
  {
    name: 'Cyber Blue',
    colors: {
      primary: '#00ffff',
      secondary: '#0099ff',
      accent: '#ffffff',
      background: '#001122',
      text: '#00ffff'
    },
    settings: {
      speed: 2.5,
      density: 1.2,
      color: '#00ffff'
    }
  },
  {
    name: 'Neon Purple',
    colors: {
      primary: '#ff00ff',
      secondary: '#cc00cc',
      accent: '#00ff00',
      background: '#110011',
      text: '#ff00ff'
    },
    settings: {
      speed: 1.8,
      density: 0.8,
      color: '#ff00ff'
    }
  },
  {
    name: 'Digital Red',
    colors: {
      primary: '#ff0000',
      secondary: '#cc0000',
      accent: '#ffff00',
      background: '#220000',
      text: '#ff0000'
    },
    settings: {
      speed: 3,
      density: 1.5,
      color: '#ff0000'
    }
  }
];

export const DEFAULT_SETTINGS: import('../types').AppSettings = {
  isPlaying: true,
  speed: 2,
  density: 1,
  color: '#00ff00',
  soundEnabled: false,
  theme: 'Classic Green'
};

export const PERFORMANCE = {
  TARGET_FPS: 60,
  FRAME_TIME: 16.67, // milliseconds
  MAX_DROPS: 500,
  MIN_DROPS: 50
};

export const SOUND_EFFECTS = {
  matrixRain: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmFgU7k9n1unEiBC13yO/eizEIHWq+8+OWT'
};

export const LOCAL_STORAGE_KEYS = {
  SETTINGS: 'matrix-rain-settings',
  PRESETS: 'matrix-rain-presets'
};