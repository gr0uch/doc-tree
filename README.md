# doc-tree

[![Build Status](https://img.shields.io/travis/sapeien/doc-tree/master.svg?style=flat-square)](https://travis-ci.org/sapeien/doc-tree)
[![npm Version](https://img.shields.io/npm/v/doc-tree.svg?style=flat-square)](https://www.npmjs.com/package/doc-tree)
[![License](https://img.shields.io/npm/l/doc-tree.svg?style=flat-square)](https://raw.githubusercontent.com/sapeien/doc-tree/master/LICENSE)

`doc-tree` parses comments in JavaScript code and outputs the structure and context of the comments in any particular format, JSDoc is the default but any documentation parsing function can be supplied. It traverses the Abstract Syntax Tree (AST) to determine the context of a comment. Basically it's glue code between the AST parser [Acorn](https://github.com/marijnh/acorn), and the JSDoc parser [Doctrine](https://github.com/Constellation/doctrine), though any user-supplied parsing function may be used.

Get it from `npm`:

```sh
$ npm install -g doc-tree
```


## Usage

`doc-tree` operates over `stdio`. Running `doc-tree` on its own source code, and outputting the result to `docs.json`:

```sh
$ doc-tree < lib/index.js > docs.json
```

Or you could use it programmatically, as part of a Node-based build script:

```js
import fs from 'fs'
import docTree from 'doc-tree'

// Parse a string or a buffer.
let doc = docTree.parse(fs.readFileSync('example.js'))

// An array of parsed comments matched with their contexts.
let output = doc.output()
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
              name: 'Foo', type: 'class' }
 },
 { comment: { description: '<p>This is the constructor.</p>', tags: [Object] },
   context: { location: { start: [Object], end: [Object] },
              type: 'constructor', target: 'Foo' }
}]
```

Descriptions are rendered into HTML using CommonMark. Use `{ render: false }` in the options for `output` to turn it off.

The default JSDoc parser will only consider block comments that start with `/**`.


## License

This software is licensed under the [GNU General Public License v3](https://github.com/sapeien/doc-tree/blob/master/LICENSE).
