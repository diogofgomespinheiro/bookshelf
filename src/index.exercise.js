import * as React from 'react'
import ReactDOM from 'react-dom'

import {Logo} from './components/logo'

// 🐨 create an App component here and render the logo, the title ("Bookshelf"), a login button, and a register button.
// 🐨 for fun, you can add event handlers for both buttons to alert that the button was clicked

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
