import {formatDate} from '../misc'

describe('Misc', () => {
  it('should format the date to the format of month/year', () => {
    expect(formatDate(new Date('2020-07-13'))).toBe('Jul 20')
  })
})
