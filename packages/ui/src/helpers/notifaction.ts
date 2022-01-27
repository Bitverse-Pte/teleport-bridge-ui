import { toast } from 'react-toastify'

export function successNoti(message: string) {
  toast.success(message, {
    position: toast.POSITION.BOTTOM_RIGHT,
  })
}

export function errorNoti(message: string) {
  toast.error(message, {
    position: toast.POSITION.BOTTOM_RIGHT,
  })
}

export function warnNoti(message: string) {
  toast.warn(message, {
    position: toast.POSITION.BOTTOM_RIGHT,
  })
}

export function infoNoti(message: string) {
  toast.info(message, {
    position: toast.POSITION.BOTTOM_RIGHT,
  })
}
