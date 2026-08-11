import React, { useState } from 'react';
import ImageFuryLogo from './ImageFuryLogo';
import { Mail, Shield, FileText } from 'lucide-react';

export function Footer() {
  const [activeModal, setActiveModal] = useState(null); // 'privacy' | 'terms' | 'contact' | null
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({ email: '', message: '' });

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.email || !contactForm.message) return;
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setContactForm({ email: '', message: '' });
      setActiveModal(null);
    }, 1500);
  };

  return (
    <>
      <footer className="relative z-10 w-full bg-[#050505] border-t border-[#262626] py-8 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
            <ImageFuryLogo size="sm" />
            <span className="text-xs font-mono text-[#8b8b8b]">
              © {new Date().getFullYear()} ImageFury Inc. Sleek prompt-to-image generator.
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs font-mono text-[#8b8b8b]">
            <button onClick={() => setActiveModal('privacy')} className="hover:text-white cursor-pointer flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" />
              <span>Privacy</span>
            </button>
            <button onClick={() => setActiveModal('terms')} className="hover:text-white cursor-pointer flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" />
              <span>Terms</span>
            </button>
            <button onClick={() => setActiveModal('contact')} className="hover:text-white cursor-pointer flex items-center gap-1">
              <Mail className="w-3.5 h-3.5" />
              <span>Contact Support</span>
            </button>
          </div>
        </div>
      </footer>

      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-[#101010] border border-[#262626] rounded-lg p-6 shadow-2xl space-y-4">
            {activeModal === 'privacy' && (
              <>
                <div className="flex items-center justify-between border-b border-[#262626] pb-2">
                  <h3 className="text-sm font-pixel text-white flex items-center gap-2">Privacy Policy</h3>
                  <button onClick={() => setActiveModal(null)} className="text-[#8b8b8b] hover:text-white">✕</button>
                </div>
                <p className="text-xs font-mono text-[#8b8b8b]">Your prompts are processed securely. We respect creative data ownership.</p>
              </>
            )}

            {activeModal === 'terms' && (
              <>
                <div className="flex items-center justify-between border-b border-[#262626] pb-2">
                  <h3 className="text-sm font-pixel text-white flex items-center gap-2">Terms of Service</h3>
                  <button onClick={() => setActiveModal(null)} className="text-[#8b8b8b] hover:text-white">✕</button>
                </div>
                <p className="text-xs font-mono text-[#8b8b8b]">Generations are licensed royalty-free. Unlawful or abusive prompts are restricted.</p>
              </>
            )}

            {activeModal === 'contact' && (
              <>
                <div className="flex items-center justify-between border-b border-[#262626] pb-2">
                  <h3 className="text-sm font-pixel text-white">Contact Support</h3>
                  <button onClick={() => setActiveModal(null)} className="text-[#8b8b8b] hover:text-white">✕</button>
                </div>
                {contactSubmitted ? (
                  <div className="py-4 text-center text-xs font-mono text-emerald-400">Message transmitted!</div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-3">
                    <input
                      type="email"
                      required
                      placeholder="developer@imagefury.ai"
                      className="w-full px-3 py-2 text-xs font-mono bg-[#050505] border border-[#262626] rounded text-white"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    />
                    <textarea
                      required
                      rows={3}
                      placeholder="Message..."
                      className="w-full px-3 py-2 text-xs font-mono bg-[#050505] border border-[#262626] rounded text-white resize-none"
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    />
                    <button type="submit" className="px-4 py-2 bg-white text-black rounded text-xs font-bold font-mono">Send</button>
                  </form>
                )}
              </>
            )}

            <div className="flex justify-end pt-2 border-t border-[#262626]">
              <button onClick={() => setActiveModal(null)} className="px-3 py-1 bg-[#1a1a1a] text-white rounded text-xs">Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Footer;
