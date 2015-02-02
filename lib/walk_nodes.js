import Walk from 'acorn/util/walk';

const delimiter = '.';
const fnTypes = [
  'ArrowFunctionExpression',
  'FunctionExpression'
];

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
      nodes.push({
        location: node.loc,
        start: node.start,
        end: node.end,
        name: node.key.name,
        kind: node.kind,
        type: 'method',
        path: `${state.length ?
          state.join(delimiter) + delimiter : ''}${node.key.name}`
      });
    },

    // prototype/function
    FunctionExpression: (node, state) => {
      let name = node.id ? node.id.name : null;
      if (!name) return;
      state.push(name);
      nodes.push({
        location: node.loc,
        start: node.start,
        end: node.end,
        type: 'function',
        name: name,
        path: name
      });
    },

    AssignmentExpression: (node, state, cb) => {
      if (node.right.type === 'FunctionExpression') {
        cb(node.right, state);
      }

      let obj = node.left.object;
      let isPrototype = !!obj && obj.name &&
        node.left.property.name === 'prototype';
      let isPrototypeAssignment = !!obj && obj.object &&
        obj.object.name &&
        obj.property.name === 'prototype';

      if (isPrototype) {
        node.right.properties.forEach(property => {
          let node = {
            location: property.loc,
            start: property.start,
            end: property.end,
            name: property.key.name,
            type: !~fnTypes.indexOf(property.value.type) ?
              'property' : 'method',
            path: `${!!obj.name ?
              obj.name + delimiter : ''}${property.key.name}`
          };
          nodes.push(node);
        });
      }

      else if (isPrototypeAssignment) {
        nodes.push({
          location: node.loc,
          start: node.start,
          end: node.end,
          name: node.left.property.name,
          type: !~fnTypes.indexOf(node.right.type) ?
            'property' : 'method',
          path: `${!!obj.object.name ?
            obj.object.name + delimiter : ''}${node.left.property.name}`
        });
      }

      if (isPrototype || isPrototypeAssignment) {
        let fn = nodes.find(node =>
          node.path === (obj.name || obj.object.name)) || {};
        fn.type = 'class';
      }
    }

  });

  function declareClass (node, state, cb) {
    let name = node.id.name;
    state.push(name);
    nodes.push({
      location: node.loc,
      start: node.start,
      end: node.end,
      name: name,
      path: name,
      type: 'class'
    });
    cb(node.body, state);
  }

  return nodes.sort((a, b) => a.start - b.start);
}
