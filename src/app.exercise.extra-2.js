/** @jsx jsx */
import {jsx} from '@emotion/core'

import * as React from 'react'
import * as auth from 'auth-provider'
import {AuthenticatedApp} from './authenticated-app'
import {UnauthenticatedApp} from './unauthenticated-app'
import {FullPageSpinner} from 'components/lib'
import {client} from 'utils/api-client.exercise.extra-1'
import {useAsync} from 'utils/hooks'
import * as colors from 'styles/colors'

async function fetchUser() {
  let fetchedUser = null

  const token = await auth.getToken()
  if (token) {
    const data = await client('me', {token})
    fetchedUser = data.user
  }

  return fetchedUser
}

function App() {
  const {
    data: user,
    error,
    isIdle,
    isLoading,
    isError,
    run,
    setData,
  } = useAsync()

  React.useEffect(() => {
    run(fetchUser())
  }, [run])

  const login = async form => {
    const user = await auth.login(form)
    setData(user)
  }

  const register = async form => {
    const user = await auth.register(form)
    setData(user)
  }

  const logout = async () => {
    await auth.logout()
    setData(null)
  }

  if (isLoading || isIdle) return <FullPageSpinner />

  if (isError) {
    return (
      <div
        css={{
          color: colors.danger,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <p>Uh oh... There's a problem. Try refreshing the app.</p>
        <pre>{error.message}</pre>
      </div>
    )
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
