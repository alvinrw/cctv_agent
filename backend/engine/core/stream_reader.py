import cv2
import time
import os

class VideoStreamer:
    def __init__(self, source, target_fps=5, loop=True, realtime=True):
        self.source = source
        self.target_fps = target_fps
        self.loop = loop
        self.realtime = realtime
        
        # Check if source is a local file
        self.is_file = isinstance(self.source, str) and os.path.isfile(self.source)
        
        try:
            self.source = int(source)
            self.is_file = False
        except ValueError:
            pass
            
        self.cap = cv2.VideoCapture(self.source)
        if not self.is_file:
            self.cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)
        
        self.source_fps = self.cap.get(cv2.CAP_PROP_FPS) if self.is_file else 0.0
        if not self.source_fps or self.source_fps <= 0:
            self.source_fps = float(target_fps) if target_fps > 0 else 25.0

        self.total_frames = int(self.cap.get(cv2.CAP_PROP_FRAME_COUNT)) if self.is_file else 0
        self.stream_start_time = time.time()

    def _get_desired_frame_index(self):
        elapsed_seconds = max(0.0, time.time() - self.stream_start_time)
        desired_frame = int(elapsed_seconds * self.source_fps)

        if self.loop and self.total_frames > 0:
            desired_frame = desired_frame % self.total_frames

        return desired_frame

    def get_video_timestamp_seconds(self):
        if not self.cap.isOpened():
            return 0.0

        if self.is_file:
            pos_msec = self.cap.get(cv2.CAP_PROP_POS_MSEC)
            if pos_msec and pos_msec > 0:
                return pos_msec / 1000.0

            frame_pos = self.cap.get(cv2.CAP_PROP_POS_FRAMES)
            fps = self.cap.get(cv2.CAP_PROP_FPS)
            if fps and fps > 0:
                return max(0.0, frame_pos / fps)

        return max(0.0, time.time() - self.stream_start_time)

    def get_next_frame(self):
        if not self.cap.isOpened():
            return None

        if self.is_file:
            # For local files, seek to the frame that matches elapsed wall-clock time
            # so playback stays close to realtime even if inference is slower.
            if self.realtime:
                desired_frame = self._get_desired_frame_index()
                current_frame = int(self.cap.get(cv2.CAP_PROP_POS_FRAMES))

                if desired_frame > current_frame + 1:
                    self.cap.set(cv2.CAP_PROP_POS_FRAMES, desired_frame)

            # Read the current frame and loop if requested
            ret, frame = self.cap.read()
            
            if not ret:
                if self.loop:
                    self.cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
                    self.stream_start_time = time.time()
                    ret, frame = self.cap.read()
                    if not ret:
                        return None
                else:
                    return None

            if not self.realtime and self.target_fps > 0:
                frame_interval = 1.0 / self.target_fps
                time.sleep(frame_interval)

            return frame
        else:
            # For live streams (RTSP/Webcam), return the freshest frame available.
            ret, frame = self.cap.read()
            if ret:
                return frame
            return None

    def release(self):
        if self.cap.isOpened():
            self.cap.release()
