/** @jsx jsx */
import {jsx} from '@emotion/core'

import * as React from 'react'
import * as auth from 'auth-provider'
import {AuthenticatedApp} from './authenticated-app'
import {UnauthenticatedApp} from './unauthenticated-app'
import {client} from 'utils/api-client.exercise.extra-1'

function App() {
  const [user, setUser] = React.useState(null)

  React.useEffect(() => {
    const fetchUser = async () => {
      const token = await auth.getToken()
      if (!token) return

      console.log(token)

      const data = await client('me', {token})
      setUser(data.user)
    }

    fetchUser()
  }, [])

  const login = async form => {
    const user = await auth.login(form)
    setUser(user)
  }

  const register = async form => {
    const user = await auth.register(form)
    setUser(user)
  }

  const logout = async () => {
    auth.logout()
    setUser(null)
  }

  if (!user) {
    return <UnauthenticatedApp login={login} register={register} />
  }

  return <AuthenticatedApp user={user} logout={logout} />
}

export {App}

/*
eslint
  no-unused-vars: "off",
*/
