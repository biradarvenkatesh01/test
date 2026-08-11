import React, { useState, useEffect } from 'react';
import { LayoutGrid, Search, Download, Trash2, X, Check, Copy, Plus } from 'lucide-react';
import confetti from 'canvas-confetti';
import { fetchGallery, deleteGalleryImage } from '../services/api';
import { useAuth } from '@clerk/react';

export function GalleryPage({ setCurrentPage, sessionHistory = [] }) {
  const { getToken } = useAuth();
  const [galleryItems, setGalleryItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedLightboxImage, setSelectedLightboxImage] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    async function loadGalleryData() {
      setLoading(true);
      const token = await getToken();
      const data = await fetchGallery(token);
      
      const map = new Map();
      sessionHistory.forEach((item) => map.set(item.id, item));
      data.forEach((item) => map.set(item.id, item));
      
      setGalleryItems(Array.from(map.values()));
      setLoading(false);
    }
    loadGalleryData();
  }, [sessionHistory, getToken]);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm('Delete artwork?')) {
      const token = await getToken();
      await deleteGalleryImage(id, token);
      setGalleryItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleDownload = (e, item) => {
    e.stopPropagation();
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#ffffff', '#8b8b8b'],
      });
    } catch {}
    window.open(item.imageUrl, '_blank');
  };

  const handleCopyPrompt = (e, item) => {
    e.stopPropagation();
    navigator.clipboard.writeText(item.prompt);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredItems = galleryItems.filter((item) =>
    item.prompt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 min-h-[calc(100vh-10rem)]">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#262626] pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-base font-pixel text-white uppercase tracking-wider flex items-center gap-2">
              <LayoutGrid className="w-5 h-5" />
              <span>Personal Gallery</span>
            </h1>
            <span className="px-2 py-0.5 text-xs font-mono bg-[#101010] text-[#8b8b8b] border border-[#262626] rounded-full">
              {filteredItems.length} Images
            </span>
          </div>
        </div>

        <button
          onClick={() => setCurrentPage('dashboard')}
          className="px-4 py-2 bg-white text-black font-mono text-xs uppercase hover:bg-neutral-200 rounded transition-all font-bold w-fit cursor-pointer flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>New Generation</span>
        </button>
      </div>

      <div className="flex items-center gap-3 bg-[#101010] border border-[#262626] rounded-lg p-2 max-w-md">
        <Search className="w-4 h-4 text-[#8b8b8b] ml-1 shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search prompts..."
          className="w-full text-xs font-mono bg-transparent text-white focus:outline-none"
        />
      </div>

      {loading ? (
        <div className="py-20 text-center font-mono text-xs text-[#8b8b8b]">Loading gallery...</div>
      ) : filteredItems.length === 0 ? (
        <div className="py-20 border border-[#262626] rounded-xl text-center space-y-3 max-w-sm mx-auto p-6 font-mono">
          <h3 className="text-xs font-bold text-white">EMPTY GALLERY</h3>
          <button onClick={() => setCurrentPage('dashboard')} className="px-4 py-2 bg-white text-black rounded text-xs font-bold">Generate Now</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedLightboxImage(item)}
              className="group relative bg-[#101010] border border-[#262626] hover:border-white rounded-xl overflow-hidden shadow-lg transition-all cursor-pointer flex flex-col"
            >
              <div className="relative aspect-square w-full bg-[#050505] overflow-hidden">
                <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-between">
                  <div className="flex justify-end gap-1.5">
                    <button
                      onClick={(e) => handleCopyPrompt(e, item)}
                      className="p-1.5 bg-black/80 hover:bg-black text-white rounded border border-white/20"
                    >
                      {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={(e) => handleDownload(e, item)}
                      className="p-1.5 bg-black/80 hover:bg-black text-white rounded border border-white/20"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, item.id)}
                      className="p-1.5 bg-black/80 hover:bg-red-950 text-red-400 rounded border border-red-900/50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs font-mono text-white line-clamp-3 leading-relaxed">{item.prompt}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedLightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedLightboxImage(null)}
        >
          <div
            className="relative max-w-2xl max-h-[85vh] bg-[#101010] border border-[#262626] rounded-xl overflow-hidden p-2 flex flex-col items-center space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedLightboxImage(null)}
              className="absolute top-4 right-4 z-10 p-1.5 bg-black/80 hover:bg-black text-white rounded-full border border-white/20"
            >
              <X className="w-4 h-4" />
            </button>
            <img src={selectedLightboxImage.imageUrl} alt="" className="max-h-[65vh] w-auto object-contain rounded-lg" />
            <div className="w-full p-3 bg-[#050505] border border-[#262626] rounded-lg flex items-center justify-between gap-4">
              <p className="text-xs font-mono text-white truncate">{selectedLightboxImage.prompt}</p>
              <button
                onClick={(e) => handleDownload(e, selectedLightboxImage)}
                className="px-3 py-1.5 text-xs font-mono bg-white text-black hover:bg-neutral-200 rounded font-bold shrink-0"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GalleryPage;
