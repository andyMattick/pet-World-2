import React, { useState } from 'react';
import { Painting } from '../types/game';
import { 
  X, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  MapPin, 
  Sparkles, 
  Calendar, 
  Layers, 
  HelpCircle, 
  CheckCircle2, 
  Lock, 
  Eye, 
  EyeOff, 
  ExternalLink,
  Flame
} from 'lucide-react';

interface ArtInspectorModalProps {
  isOpen: boolean;
  artPiece: Painting | null;
  onClose: () => void;
  onAttemptTheft?: (paintingId: string) => void;
  canAttemptTheft?: boolean;
}

export const ArtInspectorModal: React.FC<ArtInspectorModalProps> = ({
  isOpen,
  artPiece,
  onClose,
  onAttemptTheft,
  canAttemptTheft = false,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showArtistStudyMode, setShowArtistStudyMode] = useState<boolean>(false);
  const [imgError, setImgError] = useState<boolean>(false);

  if (!isOpen || !artPiece) return null;

  const isStolen = artPiece.status === 'stolen';
  const isDestroyed = artPiece.status === 'destroyed';
  const isRevealed = isStolen || showArtistStudyMode;

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.35, 3.0));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.35, 0.7));
  const handleResetZoom = () => setZoomLevel(1);

  const displayImage = artPiece.fullImageUrl || artPiece.imageUrl;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in">
      <div 
        className="bg-zinc-900 border-2 border-amber-500/50 rounded-2xl max-w-4xl w-full p-4 sm:p-6 text-zinc-100 shadow-2xl relative flex flex-col max-h-[94vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Gold Accent Border */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600" />

        {/* Header Bar */}
        <div className="flex items-start justify-between pb-3 border-b border-zinc-800 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-mono font-bold uppercase tracking-wider">
                Exhibition #{artPiece.number} • {artPiece.type?.toUpperCase() || 'MASTERPIECE'}
              </span>
              <span className="text-xs font-mono text-zinc-400">
                {artPiece.roomName}
              </span>
              {isStolen && (
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500 text-[11px] font-bold font-mono">
                  STOLEN ✓
                </span>
              )}
              {isDestroyed && (
                <span className="px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-500 text-[11px] font-bold font-mono flex items-center gap-1">
                  <Flame className="w-3 h-3 text-red-400" /> DESTROYED ✕
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-serif font-black text-amber-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
              {artPiece.name}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="Close Inspector"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Split View (Image & Dossier) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 py-4 overflow-y-auto flex-1 items-stretch">
          
          {/* Left Column (MD: 7): High-Res Artwork Picture */}
          <div className="md:col-span-7 flex flex-col bg-zinc-950 rounded-xl border border-zinc-800 overflow-hidden relative min-h-[280px] sm:min-h-[380px]">
            {/* Image Toolbar */}
            <div className="absolute top-2 right-2 z-10 flex items-center gap-1 bg-black/70 backdrop-blur-sm rounded-lg p-1 border border-zinc-700/60 shadow-lg">
              <button
                onClick={handleZoomOut}
                className="p-1.5 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={handleResetZoom}
                className="px-2 py-1 text-[11px] font-mono text-zinc-300 hover:text-white hover:bg-zinc-800 rounded transition-colors"
                title="Reset Zoom"
              >
                {Math.round(zoomLevel * 100)}%
              </button>
              <button
                onClick={handleZoomIn}
                className="p-1.5 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={handleResetZoom}
                className="p-1.5 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded transition-colors"
                title="Reset"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Picture Container */}
            <div className="flex-1 overflow-auto flex items-center justify-center p-3 relative select-none">
              {displayImage && !imgError ? (
                <img
                  src={displayImage}
                  alt={artPiece.name}
                  onError={() => setImgError(true)}
                  style={{
                    transform: `scale(${zoomLevel})`,
                    transition: 'transform 0.15s ease-out',
                  }}
                  className="max-h-[360px] sm:max-h-[460px] w-auto object-contain rounded-md shadow-2xl origin-center filter drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)] cursor-zoom-in"
                  onClick={handleZoomIn}
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center text-zinc-500">
                  <div className="w-20 h-24 rounded border-2 border-dashed border-zinc-700 flex items-center justify-center mb-3 bg-zinc-900">
                    <Sparkles className="w-8 h-8 text-amber-500/50" />
                  </div>
                  <p className="text-sm font-serif font-bold text-zinc-300">{artPiece.name}</p>
                  <p className="text-xs text-zinc-500 mt-1">{artPiece.medium}</p>
                  <span className="text-[10px] text-zinc-600 mt-2 font-mono">(Direct museum render active)</span>
                </div>
              )}
            </div>

            {/* Picture Caption / Museum Plaque */}
            <div className="bg-zinc-900/90 border-t border-zinc-800/80 px-3 py-2 flex items-center justify-between text-[11px] font-mono text-zinc-400">
              <span className="truncate">Actual Masterpiece Photograph</span>
              <span className="text-[10px] text-amber-400/80 shrink-0">Click image to zoom</span>
            </div>
          </div>

          {/* Right Column (MD: 5): Masterpiece Dossier & Education */}
          <div className="md:col-span-5 flex flex-col justify-between space-y-3">
            <div className="space-y-3">
              
              {/* Creator / Artist Box (Crucial for Educational Quiz) */}
              <div className={`p-3.5 rounded-xl border transition-all ${
                isRevealed 
                  ? 'bg-amber-950/40 border-amber-500/60 text-amber-200' 
                  : 'bg-zinc-800/60 border-zinc-700 text-zinc-300'
              }`}>
                <div className="text-[11px] font-mono uppercase tracking-wider flex items-center justify-between mb-1">
                  <span className="text-zinc-400 flex items-center gap-1 font-bold">
                    {isRevealed ? <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> : <Lock className="w-3.5 h-3.5 text-amber-500" />}
                    Creator / Artist
                  </span>
                  
                  {/* Study Mode toggle for kids/teachers who want to study without quiz spoilers */}
                  {!isStolen && (
                    <button
                      onClick={() => setShowArtistStudyMode(prev => !prev)}
                      className="text-[10px] text-amber-400 hover:text-amber-300 underline font-mono flex items-center gap-0.5 cursor-pointer"
                    >
                      {showArtistStudyMode ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      {showArtistStudyMode ? 'Hide for Quiz' : 'Study Mode (Peek)'}
                    </button>
                  )}
                </div>

                {isRevealed ? (
                  <div>
                    <div className="text-lg font-serif font-black text-amber-300">
                      {artPiece.artist}
                    </div>
                    {isStolen && (
                      <div className="text-[10px] font-mono text-emerald-400 mt-0.5">
                        ✓ Authenticated & Stolen by Boris
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <div className="text-base font-serif font-bold text-zinc-400 flex items-center gap-2">
                      <span className="tracking-widest">??????</span>
                      <span className="text-xs font-mono font-normal text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                        Classified for Quiz
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-1">
                      To successfully steal this piece, identify this creator during the Educational Heist Quiz!
                    </p>
                  </div>
                )}
              </div>

              {/* Medium & Date Metadata */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800">
                  <span className="text-zinc-500 text-[10px] font-mono block flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-amber-400" /> CREATED
                  </span>
                  <span className="font-bold text-zinc-200 mt-0.5 block">{artPiece.year || 'Historic Era'}</span>
                </div>
                <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800">
                  <span className="text-zinc-500 text-[10px] font-mono block flex items-center gap-1">
                    <Layers className="w-3 h-3 text-amber-400" /> MEDIUM
                  </span>
                  <span className="font-bold text-zinc-200 mt-0.5 block truncate" title={artPiece.medium}>
                    {artPiece.medium || 'Master Work'}
                  </span>
                </div>
              </div>

              {/* Location (Bonus Gadget Quiz Target) */}
              <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 text-xs">
                <span className="text-zinc-400 text-[10px] font-mono block flex items-center gap-1 mb-1 font-bold">
                  <MapPin className="w-3 h-3 text-rose-400" /> ACTUAL HOUSING LOCATION (REAL WORLD)
                </span>
                <span className="font-serif font-bold text-amber-200 block text-sm">
                  {artPiece.location || 'Prestigious World Museum'}
                </span>
                <p className="text-[11px] text-zinc-400 mt-1">
                  Correctly answering this location in the heist bonus round awards Boris an extra gadget!
                </p>
              </div>

              {/* Educational Fun Fact */}
              {artPiece.funFact && (
                <div className="bg-amber-950/20 border border-amber-600/30 p-3 rounded-xl text-xs">
                  <span className="text-amber-400 text-[10px] font-mono font-bold flex items-center gap-1 mb-1">
                    <Sparkles className="w-3 h-3 text-amber-400" /> CURATOR'S SECRET / FUN FACT
                  </span>
                  <p className="text-zinc-300 leading-relaxed text-[11px] italic">
                    "{artPiece.funFact}"
                  </p>
                </div>
              )}

              {/* Wikipedia Extract if available */}
              {artPiece.extract && (
                <div className="bg-zinc-950/80 p-2.5 rounded-lg border border-zinc-800/80 text-[11px] text-zinc-400 leading-relaxed max-h-24 overflow-y-auto">
                  <span className="text-[10px] font-mono text-zinc-500 block mb-0.5">Historical Summary:</span>
                  {artPiece.extract}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-2 border-t border-zinc-800 flex items-center justify-between gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-mono text-xs transition-colors cursor-pointer"
              >
                Close Dossier
              </button>

              {canAttemptTheft && onAttemptTheft && (
                <button
                  onClick={() => {
                    onClose();
                    onAttemptTheft(artPiece.id);
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs font-mono shadow-lg transition-transform active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Initiate Educational Heist Quiz
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
