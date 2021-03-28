import * as React from 'react'

import {Dialog} from './lib'
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

const ModalContents = ({children, ...props}) => {
  const {isOpen, close} = useModalContext('ModalContents')

  return (
    <Dialog isOpen={isOpen} onDismiss={close} {...props}>
      {children}
    </Dialog>
  )
}

export {Modal, ModalDismissButton, ModalOpenButton, ModalContents}
