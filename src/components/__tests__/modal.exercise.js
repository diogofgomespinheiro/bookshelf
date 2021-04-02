import * as React from 'react'
import {render, screen, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import {Modal, ModalContents, ModalOpenButton} from '../modal'

describe('Modal Component', () => {
  it('should open and close', () => {
    const modalTitle = 'Modal Title'
    const modalLabel = 'Modal Label'
    const modalContent = 'Modal Content'

    render(
      <Modal>
        <ModalOpenButton>
          <button>Open</button>
        </ModalOpenButton>
        <ModalContents title={modalTitle} aria-label={modalLabel}>
          <div>{modalContent}</div>
        </ModalContents>
      </Modal>,
    )

    const button = screen.getByRole('button', {name: /open/i})
    userEvent.click(button)

    const modal = screen.getByRole('dialog')
    expect(modal).toHaveAttribute('aria-label', modalLabel)

    const inModal = within(modal)
    expect(inModal.getByRole('heading', {name: modalTitle})).toBeInTheDocument()
    expect(inModal.getByText(modalContent)).toBeInTheDocument()

    userEvent.click(inModal.getByRole('button', {name: /close/i}))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
