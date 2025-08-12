"use client";

import Footer from "./footer";
import { useTransitionRouter } from "@/lib/view-transition/use-transition-router";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Header from "./header";

interface AppLayoutProps {
  children: React.ReactNode;
  hideSearchBar?: boolean;
  authRouter?: boolean;
}

export const AppLayout = ({ children, authRouter = false }: AppLayoutProps) => {
  const router = useTransitionRouter();
  const pathname = usePathname();

  const isFullWidthRoute =
    pathname === "/about" || pathname === "/how-it-works" || pathname === "/";

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header/Navigation */}
      <header className="w-full py-2 border-b border-gray-100">
        <Header />
      </header>

      {/* Main Content */}
      <main
        className={cn(
          "mx-auto flex-grow w-full h-full",
          !isFullWidthRoute && "px-6 container max-w-screen-xl",
        )}
      >
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};
