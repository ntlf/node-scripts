import spawn from 'cross-spawn';
import path from 'path';
import { resolveBin, hasOneOfFiles, hasPackageProperty } from '../utils';

export default async function format(args) {
  const hasConfig =
    args.includes('--config') ||
    hasOneOfFiles([
      '.prettierrc',
      '.prettierrc.js',
      '.prettierrc.json',
      'prettier.config.js',
    ]) ||
    hasPackageProperty('prettier');

  const hasIgnore =
    args.includes('--ignore-path') || hasOneOfFiles(['.prettierignore']);

  const config = hasConfig
    ? []
    : ['--config', path.join(__dirname, '../config/prettierrc.js')];
  const ignore = hasIgnore
    ? []
    : ['--ignore-path', path.join(__dirname, '../config/prettierignore')];
  const target = args.length > 0 ? [...args] : ['**/*.+(js|json|ts|md)'];

  const bin = await resolveBin('prettier');
  const result = spawn.sync(bin, ['--write', ...config, ...ignore, ...target], {
    stdio: 'inherit',
  });

  process.exit(result.status);
}
