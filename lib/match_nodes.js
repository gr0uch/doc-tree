'use strict'

/**
 * Match comments to nodes.
 */
module.exports = (comments, nodes) =>
  comments.map(comment => {
    const obj = {
      comment: {
        type: comment.type.toLowerCase(),
        value: comment.value,
        location: comment.loc
      }
    }

    const match = find(nodes, node => comment.end <= node.start)

    if (match)
      obj.context = match

    return obj
  })

  .map((obj, index, array) => {
    // Remove duplicate matches.
    if (obj.context) {
      const nextObj = array[index + 1]
      if (nextObj && nextObj.context &&
      nextObj.context.start === obj.context.start &&
      nextObj.context.end === obj.context.end)
        delete obj.context
      else {
        delete obj.context.start
        delete obj.context.end
      }
    }

    return obj
  })


function find (array, fn) {
  for (let i = 0; i < array.length; i++)
    if (fn(array[i])) return array[i]
  return undefined
}
