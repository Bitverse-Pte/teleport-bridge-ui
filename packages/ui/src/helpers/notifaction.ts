import { toast } from 'react-toastify'

export function successNoti(message: string, toastId = '') {
  const opt: any = {
    position: toast.POSITION.BOTTOM_RIGHT,
  }
  if (toastId) {
    opt.toastId = toastId
    toast.dismiss(toastId)
  }
  toast.success(message, opt)
}

export function errorNoti(message: string, toastId = '') {
  const opt: any = {
    position: toast.POSITION.BOTTOM_RIGHT,
  }
  if (toastId) {
    opt.toastId = toastId
    toast.dismiss(toastId)
  }
  toast.error(message, opt)
}

export function warnNoti(message: string, toastId = '') {
  const opt: any = {
    position: toast.POSITION.BOTTOM_RIGHT,
  }
  if (toastId) {
    opt.toastId = toastId
    toast.dismiss(toastId)
  }
  toast.warn(message, opt)
}

export function infoNoti(message: string, toastId = '') {
  const opt: any = {
    position: toast.POSITION.BOTTOM_RIGHT,
  }
  if (toastId) {
    opt.toastId = toastId
    toast.dismiss(toastId)
  }
  toast.info(message, opt)
}
