import doctrine from 'doctrine';
import walkNodes from './walk_nodes';
import matchNodes from './match_nodes';
import CommonMark from 'commonmark';
import * as acorn from 'acorn';

const defaultEncoding = 'utf8';
const ecmaVersion = 6;
const sourceType = 'module';
const CMparser = new CommonMark.Parser();
const CMrenderer = new CommonMark.HtmlRenderer();


/**
 * Docchi is a documentation generating tool.
 */
export default class Docchi {

  /**
   * Instantiate Docchi.
   *
   * @param {String|Buffer} input
   * @param {Object} options to be passed to Acorn.
   */
  constructor (input = '', options = {}) {
    let comments = [];

    if (Buffer.isBuffer(input))
      input = input.toString(options.encoding || defaultEncoding);

    this.AST = acorn.parse(input, Object.assign({
      ecmaVersion,
      sourceType,
      locations: true,
      onComment: comments
    }, options));

    this.nodes = walkNodes(this.AST);
    this.comments = matchNodes(comments, this.nodes);
  }

  /**
   * Output the documentation, running either the JSDoc parser Doctrine
   * or a provided function.
   *
   * @param {Function} [fn]
   * @param {Object} [options]
   * @return {Object}
   */
  output (fn, options = {}) {
    if (typeof fn === 'object')
      options = Object.assign(options, fn);

    let comments = this.comments.map(container => {
      let comment = container.comment;

      if (typeof fn === 'function') {
        container.comment = fn(comment, options);
        return container;
      }

      let firstChar = comment.value.charAt(0);

      // Only consider block comments starting with `/**`.
      if (comment.type !== 'block' || firstChar !== '*')
        return null;

      options = Object.assign({
        sloppy: true,
        render: true,
        unwrap: true
      }, options);

      container.comment = doctrine.parse(comment.value, options);

      if (options.render)
        container.comment.description = CMrenderer.render(
          CMparser.parse(container.comment.description));

      return container;
    });

    // Filter sparse array.
    return comments.filter(comment => !!comment);
  }

}
