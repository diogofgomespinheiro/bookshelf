// 🐨 you're going to need the Dialog component
// It's just a light wrapper around ReachUI Dialog
// 📜 https://reacttraining.com/reach-ui/dialog/
import * as React from 'react'

import {Dialog} from './lib'

// 💰 Here's a reminder of how your components will be used:
/*
<Modal>
  <ModalOpenButton>
    <button>Open Modal</button>
  </ModalOpenButton>
  <ModalContents aria-label="Modal label (for screen readers)">
    <ModalDismissButton>
      <button>Close Modal</button>
    </ModalDismissButton>
    <h3>Modal title</h3>
    <div>Some great contents of the modal</div>
  </ModalContents>
</Modal>
*/

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

const ModalDismissButton = ({children}) => {
  const {close} = useModalContext('ModalDismissButton')

  return React.cloneElement(children, {onClick: close})
}

const ModalOpenButton = ({children}) => {
  const {open} = useModalContext('ModalOpenButton')

  return React.cloneElement(children, {onClick: open})
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
