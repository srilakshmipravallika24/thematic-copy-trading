const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'src');
let allPassed = true;

function checkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      checkDir(fullPath);
    } else if (entry.name.endsWith('.js')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split('\n');
      for (const line of lines) {
        const match = line.match(/from\s+['"](\.\.?\/[^'"]+)['"]/);
        if (match) {
          const importPath = match[1];
          const resolved = path.resolve(path.dirname(fullPath), importPath);
          const exists =
            fs.existsSync(resolved) ||
            fs.existsSync(resolved + '.js') ||
            fs.existsSync(resolved + '.css') ||
            fs.existsSync(resolved + '/index.js');
          
          const relFile = path.relative(__dirname, fullPath);
          if (exists) {
            console.log(`[PASS] ${relFile} -> ${importPath}`);
          } else {
            console.error(`[FAIL] ${relFile} -> ${importPath} (UNRESOLVED)`);
            allPassed = false;
          }
        }
      }
    }
  }
}

console.log('--- Verifying Frontend Relative Imports ---');
checkDir(baseDir);
console.log('Result:', allPassed ? 'ALL RELATIVE IMPORTS RESOLVED SUCCESSFULLY!' : 'SOME IMPORTS FAILED');
process.exit(allPassed ? 0 : 1);
