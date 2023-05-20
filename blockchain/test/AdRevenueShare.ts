import { expect, assert } from 'chai'
import { ethers } from 'hardhat'

describe('FactoryAdRevenueSharing', () => {
  let factory: any
  let operator: any
  let accounts: any
  let endBlock = 168456239112
  before(async () => {
    accounts = await ethers.getSigners()

    const FactoryAdRevenueSharing = await ethers.getContractFactory('FactoryAdRevenueSharing')
    factory = await FactoryAdRevenueSharing.deploy()
    await factory.deployed()

    operator = accounts[0]
  })

  it('should create a new ad revenue share contract', async () => {
    console.log('adRevenueShare:')
    const hash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('adHash'))

    await factory.create(hash, { gasLimit: 3000000 })
  })

  it('should launch a campaign', async () => {
    const adHash = await factory.adOperator(operator.address)
    await factory.launchCampaign(adHash, endBlock, { value: ethers.utils.parseEther('1') })
  })

  it('should stake in the campaign', async () => {
    const adHash = await factory.adOperator(operator.address)
    const adRegistry = await factory.adRegistry(adHash)
    const adRevenueShare = await ethers.getContractAt('AdRevenueShare', adRegistry)

    await adRevenueShare.stake({ value: ethers.utils.parseEther('0.5') })
    const userStake = await adRevenueShare.userStake(accounts[0].address)
    expect(userStake).to.be.equal(ethers.utils.parseEther('0.5'))
  })

  it('should unstake after campaign ends', async () => {
    const adHash = await factory.adOperator(operator.address)
    const adRegistry = await factory.adRegistry(adHash)
    const adRevenueShare = await ethers.getContractAt('AdRevenueShare', adRegistry)
    await ethers.provider.send('evm_increaseTime', [endBlock + 10])
    await ethers.provider.send('evm_mine', [])

    await adRevenueShare.unstake()
    const userStake = await adRevenueShare.userStake(accounts[0].address)

    expect(userStake).to.be.equal(ethers.utils.parseEther('0'))
  })
})
