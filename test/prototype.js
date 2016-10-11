'use strict'

const test = require('tape')
const docTree = require('../lib/index')
const readFile = require('./read_file')


test('Function prototype documentation', t => {
  const doc = docTree.parse(readFile('fixtures/fixture2.js'))
  const output = doc.output()

  t.equal(output.filter(node => node.context).length,
    10, 'docs match up to corresponding nodes')

  t.equal(output[0].context.name, 'Person', 'class name correct')
  t.equal(output[0].context.type, 'class', 'class is a class')

  t.equal(output[1].context.name, 'prototype', 'name is correct')
  t.equal(output[1].context.target, 'Person', 'target is correct')
  t.equal(output[1].context.type, 'property', 'property is a property')
  t.ok(!output[1].context.static, 'prototype not static')

  t.equal(output[2].context.name, 'poop', 'name is correct')
  t.equal(output[2].context.target, 'Person', 'method target is correct')
  t.equal(output[2].context.type, 'method', 'type is correct')

  t.equal(output[3].context.name, 'foo', 'name is correct')
  t.equal(output[3].context.target, 'Person', 'property target is correct')
  t.equal(output[3].context.type, 'property', 'property is a property')

  t.equal(output[4].context.name, 'thing', 'name is correct')
  t.equal(output[4].context.type, 'property', 'property is a property')
  t.ok(output[4].context.static, 'static property is static')
  t.equal(output[4].context.target, 'Person', 'target is correct')

  t.equal(output[5].context.name, 'value', 'name is correct')
  t.equal(output[5].context.type, 'property', 'property is a property')
  t.ok(output[5].context.static, 'static property is static')
  t.equal(output[5].context.target, 'Person.thing', 'target is correct')

  t.equal(output[6].context.name, 'die', 'name is correct')
  t.equal(output[6].context.target, 'Person', 'method target is correct')
  t.equal(output[6].context.type, 'method', 'type is correct')

  t.equal(output[7].context.name, 'foo', 'name is correct')
  t.equal(output[7].context.target, 'this', 'property target is correct')
  t.equal(output[7].context.type, 'property', 'property is a property')

  t.equal(output[8].context.name, 'sex', 'name is correct')
  t.equal(output[8].context.target, 'Person', 'property target is correct')
  t.equal(output[8].context.type, 'property', 'property is a property')

  t.equal(output[9].context.name, 'taxonomy', 'name is correct')
  t.equal(output[9].context.target, 'Person',
    'static property target is correct')
  t.ok(output[9].context.static, 'static property is static')
  t.equal(output[9].context.type, 'property', 'static property is property')

  t.end()
})
