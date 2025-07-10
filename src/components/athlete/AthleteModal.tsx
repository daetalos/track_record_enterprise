'use client';

import React from 'react';
import { Modal } from '@/components/ui/modal';
import AthleteForm from './AthleteForm';

interface AthleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AthleteModal({
  isOpen,
  onClose,
  onSuccess,
}: AthleteModalProps) {
  // Handle successful form submission
  const handleFormSuccess = () => {
    onSuccess();
  };

  // Handle form cancellation
  const handleFormCancel = () => {
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl mx-4">
      <div className="p-6">
        {/* Modal Header */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Add New Athlete
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Add a new athlete to your club roster
          </p>
        </div>

        {/* Form */}
        <AthleteForm
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      </div>
    </Modal>
  );
}
