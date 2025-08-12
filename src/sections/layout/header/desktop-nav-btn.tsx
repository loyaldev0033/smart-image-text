import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const DesktopNavBtn = ({
  children,
  active,
}: {
  children: React.ReactNode;
  active: boolean;
}) => {
  return (
    <Button
      variant="ghost"
      className={cn(
        active && "text-primary relative",
        "hover:text-primary transition-all",
      )}
    >
      {children}
      {active && (
        <span className="absolute -bottom-3 left-0 w-full h-[3px] bg-primary" />
      )}
    </Button>
  );
};

export default DesktopNavBtn;
