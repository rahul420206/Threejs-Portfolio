import React, { Suspense, useState, useEffect } from 'react';
import Background3D from './components/Background3D';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Contact from './components/Contact';
import { WarpProvider } from './components/WarpContext'; // Import the provider
import { Loader2 } from 'lucide-react';

const LoadingScreen = () => (
  <div className="fixed inset-0 bg-[#050505] flex flex-col items-center justify-center z-[100]">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-mono text-primary">RM</span>
      </div>
    </div>
    <p className="mt-4 text-gray-500 font-mono text-sm animate-pulse">Initializing Environment...</p>
  </div>
);

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate asset loading
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    // Wrap the entire application in the WarpProvider so components can share state
    <WarpProvider>
      <div className="antialiased text-gray-100 selection:bg-primary/30 selection:text-white">
        
        {/* 3D Background layer */}
        <Suspense fallback={null}>
          <Background3D />
        </Suspense>

        {/* Content Layer */}
        <div className="relative z-10">
          <Navbar />
          <main>
            <Hero />
            <Skills />
            <Experience />
            <Projects />
            <Contact />
          </main>
        </div>
      </div>
    </WarpProvider>
  );
}

export default App;