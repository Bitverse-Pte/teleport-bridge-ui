import { UAParser } from 'ua-parser-js'

const parser =
  typeof window !== 'undefined' && new UAParser(window.navigator.userAgent)
const { type } = parser ? parser.getDevice() : { type: undefined }

export const userAgent = parser && parser.getResult()

export const isMobile = type && (type === 'mobile' || type === 'tablet')
