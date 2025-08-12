"use client";

import "@/styles/globals.css";

import { Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Provider } from "react-redux";
import { SystemNotificationProvider } from "@/lib/provider/notification-provider";
import { AppLayout } from "@/sections/layout";
import { SessionProvider } from "next-auth/react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (retryNum, err: any) => {
        const status = err?.response?.status || 0;
        if (status === 401) return false;
        return retryNum < 3;
      },
      refetchOnWindowFocus: false,
    },
  },
});

const AppProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    // <SessionProvider>
    <QueryClientProvider client={queryClient}>
      <SystemNotificationProvider>
        <Suspense>
          <Toaster />
          <TooltipProvider>
            <AppLayout>{children}</AppLayout>
          </TooltipProvider>
        </Suspense>
      </SystemNotificationProvider>
    </QueryClientProvider>
    // </SessionProvider>
  );
};

export default AppProvider;
