# Get All Files

[![NPM version](https://img.shields.io/npm/v/get-all-files.svg)](https://www.npmjs.com/package/get-all-files)

> A blazing fast recursive directory crawler with lazy sync and async iterator support.

## Install

Supports Node.js versions 10 and above.

```sh
$ npm i get-all-files
```

## Usage

```js
import getAllFiles from 'get-all-files'

// Get array of filenames synchronously
console.log(getAllFiles.sync.array(`path/to/dir/or/file`))

// Lazily iterate over filenames synchronously
for (const filename of getAllFiles.sync(`path/to/dir/or/file`)) {
  // Could break early on some condition and get-all-files
  // won't have unnecessarily accumulated the filenames in an array
  console.log(filename)
}

;(async () => {
  // Get array of filenames asynchronously
  console.log(await getAllFiles.async.array(`path/to/dir/or/file`))

  // Lazily iterate over filenames asynchronously
  for await (const filename of getAllFiles.async(`path/to/dir/or/file`)) {
    // Could break early on some condition and get-all-files
    // won't have unnecessarily accumulated the filenames in an array
    console.log(filename)
  }
})()
```

## API

### Methods

#### `getAllFiles.sync(path[, options])`

Returns a lazy [iterable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol)/[iterator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol) that iterates over the file paths recursively found at `path` in no particular order.

#### `getAllFiles.sync.array(path[, options])`

Returns a `string[]` of file paths recursively found at `path` in no particular ordering.

#### `getAllFiles.async(path[, options])`

Returns a lazy [async iterable/iterator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/asyncIterator) that asynchronously iterates over the file paths recursively found at `path` in no particular order.

#### `getAllFiles.async.array(path[, options])`

Returns a `Promise<string[]>` of file paths recursively found at `path` in no particular ordering.

### Parameters

#### `path`

Type: `string`

A path to a file or directory to recursively find files in.

#### `options`

Type: `object`

##### Properties

###### `resolve`

Type: `boolean`\
Default: `false`

Whether to resolve paths to absolute paths (relative to `process.cwd()`).

###### `isExcludedDir`

Type: `(dirname: string) => boolean`\
Default: `() => false`

A predicate that determines whether the directory with the given `dirname` should be crawled. There is no `isExcludedFile` option because you can exclude files by checking conditions while lazily iterating using`getAllFiles.sync` or `getAllFiles.async`.

## License

[MIT](https://github.com/TomerAberbach/get-all-files/blob/main/license) © [Tomer Aberbach](https://github.com/TomerAberbach)
