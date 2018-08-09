const Bench = require('mini-bench')
const chalk = require('chalk')
const getAllFiles = require('./index')
const recursiveReaddir = require('recursive-readdir')
const recursiveFiles = require('recursive-files')
const allFilesInTree = require('all-files-in-tree')
const recurReaddir = require('recur-readdir')
const fsReaddirRecursive = require('fs-readdir-recursive')

const results = []

new Bench.Suite({
  result: (name, stats) => results.push({
    name: name,
    time: stats.iterations / stats.elapsed
  }),
  done: () => {
    results.sort((res1, res2) => res1.time - res2.time)
    console.log('Results from reading node_modules:')
    results.forEach((res, i) => console.log(`  ${res.name}: ${i === 0 ? chalk.green(res.time) : res.time}`))
  }
})
  .bench('get-all-files', next => getAllFiles('node_modules').then(() => next()))
  .bench('recursive-readdir', next => recursiveReaddir('node_modules', [], () => next()))
  .bench('recursive-files', next => recursiveFiles('node_modules', () => next()))
  .bench('all-files-in-tree', next => allFilesInTree.async('node_modules').then(() => next()))
  .bench('recur-readdir', next => recurReaddir.crawl('node_modules').then(() => next()))
  .bench('fs-readdir-recursive', next => {
    fsReaddirRecursive('node_modules')
    next()
  }).run()
