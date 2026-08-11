import React from 'react';
import ImageFuryLogo from './ImageFuryLogo';
import { Home, Sparkles, LayoutGrid } from 'lucide-react';
import { Show, UserButton, useUser } from '@clerk/react';

export function Header({ currentPage, setCurrentPage, onRequestAuth }) {
  const { isSignedIn } = useUser();

  const handleNavClick = (targetPage) => {
    if ((targetPage === 'dashboard' || targetPage === 'gallery') && !isSignedIn) {
      onRequestAuth(targetPage);
    } else {
      setCurrentPage(targetPage);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#050505]/90 backdrop-blur-md border-b border-[#262626]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <button 
          onClick={() => setCurrentPage('home')}
          className="text-left group cursor-pointer focus:outline-none"
        >
          <ImageFuryLogo size="md" />
        </button>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => handleNavClick('home')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded transition-colors cursor-pointer ${
              currentPage === 'home'
                ? 'bg-white/10 text-white border border-white/20'
                : 'text-[#8b8b8b] hover:text-white hover:bg-[#101010]'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>

          <button
            onClick={() => handleNavClick('dashboard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded transition-colors cursor-pointer ${
              currentPage === 'dashboard'
                ? 'bg-white/10 text-white border border-white/20'
                : 'text-[#8b8b8b] hover:text-white hover:bg-[#101010]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Playground</span>
          </button>

          <button
            onClick={() => handleNavClick('gallery')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded transition-colors cursor-pointer ${
              currentPage === 'gallery'
                ? 'bg-white/10 text-white border border-white/20'
                : 'text-[#8b8b8b] hover:text-white hover:bg-[#101010]'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Gallery</span>
          </button>
        </nav>

        {/* User Authentication Control */}
        <div className="flex items-center gap-3">
          <Show when="signed-in">
            <UserButton 
              showName 
              appearance={{
                elements: {
                  userButtonOuterIdentifier: 'text-white'
                }
              }}
            />
          </Show>
          <Show when="signed-out">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage('login')}
                className="px-3 py-1.5 text-xs font-mono text-white hover:text-[#8b8b8b] cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => setCurrentPage('signup')}
                className="px-3.5 py-1.5 text-xs font-mono bg-white text-black hover:bg-neutral-200 rounded transition-all cursor-pointer font-bold"
              >
                Get Started
              </button>
            </div>
          </Show>
        </div>
      </div>
    </header>
  );
}

export default Header;
