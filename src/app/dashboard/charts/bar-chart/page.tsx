import BarChartOne from '@/components/charts/bar/BarChartOne';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Bar Chart | Dashboard - Modern Web App',
  description:
    'Interactive bar chart component for data visualization and analytics',
};

export default function BarChartPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Bar Chart" />
      <div className="space-y-6">
        <ComponentCard title="Bar Chart Analytics">
          <BarChartOne />
        </ComponentCard>
      </div>
    </div>
  );
}
