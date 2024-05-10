import { existsSync } from 'node:fs'
import { test } from 'tomer'
import { getAllFiles, getAllFilesSync } from '../src/index.ts'

const fixtures = `./test/fixtures`

test(`sync finds 6 files`, () => {
  let count = 0

  for (const filename of getAllFilesSync(fixtures)) {
    expect(existsSync(filename)).toBeTrue()
    count++
  }

  expect(count).toBe(6)
})

test(`sync with filter finds 5 files`, () => {
  let count = 0

  for (const filename of getAllFilesSync(fixtures, {
    isExcludedDir: path => path.endsWith(`sort of real/`),
  })) {
    expect(existsSync(filename)).toBeTrue()
    count++
  }

  expect(count).toBe(5)
})

test(`sync array finds 6 files`, () => {
  const files = getAllFilesSync(fixtures)

  expect(files.toArray()).toHaveLength(6)
})

test(`async with filter finds 5 files`, async () => {
  let count = 0

  for await (const filename of getAllFiles(fixtures, {
    isExcludedDir: path => path.endsWith(`sort of real/`),
  })) {
    expect(existsSync(filename)).toBeTrue()
    count++
  }

  expect(count).toBe(5)
})

test(`async finds 6 files`, async () => {
  let count = 0

  for await (const filename of getAllFiles(fixtures)) {
    expect(existsSync(filename)).toBeTrue()
    count++
  }

  expect(count).toBe(6)
})

test(`async array finds 6 files`, async () => {
  const files = getAllFiles(fixtures)

  expect(await files.toArray()).toHaveLength(6)
})
