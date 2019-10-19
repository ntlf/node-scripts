import spawn from 'cross-spawn';
import path from 'path';
import {
  resolveBin,
  hasOneOfFiles,
  hasPackageProperty,
  loadEnvironmentFile,
} from '../utils';

export default async function run(args) {
  loadEnvironmentFile();

  const hasPresets =
    args.includes('--presets') ||
    hasOneOfFiles(['.babelrc', '.babelrc.js', 'babel.config.js']) ||
    hasPackageProperty('babel');

  const babelExtensions = ['--extensions', '.js,.ts'];
  const presets = hasPresets
    ? []
    : ['--presets', path.join(__dirname, '../config/babelrc.js')];

  const bin = await resolveBin('@babel/node', { executable: 'babel-node' });
  const result = spawn.sync(bin, [...babelExtensions, ...presets, ...args], {
    stdio: 'inherit',
  });

  process.exit(result.status);
}
