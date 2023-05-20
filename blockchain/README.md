# PolyChat Smart Contracts

## Deployed Contracts

All the contracts in this repository have been successfully deployed and verified on the Mumbai testnet.

The following contracts are deployed and can be found on the Mumbai testnet:

| contract | address |
|---|---|
| `PolyChat`       | [0x3554ecb314f8bc660b63f39b61efafc45da43f7f](https://mumbai.polygonscan.com/address/0x3554ecb314f8bc660b63f39b61efafc45da43f7f#code)                    |
| `AdRevenueShare` | [0xbab47ec72e8bb4f45352d3c5cd1b8480c0311588](https://mumbai.polygonscan.com/address/0xbab47ec72e8bb4f45352d3c5cd1b8480c0311588#code)                    |
| `PolyChain Coin` | [0x62626e7670fa18737513239230b7c10ce1423bab](https://mumbai.polygonscan.com/address/0x62626e7670fa18737513239230b7c10ce1423bab#code)                    |
| `NFT`            | [0xa88d87bd0e3a6cb4e2ac0905ea3fdace87e4f660](https://mumbai.polygonscan.com/address/0xa88d87bd0e3a6cb4e2ac0905ea3fdace87e4f660#code) |

# How to run

## Prerequisites

Before running the PolyChat Smart Contracts, make sure to create a .env file from the provided .env.example file. Use the following command to create the .env file:

```shell
cp .env.example .env
```
After creating the .env file, ensure that all the required environment variables are properly filled in.

## Installation

To install the necessary dependencies for running the PolyChat Smart Contracts, execute the following command:

```
yarn install
```

This command will install all the required dependencies.

## Deploy locally

To deploy the contracts locally, follow the steps below:

1. Start a local development network using Hardhat by running the following command:

```shell
npx hardhat node
```

2. Once the local network is up and running, deploy the PolyChat contract by executing the following command:

```shell
yarn deploy-polyChat --network localhost
```

The contract will be deployed locally and ready for use.

## Deploy to Mumbai testnet

To deploy the contracts to the Mumbai testnet, use the following command:

```shell
yarn deploy-polyChat --network mumbai
```

This will deploy the contracts to the Mumbai testnet.

## Run test

To run the tests for the PolyChat Smart Contracts, execute the following command:

```shell
yarn test
```

This command will run the test suite and verify the functionality of the deployed contracts.

Please ensure that you follow the provided instructions carefully to deploy and run the PolyChat Smart Contracts successfully.
