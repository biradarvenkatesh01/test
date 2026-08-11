import React from 'react';

export function ImageFuryLogo({ size = 'md' }) {
  const pixelClasses = {
    sm: 'text-xs',
    md: 'text-sm sm:text-base',
    lg: 'text-lg sm:text-xl'
  };

  return (
    <div className="flex items-center gap-2">
      <svg
        className={`shrink-0 ${size === 'sm' ? 'w-5 h-5' : size === 'md' ? 'w-6 h-6' : 'w-8 h-8'}`}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="2" y="2" width="20" height="20" rx="2" fill="black" stroke="white" strokeWidth="2"/>
        <rect x="6" y="6" width="4" height="4" fill="white"/>
        <rect x="14" y="6" width="4" height="4" fill="white"/>
        <rect x="6" y="14" width="12" height="4" fill="white"/>
        <rect x="14" y="10" width="4" height="2" fill="white"/>
      </svg>
      <span className={`font-pixel font-bold uppercase tracking-wider text-white ${pixelClasses[size]}`}>
        IMAGEFURY
      </span>
    </div>
  );
}

export default ImageFuryLogo;
