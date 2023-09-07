import pkg from 'fs-extra';
import { join, dirname } from 'path';

const sourceFile = join(dirname(new URL(import.meta.url).pathname),  'dist', 'brick-slider.js');
const destinationDir = join(dirname(new URL(import.meta.url).pathname), 'lib');
const destinationFile = join(destinationDir, 'brick-slider.js');
const { ensureDirSync, copyFileSync } = pkg;

try {
  ensureDirSync(destinationDir);
  copyFileSync(sourceFile, destinationFile);
  console.log(`File copied successfully from ${sourceFile} to ${destinationFile}`);
} catch (error) {
  console.error(`Error copying the file: ${error}`);
}
