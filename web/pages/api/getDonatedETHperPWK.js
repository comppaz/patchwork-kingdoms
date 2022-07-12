const initMintPrice = 0.175;
const asset_contract_address = "0xd24a7c412f2279b1901e591898c1e96c140be8c5";

export default async function getDonatedETHperPWK(req, res){
    
    console.log(`Received new getDonatedETHperPWK req with body: ${JSON.stringify(req.body)}`)

    const options = {
        method: 'GET',
        headers: {Accept: 'application/json', 'X-API-KEY': process.env.NEXT_PUBLIC_OPENSEA_API_KEY}
    }
    
    const tokenId = req.body.tokenId;

    let url = "https://api.opensea.io/api/v1/events?only_opensea=true&token_id="+tokenId+"&asset_contract_address="+asset_contract_address+"&event_type=successful";

    const response = await fetch(url, options);
    const data = await response.json();
    let totalDonated = initMintPrice;

    console.log(data);

    
    if(data && (data.asset_events.length > 0)){
        data.asset_events.forEach(element => {
            totalDonated += (element.total_price/10 ** 18);
        });
    }

    res.json({
        totalDonated: totalDonated.toFixed(2)
    });
}
