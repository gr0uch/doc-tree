import Test from 'tape';
import fs from 'fs';
import path from 'path';
import Docchi from '../lib';

Test('Class documentation', t => {
  let doc = new Docchi(readFile('fixtures/fixture1.js'));
  let output = doc.output();

  t.equal(output.length, 9, 'Docs match up to corresponding nodes.');
  t.equal(output[0].comment.description.match(/<p>/g).length, 2,
    'CommonMark is supported.');
  t.equal(output[0].context.type, 'class', 'class is a class');
  t.equal(output[2].context.kind, 'get', 'getter is a getter');
  t.equal(output[3].context.kind, 'set', 'setter is a setter');
  t.equal(output[4].context.target, 'Person', 'target is correct');
  t.assert(!output[5].hasOwnProperty('context'), 'comment with no context');
  t.equal(output[6].context.target, 'Person', 'static target is correct');
  t.equal(output[6].context.static, true, 'static attribute is correct');
  t.equal(output[6].context.type, 'method', 'static method is correct');
  t.equal(output[7].context.type, 'class', 'class is a class');
  t.assert(!output[8].hasOwnProperty('context'), 'comment with no context');
  t.end();
});

Test('Function prototype documentation', t => {
  let doc = new Docchi(readFile('fixtures/fixture2.js'));
  let output = doc.output();

  t.equal(output.length, 8, 'docs match up to corresponding nodes');
  t.equal(output[0].context.type, 'class', 'class is a class');
  t.equal(output[1].context.type, 'property', 'property is a property');
  t.equal(output[1].context.static, undefined, 'prototype not static');
  t.equal(output[2].context.target, 'Person', 'method target is correct');
  t.equal(output[3].context.target, 'Person', 'property target is correct');
  t.equal(output[3].context.type, 'property', 'property is a property');
  t.equal(output[4].context.type, 'property', 'property is a property');
  t.equal(output[4].context.static, true, 'static property is static');
  t.equal(output[5].context.target, 'Person', 'method target is correct');
  t.equal(output[6].context.target, 'Person', 'property target is correct');
  t.equal(output[6].context.type, 'property', 'property is a property');
  t.equal(output[7].context.target, 'Person', 'static property target is correct');
  t.equal(output[7].context.static, true, 'static property is static');
  t.equal(output[7].context.type, 'property', 'static property is property');
  t.end();
});

function readFile (fileName) {
  return fs.readFileSync(path.join(__dirname, fileName));
}
