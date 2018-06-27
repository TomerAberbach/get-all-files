const path = require('path')
const fs = require('then-fs')
const mm = require('micromatch')

const matcher = (arr, opts) => {
  if (arr) {
    if (!Array.isArray(arr))
      arr = [arr]

    const checks = []

    const patterns = arr.filter(val => typeof val === 'string')
    if (patterns.length > 0) checks.push(mm.matcher(patterns, opts || {}))

    arr.filter(val => typeof val === 'function').forEach(func => checks.push(func))

    return filename => checks.some(check => check(filename))
  } else {
    return () => true
  }
}

/**
 * If filename is a file, creates an array containing the file path.
 * Otherwise creates an array containing the file paths of all files recursively in the given directory.
 *
 * The array is filtered by the given glob pattern(s) and/or predicate(s) and returned as a promise.
 *
 * @param {string} filename - A path to a file or directory.
 * @param {string|function|(string|function)[]} [arr] - A string glob pattern, a function taking a file path and returning a boolean, or an array of containing any number of of the former two options.
 * @param {Object} [opts] - An options object for the <a href="https://www.npmjs.com/package/micromatch">micromatch</a> module.
 * @returns Promise<string[]>
 */
module.exports = (filename, arr, opts) => {
  const check = matcher(arr, opts)
  const paths = []
  const stack = [filename]

  return (function next () {
    if (stack.length > 0) {
      const popped = stack.pop()

      return fs.stat(popped)
        .then(stats => {
          if (stats.isDirectory()) {
            return fs.readdir(popped)
          } else {
            if (check(popped)) paths.push(popped)
            return []
          }
        }).then(names => {
          names.forEach(name => stack.push(path.join(popped, name)))
          return next()
        })
    } else {
      return Promise.resolve(paths)
    }
  })()
}