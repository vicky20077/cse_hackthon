'use client';

import * as React from 'react';
import { Camera, CameraOff, Mic, MicOff, User } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface CameraPreviewProps {
  isCameraOn: boolean;
  isMicOn: boolean;
  onToggleCamera: () => void;
  onToggleMic: () => void;
  candidateName?: string;
  isListening?: boolean;
}

export function CameraPreview({
  isCameraOn,
  isMicOn,
  onToggleCamera,
  onToggleMic,
  candidateName = 'Candidate',
  isListening = false,
}: CameraPreviewProps) {
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const streamRef = React.useRef<MediaStream | null>(null);
  const [hasPermission, setHasPermission] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    let mounted = true;

    async function initCamera() {
      if (!isCameraOn) {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((t) => t.stop());
          streamRef.current = null;
        }
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
        return;
      }

      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: { ideal: 640 }, height: { ideal: 480 } },
            audio: false,
          });
          if (!mounted) {
            stream.getTracks().forEach((t) => t.stop());
            return;
          }
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          setHasPermission(true);
        }
      } catch (err) {
        console.warn('Camera access denied or unavailable:', err);
        if (mounted) setHasPermission(false);
      }
    }

    initCamera();

    return () => {
      mounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, [isCameraOn]);

  return (
    <div className="relative h-full w-full rounded-2xl bg-[#0b0b14] border border-white/10 overflow-hidden flex items-center justify-center group shadow-2xl">
      {/* Video Feed */}
      {isCameraOn && hasPermission !== false ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="h-full w-full object-cover transform -scale-x-100"
        />
      ) : (
        /* Fallback Candidate Avatar */
        <div className="flex flex-col items-center justify-center p-6 text-center space-y-3">
          <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-primary/30 to-secondary/30 border border-white/10 flex items-center justify-center text-white shadow-xl">
            <User className="h-10 w-10 text-primary" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">{candidateName}</h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isCameraOn === false ? 'Camera is turned off' : 'Camera preview inactive'}
            </p>
          </div>
        </div>
      )}

      {/* Listening Border Glow */}
      {isListening && (
        <div className="absolute inset-0 border-2 border-emerald-500/50 rounded-2xl pointer-events-none animate-pulse" />
      )}

      {/* Top status bar overlay */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs text-white">
          <span className={cn('h-2 w-2 rounded-full', isListening ? 'bg-emerald-400 animate-ping' : 'bg-primary')} />
          <span>{candidateName}</span>
        </div>

        <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-white/10 text-xs">
          {isMicOn ? (
            <span className="text-emerald-400 flex items-center gap-1">
              <Mic className="h-3 w-3" />
              <span>Live</span>
            </span>
          ) : (
            <span className="text-rose-400 flex items-center gap-1">
              <MicOff className="h-3 w-3" />
              <span>Muted</span>
            </span>
          )}
        </div>
      </div>

      {/* Bottom quick controls */}
      <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-2 pointer-events-auto opacity-90 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onToggleMic}
          className={cn(
            'p-2.5 rounded-xl border backdrop-blur-md transition-all',
            isMicOn
              ? 'bg-black/60 border-white/15 text-white hover:bg-black/80'
              : 'bg-rose-500/20 border-rose-500/40 text-rose-400 hover:bg-rose-500/30'
          )}
          title={isMicOn ? 'Mute Microphone' : 'Unmute Microphone'}
        >
          {isMicOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
        </button>

        <button
          onClick={onToggleCamera}
          className={cn(
            'p-2.5 rounded-xl border backdrop-blur-md transition-all',
            isCameraOn
              ? 'bg-black/60 border-white/15 text-white hover:bg-black/80'
              : 'bg-rose-500/20 border-rose-500/40 text-rose-400 hover:bg-rose-500/30'
          )}
          title={isCameraOn ? 'Turn Camera Off' : 'Turn Camera On'}
        >
          {isCameraOn ? <Camera className="h-4 w-4" /> : <CameraOff className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
