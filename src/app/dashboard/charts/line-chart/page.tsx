import LineChartOne from '@/components/charts/line/LineChartOne';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Line Chart | Dashboard - Modern Web App',
  description:
    'Interactive line chart component for trend analysis and data visualization',
};

export default function LineChartPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Line Chart" />
      <div className="space-y-6">
        <ComponentCard title="Line Chart Analytics">
          <LineChartOne />
        </ComponentCard>
      </div>
    </div>
  );
}
