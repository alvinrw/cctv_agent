import { useState, useEffect, useRef } from 'react';

const CCTV_VIDEO_URL = '/cctv_example.mp4';

export default function VideoPlayer({
    isPlaying,
    onProgress,
    clip,
    isLive = false
}) {
    const videoRef = useRef(null);
    const [duration, setDuration] = useState(0);

    // Handle metadata loaded to get video duration
    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
        }
    };

    // Handle time update to sync progress
    const handleTimeUpdate = () => {
        if (videoRef.current && duration > 0) {
            const progress = (videoRef.current.currentTime / duration) * 100;
            onProgress(progress);
        }
    };

    // Handle video end
    const handleEnded = () => {
        if (videoRef.current) {
            videoRef.current.currentTime = 0;
        }
    };

    // Play/pause based on isPlaying state
    useEffect(() => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.play().catch(err => console.log('Playback prevented:', err));
            } else {
                videoRef.current.pause();
            }
        }
    }, [isPlaying]);

    // Reset video when clip changes
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.currentTime = 0;
        }
    }, [clip?.id]);

    return (
        <div style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f35 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            borderRadius: '8px'
        }}>
            <video
                ref={videoRef}
                onLoadedMetadata={handleLoadedMetadata}
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleEnded}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: isLive ? 'none' : 'block'
                }}
                src={CCTV_VIDEO_URL}
            />

            {/* Live Stream Placeholder */}
            {isLive && (
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    color: 'rgba(255, 255, 255, 0.6)'
                }}>
                    <div style={{
                        fontSize: '48px',
                        marginBottom: '16px',
                        animation: 'pulse 2s infinite'
                    }}>
                        📹
                    </div>
                    <div style={{ fontSize: '14px', textAlign: 'center' }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Live Stream</div>
                        <div style={{ fontSize: '12px', opacity: 0.8 }}>Connected</div>
                    </div>
                </div>
            )}

            <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
        </div>
    );
}
