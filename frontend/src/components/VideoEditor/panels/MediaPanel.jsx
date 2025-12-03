import React, { useState } from 'react';
import { Upload, Plus, Video, Image as ImageIcon, Play } from 'lucide-react';

export default function MediaPanel({ hasVideo, onAddMedia }) {
  const [uploadedMedia, setUploadedMedia] = useState([]);

  const handleUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/*,image/*';
    input.multiple = true;
    input.onchange = (e) => {
      const files = Array.from(e.target.files);
      const newMedia = files.map(file => ({
        id: Date.now() + Math.random(),
        name: file.name,
        type: file.type.startsWith('video/') ? 'video' : 'image',
        url: URL.createObjectURL(file),
        duration: file.type.startsWith('video/') ? '00:10' : null,
      }));
      setUploadedMedia(prev => [...prev, ...newMedia]);
      if (onAddMedia) onAddMedia();
    };
    input.click();
  };

  const stockMedia = [
    { id: 1, name: 'Green Screen', type: 'video', color: '#00ff00', duration: '00:10' },
    { id: 2, name: 'Color Bars', type: 'video', gradient: 'linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet)', duration: '00:05' },
    { id: 3, name: 'Black Background', type: 'image', color: '#000000' },
    { id: 4, name: 'White Background', type: 'image', color: '#ffffff' },
    { id: 5, name: 'Gradient Blue', type: 'image', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { id: 6, name: 'Gradient Pink', type: 'image', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  ];

  return (
    <div style={styles.container}>
      {/* Upload Section */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Import Media</div>
        <button style={styles.uploadButton} onClick={handleUpload}>
          <Upload size={18} />
          Upload Video/Image
        </button>
        <div style={styles.hint}>Supports MP4, MOV, JPG, PNG</div>
      </div>

      {/* Uploaded Media */}
      {uploadedMedia.length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Your Media</div>
          <div style={styles.mediaGrid}>
            {uploadedMedia.map(item => (
              <div key={item.id} style={styles.mediaItem}>
                <div style={styles.mediaThumbnail}>
                  {item.type === 'video' ? (
                    <video src={item.url} style={styles.thumbnailVideo} />
                  ) : (
                    <img src={item.url} style={styles.thumbnailImage} alt={item.name} />
                  )}
                  {item.duration && (
                    <div style={styles.durationBadge}>{item.duration}</div>
                  )}
                  <button style={styles.addButton}>
                    <Plus size={14} />
                  </button>
                </div>
                <div style={styles.mediaName}>{item.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stock Media */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Stock Media</div>
        <div style={styles.mediaGrid}>
          {stockMedia.map(item => (
            <div key={item.id} style={styles.mediaItem}>
              <div style={{
                ...styles.mediaThumbnail,
                background: item.color || item.gradient,
              }}>
                {item.type === 'video' && (
                  <>
                    <Play size={24} style={{ color: 'white', opacity: 0.7 }} />
                    <div style={styles.durationBadge}>{item.duration}</div>
                  </>
                )}
                <button style={styles.addButton}>
                  <Plus size={14} />
                </button>
              </div>
              <div style={styles.mediaName}>{item.name}</div>
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
  mediaGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
  },
  mediaItem: {
    cursor: 'pointer',
  },
  mediaThumbnail: {
    position: 'relative',
    width: '100%',
    aspectRatio: '16/9',
    background: '#27272a',
    borderRadius: '8px',
    overflow: 'hidden',
    border: '1px solid #3f3f46',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '6px',
  },
  thumbnailVideo: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  durationBadge: {
    position: 'absolute',
    bottom: '6px',
    right: '6px',
    padding: '2px 6px',
    background: 'rgba(0, 0, 0, 0.8)',
    borderRadius: '4px',
    fontSize: '10px',
    color: 'white',
    fontWeight: '600',
  },
  addButton: {
    position: 'absolute',
    top: '6px',
    right: '6px',
    width: '28px',
    height: '28px',
    background: 'rgba(37, 99, 235, 0.9)',
    border: 'none',
    borderRadius: '6px',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    opacity: 0,
    transition: 'opacity 0.2s',
  },
  mediaName: {
    fontSize: '11px',
    color: '#a1a1aa',
    textAlign: 'center',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
};
