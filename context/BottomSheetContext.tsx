import React, { createContext, useContext, useState } from 'react';

type BottomSheetContextType = {
  isBottomSheetOpen: boolean;
  setIsBottomSheetOpen: (isOpen: boolean) => void;
};

const BottomSheetContext = createContext<BottomSheetContextType | undefined>(undefined);

export function BottomSheetProvider({ children }: { children: React.ReactNode }) {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  return (
    <BottomSheetContext.Provider value={{ isBottomSheetOpen, setIsBottomSheetOpen }}>
      {children}
    </BottomSheetContext.Provider>
  );
}

export function useBottomSheet() {
  const context = useContext(BottomSheetContext);
  if (context === undefined) {
    throw new Error('useBottomSheet must be used within a BottomSheetProvider');
  }
  return context;
} 