import spawn from 'cross-spawn';
import path from 'path';
import {
  resolveBin,
  hasOneOfFiles,
  hasPackageProperty,
  loadEnvironmentFile,
} from '../utils';
import clean from './clean';

export default async function build(args) {
  process.env.BABEL_ENV = 'production';
  process.env.NODE_ENV = 'production';

  loadEnvironmentFile();

  const hasPresets =
    args.includes('--presets') ||
    hasOneOfFiles(['.babelrc', '.babelrc.js', 'babel.config.js']) ||
    hasPackageProperty('babel');

  const outDir = ['--out-dir', 'dist'];
  const copyFiles = ['--copy-files'];
  const extensions = ['--extensions', '.js,.ts'];
  const presets = hasPresets
    ? []
    : ['--presets', path.join(__dirname, '../config/babelrc.js')];

  clean();

  const bin = await resolveBin('@babel/cli', { executable: 'babel' });
  const result = spawn.sync(
    bin,
    [...outDir, ...copyFiles, ...extensions, ...presets, 'src', ...args],
    { stdio: 'inherit' }
  );

  process.exit(result.status);
}
