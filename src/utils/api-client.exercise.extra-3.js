import * as auth from 'auth-provider'
const apiURL = process.env.REACT_APP_API_URL

function client(endpoint, {token, ...customConfig} = {}) {
  const config = {
    method: 'GET',
    ...customConfig,
    headers: {
      ...customConfig.headers,
      ...(token && {Authorization: `Bearer ${token}`}),
    },
  }

  return window.fetch(`${apiURL}/${endpoint}`, config).then(async response => {
    if (response.status === 401) {
      await auth.logout()
      window.location.assign(window.location)
      return Promise.reject({message: 'Please authenticate again'})
    }

    const data = await response.json()
    if (response.ok) {
      return data
    } else {
      return Promise.reject(data)
    }
  })
}

export {client}
