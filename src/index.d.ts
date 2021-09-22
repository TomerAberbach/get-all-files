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

export type Options = {
  resolve?: boolean
  isExcludedDir?: (dirname: string) => boolean
}

export type Filenames = {
  [Symbol.asyncIterator]: () => AsyncIterator<string>
  toArray: () => Promise<Array<string>>
}

export const getAllFiles: (filename: string, options?: Options) => Filenames

export type FilenamesSync = {
  [Symbol.iterator]: () => Iterator<string>
  toArray: () => Array<string>
}

export const getAllFilesSync: (
  filename: string,
  options?: Options,
) => FilenamesSync
