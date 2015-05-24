const hasFind = 'find' in Array.prototype


/**
 * Proxy for Array.prototype.find.
 *
 * @param {Array} array
 * @param {Function} fn
 */
export function find (array, fn) {
  // Check for ES6 `Array.prototype.find`, or fall back to `core-js` method.
  return hasFind ? array.find(fn) : Array.find(array, fn)
}
