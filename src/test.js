import test from 'ava'
import fs from 'fs'
import { join } from 'path'
import getAllFiles from '../lib/get-all-files'

const fixtures = join(__dirname, `fixtures`)

test(`sync finds 6 files`, t => {
  let count = 0

  for (const filename of getAllFiles.sync(fixtures)) {
    t.assert(fs.existsSync(filename))
    count++
  }

  t.is(count, 6)
})

test(`sync array finds 6 files`, t => {
  t.is(getAllFiles.sync.array(fixtures).length, 6)
})

test(`async finds 6 files`, async t => {
  let count = 0

  for await (const filename of getAllFiles.async(fixtures)) {
    await fs.promises.access(filename)
    count++
  }

  t.is(count, 6)
})

test(`async array finds 6 files`, async t => {
  t.is((await getAllFiles.async.array(fixtures)).length, 6)
})
