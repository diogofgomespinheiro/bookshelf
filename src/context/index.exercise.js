import * as React from 'react'
import {ReactQueryConfigProvider} from 'react-query'
import {BrowserRouter as Router} from 'react-router-dom'

import {AuthProvider} from './auth-context'

const queryConfig = {
  retry(failureCount, error) {
    if (error.status === 404) return false
    return failureCount < 2
  },
  useErrorBoundary: true,
  refetchAllOnWindowFocus: false,
}

const AppProviders = ({children}) => {
  return (
    <ReactQueryConfigProvider config={queryConfig}>
      <Router>
        <AuthProvider>{children}</AuthProvider>
      </Router>
    </ReactQueryConfigProvider>
  )
}

export {AppProviders}
