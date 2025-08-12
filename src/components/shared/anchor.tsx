import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { LucideChevronUp } from "lucide-react";

const Anchor: React.FC<React.AnchorHTMLAttributes<HTMLAnchorElement>> = ({
  className,
  children,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const handleScroll = () => {
    if (window.scrollY > 100) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <a
      className={cn(
        "fixed bottom-4 right-4 transition-opacity duration-100 w-10 h-10 bg-gray-100/50 rounded-full shadow-md flex items-center justify-center text-black cursor-pointer",
        isVisible ? "opacity-100" : "opacity-0",
        className,
      )}
      {...props}
      onClick={() => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }}
    >
      {children ? children : <LucideChevronUp className="w-6 h-6" />}
    </a>
  );
};

export default Anchor;
