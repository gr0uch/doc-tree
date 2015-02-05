# Docchi [![Build Status](https://travis-ci.org/daliwali/docchi.png?branch=master)](https://travis-ci.org/daliwali/docchi)

Docchi parses comments in JavaScript code and outputs the structure and context of the comments in any particular format, JSDoc is the default. It traverses the Abstract Syntax Tree (AST) to determine the context of a comment.

There is no reason for Docchi to exist (besides **working in ES6**). Basically it's glue code between the excellent [Acorn](https://github.com/marijnh/acorn) parser, and the documentation parser [Doctrine](https://github.com/Constellation/doctrine). The initial motivation is to support ES6, and a modular approach to comment formatting. There's already [JSDoc](https://github.com/jsdoc3/jsdoc) and [dox](https://github.com/tj/dox), but I found these lacking for my needs.

Get it from `npm`:

```sh
$ npm install -g docchi
```

## Usage

Docchi operates over `stdio`. Running Docchi on its own source code, and outputting the result to `docs.json`:

```sh
$ docchi < lib/index.js > docs.json
```

Or you could use it programmatically, as part of a Node-based build script:

```js
import fs from 'fs';
import Docchi from 'docchi';

// Constructor takes a string or a buffer.
var docs = new Docchi(fs.readFileSync('example.js'));

// An array of parsed comments matched with its context.
var output = docs.output();
```

The `output` method accepts 2 arguments, a function that accepts a comment and returns anything, and an `options` object to pass to the custom function or the built-in parser, Doctrine.

## Example

This code documentation:

```js
/**
 * This is a **Foo** class.
 */
class Foo {
    /**
     * This is the constructor.
     *
     * @param {Object} options
     */
    constructor (options) { ... }
}
```

Gets outputted as:

```js
[{ comment: { description: '<p>This is a <strong>Foo</strong> class.</p>', tags: [] },
   context: { location: { start: [Object], end: [Object] },
              name: 'Foo', path: 'Foo', type: 'class' }
 },
 { comment: { description: '<p>This is the constructor.</p>', tags: [Object] },
   context: { location: { start: [Object], end: [Object] },
              name: 'constructor', kind: '', type: 'method',
              path: 'Foo.constructor' }
}]
```

Descriptions are rendered into HTML using CommonMark. Use `{ render: false }` in the options for `output` to turn it off.

There are a few limitations. It only considers block comments, and if the block comment starts with the character `!` it will be ignored. Also, only classes, class methods, functions, and `prototype` properties can be documented.

## Contributions

There are a lot of AST nodes that it does not catch. Right now, it only supports commenting class declarations, class methods, functions, and prototype properties, which is its primary use case. Pull requests welcome.

## Meta

Docchi is licensed under the [GNU General Public License v3](https://github.com/daliwali/docchi/blob/master/LICENSE).
