import {client} from 'utils/api-client'

export const getBookById = (bookId, user) => async () => {
  const data = await client(`books/${bookId}`, {token: user.token})
  return data.book
}

export const getBooks = (query, user) => async () => {
  const result = await client(`books?query=${encodeURIComponent(query)}`, {
    token: user.token,
  })
  return result.books
}
