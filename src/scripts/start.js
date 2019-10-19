import spawn from 'cross-spawn';
import path from 'path';
import {
  resolveBin,
  hasOneOfFiles,
  hasPackageProperty,
  loadEnvironmentFile,
} from '../utils';

export default async function start(args) {
  process.env.BABEL_ENV = 'development';
  process.env.NODE_ENV = 'development';

  loadEnvironmentFile();

  const hasPresets =
    args.includes('--presets') ||
    hasOneOfFiles(['.babelrc', '.babelrc.js', 'babel.config.js']) ||
    hasPackageProperty('babel');

  const watch = ['-w', 'src'];
  const extensions = ['-e', '.*'];

  const babelExtensions = ['--extensions', '.js,.ts'];
  const presets = hasPresets
    ? []
    : ['--presets', path.join(__dirname, '../config/babelrc.js')];

  const exec = ['--exec', 'babel-node', ...babelExtensions, ...presets];

  const bin = await resolveBin('nodemon', { executable: 'nodemon' });
  const result = spawn.sync(
    bin,
    [...watch, ...extensions, ...exec, 'src', ...args],
    { stdio: 'inherit' }
  );

  process.exit(result.status);
}
