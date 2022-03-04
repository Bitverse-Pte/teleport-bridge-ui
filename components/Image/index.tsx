import Image, { ImageProps } from 'next/image'

export default function OriginalSrcImage(props: Omit<ImageProps, 'loader'>) {
  return (
    <Image
      {...props}
      alt={props.alt ?? ''}
      /* loader={({ src }) => {
        return src
      }} */
    />
  )
}
