import {client} from 'utils/api-client'

export const getListItems = user => async () => {
  const result = await client('list-items', {token: user.token})
  return result.listItems
}

export const createListItem = (bookId, user) => {
  return client(`list-items`, {
    token: user.token,
    data: {bookId},
  })
}

export const updateListItem = (data, user) => {
  return client(`list-items/${data.id}`, {
    method: 'PUT',
    token: user.token,
    data,
  })
}

export const deleteListItem = (listItemId, user) => {
  return client(`list-items/${listItemId}`, {
    method: 'DELETE',
    token: user.token,
  })
}
