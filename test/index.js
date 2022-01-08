/**
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import fs from 'fs'
import test from 'ava'
import { getAllFiles, getAllFilesSync } from '../src/index.js'
import { posix } from 'path'

const fixtures = posix.normalize('./test/fixtures/')
const fixturesBlahUnreal = posix.normalize('./test/fixtures/blah/unreal/')

const isInList =
  (...dirs) =>
  name => {
    const normalizedDirs = dirs.map(dir => dir.replace(/\\/g, '/'))
    const normalizedName = name.replace(/\\/g, '/')
    return normalizedDirs.includes(normalizedName)
  }

const options = directoryList => ({
  isExcludedDir: isInList(directoryList),
})

test(`sync finds 8 files`, t => {
  let count = 0

  for (const filename of getAllFilesSync(fixtures)) {
    t.assert(fs.existsSync(filename))
    count++
  }

  t.is(count, 8)
})

test(`sync array finds 8 files`, t => {
  t.is(getAllFilesSync(fixtures).toArray().length, 8)
})

test(`async finds 8 files`, async t => {
  let count = 0

  for await (const filename of getAllFiles(fixtures)) {
    await fs.promises.access(filename)
    count++
  }

  t.is(count, 8)
})

test(`async array finds 8 files`, async t => {
  t.is((await getAllFiles(fixtures).toArray()).length, 8)
})

test(`async array finds 6 files, excluding a directory`, async t => {
  t.is(
    (
      await getAllFiles(fixtures, {
        isExcludedDir: isInList(`test/fixtures/blah/unreal/woah/`),
      }).toArray()
    ).length,
    6
  )
})

test(`async array finds 2 files, excluding all directories with 2 files in the root folder`, async t => {
  t.is(
    (
      await getAllFiles(fixtures, {
        isExcludedDir: isInList(`test/fixtures/blah/`),
      }).toArray()
    ).length,
    2
  )
})

test(`async array finds 0 files, excluding all directories and no files in the root folder`, async t => {
  t.is(
    (
      await getAllFiles(fixturesBlahUnreal, {
        isExcludedDir: isInList(
          'test/fixtures/blah/unreal/woah/',
          'test/fixtures/blah/unreal/foo/'
        ),
      }).toArray()
    ).length,
    0
  )
})
