// DialogSidebar.jsx
import React from 'react';
import { Dialog } from './ui/dialog';
import XIcons from './Icons/XIcons';

export default function DialogSidebar({ isOpen, onClose, children }) {
  return (
    <Dialog open={isOpen}  >
      <div className="flex justify-end min-h-screen">
        {/* Sidebar container */}
        <div className="relative w-80 bg-white dark:bg-gray-800 shadow-xl transition-all duration-300">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <XIcons  aria-hidden="true" />
          </button>
          {/* Sidebar content */}
          <div className="px-6 py-4">
            {children}
          </div>
        </div>
      </div>
    </Dialog>
  );
}
