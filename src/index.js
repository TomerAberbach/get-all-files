import fs from 'fs'
import { sep, resolve } from 'path'

const fa = fs.promises

function normalizeOptions({
  resolve = false,
  isExcludedDir = () => false
} = {}) {
  return { resolve, isExcludedDir }
}

function normalizeDirname(dirname, options) {
  if (options.resolve === true) {
    dirname = resolve(dirname)
  }

  if (dirname.length > 0 && dirname[dirname.length - 1] !== sep) {
    dirname += sep
  }

  return dirname
}

function* sync(filename, options) {
  options = normalizeOptions(options)

  if (!fs.lstatSync(filename).isDirectory()) {
    return filename
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
}

sync.array = (filename, options) => Array.from(sync(filename, options))

function createNotifier() {
  let done = false
  let resolve = () => {}
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
        walk(children, filenames, notifier)
      }
    })
  }
}

async function* async(filename, options) {
  options = normalizeOptions(options)

  if (!(await fa.lstat(filename)).isDirectory()) {
    return filename
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
}

async.array = async (filename, options) => {
  const iterator = async(filename, options)
  const filenames = []

  for await (const filename of iterator) {
    filenames.push(filename)
  }

  return filenames
}

export default { async, sync }
