import React from 'react';
import PromptInput from './PromptInput';
import History from './History';
import { Sparkles, Loader2 } from 'lucide-react';

export function Sidebar({
  prompt,
  setPrompt,
  onGenerate,
  isGenerating,
  history,
  onSelectHistoryItem,
  onClearHistory,
  activeItemId,
}) {
  return (
    <aside className="w-full lg:w-96 bg-[#101010] border-b lg:border-b-0 lg:border-r border-[#262626] p-5 flex flex-col gap-5 shrink-0 z-10">
      <PromptInput
        prompt={prompt}
        setPrompt={setPrompt}
        onGenerate={onGenerate}
        isGenerating={isGenerating}
      />

      <button
        onClick={onGenerate}
        disabled={isGenerating || !prompt.trim()}
        className={`w-full py-3 px-4 rounded font-mono font-bold text-xs uppercase transition-all flex items-center justify-center gap-2 cursor-pointer ${
          isGenerating || !prompt.trim()
            ? 'bg-[#1e1e1e] text-[#666] border border-[#262626] cursor-not-allowed'
            : 'bg-white text-black hover:bg-neutral-200 border border-white'
        }`}
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-black" />
            <span>Synthesizing...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 text-black fill-black" />
            <span>Generate Image</span>
          </>
        )}
      </button>

      <History
        history={history}
        onSelectHistoryItem={onSelectHistoryItem}
        onClearHistory={onClearHistory}
        activeItemId={activeItemId}
      />
    </aside>
  );
}

export default Sidebar;
