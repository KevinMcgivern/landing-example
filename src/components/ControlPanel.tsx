import React, { useState, useCallback, useMemo } from 'react';
import { Play, Pause, Settings, Zap, Palette, Volume2, VolumeX, Download, Upload, RotateCcw, BarChart2 } from 'lucide-react';
import { useMatrix } from '../contexts/MatrixContext';
import { THEMES } from '../constants';
import { debounce } from '../utils';

const ControlPanel: React.FC = () => {
  const { settings, updateSettings, resetSettings, exportSettings, importSettings } = useMatrix();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPerformance, setShowPerformance] = useState(false);

  const handlePlayPause = useCallback(() => {
    updateSettings({ isPlaying: !settings.isPlaying });
  }, [settings.isPlaying, updateSettings]);

  const handleSoundToggle = useCallback(() => {
    updateSettings({ soundEnabled: !settings.soundEnabled });
  }, [settings.soundEnabled, updateSettings]);

  const handleSpeedChange = useCallback(
    debounce((value: number) => {
      updateSettings({ speed: value });
    }, 50),
    [updateSettings]
  );

  const handleDensityChange = useCallback(
    debounce((value: number) => {
      updateSettings({ density: value });
    }, 50),
    [updateSettings]
  );

  const handleColorChange = useCallback((color: string) => {
    updateSettings({ color });
  }, [updateSettings]);

  const handleThemeChange = useCallback((themeName: string) => {
    const theme = THEMES.find(t => t.name === themeName);
    if (theme) {
      updateSettings({
        theme: themeName,
        speed: theme.settings.speed,
        density: theme.settings.density,
        color: theme.settings.color
      });
    }
  }, [updateSettings]);

  const handleExport = useCallback(async () => {
    try {
      exportSettings();
    } catch (error) {
      console.error('Export failed:', error);
    }
  }, [exportSettings]);

  const handleImport = useCallback(async () => {
    try {
      await importSettings();
    } catch (error) {
      console.error('Import failed:', error);
    }
  }, [importSettings]);

  const currentTheme = useMemo(() => {
    return THEMES.find(t => t.name === settings.theme) || THEMES[0];
  }, [settings.theme]);

  const colorOptions = useMemo(() => [
    { value: '#00ff00', label: 'Green', className: 'bg-green-500' },
    { value: '#00ffff', label: 'Cyan', className: 'bg-cyan-500' },
    { value: '#ff00ff', label: 'Magenta', className: 'bg-fuchsia-500' },
    { value: '#ffff00', label: 'Yellow', className: 'bg-yellow-500' },
    { value: '#ff0000', label: 'Red', className: 'bg-red-500' },
    { value: '#ffffff', label: 'White', className: 'bg-white' }
  ], []);

  return (
    <div className="fixed top-4 right-4 z-50">
      <div 
        className={`bg-black/90 backdrop-blur-lg border border-gray-700 rounded-xl transition-all duration-300 overflow-hidden ${
          isExpanded ? 'w-96' : 'w-auto'
        }`}
        style={{
          boxShadow: `0 0 20px ${currentTheme.colors.primary}40`
        }}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div 
                className="p-2 rounded-lg"
                style={{ backgroundColor: `${currentTheme.colors.primary}20` }}
              >
                <Zap 
                  className="w-5 h-5" 
                  style={{ color: currentTheme.colors.primary }}
                />
              </div>
              <div>
                <h2 
                  className="font-mono font-bold text-lg"
                  style={{ color: currentTheme.colors.primary }}
                >
                  MATRIX RAIN
                </h2>
                <p className="text-gray-400 text-xs font-mono">v2.0 Enhanced</p>
              </div>
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>

          {isExpanded && (
            <div className="space-y-6">
              {/* Playback Controls */}
              <div className="space-y-4">
                <h3 className="text-gray-300 font-mono text-sm font-semibold">PLAYBACK</h3>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handlePlayPause}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 font-mono text-sm"
                    style={{
                      backgroundColor: `${currentTheme.colors.primary}20`,
                      border: `1px solid ${currentTheme.colors.primary}40`,
                      color: currentTheme.colors.primary
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = `${currentTheme.colors.primary}30`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = `${currentTheme.colors.primary}20`;
                    }}
                  >
                    {settings.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>{settings.isPlaying ? 'PAUSE' : 'PLAY'}</span>
                  </button>
                  
                  <button
                    onClick={handleSoundToggle}
                    className="p-2 rounded-lg transition-all duration-200"
                    style={{
                      backgroundColor: `${currentTheme.colors.primary}20`,
                      border: `1px solid ${currentTheme.colors.primary}40`,
                      color: currentTheme.colors.primary
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = `${currentTheme.colors.primary}30`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = `${currentTheme.colors.primary}20`;
                    }}
                  >
                    {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => setShowPerformance(!showPerformance)}
                    className="p-2 rounded-lg transition-all duration-200"
                    style={{
                      backgroundColor: showPerformance ? `${currentTheme.colors.accent}30` : `${currentTheme.colors.primary}20`,
                      border: `1px solid ${showPerformance ? currentTheme.colors.accent : currentTheme.colors.primary}40`,
                      color: showPerformance ? currentTheme.colors.accent : currentTheme.colors.primary
                    }}
                  >
                    <BarChart2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Theme Selector */}
              <div className="space-y-4">
                <h3 className="text-gray-300 font-mono text-sm font-semibold">THEMES</h3>
                <div className="grid grid-cols-2 gap-2">
                  {THEMES.map((theme) => (
                    <button
                      key={theme.name}
                      onClick={() => handleThemeChange(theme.name)}
                      className="p-3 rounded-lg transition-all duration-200 text-left"
                      style={{
                        backgroundColor: settings.theme === theme.name ? `${theme.colors.primary}30` : `${theme.colors.primary}10`,
                        border: `1px solid ${settings.theme === theme.name ? theme.colors.primary : theme.colors.primary}30`,
                      }}
                    >
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: theme.colors.primary }}
                        />
                        <span 
                          className="font-mono text-xs"
                          style={{ color: settings.theme === theme.name ? theme.colors.primary : '#9CA3AF' }}
                        >
                          {theme.name}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Speed Control */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-gray-300 font-mono text-sm font-semibold">SPEED</label>
                  <span 
                    className="font-mono text-xs px-2 py-1 rounded"
                    style={{ 
                      backgroundColor: `${currentTheme.colors.primary}20`,
                      color: currentTheme.colors.primary 
                    }}
                  >
                    {settings.speed.toFixed(1)}x
                  </span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="5"
                  step="0.1"
                  defaultValue={settings.speed}
                  onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, ${currentTheme.colors.primary} 0%, ${currentTheme.colors.primary} ${((settings.speed - 0.5) / 4.5) * 100}%, #374151 ${((settings.speed - 0.5) / 4.5) * 100}%, #374151 100%)`
                  }}
                />
              </div>

              {/* Density Control */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-gray-300 font-mono text-sm font-semibold">DENSITY</label>
                  <span 
                    className="font-mono text-xs px-2 py-1 rounded"
                    style={{ 
                      backgroundColor: `${currentTheme.colors.primary}20`,
                      color: currentTheme.colors.primary 
                    }}
                  >
                    {settings.density.toFixed(1)}x
                  </span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="2"
                  step="0.1"
                  defaultValue={settings.density}
                  onChange={(e) => handleDensityChange(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, ${currentTheme.colors.primary} 0%, ${currentTheme.colors.primary} ${((settings.density - 0.1) / 1.9) * 100}%, #374151 ${((settings.density - 0.1) / 1.9) * 100}%, #374151 100%)`
                  }}
                />
              </div>

              {/* Color Palette */}
              <div className="space-y-3">
                <h3 className="text-gray-300 font-mono text-sm font-semibold">COLORS</h3>
                <div className="grid grid-cols-6 gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => handleColorChange(color.value)}
                      className={`w-8 h-8 rounded-lg border-2 transition-all duration-200 ${
                        settings.color === color.value ? 'scale-110' : 'hover:scale-105'
                      }`}
                      style={{
                        backgroundColor: color.value,
                        borderColor: settings.color === color.value ? currentTheme.colors.accent : '#374151',
                        boxShadow: settings.color === color.value ? `0 0 10px ${currentTheme.colors.accent}50` : 'none'
                      }}
                      title={color.label}
                    />
                  ))}
                </div>
              </div>

              {/* Import/Export */}
              <div className="space-y-3">
                <h3 className="text-gray-300 font-mono text-sm font-semibold">PRESETS</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleExport}
                    className="flex items-center justify-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 font-mono text-xs"
                    style={{
                      backgroundColor: `${currentTheme.colors.primary}20`,
                      border: `1px solid ${currentTheme.colors.primary}40`,
                      color: currentTheme.colors.primary
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = `${currentTheme.colors.primary}30`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = `${currentTheme.colors.primary}20`;
                    }}
                  >
                    <Download className="w-3 h-3" />
                    <span>Export</span>
                  </button>
                  
                  <button
                    onClick={handleImport}
                    className="flex items-center justify-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 font-mono text-xs"
                    style={{
                      backgroundColor: `${currentTheme.colors.primary}20`,
                      border: `1px solid ${currentTheme.colors.primary}40`,
                      color: currentTheme.colors.primary
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = `${currentTheme.colors.primary}30`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = `${currentTheme.colors.primary}20`;
                    }}
                  >
                    <Upload className="w-3 h-3" />
                    <span>Import</span>
                  </button>
                </div>
              </div>

              {/* Reset */}
              <div className="space-y-3">
                <button
                  onClick={resetSettings}
                  className="flex items-center justify-center space-x-2 w-full px-4 py-2 rounded-lg transition-all duration-200 font-mono text-xs"
                  style={{
                    backgroundColor: `${currentTheme.colors.accent}20`,
                    border: `1px solid ${currentTheme.colors.accent}40`,
                    color: currentTheme.colors.accent
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = `${currentTheme.colors.accent}30`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = `${currentTheme.colors.accent}20`;
                  }}
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset to Defaults</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;