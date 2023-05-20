import { ethers } from 'hardhat'

async function main() {
  console.log('Deploy polyChat')
  const myContract = await ethers.getContractFactory('PolyChat')

  const contract = await myContract.deploy()
  await contract.deployed()
  console.log('PolyChat deployed to:', contract.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
