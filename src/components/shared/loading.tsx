import { cn } from "@/lib/utils";

interface IProps {
  className?: string;
}

export default function Loading(props: IProps) {
  return (
    <div className={cn("dot-spinner", props.className)}>
      <div className="dot-spinner__dot"></div>
      <div className="dot-spinner__dot"></div>
      <div className="dot-spinner__dot"></div>
      <div className="dot-spinner__dot"></div>
      <div className="dot-spinner__dot"></div>
      <div className="dot-spinner__dot"></div>
      <div className="dot-spinner__dot"></div>
      <div className="dot-spinner__dot"></div>
    </div>
  );
}
