import { neon } from '@neondatabase/serverless';

const databaseUrl = import.meta.env.VITE_NEON_DATABASE_URL || '';

export const isNeonConfigured = Boolean(databaseUrl && databaseUrl.startsWith('postgres'));

export const sql = isNeonConfigured ? neon(databaseUrl) : null;
