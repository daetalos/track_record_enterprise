import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Modern Web App Dashboard | Enterprise-Grade Application',
  description:
    'Enterprise-grade dashboard application built with Next.js 15, TypeScript, and Tailwind CSS',
};

export default function HomePage() {
  // Redirect to the main dashboard since this is the primary entry point
  redirect('/dashboard');
}
