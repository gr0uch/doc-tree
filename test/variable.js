import test from 'tape'
import docchi from '../lib'
import readFile from './read_file'


test('Variable assignment', t => {
  let doc = docchi.parse(readFile('fixtures/fixture3.js'))
  let output = doc.output()

  t.equal(output.filter(node => node.context).length,
    8, 'docs match up to corresponding nodes')

  t.equal(output[0].context.name, 'anonFn', 'name is correct')
  t.equal(output[0].context.type, 'variable', 'type is correct')
  t.assert(!output[0].context.target, 'no target')

  t.equal(output[1].context.name, 'a', 'name is correct')
  t.equal(output[1].context.type, 'variable', 'type is correct')

  t.equal(output[2].context.name, 'b', 'name is correct')
  t.equal(output[2].context.type, 'variable', 'type is correct')

  t.equal(output[3].context.name, 'c', 'name is correct')
  t.equal(output[3].context.type, 'constant', 'type is correct')

  t.equal(output[4].context.name, 'obj', 'name is correct')
  t.equal(output[4].context.type, 'variable', 'type is correct')

  t.equal(output[5].context.name, 'prop', 'name is correct')
  t.equal(output[5].context.type, 'property', 'type is correct')
  t.equal(output[5].context.target, 'obj', 'target is correct')

  t.equal(output[6].context.name, 'fn', 'name is correct')
  t.equal(output[6].context.type, 'method', 'type is correct')
  t.equal(output[6].context.target, 'obj', 'target is correct')

  t.equal(output[7].context.name, 'bar', 'name is correct')
  t.equal(output[7].context.type, 'function', 'type is correct')
  t.equal(output[7].context.generator, true, 'generator is correct')

  t.end()
})
