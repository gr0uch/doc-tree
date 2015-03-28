import Test from 'tape';
import fs from 'fs';
import path from 'path';
import Docchi from '../lib';

Test('Class documentation', t => {
  let doc = new Docchi(readFile('fixtures/fixture1.js'));
  let output = doc.output();

  t.equal(output.length, 7, 'Docs match up to corresponding nodes.');
  t.equal(output[0].comment.description.match(/<p>/g).length, 2,
    'CommonMark is supported.');
  t.equal(output[0].context.type, 'class', 'Class is a class.');
  t.equal(output[2].context.kind, 'get', 'Getter is a getter.');
  t.equal(output[3].context.kind, 'set', 'Setter is a setter.');
  t.equal(output[4].context.target, 'Person', 'Target is correct.');
  t.equal(output[5].context.target, 'Person', 'Static target is correct.');
  t.equal(output[5].context.static, true, 'Static attribute is correct.');
  t.equal(output[5].context.type, 'method', 'Static method is correct.');
  t.equal(output[6].context.type, 'class', 'Class is a class.');
  t.end();
});

Test('Function prototype documentation', t => {
  let doc = new Docchi(readFile('fixtures/fixture2.js'));
  let output = doc.output();

  t.equal(output.length, 6, 'Docs match up to corresponding nodes.');
  t.equal(output[0].context.type, 'class', 'Class is a class.');
  t.equal(output[1].context.target, 'Person', 'Method target is correct.');
  t.equal(output[2].context.target, 'Person', 'Property target is correct.');
  t.equal(output[2].context.type, 'property', 'Property is a property.');
  t.equal(output[3].context.target, 'Person', 'Method target is correct.');
  t.equal(output[4].context.target, 'Person', 'Property target is correct.');
  t.equal(output[4].context.type, 'property', 'Property is a property.');
  t.equal(output[5].context.target, 'Person', 'Static property target is correct.');
  t.equal(output[5].context.static, true, 'Static property is static.');
  t.equal(output[5].context.type, 'property', 'Static property is property.');
  t.end();
});

function readFile (fileName) {
  return fs.readFileSync(path.join(__dirname, fileName));
}
