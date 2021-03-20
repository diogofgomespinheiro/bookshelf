import '@reach/dialog/styles.css'
import * as React from 'react'
import ReactDOM from 'react-dom'
import {Dialog} from '@reach/dialog'

import {Logo} from './components/logo'

const dialogOptions = {
  none: 'none',
  login: 'login',
  register: 'register',
}

const App = () => {
  const [selectedDialog, setSelectedDialog] = React.useState(dialogOptions.none)

  return (
    <div>
      <Logo height="80" width="80" />
      <h1>Bookshelf</h1>
      <div>
        <button onClick={() => setSelectedDialog(dialogOptions.login)}>
          Login
        </button>
      </div>
      <div>
        <button onClick={() => setSelectedDialog(dialogOptions.register)}>
          Register
        </button>
      </div>

      <Dialog
        aria-label="Login Form"
        isOpen={selectedDialog === dialogOptions.login}
      >
        <div>
          <button
            className="close-button"
            onClick={() => setSelectedDialog(dialogOptions.none)}
          >
            Close
          </button>
        </div>
        <h3>Login</h3>
      </Dialog>
      <Dialog
        aria-label="Register Form"
        isOpen={selectedDialog === dialogOptions.register}
      >
        <div>
          <button
            className="close-button"
            onClick={() => setSelectedDialog(dialogOptions.none)}
          >
            Close
          </button>
        </div>
        <h3>Register</h3>
      </Dialog>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
