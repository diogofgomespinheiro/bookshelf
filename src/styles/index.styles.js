import styled from '@emotion/styled'

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
`

const ButtonsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0px, 1fr));
  grid-gap: 0.75rem;
`

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  align-items: stretch;

  & > div {
    margin: 10px auto;
    width: 100%;
    max-width: 300px;
  }
`

export {AppContainer, ButtonsWrapper, FormContainer}
