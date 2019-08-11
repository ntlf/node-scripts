import { createTransformer } from 'babel-jest';

// eslint-disable-next-line import/prefer-default-export
export const { process } = createTransformer({
  presets: [require.resolve('./babelrc.js')],
});
