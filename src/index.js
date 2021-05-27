import fs from 'fs'
import { sep, resolve } from 'path'

const fa = fs.promises

const normalizeOptions = ({
  resolve = false,
  isExcludedDir = () => false
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
    toArray: () => [...files]
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
    }
  }
}

function walk(dirnames, filenames, notifier, options) {
  if (dirnames.length === 0) {
    notifier.done = true
    return
  }

  const children = []
  let pending = dirnames.length

  for (const dirname of dirnames) {
    if (options.isExcludedDir(dirname)) {
      continue
    }

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

      if (--pending === 0) {
        walk(children, filenames, notifier, options)
      }
    })
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
    }
  }

  return files
}
