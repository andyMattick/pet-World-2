import React, { useState } from 'react';
import { Painting } from '../types/game';
import { 
  X, 
  Sparkles, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Flame, 
  Lock, 
  MapPin, 
  Calendar, 
  Layers,
  ZoomIn
} from 'lucide-react';

interface ExhibitionGalleryModalProps {
  isOpen: boolean;
  paintings: Painting[];
  onClose: () => void;
  onSelectPiece: (piece: Painting) => void;
}

export const ExhibitionGalleryModal: React.FC<ExhibitionGalleryModalProps> = ({
  isOpen,
  paintings,
  onClose,
  onSelectPiece,
}) => {
  const [studyModeAll, setStudyModeAll] = useState<boolean>(false);

  if (!isOpen) return null;

  const intactCount = paintings.filter(p => p.status === 'intact' || p.status === 'cutting').length;
  const stolenCount = paintings.filter(p => p.status === 'stolen').length;
  const destroyedCount = paintings.filter(p => p.status === 'destroyed').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in">
      <div 
        className="bg-zinc-900 border-2 border-amber-500/50 rounded-2xl max-w-5xl w-full p-4 sm:p-6 text-zinc-100 shadow-2xl relative flex flex-col max-h-[92vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Gold Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600" />

        {/* Modal Header */}
        <div className="flex items-start justify-between pb-3 border-b border-zinc-800 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-mono font-bold uppercase tracking-wider">
                Permanent Exhibition Dossier
              </span>
              <span className="text-xs font-mono text-zinc-400">
                9 Authentic Masterpieces on Display
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-black text-amber-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
              Museum Art Gallery Exhibition
            </h2>
            <div className="flex items-center gap-3 mt-1 text-xs font-mono">
              <span className="text-amber-300 font-bold">{intactCount} Intact</span>
              <span className="text-emerald-400 font-bold">{stolenCount} Stolen</span>
              <span className="text-red-400 font-bold">{destroyedCount} Ruined</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Teacher / Study Guide Mode Toggle */}
            <button
              onClick={() => setStudyModeAll(prev => !prev)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer ${
                studyModeAll
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                  : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white'
              }`}
              title="Toggle reveal of all artists for study and educational reference"
            >
              {studyModeAll ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{studyModeAll ? 'Hide Artists (Quiz Mode)' : 'Study Mode (Reveal All Artists)'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Gallery Grid of 9 Real Art Pieces */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 py-4 overflow-y-auto flex-1">
          {paintings.map((piece) => {
            const isStolen = piece.status === 'stolen';
            const isDestroyed = piece.status === 'destroyed';
            const isRevealed = isStolen || isDestroyed || studyModeAll;
            const displayImg = piece.imageUrl || piece.fullImageUrl;

            return (
              <div
                key={piece.id}
                onClick={() => {
                  onClose();
                  onSelectPiece(piece);
                }}
                className={`group rounded-xl border p-3 flex flex-col justify-between transition-all duration-200 cursor-pointer hover:border-amber-400 hover:scale-[1.01] hover:shadow-xl ${
                  isStolen
                    ? 'bg-emerald-950/20 border-emerald-600/40'
                    : isDestroyed
                    ? 'bg-red-950/20 border-red-600/40 opacity-70'
                    : piece.status === 'cutting'
                    ? 'bg-amber-950/30 border-amber-500/60 ring-1 ring-amber-400/40'
                    : 'bg-zinc-950/80 border-zinc-800 hover:bg-zinc-900'
                }`}
              >
                {/* Image Container */}
                <div className="relative w-full h-36 bg-zinc-900 rounded-lg overflow-hidden flex items-center justify-center border border-zinc-800 mb-2.5">
                  {displayImg ? (
                    <img
                      src={displayImg}
                      alt={piece.name}
                      className="w-full h-full object-contain p-1 rounded transition-transform duration-200 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-zinc-500">
                      <Sparkles className="w-6 h-6 text-amber-500/40 mb-1" />
                      <span className="text-[10px] font-mono">{piece.type}</span>
                    </div>
                  )}

                  {/* Status Overlay Badge */}
                  <div className="absolute top-1.5 left-1.5">
                    <span className="px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-sm text-[10px] font-mono font-bold text-amber-300 border border-zinc-800">
                      #{piece.number}
                    </span>
                  </div>

                  <div className="absolute top-1.5 right-1.5">
                    {isStolen ? (
                      <span className="px-1.5 py-0.5 rounded bg-emerald-900/90 text-[10px] font-mono font-bold text-emerald-300 border border-emerald-600">
                        STOLEN ✓
                      </span>
                    ) : isDestroyed ? (
                      <span className="px-1.5 py-0.5 rounded bg-red-900/90 text-[10px] font-mono font-bold text-red-300 border border-red-600">
                        RUINED ✕
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded bg-zinc-800/80 text-[10px] font-mono text-zinc-300 border border-zinc-700">
                        {piece.roomName.split(' ')[0]}
                      </span>
                    )}
                  </div>

                  {/* Inspect hint on hover */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-xs font-mono text-amber-200 gap-1 backdrop-blur-[1px]">
                    <ZoomIn className="w-4 h-4" /> Click to Inspect
                  </div>
                </div>

                {/* Piece Meta */}
                <div>
                  <h3 className="font-serif font-bold text-sm text-zinc-100 group-hover:text-amber-200 truncate" title={piece.name}>
                    {piece.name}
                  </h3>

                  {/* Artist / Creator */}
                  <div className="mt-1 text-xs">
                    {isRevealed ? (
                      <div className="text-amber-300 font-medium truncate flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-amber-400 shrink-0" />
                        <span className="truncate">{piece.artist}</span>
                      </div>
                    ) : (
                      <div className="text-zinc-500 font-mono text-[11px] flex items-center gap-1">
                        <Lock className="w-3 h-3 text-amber-500/80 shrink-0" />
                        <span>🔒 Artist Classified (Quiz)</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-1.5 text-[10px] font-mono text-zinc-400 flex items-center justify-between border-t border-zinc-800/80 pt-1.5">
                    <span className="truncate">{piece.medium || 'Artwork'}</span>
                    <span className="shrink-0 text-zinc-500">{piece.year}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400 font-mono">
          <span>Click any art piece to view its high-resolution photograph and museum dossier.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 cursor-pointer"
          >
            Close Gallery
          </button>
        </div>
      </div>
    </div>
  );
};
