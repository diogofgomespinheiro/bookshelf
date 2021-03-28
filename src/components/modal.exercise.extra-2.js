/** @jsx jsx */
import {jsx} from '@emotion/core'
import * as React from 'react'
import VisuallyHidden from '@reach/visually-hidden'

import {Dialog} from './lib'
import {CircleButton} from 'components/lib'

import {callAll} from 'utils/callAll'

const ModalContext = React.createContext()
ModalContext.displayName = 'ModalContext'

const useModalContext = component => {
  const context = React.useContext(ModalContext)

  if (context === undefined) {
    throw new Error(`${component} must be used within a Modal`)
  }
  return context
}

const Modal = ({children, isInitialOpen = false}) => {
  const [isOpen, setIsOpen] = React.useState(isInitialOpen)

  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)

  const value = {isOpen, open, close}

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
}

const ModalDismissButton = ({children, onClick}) => {
  const {close} = useModalContext('ModalDismissButton')

  return React.cloneElement(children, {onClick: callAll(onClick, close)})
}

const ModalOpenButton = ({children, onClick}) => {
  const {open} = useModalContext('ModalOpenButton')

  return React.cloneElement(children, {onClick: callAll(onClick, open)})
}

const ModalContentsBase = ({children, ...props}) => {
  const {isOpen, close} = useModalContext('ModalContents')

  return (
    <Dialog isOpen={isOpen} onDismiss={close} {...props}>
      {children}
    </Dialog>
  )
}

const CircleDismissButton = () => (
  <div css={{display: 'flex', justifyContent: 'flex-end'}}>
    <ModalDismissButton>
      <CircleButton>
        <VisuallyHidden>Close</VisuallyHidden>
        <span aria-hidden>×</span>
      </CircleButton>
    </ModalDismissButton>
  </div>
)

const ModalContents = ({children, title, ...props}) => {
  return (
    <ModalContentsBase {...props}>
      <CircleDismissButton />
      <h3 css={{textAlign: 'center', fontSize: '2em'}}>{title}</h3>
      {children}
    </ModalContentsBase>
  )
}

export {
  Modal,
  ModalDismissButton,
  ModalOpenButton,
  ModalContentsBase,
  ModalContents,
}
