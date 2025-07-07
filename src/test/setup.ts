import '@testing-library/jest-dom';
import { config } from 'dotenv';
import path from 'path';

// Load test environment variables
config({ path: path.resolve(process.cwd(), '.env.test') });
import { beforeAll, afterEach } from 'vitest';

// Setup for potential MSW integration in the future
// import { server } from './mocks/server';

// Setup MSW (when implemented in Phase 2)
// beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
// afterEach(() => server.resetHandlers());
// afterAll(() => server.close());

// Global test setup
beforeAll(() => {
  // Global setup for all tests
});

afterEach(() => {
  // Cleanup after each test
});
