# Patchwork Kingdoms - Smart Contract

The smart contract for the Patchwork Kingdoms project (https://patchwork-kingdoms.com).

**Requirements**
- Node.js >= v17.2.0
## First steps
### Step 1: Setup Required accounts

1. Alchemy Account | Create an account and create an app. We'll need the URL later. 
https://www.alchemy.com/

2. Pinata Account | Create an account.
https://www.pinata.cloud/

3. Etherscan Account | Create an account and create an API key.
https://etherscan.io/

### Step 2: Prepare your environment
Install the dependencies:
```shell
npm install
```

And setup the *.env* file: 
```
PRIVATE_KEY=<YOUR_PRIVATE_KEY>
GOERLI_URL=<URL_COPIED_FROM_ALCHEMY>
MAINNET_URL=<URL_COPIED_FROM_ALCHEMY>
REPORT_GAS=true
ETHERSCAN_API_KEY=<ETHERSCAN_API_KEY>
ARTIST_ADDRESS=<THE_ARTIST_WALLET_ADDRESS>

# We will add these 3 values afterwards
CONTRACT_ADDRESS=
BASE_URL=
PLACEHOLDER_IMAGE=
```
### Step 3: Generate metadata and upload it to Pinata. 

Generate the metadata first:
``` shell
 node scripts/generateDummyMetadata.js
```

Upload the metadata folder (*data/metadata*) to Pinata and copy the URL and use it as **BASE_URL** in the *.env* file. 
Make sure it has a trailing slash: 
```
https://example.com/
```

Upload the placeholder artwork to Pinata and copy the URL and use it as **PLACEHOLDER_IMAGE** in the *.env* file.
## Testing

Run all test before doing any deployment: 

```shell
npx hardhat test
```

## Deployment

### Deployment on network

```shell
npx hardhat run --network [goerli | mainnet] scripts/deploy.js
```

Then add the display contract address to your *.env* file as **CONTRACT_ADDRESS**.

### Verify the contract on Etherscan

```shell
npx hardhat verify --network [goerli | mainnet] <CONTRACT_ADDRESS> <ARTIST_ADDRESS>
```

### Set the base url
```shell
npx hardhat run --network [goerli | mainnet] scripts/setBaseUrl.js
```

### Set the merkle root

First make sure the file *whitelist.json* is available in the *data/* directory. 

Then run: 
```shell
npx hardhat run --network [goerli | mainnet] scripts/setMerkleRoot.js
```

## Useful commands
### Toggle the whitelist sale

By default it is set to *false*:

```shell
npx hardhat run --network [goerli | mainnet] scripts/toggleWhitelistSale.js
```

### Withdraw ETH to owner wallet

```shell 
npx hardhart run --network [goerli | mainnet] scripts/withdraw.js
```