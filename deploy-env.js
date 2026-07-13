const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Read and parse env files
const parseEnv = (filePath) => {
  if (!fs.existsSync(filePath)) return {};
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const vars = {};
  for (let line of lines) {
    line = line.trim();
    if (!line || line.startsWith('#')) continue;
    const idx = line.indexOf('=');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const val = line.slice(idx + 1).trim();
    // Strip optional surrounding quotes
    let cleanVal = val;
    if ((cleanVal.startsWith('"') && cleanVal.endsWith('"')) || (cleanVal.startsWith("'") && cleanVal.endsWith("'"))) {
      cleanVal = cleanVal.slice(1, -1);
    }
    vars[key] = cleanVal;
  }
  return vars;
};

const frontendEnv = parseEnv(path.join(__dirname, 'frontend', '.env'));
const backendEnv = parseEnv(path.join(__dirname, 'backend', '.env'));

// Merge variables
const envs = { ...frontendEnv, ...backendEnv };

// Remove variables Vercel manages automatically
delete envs['PORT'];

console.log('Detected environment variables to upload:');
Object.keys(envs).forEach(key => {
  console.log(` - ${key}`);
});

console.log('\nStarting Vercel environment upload...');
console.log('Make sure you have run "npx vercel link" first to link your local workspace to Vercel!\n');

const targets = ['production', 'preview', 'development'];

for (const [key, value] of Object.entries(envs)) {
  if (!value) continue;
  console.log(`\nAdding ${key}...`);
  for (const envName of targets) {
    try {
      console.log(` -> ${envName}...`);
      // Run Vercel CLI and feed the environment value directly via standard input (stdin)
      execSync(`npx vercel env add ${key} ${envName}`, {
        input: value,
        stdio: ['pipe', 'ignore', 'ignore'] // pipe input, ignore stdout/stderr logging to keep output clean
      });
    } catch (err) {
      console.error(` ❌ Failed to add ${key} in ${envName}`);
    }
  }
}

console.log('\nEnvironment variables upload complete!');
