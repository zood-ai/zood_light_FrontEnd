import * as React from 'react';

import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, type, ...props }, ref) => {
    return (
      <>
        {label && (
          <label className="mt-2 text-sm  font-medium text-zinc-800">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            'flex h-[40px] bg-background w-[327px] rounded-md border border-input bg-taransparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-secText focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-main disabled:cursor-not-allowed disabled:bg-[#F2F2F2]',
            className
          )}
          ref={ref}
          {...props}
        />
      </>
    );
  }
);
Input.displayName = 'Input';

export { Input };
