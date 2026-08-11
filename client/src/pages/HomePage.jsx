import React, { useState } from 'react';
import { LayoutGrid, ArrowRight, Activity, Terminal, Shield, Zap, Sparkles, Copy, Check } from 'lucide-react';

const SAMPLE_ARTWORKS = [
  {
    id: 'sample-1',
    prompt: 'Obsidian crystal monolith floating in dark mist, pixel art style',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    category: 'PIXEL ART',
  },
  {
    id: 'sample-2',
    prompt: 'Cyberpunk samurai warrior in glowing emerald neon rain',
    imageUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=600&q=80',
    category: 'CYBERPUNK',
  },
  {
    id: 'sample-3',
    prompt: 'Minimalist monochrome geometry with golden ratio vector lines',
    imageUrl: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=600&q=80',
    category: 'MINIMALIST',
  },
  {
    id: 'sample-4',
    prompt: 'Bioluminescent cosmic nebula inside a glass hourglass',
    imageUrl: 'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?auto=format&fit=crop&w=600&q=80',
    category: 'ABSTRACT',
  },
];

export function HomePage({ setCurrentPage, isSignedIn, onRequestAuth, setPrompt }) {
  const [copiedId, setCopiedId] = useState(null);

  const handleGetStarted = (customPrompt = null) => {
    if (customPrompt && typeof customPrompt === 'string') {
      setPrompt(customPrompt);
    }
    if (isSignedIn) {
      setCurrentPage('dashboard');
    } else {
      onRequestAuth('dashboard');
    }
  };

  const handleCopyPrompt = (e, id, promptText) => {
    e.stopPropagation();
    navigator.clipboard.writeText(promptText);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 flex flex-col space-y-12 sm:space-y-16">
      
      {/* 1. DECORATIVE RETRO CONSOLE STATUS BAR */}
      <div className="w-full bg-[#101010] border border-[#262626] rounded-lg p-3 flex flex-wrap items-center justify-between gap-4 text-[10px] font-mono text-[#8b8b8b] shadow-lg">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-white font-bold">CORE_STATUS:</span>
          <span className="text-emerald-400">ONLINE</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-[#555]" />
            <span>LATENCY: <strong className="text-white">0.8s</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-[#555]" />
            <span>VERSION: <strong className="text-white">v1.4.2</strong></span>
          </div>
          <span className="hidden sm:inline text-[#333]">|</span>
          <span className="hidden sm:inline">TENSOR_PROCESSING: <strong className="text-emerald-400">OK</strong></span>
        </div>
      </div>

      {/* 2. HERO SECTION */}
      <div className="text-center space-y-5 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#101010] border border-[#262626] rounded-full text-[10px] font-mono text-white tracking-wider uppercase">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>NEURAL SYNTHESIS ENGINE</span>
        </div>
        <h1 className="text-4xl sm:text-7xl font-pixel text-white uppercase leading-none tracking-tight">
          IMAGEFURY
        </h1>
        <p className="text-xs sm:text-sm font-mono text-[#8b8b8b] leading-relaxed max-w-xl mx-auto">
          Sleek prompt-driven 1024×1024 AI image generator. Real-time latent noise transformation, local cache history, and personal gallery vault.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <button
            onClick={() => handleGetStarted()}
            className="w-full sm:w-auto px-6 py-3 bg-white text-black font-mono text-xs uppercase font-bold hover:bg-neutral-200 rounded transition-all cursor-pointer flex items-center justify-center gap-2 group"
          >
            <span>Launch Playground</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => {
              if (isSignedIn) setCurrentPage('gallery');
              else onRequestAuth('gallery');
            }}
            className="w-full sm:w-auto px-6 py-3 bg-[#101010] text-white hover:bg-[#181818] border border-[#262626] hover:border-white font-mono text-xs uppercase font-bold rounded transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <LayoutGrid className="w-4 h-4 text-[#8b8b8b]" />
            <span>Explore Gallery</span>
          </button>
        </div>
      </div>

      {/* 3. CURATED SAMPLE SHOWCASE GRID */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#262626] pb-3 gap-2">
          <div className="space-y-1">
            <h2 className="text-xs font-pixel text-white uppercase tracking-wider">
              SYNTHESIS SHOWCASE
            </h2>
            <p className="text-[10px] font-mono text-[#8b8b8b]">
              Curated generations highlighting aesthetic output modules. Hover to copy prompts.
            </p>
          </div>
          <span className="text-[9px] font-mono text-[#555] uppercase">
            Click artwork to load in playground
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SAMPLE_ARTWORKS.map((art) => (
            <div
              key={art.id}
              onClick={() => handleGetStarted(art.prompt)}
              className="group relative bg-[#101010] border border-[#262626] hover:border-white rounded-xl overflow-hidden shadow-lg transition-all cursor-pointer flex flex-col"
            >
              <div className="relative aspect-square w-full bg-[#050505] overflow-hidden">
                <img
                  src={art.imageUrl}
                  alt={art.prompt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Overlay actions */}
                <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity p-3.5 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="px-2 py-0.5 text-[8px] font-mono font-bold bg-white text-black rounded uppercase">
                      {art.category}
                    </span>
                    <button
                      onClick={(e) => handleCopyPrompt(e, art.id, art.prompt)}
                      className="p-1.5 bg-black hover:bg-neutral-900 text-white rounded border border-white/20"
                      title="Copy Prompt"
                    >
                      {copiedId === art.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-[10px] font-mono text-[#ddd] line-clamp-3 leading-relaxed">
                      "{art.prompt}"
                    </p>
                    <span className="text-[9px] font-mono text-emerald-300 font-bold block">
                      Click to Synthesize →
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. ENGINE HIGHLIGHTS FEATURES ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="bg-[#101010]/60 backdrop-blur-md border border-[#262626] hover:border-[#3d3d3d] p-6 rounded-xl space-y-3 transition-colors">
          <div className="p-3 bg-[#050505] border border-[#262626] rounded-lg w-fit text-white">
            <LayoutGrid className="w-5 h-5" />
          </div>
          <h3 className="text-xs font-pixel text-white uppercase tracking-wider">
            Strict 1:1 Vector Engine
          </h3>
          <p className="text-[11px] font-mono text-[#8b8b8b] leading-relaxed">
            Generates precise 1024x1024 high contrast visuals designed for vector outputs. No aspect ratio clutter, just perfect square grids.
          </p>
        </div>

        <div className="bg-[#101010]/60 backdrop-blur-md border border-[#262626] hover:border-[#3d3d3d] p-6 rounded-xl space-y-3 transition-colors">
          <div className="p-3 bg-[#050505] border border-[#262626] rounded-lg w-fit text-white">
            <Zap className="w-5 h-5 text-amber-400" />
          </div>
          <h3 className="text-xs font-pixel text-white uppercase tracking-wider">
            Sub-Second Synthesizer
          </h3>
          <p className="text-[11px] font-mono text-[#8b8b8b] leading-relaxed">
            Leverages multi-stage latent noise transformation pipeline for instantaneous render cycles. See synthesis steps in real time.
          </p>
        </div>

        <div className="bg-[#101010]/60 backdrop-blur-md border border-[#262626] hover:border-[#3d3d3d] p-6 rounded-xl space-y-3 transition-colors">
          <div className="p-3 bg-[#050505] border border-[#262626] rounded-lg w-fit text-white">
            <Shield className="w-5 h-5 text-emerald-400" />
          </div>
          <h3 className="text-xs font-pixel text-white uppercase tracking-wider">
            Zero-Tracking Local Vault
          </h3>
          <p className="text-[11px] font-mono text-[#8b8b8b] leading-relaxed">
            Your creative ideas remain yours. Generates images, saves session history, and builds personal gallery archives locally using private browser cache.
          </p>
        </div>
      </div>

    </div>
  );
}

export default HomePage;
