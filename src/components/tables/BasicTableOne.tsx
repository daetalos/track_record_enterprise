'use client';

import React, { useState, useMemo } from 'react';
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
import Badge from '../ui/badge/Badge';
import Image from 'next/image';

interface Order {
  id: number;
  user: {
    image: string;
    name: string;
    role: string;
  };
  projectName: string;
  team: {
    images: string[];
  };
  status: string;
  budget: string;
}

// Define the table data using the interface
const tableData: Order[] = [
  {
    id: 1,
    user: {
      image: '/images/user/user-17.jpg',
      name: 'Lindsey Curtis',
      role: 'Web Designer',
    },
    projectName: 'Agency Website',
    team: {
      images: [
        '/images/user/user-22.jpg',
        '/images/user/user-23.jpg',
        '/images/user/user-24.jpg',
      ],
    },
    budget: '3.9K',
    status: 'Active',
  },
  {
    id: 2,
    user: {
      image: '/images/user/user-18.jpg',
      name: 'Kaiya George',
      role: 'Project Manager',
    },
    projectName: 'Technology',
    team: {
      images: ['/images/user/user-25.jpg', '/images/user/user-26.jpg'],
    },
    budget: '24.9K',
    status: 'Pending',
  },
  {
    id: 3,
    user: {
      image: '/images/user/user-17.jpg',
      name: 'Zain Geidt',
      role: 'Content Writing',
    },
    projectName: 'Blog Writing',
    team: {
      images: ['/images/user/user-27.jpg'],
    },
    budget: '12.7K',
    status: 'Active',
  },
  {
    id: 4,
    user: {
      image: '/images/user/user-20.jpg',
      name: 'Abram Schleifer',
      role: 'Digital Marketer',
    },
    projectName: 'Social Media',
    team: {
      images: [
        '/images/user/user-28.jpg',
        '/images/user/user-29.jpg',
        '/images/user/user-30.jpg',
      ],
    },
    budget: '2.8K',
    status: 'Cancel',
  },
  {
    id: 5,
    user: {
      image: '/images/user/user-21.jpg',
      name: 'Carla George',
      role: 'Front-end Developer',
    },
    projectName: 'Website',
    team: {
      images: [
        '/images/user/user-31.jpg',
        '/images/user/user-32.jpg',
        '/images/user/user-33.jpg',
      ],
    },
    budget: '4.5K',
    status: 'Active',
  },
];

const columnHelper = createColumnHelper<Order>();

export default function BasicTableOne() {
  // TanStack Table state
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  // Define table columns
  const columns = useMemo(
    () => [
      columnHelper.accessor('user.name', {
        id: 'user',
        header: 'User',
        cell: ({ row }) => {
          const user = row.original.user;
          return (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 overflow-hidden rounded-full">
                <Image
                  width={40}
                  height={40}
                  src={user.image}
                  alt={user.name}
                />
              </div>
              <div>
                <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                  {user.name}
                </span>
                <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                  {user.role}
                </span>
              </div>
            </div>
          );
        },
      }),
      columnHelper.accessor('projectName', {
        id: 'projectName',
        header: 'Project Name',
        cell: ({ getValue }) => (
          <span className="text-gray-500 text-theme-sm dark:text-gray-400">
            {getValue()}
          </span>
        ),
      }),
      columnHelper.accessor('team.images', {
        id: 'team',
        header: 'Team',
        enableSorting: false,
        cell: ({ getValue }) => {
          const images = getValue();
          return (
            <div className="flex -space-x-2">
              {images.map((teamImage, index) => (
                <div
                  key={index}
                  className="w-6 h-6 overflow-hidden border-2 border-white rounded-full dark:border-gray-900"
                >
                  <Image
                    width={24}
                    height={24}
                    src={teamImage}
                    alt={`Team member ${index + 1}`}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          );
        },
      }),
      columnHelper.accessor('status', {
        id: 'status',
        header: 'Status',
        cell: ({ getValue }) => {
          const status = getValue();
          return (
            <Badge
              size="sm"
              color={
                status === 'Active'
                  ? 'success'
                  : status === 'Pending'
                    ? 'warning'
                    : 'error'
              }
            >
              {status}
            </Badge>
          );
        },
      }),
      columnHelper.accessor('budget', {
        id: 'budget',
        header: 'Budget',
        cell: ({ getValue }) => (
          <span className="text-gray-500 text-theme-sm dark:text-gray-400">
            {getValue()}
          </span>
        ),
      }),
    ],
    []
  );

  // Create table instance
  const table = useReactTable({
    data: tableData,
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

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
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
                          ? header.column.columnDef.header(header.getContext())
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
                    <TableCell
                      key={cell.id}
                      className="px-5 py-4 sm:px-6 text-start"
                    >
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
  );
}
