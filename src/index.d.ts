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
  options?: Options
) => FilenamesSync
