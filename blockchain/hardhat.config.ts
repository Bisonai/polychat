import { HardhatUserConfig, task } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
import '@nomiclabs/hardhat-web3'
import '@nomiclabs/hardhat-ethers'
import dotenv from 'dotenv'
dotenv.config()

let transferAddresses = ['0x5aEcC9617cC5A4De21BaFFFEa16153eeB7A2ac14']

const config: HardhatUserConfig = {
  solidity: '0.8.16',
  defaultNetwork: 'localhost',
  networks: {
    localhost: {
      gas: 1_400_000
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: [process.env.PRIVATE_KEY || '']
    },
    zkEVM: {
      url: `https://rpc.public.zkevm-test.net`,
      accounts: [process.env.PRIVATE_KEY || '']
    },
    mumbai: {
      url: `https://rpc-mumbai.maticvigil.com`,
      accounts: [process.env.PRIVATE_KEY || ''],
      saveDeployments: true
    }
  },
  etherscan: {
    apiKey: process.env.POLYGONSCAN_API__KEY
  }
}

task('address').setAction(async (args, hre) => {
  const mnemonic = process.env.MNEMONIC || ''
  const account = hre.ethers.Wallet.fromMnemonic(mnemonic)
  console.log('Mnemonic Account:, ', account.address)
})

task('transfer', 'Mint BYRM TOKEN').setAction(async (args, hre) => {
  console.log('Transfer', hre.network.name)
  const deployedAddress = '0x62626E7670FA18737513239230B7c10cE1423bAb'
  const token = await hre.ethers.getContractAt('ERC20Token', deployedAddress)
  const amount = BigInt(ethers.utils.parseEther('500'))
  const [owner] = await hre.ethers.getSigners()
  console.log(owner.address)
  for (const to of transferAddresses) {
    const tx = await token.transfer(to, amount)
    console.log(tx)
  }
})

task('mintNFT', 'Mint Chat NFT').setAction(async (args, hre) => {
  console.log('Mint', hre.network.name)
  const deployedAddress = '0xA88d87BD0e3a6CB4e2aC0905eA3fdaCE87E4f660'
  const nft = await hre.ethers.getContractAt('NFT', deployedAddress)
  const [owner] = await hre.ethers.getSigners()
  console.log('Owner Address', owner.address)

  const tx = await (await nft.safeMint(transferAddresses[0])).wait()
  console.log('Tx:', tx)
  const totalSupply = await nft.totalSupply()
  console.log('Supply:', totalSupply)
})

task('nftTest', 'Mint Chat NFT').setAction(async (args, hre) => {
  console.log('Test', hre.network.name)
  const deployedAddress = '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707'
  const nft = await hre.ethers.getContractAt('NFT', deployedAddress)
  const [owner] = await hre.ethers.getSigners()
  console.log('Owner Address', owner.address)

  const totalSupply = await nft.totalSupply()
  console.log('TotalSupply:', totalSupply)
})

task('nftUri', 'GET NFT URI').setAction(async (args, hre) => {
  console.log('NFT URI')
  const deployedAddress = '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707'
  const nft = await hre.ethers.getContractAt('NFT', deployedAddress)
  const [owner] = await hre.ethers.getSigners()
  console.log('Owner Address', owner.address)

  const nft1 = await nft.tokenOfOwnerByIndex(transferAddresses[0], 0)
  console.log('NFT1:', nft1)

  const tokenURI = await nft.tokenURI(1)
  console.log('TokenURI:', tokenURI)
})

export default config
