"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

// Define notification context types
type NotificationContextType = {
  sendNotification: (title: string, options?: NotificationOptions) => void;
  requestPermission: () => Promise<NotificationPermission>;
  hasPermission: boolean;
};

// Create the context with default values
const NotificationContext = createContext<NotificationContextType>({
  sendNotification: () => {},
  requestPermission: async () => "default" as NotificationPermission,
  hasPermission: false,
});

// Hook to use notifications in components
export const useSystemNotification = () => useContext(NotificationContext);

export const SystemNotificationProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [permission, setPermission] =
    useState<NotificationPermission>("default");

  // Check if notifications are supported
  const isSupported = typeof window !== "undefined" && "Notification" in window;

  // Request notification permission
  const requestPermission = async (): Promise<NotificationPermission> => {
    if (!isSupported) return "denied";

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result;
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      return "denied";
    }
  };

  // Send a notification
  const sendNotification = (title: string, options?: NotificationOptions) => {
    if (!isSupported || permission !== "granted") return;

    try {
      const notification = new Notification(title, options);
      notification.onclick = (event) => {
        event.preventDefault();
        if (options?.data?.url) {
          window.open(options?.data?.url, "_blank");
        } else {
          window.open(process.env.NEXT_PUBLIC_BASE_URL, "_blank");
        }
        notification.close();
      };
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  // Check permission status on mount
  useEffect(() => {
    if (isSupported) {
      setPermission(Notification.permission);
    }
  }, [isSupported]);

  return (
    <NotificationContext.Provider
      value={{
        sendNotification,
        requestPermission,
        hasPermission: permission === "granted",
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default SystemNotificationProvider;
