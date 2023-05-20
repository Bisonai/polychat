import { ethers } from 'hardhat'

async function main() {
  console.log('Deploying DAO')
  const myContract = await ethers.getContractFactory('DAO')

  const contract = await myContract.deploy()
  await contract.deployed()
  console.log('FactoryAdRevenueSharing deployed to:', contract.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
