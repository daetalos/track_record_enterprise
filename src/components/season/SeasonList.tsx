'use client';

import React, { useState, useMemo, useCallback } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  createColumnHelper,
  type SortingState,
  type ColumnFiltersState,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Button from '@/components/ui/button/Button';
import Input from '@/components/form/input/InputField';
import {
  PencilIcon,
  TrashBinIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from '@/icons';
import type { Season } from '@/types/season';

interface SeasonListProps {
  seasons: Season[];
  isLoading: boolean;
  onEdit: (season: Season) => void;
  onRefresh: () => void;
}

const columnHelper = createColumnHelper<Season>();

export default function SeasonList({
  seasons,
  isLoading,
  onEdit,
  onRefresh,
}: SeasonListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  // Handle season deletion
  const handleDelete = useCallback(
    async (season: Season) => {
      if (!confirm(`Are you sure you want to delete "${season.name}"?`)) {
        return;
      }

      setDeletingId(season.id);

      try {
        const response = await fetch(`/api/seasons/${season.id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to delete season');
        }

        // Refresh the list after successful deletion
        onRefresh();
      } catch (error) {
        console.error('Error deleting season:', error);
        alert(
          error instanceof Error ? error.message : 'Failed to delete season'
        );
      } finally {
        setDeletingId(null);
      }
    },
    [onRefresh]
  );

  // Define table columns
  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        id: 'name',
        header: ({ column }) => (
          <button
            className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Name
            {column.getIsSorted() === 'asc' ? (
              <ChevronUpIcon className="w-4 h-4" />
            ) : column.getIsSorted() === 'desc' ? (
              <ChevronDownIcon className="w-4 h-4" />
            ) : null}
          </button>
        ),
        cell: ({ getValue }) => (
          <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
            {getValue()}
          </span>
        ),
      }),
      columnHelper.accessor('description', {
        id: 'description',
        header: 'Description',
        cell: ({ getValue }) => {
          const description = getValue();
          return (
            <span className="text-gray-500 text-theme-sm dark:text-gray-400">
              {description || 'No description'}
            </span>
          );
        },
      }),
      columnHelper.accessor('_count.disciplines', {
        id: 'disciplineCount',
        header: 'Disciplines',
        cell: ({ getValue }) => (
          <span className="text-gray-500 text-theme-sm dark:text-gray-400">
            {getValue() || 0}
          </span>
        ),
      }),
      columnHelper.accessor('createdAt', {
        id: 'createdAt',
        header: ({ column }) => (
          <button
            className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Created
            {column.getIsSorted() === 'asc' ? (
              <ChevronUpIcon className="w-4 h-4" />
            ) : column.getIsSorted() === 'desc' ? (
              <ChevronDownIcon className="w-4 h-4" />
            ) : null}
          </button>
        ),
        cell: ({ getValue }) => (
          <span className="text-gray-500 text-theme-sm dark:text-gray-400">
            {new Date(getValue()).toLocaleDateString()}
          </span>
        ),
      }),
      columnHelper.display({
        id: 'actions',
        header: () => <span className="text-end">Actions</span>,
        cell: ({ row }) => {
          const season = row.original;
          return (
            <div className="flex items-center justify-end gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEdit(season)}
                startIcon={<PencilIcon className="w-4 h-4" />}
              >
                Edit
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDelete(season)}
                disabled={deletingId === season.id}
                startIcon={
                  deletingId === season.id ? (
                    <div className="w-4 h-4 border border-gray-300 rounded-full animate-spin border-t-transparent" />
                  ) : (
                    <TrashBinIcon className="w-4 h-4" />
                  )
                }
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
              >
                {deletingId === season.id ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          );
        },
      }),
    ],
    [onEdit, deletingId, handleDelete]
  );

  // Create table instance
  const table = useReactTable({
    data: seasons,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
          <div className="w-4 h-4 border border-gray-300 rounded-full animate-spin border-t-transparent dark:border-gray-600"></div>
          Loading seasons...
        </div>
      </div>
    );
  }

  // Empty state
  if (seasons.length === 0) {
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
          No Seasons
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          Get started by creating your first season.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Filter */}
      <div className="flex items-center gap-4">
        <div className="flex-1 max-w-sm">
          <Input
            placeholder="Search seasons..."
            value={globalFilter ?? ''}
            onChange={e => setGlobalFilter(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[600px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                {table.getHeaderGroups().map(headerGroup => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <TableHead
                        key={header.id}
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                      >
                        {header.isPlaceholder
                          ? null
                          : typeof header.column.columnDef.header === 'function'
                            ? header.column.columnDef.header(
                                header.getContext()
                              )
                            : header.column.columnDef.header}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {table.getRowModel().rows.map(row => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map(cell => (
                      <TableCell key={cell.id} className="px-5 py-4">
                        {typeof cell.column.columnDef.cell === 'function'
                          ? cell.column.columnDef.cell(cell.getContext())
                          : cell.getValue()}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Results info */}
      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <div>
          {table.getFilteredRowModel().rows.length === 0 ? (
            'No seasons found'
          ) : (
            <>
              Showing {table.getRowModel().rows.length} of{' '}
              {table.getFilteredRowModel().rows.length} season(s)
            </>
          )}
        </div>
      </div>
    </div>
  );
}
