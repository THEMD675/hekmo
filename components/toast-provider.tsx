"use client";

import { Toaster } from "sonner";

export function ToastProvider() {
  return (
    <Toaster
      closeButton
      dir="rtl"
      expand
      position="top-center"
      richColors
      toastOptions={{
        className: "rtl",
        style: {
          direction: "rtl",
        },
      }}
    />
  );
}
