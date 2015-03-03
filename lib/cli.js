import Docchi from './';


let chunks = [];

process.stdin.on('readable', () => {
  let chunk = process.stdin.read();

  if (chunk)
    chunks.push(chunk);
});

process.stdin.on('end', () => {
  let inputBuffer = Buffer.concat(chunks);
  let doc = new Docchi(inputBuffer);
  let output = doc.output();

  process.stdout.write(JSON.stringify(output, null, 2) + '\n');
});
