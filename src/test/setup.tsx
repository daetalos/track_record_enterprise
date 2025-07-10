import '@testing-library/jest-dom';
import { config } from 'dotenv';
import path from 'path';
import { vi } from 'vitest';
import React from 'react';

// Load test environment variables
config({ path: path.resolve(process.cwd(), '.env.test') });
import { beforeAll, afterEach } from 'vitest';

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    pathname: '/test',
    searchParams: new URLSearchParams(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/test',
}));

// Mock icons
vi.mock('@/icons', () => ({
  EyeIcon: ({ className }: { className?: string }) => (
    <div data-testid="eye-icon" className={className} />
  ),
  PencilIcon: ({ className }: { className?: string }) => (
    <div data-testid="pencil-icon" className={className} />
  ),
  TrashBinIcon: ({ className }: { className?: string }) => (
    <div data-testid="trash-icon" className={className} />
  ),
  GroupIcon: ({ className }: { className?: string }) => (
    <div data-testid="group-icon" className={className} />
  ),
  EyeCloseIcon: ({ className }: { className?: string }) => (
    <div data-testid="eye-close-icon" className={className} />
  ),
  ChevronLeftIcon: ({ className }: { className?: string }) => (
    <div data-testid="chevron-left-icon" className={className} />
  ),
  ChevronDownIcon: ({ className }: { className?: string }) => (
    <div data-testid="chevron-down-icon" className={className} />
  ),
  CheckIcon: ({ className }: { className?: string }) => (
    <div data-testid="check-icon" className={className} />
  ),
  PlusIcon: ({ className }: { className?: string }) => (
    <div data-testid="plus-icon" className={className} />
  ),
}));

// Setup for potential MSW integration in the future
// import { server } from './mocks/server';

// Setup MSW (when implemented in Phase 2)
// beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
// afterEach(() => server.resetHandlers());
// afterAll(() => server.close());

// Global test setup
beforeAll(() => {
  // Mock ResizeObserver for Headless UI components
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));

  // Global setup for all tests
});

afterEach(() => {
  // Cleanup after each test
});
