import React, { useState, useEffect } from 'react';
import { Sparkles, Maximize2, Copy, Check, Download, RefreshCw, X, Image as ImageIcon } from 'lucide-react';
import confetti from 'canvas-confetti';

const GENERATION_STEPS = [
  'Initializing latent noise matrix...',
  'Processing text embeddings...',
  'Synthesizing vector pixels...',
  'Finalizing 1024x1024 output...',
];

export function PreviewPanel({ currentResult, isGenerating, onRegenerate, prompt }) {
  const [showLightbox, setShowLightbox] = useState(false);
  const [copied, setCopied] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    if (!isGenerating) {
      setCurrentStepIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev + 1) % GENERATION_STEPS.length);
    }, 1200);
    return () => clearInterval(interval);
  }, [isGenerating]);

  const handleCopyPrompt = () => {
    if (!currentResult?.prompt && !prompt) return;
    navigator.clipboard.writeText(currentResult?.prompt || prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!currentResult?.imageUrl) return;
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ffffff', '#8b8b8b', '#10b981'],
      });
    } catch {}
    window.open(currentResult.imageUrl, '_blank');
  };

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 bg-[#050505] relative overflow-hidden min-h-[500px]">
      
      {/* 1. EMPTY STATE */}
      {!isGenerating && !currentResult && (
        <div className="flex flex-col items-center justify-center text-center p-8 max-w-sm space-y-3 border border-[#262626] rounded-xl bg-[#101010]/60 backdrop-blur-sm animate-fade-in">
          <div className="p-3 bg-[#050505] border border-[#262626] rounded-full text-[#8b8b8b]">
            <ImageIcon className="w-8 h-8" />
          </div>
          <h2 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Ready to Generate</h2>
          <p className="text-[11px] font-mono text-[#8b8b8b]">
            Describe your visuals in the prompt window and click Generate to synthesize a 1024×1024 image.
          </p>
        </div>
      )}

      {/* 2. GENERATING STATE */}
      {isGenerating && (
        <div className="w-full max-w-sm aspect-square bg-[#101010] border border-[#262626] rounded-xl flex flex-col items-center justify-center p-6 space-y-5 relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 animate-shimmer pointer-events-none" />
          <div className="relative">
            <div className="w-12 h-12 border-2 border-[#262626] border-t-white rounded-full animate-spin flex items-center justify-center" />
            <Sparkles className="w-4 h-4 text-white absolute inset-0 m-auto" />
          </div>
          <div className="space-y-1 text-center z-10">
            <div className="text-[10px] font-mono font-bold text-white tracking-widest uppercase">Synthesizing...</div>
            <div className="text-[11px] font-mono text-[#8b8b8b] h-4">{GENERATION_STEPS[currentStepIndex]}</div>
          </div>
        </div>
      )}

      {/* 3. RESULT STATE */}
      {!isGenerating && currentResult && (
        <div className="w-full max-w-md flex flex-col items-center space-y-4 animate-fade-in">
          
          <div className="relative w-full aspect-square bg-[#101010] border border-[#262626] hover:border-[#3d3d3d] rounded-xl overflow-hidden shadow-2xl group transition-all">
            <img
              src={currentResult.imageUrl}
              alt=""
              onClick={() => setShowLightbox(true)}
              className="w-full h-full object-cover cursor-zoom-in"
            />
            <button
              onClick={() => setShowLightbox(true)}
              className="absolute top-3 right-3 p-1.5 bg-black/70 hover:bg-black text-white rounded border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="w-full bg-[#101010] border border-[#262626] rounded-lg p-2.5 flex items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleCopyPrompt}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-mono bg-[#050505] border border-[#262626] hover:border-white text-white rounded cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-[#8b8b8b]" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={onRegenerate}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-mono bg-[#050505] border border-[#262626] hover:border-white text-white rounded cursor-pointer"
              >
                <RefreshCw className="w-3 h-3 text-[#8b8b8b]" />
                <span>Re-run</span>
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-mono bg-white text-black hover:bg-neutral-200 rounded font-bold cursor-pointer"
              >
                <Download className="w-3 h-3" />
                <span>Download</span>
              </button>
            </div>
          </div>

          <div className="w-full bg-[#101010] border border-[#262626] rounded-lg p-3 text-xs font-mono text-white flex items-start gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-[#ddd] leading-relaxed">{currentResult.prompt}</p>
          </div>
        </div>
      )}

      {/* LIGHTBOX MODAL */}
      {showLightbox && currentResult && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-fade-in"
          onClick={() => setShowLightbox(false)}
        >
          <div 
            className="relative max-w-2xl max-h-[85vh] bg-[#101010] border border-[#262626] rounded-xl overflow-hidden p-2 flex flex-col items-center space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowLightbox(false)}
              className="absolute top-4 right-4 z-10 p-1.5 bg-black/80 hover:bg-black text-white rounded-full border border-white/20"
            >
              <X className="w-4 h-4" />
            </button>
            <img src={currentResult.imageUrl} alt="" className="max-h-[65vh] w-auto object-contain rounded-lg" />
            <div className="w-full p-3 bg-[#050505] border border-[#262626] rounded-lg flex items-center justify-between gap-4">
              <p className="text-xs font-mono text-white truncate">{currentResult.prompt}</p>
              <button
                onClick={handleDownload}
                className="px-3 py-1 text-xs font-mono bg-white text-black hover:bg-neutral-200 rounded shrink-0 font-bold"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default PreviewPanel;
