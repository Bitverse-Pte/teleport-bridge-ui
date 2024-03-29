import React from 'react'
import styled from 'styled-components'
import { CURRENCY_INPUT_ERROR } from 'constants/types'

export const CurrencyInput = styled.input<{ error?: CURRENCY_INPUT_ERROR }>`
  font-size: 1.25rem;
  outline: none;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  border: none;
  flex: 1 1 auto;
  width: 0;
  // background-color: ${({ theme }) => theme.bg1};
  background-color: #000;
  transition: color 300ms ${({ error }) => (error && error !== CURRENCY_INPUT_ERROR.OK ? 'step-end' : 'step-start')};
  color: ${({ error, theme }) => (error && error !== CURRENCY_INPUT_ERROR.OK ? theme.red1 : theme.text1)};
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 600;
  width: 100%;
  ::placeholder {
    color: ${({ theme }) => theme.text4};
  }
  padding: 0px;
  -webkit-appearance: textfield;

  ::-webkit-search-decoration {
    -webkit-appearance: none;
  }

  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  ::placeholder {
    color: ${({ theme }) => theme.text4};
  }
`
