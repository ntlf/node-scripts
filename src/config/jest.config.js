import { defaults } from 'jest-config';
import path from 'path';
import { hasOneOfFiles, hasPackageProperty } from '../utils';

const hasBabelPresets =
  hasOneOfFiles(['.babelrc', '.babelrc.js', 'babel.config.js']) ||
  hasPackageProperty('babel');

const config = {
  ...defaults,
  transform: hasBabelPresets
    ? null
    : { '^.+\\.(js|ts)$': path.join(__dirname, './babel-transform') },
};

export default config;
