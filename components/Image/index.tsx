import Image, { ImageProps } from 'next/Image'

export default function OriginalSrcImage(props: Omit<ImageProps, 'loader'>) {
  return (
    <Image
      {...props}
      //   alt={props.alt ?? 'Icon'}
      alt={''}
      loader={({ src }) => {
        return src
      }}
    />
  )
}
