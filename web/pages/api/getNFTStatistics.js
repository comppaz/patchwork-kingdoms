export default async function getNFTStatistics(req, res) {
    const options = {
        method: 'GET',
    };

    const tokenId = req.body.tokenId;

    if (tokenId != null) {
        console.log('Requesting single Nft statistics via api call');
        let url = process.env.LEADERBOARD_API_URL + '/getNftStatistics?id=' + tokenId;

        const response = await fetch(url, options);
        const data = await response.json();

        res.json(data);
    } else {
        console.log('Requesting all Nft statistics via api call');
        let url = process.env.LEADERBOARD_API_URL + '/getAllNftStatistics';

        const response = await fetch(url, options);
        const data = await response.json();

        res.json(data);
    }
}
