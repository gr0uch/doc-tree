import * as arrayProxy from './array_proxy';


/**
 * Match comments to nodes.
 */
export default (comments, nodes) => comments.map(comment => {

  let obj = {
    comment: {
      type: comment.type.toLowerCase(),
      value: comment.value,
      location: comment.loc
    }
  };

  let match = arrayProxy.find(nodes, node => comment.end <= node.start);

  if (match)
    obj.context = match;

  return obj;

}).map((obj, index, array) => {

  // Remove duplicate matches.
  if (obj.context) {
    let nextObj = array[index + 1];
    if (nextObj && nextObj.context &&
      nextObj.context.start === obj.context.start &&
      nextObj.context.end === obj.context.end) {
        delete obj.context;
    } else {
      delete obj.context.start;
      delete obj.context.end;
    }
  }

  return obj;

});
