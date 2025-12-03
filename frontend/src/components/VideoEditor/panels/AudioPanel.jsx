import React, { useState } from 'react';
import { Upload, Music, Volume2, Plus, Play, Pause } from 'lucide-react';

export default function AudioPanel({ onAddMusic }) {
  const [uploadedAudio, setUploadedAudio] = useState([]);
  const [playingId, setPlayingId] = useState(null);

  const handleUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'audio/*';
    input.multiple = true;
    input.onchange = (e) => {
      const files = Array.from(e.target.files);
      const newAudio = files.map(file => ({
        id: Date.now() + Math.random(),
        name: file.name,
        url: URL.createObjectURL(file),
        duration: '3:24',
      }));
      setUploadedAudio(prev => [...prev, ...newAudio]);
      if (onAddMusic) onAddMusic();
    };
    input.click();
  };

  const stockMusic = [
    { id: 1, name: 'Lofi Hip Hop Beat', genre: 'Lofi', duration: '2:45', bpm: '85' },
    { id: 2, name: 'Upbeat Corporate', genre: 'Corporate', duration: '3:12', bpm: '120' },
    { id: 3, name: 'Cinematic Epic', genre: 'Cinematic', duration: '4:30', bpm: '140' },
    { id: 4, name: 'Acoustic Guitar', genre: 'Acoustic', duration: '2:18', bpm: '95' },
    { id: 5, name: 'Electronic Dance', genre: 'EDM', duration: '3:45', bpm: '128' },
    { id: 6, name: 'Jazz Piano', genre: 'Jazz', duration: '2:55', bpm: '110' },
  ];

  const soundEffects = [
    { id: 1, name: 'Whoosh', category: 'Transition' },
    { id: 2, name: 'Pop', category: 'UI' },
    { id: 3, name: 'Click', category: 'UI' },
    { id: 4, name: 'Swoosh', category: 'Transition' },
    { id: 5, name: 'Ding', category: 'Notification' },
    { id: 6, name: 'Applause', category: 'Ambience' },
  ];

  const togglePlay = (id) => {
    setPlayingId(playingId === id ? null : id);
  };

  return (
    <div style={styles.container}>
      {/* Upload Section */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Import Audio</div>
        <button style={styles.uploadButton} onClick={handleUpload}>
          <Upload size={18} />
          Upload Music/Audio
        </button>
        <div style={styles.hint}>Supports MP3, WAV, M4A, AAC</div>
      </div>

      {/* Uploaded Audio */}
      {uploadedAudio.length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Your Audio</div>
          <div style={styles.audioList}>
            {uploadedAudio.map(item => (
              <div key={item.id} style={styles.audioItem}>
                <button 
                  style={styles.playButton}
                  onClick={() => togglePlay(item.id)}
                >
                  {playingId === item.id ? <Pause size={16} /> : <Play size={16} />}
                </button>
                <div style={styles.audioInfo}>
                  <div style={styles.audioName}>{item.name}</div>
                  <div style={styles.audioDuration}>{item.duration}</div>
                </div>
                <button style={styles.addIconButton}>
                  <Plus size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stock Music */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Stock Music</div>
        <div style={styles.audioList}>
          {stockMusic.map(item => (
            <div key={item.id} style={styles.audioItem}>
              <button 
                style={styles.playButton}
                onClick={() => togglePlay(item.id)}
              >
                {playingId === item.id ? <Pause size={16} /> : <Play size={16} />}
              </button>
              <div style={styles.audioInfo}>
                <div style={styles.audioName}>{item.name}</div>
                <div style={styles.audioMeta}>
                  <span style={styles.genreBadge}>{item.genre}</span>
                  <span style={styles.audioDuration}>{item.duration}</span>
                  <span style={styles.bpmBadge}>{item.bpm} BPM</span>
                </div>
              </div>
              <button style={styles.addIconButton}>
                <Plus size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Sound Effects */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Sound Effects</div>
        <div style={styles.effectsGrid}>
          {soundEffects.map(item => (
            <div key={item.id} style={styles.effectItem}>
              <Volume2 size={20} style={{ color: '#3b82f6' }} />
              <div style={styles.effectInfo}>
                <div style={styles.effectName}>{item.name}</div>
                <div style={styles.effectCategory}>{item.category}</div>
              </div>
              <button style={styles.addIconButton}>
                <Plus size={14} />
              </button>
            </div>
          ))}
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
  uploadButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px',
    background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
    border: 'none',
    borderRadius: '8px',
    color: 'white',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  hint: {
    fontSize: '12px',
    color: '#71717a',
    textAlign: 'center',
  },
  audioList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  audioItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    background: '#27272a',
    borderRadius: '8px',
    border: '1px solid #3f3f46',
    transition: 'all 0.2s',
  },
  playButton: {
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#3b82f6',
    border: 'none',
    borderRadius: '50%',
    color: 'white',
    cursor: 'pointer',
    flexShrink: 0,
  },
  audioInfo: {
    flex: 1,
    minWidth: 0,
  },
  audioName: {
    fontSize: '13px',
    color: '#e4e4e7',
    fontWeight: '500',
    marginBottom: '4px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  audioMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  audioDuration: {
    fontSize: '11px',
    color: '#71717a',
  },
  genreBadge: {
    fontSize: '10px',
    padding: '2px 6px',
    background: '#3f3f46',
    borderRadius: '4px',
    color: '#a1a1aa',
  },
  bpmBadge: {
    fontSize: '10px',
    padding: '2px 6px',
    background: '#1e3a8a',
    borderRadius: '4px',
    color: '#93c5fd',
  },
  addIconButton: {
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#3f3f46',
    border: 'none',
    borderRadius: '6px',
    color: '#e4e4e7',
    cursor: 'pointer',
    flexShrink: 0,
    transition: 'all 0.2s',
  },
  effectsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  effectItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 12px',
    background: '#27272a',
    borderRadius: '6px',
    border: '1px solid #3f3f46',
  },
  effectInfo: {
    flex: 1,
  },
  effectName: {
    fontSize: '13px',
    color: '#e4e4e7',
    fontWeight: '500',
  },
  effectCategory: {
    fontSize: '11px',
    color: '#71717a',
  },
};
