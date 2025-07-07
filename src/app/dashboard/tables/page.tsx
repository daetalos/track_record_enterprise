import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import BasicTableOne from '@/components/tables/BasicTableOne';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Tables | Dashboard - Modern Web App',
  description:
    'Data tables with sorting, filtering, and pagination capabilities',
};

export default function TablesPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Data Tables" />
      <div className="space-y-6">
        <ComponentCard title="Basic Data Table">
          <BasicTableOne />
        </ComponentCard>
      </div>
    </div>
  );
}
