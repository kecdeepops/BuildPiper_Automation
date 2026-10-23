
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const args = process.argv.slice(2);
const clean = args[0] === '--clean';

if (clean) {
  args.shift();

  for (const dir of ['allure-results', 'allure-report']) {
    fs.rmSync(path.resolve(dir), {
      recursive: true,
      force: true
    });
  }
}

const allureCommand = path.resolve(
  'node_modules',
  '.bin',
  process.platform === 'win32' ? 'allure.cmd' : 'allure'
);

function runNode(commandArgs) {
  const result = spawnSync(process.execPath, commandArgs, {
    stdio: 'inherit',
    shell: false
  });

  if (result.error) {
    console.error(result.error.message);
    return 1;
  }

  return result.status ?? 1;
}

function runAllure(commandArgs) {
  if (!fs.existsSync(allureCommand)) {
    console.error(`Allure executable not found: ${allureCommand}`);
    return 1;
  }

  const result = spawnSync(allureCommand, commandArgs, {
    stdio: 'inherit',
    shell: process.platform === 'win32'
  });

  if (result.error) {
    console.error(result.error.message);
    return 1;
  }

  return result.status ?? 1;
}

// 1. Execute Playwright tests.
const testExitCode = runNode([
  require.resolve('@playwright/test/cli'),
  'test',
  ...args
]);

// 2. Generate the report even when tests fail.
const reportExitCode = runAllure([
  'generate',
  'allure-results',
  '--clean',
  '-o',
  'allure-report'
]);

// 3. Open the report if generation succeeds.
if (reportExitCode === 0) {
  runAllure(['open', 'allure-report']);
} else {
  console.error('Allure report generation failed.');
}

// 4. Preserve the test failure exit code for CI/CD.
process.exitCode =
  testExitCode !== 0 ? testExitCode : reportExitCode;
