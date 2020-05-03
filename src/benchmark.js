import { normalize, join } from 'path'
import b from 'benny'
import fdir from 'fdir'
import allFilesInTree from 'all-files-in-tree'
import fsReadDirRecursive from 'fs-readdir-recursive'
import klawSync from 'klaw-sync'
import * as recurReadDir from 'recur-readdir'
import recursiveFiles from 'recursive-files'
import recursiveReadDir from 'recursive-readdir'
import rrdir from 'rrdir'
import walkSync from 'walk-sync'
import recursiveFs from 'recursive-fs'
import getAllFiles from './index'

const nodeModulesPath = normalize(join(__dirname, `../node_modules`))

b.suite(
  `Asynchronous`,
  b.add(`get-all-files async`, async () => {
    await getAllFiles.async.array(nodeModulesPath)
  }),
  b.add(`fdir async`, async () => {
    await fdir.async(nodeModulesPath)
  }),
  b.add(`recursive-fs async`, async () => {
    await new Promise(resolve => {
      recursiveFs.readdirr(nodeModulesPath, () => {
        resolve()
      })
    })
  }),
  b.add(`recur-readdir async`, async () => {
    await recurReadDir.crawl(nodeModulesPath)
  }),
  b.add(`recursive-files async`, async () => {
    let timeout
    await new Promise(resolve => {
      recursiveFiles(nodeModulesPath, { hidden: true }, () => {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
          resolve()
        }, 0)
      })
    })
  }),
  b.add(`recursive-readdir async`, async () => {
    await recursiveReadDir(nodeModulesPath)
  }),
  b.add(`rrdir async`, async () => {
    // eslint-disable-next-line no-unused-vars, no-empty
    for await (const filename of rrdir(nodeModulesPath)) {
    }
  }),
  b.cycle(),
  b.complete(),
  b.save({ file: `async`, format: `chart.html` })
)

b.suite(
  `Synchronous`,
  b.add(`get-all-files sync`, () => {
    getAllFiles.sync.array(nodeModulesPath)
  }),
  b.add(`fdir sync`, () => {
    fdir.sync(nodeModulesPath)
  }),
  b.add(`all-files-in-tree sync`, () => {
    allFilesInTree.sync(nodeModulesPath)
  }),
  b.add(`fs-readdir-recursive sync`, () => {
    fsReadDirRecursive(nodeModulesPath)
  }),
  b.add(`klaw-sync`, () => {
    klawSync(nodeModulesPath, {})
  }),
  b.add(`recur-readdir sync`, () => {
    recurReadDir.crawlSync(nodeModulesPath)
  }),
  b.add(`walk-sync`, () => {
    walkSync(nodeModulesPath)
  }),
  b.add(`rrdir sync`, () => {
    rrdir.sync(nodeModulesPath)
  }),
  b.cycle(),
  b.complete(),
  b.save({ file: `sync`, format: `chart.html` })
)
