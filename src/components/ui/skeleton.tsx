import { cn } from "@/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md  bg-gray-400 -z-30", className)}
      {...props}
    />
  );
}

export { Skeleton };
