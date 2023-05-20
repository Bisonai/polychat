import { ethers } from 'hardhat'

async function main() {
  console.log('Deploying ERC20')
  const myContract = await ethers.getContractFactory('ERC20Token')

  const contract = await myContract.deploy()
  await contract.deployed()
  console.log('ERC20Token deployed to:', contract.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
