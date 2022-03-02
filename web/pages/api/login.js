import Cors from 'cors'
import { ethers } from 'ethers'
import contractAbi from '../../data/PatchworkKingdoms.json'

const provider = new ethers.providers.AlchemyProvider(
    'mainnet',
    process.env.API_KEY,
)

const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider)

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
        methods: ['POST', 'OPTIONS'],
        origin: ['http:localhost:3000', 'https://patchwork-kingdoms.com', 'https://pathwork-kingdom-git-feature-whitelist-craft-clarity.vercel.app'],

    })
)


export default async function login(req, res) {

    await cors(req, res)

    if (req.method === 'POST') {
        console.log(`Received new login request: ${JSON.stringify(req.body)}`)

        const message = 'I want to login to Patchwork Kingdoms.';
        const actualAddress = ethers.utils.verifyMessage(message, req.body.signature).toLowerCase();

        if (actualAddress === req.body.account.toLowerCase()) {
            console.log('User is legit')

            const contract = new ethers.Contract(
                process.env.CONTRACT_ADDRESS,
                contractAbi,
                signer,
            )


            let balance = (await contract.balanceOf(actualAddress)).toNumber()

            console.log(balance)
        }

        res.status(200).json({ error: null, code: 200 })
    } else {
        return res.status(500).json({ error: 'Internal Server Error', code: 500 })
    }


}