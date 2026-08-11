import React, { useEffect, useRef } from 'react';

export function BackgroundDots() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const gridSpacing = 16;
    const speed = 0.0015;

    const getDotJitter = (x, y) => {
      const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
      return n - Math.floor(n);
    };

    let startTime = performance.now();

    const render = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      ctx.clearRect(0, 0, width, height);

      const cols = Math.ceil(width / gridSpacing);
      const rows = Math.ceil(height / gridSpacing);

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * gridSpacing;
          const y = j * gridSpacing;

          const jitter = getDotJitter(i, j);
          const waveVal = Math.sin(elapsedTime * speed - (x * 0.008 + y * 0.005 + jitter * 0.5));
          const opacity = Math.max(0.04, (waveVal + 1) / 2 * 0.22 + jitter * 0.03);

          ctx.fillStyle = `rgba(255, 255, 255, ${opacity.toFixed(3)})`;
          ctx.fillRect(x, y, 2, 2);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}

export default BackgroundDots;
