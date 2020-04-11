import React, { useState, useContext } from "react"
import PropTypes from "prop-types"
import { Redirect } from "react-router-dom"
import { observer } from "mobx-react-lite"
import { rootStoreContext } from "../stores/RootStore"

import "../scss/login-form.scss"
import FormGroup from "@material-ui/core/FormGroup"
import FormControl from "@material-ui/core/FormControl"
import InputLabel from "@material-ui/core/InputLabel"
import Input from "@material-ui/core/Input"
import Button from "@material-ui/core/Button"
import Typography from "@material-ui/core/Typography"

const LoginForm = observer(({ location }) => {
  const rootStore = useContext(rootStoreContext)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const { from } = location.state || { from: { pathname: "/" } }

  const changeUsername = e => setUsername(e.target.value)

  const changePassword = e => setPassword(e.target.value)

  const login = event => {
    event.preventDefault()
    rootStore.authStore.login(username, password)
  }

  if (rootStore.authStore.isAuthenticated) return <Redirect to={from} />

  return (
    <div className="login-form">
      <form className="login-form__form" onSubmit={login}>
        <FormGroup className="login-form__input">
          <FormControl>
            <InputLabel htmlFor="username">Username</InputLabel>
            <Input
              id="username"
              name="username"
              type="username"
              value={username}
              onChange={changeUsername}
              error={rootStore.authStore.error}
              required
            />
          </FormControl>
        </FormGroup>
        <FormGroup className="login-form__input">
          <FormControl>
            <InputLabel htmlFor="password">Password</InputLabel>
            <Input
              id="password"
              name="password"
              value={password}
              type="password"
              onChange={changePassword}
              error={rootStore.authStore.error}
              required
            />
          </FormControl>
        </FormGroup>
        <Button type="submit" variant="contained" style={{ marginTop: "10px" }}>
          Sign In
        </Button>
        {rootStore.authStore.error && (
          <Typography
            className="login-form__error"
            component="p"
            variant="body2"
            gutterBottom
          >
            Incorrect Username or password
          </Typography>
        )}
      </form>
    </div>
  )
})

LoginForm.propTypes = {
  location: PropTypes.object,
}

export default LoginForm
