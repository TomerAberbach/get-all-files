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
import { sep, resolve } from 'path'

const fa = fs.promises

const normalizeOptions = ({
  resolve = false,
  isExcludedDir = () => false,
} = {}) => ({ resolve, isExcludedDir })

const normalizeDirname = (dirname, options) => {
  if (options.resolve === true) {
    dirname = resolve(dirname)
  }

  if (dirname.length > 0 && dirname[dirname.length - 1] !== sep) {
    dirname += sep
  }

  return dirname
}

export const getAllFilesSync = (filename, options) => {
  options = normalizeOptions(options)

  const files = {
    *[Symbol.iterator]() {
      if (!fs.lstatSync(filename).isDirectory()) {
        yield filename
        return
      }

      yield* (function* walk(dirname) {
        if (options.isExcludedDir(dirname)) {
          return
        }

        for (const dirent of fs.readdirSync(dirname, { withFileTypes: true })) {
          const filename = dirname + dirent.name

          if (dirent.isDirectory()) {
            yield* walk(filename + sep)
          } else {
            yield filename
          }
        }
      })(normalizeDirname(filename, options))
    },
    toArray: () => [...files],
  }

  return files
}

function createNotifier() {
  let done = false
  // eslint-disable-next-line no-empty-function
  let resolve = () => {}
  // eslint-disable-next-line no-empty-function
  let reject = () => {}
  let notified = new Promise((pResolve, pReject) => {
    resolve = pResolve
    reject = pReject
  })

  return {
    resolve() {
      const oldResolve = resolve
      notified = new Promise((pResolve, pReject) => {
        resolve = pResolve
        reject = pReject
      })
      oldResolve()
    },
    reject(error) {
      reject(error)
    },
    get done() {
      return done
    },
    set done(value) {
      done = value
    },
    onResolved() {
      return notified
    },
  }
}

function walk(dirnames, filenames, notifier, options) {
  if (dirnames.length === 0) {
    notifier.done = true
    return
  }

  const children = []
  let pendingPromises = 0

  for (const dirname of dirnames) {
    if (options.isExcludedDir(dirname)) {
      continue
    }

    pendingPromises++

    // eslint-disable-next-line no-loop-func
    fs.readdir(dirname, { withFileTypes: true }, (error, dirents) => {
      if (error != null) {
        notifier.reject(error)
        return
      }

      for (const dirent of dirents) {
        const filename = dirname + dirent.name

        if (dirent.isDirectory()) {
          children.push(filename + sep)
        } else {
          filenames.push(filename)
        }
      }

      notifier.resolve()

      if (--pendingPromises === 0) {
        walk(children, filenames, notifier, options)
      }
    })
  }

  if (pendingPromises === 0) {
    notifier.done = true
  }
}

export const getAllFiles = (filename, options) => {
  options = normalizeOptions(options)
  const files = {
    async *[Symbol.asyncIterator]() {
      if (!(await fa.lstat(filename)).isDirectory()) {
        yield filename
        return
      }

      const filenames = []
      const notifier = createNotifier()

      walk([normalizeDirname(filename, options)], filenames, notifier, options)

      do {
        await notifier.onResolved()
        while (filenames.length > 0) {
          yield filenames.pop()
        }
      } while (!notifier.done)
    },
    toArray: async () => {
      const filenames = []

      for await (const filename of files) {
        filenames.push(filename)
      }

      return filenames
    },
  }

  return files
}
