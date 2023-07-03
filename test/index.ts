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
import 'tomer'
import { getAllFiles, getAllFilesSync } from '../src/index.js'

const fixtures = `./test/fixtures`

test(`sync finds 6 files`, () => {
  let count = 0

  for (const filename of getAllFilesSync(fixtures)) {
    expect(fs.existsSync(filename)).toBeTrue()
    count++
  }

  expect(count).toBe(6)
})

test(`sync array finds 6 files`, () => {
  const files = getAllFilesSync(fixtures)

  expect(files.toArray()).toHaveLength(6)
})

test(`async finds 6 files`, async () => {
  let count = 0

  for await (const filename of getAllFiles(fixtures)) {
    await fs.promises.access(filename)
    count++
  }

  expect(count).toBe(6)
})

test(`async array finds 6 files`, async () => {
  const files = getAllFiles(fixtures)

  expect(await files.toArray()).toHaveLength(6)
})
