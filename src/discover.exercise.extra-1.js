/** @jsx jsx */
import {jsx} from '@emotion/core'

import './bootstrap'
import {useEffect, useState} from 'react'
import Tooltip from '@reach/tooltip'
import {FaSearch, FaTimes} from 'react-icons/fa'
import {Input, BookListUL, Spinner} from './components/lib'
import {BookRow} from './components/book-row'
import {client} from './utils/api-client'
import * as colors from './styles/colors'

function DiscoverBooksScreen() {
  const [status, setStatus] = useState('idle')
  const [query, setQuery] = useState('')
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [queried, setQueried] = useState(false)

  const isLoading = status === 'loading'
  const isSuccess = status === 'success'
  const isError = status === 'error'

  useEffect(() => {
    if (!queried) return
    const fetchData = async () => {
      setStatus('loading')

      try {
        const result = await client(`books?query=${encodeURIComponent(query)}`)
        setData(result)
        setStatus('success')
      } catch (error) {
        setStatus('error')
        setError(error)
      }
    }

    fetchData()
  }, [queried, query])

  function handleSearchSubmit(event) {
    event.preventDefault()
    const {value: searchValue} = event.target.elements.search
    setQueried(true)
    setQuery(searchValue)
  }

  return (
    <div
      css={{maxWidth: 800, margin: 'auto', width: '90vw', padding: '40px 0'}}
    >
      <form onSubmit={handleSearchSubmit}>
        <Input
          placeholder="Search books..."
          id="search"
          css={{width: '100%'}}
        />
        <Tooltip label="Search Books">
          <label htmlFor="search">
            <button
              type="submit"
              css={{
                border: '0',
                position: 'relative',
                marginLeft: '-35px',
                background: 'transparent',
              }}
            >
              {isLoading ? (
                <Spinner />
              ) : !isError ? (
                <FaSearch aria-label="search" />
              ) : (
                <FaTimes aria-label="error" css={{color: colors.danger}} />
              )}
            </button>
          </label>
        </Tooltip>
      </form>

      {isError && (
        <div css={{color: colors.danger}}>
          <p>There was an error:</p>
          <pre>{error.message}</pre>
        </div>
      )}

      {isSuccess ? (
        data?.books?.length ? (
          <BookListUL css={{marginTop: 20}}>
            {data.books.map(book => (
              <li key={book.id} aria-label={book.title}>
                <BookRow key={book.id} book={book} />
              </li>
            ))}
          </BookListUL>
        ) : (
          <p>No books found. Try another search.</p>
        )
      ) : null}
    </div>
  )
}

export {DiscoverBooksScreen}
