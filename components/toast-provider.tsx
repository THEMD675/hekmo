"use client";

import { Toaster } from "sonner";

export function ToastProvider() {
  return (
    <Toaster
      closeButton
     
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
