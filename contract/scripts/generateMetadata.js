const testFolder = __dirname + '/../data/metadata/';
const fs = require('fs');

for (let i = 1; i <= 1000; i++) {

    let tmpMetadata = require(testFolder + i + '.json');

    tmpMetadata.image = `https://gateway.pinata.cloud/ipfs/QmQCSd3VTxXKvczXQ2c9EXZF6SuKLz91W6AZ1QRNhzYkNn/${i}.png`
    tmpMetadata.external_url = `https://www.patchwork-kingdoms.com`

    fs.writeFileSync(__dirname + `/../data/metadata-final/${i}`, JSON.stringify(tmpMetadata, null, 2), 'utf-8');

}