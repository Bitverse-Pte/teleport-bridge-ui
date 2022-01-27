import { ContractFunction } from '@ethersproject/contracts'
import { BigNumber } from '@ethersproject/bignumber'
import { isAddress, getContract } from 'helpers'
import ERC20ABI from 'contracts/erc20.json'
import { JsonRpcSigner, TransactionResponse, Web3Provider } from '@ethersproject/providers'
import { DAI_CONTRACT, TokenInfo } from 'constants/index'
import { errorNoti } from './notifaction'

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
  try {
    let result: BigNumber | undefined
    if (token.isNative) {
      result = await library?.getBalance(account!)
    } else {
      const contract = getContract(token.address, abi, library, account!)
      result = await contract.balanceOf(account!)
    }
    return result
  } catch (err) {
    errorNoti(`failed to get balance of ${token.name},
    detail is ${(err as any).message}`)
  }
}
