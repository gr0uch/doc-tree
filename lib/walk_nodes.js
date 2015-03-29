import * as walk from 'acorn/dist/walk';
import * as arrayProxy from './array_proxy';


const delimiter = '.';

const fnTypes = new Set([
  'ArrowFunctionExpression',
  'FunctionExpression',
  'FunctionDeclaration'
]);

const names = {
  property: 'property',
  class: 'class',
  method: 'method',
  function: 'function'
};


export default function walkNodes (AST) {
  const nodes = [];

  const visitors = {

    // that pesky export
    ExportNamedDeclaration: declareExport,
    ExportDefaultDeclaration: declareExport,

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
      if (fnTypes.has(node.right.type))
        cb(node.right, state);

      let obj = node.left.object;
      let isStaticAssignment = obj && obj.name;
      let isPrototype = isStaticAssignment &&
        node.left.property.name === 'prototype';
      let isPrototypeAssignment = obj && obj.object &&
        obj.object.name &&
        obj.property.name === 'prototype';

      if (isStaticAssignment) {
        nodes.push(Object.assign(pickLocation(node), {
          name: node.left.property.name,
          type: fnTypes.has(node.right.type) ?
            names.method : names.property,
          target: obj.name
        }, !isPrototype ? {
          static: true
        } : null));

        if (node.right.properties)
          node.right.properties.forEach(property =>
            nodes.push(Object.assign(pickLocation(property), {
              name: property.key.name,
              type: fnTypes.has(property.value.type) ?
                names.method : names.property,
              target: obj.name
            }, !isPrototype ? {
              static: true
            } : null)));
      }

      else if (isPrototypeAssignment) {
        nodes.push(Object.assign(pickLocation(node), {
          name: node.left.property.name,
          type: fnTypes.has(node.right.type) ?
            names.method : names.property,
          target: obj.object.name
        }));
      }


      // Make sure a function gets treated as a class if it
      // gets prototype properties.
      if (isPrototype || isPrototypeAssignment) {
        let fn = arrayProxy.find(nodes, node =>
          node.name === (obj.name || obj.object.name) &&
          node.type === names.function) || {};
        fn.type = names.class;
      }
    }

  };

  walk.recursive(AST, [], visitors);

  return nodes.sort((a, b) => a.start - b.start);
}


function declareClass (nodes, node, state, cb) {
  const name = node.id.name;

  state.push(name);
  nodes.push(Object.assign(pickLocation(node), {
    name,
    type: names.class
  }));

  cb(node.body, state);
}


function declareFunction (nodes, node, state) {
  const name = node.id ? node.id.name : null;

  if (!name) return;

  state.push(name);
  nodes.push(Object.assign(pickLocation(node), {
    name,
    type: names.function
  }));
}


function declareExport (node, state, cb) {
  cb(node.declaration, state);
}


function pickLocation (node) {
  const obj = {};

  obj.location = node.loc;
  obj.start = node.start;
  obj.end = node.end;

  return obj;
}
