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

import { expectAssignable, expectType } from 'tsd'
import { getAllFiles, getAllFilesSync } from '../src'

expectAssignable<AsyncIterable<string>>(getAllFiles('sdfsd'))
expectAssignable<AsyncIterable<string>>(getAllFiles('sdfsd', {}))
expectAssignable<AsyncIterable<string>>(
  getAllFiles('sdfsd', {
    resolve: true,
    isExcludedDir: x => x.startsWith('s'),
  }),
)
expectType<Promise<Array<string>>>(getAllFiles('sdfsd').toArray())
expectType<Promise<Array<string>>>(getAllFiles('sdfsd', {}).toArray())
expectType<Promise<Array<string>>>(
  getAllFiles('sdfsd', {
    resolve: true,
    isExcludedDir: x => x.startsWith('s'),
  }).toArray(),
)

expectAssignable<Iterable<string>>(getAllFilesSync('sdfsd'))
expectAssignable<Iterable<string>>(getAllFilesSync('sdfsd', {}))
expectAssignable<Iterable<string>>(
  getAllFilesSync('sdfsd', {
    resolve: true,
    isExcludedDir: x => x.startsWith('s'),
  }),
)
expectType<Array<string>>(getAllFilesSync('sdfsd').toArray())
expectType<Array<string>>(getAllFilesSync('sdfsd', {}).toArray())
expectType<Array<string>>(
  getAllFilesSync('sdfsd', {
    resolve: true,
    isExcludedDir: x => x.startsWith('s'),
  }).toArray(),
)
