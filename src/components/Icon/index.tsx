import React from 'react'
import Image from 'components/Image'
import { ImageProps } from 'next/image'

export const Icon = ({ src, fallback, size = 16, alt, ...rest }: { fallback?: string; size?: string | number } & ImageProps) => {
  return <Image {...rest} src={src} alt={alt ?? ''} height={size} width={size} onError={(event: any) => (event.target.src = fallback)} />
}

export * from './AlertIcon'
export * from './CloseIcon'
export * from './HelpIcon'
