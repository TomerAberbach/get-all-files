# Get All Files

A fast parallel stack-based readdir-recursively module with micromatch support.

[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## getAllFiles

If `filename` is a file, creates an array containing the file path.
Otherwise creates an array containing the file paths of all files recursively in the given directory.

The array is filtered by the given glob pattern(s) and/or predicate(s) and returned as a promise.

**Parameters:**
* `filename` **{string}**: A path to a file or directory.
* `arr` **{string|function|(string|function)[]}** (optional): A string glob pattern, a function taking a file path and returning a boolean, or an array of containing any number of of the former two options.
* `opt` **{Object}** (optional): An options object for the [micromatch](https://www.npmjs.com/package/micromatch) module.


Examples:
```javascript
const getAllFiles = require('get-all-files')

// All files
getAllFiles('path/to/dir/or/file').then(files => console.log(files))

// All javascript files
getAllFiles('path/to/dir/or/file', '*.js', {matchBase: true}).then(files => console.log(files))

// All files where their path is all lowercase
getAllFiles(
  'path/to/a/dir/or/file',
  filename => filename.toLowerCase() === filename
).then(files => console.log(files))

// A combination of options
getAllFiles(
  'path/to/dir/or/file',
  ['*.js', 'foo*', filename => filename.toLowerCase() === filename],
  {matchBase: true}
).then(files => console.log(files))
```

## Benchmarks

To see the performance of this module in comparison to other similar modules clone the repository and
run `npm start` in the `benchmark` directory.

Sample output (lower is less time):
```
Results from reading node_modules:
  get-all-files: 0.011025358324145534
  recur-readdir: 0.013531799729364006
  recursive-readdir: 0.01763668430335097
  recursive-files: 0.023923444976076555
  all-files-in-tree: 0.033444816053511704
  fs-readdir-recursive: 0.07518796992481203
```