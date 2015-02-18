/**
 * Match comments to nodes.
 */
export default (comments, nodes) => {
  let commentNodes = comments.map(comment => {
    let node;
    let isMatched = false;

    for (let i = 0; i < nodes.length; i++) {
      node = nodes[i];
      if (comment.end < node.start) {
        isMatched = true;
        break;
      }
    }

    if (isMatched &&
      // the comment must be immediately preceding the matched node.
      comment.loc.end.line + 1 === node.location.start.line) {

      let context = Object.assign({}, node);
      delete context.start;
      delete context.end;
      return {
        comment: {
          type: comment.type.toLowerCase(),
          value: comment.value
        },
        context: context
      };
    } else {
      return null;
    }

  });

  // Filter sparse array.
  return commentNodes.filter(node => !!node);
};
