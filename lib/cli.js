'use strict'

const docchi = require('./')
const fs = require('fs')
const path = require('path')
const parseArgs = require('minimist')
const mkdirp = require('mkdirp')
const pkg = require('../package.json')


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


module.exports = args => new Promise(resolve => {
  if (args === void 0) args = process.argv.slice(2)

  args = parseArgs(args)

  const version = args.v || args.version

  if (version)
    return resolve(`v${pkg.version}`)

  const help = args.h || args.help

  if (help) return resolve(usageText)

  const input = args._[0]

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

  const outputFile = args.o || args['out-file']

  // Assume that input is a file.
  const inputBuffer = fs.readFileSync(input)
  const output = JSON.stringify(
    docchi.parse(inputBuffer).output(), null, 2)

  if (outputFile) {
    mkdirp(path.dirname(outputFile))
    fs.writeFileSync(outputFile, `${output}\n`)
    return resolve()
  }

  return resolve(output)
})
