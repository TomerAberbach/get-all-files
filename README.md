# Get All Files

[![NPM version](https://img.shields.io/npm/v/get-all-files.svg)](https://www.npmjs.com/package/get-all-files) [![Build Status](https://img.shields.io/travis/TomerAberbach/get-all-files.svg)](https://travis-ci.org/TomerAberbach/get-all-files) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

> A fast parallel stack-based readdir-recursively module with micromatch support.

## Install

Install with [npm](https://www.npmjs.com):

```sh
$ npm i get-all-files --save
```

## Usage

```js
const getAllFiles = require('get-all-files')

// All files
getAllFiles('path/to/dir/or/file').then(console.log)

// All JavaScript files
getAllFiles('path/to/dir/or/file', '*.js', {matchBase: true}).then(console.log)

// All files where their path is all lowercase
getAllFiles(
  'path/to/a/dir/or/file',
  filename => filename.toLowerCase() === filename
).then(console.log)

// A combination of options
getAllFiles(
  'path/to/dir/or/file',
  ['*.js', 'foo*', filename => filename.toLowerCase() === filename],
  {matchBase: true}
).then(console.log)
```

## Method

`getAllFiles(filename, arr, opt) -> Promise<Array<string>>`

If the provided path is a file, an array containing the file path will be resolved in the promise. Otherwise it creates an array containing the file paths of all files recursively in the given directory.

The array is filtered by the given glob pattern(s) and/or predicate(s) and returned as a promise.

Parameters:
 * `filename` : `string` - A path to a file or directory.
 * `arr` : `string | function(filename) -> boolean | Array<string | function(filename) -> boolean>` (optional) - A string glob pattern, a function taking a file path and returning a boolean, or an array of containing any number of of the former two options.
 * `opt` : `object` (optional) - An options object for the [micromatch](https://www.npmjs.com/package/micromatch) module.

## Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/TomerAberbach/get-all-files/issues/new).

## Running Tests

Install dev dependencies:

```sh
$ npm i -d && npm test
```

## Benchmarking

Install dev dependencies:

```sh
$ npm i -d && npm run benchmark
```

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

## Author

**Tomer Aberbach**

* [Github](https://github.com/TomerAberbach)
* [NPM](https://www.npmjs.com/~tomeraberbach)
* [LinkedIn](https://www.linkedin.com/in/tomer-a)
* [Website](https://tomeraberba.ch)

## License

Copyright © 2018 [Tomer Aberbach](https://github.com/TomerAberbach)
Released under the [MIT license](https://github.com/TomerAberbach/get-all-files/blob/master/LICENSE).
