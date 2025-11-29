# backend/app/services/video_processor.py
import ffmpeg
import os
import sys
from pathlib import Path
import whisper # <--- Add this at top
from datetime import timedelta
from pathlib import Path
import shutil

# --- HELPER: SUBTITLE GENERATION ---
def generate_srt(transcription: dict, srt_path: str):
    """Converts Whisper output to SRT format."""
    with open(srt_path, "w", encoding="utf-8") as f:
        for i, segment in enumerate(transcription["segments"]):
            start = str(timedelta(seconds=int(segment["start"]))) + ",000"
            end = str(timedelta(seconds=int(segment["end"]))) + ",000"
            text = segment["text"].strip()
            # SRT Format: 1 \n 00:00:01 --> 00:00:04 \n Text
            f.write(f"{i+1}\n{start} --> {end}\n{text}\n\n")

def add_subtitles(input_path: str):
    """Runs Whisper and generates an SRT file."""
    print(f"🎙️ [WHISPER] Loading model...")
    model = whisper.load_model("tiny")
    
    print(f"🎙️ [WHISPER] Transcribing {input_path}...")
    result = model.transcribe(input_path)
    
    srt_filename = input_path.replace(".mp4", ".srt")
    generate_srt(result, srt_filename)
    
    print(f"✅ [WHISPER] Saved SRT to: {srt_filename}")
    return srt_filename

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
    srt_path = None

    if not actions:
        return input_path

    try:
        # 1. Setup Input Streams
        stream = ffmpeg.input(input_path)
        audio = stream.audio
        music_stream = None
        # 2. Define Font Path (Update this if your font name is different!)
        # We go up from services -> app -> backend -> assets
        base_dir = Path(__file__).resolve().parent.parent.parent
        font_path = base_dir / "assets" / "fonts" / "Arial.ttf"
        music_dir = base_dir / "assets" / "music"
        
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

            elif action['type'] == 'add_text':
                content = action.get('content', '')
                pos = action.get('position', 'center')
                
                # Dynamic Positioning Logic
                if pos == 'top':
                    y_pos = '50' # 50 pixels padding from top
                elif pos == 'bottom':
                    y_pos = 'h-text_h-50' # 50 pixels padding from bottom
                else:
                    y_pos = '(h-text_h)/2' # Center

                stream = stream.drawtext(
                    text=content,
                    fontfile=font_str,
                    fontsize=64,
                    fontcolor='white',
                    x='(w-text_w)/2', # Always center horizontally
                    y=y_pos,          # Variable vertical position
                    borderw=2,
                    bordercolor='black'
                )
            # --- NEW: TRANSITIONS (Fade) ---
            elif action['type'] == 'fade':
                kind = action.get('kind', 'in')
                dur = float(action.get('duration', 1.0))
                
                if kind == 'in':
                    # Fade IN video from black starting at 0s
                    stream = stream.filter('fade', type='in', start_time=0, duration=dur)
                    # Fade IN audio starting at 0s
                    audio = audio.filter('afade', type='in', start_time=0, duration=dur)
                elif kind == 'out':
                    # Fade OUT logic requires knowing total duration, which is complex in chaining.
                    # For this MVP, we will skip fade-out to avoid crashes, or you can assume
                    # it applies to the last N seconds if you track duration.
                    # Let's stick to Fade IN for safety in Level 1.
                    pass
            elif action['type'] == 'add_music':
                track_name = action.get('track')
                vol = action.get('volume', 0.3)
                
                music_path = music_dir / track_name
                
                if music_path.exists():
                    # Load music file
                    music_input = ffmpeg.input(
                        str(music_path), 
                        format='mp3', 
                        probesize=20000000, 
                        analyzeduration=10000000
                    )

                    music_stream = (
                    music_input
                    .filter('aresample', 48000)
                    .filter('aformat', channel_layouts='stereo')  # safer than channelconvert
                    .filter('acopy')
                    .filter('volume', vol)
                )
                    
                 
                else:
                    print(f"⚠️ Music file not found: {music_path}")
            
            elif action['type'] == 'auto_subtitles':
        
                    print("🎙️ Processing Subtitles...")

                    generated_srt_path = add_subtitles(input_path)
                
                # 2. Define a simple filename for the Project Root
                # We use the unique video filename to avoid conflicts: "temp_subs_xyz.srt"
                    root_srt_filename = f"temp_subs_{filename.replace('.mp4', '')}.srt"
                    temp_srt_path = os.path.abspath(root_srt_filename)
                    
                    # 3. Copy the SRT file to the Project Root (Where Celery runs)
                    shutil.copy2(generated_srt_path, temp_srt_path)
                    print(f"DEBUG: Copied SRT to root for FFmpeg: {root_srt_filename}")

                    # 4. Run FFmpeg using ONLY the filename (No drive letters, no paths)
                    # FFmpeg will look in the current working directory and find it.
                    stream = stream.filter(
                        'subtitles', 
                        root_srt_filename, 
                        force_style='FontName=Arial,FontSize=24,PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000,BorderStyle=3,Outline=1,Shadow=0,MarginV=20'
                    )


            # ------------------------

        # 4. Output
        if music_stream:
            # 'duration=first' means cut the music when the video ends
            # 'dropout_transition=0' makes it seamless
            mixed_audio = ffmpeg.filter([audio, music_stream], 'amix', duration='first', dropout_transition=0)
            stream = ffmpeg.output(stream, mixed_audio, output_path)
        else:
            # Standard output if no music
            stream = ffmpeg.output(stream, audio, output_path)
            print("🎬 Running FFmpeg...")


        ffmpeg.run(stream, overwrite_output=True)
        
        return output_path

    except ffmpeg.Error as e:
        print(f"FFmpeg Execution Error: {e.stderr.decode('utf8') if e.stderr else str(e)}")
        raise
    finally:
        # Cleanup the temp file from Root
        if temp_srt_path and os.path.exists(temp_srt_path):
            try:
                os.remove(temp_srt_path)
                print(f"DEBUG: Cleaned up temp SRT file: {temp_srt_path}")
            except:
                pass
    