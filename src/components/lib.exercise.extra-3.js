import styled from '@emotion/styled'
import {keyframes} from '@emotion/core'
import {Dialog as ReachDialog} from '@reach/dialog'

import {FaSpinner} from 'react-icons/fa'
import * as colors from '../styles/colors'
import * as mq from '../styles/media-queries'

const spin = keyframes`
  from {transform:rotate(0deg);}
  to {transform:rotate(360deg);}
`

const buttonVariants = {
  primary: {
    background: colors.indigo,
    color: 'white',
  },
  secondary: {
    background: colors.gray,
    color: colors.text,
  },
}

const Button = styled.button`
  padding: 10px 15px;
  border: 0;
  line-height: 1;
  border-radius: 3px;

  ${({variant = 'primary'}) => buttonVariants[variant]};
`

const Input = styled.input`
  border-radius: 3px;
  border: 1px solid ${colors.gray10};
  background: ${colors.gray};
  padding: 8px 12px;
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`

const Spinner = styled(FaSpinner)`
  margin: 0 5px;
  animation: ${spin} 1s linear infinite;
`
Spinner.defaultProps = {
  'aria-label': 'loading',
}

const CircleButton = styled.button({
  borderRadius: '30px',
  padding: '0',
  width: '40px',
  height: '40px',
  lineHeight: '1',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'white',
  color: colors.text,
  border: `1px solid ${colors.gray}`,
  cursor: 'pointer',
})

const Dialog = styled(ReachDialog)({
  maxWidth: '450px',
  borderRadius: '3px',
  paddingBottom: '3.5em',
  boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.2)',
  margin: '20vh auto',
  [mq.small]: {
    width: '100%',
    margin: '10vh auto',
  },
})

export {Button, CircleButton, Dialog, Input, FormGroup, Spinner}
