import {useQuery, useMutation, queryCache} from 'react-query'

import {
  getListItems,
  updateListItem,
  createListItem,
  deleteListItem,
} from 'services/list-items.service'

export const useListItems = user => {
  const {data} = useQuery('list-items', getListItems(user))
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

export const useCreateListItem = user => {
  return useMutation(
    bookId => createListItem(bookId, user),
    defaultMutationOptions,
  )
}

export const useUpdateListItem = user => {
  return useMutation(data => updateListItem(data, user), defaultMutationOptions)
}

export const useRemoveListItem = user => {
  return useMutation(
    listItemId => deleteListItem(listItemId, user),
    defaultMutationOptions,
  )
}
