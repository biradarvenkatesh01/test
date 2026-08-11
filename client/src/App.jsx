import React, { useState, useEffect } from 'react';
import BackgroundDots from './components/BackgroundDots';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import PreviewPanel from './components/PreviewPanel';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import GalleryPage from './pages/GalleryPage';
import { generateImage } from './services/api';
import { useUser, useAuth } from '@clerk/react';

export function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [redirectAfterLogin, setRedirectAfterLogin] = useState(null);

  // Clerk Authentication hooks
  const { isLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();

  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentResult, setCurrentResult] = useState(null);
  const [sessionHistory, setSessionHistory] = useState([]);

  // Auto-redirect once authentication completes successfully
  useEffect(() => {
    if (isLoaded && isSignedIn && (currentPage === 'login' || currentPage === 'signup')) {
      const target = redirectAfterLogin || 'dashboard';
      setCurrentPage(target);
      setRedirectAfterLogin(null);
    }
  }, [isLoaded, isSignedIn, currentPage, redirectAfterLogin]);

  const handleRequestAuth = (intendedPage) => {
    setRedirectAfterLogin(intendedPage);
    setCurrentPage('login');
  };

  const renderCurrentPage = () => {
    if (currentPage === 'dashboard' || currentPage === 'gallery') {
      if (isLoaded && !isSignedIn) {
        return <LoginPage setCurrentPage={setCurrentPage} redirectTarget={currentPage} />;
      }
      if (!isLoaded) {
        return (
          <div className="flex-1 flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center gap-3 font-mono text-xs text-[#8b8b8b]">
              <div className="w-8 h-8 border-2 border-[#262626] border-t-white rounded-full animate-spin" />
              <span>Verifying authentication...</span>
            </div>
          </div>
        );
      }
    }

    switch (currentPage) {
      case 'home':
        return <HomePage setCurrentPage={setCurrentPage} isSignedIn={isSignedIn} onRequestAuth={handleRequestAuth} setPrompt={setPrompt} />;
      case 'login':
        return <LoginPage setCurrentPage={setCurrentPage} redirectTarget={redirectAfterLogin} />;
      case 'signup':
        return <SignupPage setCurrentPage={setCurrentPage} />;
      case 'gallery':
        return <GalleryPage setCurrentPage={setCurrentPage} sessionHistory={sessionHistory} />;
      case 'dashboard':
      default:
        return (
          <div className="flex-1 flex flex-col lg:flex-row relative z-10 w-full min-h-[calc(100vh-4rem)]">
            <Sidebar
              prompt={prompt}
              setPrompt={setPrompt}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
              history={sessionHistory}
              onSelectHistoryItem={handleSelectHistoryItem}
              onClearHistory={handleClearHistory}
              activeItemId={currentResult?.id}
            />
            <PreviewPanel
              currentResult={currentResult}
              isGenerating={isGenerating}
              onRegenerate={handleGenerate}
              prompt={prompt}
            />
          </div>
        );
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);
    try {
      const token = await getToken();
      const result = await generateImage(prompt.trim(), token);
      setCurrentResult(result);
      setSessionHistory((prev) => [result, ...prev]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectHistoryItem = (item) => {
    setPrompt(item.prompt);
    setCurrentResult(item);
  };

  const handleClearHistory = () => {
    setSessionHistory([]);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#ffffff] font-mono flex flex-col relative selection:bg-white selection:text-black">
      <BackgroundDots />
      <Header
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onRequestAuth={handleRequestAuth}
      />
      <div className="flex-1 flex flex-col relative z-10">
        {renderCurrentPage()}
      </div>
      {currentPage !== 'dashboard' && <Footer />}
    </div>
  );
}

export default App;
