import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import process from 'node:process';

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

    const value = line.substring(line.indexOf('=') + 1).trim();
    if (!value) return undefined;

    return value.replace(/^['"]|['"]$/g, '');
  } catch {
    return undefined;
  }
}

const databaseUrl = await resolveDatabaseUrl();

if (!databaseUrl) {
  console.error('DATABASE_URL is not set. Add it to .env.local or export it in your shell.');
  process.exit(1);
}

process.stdout.write(databaseUrl);
