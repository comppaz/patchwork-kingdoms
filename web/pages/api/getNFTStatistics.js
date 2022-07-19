// TODO update api url to where the server will run
export default async function getNFTStatistics(req, res){
    
    const options = {
        method: 'GET',
    }
    
    const tokenId = req.body.tokenId;

    let url = "http://localhost:3001/getNftStatistics?id="+tokenId;

    const response = await fetch(url, options);
    const data = await response.json();

    res.json(data);
}
