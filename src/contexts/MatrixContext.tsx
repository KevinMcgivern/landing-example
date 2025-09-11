import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { MatrixContextType, AppSettings } from '../types';
import { DEFAULT_SETTINGS, LOCAL_STORAGE_KEYS } from '../constants';
import { getLocalStorageItem, setLocalStorageItem, downloadJSON, uploadJSON } from '../utils';

const MatrixContext = createContext<MatrixContextType | undefined>(undefined);

export const useMatrix = (): MatrixContextType => {
  const context = useContext(MatrixContext);
  if (!context) {
    throw new Error('useMatrix must be used within a MatrixProvider');
  }
  return context;
};

interface MatrixProviderProps {
  children: ReactNode;
}

export const MatrixProvider: React.FC<MatrixProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = getLocalStorageItem<AppSettings>(LOCAL_STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    return { ...DEFAULT_SETTINGS, ...saved };
  });

  useEffect(() => {
    setLocalStorageItem(LOCAL_STORAGE_KEYS.SETTINGS, settings);
  }, [settings]);

  const updateSettings = useCallback((newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  const exportSettings = useCallback(() => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    downloadJSON(settings, `matrix-rain-settings-${timestamp}.json`);
  }, [settings]);

  const importSettings = useCallback(async (importedSettings: AppSettings) => {
    try {
      setSettings(importedSettings);
    } catch (error) {
      console.error('Failed to import settings:', error);
      throw new Error('Invalid settings file');
    }
  }, []);

  const importSettingsFromFile = useCallback(async () => {
    try {
      const imported = await uploadJSON();
      await importSettings(imported);
    } catch (error) {
      console.error('Failed to import settings from file:', error);
      throw new Error('Failed to import settings');
    }
  }, [importSettings]);

  const value: MatrixContextType = {
    settings,
    updateSettings,
    resetSettings,
    exportSettings,
    importSettings: importSettingsFromFile
  };

  return (
    <MatrixContext.Provider value={value}>
      {children}
    </MatrixContext.Provider>
  );
};

export default MatrixProvider;