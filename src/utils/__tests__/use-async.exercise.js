import {renderHook, act} from '@testing-library/react-hooks'
import {useAsync} from '../hooks'

beforeEach(() => {
  jest.spyOn(console, 'error')
})

afterEach(() => {
  console.error.mockRestore()
})

function deferred() {
  let resolve, reject
  const promise = new Promise((res, rej) => {
    resolve = res
    reject = rej
  })
  return {promise, resolve, reject}
}

function getUseAsyncState(config) {
  return {
    data: null,
    error: null,
    isError: false,
    isIdle: true,
    isLoading: false,
    isSuccess: false,
    reset: expect.any(Function),
    run: expect.any(Function),
    setData: expect.any(Function),
    setError: expect.any(Function),
    status: 'idle',
    ...config,
  }
}

describe('UseAsync Hook', () => {
  it('should be able to call run with a promise which resolves', async () => {
    const {promise, resolve} = deferred()
    const resolvedValue = Symbol('resolved value')

    const {result} = renderHook(() => useAsync())
    expect(result.current).toEqual(getUseAsyncState())

    let p
    act(() => {
      p = result.current.run(promise)
    })

    expect(result.current).toEqual(
      getUseAsyncState({isIdle: false, isLoading: true, status: 'pending'}),
    )

    await act(async () => {
      resolve(resolvedValue)
      await p
    })

    expect(result.current).toEqual(
      getUseAsyncState({
        isIdle: false,
        isSuccess: true,
        status: 'resolved',
        data: resolvedValue,
      }),
    )

    act(() => {
      result.current.reset()
    })

    expect(result.current).toEqual(getUseAsyncState())
  })

  it('should be able to call run with a promise which rejects', async () => {
    const {promise, reject} = deferred()

    const {result} = renderHook(() => useAsync())
    expect(result.current).toEqual(getUseAsyncState())

    let p
    act(() => {
      p = result.current.run(promise)
    })

    expect(result.current).toEqual(
      getUseAsyncState({isIdle: false, isLoading: true, status: 'pending'}),
    )

    const rejectedValue = Symbol('rejected value')
    await act(async () => {
      reject(rejectedValue)
      await p.catch(() => {
        // ignore error
      })
    })

    expect(result.current).toEqual(
      getUseAsyncState({
        isIdle: false,
        isError: true,
        status: 'rejected',
        error: rejectedValue,
      }),
    )

    act(() => {
      result.current.reset()
    })

    expect(result.current).toEqual(getUseAsyncState())
  })

  it('should be able to specify an initial state', async () => {
    const customInitialState = {
      status: 'resolved',
      data: Symbol('resolved value'),
    }
    const {result} = renderHook(() => useAsync(customInitialState))

    expect(result.current).toEqual(
      getUseAsyncState({
        ...customInitialState,
        isIdle: false,
        isSuccess: true,
      }),
    )
  })

  it('should be able to set the data', async () => {
    const mockedData = Symbol('resolved value')
    const {result} = renderHook(() => useAsync())

    act(() => {
      result.current.setData(mockedData)
    })

    expect(result.current).toEqual(
      getUseAsyncState({
        data: mockedData,
        isIdle: false,
        isSuccess: true,
        status: 'resolved',
      }),
    )
  })

  it('should be able to set the error', async () => {
    const mockedError = Symbol('rejected value')
    const {result} = renderHook(() => useAsync())

    act(() => {
      result.current.setError(mockedError)
    })

    expect(result.current).toEqual(
      getUseAsyncState({
        error: mockedError,
        isIdle: false,
        isError: true,
        status: 'rejected',
      }),
    )
  })

  it('sould not update the state if the component is unmounted while pending', async () => {
    const {promise, resolve} = deferred()
    const {result, unmount} = renderHook(() => useAsync())

    let p
    act(() => {
      p = result.current.run(promise)
    })

    unmount()
    await act(async () => {
      resolve()
      await p
    })

    expect(console.error).not.toHaveBeenCalled()
  })

  it('sould return an early error if "run" is called without a promise', async () => {
    const {result} = renderHook(() => useAsync())

    expect(() => result.current.run()).toThrowErrorMatchingInlineSnapshot(
      `"The argument passed to useAsync().run must be a promise. Maybe a function that's passed isn't returning anything?"`,
    )
  })
})
