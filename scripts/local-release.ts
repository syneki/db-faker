import { execSync } from 'child_process';
import publish from '@lerna/publish';
import { existsSync } from 'fs';

function hideFromGitIndex(uncommittedFiles: string[]) {
  execSync(`git update-index --assume-unchanged ${uncommittedFiles.join(' ')}`);

  return () =>
    execSync(
      `git update-index --no-assume-unchanged ${uncommittedFiles.join(' ')}`
    );
}

async function main() {
  const registry = getRegistry();
  const registryIsLocalhost = registry.hostname === 'localhost';

  if (!registryIsLocalhost) {
    throw new Error(
      'Registry is not set to localhost ! Run yarn local-registry enable'
    );
  }

  /**
   * Clear local registry
   */
  execSync('yarn local-registry clear');

  /**
   * Hide changes from Lerna
   */
  const uncommittedFiles = execSync('git diff --name-only --relative HEAD .')
    .toString()
    .split('\n')
    .filter((i) => i.length > 0)
    .filter((f) => existsSync(f));
  const unhideFromGitIndex = hideFromGitIndex(uncommittedFiles);

  process.on('exit', unhideFromGitIndex);
  process.on('SIGTERM', unhideFromGitIndex);

  const buildCommand = 'yarn build';
  console.log(`> ${buildCommand}`);
  execSync(buildCommand, {
    stdio: [0, 1, 2],
  });

  publish({
    bump: 'from-package',
    conventionalCommits: false,
    gitTagVersion: false,
    logLevel: 'error',
  });
}

function getRegistry() {
  return new URL(execSync('npm config get registry').toString().trim());
}

main();
