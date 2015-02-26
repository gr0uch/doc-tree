/**
 * Proxy for Array.prototype.find.
 *
 * @param {Array} array
 * @param {Function} fn
 */
export function find (array, fn) {
  // Check for ES6 `Array.prototype.find`.
  if ('find' in Array.prototype)
    return array.find(fn);

  // Fall back to core-js method.
  return Array.find(array, fn);
}
