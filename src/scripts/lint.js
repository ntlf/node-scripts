import spawn from 'cross-spawn';
import path from 'path';
import { resolveBin, hasOneOfFiles, hasPackageProperty } from '../utils';

async function eslint(args) {
  const hasConfig =
    args.includes('--config') ||
    hasOneOfFiles(['.eslintrc', '.eslintrc.js', '.eslintrc.json']) ||
    hasPackageProperty('eslintConfig');

  const hasIgnore =
    args.includes('--ignore-path') ||
    hasOneOfFiles(['.eslintignore']) ||
    hasPackageProperty('eslintIgnore');

  const config = hasConfig
    ? []
    : ['--config', path.join(__dirname, '../config/eslintrc.js')];
  const ignore = hasIgnore
    ? []
    : ['--ignore-path', path.join(__dirname, '../config/.eslintignore')];
  const extensions = ['--ext', '.js,.ts'];
  const target = args.length > 0 ? [...args] : ['.'];

  const bin = await resolveBin('eslint');
  const result = spawn.sync(
    bin,
    [...config, ...ignore, ...extensions, ...target],
    {
      stdio: 'inherit',
    }
  );

  return result;
}

async function typeCheck(args) {
  const target = args.length > 0 ? [...args] : [];

  const bin = await resolveBin('typescript', { executable: 'tsc' });
  const result = spawn.sync(
    bin,
    [
      '--skipLibCheck',
      '--noEmit',
      ...target.filter(t => ['.ts', '.d.ts'].includes(t)),
    ],
    {
      stdio: 'inherit',
    }
  );

  return result;
}

export default async function lint(args) {
  const resultEslint = await eslint(args);
  const resultTypeCheck = await typeCheck(args);

  const statusCode = resultEslint.status || resultTypeCheck.status ? 1 : 0;

  process.exit(statusCode);
}
