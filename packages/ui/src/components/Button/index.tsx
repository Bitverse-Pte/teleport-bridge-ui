import React from 'react'
import styled, { css } from 'styled-components/macro'
import { Flex, Box, Button as RebassButton, ButtonProps as ButtonPropsOriginal, Text } from 'rebass/styled-components'
import { darken } from 'polished'

import Loader from '../Loader'
import { colors, fonts, shadows, transitions } from '../../styles'

export type BaseButtonProps = {
  padding?: string
  width?: string
  fontWeight?: number | string
  $borderRadius?: string
  altDisabledStyle?: boolean
} & Omit<ButtonPropsOriginal, 'css'>

export const BaseButton = styled(RebassButton)<BaseButtonProps>`
  padding: ${({ padding }) => padding ?? '16px'};
  width: ${({ width }) => width ?? '100%'};
  font-weight: ${({ fontWeight }) => fontWeight ?? 500};
  text-align: center;
  border-radius: ${({ $borderRadius, theme }) => $borderRadius ?? theme.defaultButtonRadius};
  outline: none;
  border: 1px solid transparent;
  color: white;
  text-decoration: none;
  display: flex;
  justify-content: center;
  flex-wrap: nowrap;
  align-items: center;
  cursor: pointer;
  position: relative;
  z-index: 1;
  &:disabled {
    cursor: auto;
    pointer-events: none;
  }

  will-change: transform;
  transition: transform 450ms ease;
  transform: perspective(1px) translateZ(0);

  > * {
    user-select: none;
  }

  > a {
    text-decoration: none;
  }
`

export const ButtonPrimary = styled(BaseButton)`
  background-color: ${({ theme }) => theme.bg6};
  color: ${({ theme }) => theme.black};
  // &:focus {
  //   box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.05, theme.primary1)};
  //   background-color: ${({ theme }) => darken(0.05, theme.primary1)};
  // }
  &:hover {
    background-color: ${({ theme }) => darken(0.05, theme.primary1)};
  }
  &:active {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.1, theme.primary1)};
    background-color: ${({ theme }) => darken(0.1, theme.primary1)};
  }
  &:disabled {
    background-color: ${({ theme, altDisabledStyle, disabled }) => (altDisabledStyle ? (disabled ? theme.primary1 : theme.bg2) : theme.bg2)};
    color: ${({ altDisabledStyle, disabled, theme }) => (altDisabledStyle ? (disabled ? theme.white : theme.text2) : theme.text2)};
    cursor: auto;
    box-shadow: none;
    border: 1px solid transparent;
    outline: none;
  }
`

export const ButtonSecondary = styled(BaseButton)`
  border: 1px solid ${({ theme }) => theme.primary4};
  color: ${({ theme }) => theme.primary1};
  background-color: transparent;
  font-size: 16px;
  border-radius: 12px;
  padding: ${({ padding }) => (padding ? padding : '10px')};

  &:focus {
    box-shadow: 0 0 0 1pt ${({ theme }) => theme.primary4};
    border: 1px solid ${({ theme }) => theme.primary3};
  }
  &:hover {
    border: 1px solid ${({ theme }) => theme.primary3};
  }
  &:active {
    box-shadow: 0 0 0 1pt ${({ theme }) => theme.primary4};
    border: 1px solid ${({ theme }) => theme.primary3};
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
  }
  a:hover {
    text-decoration: none;
  }
`

export const ButtonOutlined = styled(BaseButton)`
  border: 1px solid ${({ theme }) => theme.blue1};
  background-color: transparent;
  color: ${({ theme }) => theme.text1};
  &:focus {
    box-shadow: 0 0 0 1px ${({ theme }) => theme.bg4};
  }
  &:hover {
    box-shadow: 0 0 0 1px ${({ theme }) => theme.bg4};
  }
  &:active {
    box-shadow: 0 0 0 1px ${({ theme }) => theme.bg4};
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
  }
`

export const ButtonLight = styled(BaseButton)`
  background-color: ${({ theme }) => theme.bg1};
  color: ${({ theme }) => theme.text2};
  font-size: 16px;
  font-weight: 500;
  &:focus {
    box-shadow: 0 0 0 1pt ${({ theme, disabled }) => !disabled && darken(0.03, theme.bg1)};
    border: 1px solid ${({ theme }) => theme.bg3};
    background-color: ${({ theme, disabled }) => !disabled && darken(0.03, theme.bg2)};
  }
  &:hover {
    background-color: ${({ theme, disabled }) => !disabled && darken(0.03, theme.bg2)};
    border: 1px solid ${({ theme }) => theme.bg3};
  }
  &:active {
    box-shadow: 0 0 0 1pt ${({ theme, disabled }) => !disabled && darken(0.05, theme.bg1)};
    background-color: ${({ theme, disabled }) => !disabled && darken(0.05, theme.bg2)};
  }
  :disabled {
    opacity: 0.4;
    cursor: not-allowed;
    pointer-events: unset;
    :hover {
      background-color: ${({ theme }) => theme.primary5};
      box-shadow: none;
      border: 1px solid transparent;
      outline: none;
    }
  }
`

interface IButtonStyleProps {
  fetching: boolean
  outline: boolean
  type: 'button' | 'submit' | 'reset'
  color: string
  disabled: boolean
  icon: any
  left: boolean
}

interface IButtonProps extends IButtonStyleProps {
  children: React.ReactNode
  onClick?: any
}

const SIcon = styled.div`
  position: absolute;
  height: 15px;
  width: 15px;
  margin: 0 8px;
  top: calc((100% - 15px) / 2);
`

const SHoverLayer = styled.div`
  transition: ${transitions.button};
  position: absolute;
  height: 100%;
  width: 100%;
  background-color: rgb(${colors.white}, 0.1);
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
`

const SButton = styled.button<IButtonStyleProps>`
  transition: ${transitions.button};
  position: relative;
  border: none;
  border-style: none;
  box-sizing: border-box;
  background-color: ${({ outline, color }) => (outline ? 'transparent' : `rgb(${colors[color]})`)};
  border: ${({ outline, color }) => (outline ? `1px solid rgb(${colors[color]})` : 'none')};
  color: ${({ outline, color }) => (outline ? `rgb(${colors[color]})` : `rgb(${colors.white})`)};
  box-shadow: ${({ outline }) => (outline ? 'none' : `${shadows.soft}`)};
  border-radius: 8px;
  font-size: ${fonts.size.medium};
  font-weight: ${fonts.weight.semibold};
  padding: ${({ icon, left }) => (icon ? (left ? '7px 12px 8px 28px' : '7px 28px 8px 12px') : '8px 12px')};
  cursor: ${({ disabled }) => (disabled ? 'auto' : 'pointer')};
  will-change: transform;

  &:disabled {
    opacity: 0.6;
    box-shadow: ${({ outline }) => (outline ? 'none' : `${shadows.soft}`)};
  }

  @media (hover: hover) {
    &:hover {
      transform: ${({ disabled }) => (!disabled ? 'translateY(-1px)' : 'none')};
      box-shadow: ${({ disabled, outline }) => (!disabled ? (outline ? 'none' : `${shadows.hover}`) : `${shadows.soft}`)};
    }

    &:hover ${SHoverLayer} {
      opacity: 1;
      visibility: visible;
    }
  }

  &:active {
    transform: ${({ disabled }) => (!disabled ? 'translateY(1px)' : 'none')};
    box-shadow: ${({ outline }) => (outline ? 'none' : `${shadows.soft}`)};
    color: ${({ outline, color }) => (outline ? `rgb(${colors[color]})` : `rgba(${colors.white}, 0.24)`)};

    & ${SIcon} {
      opacity: 0.8;
    }
  }

  & ${SIcon} {
    right: ${({ left }) => (left ? 'auto' : '0')};
    left: ${({ left }) => (left ? '0' : 'auto')};
    display: ${({ icon }) => (icon ? 'block' : 'none')};
    mask: ${({ icon }) => (icon ? `url(${icon}) center no-repeat` : 'none')};
    background-color: ${({ outline, color }) => (outline ? `rgb(${colors[color]})` : `rgb(${colors.white})`)};
    transition: 0.15s ease;
  }
`

export const SButtonPrimary = (props: IButtonProps) => (
  <SButton {...props} type={props.type} outline={props.outline} color={props.color} disabled={props.disabled} icon={props.icon} left={props.left}>
    <SHoverLayer />
    <SIcon />
    {props.fetching ? <Loader size={20} color="white" /> : props.children}
  </SButton>
)

SButtonPrimary.defaultProps = {
  fetching: false,
  outline: false,
  type: 'button',
  color: 'lightBlue',
  disabled: false,
  icon: null,
  left: false,
}

export const ButtonGray = styled(BaseButton)`
  background-color: ${({ theme }) => theme.bg1};
  color: ${({ theme }) => theme.text2};
  font-size: 16px;
  font-weight: 500;

  &:hover {
    background-color: ${({ theme, disabled }) => !disabled && darken(0.05, theme.bg2)};
  }
  &:active {
    background-color: ${({ theme, disabled }) => !disabled && darken(0.1, theme.bg2)};
  }
`

export const PrimaryButton = styled(ButtonPrimary)`
  border-radius: 0.5rem;
  width: 100%;
  font-weight: 900;
  color: white;
  background-color: #00c6a9;
  &:hover {
    background-color: ${() => darken(0.05, '#00c6a9')};
  }
`

export { default as ButtonDropdown } from './ButtonDropdown'
export { default as SelectorButton } from './SelectorButton'
export { default as ConnectButton } from './ConnectButton'
