export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'q348evxi';

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage);
  }
  return v;
}

assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || projectId,
  'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID'
);