import React from 'react';
import { X, Sparkles, Command } from 'lucide-react';

const SUGGESTED_PROMPTS = [
  'Obsidian crystal monolith floating in dark mist, pixel art style',
  'Cyberpunk samurai warrior in glowing emerald neon rain',
  'Minimalist monochrome geometry with golden ratio vector lines',
  'Bioluminescent cosmic nebula inside a glass hourglass',
];

export function PromptInput({ prompt, setPrompt, onGenerate, isGenerating }) {
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (prompt.trim() && !isGenerating) {
        onGenerate();
      }
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-mono text-white flex items-center gap-1.5 font-bold">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>PROMPT INPUT</span>
        </label>
        {prompt && (
          <button
            onClick={() => setPrompt('')}
            className="text-[10px] font-mono text-[#8b8b8b] hover:text-white flex items-center gap-1 hover:bg-[#1a1a1a] px-1.5 py-0.5 rounded cursor-pointer"
          >
            <X className="w-3 h-3" />
            <span>Clear</span>
          </button>
        )}
      </div>

      <div className="relative">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={5}
          placeholder="Describe the image to generate... (e.g. 'Dark obsidian monolith with glowing cyan circuit lines in pixel art')"
          className="w-full p-3 text-xs font-mono bg-[#050505] border border-[#262626] focus:border-white rounded text-white placeholder-[#555] focus:outline-none resize-none leading-relaxed"
        />
        <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 pointer-events-none text-[9px] font-mono text-[#666] bg-[#050505]/80 px-2 py-0.5 rounded border border-[#1e1e1e]">
          <Command className="w-2.5 h-2.5" />
          <span>Ctrl + Enter to run</span>
        </div>
      </div>

      <div className="space-y-1.5 pt-1">
        <span className="text-[10px] font-mono text-[#666] uppercase tracking-wider block font-bold">
          Idea Starters
        </span>
        <div className="flex flex-wrap gap-1.5">
          {SUGGESTED_PROMPTS.map((idea, index) => (
            <button
              key={index}
              onClick={() => setPrompt(idea)}
              className="text-[10px] font-mono text-[#8b8b8b] hover:text-white bg-[#050505] hover:bg-[#151515] border border-[#262626] px-2 py-1 rounded truncate max-w-[200px] cursor-pointer"
            >
              + {idea}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PromptInput;
