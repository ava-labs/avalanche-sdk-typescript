import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const rootDir = path.resolve(__dirname, '..');
const packageJsonPath = path.resolve(rootDir, 'package.json');
const commonTsPath = path.resolve(rootDir, 'src/clients/common.ts');

// Read version from package.json
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
const newVersion = packageJson.version;

// Read and update common.ts
let commonTsContent = fs.readFileSync(commonTsPath, 'utf-8');

// Regex to find and replace version in commonHeaders
const versionHeaderKey = 'version';
const versionRegex = new RegExp(`(${versionHeaderKey}\\s*:\\s*['"])v?\\d+\\.\\d+\\.\\d+(['"])`);

if (!versionRegex.test(commonTsContent)) {
  console.error(`Could not find ${versionHeaderKey} in common.ts`);
  process.exit(1);
}

const updatedContent = commonTsContent.replace(versionRegex, `$1${newVersion}$2`);

// Write updated content back
fs.writeFileSync(commonTsPath, updatedContent, 'utf-8');

console.log(`Updated ${versionHeaderKey} to version ${newVersion} in common.ts`);
