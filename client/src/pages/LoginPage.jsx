import React from 'react';
import { SignIn } from '@clerk/react';
import ImageFuryLogo from '../components/ImageFuryLogo';

export function LoginPage({ setCurrentPage, redirectTarget }) {
  return (
    <div className="relative z-10 min-h-[calc(100vh-12rem)] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm bg-[#101010] border border-[#262626] rounded-xl p-6 sm:p-8 space-y-5 shadow-2xl flex flex-col items-center">
        <ImageFuryLogo size="md" />
        <div className="text-center">
          <h2 className="text-xs font-mono font-bold text-white uppercase">AUTHENTICATION CORE</h2>
          <p className="text-[10px] font-mono text-[#8b8b8b] mt-1">Sign in to access playground & gallery</p>
        </div>

        {redirectTarget && (
          <div className="w-full p-2 bg-amber-950/40 border border-amber-800/50 rounded text-[10px] font-mono text-amber-300 text-center">
            Sign in required to access {redirectTarget.toUpperCase()}.
          </div>
        )}

        <SignIn
          routing="virtual"
          appearance={{
            elements: {
              footerAction: { display: 'none' },
              footer: { display: 'none' },
            }
          }}
        />

        <div className="w-full text-center text-[10px] font-mono text-[#8b8b8b] pt-2 border-t border-[#262626] flex items-center justify-between">
          <span>Need an account?</span>
          <button onClick={() => setCurrentPage('signup')} className="text-white font-bold hover:underline">SIGN UP</button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
