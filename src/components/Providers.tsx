"use client";

import type { ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import { CopyProvider } from "@/components/CopyContext";
import { AuthProvider } from "@/components/AuthContext";
import "react-toastify/dist/ReactToastify.css";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <CopyProvider>
        {children}
        <ToastContainer position="bottom-left" autoClose={3000} newestOnTop closeButton />
      </CopyProvider>
    </AuthProvider>
  );
}
