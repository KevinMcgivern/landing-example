export const THEMES = {
  classic: {
    name: 'Classic Matrix',
    primary: '#00ff00',
    secondary: '#008800',
    background: 'radial-gradient(circle at center, #000011 0%, #000000 100%)',
    text: '#00ff00',
    accent: '#00ff88'
  },
  cyberpunk: {
    name: 'Cyberpunk',
    primary: '#ff0080',
    secondary: '#800040',
    background: 'radial-gradient(circle at center, #001122 0%, #000011 100%)',
    text: '#ff0080',
    accent: '#ff4080'
  },
  neon: {
    name: 'Neon Blue',
    primary: '#00ffff',
    secondary: '#0088aa',
    background: 'radial-gradient(circle at center, #001144 0%, #000022 100%)',
    text: '#00ffff',
    accent: '#40ffff'
  },
  fire: {
    name: 'Digital Fire',
    primary: '#ff4400',
    secondary: '#aa2200',
    background: 'radial-gradient(circle at center, #221100 0%, #110000 100%)',
    text: '#ff4400',
    accent: '#ff8840'
  },
  purple: {
    name: 'Purple Haze',
    primary: '#ff00ff',
    secondary: '#880088',
    background: 'radial-gradient(circle at center, #220022 0%, #110011 100%)',
    text: '#ff00ff',
    accent: '#ff88ff'
  }
} as const;

export const CHAR_SETS = {
  latin: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  katakana: 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン',
  binary: '01',
  hex: '0123456789ABCDEF',
  symbols: '☯★☆♦♣♠♥♪♫☀☁☂☃☽☾☮⚡⚠⚡⚡⚡'
};

export const SOUND_EFFECTS = {
  matrix: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmFgU7k9n1unEiBC13yO/eizEIHWq+8+OWT',
  glitch: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmFgU7k9n1unEiBC13yO/eizEIHWq+8+OWT',
  digital: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmFgU7k9n1unEiBC13yO/eizEIHWq+8+OWT'
};

export const DEFAULT_SETTINGS = {
  speed: 2,
  density: 1,
  color: '#00ff00',
  soundEnabled: false,
  theme: 'classic',
  particleSize: 15,
  trailLength: 0.05,
  glowEffect: true
};

export const SPEED_RANGE = { min: 0.5, max: 5, step: 0.1 };
export const DENSITY_RANGE = { min: 0.1, max: 2, step: 0.1 };
export const PARTICLE_SIZE_RANGE = { min: 10, max: 25, step: 1 };