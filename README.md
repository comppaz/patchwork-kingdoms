# Patchwork Kingdoms 

# Setup 

Install the dependencies:
```shell
npm install
```

Setup your environment: 
```
PRIVATE_KEY=
GOERLI_URL=
REPORT_GAS=true
ETHERSCAN_API_KEY=
COINMARKETCAP=
ARTIST_ADDRESS=
CONTRACT_ADDRESS=
BASE_URL=
```
# Run tests locally 

```shell
npx hardhat test
```

# Run deployment on given network

```shell
npx hardhat run --network goerli scripts/deploy.js
```
# Verify contract on given network 

```shell
npx hardhat verify --network goerli
```

# Set the base url

```shell
npx hardhat run --network goerli scripts/setBaseUrl.js
```

# Set the merkle root

```shell
npx hardhat run --network goerli scripts/setMerkleRoot.js
```

# Activate the whitelist sale 

```shell
npx hardhat run --network goerli scripts/toggleWhitelistSale.js
```