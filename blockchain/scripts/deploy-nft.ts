import { ethers } from 'hardhat'

async function main() {
  console.log('Deploying NFT')

  const name = 'Chat NFT'
  const symbol = 'CHNFT'
  const baseUri = 'https://api.big-fish.cloud/metadata/castaways/genesis-character/'
  const myContract = await ethers.getContractFactory('NFT')

  const contract = await myContract.deploy(name, symbol, baseUri)
  await contract.deployed()
  console.log('NFT deployed to:', contract.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
