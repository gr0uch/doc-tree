import Walk from 'acorn/util/walk';
import * as arrayProxy from './array_proxy';

const delimiter = '.';
const fnTypes = [
  'ArrowFunctionExpression',
  'FunctionExpression',
  'FunctionDeclaration'
];
const names = {
  property: 'property',
  class: 'class',
  method: 'method',
  function: 'function'
};


export default function (AST) {
  let nodes = [];

  Walk.recursive(AST, [], {

    // that pesky export
    ExportDeclaration: (node, state, cb) => {
      cb(node.declaration, state);
    },

    // class
    ClassDeclaration: declareClass.bind(null, nodes),
    ClassExpression: declareClass.bind(null, nodes),

    ClassBody: (node, state, cb) => {
      node.body.forEach(node => cb(node, state));
    },

    MethodDefinition: (node, state) => {
      nodes.push(Object.assign(pickLocation(node), {
        name: node.key.name,
        type: names.method,
        target: `${state.join(delimiter)}`
      }, node.kind ? {
        kind: node.kind
      } : null, node.static ? {
        static: true
      } : null));
    },

    // prototype/function
    FunctionDeclaration: declareFunction.bind(null, nodes),
    FunctionExpression: declareFunction.bind(null, nodes),
    ArrowFunctionExpression: declareFunction.bind(null, nodes),

    AssignmentExpression: (node, state, cb) => {
      if (~fnTypes.indexOf(node.right.type))
        cb(node.right, state);

      let obj = node.left.object;
      let isPrototype = obj && obj.name &&
        node.left.property.name === 'prototype';
      let isPrototypeAssignment = obj && obj.object &&
        obj.object.name &&
        obj.property.name === 'prototype';
      let isStaticAssignment = obj && obj.name;

      if (isPrototype)
        node.right.properties.forEach(property =>
          nodes.push(Object.assign(pickLocation(property), {
            name: property.key.name,
            type: ~fnTypes.indexOf(property.value.type) ?
              names.method : names.property,
            target: `${obj.name}`
          })));

      else if (isPrototypeAssignment)
        nodes.push(Object.assign(pickLocation(node), {
          name: node.left.property.name,
          type: ~fnTypes.indexOf(node.right.type) ?
            names.method : names.property,
          target: `${obj.object.name}`
        }));

      else if (isStaticAssignment)
        nodes.push(Object.assign(pickLocation(node), {
          name: node.left.property.name,
          type: ~fnTypes.indexOf(node.right.type) ?
            names.method : names.property,
          target: obj.name,
          static: true
        }));

      // Make sure a function gets treated as a class if it
      // gets prototype properties.
      if (isPrototype || isPrototypeAssignment) {
        let fn = arrayProxy.find(nodes, node =>
          node.name === (obj.name || obj.object.name) &&
          node.type === names.function) || {};
        fn.type = names.class;
      }
    }

  });

  return nodes.sort((a, b) => a.start - b.start);
}


function declareClass (nodes, node, state, cb) {
  let name = node.id.name;

  state.push(name);
  nodes.push(Object.assign(pickLocation(node), {
    name,
    type: names.class
  }));

  cb(node.body, state);
}


function declareFunction (nodes, node, state) {
  let name = node.id ? node.id.name : null;

  if (!name) return;

  state.push(name);
  nodes.push(Object.assign(pickLocation(node), {
    name,
    type: names.function
  }));
}


function pickLocation (node) {
  let obj = {};

  obj.location = node.loc;
  obj.start = node.start;
  obj.end = node.end;

  return obj;
}
