export interface MatrixRainProps {
  isPlaying: boolean;
  speed: number;
  density: number;
  color: string;
  soundEnabled: boolean;
}

export interface Drop {
  x: number;
  y: number;
  speed: number;
  length: number;
  chars: string[];
  opacity: number;
  maxLength: number;
}

export interface ControlPanelProps {
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
}

export interface Theme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  settings: {
    speed: number;
    density: number;
    color: string;
  };
}

export interface AppSettings {
  isPlaying: boolean;
  speed: number;
  density: number;
  color: string;
  soundEnabled: boolean;
  theme: string;
}

export interface MatrixContextType {
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;
  resetSettings: () => void;
  exportSettings: () => void;
  importSettings: (settings: AppSettings) => void;
}

export interface PerformanceStats {
  fps: number;
  frameTime: number;
  dropCount: number;
  lastFrameTime: number;
}