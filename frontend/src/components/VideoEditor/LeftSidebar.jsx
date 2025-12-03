import React, { useState } from 'react';
import { Film, Music, Type, Sticker, Sparkles, Wand2, Filter, SlidersHorizontal, Plus, Upload, ChevronDown, Search, Download } from 'lucide-react';

export default function LeftSidebar({ activeTab, onTabChange, onAddMusic, onAddMedia, hasVideo }) {
  const [selectedMenu, setSelectedMenu] = useState('Media');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showSubMenu, setShowSubMenu] = useState('Local');
  const [searchQuery, setSearchQuery] = useState('');

  const mainMenus = [
    { id: 'media', label: 'Media', icon: Film },
    { id: 'audio', label: 'Audio', icon: Music },
    { id: 'text', label: 'Text', icon: Type },
    { id: 'stickers', label: 'Stickers', icon: Sticker },
    { id: 'effects', label: 'Effects', icon: Sparkles },
    { id: 'transitions', label: 'Transitions', icon: Wand2 },
    { id: 'filters', label: 'Filters', icon: Filter },
    { id: 'adjustment', label: 'Adjustment', icon: SlidersHorizontal },
  ];

  const libraryItems = {
    media: [
      { id: 1, name: 'Transparent', type: 'image', duration: '00:02', thumbnail: 'transparent' },
      { id: 2, name: 'Color Bars', type: 'video', duration: '00:02', thumbnail: 'colorbars' },
      { id: 3, name: 'TV Bars', type: 'video', duration: '00:01', thumbnail: 'tvbars' },
      { id: 4, name: 'Green Screen', type: 'video', duration: '00:10', thumbnail: 'green' },
      { id: 5, name: 'Transition 1', type: 'video', duration: '00:05', thumbnail: 'transition1' },
      { id: 6, name: 'Like Button', type: 'video', duration: '00:05', thumbnail: 'like' },
    ],
    transitions: [
      { id: 1, name: 'Mix', thumbnail: true },
      { id: 2, name: 'Blur', thumbnail: true },
      { id: 3, name: 'Black Fade', thumbnail: true },
      { id: 4, name: 'Then and Now', thumbnail: true },
      { id: 5, name: 'White Flash', thumbnail: true },
      { id: 6, name: 'White Flash II', thumbnail: true },
    ],
  };

  const subMenus = ['Local', 'Import', 'Library'];
  const libraryCategories = ['Trending', 'Christmas&Winter', 'Green Screen', 'Background', 'Intro&End', 'Transitions', 'Scenery'];

  const handleMenuSelect = (menu) => {
    setSelectedMenu(menu.label);
    onTabChange(menu.id);
    setIsDropdownOpen(false);
  };

  const handleSubMenuSelect = (subMenu) => {
    setShowSubMenu(subMenu);
  };

  const getThumbnailStyle = (type) => {
    switch(type) {
      case 'transparent':
        return { background: 'repeating-conic-gradient(#ddd 0% 25%, white 0% 50%) 50% / 20px 20px' };
      case 'colorbars':
        return { background: 'linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet)' };
      case 'tvbars':
        return { background: 'linear-gradient(90deg, #fff 14%, #ff0 28%, cyan 42%, #0f0 56%, magenta 70%, red 84%, blue 100%)' };
      case 'green':
        return { background: '#00ff00' };
      case 'transition1':
        return { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' };
      case 'like':
        return { background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' };
      default:
        return { background: '#27272a' };
    }
  };

  const renderLocalContent = () => {
    if (activeTab === 'media') {
      return (
        <div style={styles.localImportArea}>
          <div style={styles.importBox}>
            <Upload size={24} style={{ color: '#3b82f6' }} />
            <div style={styles.importText}>Import</div>
            <div style={styles.importSubtext}>Supports: videos, audios, photos</div>
          </div>
          <button style={styles.uploadButton} onClick={onAddMedia}>
            <Plus size={16} />
            Upload Media
          </button>
        </div>
      );
    } else if (activeTab === 'audio') {
      return (
        <div style={styles.localImportArea}>
          <div style={styles.importBox}>
            <Music size={24} style={{ color: '#3b82f6' }} />
            <div style={styles.importText}>Import Audio</div>
            <div style={styles.importSubtext}>Supports: MP3, WAV, AAC</div>
          </div>
          <button style={styles.uploadButton} onClick={onAddMusic}>
            <Plus size={16} />
            Upload Audio
          </button>
        </div>
      );
    }
    return null;
  };

  const renderLibraryContent = () => {
    const items = activeTab === 'transitions' ? libraryItems.transitions : libraryItems.media;
    
    return (
      <div style={styles.libraryContent}>
        {/* Search Bar */}
        <div style={styles.searchContainer}>
          <Search size={14} style={{ color: '#71717a' }} />
          <input 
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        {/* Filter Button */}
        <div style={styles.filterBar}>
          <button style={styles.filterButton}>
            <span>All</span>
            <ChevronDown size={14} />
          </button>
        </div>

        {/* Library Categories */}
        <div style={styles.categoryList}>
          {libraryCategories.map((category, idx) => (
            <button 
              key={idx} 
              style={{
                ...styles.categoryItem,
                ...(idx === 0 ? styles.categoryItemActive : {})
              }}
            >
              <ChevronDown size={14} style={{ transform: 'rotate(-90deg)' }} />
              {category}
            </button>
          ))}
        </div>

        {/* Library Items Grid */}
        <div style={styles.libraryGrid}>
          {items.map((item) => (
            <div key={item.id} style={styles.libraryItem}>
              <div style={{...styles.libraryThumbnail, ...getThumbnailStyle(item.thumbnail)}}>
                {item.thumbnail === 'like' && <div style={{ fontSize: '32px' }}>👍</div>}
                {item.duration && (
                  <div style={styles.durationBadge}>{item.duration}</div>
                )}
                <button style={styles.downloadIcon}>
                  <Download size={12} />
                </button>
              </div>
              <div style={styles.itemName}>{item.name}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (!hasVideo && showSubMenu !== 'Import') {
      return (
        <div style={styles.emptyContent}>
          <Upload size={32} style={{ opacity: 0.3, marginBottom: '8px' }} />
          <div style={styles.emptyText}>Upload a video first</div>
        </div>
      );
    }

    if (showSubMenu === 'Local') {
      return renderLocalContent();
    } else if (showSubMenu === 'Import') {
      return renderLocalContent();
    } else if (showSubMenu === 'Library') {
      return renderLibraryContent();
    }

    return null;
  };

  const selectedMenuData = mainMenus.find(m => m.label === selectedMenu);
  const SelectedIcon = selectedMenuData?.icon || Film;

  return (
    <div style={styles.container}>
      {/* Dropdown Menu */}
      <div style={styles.dropdownContainer}>
        <button 
          style={styles.dropdownButton}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <SelectedIcon size={18} />
          <span>{selectedMenu}</span>
          <ChevronDown size={16} style={{ marginLeft: 'auto', transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
        </button>

        {isDropdownOpen && (
          <div style={styles.dropdownMenu}>
            {mainMenus.map((menu) => {
              const Icon = menu.icon;
              return (
                <button
                  key={menu.id}
                  style={{
                    ...styles.dropdownItem,
                    ...(selectedMenu === menu.label ? styles.dropdownItemActive : {})
                  }}
                  onClick={() => handleMenuSelect(menu)}
                >
                  <Icon size={18} />
                  <span>{menu.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Sub Menu (Local, Import, Library) */}
      <div style={styles.subMenuBar}>
        {subMenus.map((subMenu) => (
          <button
            key={subMenu}
            style={{
              ...styles.subMenuItem,
              ...(showSubMenu === subMenu ? styles.subMenuItemActive : {})
            }}
            onClick={() => handleSubMenuSelect(subMenu)}
          >
            <ChevronDown size={14} style={{ transform: 'rotate(-90deg)', opacity: showSubMenu === subMenu ? 1 : 0 }} />
            {subMenu}
          </button>
        ))}
      </div>
      
      {/* Content Area */}
      <div style={styles.content}>
        {renderContent()}
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: '260px',
    background: '#18181b',
    borderRight: '1px solid #27272a',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  dropdownContainer: {
    position: 'relative',
    borderBottom: '1px solid #27272a',
  },
  dropdownButton: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 16px',
    background: '#0f0f14',
    border: 'none',
    color: '#e4e4e7',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    background: '#18181b',
    border: '1px solid #27272a',
    borderTop: 'none',
    zIndex: 1000,
    maxHeight: '400px',
    overflowY: 'auto',
  },
  dropdownItem: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 16px',
    background: 'transparent',
    border: 'none',
    color: '#a1a1aa',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    textAlign: 'left',
  },
  dropdownItemActive: {
    background: '#27272a',
    color: '#3b82f6',
  },
  subMenuBar: {
    display: 'flex',
    flexDirection: 'column',
    borderBottom: '1px solid #27272a',
    padding: '8px 0',
  },
  subMenuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    background: 'transparent',
    border: 'none',
    borderLeft: '3px solid transparent',
    color: '#a1a1aa',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    textAlign: 'left',
  },
  subMenuItemActive: {
    background: '#27272a',
    borderLeft: '3px solid #3b82f6',
    color: '#e4e4e7',
  },
  content: {
    flex: 1,
    overflow: 'auto',
    padding: '16px',
  },
  localImportArea: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  importBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
    background: '#0f0f14',
    border: '2px dashed #3f3f46',
    borderRadius: '8px',
    gap: '8px',
  },
  importText: {
    color: '#e4e4e7',
    fontSize: '14px',
    fontWeight: '500',
  },
  importSubtext: {
    color: '#71717a',
    fontSize: '11px',
  },
  uploadButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '10px',
    background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
    border: 'none',
    borderRadius: '6px',
    color: 'white',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  libraryContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    background: '#27272a',
    borderRadius: '6px',
    border: '1px solid #3f3f46',
  },
  searchInput: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: '#e4e4e7',
    fontSize: '13px',
  },
  filterBar: {
    display: 'flex',
    gap: '8px',
  },
  filterButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    background: '#27272a',
    border: 'none',
    borderRadius: '4px',
    color: '#a1a1aa',
    fontSize: '12px',
    cursor: 'pointer',
  },
  categoryList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  categoryItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    background: 'transparent',
    border: 'none',
    borderRadius: '4px',
    color: '#a1a1aa',
    fontSize: '12px',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.2s',
  },
  categoryItemActive: {
    background: '#27272a',
    color: '#e4e4e7',
  },
  libraryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
  },
  libraryItem: {
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  libraryThumbnail: {
    position: 'relative',
    width: '100%',
    aspectRatio: '16/9',
    background: '#27272a',
    borderRadius: '6px',
    overflow: 'hidden',
    marginBottom: '6px',
    border: '1px solid #3f3f46',
  },
  durationBadge: {
    position: 'absolute',
    bottom: '4px',
    right: '4px',
    padding: '2px 6px',
    background: 'rgba(0, 0, 0, 0.8)',
    borderRadius: '3px',
    fontSize: '10px',
    color: 'white',
  },
  downloadIcon: {
    position: 'absolute',
    top: '4px',
    right: '4px',
    width: '24px',
    height: '24px',
    background: 'rgba(0, 0, 0, 0.7)',
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
  itemName: {
    fontSize: '11px',
    color: '#a1a1aa',
    textAlign: 'center',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  emptyContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: '#52525b',
  },
  emptyText: {
    fontSize: '13px',
    color: '#52525b',
  },
};
