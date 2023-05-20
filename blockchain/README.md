# PolyChat Smart Contracts

## Deplyed Contracts

All the contracts are deployed and verifued on `Mumbai testnet`

- `PolyChat` contract - [0x3554ecb314f8bc660b63f39b61efafc45da43f7f](https://mumbai.polygonscan.com/address/0x3554ecb314f8bc660b63f39b61efafc45da43f7f#code)
- `AdRevenueShare` contract - [0xbab47ec72e8bb4f45352d3c5cd1b8480c0311588](https://mumbai.polygonscan.com/address/0xbab47ec72e8bb4f45352d3c5cd1b8480c0311588#code)
- `PolyChain Coin` contract - [0x62626e7670fa18737513239230b7c10ce1423bab](https://mumbai.polygonscan.com/address/0x62626e7670fa18737513239230b7c10ce1423bab#code)
- `NFT` contract - [0x3554ecb314f8bc660b63f39b61efafc45da43f7f](https://mumbai.polygonscan.com/tx/0xcf60dd51f5d5eb6f901c32290befbbdcf6ea2b524c1b946bbe7a9b5b0f617a1b#code)

# How to run

## Prerequisites

Create `.env` from `.env.example`

```shell
cp .env.example .env
```

fill in all environment variables.

## Installation

```
yarn install
```

## Deploy locally

```shell
npx hardhat node
yarn deploy-polyChat --network localhost
```

## Deploy to Mumbai testnet

```shell
yarn deploy-polyChat --network mumbai
```

## Run test

```shell
yarn test
```
