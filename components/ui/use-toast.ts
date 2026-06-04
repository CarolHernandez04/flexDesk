"use client";

import { useEffect, useState } from "react";

export type ToastState = {
  message: string;
  type: "success" | "error";
} | null;

export function useToast() {
  const [toast, setToast] = useState<ToastState>(null);

  useEffect(() => {
    if (!toast) return;

    const timeout = setTimeout(() => {
      setToast(null);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [toast]);

  return {
    toast,
    showSuccess: (message: string) =>
      setToast({
        message,
        type: "success",
      }),

    showError: (message: string) =>
      setToast({
        message,
        type: "error",
      }),
  };
}