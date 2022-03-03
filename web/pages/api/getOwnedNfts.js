import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../lib/session";
import { createAlchemyWeb3 } from "@alch/alchemy-web3";
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
    endpoint: "https://fra1.digitaloceanspaces.com",
    region: "eu-central-1",
    credentials: {
        accessKeyId: process.env.DO_ACCESS_KEY_ID,
        secretAccessKey: process.env.DO_SECRET_ACCES_KEY
    }
});

const web3 = createAlchemyWeb3(
    `https://eth-mainnet.alchemyapi.io/v2/${process.env.API_KEY}`,
);


export default withIronSessionApiRoute(getOwnedNftsRoute, sessionOptions);

async function getOwnedNftsRoute(req, res) {
    const user = req.session.user;

    if (!user || user.isLoggedIn === false) {
        res.status(401).end();
        return;
    }

    try {

        const nfts = await web3.alchemy.getNfts({ owner: user.account, contractAddresses: [process.env.CONTRACT_ADDRESS] })

        let nftList = []

        for (let nft of nfts.ownedNfts) {
            let tokenId = parseInt(nft['id']['tokenId'], 16)

            const params = {
                Bucket: process.env.BUCKET_NAME,
                Key: `high-res/${tokenId}.png`,
                Body: "BODY",
                Region: "eu-central-1"
            };

            const command = new GetObjectCommand(params);

            const signedUrl = await getSignedUrl(s3Client, command, {
                expiresIn: 3600,
            });

            nftList.push({
                title: nft.title,
                imageUrl: `https://${process.env.BUCKET_NAME}.fra1.digitaloceanspaces.com/thumbnail/${tokenId}.png`,
                tokenId: tokenId,
                openseaUrl: `https://opensea.io/assets/${process.env.CONTRACT_ADDRESS}/${tokenId}`,
                highresDownloadUrl: signedUrl
            })
        }

        res.json(nftList);
    } catch (error) {
        console.log(error)
        res.status(200).json([]);
    }
}
