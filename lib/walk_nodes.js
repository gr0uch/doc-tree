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
  function: 'function',
  variable: 'variable',
  constant: 'constant'
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
      node.body.forEach(node => cb(node, state[state.length - 1]));
      state.pop();
    },

    MethodDefinition: (node, state) => {
      nodes.push(Object.assign(pickLocation(node),
        node.kind !== 'constructor' ? {
          name: node.key.name
        } : null, state ? {
          target: state
        } : null, node.kind ? {
          type: node.kind
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
      let isPropertyAssignment = obj && obj.name;
      let isPrototype = isPropertyAssignment && node.left.property &&
        node.left.property.name === 'prototype';
      let isPrototypeAssignment = obj && obj.object &&
        obj.object.name && obj.property &&
        obj.property.name === 'prototype';

      if (isPropertyAssignment) {
        nodes.push(Object.assign(pickLocation(node), {
          name: node.left.property.name,
          type: fnTypes.has(node.right.type) ?
            names.method : names.property,
          target: obj.name
        }, !isPrototype ? {
          static: true
        } : null));

        if (node.right.properties) {
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
            } : null)));
        }
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
    },

    VariableDeclaration: (node, state, cb) => {
      if (node.declarations.length === 1) {
        let declaration = node.declarations[0];

        if (declaration.init &&
          visitors.hasOwnProperty(declaration.init.type) &&
          !fnTypes.has(declaration.init.type))
            return cb(declaration.init, state);

        nodes.push(Object.assign(pickLocation(declaration), {
          type: node.kind === 'const' ? names.constant : names.variable
        }, declaration.id ? {
          name: declaration.id.name
        } : null));

        if (declaration.init && declaration.init.properties) {
          declaration.init.properties.forEach(property =>
            nodes.push(Object.assign(pickLocation(property), {
              name: property.key.name,
              type: fnTypes.has(property.value.type) ?
                names.method : names.property
            }, declaration.id ? {
              target: declaration.id.name
            } : null)));
        }
      }
    }

  };

  walk.recursive(AST, [], visitors);

  return nodes.sort((a, b) => a.start - b.start);
}


function declareClass (nodes, node, state, cb) {
  const name = node.id ? node.id.name : undefined;

  if (name)
    state.push(name);

  nodes.push(Object.assign(pickLocation(node), {
    type: names.class
  }, name ? {
    name
  } : null));

  cb(node.body, state);
}


function declareFunction (nodes, node, state) {
  const name = node.id ? node.id.name : undefined;

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
