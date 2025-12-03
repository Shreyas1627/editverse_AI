import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Upload, Volume2, VolumeX, Maximize2 } from 'lucide-react';

export default function VideoPreview({ 
  isPlaying, 
  onPlayPause, 
  currentTime, 
  duration, 
  onVideoUpload, 
  onProjectCreated, 
  onDurationChange, 
  onTimeUpdate, 
  onSeek, 
  videoSeekRef, 
  videoRef, 
  isMuted,
  onToggleMute,
  projectName, 
  onProjectNameChange,
  adjustments 
}) {
  const [hasVideo, setHasVideo] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(projectName);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const internalVideoRef = useRef(null);
  const inputRef = useRef(null);

  // Expose the video seek function to parent
  useEffect(() => {
    if (videoSeekRef) {
      videoSeekRef.current = (time) => {
        if (internalVideoRef.current) {
          internalVideoRef.current.currentTime = time;
        }
      };
    }
  }, [videoSeekRef]);

  // Sync video muted state
  useEffect(() => {
    if (internalVideoRef.current) {
      internalVideoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Apply CSS filters based on adjustments
  const getVideoFilters = () => {
    const filters = [];
    if (adjustments.hue !== 0) filters.push(`hue-rotate(${adjustments.hue}deg)`);
    if (adjustments.saturation !== 0) filters.push(`saturate(${100 + adjustments.saturation}%)`);
    if (adjustments.brightness !== 0) filters.push(`brightness(${100 + adjustments.brightness}%)`);
    if (adjustments.contrast !== 0) filters.push(`contrast(${100 + adjustments.contrast}%)`);
    return filters.join(' ');
  };

  const handleFileUpload = (file) => {
    if (file && file.type.startsWith('video/')) {
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      setHasVideo(true);
      if (onVideoUpload) onVideoUpload();
      
      const fileName = file.name.replace(/\.[^/.]+$/, '');
      if (onProjectNameChange) onProjectNameChange(fileName);
      
      if (onProjectCreated) {
        onProjectCreated({
          id: Date.now(),
          name: fileName,
          timestamp: Date.now(),
          clips: 1,
          videoFile: file,
        });
      }
    }
  };

  // Sync video playback with isPlaying state
  useEffect(() => {
    if (internalVideoRef.current) {
      if (isPlaying) {
        internalVideoRef.current.play();
      } else {
        internalVideoRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Sync video currentTime with timeline
  useEffect(() => {
    if (internalVideoRef.current && !isPlaying) {
      internalVideoRef.current.currentTime = currentTime;
    }
  }, [currentTime, isPlaying]);

  const handleLoadedMetadata = () => {
    if (internalVideoRef.current && internalVideoRef.current.duration && onDurationChange) {
      const videoDuration = internalVideoRef.current.duration;
      if (!isNaN(videoDuration) && isFinite(videoDuration)) {
        onDurationChange(videoDuration);
      }
    }
  };

  const handleDurationChange = () => {
    if (internalVideoRef.current && internalVideoRef.current.duration && onDurationChange) {
      const videoDuration = internalVideoRef.current.duration;
      if (!isNaN(videoDuration) && isFinite(videoDuration)) {
        onDurationChange(videoDuration);
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileUpload(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      handleFileUpload(file);
    };
    input.click();
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '00:00:00:00';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const frames = Math.floor((seconds % 1) * 30); // 30 fps
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}:${frames.toString().padStart(2, '0')}`;
  };

  const handleNameChange = (e) => {
    setTempName(e.target.value);
  };

  const handleNameBlur = () => {
    setIsEditingName(false);
    if (onProjectNameChange) onProjectNameChange(tempName);
  };

  const handleNameKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleNameBlur();
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <div style={styles.topLeft}>
          {isEditingName ? (
            <input
              ref={inputRef}
              type="text"
              value={tempName}
              onChange={handleNameChange}
              onBlur={handleNameBlur}
              onKeyPress={handleNameKeyPress}
              style={styles.nameInput}
              autoFocus
            />
          ) : (
            <div 
              style={styles.nameLabel}
              onClick={() => setIsEditingName(true)}
            >
              {projectName}
            </div>
          )}
        </div>
        <div style={styles.topRight}>
          <div style={styles.timeDisplay}>
            {formatTime(currentTime)}
          </div>
          <div style={styles.separator}>/</div>
          <div style={styles.timeDisplay}>
            {formatTime(duration)}
          </div>
        </div>
      </div>

      <div style={styles.previewArea}>
        {!hasVideo ? (
          <div 
            style={{
              ...styles.uploadArea,
              ...(isDragging ? styles.uploadAreaDragging : {})
            }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={handleClick}
          >
            <div style={styles.uploadIcon}>
              <Upload size={48} />
            </div>
            <div style={styles.uploadText}>
              Drag and drop your video here
            </div>
            <div style={styles.uploadSubtext}>
              or click to browse
            </div>
            <div style={styles.uploadFormats}>
              MP4, MOV, AVI, WebM
            </div>
          </div>
        ) : (
          <div style={styles.videoContainer}>
            <video 
              ref={internalVideoRef}
              src={videoUrl} 
              style={{
                ...styles.video,
                filter: getVideoFilters()
              }}
              controls={false}
              onLoadedMetadata={handleLoadedMetadata}
              onDurationChange={handleDurationChange}
              onTimeUpdate={onTimeUpdate}
            />
            <div style={styles.centerButton}>
              <button style={styles.playOverlay} onClick={onPlayPause}>
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </button>
            </div>
          </div>
        )}
      </div>

      {hasVideo && (
        <div style={styles.controlBar}>
          <div style={styles.controlLeft}>
            <button style={styles.controlButton} onClick={onPlayPause}>
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>
            <button style={styles.controlButton} onClick={onToggleMute}>
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <div style={styles.timeInfo}>
              {formatTime(currentTime)}
            </div>
          </div>
          <div style={styles.controlRight}>
            <button style={styles.controlButton} onClick={() => setIsFullscreen(true)}>
              <Maximize2 size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div style={styles.fullscreenOverlay} onClick={() => setIsFullscreen(false)}>
          <div style={styles.fullscreenModal} onClick={(e) => e.stopPropagation()}>
            <video 
              src={videoUrl} 
              style={{
                ...styles.fullscreenVideo,
                filter: getVideoFilters()
              }}
              controls
              autoPlay={isPlaying}
            />
            <button 
              style={styles.closeFullscreen}
              onClick={() => setIsFullscreen(false)}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    background: '#000',
    minHeight: 0,
  },
  topBar: {
    height: '40px',
    background: '#18181b',
    borderBottom: '1px solid #27272a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 16px',
  },
  topLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  topRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  label: {
    color: '#a1a1aa',
    fontSize: '13px',
  },
  timeDisplay: {
    color: '#e4e4e7',
    fontSize: '13px',
    fontFamily: 'monospace',
    fontVariantNumeric: 'tabular-nums',
  },
  separator: {
    color: '#52525b',
    fontSize: '13px',
  },
  previewArea: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#000',
    position: 'relative',
    minHeight: 0,
  },
  uploadArea: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s',
    gap: '12px',
  },
  uploadAreaDragging: {
    background: 'rgba(37, 99, 235, 0.1)',
  },
  uploadIcon: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    marginBottom: '8px',
  },
  uploadText: {
    fontSize: '18px',
    color: '#e4e4e7',
    fontWeight: '500',
  },
  uploadSubtext: {
    fontSize: '14px',
    color: '#71717a',
  },
  uploadFormats: {
    fontSize: '12px',
    color: '#52525b',
    marginTop: '8px',
  },
  videoContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  video: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
  },
  centerButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
  },
  playOverlay: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: 'rgba(0, 0, 0, 0.6)',
    border: 'none',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
    pointerEvents: 'all',
  },
  controlBar: {
    height: '48px',
    background: '#18181b',
    borderTop: '1px solid #27272a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 16px',
  },
  controlLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  controlRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  controlButton: {
    width: '32px',
    height: '32px',
    borderRadius: '6px',
    border: 'none',
    background: '#27272a',
    color: '#e4e4e7',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  timeInfo: {
    color: '#a1a1aa',
    fontSize: '13px',
    fontFamily: 'monospace',
    fontVariantNumeric: 'tabular-nums',
    marginLeft: '4px',
  },
  nameLabel: {
    color: '#e4e4e7',
    fontSize: '15px',
    fontWeight: '500',
    cursor: 'pointer',
    padding: '4px 8px',
    borderRadius: '4px',
    transition: 'all 0.2s',
  },
  nameInput: {
    background: '#27272a',
    border: '1px solid #3b82f6',
    borderRadius: '4px',
    color: '#e4e4e7',
    fontSize: '15px',
    fontWeight: '500',
    padding: '4px 8px',
    outline: 'none',
    minWidth: '200px',
  },
  fullscreenOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  fullscreenModal: {
    position: 'relative',
    width: '90%',
    height: '90%',
    background: '#000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  fullscreenVideo: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  closeFullscreen: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: 'rgba(0, 0, 0, 0.8)',
    color: 'white',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '50%',
    width: '48px',
    height: '48px',
    fontSize: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
    lineHeight: '1',
    padding: 0,
    zIndex: 10,
  },
};