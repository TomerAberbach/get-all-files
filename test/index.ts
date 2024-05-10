import { existsSync } from 'node:fs'
import { test } from 'tomer'
import { getAllFiles, getAllFilesSync } from '../src/index.ts'

const fixtures = `./test/fixtures`

test.each([undefined, { resolve: true }, { resolve: false }])(
  `sync finds file - %p`,
  options => {
    let count = 0

    for (const filename of getAllFilesSync(`${fixtures}/wow`, options)) {
      expect(existsSync(filename)).toBeTrue()
      count++
    }

    expect(count).toBe(1)
  },
)

test.each([undefined, { resolve: true }, { resolve: false }])(
  `sync finds 6 files - %p`,
  options => {
    let count = 0

    for (const filename of getAllFilesSync(fixtures, options)) {
      expect(existsSync(filename)).toBeTrue()
      count++
    }

    expect(count).toBe(6)
  },
)

test.each([undefined, { resolve: true }, { resolve: false }])(
  `sync with filter finds 5 files - %p`,
  options => {
    let count = 0

    for (const filename of getAllFilesSync(fixtures, {
      isExcludedDir: path => path.endsWith(`sort of real/`),
      ...options,
    })) {
      expect(existsSync(filename)).toBeTrue()
      count++
    }

    expect(count).toBe(5)
  },
)

test.each([undefined, { resolve: true }, { resolve: false }])(
  `sync array finds 6 files - resolve %p`,
  options => {
    const files = getAllFilesSync(fixtures, options)

    expect(files.toArray()).toHaveLength(6)
  },
)

test.each([undefined, { resolve: true }, { resolve: false }])(
  `async finds file - %p`,
  async options => {
    let count = 0

    for await (const filename of getAllFiles(`${fixtures}/wow`, options)) {
      expect(existsSync(filename)).toBeTrue()
      count++
    }

    expect(count).toBe(1)
  },
)

test.each([undefined, { resolve: true }, { resolve: false }])(
  `async with filter finds 5 files - %p`,
  async options => {
    let count = 0

    for await (const filename of getAllFiles(fixtures, {
      isExcludedDir: path => path.endsWith(`sort of real/`),
      ...options,
    })) {
      expect(existsSync(filename)).toBeTrue()
      count++
    }

    expect(count).toBe(5)
  },
)

test.each([undefined, { resolve: true }, { resolve: false }])(
  `async finds 6 files - resolve %p`,
  async options => {
    let count = 0

    for await (const filename of getAllFiles(fixtures, options)) {
      expect(existsSync(filename)).toBeTrue()
      count++
    }

    expect(count).toBe(6)
  },
)

test.each([undefined, { resolve: true }, { resolve: false }])(
  `async array finds 6 files - resolve %p`,
  async options => {
    const files = getAllFiles(fixtures, options)

    expect(await files.toArray()).toHaveLength(6)
  },
)
