import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const mode = process.argv.includes('--staged') ? 'staged' : 'all';

function run(command) {
  return execSync(command, { encoding: 'utf8' }).trim();
}

function getFiles() {
  if (mode === 'staged') {
    const output = run('git diff --cached --name-only --diff-filter=ACMR');
    return output ? output.split('\n').filter(Boolean) : [];
  }

  const output = run('git ls-files');
  return output ? output.split('\n').filter(Boolean) : [];
}

const files = getFiles();

if (files.length === 0) {
  console.log(`Secret scan (${mode}): no files to scan.`);
  process.exit(0);
}

const highSignalPatterns = [
  { name: 'Brevo SMTP key', regex: /xsmtpsib-[A-Za-z0-9-]{20,}/g },
  { name: 'AWS Access Key', regex: /\b(AKIA|ASIA)[0-9A-Z]{16}\b/g },
  { name: 'GitHub Token', regex: /\bghp_[A-Za-z0-9]{36}\b/g },
  { name: 'GitHub PAT', regex: /\bgithub_pat_[A-Za-z0-9_]{40,}\b/g },
  { name: 'OpenAI/Stripe-style key', regex: /\bsk-[A-Za-z0-9]{20,}\b/g },
  { name: 'Google API key', regex: /\bAIza[0-9A-Za-z_-]{35}\b/g },
  { name: 'Private key block', regex: /-----BEGIN (RSA|OPENSSH|EC|DSA|PGP) PRIVATE KEY-----/g },
];

const envSecretRegex = /^(SMTP_PASS|API_KEY|OPENAI_API_KEY|AWS_SECRET_ACCESS_KEY|GITHUB_TOKEN)=(.+)$/;
const envPlaceholderRegex = /(your_|example|changeme|<.+>)/i;

const findings = [];

for (const file of files) {
  if (file === '.env.example') continue;

  let content;
  try {
    content = readFileSync(resolve(process.cwd(), file), 'utf8');
  } catch {
    continue;
  }

  const lines = content.split(/\r?\n/);

  lines.forEach((line, index) => {
    for (const pattern of highSignalPatterns) {
      const matches = line.match(pattern.regex);
      if (matches) {
        findings.push({
          file,
          line: index + 1,
          type: pattern.name,
          value: matches[0],
        });
      }
    }

    if (file.includes('.env')) {
      const envMatch = line.match(envSecretRegex);
      if (envMatch) {
        const value = envMatch[2].trim();
        if (value && !envPlaceholderRegex.test(value)) {
          findings.push({
            file,
            line: index + 1,
            type: 'Environment secret variable',
            value: `${envMatch[1]}=<redacted>`,
          });
        }
      }
    }
  });
}

if (findings.length > 0) {
  console.error(`Secret scan (${mode}) failed. Potential sensitive values found:`);
  for (const finding of findings) {
    console.error(`- ${finding.file}:${finding.line} [${finding.type}] ${finding.value}`);
  }
  console.error('Remove or rotate these values before commit.');
  process.exit(1);
}

console.log(`Secret scan (${mode}) passed. No high-signal secrets detected.`);
