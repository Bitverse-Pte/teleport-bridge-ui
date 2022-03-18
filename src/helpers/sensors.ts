import { isObjectLike } from 'lodash'
import getConfig from 'next/config'

import { isMobile } from 'helpers/userAgent'
import { isServer } from 'helpers'

const { publicRuntimeConfig } = getConfig()
const APP_ENV = publicRuntimeConfig.APP_ENV

let sensors: {
  init: any
  registerPage: any
  quick: any
  track: any
  use?: (name: string, option: object) => any
  identify?: (id: string, isSave?: boolean | undefined) => any
  login?: (id: string, callback?: any) => void
  logout?: (isChangeId?: boolean | undefined) => void
  setOnceProfile?: (prop: object, c?: any) => void
  setProfile?: (prop: object, c?: any) => void
  appendProfile?: (prop: object, c?: any) => void
  incrementProfile?: (prop: object, c?: any) => void
  deleteProfile?: (c?: any) => void
  unsetProfile?: (prop: object, c?: any) => void
  getPresetProperties?: () => any
}

let sensorsLoading: Promise<void>
if (!isServer) {
  sensorsLoading = (async () => {
    let sdk = await import('sa-sdk-javascript')
    sensors = sdk.default
  })()
}

const getReferrerPath = () => {
  if (!document.referrer) return ''
  if (window.URL) return new URL(document.referrer).pathname
  const parser = document.createElement('a')
  parser.href = document.referrer
  return parser.pathname
}

let initilzed = false

const init = async (initOpts: any = { heatmap: {} }, registerOpts = {}) => {
  // must provide data server url
  if (!isObjectLike(initOpts) || !initOpts.server_url) return
  await sensorsLoading
  sensors.init({
    is_track_single_page: true,
    send_type: 'beacon',
    heatmap: {
      clickmap: 'default',
      scroll_notice_map: 'default',
      ...initOpts.heatmap,
    },
    app_js_bridge: true,

    ...initOpts,
  })

  // registering all events need to add common parameters
  if (isObjectLike(registerOpts)) {
    sensors.registerPage({
      app_id: 10009,
      // notify_lang: // current language
      //   getCookie(BYBIT_LANG_KEY)
      //   || storage.get(BYBIT_LANG_KEY)
      //   || window.navigator.language,
      project_type: '',
      project_name: '',
      // ga_id: getGaClientId(), // google 的 ga id
      page_url: window.location.href || '',
      page_path: window.location.pathname || '',
      referrer_url: document.referrer || '',
      referrer_path: getReferrerPath(),

      // guid: getGuid(),
      // u: window.GA_UID || '', // uid
      platform_type: !isMobile ? 'Web' : 'H5',

      ...registerOpts,
    })
  }

  // collect $pageview event
  sensors.quick('autoTrack')
  initilzed = true
}

export const start = () => {
  if (isServer) {
    return
  }
  if (APP_ENV === 'development') {
    return
  }

  init(
    {
      show_log: false,
      server_url: `https://sc-datasink.ffe390afd658c19dcbf707e0597b846d.de/sa?project=${APP_ENV === 'mainnet' ? 'production' : 'default'}`,
      abUrl: 'https://sc-abtest.ffe390afd658c19dcbf707e0597b846d.de/api/v2/abtest/online/results?project-key=04998C9B84A38A7D810A5ADAF48229BA568BF954',
    },
    {
      app_id: 10009,
      env: APP_ENV,
      project_type: 'teleport',
      project_name: 'teleport_bridge',
      page_name: document && document.title,
    }
  )
}

export const sensorsTrack = (eventName: string, pageName = 'home') => {
  if (isServer) {
    return
  }
  if (APP_ENV === 'development') {
    return
  }
  if (!initilzed) {
    return
  }
  console.warn('do track')
  debugger
  sensors.track(eventName, {
    page: pageName,
  })
}
