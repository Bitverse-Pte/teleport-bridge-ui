import { ContractFunction } from '@ethersproject/contracts'
import { BigNumber } from '@ethersproject/bignumber'
import { isAddress, getContract } from 'helpers'
import ERC20ABI from 'contracts/erc20.json'
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers'
import { DAI_CONTRACT, TokenInfo } from 'constants/index'

export function getDaiContract(chainId: number, web3: any) {
  const dai = new web3.eth.Contract(DAI_CONTRACT[chainId].abi, DAI_CONTRACT[chainId].address)
  return dai
}

export function callBalanceOf(address: string, chainId: number, web3: any) {
  return new Promise((resolve, reject) => {
    const dai = getDaiContract(chainId, web3)

    dai.methods.balanceOf(address).call({ from: '0x0000000000000000000000000000000000000000' }, (err: any, data: any) => {
      if (err) {
        reject(err)
      }

      resolve(data)
    })
  })
}

export function callTransfer(address: string, chainId: number, web3: any) {
  return new Promise((resolve, reject) => {
    const dai = getDaiContract(chainId, web3)

    dai.methods.transfer(address, '1').send({ from: address }, (err: any, data: any) => {
      if (err) {
        reject(err)
      }

      resolve(data)
    })
  })
}

export async function getBalance(token: TokenInfo = {} as TokenInfo, library: Web3Provider, account: string, abi = ERC20ABI): Promise<BigNumber | undefined> {
  if (!token || (!token.isNative && !isAddress(token.address)) || !library || !account) {
    return undefined
  }
  if (token.isNative) {
    const request = library?.getBalance(account!)
    return request
  } else {
    const contract = getContract(token.address, abi, library, account!)
    const request = contract.balanceOf(account!)
    return request
  }
}
