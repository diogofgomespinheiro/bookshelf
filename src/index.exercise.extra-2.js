import * as React from 'react'
import ReactDOM from 'react-dom'
import {loadDevTools} from './dev-tools/load'
import {ReactQueryConfigProvider} from 'react-query'

import './bootstrap'
import {App} from './app'

const queryConfig = {
  queries: {
    retry: (attemp, error) => {
      if (error.status === 404) return false

      return attemp < 2
    },
    refetchOnWindowFocus: false,
    useErrorBoundary: true,
  },
}

loadDevTools(() => {
  ReactDOM.render(
    <ReactQueryConfigProvider config={queryConfig}>
      <App />
    </ReactQueryConfigProvider>,
    document.getElementById('root'),
  )
})
