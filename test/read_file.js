const fs = require('fs')
const path = require('path')

module.exports = function readFile (fileName) {
  return fs.readFileSync(path.join(__dirname, fileName))
}
