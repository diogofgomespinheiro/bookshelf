import * as React from 'react'
import * as auth from 'auth-provider'

import {FullPageSpinner, FullPageErrorFallback} from 'components/lib'

import {client} from 'utils/api-client'
import {useAsync} from 'utils/hooks'

const AuthContext = React.createContext()
AuthContext.displayName = 'AuthContext'

const getUser = async () => {
  let user = null

  const token = await auth.getToken()
  if (token) {
    const data = await client('me', {token})
    user = data.user
  }

  return user
}

const AuthProvider = ({children}) => {
  const {
    data: user,
    error,
    isLoading,
    isIdle,
    isError,
    run,
    setData,
  } = useAsync()

  React.useEffect(() => {
    run(getUser())
  }, [run])

  const login = form => auth.login(form).then(user => setData(user))
  const register = form => auth.register(form).then(user => setData(user))
  const logout = () => {
    auth.logout()
    setData(null)
  }

  if (isLoading || isIdle) {
    return <FullPageSpinner />
  }

  if (isError) {
    return <FullPageErrorFallback error={error} />
  }

  const value = {user, login, register, logout}

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

const useAuth = () => {
  const context = React.useContext(AuthContext)
  if (context === undefined || typeof context === 'undefined') {
    throw new Error(`useAuth must be used within a AuthProvider`)
  }
  return context
}

export {AuthProvider, useAuth}
