import React from "react";
import { Outlet, ScrollRestoration } from "react-router-dom";
import { Toaster } from "sonner";

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-bg-page text-text-primary font-sans antialiased selection:bg-accent-gold/30 selection:text-accent-gold">
      <div className="mx-auto w-full max-w-[1440px] min-h-screen flex flex-col">
        <Outlet />
      </div>
      <Toaster position="bottom-right" theme="dark" />
      <ScrollRestoration />
    </div>
  );
};
