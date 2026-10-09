import React, { useState, useMemo } from 'react';
import { Painting, ArtMediumType } from '../types/game';
import { 
  Sparkles, 
  X, 
  Check, 
  AlertTriangle, 
  ShieldAlert, 
  Compass, 
  MapPin, 
  Award, 
  HelpCircle, 
  Flame, 
  Zap, 
  Package, 
  Lock, 
  Footprints, 
  Smile, 
  BookOpen,
  ZoomIn,
  Eye
} from 'lucide-react';
import { sounds } from '../utils/audio';

interface ArtQuizModalProps {
  isOpen: boolean;
  artPiece: Painting | null;
  stolenCount: number; // number of pieces currently in bag (0 = 1st piece)
  onSuccess: (artPiece: Painting, awardedGadget: 'dart' | 'smoke' | 'adrenaline' | 'lockpick' | null) => void;
  onDestroyed: (artPiece: Painting) => void;
  onCancel: () => void;
}

export const ArtQuizModal: React.FC<ArtQuizModalProps> = ({
  isOpen,
  artPiece,
  stolenCount,
  onSuccess,
  onDestroyed,
  onCancel,
}) => {
  if (!isOpen || !artPiece) return null;

  // Calculate number of options: 2 for 1st piece (stolenCount == 0), 3 for 2nd piece, 4 for 3rd, etc.
  const targetOptionsCount = Math.min(6, Math.max(2, stolenCount === 0 ? 2 : 2 + stolenCount));

  // Step state
  const [stage, setStage] = useState<'creator' | 'location' | 'bonus_picker' | 'destroyed' | 'completed'>('creator');
  const [eliminatedCreators, setEliminatedCreators] = useState<string[]>([]);
  const [selectedCreator, setSelectedCreator] = useState<string | null>(null);
  const [creatorAnswerStatus, setCreatorAnswerStatus] = useState<'correct' | 'wrong' | null>(null);

  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [locationAnswerStatus, setLocationAnswerStatus] = useState<'correct' | 'wrong' | null>(null);

  const [chosenGadget, setChosenGadget] = useState<'dart' | 'smoke' | 'adrenaline' | 'lockpick' | null>(null);
  const [showFullImageModal, setShowFullImageModal] = useState<boolean>(false);
  const [imgError, setImgError] = useState<boolean>(false);

  const displayImage = artPiece.fullImageUrl || artPiece.imageUrl;

  // Memoize randomized options list
  const creatorOptions = useMemo(() => {
    if (!artPiece) return [];
    const correct = artPiece.artist;
    const pool = artPiece.wrongCreators ? [...artPiece.wrongCreators] : ['Unknown Master', 'Ancient Sculptor', 'Royal Artisan'];
    // Shuffle pool
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    const neededDistractors = targetOptionsCount - 1;
    const distractors = pool.slice(0, neededDistractors);
    const combined = [correct, ...distractors];
    // Shuffle combined
    for (let i = combined.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [combined[i], combined[j]] = [combined[j], combined[i]];
    }
    return combined;
  }, [artPiece?.id, targetOptionsCount]);

  const locationOptions = useMemo(() => {
    if (!artPiece || !artPiece.location) return [];
    const correct = artPiece.location;
    const pool = artPiece.wrongLocations ? [...artPiece.wrongLocations] : ['Louvre Museum, Paris', 'British Museum, London', 'MoMA, New York'];
    // Shuffle pool
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    const neededDistractors = targetOptionsCount - 1;
    const distractors = pool.slice(0, neededDistractors);
    const combined = [correct, ...distractors];
    for (let i = combined.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [combined[i], combined[j]] = [combined[j], combined[i]];
    }
    return combined;
  }, [artPiece?.id, targetOptionsCount]);

  // Handle creator choice click
  const handleSelectCreator = (option: string) => {
    if (creatorAnswerStatus !== null || eliminatedCreators.includes(option)) return;

    setSelectedCreator(option);
    const isCorrect = option === artPiece.artist;

    if (isCorrect) {
      setCreatorAnswerStatus('correct');
      sounds.playVictory();
      setTimeout(() => {
        // Transition to location bonus question
        setStage('location');
      }, 1000);
    } else {
      // Incorrect answer
      sounds.playAlarm();
      const remainingOptions = creatorOptions.filter(o => !eliminatedCreators.includes(o));
      
      // Rule: "if they are get it down to 2 pieces and they get it wrong, the piece is destroyed and they have to go to another piece"
      if (remainingOptions.length <= 2) {
        // Down to 2 options and got it wrong -> PIECE DESTROYED!
        setCreatorAnswerStatus('wrong');
        setStage('destroyed');
        onDestroyed(artPiece);
      } else {
        // More than 2 options: eliminate this wrong option so they can try again down to 2
        setEliminatedCreators(prev => [...prev, option]);
        setCreatorAnswerStatus('wrong');
        setTimeout(() => {
          setCreatorAnswerStatus(null);
          setSelectedCreator(null);
        }, 800);
      }
    }
  };

  // Handle location choice click (Bonus Gadget)
  const handleSelectLocation = (option: string) => {
    if (locationAnswerStatus !== null) return;

    setSelectedLocation(option);
    const isCorrect = option === artPiece.location;

    if (isCorrect) {
      setLocationAnswerStatus('correct');
      sounds.playVictory();
      setTimeout(() => {
        setStage('bonus_picker');
      }, 1000);
    } else {
      setLocationAnswerStatus('wrong');
      sounds.playCaptured();
      setTimeout(() => {
        // No bonus gadget, but theft still succeeded
        setStage('completed');
      }, 1400);
    }
  };

  const handleClaimGadget = (gadget: 'dart' | 'smoke' | 'adrenaline' | 'lockpick') => {
    setChosenGadget(gadget);
    sounds.playWireCut();
    setTimeout(() => {
      onSuccess(artPiece, gadget);
    }, 400);
  };

  const handleFinishWithoutBonus = () => {
    onSuccess(artPiece, null);
  };

  const remainingActiveCount = creatorOptions.filter(o => !eliminatedCreators.includes(o)).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="bg-zinc-900 border-2 border-amber-500/50 rounded-2xl max-w-xl w-full p-6 text-zinc-100 shadow-2xl relative overflow-hidden flex flex-col max-h-[92vh]">
        {/* Glowing atmospheric top bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600" />

        {/* Top Header */}
        <div className="flex items-start justify-between pb-4 border-b border-zinc-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold uppercase tracking-wider">
                Piece #{artPiece.number} • {artPiece.type || 'Art Piece'}
              </span>
              <span className="text-xs font-mono text-zinc-400">
                {artPiece.roomName}
              </span>
            </div>
            <h2 className="text-2xl font-serif font-black text-amber-100 tracking-wide flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
              {artPiece.name}
            </h2>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">
              {artPiece.medium} • {artPiece.year}
            </p>
          </div>

          <button
            onClick={onCancel}
            disabled={stage === 'destroyed'}
            className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="Cancel Heist Attempt"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Masterpiece Photograph Display (Prominent Visual) */}
        <div className="relative bg-zinc-950 rounded-xl border border-zinc-800 p-2 overflow-hidden flex items-center justify-center my-3 min-h-[170px] max-h-[220px] shadow-inner shrink-0 group">
          {displayImage && !imgError ? (
            <img
              src={displayImage}
              alt={artPiece.name}
              onError={() => setImgError(true)}
              onClick={() => setShowFullImageModal(true)}
              className="max-h-[200px] w-auto object-contain rounded-lg shadow-xl cursor-zoom-in transition-transform duration-200 group-hover:scale-[1.02]"
              title="Click to view full picture"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-4 text-center text-zinc-500">
              <Sparkles className="w-8 h-8 text-amber-500/50 mb-1" />
              <span className="text-xs font-serif font-bold text-zinc-300">{artPiece.name}</span>
              <span className="text-[10px] text-zinc-500">{artPiece.medium}</span>
            </div>
          )}

          {/* Zoom button on bottom-right */}
          {displayImage && !imgError && (
            <button
              onClick={() => setShowFullImageModal(true)}
              className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/80 hover:bg-black text-amber-300 text-[10px] font-mono flex items-center gap-1 border border-zinc-700/70 backdrop-blur-sm cursor-pointer shadow-md"
            >
              <ZoomIn className="w-3 h-3" />
              Full Picture
            </button>
          )}

          {/* Type / Location pill bottom-left */}
          <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[10px] font-mono text-zinc-400 border border-zinc-800">
            {artPiece.medium} • {artPiece.year}
          </div>
        </div>

        {/* STAGE 1: CREATOR QUESTION */}
        {stage === 'creator' && (
          <div className="py-4 space-y-4 overflow-y-auto">
            <div className="bg-amber-950/30 border border-amber-600/30 rounded-xl p-3.5">
              <div className="flex items-center justify-between text-xs font-mono text-amber-300 mb-1">
                <span className="font-bold flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-amber-400" />
                  Primary Authentication Test
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-900/50 border border-amber-700/50">
                  {targetOptionsCount} Choices (Level {stolenCount + 1})
                </span>
              </div>
              <p className="text-sm font-medium text-zinc-200">
                To bypass the laser alarms and slice the casing, name the <span className="text-amber-300 font-bold">creator or artist</span> of this masterpiece:
              </p>
              {remainingActiveCount <= 2 && (
                <div className="mt-2 text-xs font-mono text-red-400 flex items-center gap-1.5 font-bold">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  CRITICAL DANGER: 2 options remaining! An incorrect guess will permanently DESTROY this artwork!
                </div>
              )}
            </div>

            {/* Multiple Choice Options */}
            <div className="space-y-2.5">
              {creatorOptions.map((option, idx) => {
                const isEliminated = eliminatedCreators.includes(option);
                const isSelected = selectedCreator === option;
                const isCorrect = option === artPiece.artist;

                let btnStyles = 'bg-zinc-800/80 hover:bg-zinc-750 border-zinc-700 text-zinc-200';
                if (isEliminated) {
                  btnStyles = 'bg-zinc-950/60 border-zinc-800 text-zinc-600 line-through opacity-50 cursor-not-allowed';
                } else if (isSelected) {
                  if (creatorAnswerStatus === 'correct') {
                    btnStyles = 'bg-emerald-600/30 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/50';
                  } else if (creatorAnswerStatus === 'wrong') {
                    btnStyles = 'bg-red-600/30 border-red-500 text-red-200 ring-2 ring-red-500/50';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isEliminated || creatorAnswerStatus !== null}
                    onClick={() => handleSelectCreator(option)}
                    className={`w-full p-3.5 rounded-xl border text-left font-sans transition-all duration-150 flex items-center justify-between group ${btnStyles} ${
                      !isEliminated && creatorAnswerStatus === null ? 'cursor-pointer hover:border-amber-400 hover:scale-[1.01]' : ''
                    }`}
                  >
                    <span className="font-semibold text-sm flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-zinc-700/60 text-zinc-300 flex items-center justify-center font-mono text-xs border border-zinc-600 group-hover:border-amber-400">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      {option}
                    </span>

                    {isSelected && creatorAnswerStatus === 'correct' && (
                      <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                    )}
                    {isSelected && creatorAnswerStatus === 'wrong' && (
                      <X className="w-5 h-5 text-red-400 shrink-0" />
                    )}
                    {isEliminated && (
                      <span className="text-xs font-mono text-red-400 uppercase tracking-wider">Eliminated</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Educational Fact Preview */}
            {artPiece.funFact && (
              <div className="bg-zinc-950/60 border border-zinc-800 rounded-lg p-3 text-xs text-zinc-400 flex items-start gap-2">
                <BookOpen className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-zinc-300">Curator Clue:</strong> {artPiece.funFact}
                </span>
              </div>
            )}
          </div>
        )}

        {/* STAGE: DESTROYED (Answered wrong with 2 choices left) */}
        {stage === 'destroyed' && (
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-red-950/80 border-2 border-red-500 flex items-center justify-center mx-auto text-red-400 animate-pulse">
              <Flame className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-red-400 font-serif">
                PRESERVATION LASER TRIGGERED!
              </h3>
              <p className="text-sm text-zinc-300 mt-2 max-w-md mx-auto">
                Incorrect answer! The protective vault security triggered high-voltage incinerators. <strong className="text-red-300">{artPiece.name}</strong> was <span className="text-red-400 font-bold uppercase underline">permanently destroyed</span>!
              </p>
              <p className="text-xs font-mono text-zinc-400 mt-2">
                Boris must abandon this ruined display and infiltrate another gallery!
              </p>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-left max-w-md mx-auto text-xs text-zinc-400">
              <span className="font-bold text-zinc-200">The true creator was:</span> {artPiece.artist}
            </div>

            <button
              onClick={() => onCancel()}
              className="py-2.5 px-6 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow-lg transition-transform active:scale-95 cursor-pointer text-sm"
            >
              Flee to Another Gallery
            </button>
          </div>
        )}

        {/* STAGE 2: LOCATION BONUS QUESTION */}
        {stage === 'location' && (
          <div className="py-4 space-y-4 overflow-y-auto">
            <div className="bg-emerald-950/30 border border-emerald-600/30 rounded-xl p-3.5">
              <div className="flex items-center justify-between text-xs font-mono text-emerald-400 mb-1">
                <span className="font-bold flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  Creator Verified: {artPiece.artist}!
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-900/50 border border-emerald-700/50 font-bold">
                  Bonus Gadget Round
                </span>
              </div>
              <p className="text-sm font-medium text-zinc-200 mt-1">
                Artwork secured! For a <span className="text-yellow-300 font-bold">Bonus Gadget</span>, answer: where is <strong className="text-amber-200">{artPiece.name}</strong> housed in real life?
              </p>
            </div>

            <div className="space-y-2.5">
              {locationOptions.map((option, idx) => {
                const isSelected = selectedLocation === option;
                let btnStyles = 'bg-zinc-800/80 hover:bg-zinc-750 border-zinc-700 text-zinc-200';
                if (isSelected) {
                  if (locationAnswerStatus === 'correct') {
                    btnStyles = 'bg-emerald-600/30 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/50';
                  } else if (locationAnswerStatus === 'wrong') {
                    btnStyles = 'bg-red-600/30 border-red-500 text-red-200 ring-2 ring-red-500/50';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={locationAnswerStatus !== null}
                    onClick={() => handleSelectLocation(option)}
                    className={`w-full p-3.5 rounded-xl border text-left font-sans transition-all duration-150 flex items-center justify-between group ${btnStyles} ${
                      locationAnswerStatus === null ? 'cursor-pointer hover:border-amber-400 hover:scale-[1.01]' : ''
                    }`}
                  >
                    <span className="font-semibold text-sm flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                      {option}
                    </span>
                    {isSelected && locationAnswerStatus === 'correct' && (
                      <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                    )}
                    {isSelected && locationAnswerStatus === 'wrong' && (
                      <X className="w-5 h-5 text-red-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Skip Bonus Option */}
            <div className="text-center pt-2">
              <button
                onClick={handleFinishWithoutBonus}
                className="text-xs font-mono text-zinc-400 hover:text-zinc-200 underline cursor-pointer"
              >
                Skip Bonus Challenge & Bag Artwork Now
              </button>
            </div>
          </div>
        )}

        {/* STAGE 3: BONUS GADGET PICKER */}
        {stage === 'bonus_picker' && (
          <div className="py-4 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center mx-auto">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-amber-200 font-serif">
                Correct! Housed at {artPiece.location}
              </h3>
              <p className="text-xs font-mono text-zinc-400 mt-1">
                Select your free high-tech Bonus Gadget reward:
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-left">
              <button
                onClick={() => handleClaimGadget('dart')}
                className="p-3.5 bg-zinc-800 hover:bg-zinc-750 border border-zinc-700 hover:border-blue-400 rounded-xl transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2 font-bold text-sm text-blue-300">
                  <span className="text-lg">💤</span> +1 Sleep Dart
                </div>
                <p className="text-xs text-zinc-400 mt-1">
                  Tranquilize a patrolling detective into a 2-turn snooze!
                </p>
              </button>

              <button
                onClick={() => handleClaimGadget('smoke')}
                className="p-3.5 bg-zinc-800 hover:bg-zinc-750 border border-zinc-700 hover:border-zinc-400 rounded-xl transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2 font-bold text-sm text-zinc-300">
                  <span className="text-lg">💨</span> +1 Smoke Bomb
                </div>
                <p className="text-xs text-zinc-400 mt-1">
                  Deploy dense fog to block cameras & flashlight rays for 3 turns.
                </p>
              </button>

              <button
                onClick={() => handleClaimGadget('adrenaline')}
                className="p-3.5 bg-zinc-800 hover:bg-zinc-750 border border-zinc-700 hover:border-amber-400 rounded-xl transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2 font-bold text-sm text-amber-300">
                  <span className="text-lg">🏃</span> Adrenaline Surge
                </div>
                <p className="text-xs text-zinc-400 mt-1">
                  Gain +2 bonus movement steps to sprint past guards.
                </p>
              </button>

              <button
                onClick={() => handleClaimGadget('lockpick')}
                className="p-3.5 bg-zinc-800 hover:bg-zinc-750 border border-zinc-700 hover:border-emerald-400 rounded-xl transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2 font-bold text-sm text-emerald-300">
                  <span className="text-lg">🔓</span> Skeleton Lockpick
                </div>
                <p className="text-xs text-zinc-400 mt-1">
                  Crack open locked perimeter doors & windows instantly.
                </p>
              </button>
            </div>
          </div>
        )}

        {/* STAGE 4: COMPLETED (Without bonus) */}
        {stage === 'completed' && (
          <div className="py-4 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center justify-center mx-auto">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-emerald-200 font-serif">
                Piece Secured in Canvas Bag!
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                True Location: <strong className="text-zinc-300">{artPiece.location}</strong>
              </p>
            </div>

            {artPiece.funFact && (
              <div className="bg-zinc-950/70 border border-zinc-800 rounded-xl p-3 text-left text-xs text-zinc-300">
                <strong className="text-amber-300">Art History Fact:</strong> {artPiece.funFact}
              </div>
            )}

            <button
              onClick={handleFinishWithoutBonus}
              className="py-2.5 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg transition-transform active:scale-95 cursor-pointer text-sm"
            >
              Stash in Bag & Continue Heist
            </button>
          </div>
        )}
      </div>

      {/* High-Resolution Picture Full View Overlay */}
      {showFullImageModal && displayImage && (
        <div 
          className="fixed inset-0 z-[60] bg-black/95 flex flex-col items-center justify-center p-4 backdrop-blur-lg animate-fade-in"
          onClick={() => setShowFullImageModal(false)}
        >
          <div className="absolute top-4 right-4 flex items-center gap-3">
            <span className="text-xs font-mono text-zinc-400">Press ESC or click anywhere to close</span>
            <button
              onClick={() => setShowFullImageModal(false)}
              className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="max-w-4xl max-h-[82vh] flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={artPiece.fullImageUrl || displayImage}
              alt={artPiece.name}
              className="max-h-[76vh] max-w-full object-contain rounded-lg shadow-2xl border border-zinc-700"
            />
            <div className="mt-3 text-center">
              <h4 className="text-lg font-serif font-bold text-amber-200">{artPiece.name}</h4>
              <p className="text-xs text-zinc-400 font-mono">{artPiece.medium} • {artPiece.year}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
