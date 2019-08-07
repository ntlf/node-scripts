import rimraf from 'rimraf';
import { fromRoot } from '../utils';

export default function clean() {
  rimraf.sync(fromRoot('dist'));
}
