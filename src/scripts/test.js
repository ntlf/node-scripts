import jest from 'jest';

export default function test(args) {
  jest.run(['src', ...args]);
}
