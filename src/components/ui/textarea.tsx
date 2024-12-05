import * as React from "react";

import { cn } from "@/utils";
import { Label } from "./label";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <>
        {" "}
        {label && (
          <div className="mt-[16px] ">
            <Label>{label}</Label>
          </div>
        )}
        <textarea
          className={cn(
            "flex mt-2 min-h-[80px] w-full rounded-md border border-gray-400 bg-background px-3 py-2  focus-visible:outline-secondary-foreground  placeholder:text-[#d4d8d9ff]   disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
      </>
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
