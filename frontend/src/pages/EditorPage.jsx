import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/UI/Header';
import VideoPreview from '../components/VideoEditor/VideoPreview';
import SlideOutSidebar from '../components/VideoEditor/SlideOutSidebar';
import RightSidebar from '../components/VideoEditor/RightSidebar';
import Timeline from '../components/VideoEditor/Timeline';

const EditorPage = () => {
    const [hasVideo, setHasVideo] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [selectedClip, setSelectedClip] = useState(null);
    const [isDraggingPlayhead, setIsDraggingPlayhead] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [projectName, setProjectName] = useState('Untitled Project');
    const [activeLeftTab, setActiveLeftTab] = useState('transitions');

    const videoSeekRef = useRef(null);
    const videoRef = useRef(null);

    const [clips, setClips] = useState([]);
    const [musicTracks, setMusicTracks] = useState([]);

    // New states for text and stickers
    const [textOverlays, setTextOverlays] = useState([]);
    const [stickers, setStickers] = useState([]);

    // Effects and filters states
    const [appliedEffects, setAppliedEffects] = useState([]);
    const [appliedTransition, setAppliedTransition] = useState(null);
    const [appliedFilter, setAppliedFilter] = useState(null);

    // Adjustment states
    const [adjustments, setAdjustments] = useState({
        brightness: 0,
        contrast: 0,
        saturation: 0,
        hue: 0,
        highlight: 0,
        shadows: 0,
        temperature: 0,
        tint: 0,
        sharpness: 0,
        vignette: 0,
    });

    const [history, setHistory] = useState([{ clips: [], musicTracks: [] }]);
    const [historyIndex, setHistoryIndex] = useState(0);

    const [projects, setProjects] = useState([]);
    const [currentProject, setCurrentProject] = useState(null);

    // AI Chat messages
    const [messages, setMessages] = useState([
        {
            id: 1,
            role: 'assistant',
            content: 'Hello! I\'m your AI assistant. I can help you edit your video, suggest improvements, or answer any questions about Editverse AI features.',
            timestamp: new Date(),
        },
    ]);

    const saveToHistory = (newClips, newMusic) => {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push({ clips: newClips, musicTracks: newMusic });
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    };

    const handleUndo = () => {
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            setClips(history[newIndex].clips);
            setMusicTracks(history[newIndex].musicTracks);
        }
    };

    const handleRedo = () => {
        if (historyIndex < history.length - 1) {
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            setClips(history[newIndex].clips);
            setMusicTracks(history[newIndex].musicTracks);
        }
    };

    const handleCut = () => {
        if (selectedClip) {
            const clipIndex = clips.findIndex(c => c.id === selectedClip);
            if (clipIndex !== -1) {
                const clip = clips[clipIndex];
                const cutTime = currentTime;

                if (cutTime > clip.start && cutTime < clip.end) {
                    const newClips = [...clips];
                    const newClip = {
                        id: Date.now(),
                        name: `${clip.name} (Cut)`,
                        start: cutTime,
                        end: clip.end,
                    };
                    newClips[clipIndex] = { ...clip, end: cutTime };
                    newClips.splice(clipIndex + 1, 0, newClip);
                    setClips(newClips);
                    saveToHistory(newClips, musicTracks);
                }
            }
        }
    };

    const handleTrim = () => {
        if (selectedClip) {
            const clipIndex = clips.findIndex(c => c.id === selectedClip);
            if (clipIndex !== -1) {
                const newClips = [...clips];
                const clip = newClips[clipIndex];
                newClips[clipIndex] = { ...clip, end: clip.end - 1 };
                setClips(newClips);
                saveToHistory(newClips, musicTracks);
            }
        }
    };

    const handleDelete = () => {
        if (selectedClip) {
            const newClips = clips.filter(c => c.id !== selectedClip);
            setClips(newClips);
            saveToHistory(newClips, musicTracks);
            setSelectedClip(null);
        }
    };

    const handleAddMusic = () => {
        if (!hasVideo) return;

        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'audio/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file && file.type.startsWith('audio/')) {
                const newTrack = {
                    id: Date.now(),
                    name: file.name,
                    start: 0,
                    end: duration,
                    file: URL.createObjectURL(file),
                };
                const newMusic = [...musicTracks, newTrack];
                setMusicTracks(newMusic);
                saveToHistory(clips, newMusic);
            }
        };
        input.click();
    };

    const handleAddMedia = () => {
        if (!hasVideo) return;

        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'video/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file && file.type.startsWith('video/')) {
                const newClip = {
                    id: Date.now(),
                    name: file.name,
                    start: clips.length > 0 ? clips[clips.length - 1].end : 0,
                    end: (clips.length > 0 ? clips[clips.length - 1].end : 0) + 10,
                    file: URL.createObjectURL(file),
                };
                const newClips = [...clips, newClip];
                setClips(newClips);
                saveToHistory(newClips, musicTracks);
            }
        };
        input.click();
    };

    const handleVideoUpload = () => {
        setHasVideo(true);
        // Create initial clip for the video
        const initialClip = {
            id: Date.now(),
            name: 'Main Video',
            start: 0,
            end: 0, // Will be updated when duration is loaded
        };
        setClips([initialClip]);
        setSelectedClip(initialClip.id);
        saveToHistory([initialClip], musicTracks);
    };

    const handleProjectNameChange = (name) => {
        setProjectName(name);
    };

    const handleProjectCreated = (project) => {
        setProjects(prev => [project, ...prev]);
        setCurrentProject(project);
    };

    // Update clip end time when duration changes
    useEffect(() => {
        if (duration > 0 && clips.length > 0 && clips[0].end === 0) {
            const updatedClips = clips.map(clip => ({
                ...clip,
                end: duration
            }));
            setClips(updatedClips);
        }
    }, [duration]);

    const handleVideoTimeUpdate = (e) => {
        if (isPlaying && e.target && !isDraggingPlayhead) {
            setCurrentTime(e.target.currentTime);
        }
    };

    const handleSeek = (time) => {
        videoSeekRef.current(time);
    };

    const handleAdjustmentChange = (key, value) => {
        setAdjustments(prev => ({
            ...prev,
            [key]: value
        }));
    };

    // Handler functions for new features
    const handleAddText = (textData) => {
        const newText = {
            id: Date.now(),
            ...textData,
            position: { x: 50, y: 50 }, // centered in %
        };
        setTextOverlays(prev => [...prev, newText]);
    };

    const handleAddSticker = (stickerData) => {
        const newSticker = {
            id: Date.now(),
            ...stickerData,
            position: { x: 50, y: 50 }, // centered in %
        };
        setStickers(prev => [...prev, newSticker]);
    };

    const handleApplyEffect = (effect) => {
        if (!hasVideo) return;

        // Add effect to the list
        const newEffect = {
            id: Date.now(),
            ...effect,
            startTime: currentTime,
            duration: 3, // 3 second effect by default
        };
        setAppliedEffects(prev => [...prev, newEffect]);

        console.log('Applied effect:', effect.name);
    };

    const handleApplyTransition = (transition) => {
        if (!hasVideo || !selectedClip) return;

        // Apply transition to selected clip
        setAppliedTransition({
            id: Date.now(),
            ...transition,
            clipId: selectedClip,
        });

        console.log('Applied transition:', transition.name);
    };

    const handleApplyFilter = (filter) => {
        if (!hasVideo) return;

        // Apply filter - replaces previous filter
        setAppliedFilter(filter);

        // Apply filter as adjustments
        if (filter.adjustments) {
            setAdjustments(prev => ({
                ...prev,
                ...filter.adjustments,
            }));
        }

        console.log('Applied filter:', filter.name);
    };

    const handleSendMessage = (content) => {
        const userMessage = {
            id: messages.length + 1,
            role: 'user',
            content,
            timestamp: new Date(),
        };
        setMessages([...messages, userMessage]);

        // Simulate AI response
        setTimeout(() => {
            const aiMessage = {
                id: messages.length + 2,
                role: 'assistant',
                content: 'I understand you want to ' + content.toLowerCase() + '. Let me help you with that! You can use the tools in the toolbar to make those edits.',
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, aiMessage]);
        }, 1000);
    };

    return (
        <div style={styles.container}>
            <Header
                projects={projects}
                currentProject={currentProject}
                hasVideo={hasVideo}
            />

            <div style={styles.mainContent}>
                <SlideOutSidebar
                    hasVideo={hasVideo}
                    onAddMedia={handleAddMedia}
                    onAddMusic={handleAddMusic}
                    onAddText={handleAddText}
                    onAddSticker={handleAddSticker}
                    onApplyEffect={handleApplyEffect}
                    onApplyTransition={handleApplyTransition}
                    onApplyFilter={handleApplyFilter}
                    adjustments={adjustments}
                    onAdjustmentChange={handleAdjustmentChange}
                    textOverlays={textOverlays}
                    stickers={stickers}
                    clips={clips}
                />

                <div style={styles.centerArea}>
                    <VideoPreview
                        isPlaying={isPlaying}
                        onPlayPause={() => setIsPlaying(!isPlaying)}
                        currentTime={currentTime}
                        duration={duration}
                        onVideoUpload={handleVideoUpload}
                        onProjectCreated={handleProjectCreated}
                        onDurationChange={setDuration}
                        onTimeUpdate={handleVideoTimeUpdate}
                        onSeek={handleSeek}
                        videoSeekRef={videoSeekRef}
                        videoRef={videoRef}
                        isMuted={isMuted}
                        onToggleMute={() => setIsMuted(!isMuted)}
                        projectName={projectName}
                        onProjectNameChange={handleProjectNameChange}
                        adjustments={adjustments}
                    />

                    <Timeline
                        clips={clips}
                        musicTracks={musicTracks}
                        currentTime={currentTime}
                        duration={duration}
                        onTimeChange={setCurrentTime}
                        selectedClip={selectedClip}
                        onSelectClip={setSelectedClip}
                        hasVideo={hasVideo}
                        isDraggingPlayhead={isDraggingPlayhead}
                        onDraggingChange={setIsDraggingPlayhead}
                        onSeek={handleSeek}
                        isPlaying={isPlaying}
                        onPlayPause={() => setIsPlaying(!isPlaying)}
                        onCut={handleCut}
                        onDelete={handleDelete}
                        onTrim={handleTrim}
                        onUndo={handleUndo}
                        onRedo={handleRedo}
                        canUndo={historyIndex > 0}
                        canRedo={historyIndex < history.length - 1}
                    />
                </div>

                <RightSidebar
                    messages={messages}
                    onSendMessage={handleSendMessage}
                />
            </div>
        </div>
    );
}

const styles = {
    container: {
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        background: '#000',
        userSelect: 'none',
    },
    mainContent: {
        flex: 1,
        display: 'flex',
        overflow: 'hidden',
        minHeight: 0,
        position: 'relative',
    },
    centerArea: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        minWidth: 0,
    },
};
export default EditorPage;