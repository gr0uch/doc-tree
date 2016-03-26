'use strict'

const walk = require('acorn/dist/walk')

const delimiter = '.'

const fnTypes = new Set([
  'ArrowFunctionExpression',
  'FunctionExpression',
  'FunctionDeclaration'
])

const names = {
  identifier: 'identifier',
  property: 'property',
  class: 'class',
  method: 'method',
  function: 'function',
  variable: 'variable',
  constant: 'constant'
}


module.exports = function walkNodes (AST) {
  const nodes = []

  const visitors = {

    // That pesky export.
    ExportNamedDeclaration: declareImportExport,
    ExportDefaultDeclaration: declareImportExport,

    // Smoothing over acorn implementation.
    ImportDeclaration: declareImportExport,

    // Recursion help.
    BlockStatement: (node, state, cb) => {
      node.body.forEach(node => cb(node, state))
    },
    ExpressionStatement: (node, state, cb) => {
      cb(node.expression, state)
    },

    // Class.
    ClassDeclaration: declareClass.bind(null, nodes),
    ClassExpression: declareClass.bind(null, nodes),

    ClassBody: (node, state, cb) => {
      node.body.forEach(node => cb(node, state[state.length - 1]))
      state.pop()
    },

    MethodDefinition: (node, state, cb) => {
      cb(node.value, state)

      nodes.push(Object.assign(pickLocation(node), {
        name: node.key.name
      }, state ? {
        target: state
      } : null, node.kind ? {
        type: node.kind
      } : null, node.static ? {
        static: true
      } : null))
    },

    // Prototype/function.
    FunctionDeclaration: declareFunction.bind(null, nodes),
    FunctionExpression: declareFunction.bind(null, nodes),
    ArrowFunctionExpression: declareFunction.bind(null, nodes),

    AssignmentExpression: (node, state, cb) => {
      const obj = node.left.object
      const isInstanceAssignment = obj && obj.type === 'ThisExpression'
      const isPropertyAssignment = obj && obj.name
      const isPrototype = isPropertyAssignment && node.left.property &&
        node.left.property.name === 'prototype'
      const isPrototypeAssignment = obj && obj.object &&
        obj.object.name && obj.property &&
        obj.property.name === 'prototype'

      if (isInstanceAssignment)
        nodes.push(Object.assign(pickLocation(node), {
          name: node.left.property.name,
          type: fnTypes.has(node.right.type) ?
            names.method : names.property,
          target: 'this'
        }))

      if (isPropertyAssignment) {
        nodes.push(Object.assign(pickLocation(node), {
          name: node.left.property.name,
          type: fnTypes.has(node.right.type) ?
            names.method : names.property,
          target: obj.name
        }, !isPrototype ? {
          static: true
        } : null))

        if (node.right.properties)
          node.right.properties.forEach(property =>
            nodes.push(Object.assign(pickLocation(property), {
              name: property.key.name,
              type: fnTypes.has(property.value.type) ?
                names.method : names.property,
              target: obj.name +
                (isPrototype || isPrototypeAssignment ?
                '' : delimiter + node.left.property.name)
            }, !isPrototype ? {
              static: true
            } : null)))
      }

      if (isPrototypeAssignment)
        nodes.push(Object.assign(pickLocation(node), {
          name: node.left.property.name,
          type: fnTypes.has(node.right.type) ?
            names.method : names.property,
          target: obj.object.name
        }))

      // Make sure a function gets treated as a class if it
      // gets prototype properties.
      if (isPrototype || isPrototypeAssignment) {
        let fn = find(nodes, node =>
          node.name === (obj.name || obj.object.name) &&
          node.type === names.function) || {}
        fn.type = names.class
      }

      cb(node.right, state)
    },

    // Variables.
    VariableDeclaration: (node, state, cb) => {
      if (node.declarations.length === 1) {
        let declaration = node.declarations[0]

        if (declaration.init &&
        visitors.hasOwnProperty(declaration.init.type) &&
        !fnTypes.has(declaration.init.type))
          return cb(declaration.init, state)

        nodes.push(Object.assign(pickLocation(declaration), {
          type: node.kind === 'const' ? names.constant : names.variable
        }, declaration.id ? {
          name: declaration.id.name
        } : null))

        if (declaration.init && declaration.init.properties)
          declaration.init.properties.forEach(property =>
            nodes.push(Object.assign(pickLocation(property), {
              name: property.key.name,
              type: fnTypes.has(property.value.type) ?
                names.method : names.property
            }, declaration.id ? {
              target: declaration.id.name
            } : null)))
      }
      return undefined
    },

    // Identifier.
    Identifier: node => {
      nodes.push(Object.assign(pickLocation(node), {
        type: names.identifier,
        name: node.name
      }))
    }
  }

  walk.recursive(AST, [], visitors)

  return nodes.sort((a, b) => a.start - b.start)
}


function declareClass (nodes, node, state, cb) {
  const name = node.id ? node.id.name : undefined

  if (name) state.push(name)

  cb(node.body, state)

  nodes.push(Object.assign(pickLocation(node), {
    type: names.class
  }, name ? {
    name
  } : null))
}


function declareFunction (nodes, node, state, cb) {
  cb(node.body, state)

  const name = node.id ? node.id.name : undefined

  // No anonymous functions.
  if (!name) return

  nodes.push(Object.assign(pickLocation(node), {
    name,
    type: names.function
  }, node.generator ? {
    generator: true
  } : null))
}


function declareImportExport (node, state, cb) {
  if (node.declaration) cb(node.declaration, state)
}


function pickLocation (node) {
  const obj = {}

  obj.location = node.loc
  obj.start = node.start
  obj.end = node.end

  return obj
}


function find (array, fn) {
  for (let i = 0; i < array.length; i++)
    if (fn(array[i])) return array[i]
  return undefined
}
