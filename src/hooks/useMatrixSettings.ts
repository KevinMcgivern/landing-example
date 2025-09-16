import { useState, useEffect, useCallback } from 'react';
import { MatrixSettings } from '../types';
import { DEFAULT_SETTINGS } from '../utils/constants';

const STORAGE_KEY = 'matrix-settings-v2';

export const useMatrixSettings = () => {
  const [settings, setSettings] = useState<MatrixSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      }
    } catch (error) {
      console.warn('Failed to load settings from localStorage:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      } catch (error) {
        console.warn('Failed to save settings to localStorage:', error);
      }
    }
  }, [settings, isLoading]);

  const updateSetting = useCallback(<K extends keyof MatrixSettings>(
    key: K,
    value: MatrixSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
    } catch (error) {
      console.warn('Failed to reset settings in localStorage:', error);
    }
  }, []);

  const importSettings = useCallback((newSettings: Partial<MatrixSettings>) => {
    const validated = { ...settings, ...newSettings };
    setSettings(validated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(validated));
    } catch (error) {
      console.warn('Failed to import settings:', error);
    }
  }, [settings]);

  const exportSettings = useCallback(() => {
    return JSON.stringify(settings, null, 2);
  }, [settings]);

  return {
    settings,
    isLoading,
    updateSetting,
    resetSettings,
    importSettings,
    exportSettings
  };
};