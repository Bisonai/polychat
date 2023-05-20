import { Provider } from '@ethersproject/providers'
import { expect } from 'chai'
import { Contract, Signer } from 'ethers'
import { ethers } from 'hardhat'
import { PromiseOrValue } from '../typechain-types/common'

describe('ChatApp', () => {
  let chatApp: Contract
  let from: any, to: any

  beforeEach(async () => {
    const ChatApp = await ethers.getContractFactory('PolyChat')
    chatApp = await ChatApp.deploy()
    await chatApp.deployed()
    ;[from, to] = await ethers.getSigners()
  })

  it('should send an open message', async () => {
    const content = 'This is an open message'
    await chatApp.connect(from).storeMessage(from.address, to.address, content)

    const message = await chatApp.getMessage(0)
    expect(message.from).to.equal(from.address)
    expect(message.to).to.equal(to.address)
    expect(message.text).to.equal(content)
  })

  it('should send an encrypted message', async () => {
    const hash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('This is an encrypted message'))
    console.log('Hash:', hash)
    await chatApp.connect(from).storeEncodedMessage(from.address, to.address, hash)

    const message = await chatApp.getEncodedMessage(0)

    expect(message.from).to.equal(from.address)
    expect(message.to).to.equal(to.address)
    expect(message.hash).to.equal(hash)
  })
})
