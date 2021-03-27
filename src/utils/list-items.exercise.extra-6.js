import {useQuery, useMutation, queryCache} from 'react-query'

import {setQueryDataForBook} from './books'
import {
  getListItems,
  updateListItem,
  createListItem,
  deleteListItem,
} from 'services/list-items.service'

export const useListItems = user => {
  const {data} = useQuery('list-items', getListItems(user), {
    onSuccess: listItems => {
      listItems.forEach(listItem => setQueryDataForBook(listItem.book))
    },
  })
  return data ?? []
}

export const useListItem = (user, bookId) => {
  const listItems = useListItems(user)
  const listItem = listItems.find(listItem => listItem.bookId === bookId)
  return listItem ?? null
}

const defaultMutationOptions = {
  onSettled: () => queryCache.invalidateQueries('list-items'),
}

export const useCreateListItem = (user, options = {}) => {
  return useMutation(bookId => createListItem(bookId, user), {
    ...defaultMutationOptions,
    ...options,
  })
}

export const useUpdateListItem = (user, options = {}) => {
  return useMutation(data => updateListItem(data, user), {
    ...defaultMutationOptions,
    ...options,
  })
}

export const useRemoveListItem = (user, options = {}) => {
  return useMutation(listItemId => deleteListItem(listItemId, user), {
    ...defaultMutationOptions,
    ...options,
  })
}
