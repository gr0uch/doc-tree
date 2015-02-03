/**
 * Match comments to nodes.
 */
export default (comments, nodes) => {
  let commentNodes = comments.map(comment => {
    let node;
    let done = false;

    // Only consider block comments, and ignore comments starting with `!`
    if (comment.type !== 'Block' || comment.value.indexOf('!') === 0)
      return null;

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
        comment: comment.value,
        context: context
      };
    } else {
      return null;
    }

  });

  // Filter out sparse array.
  return commentNodes.filter(node => !!node);
};
