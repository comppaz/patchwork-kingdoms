import { PrismaClient } from '@prisma/client'
import Cors from 'cors'

const prisma = new PrismaClient()

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


export default async function verify(req, res) {

    await cors(req, res)

    if (req.method === 'POST') {
        console.log(`Received new request: ${JSON.stringify(req.body)}`)

        if (!req.body.twitter || !req.body.twitter.length || !req.body.eth || !req.body.eth.length || !req.body.sol || !req.body.sol.length) {
            return res.status(500).json({ error: 'Internal Server Error', code: 500 })
        }

        let twitterUsername = req.body.twitter

        if (twitterUsername[0] === '@') {
            twitterUsername = req.body.twitter.substring(1);
        }


        try {
            await prisma.raffle.create({
                data: {
                    ethAddress: req.body.eth,
                    solAddress: req.body.sol,
                    twitterHandle: twitterUsername,
                    contactPermission: req.body.contact_permission
                }
            });
            return res.status(200).json({ msg: 'Successful application.', code: 200 })
        } catch (err) {
            console.log(err)
            return res.status(400).json({ error: 'You already applied.', code: 400 })
        }

    } else {
        return res.status(500).json({ error: 'Internal Server Error', code: 500 })
    }


}