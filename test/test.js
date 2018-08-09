/* eslint-env mocha */
require('should')
const path = require('path')
const getAllFiles = require('../index')

const fixtures = path.join(__dirname, 'fixtures')

describe('get-all-files', () => {
  it('should find 6 files', () =>
    getAllFiles(fixtures).then(filenames => filenames.length.should.be.exactly(6))
  )

  it('should filter by glob', () => {
    getAllFiles(fixtures, '*.txt', {matchBase: true}).then(filenames => filenames.length.should.be.exactly(1))
  })

  it('should filter by predicate', () => {
    getAllFiles(fixtures, filename => filename.indexOf('.') === -1).then(filenames => filenames.length.should.be.exactly(3))
  })
})
