import { cn } from "@/lib/utils";

const SvgIcon = ({ url, className }: { url: string; className?: string }) => {
  return (
    <div
      className={cn("w-4 h-4 bg-blue-500 rounded-sm", className)}
      style={{
        display: "inline-block",
        mask: `url(${url}) no-repeat center`,
        WebkitMask: `url(${url}) no-repeat center`,
        maskSize: "contain",
        WebkitMaskSize: "contain",
      }}
    />
  );
};

export default SvgIcon;
