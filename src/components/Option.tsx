import React from 'react'
import styled from 'styled-components'
import ExternalLink from './ExternalLink'
import { StyledLogo } from 'components/Logo'
import { Icon } from 'components/Icon'

const InfoCard = styled.button<{ active?: boolean }>`
  background-color: ${({ theme, active }) => (active ? theme.bg3 : theme.bg2)};
  padding: 1rem;
  outline: none;
  border: 1px solid;
  border-radius: 12px;
  width: 100%;
  max-height: 3rem;
  // &:focus {
  //   box-shadow: 0 0 0 1px ${({ theme }) => theme.primary1};
  // }
  border-color: ${({ theme, active }) => (active ? 'transparent' : theme.bg3)};
`

const OptionCard = styled(InfoCard as any)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 2rem;
  padding: 1rem;
`

const OptionCardLeft = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap};
  justify-content: center;
  height: 100%;
`

const OptionCardClickable = styled(OptionCard as any)<{ clickable?: boolean }>`
  margin-top: 0;
  &:hover {
    cursor: ${({ clickable }) => (clickable ? 'pointer' : '')};
    border: ${({ clickable, theme }) => (clickable ? `1px solid ${theme.primary1}` : '')};
  }
  opacity: ${({ disabled }) => (disabled ? '0.5' : '1')};
`

const GreenCircle = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  justify-content: center;
  align-items: center;

  &:first-child {
    height: 8px;
    width: 8px;
    margin-right: 8px;
    background-color: ${({ theme }) => theme.green1};
    border-radius: 50%;
  }
`

const TransparentCircle = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  justify-content: center;
  align-items: center;

  &:first-child {
    height: 8px;
    width: 8px;
    margin-right: 8px;
    background-color: rgba(255, 255, 255, 0);
    border-radius: 50%;
  }
`

const CircleWrapper = styled.div`
  color: ${({ theme }) => theme.green1};
  display: flex;
  justify-content: center;
  align-items: center;
`

const HeaderText = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  color: ${(props) => (props.color === 'blue' ? ({ theme }) => theme.primary1 : ({ theme }) => theme.text1)};
  font-size: 1rem;
  font-weight: 500;
`

const SubHeader = styled.div`
  color: ${({ theme }) => theme.text1};
  margin-top: 10px;
  font-size: 12px;
`

const IconWrapper = styled.div<{ size?: number | null }>`
  ${({ theme }) => theme.flexColumnNoWrap};
  align-items: center;
  justify-content: center;
  & > img,
  span {
    height: ${({ size }) => (size ? size + 'px' : '24px')};
    width: ${({ size }) => (size ? size + 'px' : '24px')};
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
    align-items: flex-end;
  `};
`

export enum OPTION_TYPE {
  WALLET = 'WALLET',
  NETWORK = 'NETWORK',
}

export default function Option({
  link = null,
  clickable = true,
  size = 24,
  onClick = null,
  color,
  header,
  subheader = null,
  icon,
  active = false,
  id,
  type,
}: {
  link?: string | null
  clickable?: boolean
  size?: number
  onClick?: null | (() => void)
  color: string
  header: React.ReactNode
  subheader: React.ReactNode | null
  icon: string | StaticImageData
  active?: boolean
  id: string
  type: OPTION_TYPE
}) {
  const content = (
    <OptionCardClickable id={id} onClick={onClick} clickable={clickable && !active} active={active}>
      <OptionCardLeft>
        <HeaderText color={color}>
          <CircleWrapper>
            {active ? (
              <GreenCircle>
                <div />
              </GreenCircle>
            ) : (
              <TransparentCircle>
                <div />
              </TransparentCircle>
            )}
          </CircleWrapper>
          {header}
        </HeaderText>
        {subheader && <SubHeader>{subheader}</SubHeader>}
      </OptionCardLeft>
      {type === OPTION_TYPE.WALLET && (
        <Icon size={size} src={icon} alt={'option-icon'} />
        /*    <IconWrapper size={size}>
          <img src={icon} alt={'Icon'} />
        </IconWrapper> */
      )}
      {type === OPTION_TYPE.NETWORK && <StyledLogo size={'1.5rem'} srcs={[icon]}></StyledLogo>}
    </OptionCardClickable>
  )
  if (link) {
    return (
      <ExternalLink href={link} style={{ margin: '0' }}>
        {content}
      </ExternalLink>
    )
  }

  return content
}
