import {useQuery} from 'react-query'
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

export const useBookSearch = (query, user) => {
  const {data: books = loadingBooks, ...rest} = useQuery(
    ['bookSearch', {query}],
    getBooks(query, user),
  )

  return {books, ...rest}
}
