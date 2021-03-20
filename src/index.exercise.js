import * as React from 'react'
import ReactDOM from 'react-dom'

import {Logo} from './components/logo'

const App = () => {
  const handleClick = alertMessage => event => {
    console.log(event)
    alert(alertMessage)
  }
  return (
    <div>
      <Logo height="80" width="80" />
      <h1>Bookshelf</h1>
      <div>
        <button onClick={handleClick('Login Clicked')}>Login</button>
      </div>
      <div>
        <button onClick={handleClick('Register Clicked')}>Register</button>
      </div>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
