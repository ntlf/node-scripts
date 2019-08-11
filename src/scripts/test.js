import jest from 'jest';
import jestConfig from '../config/jest.config';
import { hasOneOfFiles, hasPackageProperty } from '../utils';

export default function test(args) {
  const hasConfig =
    args.includes('--config') ||
    hasOneOfFiles(['jest.config.js']) ||
    hasPackageProperty('jest');

  const config = hasConfig
    ? []
    : ['--config', JSON.stringify({ ...jestConfig, rootDir: undefined })];

  jest.run(['src', ...config, ...args]);
}
