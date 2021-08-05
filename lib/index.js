'use strict'

const doctrine = require('doctrine')
const walkNodes = require('./walk_nodes')
const matchNodes = require('./match_nodes')
const commonmark = require('commonmark')
const acorn = require('acorn')

const defaultEncoding = 'utf8'
const ecmaVersion = 11
const sourceType = 'module'
const CMparser = new commonmark.Parser()
const CMrenderer = new commonmark.HtmlRenderer()


/**
 * doc-tree is a documentation generating tool.
 */
class DocTree {
  /**
   * Instantiate doc-tree.
   *
   * @param {String|Buffer} input
   * @param {Object} options to be passed to Acorn.
   */
  constructor (input, options) {
    if (options === void 0) options = {}

    let comments = []

    if (Buffer.isBuffer(input))
      input = input.toString(options.encoding || defaultEncoding)

    this.AST = acorn.parse(input, Object.assign({
      ecmaVersion,
      sourceType,
      locations: true,
      onComment: comments
    }, options))

    // Collapse contiguous single-line comments.
    for (let index = 0; index < comments.length; index++) {
      const comment = comments[index]
      const nextComment = comments[index + 1]

      if (nextComment &&
      comment.type === 'Line' &&
      nextComment.type === 'Line' &&
      nextComment.loc.start.line === comment.loc.end.line + 1) {
        comments[index + 1].value = comment.value + nextComment.value
        comments[index + 1].start = comment.start
        comments[index + 1].loc.start.line = comment.loc.start.line
        comments[index + 1].loc.start.column = comment.loc.start.column
        comments[index] = undefined
      }
    }

    comments = comments.filter(comment => comment).map(comment => {
      comment.value = comment.value.trim()
      return comment
    })

    this.nodes = walkNodes(this.AST)
    this.comments = matchNodes(comments, this.nodes)
  }

  /**
   * Output the documentation, running either the JSDoc parser Doctrine
   * or a provided function.
   *
   * @param {Function} [fn]
   * @param {Object} [options]
   * @return {Object}
   */
  output (fn, options) {
    if (typeof fn === 'object') {
      options = fn
      fn = null
    }

    if (options === void 0) options = {}

    return this.comments.map(container => {
      const comment = container.comment

      if (typeof fn === 'function') {
        container.comment = fn(comment, options)
        return container
      }

      const firstChar = comment.value.charAt(0)

      // Only consider block comments starting with `/**`.
      if (comment.type !== 'block' || firstChar !== '*')
        return null

      options = Object.assign({
        sloppy: true,
        render: true,
        unwrap: true
      }, options)

      container.comment = doctrine.parse(comment.value, options)

      if (typeof options.render === 'function')
        container.comment.description = options.render(
          container.comment.description)
      else if (options.render)
        container.comment.description = CMrenderer.render(
          CMparser.parse(container.comment.description))

      return container
    })
      // Filter sparse array.
      .filter(comment => comment)
  }

  /**
   * An alternative to the constructor method, for those who don't
   * like using `new` to instantiate things.
   */
  static parse () {
    return new (this.bind.apply(this,
      Array.prototype.concat.apply([ null ], arguments)))
  }

  // Expose Acorn.
  static get acorn () {
    return acorn
  }
}

module.exports = DocTree
