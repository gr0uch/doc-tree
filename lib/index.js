import Acorn from 'acorn';
import Doctrine from 'doctrine';
import CommonMark from 'commonmark';
import WalkNodes from './walk_nodes';
import MatchNodes from './match_nodes';

const defaultEncoding = 'utf8';

var CMparser = new CommonMark.Parser();
var CMrenderer = new CommonMark.HtmlRenderer();


export default class Docchi {

  /**
   * Instantiate Docchi.
   *
   * @param {String|Buffer} input
   * @param {Object} options to be passed to Acorn.
   */
  constructor (input = '', options = {}) {
    // Force instantiation if constructor is called directly.
    if (!(this instanceof Docchi)) return new Docchi(...arguments);

    let comments = [];

    if (Buffer.isBuffer(input)) {
      input = input.toString(options.encoding || defaultEncoding);
    }

    this.AST = Acorn.parse(input, Object.assign({
      ecmaVersion: 6,
      locations: true,
      onComment: comments
    }, options));

    this.nodes = WalkNodes(this.AST);
    this.comments = MatchNodes(comments, this.nodes);
  }

  /**
   * Output the documentation, running either the JSDoc parser Doctrine
   * or a provided function.
   *
   * @param {Function} [fn]
   * @param {Object} [options]
   * @return {Object}
   */
  output (fn, options = { render: true }) {
    if (typeof fn === 'object') {
      Object.assign(options, fn);
    }

    let comments = this.comments.map(container => {
      if (typeof fn === 'function') {
        container.comment = fn(container.comment, options);
      } else {
        container.comment = Doctrine.parse(container.comment,
          Object.assign({
            sloppy: true,
            unwrap: true
          }, options));

        if (!!options.render) {
          container.comment.description = CMrenderer.render(
            CMparser.parse(container.comment.description));
        }
      }
      return container;
    });

    return comments;
  }

}
