import { debounce, throttle, formatNumber, isMobile, supportsWebGL } from '../utils';

describe('Utility Functions', () => {
  beforeEach(() => {
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('debounce', () => {
    it('should debounce function calls', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn('arg1');
      debouncedFn('arg2');
      debouncedFn('arg3');

      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(100);

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('arg3');
    });

    it('should cancel previous calls', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn('first');
      jest.advanceTimersByTime(50);
      debouncedFn('second');
      jest.advanceTimersByTime(50);

      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(100);

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('second');
    });
  });

  describe('throttle', () => {
    it('should throttle function calls', () => {
      const mockFn = jest.fn();
      const throttledFn = throttle(mockFn, 100);

      throttledFn('first');
      throttledFn('second');
      throttledFn('third');

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('first');

      jest.advanceTimersByTime(100);

      throttledFn('fourth');
      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(mockFn).toHaveBeenLastCalledWith('fourth');
    });

    it('should not call function again within throttle period', () => {
      const mockFn = jest.fn();
      const throttledFn = throttle(mockFn, 100);

      throttledFn('first');
      expect(mockFn).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(50);
      throttledFn('second');
      expect(mockFn).toHaveBeenCalledTimes(1); // Still 1

      jest.advanceTimersByTime(60);
      throttledFn('third');
      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(mockFn).toHaveBeenLastCalledWith('third');
    });
  });

  describe('formatNumber', () => {
    it('should format numbers correctly', () => {
      expect(formatNumber(999)).toBe('999');
      expect(formatNumber(1000)).toBe('1.0K');
      expect(formatNumber(1500)).toBe('1.5K');
      expect(formatNumber(999999)).toBe('1000.0K');
      expect(formatNumber(1000000)).toBe('1.0M');
      expect(formatNumber(1500000)).toBe('1.5M');
    });
  });

  describe('isMobile', () => {
    const originalUserAgent = navigator.userAgent;

    beforeEach(() => {
      Object.defineProperty(navigator, 'userAgent', {
        value: originalUserAgent,
        writable: true,
        configurable: true
      });
    });

    it('should detect mobile devices', () => {
      const mobileAgents = [
        'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
        'Mozilla/5.0 (Android 10; Mobile; rv:81.0)',
        'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X)'
      ];

      mobileAgents.forEach(agent => {
        navigator.userAgent = agent;
        expect(isMobile()).toBe(true);
      });
    });

    it('should detect desktop devices', () => {
      navigator.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
      expect(isMobile()).toBe(false);
    });
  });

  describe('supportsWebGL', () => {
    it('should detect WebGL support', () => {
      const mockGetContext = jest.fn();
      const mockCanvas = {
        getContext: mockGetContext
      };

      jest.spyOn(document, 'createElement').mockReturnValue(mockCanvas as any);

      mockGetContext.mockReturnValue({}); // WebGL supported
      expect(supportsWebGL()).toBe(true);

      mockGetContext.mockReturnValue(null); // WebGL not supported
      expect(supportsWebGL()).toBe(false);

      mockGetContext.mockImplementation(() => {
        throw new Error('WebGL not supported');
      });
      expect(supportsWebGL()).toBe(false);
    });
  });
});