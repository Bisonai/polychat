// import { expect } from 'chai'
// import { ethers } from 'hardhat'
// import { PromiseOrValue } from '../typechain-types/common'
// import { ERC20Token } from '../typechain-types'

// let token: ERC20Token
// let ownerAccount, account1, account2: { address: PromiseOrValue<string> }

// describe('HelloWorldTest', async function () {
//   it('#1 Deploy contract', async function () {
//     const myContract = await ethers.getContractFactory('ERC20Token')
//     token = await myContract.deploy()
//     ;[ownerAccount, account1, account2] = await ethers.getSigners()
//     const ownerBalance = await ethers.provider.getBalance(ownerAccount.address)
//     const addr1Balance = await ethers.provider.getBalance(account1.address)
//     console.log(ownerBalance)
//     console.log(addr1Balance)
//     console.log('Invatation NFT contract address:', token.address)
//   })

//   it('#2 Should get() equal to initMessage', async function () {
//     console.log(await token.balanceOf(ownerAccount.address))
//     console.log(await token.balanceOf(account1.address))
//     token.transfer(account1.address, 100)
//     console.log(await token.balanceOf(ownerAccount.address))
//     console.log(await token.balanceOf(account1.address))
//   })
// })
