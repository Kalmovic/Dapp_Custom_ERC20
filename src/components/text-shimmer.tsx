import { cn } from "@/lib/utils";

export function TextShimmer(props: { width: string; className?: string }) {
  return (
    <span
      className={cn(
        "animate-pulse bg-gray-200 rounded-lg h-6 w-full",
        props.className
      )}
      style={{ width: props.width }}
    ></span>
  );
}
