import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MobileNavBtn = ({
  children,
  active,
}: {
  children: React.ReactNode;
  active: boolean;
}) => {
  return (
    <Button
      variant="ghost"
      className={cn(active && "text-primary relative", "justify-start")}
    >
      {children}
      {active && (
        <span className="absolute bottom-0 left-0 w-1 h-full bg-primary" />
      )}
    </Button>
  );
};

export default MobileNavBtn;
