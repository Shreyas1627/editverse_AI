import React from 'react';
import { RotateCcw } from 'lucide-react';

export default function AdjustmentPanel({ adjustments = {}, onAdjustmentChange }) {
  const controls = [
    { key: 'brightness', label: 'Brightness', min: -100, max: 100, default: 0, unit: '' },
    { key: 'contrast', label: 'Contrast', min: -100, max: 100, default: 0, unit: '' },
    { key: 'saturation', label: 'Saturation', min: -100, max: 100, default: 0, unit: '' },
    { key: 'hue', label: 'Hue', min: -180, max: 180, default: 0, unit: '°' },
    { key: 'highlight', label: 'Highlights', min: -100, max: 100, default: 0, unit: '' },
    { key: 'shadows', label: 'Shadows', min: -100, max: 100, default: 0, unit: '' },
    { key: 'temperature', label: 'Temperature', min: -100, max: 100, default: 0, unit: '' },
    { key: 'tint', label: 'Tint', min: -100, max: 100, default: 0, unit: '' },
    { key: 'sharpness', label: 'Sharpness', min: 0, max: 100, default: 0, unit: '' },
    { key: 'vignette', label: 'Vignette', min: 0, max: 100, default: 0, unit: '' },
  ];

  const handleReset = (key, defaultValue) => {
    if (onAdjustmentChange) {
      onAdjustmentChange(key, defaultValue);
    }
  };

  const handleResetAll = () => {
    controls.forEach(control => {
      if (onAdjustmentChange) {
        onAdjustmentChange(control.key, control.default);
      }
    });
  };

  const getValue = (key, defaultValue) => {
    return adjustments[key] !== undefined ? adjustments[key] : defaultValue;
  };

  return (
    <div style={styles.container}>
      {/* Reset All Button */}
      <div style={styles.section}>
        <button style={styles.resetAllButton} onClick={handleResetAll}>
          <RotateCcw size={16} />
          Reset All Adjustments
        </button>
      </div>

      {/* Color Adjustments */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Color</div>
        {controls.slice(0, 4).map(control => (
          <div key={control.key} style={styles.controlGroup}>
            <div style={styles.controlHeader}>
              <div style={styles.controlLabel}>{control.label}</div>
              <div style={styles.controlActions}>
                <div style={styles.controlValue}>
                  {getValue(control.key, control.default)}{control.unit}
                </div>
                <button
                  style={styles.resetButton}
                  onClick={() => handleReset(control.key, control.default)}
                  title="Reset"
                >
                  <RotateCcw size={12} />
                </button>
              </div>
            </div>
            <input
              type="range"
              min={control.min}
              max={control.max}
              step={1}
              value={getValue(control.key, control.default)}
              onChange={(e) => onAdjustmentChange && onAdjustmentChange(control.key, parseInt(e.target.value))}
              style={styles.slider}
            />
          </div>
        ))}
      </div>

      {/* Light Adjustments */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Light</div>
        {controls.slice(4, 6).map(control => (
          <div key={control.key} style={styles.controlGroup}>
            <div style={styles.controlHeader}>
              <div style={styles.controlLabel}>{control.label}</div>
              <div style={styles.controlActions}>
                <div style={styles.controlValue}>
                  {getValue(control.key, control.default)}{control.unit}
                </div>
                <button
                  style={styles.resetButton}
                  onClick={() => handleReset(control.key, control.default)}
                  title="Reset"
                >
                  <RotateCcw size={12} />
                </button>
              </div>
            </div>
            <input
              type="range"
              min={control.min}
              max={control.max}
              step={1}
              value={getValue(control.key, control.default)}
              onChange={(e) => onAdjustmentChange && onAdjustmentChange(control.key, parseInt(e.target.value))}
              style={styles.slider}
            />
          </div>
        ))}
      </div>

      {/* Temperature & Tint */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>White Balance</div>
        {controls.slice(6, 8).map(control => (
          <div key={control.key} style={styles.controlGroup}>
            <div style={styles.controlHeader}>
              <div style={styles.controlLabel}>{control.label}</div>
              <div style={styles.controlActions}>
                <div style={styles.controlValue}>
                  {getValue(control.key, control.default)}{control.unit}
                </div>
                <button
                  style={styles.resetButton}
                  onClick={() => handleReset(control.key, control.default)}
                  title="Reset"
                >
                  <RotateCcw size={12} />
                </button>
              </div>
            </div>
            <input
              type="range"
              min={control.min}
              max={control.max}
              step={1}
              value={getValue(control.key, control.default)}
              onChange={(e) => onAdjustmentChange && onAdjustmentChange(control.key, parseInt(e.target.value))}
              style={styles.slider}
            />
          </div>
        ))}
      </div>

      {/* Effects */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Effects</div>
        {controls.slice(8, 10).map(control => (
          <div key={control.key} style={styles.controlGroup}>
            <div style={styles.controlHeader}>
              <div style={styles.controlLabel}>{control.label}</div>
              <div style={styles.controlActions}>
                <div style={styles.controlValue}>
                  {getValue(control.key, control.default)}{control.unit}
                </div>
                <button
                  style={styles.resetButton}
                  onClick={() => handleReset(control.key, control.default)}
                  title="Reset"
                >
                  <RotateCcw size={12} />
                </button>
              </div>
            </div>
            <input
              type="range"
              min={control.min}
              max={control.max}
              step={1}
              value={getValue(control.key, control.default)}
              onChange={(e) => onAdjustmentChange && onAdjustmentChange(control.key, parseInt(e.target.value))}
              style={styles.slider}
            />
          </div>
        ))}
      </div>

      {/* Presets */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Quick Presets</div>
        <div style={styles.presetsGrid}>
          {[
            { name: 'Natural', adjustments: { brightness: 0, contrast: 0, saturation: 0 } },
            { name: 'Vibrant', adjustments: { brightness: 10, contrast: 15, saturation: 30 } },
            { name: 'Moody', adjustments: { brightness: -20, contrast: 30, saturation: -10 } },
            { name: 'Bright', adjustments: { brightness: 30, contrast: 10, saturation: 10 } },
          ].map((preset, idx) => (
            <button
              key={idx}
              style={styles.presetButton}
              onClick={() => {
                Object.entries(preset.adjustments).forEach(([key, value]) => {
                  if (onAdjustmentChange) {
                    onAdjustmentChange(key, value);
                  }
                });
              }}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Info */}
      <div style={styles.infoBox}>
        <div style={styles.infoTitle}>💡 Tip</div>
        <div style={styles.infoText}>
          Fine-tune your video's look with precise color and light controls. Changes apply in real-time.
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  sectionTitle: {
    color: '#e4e4e7',
    fontSize: '14px',
    fontWeight: '600',
  },
  resetAllButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '10px',
    background: '#27272a',
    border: '1px solid #3f3f46',
    borderRadius: '8px',
    color: '#e4e4e7',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  controlGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  controlHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  controlLabel: {
    fontSize: '13px',
    color: '#a1a1aa',
  },
  controlActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  controlValue: {
    fontSize: '12px',
    color: '#3b82f6',
    fontWeight: '600',
    minWidth: '40px',
    textAlign: 'right',
  },
  resetButton: {
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'transparent',
    border: '1px solid #3f3f46',
    borderRadius: '4px',
    color: '#71717a',
    cursor: 'pointer',
    transition: 'all 0.2s',
    flexShrink: 0,
  },
  slider: {
    width: '100%',
    height: '6px',
    borderRadius: '3px',
    outline: 'none',
    background: '#3f3f46',
    WebkitAppearance: 'none',
    appearance: 'none',
    cursor: 'pointer',
    margin: '4px 0',
  },
  presetsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '8px',
  },
  presetButton: {
    padding: '10px',
    background: '#27272a',
    border: '1px solid #3f3f46',
    borderRadius: '6px',
    color: '#e4e4e7',
    fontSize: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  infoBox: {
    padding: '12px',
    background: '#27272a',
    borderRadius: '8px',
    border: '1px solid #3f3f46',
  },
  infoTitle: {
    fontSize: '12px',
    color: '#3b82f6',
    fontWeight: '600',
    marginBottom: '6px',
  },
  infoText: {
    fontSize: '12px',
    color: '#a1a1aa',
    lineHeight: '1.5',
  },
};