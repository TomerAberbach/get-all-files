<h1 align="center">
  get-all-files
</h1>

<div align="center">
  <a href="https://npmjs.org/package/get-all-files">
    <img src="https://badgen.now.sh/npm/v/get-all-files" alt="version" />
  </a>
  <a href="https://github.com/TomerAberbach/get-all-files/actions">
    <img src="https://github.com/TomerAberbach/get-all-files/workflows/CI/badge.svg" alt="CI" />
  </a>
  <a href="https://bundlephobia.com/result?p=get-all-files">
    <img src="https://badgen.net/bundlephobia/minzip/get-all-files" alt="minzip size" />
  </a>
</div>

<div align="center">
  A blazing fast recursive directory crawler with lazy sync and async iterator support.
</div>

## Install

```sh
$ npm i get-all-files
```

## Usage

```js
import { getAllFiles, getAllFilesSync } from 'get-all-files'

// Lazily iterate over filenames asynchronously
for await (const filename of getAllFiles(`path/to/dir/or/file`)) {
  // Could break early on some condition and get-all-files
  // won't have unnecessarily accumulated the filenames in an array
  console.log(filename)
}

// Get array of filenames asynchronously
console.log(await getAllFiles(`path/to/dir/or/file`).toArray())

// Lazily iterate over filenames synchronously
for (const filename of getAllFilesSync(`path/to/dir/or/file`)) {
  // Could break early on some condition and get-all-files
  // won't have unnecessarily accumulated the filenames in an array
  console.log(filename)
}

// Get array of filenames synchronously
console.log(getAllFilesSync(`path/to/dir/or/file`).toArray())
```

## API

### Methods

#### `getAllFiles(path[, options])`

Returns a lazy
[async iterable/iterator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/asyncIterator)
that asynchronously iterates over the file paths recursively found at `path` in
no particular order.

Calling `toArray` on the returned value returns a promise that resolves to an
array of the file paths.

#### `getAllFiles(path[, options])`

Returns a lazy
[iterable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol)/[iterator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)
that iterates over the file paths recursively found at `path` in no particular
order.

Calling `toArray` on the returned value returns an array of the file paths.

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

A predicate that determines whether the directory with the given `dirname`
should be crawled. There is no `isExcludedFile` option because you can exclude
files by checking conditions while lazily iterating using`getAllFiles.sync` or
`getAllFiles.async`.

## Contributing

Stars are always welcome!

For bugs and feature requests,
[please create an issue](https://github.com/TomerAberbach/get-all-files/issues/new).

## License

[MIT](https://github.com/TomerAberbach/get-all-files/blob/main/license) ©
[Tomer Aberbach](https://github.com/TomerAberbach)
