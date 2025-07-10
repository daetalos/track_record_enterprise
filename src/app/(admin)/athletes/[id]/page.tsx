'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { AthleteProfile } from '@/components/athlete';

export default function AthleteDetailPage() {
  const params = useParams();
  const athleteId = params.id as string;

  return (
    <div>
      <PageBreadcrumb pageTitle="Athlete Profile" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Athlete Details
        </h3>
        <div className="space-y-6">
          <AthleteProfile athleteId={athleteId} />
        </div>
      </div>
    </div>
  );
}
