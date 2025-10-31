import { JSDOM } from 'jsdom';
import * as React from 'react';

// Setup fake Supabase credentials for tests
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://fake-test-project.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZha2UiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYwOTQ1OTIwMCwiZXhwIjoxOTI1MDM1MjAwfQ.fake-key-for-testing';

// Make React available globally for JSX transform
(global as any).React = React;

// Setup DOM environment for testing React components
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost',
  pretendToBeVisual: true,
});

Object.defineProperty(global, 'window', {
  value: dom.window,
  writable: true,
  configurable: true,
});

Object.defineProperty(global, 'document', {
  value: dom.window.document,
  writable: true,
  configurable: true,
});

Object.defineProperty(global, 'navigator', {
  value: dom.window.navigator,
  writable: true,
  configurable: true,
});

// Suppress React warnings in tests
const originalError = console.error;
console.error = (...args: unknown[]) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('Warning: ReactDOM.render') ||
      args[0].includes('Not implemented: HTMLFormElement.prototype.submit') ||
      args[0].includes('Could not auto-refresh'))
  ) {
    return;
  }
  originalError.call(console, ...args);
};
