console.log(process.env.REACT_APP_LOCAL_DEVELOPMENT)

export const AVAILABLE_CHAINS_URL = `${process.env.REACT_APP_LOCAL_DEVELOPMENT === 'YES' ? '' : process.env.REACT_APP_CHAINS_DATA_URL}` + '/chains'
export const COUNTERPARTY_CHAINS_URL = `${process.env.REACT_APP_LOCAL_DEVELOPMENT === 'YES' ? '' : process.env.REACT_APP_CHAINS_DATA_URL}` + '/counterpartyChains'
export const BRIDGE_TOKENS__URL = `${process.env.REACT_APP_LOCAL_DEVELOPMENT === 'YES' ? '' : process.env.REACT_APP_CHAINS_DATA_URL}` + '/bridges'
