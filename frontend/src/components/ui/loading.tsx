import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingProps {
  size?: number;
  className?: string;
  text?: string;
}

export default function Loading({ size = 24, className, text = "Loading..." }: LoadingProps) {
  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      <Loader2 className="animate-spin" size={size} />
      {text && <span>{text}</span>}
    </div>
  );
}

export function PageLoading({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Loading text={message} size={32} />
    </div>
  );
}

export function SectionLoading({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="py-12">
      <Loading text={message} />
    </div>
  );
}
