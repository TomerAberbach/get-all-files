import fs from 'fs'
import test from 'ava'
import { getAllFiles, getAllFilesSync } from '../src/index.js'

const fixtures = `./test/fixtures`

test(`sync finds 6 files`, t => {
  let count = 0

  for (const filename of getAllFilesSync(fixtures)) {
    t.assert(fs.existsSync(filename))
    count++
  }

  t.is(count, 6)
})

test(`sync array finds 6 files`, t => {
  t.is(getAllFilesSync(fixtures).toArray().length, 6)
})

test(`async finds 6 files`, async t => {
  let count = 0

  for await (const filename of getAllFiles(fixtures)) {
    await fs.promises.access(filename)
    count++
  }

  t.is(count, 6)
})

test(`async array finds 6 files`, async t => {
  t.is((await getAllFiles(fixtures).toArray()).length, 6)
})
