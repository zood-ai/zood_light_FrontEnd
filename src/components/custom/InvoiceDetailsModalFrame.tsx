import * as React from 'react';
import { AlertDialog, AlertDialogContent } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export type InvoiceDetailsModalFrameProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

/**
 * Shared shell for invoice / document preview modals: consistent panel, RTL-safe close, no external CDN assets.
 */
export function InvoiceDetailsModalFrame({
  open,
  onClose,
  children,
}: InvoiceDetailsModalFrameProps) {
  const { t } = useTranslation();

  return (
    <AlertDialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose();
      }}
    >
      <AlertDialogContent className="max-h-[95vh] w-[min(100vw-1rem,1107px)] max-w-[min(100vw-1rem,1107px)] border-none bg-transparent p-2 shadow-none sm:p-4">
        <div className="relative flex max-h-[92vh] flex-col overflow-hidden rounded-xl border border-border bg-card shadow-lg">
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="absolute end-3 top-3 z-[60] h-9 w-9 shrink-0 rounded-full border border-border bg-background/95 shadow-sm no-print hover:bg-muted"
            onClick={onClose}
            aria-label={t('CLOSE')}
          >
            <X className="h-4 w-4" aria-hidden />
          </Button>
          <div className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-auto pt-1 sm:pt-2 [scrollbar-gutter:stable]">
            {children}
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
