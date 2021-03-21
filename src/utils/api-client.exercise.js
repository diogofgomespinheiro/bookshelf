async function client(endpoint, customConfig = {}) {
  const url = `${process.env.REACT_APP_API_URL}/${endpoint}`
  const options = {
    method: 'GET',
    ...customConfig,
    headers: {
      'Content-Type': 'application/json',
      ...customConfig.headers,
    },
  }

  try {
    const response = await window.fetch(url, options)
    const data = await response.json()
    if (response.ok) {
      return data
    } else {
      return Promise.reject(data)
    }
  } catch (error) {
    return Promise.reject(error)
  }
}

export {client}

/*






























💰 spoiler alert below...



























































const config = {
    method: 'GET',
    ...customConfig,
  }
*/
