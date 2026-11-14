import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-12 w-full rounded-full border border-line bg-card px-4 text-base text-ink outline-none placeholder:text-ink-soft/70 focus-visible:ring-2 focus-visible:ring-ribbon",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
