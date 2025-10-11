import '@testing-library/jest-dom';
import { expect, afterEach, vi, beforeAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import axios from 'axios';

// Mock axios globally
vi.mock('axios');

beforeAll(() => {
  // Default axios mock
  axios.get = vi.fn().mockResolvedValue({ data: {} });
  axios.post = vi.fn().mockResolvedValue({ data: {} });
  axios.put = vi.fn().mockResolvedValue({ data: {} });
  axios.delete = vi.fn().mockResolvedValue({ data: {} });
});

// Cleanup after each test
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() { return []; }
  unobserve() {}
};
