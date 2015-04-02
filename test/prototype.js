import Test from 'tape';
import docchi from '../lib';
import readFile from './read_file';


Test('Function prototype documentation', t => {
  let doc = docchi.parse(readFile('fixtures/fixture2.js'));
  let output = doc.output();

  t.equal(output.filter(node => node.context).length,
    9, 'docs match up to corresponding nodes');

  t.equal(output[0].context.name, 'Person', 'class name correct');
  t.equal(output[0].context.type, 'class', 'class is a class');

  t.equal(output[1].context.name, 'prototype', 'name is correct');
  t.equal(output[1].context.target, 'Person', 'target is correct');
  t.equal(output[1].context.type, 'property', 'property is a property');
  t.equal(output[1].context.static, undefined, 'prototype not static');

  t.equal(output[2].context.name, 'poop', 'name is correct');
  t.equal(output[2].context.target, 'Person', 'method target is correct');
  t.equal(output[2].context.type, 'method', 'type is correct');

  t.equal(output[3].context.name, 'foo', 'name is correct');
  t.equal(output[3].context.target, 'Person', 'property target is correct');
  t.equal(output[3].context.type, 'property', 'property is a property');

  t.equal(output[4].context.name, 'thing', 'name is correct');
  t.equal(output[4].context.type, 'property', 'property is a property');
  t.equal(output[4].context.static, true, 'static property is static');
  t.equal(output[4].context.target, 'Person', 'target is correct');

  t.equal(output[5].context.name, 'value', 'name is correct');
  t.equal(output[5].context.type, 'property', 'property is a property');
  t.equal(output[5].context.static, true, 'static property is static');
  t.equal(output[5].context.target, 'Person.thing', 'target is correct');

  t.equal(output[6].context.name, 'die', 'name is correct');
  t.equal(output[6].context.target, 'Person', 'method target is correct');
  t.equal(output[6].context.type, 'method', 'type is correct');

  t.equal(output[7].context.name, 'sex', 'name is correct');
  t.equal(output[7].context.target, 'Person', 'property target is correct');
  t.equal(output[7].context.type, 'property', 'property is a property');

  t.equal(output[8].context.name, 'taxonomy', 'name is correct');
  t.equal(output[8].context.target, 'Person',
    'static property target is correct');
  t.equal(output[8].context.static, true, 'static property is static');
  t.equal(output[8].context.type, 'property', 'static property is property');

  t.end();
});
