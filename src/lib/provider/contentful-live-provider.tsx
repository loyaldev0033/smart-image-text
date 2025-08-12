// At the top of your file (client-side only)
"use client";

import { useEffect, useState } from "react";
import { ContentfulLivePreview } from "@contentful/live-preview";

export default function ContentfulLivePreviewInitProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isInitialized, setIsInitialized] = useState(false);
  useEffect(() => {
    if (!isInitialized) {
      ContentfulLivePreview.init({
        locale: "en-US",
      });
      setIsInitialized(true);
    }
  }, []);

  if (!isInitialized) {
    return null;
  }
  return children;
}
