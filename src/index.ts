import { lstatSync, readdirSync } from 'node:fs'
import { lstat, readdir } from 'node:fs/promises'
import { resolve, sep } from 'node:path'

export const getAllFilesSync = (
  filename: string,
  options?: Options,
): FilenamesSync => {
  const normalizedOptions = normalizeOptions(options)

  const files = {
    *[Symbol.iterator]() {
      if (!lstatSync(filename).isDirectory()) {
        yield filename
        return
      }

      yield* (function* walk(dirname: string): Iterable<string> {
        if (normalizedOptions.isExcludedDir(dirname)) {
          return
        }

        for (const dirent of readdirSync(dirname, { withFileTypes: true })) {
          const filename = dirname + dirent.name

          if (dirent.isDirectory()) {
            yield* walk(filename + sep)
          } else {
            yield filename
          }
        }
      })(normalizeDirname(filename, normalizedOptions))
    },
    toArray: () => [...files],
  }

  return files
}

export type FilenamesSync = {
  [Symbol.iterator]: () => Iterator<string>
  toArray: () => string[]
}

export const getAllFiles = (filename: string, options?: Options): Filenames => {
  const normalizedOptions: Required<Options> = normalizeOptions(options)

  const files = {
    async *[Symbol.asyncIterator]() {
      if (!(await lstat(filename)).isDirectory()) {
        yield filename
        return
      }

      const dirnames: string[] = []
      let filenames: string[] = []
      const promises = new Set<Promise<void>>()
      const walk = async (dirname: string) => {
        const promise = (async () => {
          if (normalizedOptions.isExcludedDir(dirname)) {
            return
          }

          for (const dirent of await readdir(dirname, {
            withFileTypes: true,
          })) {
            const filename = dirname + dirent.name

            if (dirent.isDirectory()) {
              dirnames.push(filename + sep)
            } else {
              filenames.push(filename)
            }
          }
        })()
        promises.add(promise)
        await promise
        promises.delete(promise)
      }

      void walk(normalizeDirname(filename, normalizedOptions))

      while (true) {
        await Promise.race(promises)

        if (filenames.length > 0) {
          const previousFilenames = filenames
          filenames = []
          yield* previousFilenames
        }

        while (dirnames.length > 0) {
          void walk(dirnames.pop()!)
        }

        if (promises.size === 0) {
          break
        }
      }
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

export type Filenames = {
  [Symbol.asyncIterator]: () => AsyncIterator<string>
  toArray: () => Promise<string[]>
}

const normalizeOptions = ({
  resolve = false,
  isExcludedDir = () => false,
}: Options = {}): Required<Options> => ({ resolve, isExcludedDir })

const normalizeDirname = (
  dirname: string,
  options: Required<Options>,
): string => {
  if (options.resolve) {
    dirname = resolve(dirname)
  }

  if (dirname.length > 0 && dirname.at(-1) !== sep) {
    dirname += sep
  }

  return dirname
}

export type Options = {
  readonly resolve?: boolean
  readonly isExcludedDir?: (dirname: string) => boolean
}
