/**
 * Presentation Runner: Starts both Backend and Frontend concurrently
 * Single-command execution for presenting to team leads and stakeholders.
 */

const { spawn } = require('child_process');
const path = require('path');

const rootDir = __dirname;
const backendDir = path.join(rootDir, 'backend');
const frontendDir = path.join(rootDir, 'frontend');

console.log('================================================================');
console.log('🚀 Launching Thematic Social Copy-Trading Platform');
console.log('================================================================');

// 1. Start Backend API
console.log('[Backend] Starting Express API Server on http://localhost:5000...');
const backend = spawn('node', ['src/standalone-server.js'], {
  cwd: backendDir,
  shell: true,
  stdio: 'inherit',
});

// 2. Start Frontend Next.js Dev Server
console.log('[Frontend] Starting Next.js Dev Server on http://localhost:3000...');
const frontend = spawn('npm', ['run', 'dev'], {
  cwd: frontendDir,
  shell: true,
  stdio: 'inherit',
});

// Handle graceful shutdown
function cleanExit() {
  console.log('\n[Shutdown] Stopping servers gracefully...');
  backend.kill('SIGINT');
  frontend.kill('SIGINT');
  process.exit(0);
}

process.on('SIGINT', cleanExit);
process.on('SIGTERM', cleanExit);
