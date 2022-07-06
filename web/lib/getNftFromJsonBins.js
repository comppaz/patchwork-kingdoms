import { idToBinIdMapping } from "./idToBinIdMapping";

const requestHeaders = {
    'X-Master-Key': "$2b$10$PmH2J"+process.env.NEXT_PUBLIC_MASTER_JSONBIN_KEY, 
    'X-Access-Key': "2b$10$NJu584ify0qhA1EQ36Clj"+process.env.NEXT_PUBLIC_JSONBIN_KEY,
    // omit all the metadata of the bin and simply return stored data
    'X-Bin-Meta': false
}

export default async function getNftFromJsonBins(tokenId){
    const options = {
        method: 'GET',
        headers: requestHeaders
    }
    
    // get BinId with given tokenId
    let binId = idToBinIdMapping(tokenId)

    // get request to jsonBin API
    let urlPath = "https://api.jsonbin.io/v3/b/"+binId;
    const response = await fetch(urlPath, options);
    const data = await response.json();
    console.log(data);

    return data ;
}