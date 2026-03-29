import React from 'react';
import { ViewModal } from '@/components/custom/ViewModal';
import { InvoiceDetailsModalFrame } from '@/components/custom/InvoiceDetailsModalFrame';

interface DetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: unknown;
}

export const DetailsModal: React.FC<DetailsModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <InvoiceDetailsModalFrame open={isOpen} onClose={onClose}>
      <ViewModal title="" />
    </InvoiceDetailsModalFrame>
  );
};
