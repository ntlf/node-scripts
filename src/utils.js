import path from 'path';
import fs from 'fs';
import readPkgUp from 'read-pkg-up';
import which from 'which';
import dotenv from 'dotenv';

const { packageJson: pkg, path: pkgPath } = readPkgUp.sync({
  cwd: fs.realpathSync(process.cwd()),
});

export function fromRoot(...p) {
  return path.join(path.dirname(pkgPath), ...p);
}

export async function resolveBin(
  moduleName,
  { executable = moduleName, cwd = process.cwd() } = {}
) {
  let whichPath = which.sync(executable, { nothrow: true });

  if (typeof whichPath === 'string') {
    whichPath = fs.realpathSync(whichPath);
  }

  try {
    const modPkgPath = require.resolve(`${moduleName}/package.json`);
    const modPkgDir = path.dirname(modPkgPath);
    const { bin } = await import(`${modPkgPath}`);
    const binPath = typeof bin === 'string' ? bin : bin[executable];
    const fullPathToBin = path.join(modPkgDir, binPath);
    if (fullPathToBin === whichPath) {
      return executable;
    }
    return fullPathToBin.replace(cwd, '.');
  } catch (error) {
    if (whichPath) {
      return executable;
    }
    throw error;
  }
}

export function hasFile(fileName) {
  return fs.existsSync(fromRoot(fileName));
}

export function hasOneOfFiles(fileNames) {
  return fileNames.some(fileName => hasFile(fileName));
}

export function hasPackageProperty(attribute) {
  return Object.keys(pkg).includes(attribute);
}

export function loadEnvironmentFile() {
  dotenv.config();
}
