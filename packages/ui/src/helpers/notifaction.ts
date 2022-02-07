import { toast } from 'react-toastify'

export function successNoti(message: string, toastId?: string | number | undefined) {
  const opt: any = {
    position: toast.POSITION.BOTTOM_RIGHT,
  }
  if (toastId) {
    opt.toastId = toastId
    if (toast.isActive(toastId)) {
      toast.update(toastId, {
        render: message,
        type: toast.TYPE.SUCCESS,
      })
      return toastId
    }
  }
  toast.success(message, opt)
}

export function errorNoti(message: string, toastId?: string | number | undefined) {
  const opt: any = {
    position: toast.POSITION.BOTTOM_RIGHT,
  }
  if (toastId) {
    opt.toastId = toastId
    if (toast.isActive(toastId)) {
      toast.update(toastId, {
        render: message,
        type: toast.TYPE.ERROR,
      })
      return toastId
    }
  }
  toast.error(message, opt)
}

export function warnNoti(message: string, toastId?: string | number | undefined) {
  const opt: any = {
    position: toast.POSITION.BOTTOM_RIGHT,
  }
  if (toastId) {
    opt.toastId = toastId
    if (toast.isActive(toastId)) {
      toast.update(toastId, {
        render: message,
        type: toast.TYPE.WARNING,
      })
      return toastId
    }
  }
  toast.warn(message, opt)
}

export function infoNoti(message: string, toastId?: string | number | undefined) {
  const opt: any = {
    position: toast.POSITION.BOTTOM_RIGHT,
  }
  if (toastId) {
    opt.toastId = toastId
    if (toast.isActive(toastId)) {
      toast.update(toastId, {
        render: message,
        type: toast.TYPE.INFO,
      })
      return toastId
    }
  }
  return toast.info(message, opt)
}
