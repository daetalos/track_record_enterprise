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
import type { Discipline } from '@/types/discipline';
import type { Season } from '@/types/season';

interface DisciplineListProps {
  disciplines: Discipline[];
  seasons: Season[];
  isLoading: boolean;
  onEdit: (discipline: Discipline) => void;
  onRefresh: () => void;
  selectedSeasonId?: string | null;
  onSeasonFilter: (seasonId: string | null) => void;
}

const columnHelper = createColumnHelper<Discipline>();

export default function DisciplineList({
  disciplines,
  seasons,
  isLoading,
  onEdit,
  onRefresh,
  selectedSeasonId,
  onSeasonFilter,
}: DisciplineListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  // Handle discipline deletion
  const handleDelete = useCallback(
    async (discipline: Discipline) => {
      if (!confirm(`Are you sure you want to delete "${discipline.name}"?`)) {
        return;
      }

      setDeletingId(discipline.id);

      try {
        const response = await fetch(`/api/disciplines/${discipline.id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to delete discipline');
        }

        // Refresh the list after successful deletion
        onRefresh();
      } catch (error) {
        console.error('Error deleting discipline:', error);
        alert(
          error instanceof Error ? error.message : 'Failed to delete discipline'
        );
      } finally {
        setDeletingId(null);
      }
    },
    [onRefresh]
  );

  // Handle season filter change
  const handleSeasonFilterChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      onSeasonFilter(value === '' ? null : value);
    },
    [onSeasonFilter]
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
      columnHelper.accessor('season.name', {
        id: 'season',
        header: ({ column }) => (
          <button
            className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Season
            {column.getIsSorted() === 'asc' ? (
              <ChevronUpIcon className="w-4 h-4" />
            ) : column.getIsSorted() === 'desc' ? (
              <ChevronDownIcon className="w-4 h-4" />
            ) : null}
          </button>
        ),
        cell: ({ getValue }) => (
          <span className="text-gray-600 text-theme-sm dark:text-gray-300">
            {getValue() || 'Unknown Season'}
          </span>
        ),
      }),
      columnHelper.accessor(
        row =>
          row.isTimed ? 'Timed' : row.isMeasured ? 'Measured' : 'Unknown',
        {
          id: 'type',
          header: 'Type',
          cell: ({ getValue, row }) => {
            const type = getValue();
            const bgColor =
              type === 'Timed'
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                : type === 'Measured'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';

            return (
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${bgColor}`}
              >
                {type}
                {row.original.teamSize && (
                  <span className="ml-1 text-xs opacity-75">
                    (Team: {row.original.teamSize})
                  </span>
                )}
              </span>
            );
          },
        }
      ),
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
        cell: ({ getValue }) => {
          const date = getValue() as Date;
          return (
            <span className="text-gray-500 text-theme-sm dark:text-gray-400">
              {new Date(date).toLocaleDateString()}
            </span>
          );
        },
      }),
      columnHelper.display({
        id: 'actions',
        header: () => <span className="text-end">Actions</span>,
        cell: ({ row }) => {
          const discipline = row.original;
          return (
            <div className="flex items-center justify-end gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEdit(discipline)}
                startIcon={<PencilIcon className="w-4 h-4" />}
              >
                Edit
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDelete(discipline)}
                disabled={deletingId === discipline.id}
                startIcon={
                  deletingId === discipline.id ? (
                    <div className="w-4 h-4 border border-gray-300 rounded-full animate-spin border-t-transparent" />
                  ) : (
                    <TrashBinIcon className="w-4 h-4" />
                  )
                }
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
              >
                {deletingId === discipline.id ? 'Deleting...' : 'Delete'}
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
    data: disciplines,
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
          Loading disciplines...
        </div>
      </div>
    );
  }

  // Empty state
  if (disciplines.length === 0 && !selectedSeasonId) {
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
          No Disciplines
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          Get started by creating your first discipline.
        </p>
      </div>
    );
  }

  // Filtered empty state
  if (disciplines.length === 0 && selectedSeasonId) {
    const selectedSeason = seasons.find(s => s.id === selectedSeasonId);
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
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 13l6 6"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No Disciplines in {selectedSeason?.name || 'Selected Season'}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          This season doesn&apos;t have any disciplines yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1 max-w-sm">
          <Input
            placeholder="Search disciplines..."
            value={globalFilter ?? ''}
            onChange={e => setGlobalFilter(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="min-w-[200px]">
          <select
            value={selectedSeasonId || ''}
            onChange={handleSeasonFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400"
          >
            <option value="">All Seasons</option>
            {seasons.map(season => (
              <option key={season.id} value={season.id}>
                {season.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[800px]">
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
            'No disciplines found'
          ) : (
            <>
              Showing {table.getRowModel().rows.length} of{' '}
              {table.getFilteredRowModel().rows.length} discipline(s)
              {selectedSeasonId && (
                <span className="ml-2">
                  in {seasons.find(s => s.id === selectedSeasonId)?.name}
                </span>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
