'use strict'

const test = require('tape')
const docchi = require('../lib/index')
const readFile = require('./read_file')


test('Function calls', t => {
  let doc = docchi.parse(readFile('fixtures/fixture4.js'))
  let output = doc.output()

  t.equal(output.filter(node => node.context).length,
    2, 'docs match up to corresponding nodes')

  t.ok(output.every(node => node.context.type === 'identifier'),
    'context type is correct')

  t.equal(output[0].context.name, 'foo', 'name is correct')
  t.equal(output[1].context.name, 'document', 'name is correct')

  t.end()
})
