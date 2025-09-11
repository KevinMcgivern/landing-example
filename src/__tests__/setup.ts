import '@testing-library/jest-dom';

// Mock canvas for testing
HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
  fillStyle: '',
  fillRect: jest.fn(),
  fillText: jest.fn(),
  font: '',
  scale: jest.fn(),
  clearRect: jest.fn()
}));

// Mock requestAnimationFrame
global.requestAnimationFrame = jest.fn((cb) => setTimeout(cb, 16));
global.cancelAnimationFrame = jest.fn((id) => clearTimeout(id));

// Mock performance API
global.performance = {
  now: jest.fn(() => Date.now()),
  mark: jest.fn(),
  measure: jest.fn(),
  getEntriesByType: jest.fn(() => []),
  getEntriesByName: jest.fn(() => [])
} as any;

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn()
};
global.localStorage = localStorageMock as any;

// Mock Audio API
global.Audio = class MockAudio {
  src: string = '';
  currentTime: number = 0;
  duration: number = 0;
  paused: boolean = true;
  volume: number = 1;
  loop: boolean = false;
  
  play = jest.fn().mockResolvedValue(undefined);
  pause = jest.fn();
  load = jest.fn();
  
  constructor(src?: string) {
    if (src) this.src = src;
  }
};

// Suppress console errors during tests unless explicitly testing error handling
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});