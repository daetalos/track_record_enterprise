import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { AthleteList } from '@/components/athlete';

export const metadata: Metadata = {
  title: 'Athletes | Track Record Enterprise',
  description: 'Manage athletes and view athlete roster',
};

export default function AthletesPage() {
  return (
    <div className="mx-auto max-w-7xl">
      {/* Header with title and add button */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Athletes
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage your club&apos;s athlete roster
          </p>
        </div>
        <Link
          href="/athletes/new"
          className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          Add Athlete
        </Link>
      </div>

      {/* Athlete list component */}
      <AthleteList />
    </div>
  );
}
