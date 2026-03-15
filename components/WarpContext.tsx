import React, { createContext, useContext, useState, ReactNode } from 'react';

interface WarpContextType {
  isWarping: boolean;
  triggerWarp: () => void;
}

const WarpContext = createContext<WarpContextType | undefined>(undefined);

export const WarpProvider = ({ children }: { children: ReactNode }) => {
  const [isWarping, setIsWarping] = useState(false);

  const triggerWarp = () => {
    setIsWarping(true);
    // Warp lasts for 1 second (approx time to scroll) then slows down
    setTimeout(() => {
      setIsWarping(false);
    }, 800);
  };

  return (
    <WarpContext.Provider value={{ isWarping, triggerWarp }}>
      {children}
    </WarpContext.Provider>
  );
};

export const useWarp = () => {
  const context = useContext(WarpContext);
  if (!context) {
    throw new Error('useWarp must be used within a WarpProvider');
  }
  return context;
};