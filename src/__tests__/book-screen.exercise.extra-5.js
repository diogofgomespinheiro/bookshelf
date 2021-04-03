// 🐨 here are the things you're going to need for this test:
import * as React from 'react'

import {
  render,
  screen,
  waitForLoadingToFinish,
  waitFor,
  userEvent,
  loginAsUser,
} from 'test/app-test-utils'
import faker from 'faker'
import {buildBook, buildListItem} from 'test/generate'
import * as booksDB from 'test/data/books'
import * as listItemsDb from 'test/data/list-items'
import {formatDate} from 'utils/misc'
import {App} from 'app'

test('renders all the book information', async () => {
  const book = await booksDB.create(buildBook())
  const route = `/book/${book.id}`

  await render(<App />, {route})

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
    screen.queryByRole('textbox', {name: /notes/i}),
  ).not.toBeInTheDocument()
  expect(screen.queryByRole('radio', {name: /star/i})).not.toBeInTheDocument()
  expect(screen.queryByLabelText(/start date/i)).not.toBeInTheDocument()
})

test('can create a list item for the book', async () => {
  const book = await booksDB.create(buildBook())
  const route = `/book/${book.id}`

  await render(<App />, {route})

  const addToListButton = screen.getByRole('button', {name: /add to list/i})
  userEvent.click(addToListButton)
  expect(addToListButton).toBeDisabled()

  await waitForLoadingToFinish()

  expect(
    screen.getByRole('button', {name: /remove from list/i}),
  ).toBeInTheDocument()
  expect(
    screen.getByRole('button', {name: /mark as read/i}),
  ).toBeInTheDocument()
  expect(screen.getByRole('textbox', {name: /notes/i})).toBeInTheDocument()

  const startDateNode = screen.getByLabelText(/start date/i)
  expect(startDateNode).toHaveTextContent(formatDate(new Date()))

  expect(
    screen.queryByRole('button', {name: /add to list/i}),
  ).not.toBeInTheDocument()
  expect(
    screen.queryByRole('button', {name: /mark as unread/i}),
  ).not.toBeInTheDocument()
  expect(screen.queryByRole('radio', {name: /star/i})).not.toBeInTheDocument()
})

test('can remove a list item for the book', async () => {
  const user = await loginAsUser()
  const book = await booksDB.create(buildBook())
  const route = `/book/${book.id}`
  await listItemsDb.create(buildListItem({book, owner: user}))

  await render(<App />, {route, user})

  const removeFromListButton = screen.getByRole('button', {
    name: /remove from list/i,
  })
  userEvent.click(removeFromListButton)
  expect(removeFromListButton).toBeDisabled()

  await waitForLoadingToFinish()

  expect(screen.getByRole('button', {name: /add to list/i})).toBeInTheDocument()
  expect(
    screen.queryByRole('button', {name: /remove from list/i}),
  ).not.toBeInTheDocument()
})

test('can mark a list item as read', async () => {
  const user = await loginAsUser()
  const book = await booksDB.create(buildBook())
  const route = `/book/${book.id}`
  const listItem = await listItemsDb.create(
    buildListItem({book, owner: user, finishDate: null}),
  )

  await render(<App />, {route, user})

  const markAsReadButton = screen.getByRole('button', {
    name: /mark as read/i,
  })
  userEvent.click(markAsReadButton)
  expect(markAsReadButton).toBeDisabled()

  await waitForLoadingToFinish()

  expect(
    screen.getByRole('button', {name: /mark as unread/i}),
  ).toBeInTheDocument()

  const startAndFinishDateNode = screen.getByLabelText(/start and finish date/i)
  expect(startAndFinishDateNode).toHaveTextContent(
    `${formatDate(listItem.startDate)} — ${formatDate(Date.now())}`,
  )

  expect(
    screen.queryByRole('button', {name: /mark as read/i}),
  ).not.toBeInTheDocument()
})

test('can edit a note', async () => {
  jest.useFakeTimers()
  const user = await loginAsUser()
  const book = await booksDB.create(buildBook())
  const route = `/book/${book.id}`
  const listItem = await listItemsDb.create(
    buildListItem({book, owner: user, finishDate: null}),
  )

  await render(<App />, {route, user})

  const newNotes = faker.lorem.words()
  const notesTextarea = screen.getByRole('textbox', {name: /notes/i})

  userEvent.clear(notesTextarea)
  userEvent.type(notesTextarea, newNotes)

  await screen.findByLabelText(/loading/i)
  await waitForLoadingToFinish()

  expect(notesTextarea).toHaveValue(newNotes)

  expect(await listItemsDb.read(listItem.id)).toMatchObject({
    notes: newNotes,
  })
})
