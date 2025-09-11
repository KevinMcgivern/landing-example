import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { MatrixProvider, useMatrix } from '../contexts/MatrixContext';
import { getLocalStorageItem, setLocalStorageItem } from '../utils';

jest.mock('../utils', () => ({
  getLocalStorageItem: jest.fn(),
  setLocalStorageItem: jest.fn(),
  downloadJSON: jest.fn(),
  uploadJSON: jest.fn()
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MatrixProvider>{children}</MatrixProvider>
);

describe('MatrixContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getLocalStorageItem as jest.Mock).mockReturnValue({
      isPlaying: false,
      speed: 3,
      density: 2,
      color: '#ff00ff',
      soundEnabled: true,
      theme: 'Custom Theme'
    });
  });

  it('should provide default settings when no localStorage', () => {
    (getLocalStorageItem as jest.Mock).mockReturnValue(null);
    
    const { result } = renderHook(() => useMatrix(), { wrapper });
    
    expect(result.current.settings.isPlaying).toBe(true);
    expect(result.current.settings.speed).toBe(2);
    expect(result.current.settings.theme).toBe('Classic Green');
  });

  it('should load settings from localStorage', () => {
    const { result } = renderHook(() => useMatrix(), { wrapper });
    
    expect(result.current.settings.isPlaying).toBe(false);
    expect(result.current.settings.speed).toBe(3);
    expect(result.current.settings.soundEnabled).toBe(true);
  });

  it('should update settings', () => {
    const { result } = renderHook(() => useMatrix(), { wrapper });
    
    act(() => {
      result.current.updateSettings({ speed: 5 });
    });
    
    expect(result.current.settings.speed).toBe(5);
    expect(setLocalStorageItem).toHaveBeenCalled();
  });

  it('should reset settings to defaults', () => {
    const { result } = renderHook(() => useMatrix(), { wrapper });
    
    act(() => {
      result.current.updateSettings({ speed: 10, density: 5 });
    });
    
    act(() => {
      result.current.resetSettings();
    });
    
    expect(result.current.settings.speed).toBe(2);
    expect(result.current.settings.density).toBe(1);
  });

  it('should throw error when useMatrix is used outside provider', () => {
    const { result } = renderHook(() => {
      try {
        return useMatrix();
      } catch (error) {
        return error;
      }
    });
    
    expect(result.current).toBeInstanceOf(Error);
    expect((result.current as Error).message).toBe('useMatrix must be used within a MatrixProvider');
  });

  it('should save settings to localStorage when settings change', () => {
    const { result } = renderHook(() => useMatrix(), { wrapper });
    
    act(() => {
      result.current.updateSettings({ isPlaying: false });
    });
    
    expect(setLocalStorageItem).toHaveBeenCalledWith(
      'matrix-rain-settings',
      expect.objectContaining({
        isPlaying: false
      })
    );
  });
});