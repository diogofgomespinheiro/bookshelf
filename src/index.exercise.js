import 'bootstrap/dist/css/bootstrap-reboot.css'
import '@reach/dialog/styles.css'
import * as React from 'react'
import ReactDOM from 'react-dom'

import {Button, Input, FormGroup} from './components/lib'
import {
  AppContainer,
  ButtonsWrapper,
  FormContainer,
} from './styles/index.styles'
import {Modal, ModalContents, ModalOpenButton} from './components/modal'
import {Logo} from './components/logo'

function LoginForm({onSubmit, submitButton}) {
  function handleSubmit(event) {
    event.preventDefault()
    const {username, password} = event.target.elements

    onSubmit({
      username: username.value,
      password: password.value,
    })
  }

  return (
    <FormContainer onSubmit={handleSubmit}>
      <FormGroup>
        <label htmlFor="username">Username</label>
        <Input id="username" />
      </FormGroup>
      <FormGroup>
        <label htmlFor="password">Password</label>
        <Input id="password" type="password" />
      </FormGroup>
      <div>{React.cloneElement(submitButton, {type: 'submit'})}</div>
    </FormContainer>
  )
}

function App() {
  function login(formData) {
    console.log('login', formData)
  }

  function register(formData) {
    console.log('register', formData)
  }

  return (
    <AppContainer>
      <Logo width="80" height="80" />
      <h1>Bookshelf</h1>
      <ButtonsWrapper>
        <Modal>
          <ModalOpenButton>
            <Button variant="primary">Login</Button>
          </ModalOpenButton>
          <ModalContents aria-label="Login form" title="Login">
            <LoginForm
              onSubmit={login}
              submitButton={<Button variant="primary">Login</Button>}
            />
          </ModalContents>
        </Modal>
        <Modal>
          <ModalOpenButton>
            <Button variant="secondary">Register</Button>
          </ModalOpenButton>
          <ModalContents aria-label="Registration form" title="Register">
            <LoginForm
              onSubmit={register}
              submitButton={<Button variant="secondary">Register</Button>}
            />
          </ModalContents>
        </Modal>
      </ButtonsWrapper>
    </AppContainer>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
