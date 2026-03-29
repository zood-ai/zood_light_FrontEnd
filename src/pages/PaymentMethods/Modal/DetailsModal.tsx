import React from 'react';
import { ViewModal } from '@/components/custom/ViewModal';
import { InvoiceDetailsModalFrame } from '@/components/custom/InvoiceDetailsModalFrame';

interface SellerDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: unknown;
}

export const DetailsModal: React.FC<SellerDetailsModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <InvoiceDetailsModalFrame open={isOpen} onClose={onClose}>
      <ViewModal title="" />
    </InvoiceDetailsModalFrame>
  );
};
