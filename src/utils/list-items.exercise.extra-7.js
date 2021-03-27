import {useQuery, useMutation, queryCache} from 'react-query'

import {setQueryDataForBook} from './books'
import {
  getListItems,
  updateListItem,
  createListItem,
  deleteListItem,
} from 'services/list-items.service'

export const setQueryDataForListItems = listItems => {
  queryCache.setQueryData('list-items', listItems)
}

export const getQueryDataFromListItems = () =>
  queryCache.getQueryData('list-items')

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
  onError: (error, variables, recover) =>
    typeof recover === 'function' ? recover() : null,
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
    onMutate: data => {
      const cachedListItems = getQueryDataFromListItems()
      const newItems = cachedListItems.map(listItem =>
        listItem.id === data.id ? {...listItem, ...data} : listItem,
      )
      setQueryDataForListItems(newItems)
      return () => setQueryDataForListItems(cachedListItems)
    },
    ...options,
  })
}

export const useRemoveListItem = (user, options = {}) => {
  return useMutation(listItemId => deleteListItem(listItemId, user), {
    ...defaultMutationOptions,
    onMutate: listItemId => {
      const cachedListItems = getQueryDataFromListItems()
      const newItems = cachedListItems.filter(
        listItem => listItem.id !== listItemId,
      )
      setQueryDataForListItems(newItems)
      return () => setQueryDataForListItems(cachedListItems)
    },
    ...options,
  })
}
