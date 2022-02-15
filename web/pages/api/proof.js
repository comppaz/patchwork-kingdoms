import Cors from 'cors'
import { MerkleTree } from 'merkletreejs'
import keccak256 from 'keccak256'
import whitelist from '../../data/whitelist.json'

function initMiddleware(middleware) {
    return (req, res) =>
        new Promise((resolve, reject) => {
            middleware(req, res, (result) => {
                if (result instanceof Error) {
                    return reject(result)
                }
                return resolve(result)
            })
        })
}

// Initialize the cors middleware
const cors = initMiddleware(
    Cors({
        methods: ['GET', 'OPTIONS'],
        origin: ['http:localhost:3000', 'https://patchwork-kingdoms.com', 'https://pathwork-kingdom-git-feature-minting-craft-clarity.vercel.app'],

    })
)

const hashedAddresses = whitelist.map(addr => keccak256(addr.toLowerCase()));
const merkleTree = new MerkleTree(hashedAddresses, keccak256, { sortPairs: true });

export default async function proof(req, res) {

    await cors(req, res)

    if (req.method === 'GET') {

        console.log(`Received new request: ${JSON.stringify(req.query)}`)

        const address = req.query.address;

        if (!address) {
            res.status(400).json({ error: "Wallet address is required." });
            return;
        }

        const hashedAddress = keccak256(address);
        const proof = merkleTree.getHexProof(hashedAddress);
        //const root = merkleTree.getHexRoot();
        //const valid = merkleTree.verify(proof, hashedAddress, root);

        res.status(200).json({
            proof,
            valid: true,
        });

    } else {
        return res.status(400).json({})
    }


}