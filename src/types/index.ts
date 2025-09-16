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
  primary: string;
  secondary: string;
  background: string;
  text: string;
  accent: string;
}

export interface MatrixSettings {
  speed: number;
  density: number;
  color: string;
  soundEnabled: boolean;
  theme: string;
  particleSize: number;
  trailLength: number;
  glowEffect: boolean;
}