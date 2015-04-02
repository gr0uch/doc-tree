import Test from 'tape';
import docchi from '../lib';
import readFile from './read_file';


Test('Class documentation', t => {
  let doc = docchi.parse(readFile('fixtures/fixture1.js'));
  let output = doc.output();

  t.equal(output.filter(node => node.context).length,
    10, 'docs match up to corresponding nodes');

  t.equal(output[0].comment.description.match(/<p>/g).length, 2,
    'CommonMark is supported.');
  t.equal(output[0].context.type, 'class', 'class is a class');

  t.assert(!output[1].context.name, 'name not defined for constructor');
  t.equal(output[1].context.target, 'Person', 'target is correct');

  t.equal(output[2].context.name, 'name', 'name is correct');
  t.equal(output[2].context.type, 'get', 'getter is a getter');
  t.equal(output[2].context.target, 'Person', 'target is correct');

  t.equal(output[3].context.name, 'name', 'name is correct');
  t.equal(output[3].context.type, 'set', 'setter is a setter');
  t.equal(output[3].context.target, 'Person', 'target is correct');

  t.equal(output[4].context.name, 'poop', 'name is correct');
  t.equal(output[4].context.target, 'Person', 'target is correct');

  t.assert(!output[5].hasOwnProperty('context'), 'comment with no context');

  t.equal(output[6].context.name, 'zap', 'name is correct');
  t.equal(output[6].context.target, 'Person', 'static target is correct');
  t.assert(output[6].context.static, 'static attribute is correct');
  t.equal(output[6].context.type, 'method', 'static method is correct');

  t.equal(output[7].context.name, 'Nothing', 'name is correct');
  t.equal(output[7].context.type, 'class', 'class is a class');
  t.assert(!output[7].context.target, 'no target');

  t.equal(output[8].context.name, 'void', 'name is correct');
  t.equal(output[8].context.type, 'method', 'type is correct');
  t.assert(output[8].context.static, 'static attribute is correct');
  t.equal(output[8].context.target, 'Nothing', 'target is correct');

  t.assert(!output[9].hasOwnProperty('context'), 'comment with no context');

  t.assert(!output[10].context.name, 'name not defined');
  t.equal(output[10].context.type, 'class', 'class is a class');
  t.assert(!output[10].context.target, 'no target');

  t.equal(output[11].context.name, 'poop', 'name is correct');
  t.equal(output[11].context.type, 'method', 'type is correct');
  t.assert(!output[11].context.target, 'no target');

  t.end();
});
