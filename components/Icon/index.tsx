import React from 'react'
import Image, { ImageProps } from 'next/image'
import * as PropTypes from 'prop-types'

export const Icon = ({ src, fallback, size = 16, ...rest }: { fallback?: string; size?: string | number } & ImageProps) => {
  return <Image {...rest} src={src} height={size} width={size} onError={(event: any) => (event.target.src = fallback)} />
}

export * from './AlertIcon'
export * from './CloseIcon'
export * from './HelpIcon'
