import fs from 'fs';
import path from 'path';

export default function readFile (fileName) {
  return fs.readFileSync(path.join(__dirname, fileName));
}
