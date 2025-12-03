import React, { useState } from 'react';
import { Sparkles, FileVideo, User, History, X, Plus, Download, Menu } from 'lucide-react';

export default function Header({ projects = [], currentProject, hasVideo }) {
  const [showHistory, setShowHistory] = useState(false);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return `Today at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  return (
    <header style={styles.header}>
      <div style={styles.headerLeft}>
        <button 
          style={styles.menuButton}
          onClick={() => setShowHistory(!showHistory)}
          title="View Projects"
        >
          <Menu size={20} />
        </button>
        
        <div style={styles.logoIcon}>
          <Sparkles size={20} />
        </div>
        <h1 style={styles.headerTitle}>Editverse AI</h1>
        
        <div style={styles.projectTitle}>0504</div>
      </div>

      {showHistory && (
        <div style={styles.historyPanel}>
          <div style={styles.historyHeader}>
            <div style={styles.historyTitle}>
              <History size={18} />
              Project History
            </div>
            <button 
              style={styles.closeButton}
              onClick={() => setShowHistory(false)}
            >
              <X size={18} />
            </button>
          </div>
          <div style={styles.historyContent}>
            {projects && projects.length > 0 ? (
              projects.map((project, index) => (
                <div 
                  key={project.id}
                  style={{
                    ...styles.historyItem,
                    ...(currentProject && project.id === currentProject.id ? styles.historyItemActive : {}),
                  }}
                >
                  <div style={styles.projectIcon}>
                    <FileVideo size={16} />
                  </div>
                  <div style={styles.historyItemContent}>
                    <div style={styles.historyItemTitle}>
                      {project.name || `Untitled Project ${index + 1}`}
                    </div>
                    <div style={styles.historyItemDetails}>
                      {formatDate(project.timestamp)} • {project.clips || 0} clips
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={styles.emptyHistory}>
                <FileVideo size={32} style={{ marginBottom: '8px', opacity: 0.5 }} />
                <div>No projects yet</div>
                <div style={{ fontSize: '11px', marginTop: '4px' }}>Upload a video to get started</div>
              </div>
            )}
          </div>
        </div>
      )}

      <div style={styles.headerRight}>
        <div style={styles.divider} />
        <button style={styles.shortcutButton}>Shortcut</button>
        <button style={{...styles.exportButton, opacity: hasVideo ? 1 : 0.5}} disabled={!hasVideo}>
          <Download size={18} />
          Export
        </button>
      </div>
    </header>
  );
}

const styles = {
  header: {
    background: '#000',
    borderBottom: '1px solid #27272a',
    padding: '8px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    zIndex: 100,
    height: '56px',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  menuButton: {
    width: '36px',
    height: '36px',
    border: 'none',
    borderRadius: '6px',
    background: '#27272a',
    color: '#e4e4e7',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  logoIcon: {
    width: '32px',
    height: '32px',
    background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
  },
  headerTitle: {
    color: '#e4e4e7',
    margin: 0,
    fontSize: '18px',
  },
  projectTitle: {
    color: '#a1a1aa',
    fontSize: '14px',
    marginLeft: '8px',
  },
  headerButton: {
    width: '36px',
    height: '36px',
    border: 'none',
    borderRadius: '6px',
    background: '#27272a',
    color: '#e4e4e7',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  divider: {
    width: '1px',
    height: '24px',
    background: '#27272a',
    margin: '0 4px',
  },
  shortcutButton: {
    padding: '8px 16px',
    border: 'none',
    borderRadius: '6px',
    background: '#27272a',
    color: '#e4e4e7',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  exportButton: {
    padding: '8px 20px',
    border: 'none',
    borderRadius: '6px',
    background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
    color: 'white',
    fontSize: '14px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  historyPanel: {
    position: 'absolute',
    top: '60px',
    left: '24px',
    width: '320px',
    background: '#18181b',
    border: '1px solid #27272a',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
    overflow: 'hidden',
    zIndex: 1000,
  },
  historyHeader: {
    padding: '12px 16px',
    background: '#0f0f14',
    borderBottom: '1px solid #27272a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  historyTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#e4e4e7',
    fontSize: '14px',
    fontWeight: '600',
  },
  closeButton: {
    width: '28px',
    height: '28px',
    border: 'none',
    borderRadius: '4px',
    background: 'transparent',
    color: '#a1a1aa',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  historyContent: {
    maxHeight: '400px',
    overflowY: 'auto',
    padding: '8px',
  },
  historyItem: {
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '4px',
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    transition: 'all 0.2s',
    background: '#0f0f14',
  },
  historyItemActive: {
    background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
    boxShadow: '0 2px 4px rgba(37, 99, 235, 0.3)',
  },
  projectIcon: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    border: '2px solid #3f3f46',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  activeIndicator: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#3b82f6',
  },
  historyItemContent: {
    flex: 1,
  },
  historyItemTitle: {
    color: '#e4e4e7',
    fontSize: '13px',
    marginBottom: '2px',
  },
  historyItemDetails: {
    color: '#71717a',
    fontSize: '11px',
  },
  emptyHistory: {
    padding: '24px',
    textAlign: 'center',
    color: '#71717a',
    fontSize: '13px',
  },
};