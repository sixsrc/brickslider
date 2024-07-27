import fs from 'fs';
import { join, dirname } from 'path';

const sourceFile = join(dirname(new URL(import.meta.url).pathname),  'dist', 'brick-slider.js');
const destinationDir = join(dirname(new URL(import.meta.url).pathname), 'lib');
const destinationFile = join(destinationDir, 'brick-slider.js');

try {
  const content = fs.readFileSync(sourceFile, 'utf-8');
  const header = `/*!
 * brick-slider.js
 * Version  : 0.0.0
 * License  : MIT
 * Copyright: ${new Date().getFullYear()} @malopestorres
 */
`;


  const newContent = header + content;

  fs.mkdirSync(destinationDir, { recursive: true });

  fs.writeFileSync(destinationFile, newContent);

  console.log(`File copied successfully from ${sourceFile} to ${destinationFile}`);
} catch (error) {
  console.error(`Error copying the file: ${error}`);
}
