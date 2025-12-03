import React, { useState } from 'react';
import { Plus } from 'lucide-react';

export default function TransitionsPanel({ onApplyTransition, clips = [] }) {
  const [selectedTransition, setSelectedTransition] = useState(null);
  const [duration, setDuration] = useState(1.0);

  const transitions = [
    { id: 'fade', name: 'Fade', category: 'Basic' },
    { id: 'dissolve', name: 'Dissolve', category: 'Basic' },
    { id: 'wipe-left', name: 'Wipe Left', category: 'Wipe' },
    { id: 'wipe-right', name: 'Wipe Right', category: 'Wipe' },
    { id: 'wipe-up', name: 'Wipe Up', category: 'Wipe' },
    { id: 'wipe-down', name: 'Wipe Down', category: 'Wipe' },
    { id: 'slide-left', name: 'Slide Left', category: 'Slide' },
    { id: 'slide-right', name: 'Slide Right', category: 'Slide' },
    { id: 'zoom-in', name: 'Zoom In', category: 'Zoom' },
    { id: 'zoom-out', name: 'Zoom Out', category: 'Zoom' },
    { id: 'blur', name: 'Blur Transition', category: 'Effect' },
    { id: 'spin', name: 'Spin', category: 'Effect' },
    { id: 'flip', name: 'Flip', category: 'Effect' },
    { id: 'cube', name: 'Cube Rotate', category: '3D' },
    { id: 'page-curl', name: 'Page Curl', category: '3D' },
    { id: 'ripple', name: 'Ripple', category: 'Effect' },
  ];

  const handleApplyTransition = (transition) => {
    setSelectedTransition(transition.id);
    if (onApplyTransition) {
      onApplyTransition({
        ...transition,
        duration: duration,
      });
    }
  };

  const getTransitionPreview = (transitionId) => {
    const baseGradient1 = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    const baseGradient2 = 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';

    switch(transitionId) {
      case 'fade':
      case 'dissolve':
        return (
          <div style={styles.previewContainer}>
            <div style={{...styles.previewHalf, background: baseGradient1, opacity: 0.5}} />
            <div style={{...styles.previewHalf, background: baseGradient2, opacity: 0.5}} />
          </div>
        );
      case 'wipe-left':
        return (
          <div style={styles.previewContainer}>
            <div style={{...styles.previewHalf, background: baseGradient1, width: '40%'}} />
            <div style={{...styles.previewHalf, background: baseGradient2, width: '60%', marginLeft: 'auto'}} />
          </div>
        );
      case 'wipe-right':
        return (
          <div style={styles.previewContainer}>
            <div style={{...styles.previewHalf, background: baseGradient2, width: '60%'}} />
            <div style={{...styles.previewHalf, background: baseGradient1, width: '40%', marginLeft: 'auto'}} />
          </div>
        );
      case 'slide-left':
      case 'slide-right':
        return (
          <div style={styles.previewContainer}>
            <div style={{...styles.previewHalf, background: baseGradient1, transform: 'translateX(-20%)' }} />
            <div style={{...styles.previewHalf, background: baseGradient2, transform: 'translateX(20%)' }} />
          </div>
        );
      case 'zoom-in':
      case 'zoom-out':
        return (
          <div style={styles.previewContainer}>
            <div style={{...styles.previewHalf, background: baseGradient1}} />
            <div style={{
              position: 'absolute',
              width: '40%',
              height: '40%',
              background: baseGradient2,
              top: '30%',
              left: '30%',
              borderRadius: '4px',
            }} />
          </div>
        );
      default:
        return (
          <div style={styles.previewContainer}>
            <div style={{...styles.previewHalf, background: baseGradient1}} />
            <div style={{...styles.previewHalf, background: baseGradient2}} />
          </div>
        );
    }
  };

  const categories = ['All', 'Basic', 'Wipe', 'Slide', 'Zoom', 'Effect', '3D'];
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredTransitions = activeCategory === 'All' 
    ? transitions 
    : transitions.filter(t => t.category === activeCategory);

  return (
    <div style={styles.container}>
      {/* Duration Control */}
      <div style={styles.section}>
        <div style={styles.controlRow}>
          <div style={styles.controlLabel}>Duration</div>
          <div style={styles.controlValue}>{duration.toFixed(1)}s</div>
        </div>
        <input
          type="range"
          min="0.3"
          max="3.0"
          step="0.1"
          value={duration}
          onChange={(e) => setDuration(parseFloat(e.target.value))}
          style={styles.slider}
        />
      </div>

      {/* Category Filter */}
      <div style={styles.categoriesContainer}>
        {categories.map(cat => (
          <button
            key={cat}
            style={{
              ...styles.categoryButton,
              ...(activeCategory === cat ? styles.categoryButtonActive : {})
            }}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Transitions Grid */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>
          {activeCategory === 'All' ? 'All Transitions' : `${activeCategory} Transitions`}
        </div>
        <div style={styles.transitionsGrid}>
          {filteredTransitions.map(transition => (
            <div
              key={transition.id}
              style={{
                ...styles.transitionItem,
                ...(selectedTransition === transition.id ? styles.transitionItemActive : {})
              }}
              onClick={() => handleApplyTransition(transition)}
            >
              <div style={styles.transitionPreview}>
                {getTransitionPreview(transition.id)}
              </div>
              <div style={styles.transitionName}>{transition.name}</div>
              <button style={styles.addButton}>
                <Plus size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Info */}
      <div style={styles.infoBox}>
        <div style={styles.infoTitle}>💡 How to Use</div>
        <div style={styles.infoText}>
          Transitions are applied between clips. Add multiple clips to your timeline, then select a transition to apply between them.
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
  controlRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  controlLabel: {
    fontSize: '13px',
    color: '#a1a1aa',
  },
  controlValue: {
    fontSize: '13px',
    color: '#3b82f6',
    fontWeight: '600',
  },
  slider: {
    width: '100%',
    height: '6px',
    borderRadius: '3px',
    outline: 'none',
    background: '#3f3f46',
    WebkitAppearance: 'none',
  },
  categoriesContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
  },
  categoryButton: {
    padding: '6px 12px',
    background: '#27272a',
    border: '1px solid #3f3f46',
    borderRadius: '6px',
    color: '#a1a1aa',
    fontSize: '11px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  categoryButtonActive: {
    background: '#3b82f6',
    borderColor: '#3b82f6',
    color: 'white',
  },
  transitionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
  },
  transitionItem: {
    position: 'relative',
    cursor: 'pointer',
    border: '2px solid transparent',
    borderRadius: '8px',
    transition: 'all 0.2s',
  },
  transitionItemActive: {
    border: '2px solid #3b82f6',
  },
  transitionPreview: {
    width: '100%',
    aspectRatio: '16/9',
    background: '#27272a',
    borderRadius: '6px',
    overflow: 'hidden',
    marginBottom: '6px',
    border: '1px solid #3f3f46',
  },
  previewContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
    display: 'flex',
  },
  previewHalf: {
    width: '50%',
    height: '100%',
  },
  transitionName: {
    fontSize: '11px',
    color: '#a1a1aa',
    textAlign: 'center',
    marginBottom: '4px',
  },
  addButton: {
    position: 'absolute',
    top: '6px',
    right: '6px',
    width: '24px',
    height: '24px',
    background: 'rgba(59, 130, 246, 0.9)',
    border: 'none',
    borderRadius: '4px',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    opacity: 0,
    transition: 'opacity 0.2s',
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