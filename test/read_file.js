import { readFileSync } from 'node:fs'
import { join } from 'node:path'


export default function readFile (fileName) {
  return readFileSync(join(__dirname, fileName))
}
