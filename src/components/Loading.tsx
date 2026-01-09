import { Loader } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingProps {
  className?: string;
}

const Loading = ({ className }: LoadingProps) => {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <Loader className="animate-spin text-[#059861]" size={48} />
    </div>
  );
};

export default Loading;
