'use client';

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table/index';
import Button from '@/components/ui/button/Button';
import { PencilIcon, TrashBinIcon } from '@/icons';
import type { AgeGroup } from '@/types/athlete';

interface AgeGroupListProps {
  ageGroups: AgeGroup[];
  isLoading: boolean;
  onEdit: (ageGroup: AgeGroup) => void;
  onRefresh: () => void;
}

export default function AgeGroupList({
  ageGroups,
  isLoading,
  onEdit,
  onRefresh,
}: AgeGroupListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Handle age group deletion
  const handleDelete = async (ageGroup: AgeGroup) => {
    if (!confirm(`Are you sure you want to delete "${ageGroup.name}"?`)) {
      return;
    }

    setDeletingId(ageGroup.id);

    try {
      const response = await fetch(`/api/age-groups/${ageGroup.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete age group');
      }

      // Refresh the list after successful deletion
      onRefresh();
    } catch (error) {
      console.error('Error deleting age group:', error);
      alert(
        error instanceof Error ? error.message : 'Failed to delete age group'
      );
    } finally {
      setDeletingId(null);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
          <div className="w-4 h-4 border border-gray-300 rounded-full animate-spin border-t-transparent dark:border-gray-600"></div>
          Loading age groups...
        </div>
      </div>
    );
  }

  // Empty state
  if (ageGroups.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 mx-auto mb-4 text-gray-400">
          <svg
            fill="none"
            stroke="currentColor"
            viewBox="0 0 48 48"
            className="w-12 h-12"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6M36 6v6m0 0v6m0-6h6m-6 0h-6M12 36v6m0 0v6m0-6h6m-6 0H6M36 36v6m0 0v6m0-6h6m-6 0h-6"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No Age Groups
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          Get started by creating your first age group.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[600px]">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Name
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Ordinal
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Created
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-end text-theme-xs dark:text-gray-400"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {ageGroups.map(ageGroup => (
                <TableRow key={ageGroup.id}>
                  <TableCell className="px-5 py-4 text-start">
                    <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {ageGroup.name}
                    </span>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {ageGroup.ordinal}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {new Date(ageGroup.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-end">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEdit(ageGroup)}
                        startIcon={<PencilIcon className="w-4 h-4" />}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(ageGroup)}
                        disabled={deletingId === ageGroup.id}
                        startIcon={
                          deletingId === ageGroup.id ? (
                            <div className="w-4 h-4 border border-gray-300 rounded-full animate-spin border-t-transparent" />
                          ) : (
                            <TrashBinIcon className="w-4 h-4" />
                          )
                        }
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                      >
                        {deletingId === ageGroup.id ? 'Deleting...' : 'Delete'}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
