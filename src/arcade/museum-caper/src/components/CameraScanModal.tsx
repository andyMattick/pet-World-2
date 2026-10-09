import React from 'react';
import { SecurityCamera } from '../types/game';
import { Camera, X, Check, AlertTriangle, ZapOff } from 'lucide-react';

interface CameraScanModalProps {
  isOpen: boolean;
  cameras: SecurityCamera[];
  powerOut: boolean;
  onSelectCamera: (camNumber: number) => void;
  onClose: () => void;
}

export const CameraScanModal: React.FC<CameraScanModalProps> = ({
  isOpen,
  cameras,
  powerOut,
  onSelectCamera,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-5 shadow-2xl text-slate-200">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2 text-cyan-400">
            <Camera className="w-5 h-5" />
            <h3 className="font-bold text-base text-white">Security Camera Electronic Scan</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-400 mb-4">
          Select one of the 6 museum security cameras to interrogate its live surveillance feed.
        </p>

        <div className="grid grid-cols-2 gap-2.5 mb-4">
          {cameras.map((c) => (
            <button
              key={c.number}
              onClick={() => {
                onSelectCamera(c.number);
                onClose();
              }}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                c.isCut
                  ? 'bg-red-950/40 border-red-500/50 text-red-300 hover:bg-red-950/60'
                  : powerOut
                  ? 'bg-amber-950/40 border-amber-500/50 text-amber-300 hover:bg-amber-950/60'
                  : 'bg-slate-800/80 hover:bg-cyan-950/50 border-slate-700 hover:border-cyan-500 text-slate-200'
              }`}
            >
              <Camera className="w-5 h-5 mb-1 text-cyan-400" />
              <div className="font-bold font-mono text-sm">Camera #{c.number}</div>
              <div className="text-[10px] font-mono mt-0.5">
                {c.isCut ? (
                  <span className="text-red-400 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Wires Cut
                  </span>
                ) : powerOut ? (
                  <span className="text-amber-400 flex items-center gap-1">
                    <ZapOff className="w-3 h-3" /> Power Down
                  </span>
                ) : (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Feed Online
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition-colors cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
