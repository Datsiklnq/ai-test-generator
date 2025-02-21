"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface CopyContextType {
  isCopied: "testCase" | "testScript" | null;
  copyToClipboard: (text: string, type: "testCase" | "testScript") => void;
}

const CopyContext = createContext<CopyContextType | undefined>(undefined);

export const CopyProvider = ({ children }: { children: ReactNode }) => {
  const [isCopied, setIsCopied] = useState<"testCase" | "testScript" | null>(
    null
  );

  const copyToClipboard = (text: string, type: "testCase" | "testScript") => {
    if (text) {
      navigator.clipboard.writeText(text).then(() => {
        setIsCopied(type);
        setTimeout(() => setIsCopied(null), 2000);
      });
    }
  };

  return (
    <CopyContext.Provider value={{ isCopied, copyToClipboard }}>
      {children}
    </CopyContext.Provider>
  );
};

export const useCopy = () => {
  const context = useContext(CopyContext);
  if (!context) throw new Error("useCopy must be used within a CopyProvider");
  return context;
};
