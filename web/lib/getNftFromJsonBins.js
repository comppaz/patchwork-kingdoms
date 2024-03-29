import { bins } from '../data/bins';

function idToBinIdMapping(id) {
    return bins[id];
}

const requestHeaders = {
    'X-Access-Key': process.env.NEXT_PUBLIC_JSONBIN_KEY,
    // omit all the metadata of the bin and simply return stored data
    'X-Bin-Meta': false,
};

export default async function getNftFromJsonBins(tokenId) {
    const options = {
        method: 'GET',
        headers: requestHeaders,
    };

    // get BinId with given tokenId
    let binId = idToBinIdMapping(tokenId);

    // get request to jsonBin API
    let urlPath = 'https://api.jsonbin.io/v3/b/' + binId;
    const response = await fetch(urlPath, options);
    const data = await response.json();

    return data;
}
