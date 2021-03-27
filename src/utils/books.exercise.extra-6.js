import {useQuery, queryCache} from 'react-query'
import {getBookById, getBooks} from 'services/books.service'
import bookPlaceholderSvg from 'assets/book-placeholder.svg'

const loadingBook = {
  title: 'Loading...',
  author: 'loading...',
  coverImageUrl: bookPlaceholderSvg,
  publisher: 'Loading Publishing',
  synopsis: 'Loading...',
  loadingBook: true,
}

const loadingBooks = Array.from({length: 10}, (v, index) => ({
  id: `loading-book-${index}`,
  ...loadingBook,
}))

export const useBook = (bookId, user) => {
  const {data} = useQuery(['book', {bookId}], getBookById(bookId, user))

  return data ?? loadingBook
}

export const setQueryDataForBook = book => {
  queryCache.setQueryData(['book', {bookId: book.id}], book)
}

export const useBookSearch = (query, user) => {
  const {data: books = loadingBooks, ...rest} = useQuery(
    ['bookSearch', {query}],
    getBooks(query, user),
    {
      onSuccess: books => {
        books.forEach(book => setQueryDataForBook(book))
      },
    },
  )

  return {books, ...rest}
}

export const refetchBookSearchQuery = async (user, query = '') => {
  queryCache.removeQueries(['bookSearch', {query}])
  await queryCache.prefetchQuery(['bookSearch', {query}], getBooks(query, user))
}
