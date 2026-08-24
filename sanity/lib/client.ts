import { createClient } from 'next-sanity';

export const client = createClient({
  projectId: 'q348evxi',
  dataset: 'production',
  apiVersion: '2026-01-01',
  useCdn: false,
});