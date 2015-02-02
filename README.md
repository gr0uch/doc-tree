# Docchi [![Build Status](https://travis-ci.org/daliwali/docchi.png?branch=master)](https://travis-ci.org/daliwali/docchi)

Docchi parses comments in JavaScript code and outputs the structure and context of the comments in any particular format, JSDoc is the default. It traverses the Abstract Syntax Tree (AST) to determine the context of a comment.

There is no reason for Docchi to exist (besides **working in ES6**). Basically it's glue code between the excellent [Acorn](https://github.com/marijnh/acorn) parser, and the documentation parser [Doctrine](https://github.com/Constellation/doctrine). The initial motivation is to support ES6, and a modular approach to comment formatting. There's already [JSDoc](https://github.com/jsdoc3/jsdoc) and [dox](https://github.com/tj/dox), but I found these lacking for my needs.

Get it from `npm`:

```sh
$ npm install --save docchi
```

## Usage

```js
import fs from 'fs';

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
 * This is a Foo class.
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
[ { type: 'block',
    comment: { description: 'This is a Foo class.', tags: [] },
    start: 0,
    end: 31,
    context: { start: 32, end: 148, name: 'Foo', path: 'Foo', type: 'class' } },
  { type: 'block',
    comment: { description: 'This is the constructor.', tags: [Object] },
    start: 46,
    end: 119,
    context:
     { start: 122,
       end: 146,
       name: 'constructor',
       kind: '',
       type: 'method',
       path: 'Foo.constructor' } } ]
```

There are a few limitations. It only considers block comments, and if the block comment starts with the character `!` it will be ignored. Also, only classes, class methods, functions, and `prototype` properties can be documented.

## Contributions

There are a lot of AST nodes that it does not catch. Right now, it only supports commenting classes, class methods, functions, and prototypes. Nested prototype objects will not work. Also, it does not yet work over `stdio`, that would be a nice feature to have. Pull requests welcome.

## Meta

Docchi is licensed under the [GNU General Public License v3](https://github.com/daliwali/docchi/blob/master/LICENSE).
