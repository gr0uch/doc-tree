import Test from 'tape';
import fs from 'fs';
import path from 'path';
import Docchi from '../dist';

Test('Class documentation', t => {
  let docs = new Docchi(readFile('example1.js'));
  let output = docs.output();

  t.equal(output.length, 5, 'Docs match up to corresponding nodes.');
  t.equal(output[0].context.path, 'Person', 'Class path is correct.');
  t.equal(output[0].comment.description.match(/<p>/g).length, 2,
    'CommonMark is supported.');
  t.equal(output[0].context.type, 'class', 'Class is a class.');
  t.equal(output[2].context.kind, 'get', 'Getter is a getter.');
  t.equal(output[3].context.kind, 'set', 'Setter is a setter.');
  t.equal(output[4].context.path, 'Person.poop', 'Method path is correct.');
  t.end();
});

Test('Function prototype documentation', t => {
  let docs = new Docchi(readFile('example2.js'));
  let output = docs.output();

  t.equal(output.length, 5, 'Docs match up to corresponding nodes.');
  t.equal(output[0].context.type, 'class', 'Class is a class.');
  t.equal(output[0].context.path, 'Person', 'Class path is correct.');
  t.equal(output[1].context.path, 'Person.poop', 'Method path is correct.');
  t.equal(output[2].context.path, 'Person.foo', 'Property path is correct.');
  t.equal(output[2].context.type, 'property', 'Property is a property.');
  t.equal(output[3].context.path, 'Person.die', 'Method path is correct.');
  t.equal(output[4].context.path, 'Person.sex', 'Property path is correct.');
  t.equal(output[4].context.type, 'property', 'Property is a property.');
  t.end();
});

function readFile (fileName) {
  return fs.readFileSync(path.join(__dirname, fileName));
}
