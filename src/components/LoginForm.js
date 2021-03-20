import * as React from 'react'

const LoginForm = ({buttonText, onSubmit}) => {
  const handleSubmit = event => {
    event.preventDefault()
    const [username, password] = event.target.elements

    const formData = {
      username: username.value,
      password: password.value,
    }

    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">Username</label>
        <input id="username" name="username" type="text" />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" />
      </div>
      <div>
        <button type="submit">{buttonText}</button>
      </div>
    </form>
  )
}

export default LoginForm
