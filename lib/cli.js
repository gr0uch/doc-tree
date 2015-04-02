import docchi from './';
import fs from 'fs';
import path from 'path';
import parseArgs from 'minimist';
import mkdirp from 'mkdirp';


const newLine = '\n';
const usageText = `
  Usage: docchi <input> [options]

  Options:

    -o, --out-file <file>     Output to a file. Input must be a file.

  Input JavaScript source file, output JSDoc comments attached to their code
  contexts in JSON format. Use programmatically in Node.js if the defaults are
  not sufficient.
`;


export default (args = process.argv.slice(2)) =>
  new Promise((resolve, reject) => {
    args = parseArgs(args);

    let input = args._[0];

    if (!input)
      return reject(usageText);

    let outputFile = args.o || args['out-file'];

    // Assume that input is a file.
    let inputBuffer = fs.readFileSync(input);
    let output = JSON.stringify(
      docchi.parse(inputBuffer).output(), null, 2);

    if (outputFile) {
      mkdirp(path.dirname(outputFile));
      fs.writeFileSync(outputFile, output + newLine);
      return resolve();
    }

    return resolve(output);
  });

