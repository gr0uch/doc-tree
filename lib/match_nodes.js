import * as arrayProxy from './array_proxy';


/**
 * Match comments to nodes.
 */
export default (comments, nodes) => {
  let commentNodes = comments.map(comment => {
    let node = arrayProxy.find(nodes, node => comment.end <= node.start);

    if (!node)
      return null;

    let distance = node.location.start.line - comment.loc.end.line;

    // the comment must be immediately preceding the matched node,
    // or on the same line.
    if (distance > 1 || distance < 0)
      return null;

    let context = Object.assign({}, node);

    delete context.start;
    delete context.end;

    return {
      comment: {
        type: comment.type.toLowerCase(),
        value: comment.value
      },
      context
    };

  });

  // Filter sparse array.
  return commentNodes.filter(node => !!node);
};
