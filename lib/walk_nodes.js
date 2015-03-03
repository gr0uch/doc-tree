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
    ClassDeclaration: declareClass,
    ClassExpression: declareClass,

    ClassBody: (node, state, cb) => {
      node.body.forEach(node => cb(node, state));
    },

    MethodDefinition: (node, state) => {
      nodes.push(Object.assign(pickLocation(node), {
        name: node.key.name,
        type: names.method,
        path: `${state.length ?
          state.join(delimiter) + delimiter : ''}${node.key.name}`
      }, node.kind ? {
        kind: node.kind
      } : {}));
    },

    // prototype/function
    FunctionDeclaration: declareFunction,
    FunctionExpression: declareFunction,
    ArrowFunctionExpression: declareFunction,

    AssignmentExpression: (node, state, cb) => {
      if (~fnTypes.indexOf(node.right.type))
        cb(node.right, state);

      let obj = node.left.object;
      let isPrototype = !!obj && obj.name &&
        node.left.property.name === 'prototype';
      let isPrototypeAssignment = !!obj && obj.object &&
        obj.object.name &&
        obj.property.name === 'prototype';

      if (isPrototype)
        node.right.properties.forEach(property =>
          nodes.push(Object.assign(pickLocation(property), {
            name: property.key.name,
            type: ~fnTypes.indexOf(property.value.type) ?
              names.method : names.property,
            path: `${obj.name ?
              obj.name + delimiter : ''}${property.key.name}`
          })));

      else if (isPrototypeAssignment)
        nodes.push(Object.assign(pickLocation(node), {
          name: node.left.property.name,
          type: ~fnTypes.indexOf(node.right.type) ?
            names.method : names.property,
          path: `${obj.object.name ?
            obj.object.name + delimiter : ''}${node.left.property.name}`
        }));

      if (isPrototype || isPrototypeAssignment) {
        let fn = arrayProxy.find(nodes, node =>
          node.path === (obj.name || obj.object.name)) || {};
        fn.type = names.class;
      }
    }

  });

  function declareClass (node, state, cb) {
    let name = node.id.name;
    state.push(name);
    nodes.push(Object.assign(pickLocation(node), {
      name,
      path: name,
      type: names.class
    }));
    cb(node.body, state);
  }

  function declareFunction (node, state) {
    let name = node.id ? node.id.name : null;
    if (!name) return;
    state.push(name);
    nodes.push(Object.assign(pickLocation(node), {
      name,
      path: name,
      type: names.function
    }));
  }

  return nodes.sort((a, b) => a.start - b.start);
}


function pickLocation (node) {
  let obj = {};

  obj.location = node.loc;
  obj.start = node.start;
  obj.end = node.end;

  return obj;
}
