import React, { useEffect } from 'react';
import { X, Delete } from 'lucide-react';

interface Props {
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
  position: { x: number; y: number };
  maxLength?: number;
}

export default function NumberKeypad({ value, onChange, onClose, position, maxLength = 3 }: Props) {
  // Prevent scrolling when keypad is open
  useEffect(() => {
    const preventDefault = (e: Event) => e.preventDefault();
    document.addEventListener('wheel', preventDefault, { passive: false });
    document.addEventListener('touchmove', preventDefault, { passive: false });
    
    return () => {
      document.removeEventListener('wheel', preventDefault);
      document.removeEventListener('touchmove', preventDefault);
    };
  }, []);

  const handleNumberClick = (num: string) => {
    if (maxLength && value.length >= maxLength) return;
    onChange(value + num);
  };

  const handleBackspace = () => {
    onChange(value.slice(0, -1));
  };

  const handleClear = () => {
    onChange('');
  };

  const handleEnter = () => {
    onClose();
  };

  return (
    <div 
      className="fixed z-50 bg-[#231F20] border-2 border-[#157A6E] rounded-lg shadow-2xl p-4"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -100%)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="bg-[#157A6E] text-[#F3DFA2] px-3 py-1 rounded text-sm font-mono min-w-[60px] text-center">
          {value || '0'}
        </div>
        <button
          onClick={onClose}
          className="text-[#BB4430] hover:text-[#A03A28] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Number Grid */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            key={num}
            onClick={() => handleNumberClick(num.toString())}
            className="w-10 h-10 bg-[#2A2627] border border-[#157A6E] text-[#F3DFA2] rounded hover:bg-[#157A6E] hover:text-[#F3DFA2] transition-colors font-semibold"
          >
            {num}
          </button>
        ))}
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={handleBackspace}
          className="w-10 h-10 bg-[#BB4430] border border-[#BB4430] text-[#F3DFA2] rounded hover:bg-[#A03A28] transition-colors flex items-center justify-center"
        >
          <Delete className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleNumberClick('0')}
          className="w-10 h-10 bg-[#2A2627] border border-[#157A6E] text-[#F3DFA2] rounded hover:bg-[#157A6E] hover:text-[#F3DFA2] transition-colors font-semibold"
        >
          0
        </button>
        <button
          onClick={handleEnter}
          className="w-10 h-10 bg-[#157A6E] border border-[#157A6E] text-[#F3DFA2] rounded hover:bg-[#1A6B60] transition-colors text-xs font-semibold"
        >
          Enter
        </button>
      </div>
    </div>
  );
}