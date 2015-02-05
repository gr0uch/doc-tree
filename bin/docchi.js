#!/usr/bin/env node

var Docchi = require('../');
var chunks = [];
var doc;

process.stdin.on('readable', function () {
  var chunk = process.stdin.read();

  if (!!chunk) {
    chunks.push(chunk);
  }
});

process.stdin.on('end', function () {
  var inputBuffer = Buffer.concat(chunks);
  var output;

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
