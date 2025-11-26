# backend/app/services/video_processor.py
import ffmpeg
import os
from pathlib import Path

def get_video_metadata(file_path: str):
    """
    Uses FFmpeg to probe the video file and extract metadata.
    """
    try:
        probe = ffmpeg.probe(file_path)
        video_stream = next((stream for stream in probe['streams'] if stream['codec_type'] == 'video'), None)
        
        if not video_stream:
            raise ValueError("No video stream found")

        # Safe FPS calculation
        r_frame_rate = video_stream.get('r_frame_rate', '30/1')
        try:
            num, den = map(int, r_frame_rate.split('/'))
            fps = num / den if den > 0 else 30.0
        except:
            fps = 30.0

        return {
            "duration": float(video_stream.get('duration', 0)),
            "width": int(video_stream.get('width', 0)),
            "height": int(video_stream.get('height', 0)),
            "codec": video_stream.get('codec_name', 'unknown'),
            "fps": fps
        }
    except ffmpeg.Error as e:
        print(f"FFmpeg Error: {e.stderr.decode('utf8') if e.stderr else str(e)}")
        raise
    except Exception as e:
        print(f"General Error during probing: {str(e)}")
        raise

def apply_edits(input_path: str, actions: list) -> str:
    """
    Applies AI-generated edits (Trim, Speed, Filter, Text) to the video.
    """
    directory = os.path.dirname(input_path)
    filename = os.path.basename(input_path)
    output_path = os.path.join(directory, f"edited_{filename}")

    if not actions:
        return input_path

    try:
        # 1. Setup Input Streams
        stream = ffmpeg.input(input_path)
        audio = stream.audio
        
        # 2. Define Font Path (Update this if your font name is different!)
        # We go up from services -> app -> backend -> assets
        base_dir = Path(__file__).resolve().parent.parent.parent
        font_path = base_dir / "assets" / "fonts" / "Arial.ttf"
        
        # Convert to string and fix Windows path issues for FFmpeg
        font_str = str(font_path).replace("\\", "/")

        # 3. Apply Actions
        for action in actions:
            
            # --- TRIM ---
            if action['type'] == 'trim':
                stream = stream.trim(start=action['start'], end=action['end']).setpts('PTS-STARTPTS')
                audio = audio.filter_('atrim', start=action['start'], end=action['end']).filter_('asetpts', 'PTS-STARTPTS')
            
            # --- FILTERS ---
            elif action['type'] == 'filter':
                if action.get('name') == 'grayscale':
                    stream = stream.hue(s=0)
                elif action.get('name') == 'contrast':
                    stream = stream.eq(contrast=1.5)

            # --- SPEED (New!) ---
            elif action['type'] == 'speed':
                factor = float(action['value'])
                # Video Speed: setpts = 1/factor
                stream = stream.setpts(f'{1/factor}*PTS')
                # Audio Speed: atempo (limited to 0.5 - 2.0 range per filter)
                # For simple MVP, we assume factor is between 0.5 and 2.0
                audio = audio.filter_('atempo', factor)

            # --- TEXT OVERLAY (New!) ---
            elif action['type'] == 'add_text':
                content = action.get('content', '')
                # Draw text in center, size 64, white
                stream = stream.drawtext(
                    text=content,
                    fontfile=font_str,
                    fontsize=64,
                    fontcolor='white',
                    x='(w-text_w)/2', 
                    y='(h-text_h)/2',
                    borderw=2,
                    bordercolor='black' 
                )

        # 4. Output
        stream = ffmpeg.output(stream, audio, output_path)
        ffmpeg.run(stream, overwrite_output=True)
        
        return output_path

    except ffmpeg.Error as e:
        print(f"FFmpeg Execution Error: {e.stderr.decode('utf8') if e.stderr else str(e)}")
        raise