import React, { useEffect } from "react";

const TableOfContents: React.FC<
  React.HtmlHTMLAttributes<HTMLDivElement> & {
    onActivate?: (section: string) => void;
    selector: string;
    active: string;
  }
> = ({ children, onActivate, id, selector, active, ...props }) => {
  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll(selector);
      const activeElement = Array.from(elements).find((el) => {
        const rect = el.getBoundingClientRect();
        return rect.top >= 0 && rect.top < window.innerHeight;
      });
      if (activeElement && activeElement.id !== active) {
        onActivate?.(activeElement.id);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [active]);
  return (
    <div {...props} id={id}>
      {children}
    </div>
  );
};

export default TableOfContents;
