import * as React from 'react';

import { cn } from '@/lib/utils';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, any>(
  ({ className, label, ...props }, ref) => {
    return (
      <div>
        {label && (
          <div className="self-start text-sm font-medium text-right text-secText mb-0">
            {label}
          </div>
        )}
        <textarea
          className={cn(
            'flex min-h-[60px] w-full rounded-md border text-mainText border-input  px-3 py-2 text-sm shadow-sm placeholder:text-secText placeholder:opacity-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 bg-background',
            className
          )}
          ref={ref}
          {...props}
          rows={4}
        />
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
