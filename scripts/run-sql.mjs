import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import process from 'node:process';
import { Client } from 'pg';

const sqlFile = process.argv[2];

async function resolveDatabaseUrl() {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  try {
    const envLocalPath = resolve(process.cwd(), '.env.local');
    const envText = await readFile(envLocalPath, 'utf8');
    const line = envText
      .split(/\r?\n/)
      .find((entry) => entry.trim().startsWith('DATABASE_URL='));

    if (!line) return undefined;

    const value = line.split('=')[1]?.trim();
    if (!value) return undefined;

    return value.replace(/^['"]|['"]$/g, '');
  } catch {
    return undefined;
  }
}

if (!sqlFile) {
  console.error('Usage: node scripts/run-sql.mjs <sql-file>');
  process.exit(1);
}

const databaseUrl = await resolveDatabaseUrl();

if (!databaseUrl) {
  console.error('DATABASE_URL is not set. Export it or add it before running db scripts.');
  process.exit(1);
}

const filePath = resolve(process.cwd(), sqlFile);
const sql = await readFile(filePath, 'utf8');

const client = new Client({ connectionString: databaseUrl });

try {
  await client.connect();
  await client.query(sql);
  console.log(`Executed SQL file: ${sqlFile}`);
} catch (error) {
  console.error('Failed to execute SQL file:', error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  await client.end();
}
