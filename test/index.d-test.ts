import { expectAssignable, expectType } from 'tsd'
import { getAllFiles, getAllFilesSync } from '../src'

expectAssignable<AsyncIterable<string>>(getAllFiles('sdfsd'))
expectAssignable<AsyncIterable<string>>(getAllFiles('sdfsd', {}))
expectAssignable<AsyncIterable<string>>(
  getAllFiles('sdfsd', {
    resolve: true,
    isExcludedDir: x => x.startsWith('s')
  })
)
expectType<Promise<Array<string>>>(getAllFiles('sdfsd').toArray())
expectType<Promise<Array<string>>>(getAllFiles('sdfsd', {}).toArray())
expectType<Promise<Array<string>>>(
  getAllFiles('sdfsd', {
    resolve: true,
    isExcludedDir: x => x.startsWith('s')
  }).toArray()
)

expectAssignable<Iterable<string>>(getAllFilesSync('sdfsd'))
expectAssignable<Iterable<string>>(getAllFilesSync('sdfsd', {}))
expectAssignable<Iterable<string>>(
  getAllFilesSync('sdfsd', {
    resolve: true,
    isExcludedDir: x => x.startsWith('s')
  })
)
expectType<Array<string>>(getAllFilesSync('sdfsd').toArray())
expectType<Array<string>>(getAllFilesSync('sdfsd', {}).toArray())
expectType<Array<string>>(
  getAllFilesSync('sdfsd', {
    resolve: true,
    isExcludedDir: x => x.startsWith('s')
  }).toArray()
)
