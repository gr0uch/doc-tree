import Acorn from 'acorn';
import Doctrine from 'doctrine';
import WalkNodes from './walk_nodes';

const defaultEncoding = 'utf8';


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
      onComment: comments
    }, options));

    this.nodes = WalkNodes(this.AST);
    this._matchCommentNodes(comments);
  }

  /**
   * Match a comment to a node.
   */
  _matchCommentNodes (comments) {
    let commentNodes = comments.map(comment => {
      let node;
      let done = false;

      for (let i = 0; i < this.nodes.length; i++) {
        node = this.nodes[i];
        if (comment.end < node.start) {
          done = true;
          break;
        }
      }

      return done && comment.type === 'Block' ? {
        comment: comment.value,
        start: comment.start,
        end: comment.end,
        context: node
      } : null;
    });

    this.comments = commentNodes.filter(node => !!node &&
      !!node.context && node.comment.indexOf('!') !== 0);
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
    let comments = this.comments.map(container => {
      if (typeof fn === 'function') {
        container.comment = fn(container.comment, options);
      } else {
        container.comment = Doctrine.parse(container.comment,
          Object.assign({
            unwrap: true
          }, options));
      }
      return container;
    });

    return comments;
  }

}
