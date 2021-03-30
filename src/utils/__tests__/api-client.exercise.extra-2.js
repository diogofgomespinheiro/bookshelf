import {queryCache} from 'react-query'
import * as auth from 'auth-provider'

import {server, rest} from 'test/server'
import {client} from '../api-client'

const apiURL = process.env.REACT_APP_API_URL

jest.mock('react-query')
jest.mock('auth-provider')

describe('Api Client', () => {
  it('should fetchs at the endpoint with the arguments for get requests', async () => {
    const fakeEndpoint = 'test-endpoint'
    const mockResult = {success: true}

    server.use(
      rest.get(`${apiURL}/${fakeEndpoint}`, async (req, res, ctx) => {
        return res(ctx.json(mockResult))
      }),
    )

    const result = await client(fakeEndpoint)
    expect(result).toEqual(mockResult)
  })

  it('should add an auth token when a token is provided', async () => {
    const fakeToken = 'token123'
    const fakeEndpoint = 'test-endpoint'
    const mockResult = {success: true}
    let request

    server.use(
      rest.get(`${apiURL}/${fakeEndpoint}`, async (req, res, ctx) => {
        request = req
        return res(ctx.json(mockResult))
      }),
    )

    await client(fakeEndpoint, {token: fakeToken})

    const authorizationHeader = request.headers.get('Authorization')
    expect(authorizationHeader).toBeDefined()
    expect(authorizationHeader).toBe(`Bearer ${fakeToken}`)
  })

  it('should allow for config overrides', async () => {
    const fakeToken = 'token123'
    const mode = 'cors'
    const cache = 'no-cache'
    const fakeEndpoint = 'test-endpoint'
    const mockResult = {success: true}
    let request

    server.use(
      rest.get(`${apiURL}/${fakeEndpoint}`, async (req, res, ctx) => {
        request = req
        return res(ctx.json(mockResult))
      }),
    )

    await client(fakeEndpoint, {
      token: fakeToken,
      mode,
      headers: {cache},
    })

    const cachedHeader = request.headers.get('cache')
    expect(request.mode).toBe(mode)
    expect(cachedHeader).toBe(cache)
  })

  it('should stringfy data and change the method to POST when data is provided', async () => {
    const fakeEndpoint = 'test-endpoint'
    const mockResult = {success: true}
    const data = {username: 'diogo', password: '123'}
    let request

    server.use(
      rest.post(`${apiURL}/${fakeEndpoint}`, async (req, res, ctx) => {
        request = req
        return res(ctx.json(mockResult))
      }),
    )

    const result = await client(fakeEndpoint, {data})

    expect(request.body).toEqual(data)
    expect(result).toEqual(mockResult)
  })

  it('should log the user out automatically if a request returns a 401', async () => {
    const fakeEndpoint = 'test-endpoint'
    const mockResult = {success: true}

    server.use(
      rest.get(`${apiURL}/${fakeEndpoint}`, async (req, res, ctx) => {
        return res(ctx.status(401), ctx.json(mockResult))
      }),
    )

    const error = await client(fakeEndpoint).catch(e => e)

    expect(error.message).toMatchInlineSnapshot(`"Please re-authenticate."`)

    expect(queryCache.clear).toHaveBeenCalledTimes(1)
    expect(auth.logout).toHaveBeenCalledTimes(1)
  })

  it('should reject the promise if there is an error', async () => {
    const fakeEndpoint = 'test-endpoint'
    const mockError = {message: 'There was an error', success: false}

    server.use(
      rest.get(`${apiURL}/${fakeEndpoint}`, async (req, res, ctx) => {
        return res(ctx.status(400), ctx.json(mockError))
      }),
    )

    await expect(client(fakeEndpoint)).rejects.toEqual(mockError)
  })
})
