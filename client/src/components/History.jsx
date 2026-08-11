import React from 'react';
import { History as HistoryIcon, Trash2, ArrowUpRight } from 'lucide-react';

export function History({ history = [], onSelectHistoryItem, onClearHistory, activeItemId }) {
  if (!history || history.length === 0) {
    return (
      <div className="space-y-3 border-t border-[#262626] pt-4">
        <label className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
          <HistoryIcon className="w-3.5 h-3.5 text-[#8b8b8b]" />
          <span>SESSION HISTORY</span>
        </label>
        <div className="p-4 bg-[#050505] border border-[#262626] rounded text-center text-xs font-mono text-[#666]">
          No generations yet in this session.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 border-t border-[#262626] pt-4">
      <div className="flex items-center justify-between">
        <label className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
          <HistoryIcon className="w-3.5 h-3.5 text-[#8b8b8b]" />
          <span>SESSION HISTORY ({history.length})</span>
        </label>
        <button
          onClick={onClearHistory}
          className="text-[10px] font-mono text-[#8b8b8b] hover:text-red-400 flex items-center gap-1 hover:bg-red-950/30 px-2 py-0.5 rounded cursor-pointer"
        >
          <Trash2 className="w-3 h-3" />
          <span>Clear</span>
        </button>
      </div>

      <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
        {history.map((item) => {
          const isActive = activeItemId === item.id;
          return (
            <div
              key={item.id}
              onClick={() => onSelectHistoryItem(item)}
              className={`group flex items-start gap-2.5 p-2 rounded bg-[#050505] border transition-all cursor-pointer ${
                isActive ? 'border-white bg-white/5' : 'border-[#262626] hover:border-white'
              }`}
            >
              <div className="relative w-10 h-10 rounded overflow-hidden bg-[#101010] border border-[#262626] shrink-0">
                <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <p className="text-[11px] font-mono text-white truncate leading-none mt-1 group-hover:text-emerald-300">
                  {item.prompt}
                </p>
                <span className="text-[9px] font-mono text-[#555] block">
                  {item.renderTime || '0.8s'} • Seed #{item.seed}
                </span>
              </div>
              <ArrowUpRight className="w-3 h-3 text-[#666] group-hover:text-white shrink-0 mt-1" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default History;
