// 🐨 here are the things you're going to need for this test:
import * as React from 'react'
import {render, screen, waitForElementToBeRemoved} from '@testing-library/react'
import {queryCache} from 'react-query'
import {buildUser, buildBook} from 'test/generate'
import * as auth from 'auth-provider'
import {AppProviders} from 'context'
import {App} from 'app'

afterEach(async () => {
  auth.logout()
  queryCache.clear()
})

test('renders all the book information', async () => {
  const fakeToken = 'FAKE_TOKEN'
  const user = buildUser({token: fakeToken})
  const book = buildBook()

  window.localStorage.setItem(auth.localStorageKey, fakeToken)

  window.history.pushState({}, 'Test page', `/book/${book.id}`)
  const originalFetch = window.fetch
  window.fetch = async (url, config) => {
    if (url.endsWith('/bootstrap')) {
      return {
        ok: true,
        json: async () => ({
          user,
          listItems: [],
        }),
      }
    }

    if (url.endsWith(`/books/${book.id}`)) {
      return {
        ok: true,
        json: async () => ({
          book,
        }),
      }
    }
    console.log(url, config)
    return originalFetch(url, config)
  }

  render(<App />, {wrapper: AppProviders})
  await waitForElementToBeRemoved(() => screen.getByLabelText(/loading/i))

  expect(screen.getByRole('heading', {name: book.title})).toBeInTheDocument()
  expect(screen.getByText(book.author)).toBeInTheDocument()
  expect(screen.getByText(book.publisher)).toBeInTheDocument()
  expect(screen.getByText(book.synopsis)).toBeInTheDocument()
  expect(screen.getByRole('img', {name: /book cover/i})).toHaveAttribute(
    'src',
    book.coverImgUrl,
  )
  expect(screen.getByRole('button', {name: /add to list/i})).toBeInTheDocument()
  expect(
    screen.queryByRole('button', {name: /remove from list/i}),
  ).not.toBeInTheDocument()
  expect(
    screen.queryByRole('button', {name: /mark as read/i}),
  ).not.toBeInTheDocument()
  expect(
    screen.queryByRole('button', {name: /mark as unread/i}),
  ).not.toBeInTheDocument()
  expect(
    screen.queryByRole('textarea', {name: /notes/i}),
  ).not.toBeInTheDocument()
  expect(screen.queryByRole('radio', {name: /star/i})).not.toBeInTheDocument()
  expect(screen.queryByLabelText(/start date/i)).not.toBeInTheDocument()
})
