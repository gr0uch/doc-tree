import docchi from './'
import fs from 'fs'
import path from 'path'
import parseArgs from 'minimist'
import mkdirp from 'mkdirp'
import pkg from '../../package.json'


const newLine = '\n'
const usageText = `
  Usage: docchi < <input> > <output>
  Usage: docchi <input> [options]

  Options:

    -o, --out-file <file>     Output to a file. Input must be a file.
    -h, --help                Show this message.
    -v, --version             Print the version number.

  Input JavaScript source file, output JSDoc comments attached to their code
  contexts in JSON format. Use programmatically in Node.js if the defaults are
  not sufficient.
`


export default (args = process.argv.slice(2)) =>
  new Promise(resolve => {
    args = parseArgs(args)

    let version = args.v || args.version

    if (version)
      return resolve(`v${pkg.version}`)

    let help = args.h || args.help

    if (help) return resolve(usageText)

    let input = args._[0]

    if (!input) {
      const chunks = []

      process.stdin.on('readable', () => {
        const chunk = process.stdin.read()
        if (chunk !== null) chunks.push(chunk)
      })

      process.stdin.on('end', () => resolve(JSON.stringify(
        docchi.parse(Buffer.concat(chunks)).output(), null, 2)))

      return null
    }

    let outputFile = args.o || args['out-file']

    // Assume that input is a file.
    let inputBuffer = fs.readFileSync(input)
    let output = JSON.stringify(
      docchi.parse(inputBuffer).output(), null, 2)

    if (outputFile) {
      mkdirp(path.dirname(outputFile))
      fs.writeFileSync(outputFile, output + newLine)
      return resolve()
    }

    return resolve(output)
  })
