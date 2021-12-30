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

const fixtures = `./test/fixtures`

const isInList = list => name => list.indexOf(name) > -1
const excludedDirs = [`./test/fixtures/blah/unreal/woah/`]

const options = {
  isExcludedDir: isInList(excludedDirs),
}

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

test(`async array finds 4 files with excluding options object`, async t => {
  t.is((await getAllFiles(fixtures, options).toArray()).length, 4)
})
