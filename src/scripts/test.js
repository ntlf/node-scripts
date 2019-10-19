import jest from 'jest';
import jestConfig from '../config/jest.config';
import {
  hasOneOfFiles,
  hasPackageProperty,
  loadEnvironmentFile,
} from '../utils';

export default function test(args) {
  process.env.BABEL_ENV = 'test';
  process.env.NODE_ENV = 'test';

  loadEnvironmentFile();

  const hasConfig =
    args.includes('--config') ||
    hasOneOfFiles(['jest.config.js']) ||
    hasPackageProperty('jest');

  const config = hasConfig
    ? []
    : ['--config', JSON.stringify({ ...jestConfig, rootDir: undefined })];

  jest.run(['src', ...config, ...args]);
}
