import React, { useState } from 'react';
import { RotateCw, MoveHorizontal } from 'lucide-react';

const Viewer360 = ({ images = [] }) => {
  const defaultImages = [
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80',
  ];

  const imageList = images.length > 0 ? images : defaultImages;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startX;
    if (Math.abs(deltaX) > 20) {
      if (deltaX > 0) {
        setCurrentIndex((prev) => (prev + 1) % imageList.length);
      } else {
        setCurrentIndex((prev) => (prev - 1 + imageList.length) % imageList.length);
      }
      setStartX(e.clientX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="relative bg-black rounded-2xl overflow-hidden border border-woodly-gold/40 p-4 select-none">
      <div className="absolute top-4 left-4 bg-woodly-gold text-black text-xs font-bold px-3 py-1 rounded-full flex items-center space-x-1.5 z-10 shadow-lg">
        <RotateCw className="w-3.5 h-3.5 animate-spin" />
        <span>360° Interactive Rotator</span>
      </div>

      <div
        className="w-full aspect-[4/3] flex items-center justify-center cursor-grab active:cursor-grabbing relative"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <img
          src={imageList[currentIndex]}
          alt={`360 Angle ${currentIndex + 1}`}
          className="max-h-full max-w-full object-contain pointer-events-none transition-all duration-200"
        />

        <div className="absolute bottom-4 inset-x-0 flex items-center justify-center pointer-events-none">
          <div className="bg-black/70 backdrop-blur-md px-4 py-1.5 rounded-full text-xs text-woodly-gold flex items-center space-x-2 border border-woodly-gold/30">
            <MoveHorizontal className="w-4 h-4 animate-bounce" />
            <span>Drag left or right to inspect all 360° angles</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Viewer360;
