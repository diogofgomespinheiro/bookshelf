import '@testing-library/jest-dom'
import {waitFor, act} from '@testing-library/react'
import {queryCache} from 'react-query'

import {server} from 'test/server'
import * as auth from 'auth-provider'
import * as listItemsDB from 'test/data/list-items'
import * as booksDB from 'test/data/books'
import * as usersDB from 'test/data/users'

jest.mock('components/profiler')

// enable API mocking in test runs using the same request handlers
// as for the client-side mocking.
beforeAll(() => server.listen())
afterAll(() => server.close())
afterEach(() => server.resetHandlers())

afterEach(async () => {
  queryCache.clear()
  await Promise.all([
    auth.logout(),
    usersDB.reset(),
    booksDB.reset(),
    listItemsDB.reset(),
  ])
})

afterEach(async () => {
  // waitFor is important here. If there are queries that are being fetched at
  // the end of the test and we continue on to the next test before waiting for
  // them to finalize, the tests can impact each other in strange ways.
  await waitFor(() => expect(queryCache.isFetching).toBe(0))
  if (jest.isMockFunction(setTimeout)) {
    act(() => jest.runOnlyPendingTimers())
    jest.useRealTimers()
  }
})
