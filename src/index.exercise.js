import * as React from 'react'
import ReactDOM from 'react-dom'

import './bootstrap'
import {loadDevTools} from './dev-tools/load'
import {App} from './app'

import {AppProviders} from 'context'

loadDevTools(() => {
  ReactDOM.render(
    <AppProviders>
      <App />
    </AppProviders>,
    document.getElementById('root'),
  )
})
