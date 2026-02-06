import { spawnSync } from 'node:child_process';

const mode = (process.argv[2] || 'dev').toLowerCase();

const commands = {
  dev: ['npx', ['nx', 'run', 'frontend:storybook']],
  build: ['npx', ['nx', 'run', 'frontend:build-storybook']],
  serve: ['npx', ['nx', 'run', 'frontend:storybook-static']],
  test: ['npx', ['nx', 'test', 'frontend']],
  'test:jest': ['npx', ['nx', 'test:jest', 'frontend']],
};

if (!commands[mode]) {
  console.error('Usage: npm run storybook -- <dev|build|serve|test|test:jest>');
  process.exit(1);
}

const [bin, args] = commands[mode];
const result = spawnSync(bin, args, { stdio: 'inherit', shell: true });
process.exit(result.status ?? 1);
