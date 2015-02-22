import Docchi from './';

let chunks = [];

process.stdin.on('readable', () => {
  let chunk = process.stdin.read();

  if (!!chunk) {
    chunks.push(chunk);
  }
});

process.stdin.on('end', () => {
  let inputBuffer = Buffer.concat(chunks);
  let output;
  let doc;

  try {
    doc = new Docchi(inputBuffer);
    output = doc.output();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }

  process.stdout.write(JSON.stringify(output, null, 2));
  process.exit(0);
});
