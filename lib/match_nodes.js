/**
 * Match comments to nodes.
 */
export default (comments, nodes) => {
  let commentNodes = comments.map(comment => {
    let node;
    let done = false;

    for (let i = 0; i < nodes.length; i++) {
      node = nodes[i];
      if (comment.end < node.start) {
        done = true;
        break;
      }
    }

    if (done) {
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
