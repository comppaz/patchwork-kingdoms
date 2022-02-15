const { PrismaClient } = require('@prisma/client')
const sqlite = require('better-sqlite3')
const path = require('path');
const { exit } = require('process');
const { TwitterApi } = require('twitter-api-v2')
const Web3 = require('web3');

const prisma = new PrismaClient()
const client = new TwitterApi(process.env.TWITTER_BEARER);
const db = new sqlite(__dirname + '/whitelist.db', { fileMustExist: true });

const web3 = new Web3("https://eth-mainnet.alchemyapi.io/v2/vTVycMxHxsp7fnQhbH4IWXzpQ13UbDpu");

async function checkTweet(twitterUsername) {

    if (twitterUsername[0] === '@') {
        twitterUsername = twitterUsername.substring(1)
    }

    let user;

    try {
        user = await client.v2.usersByUsernames([twitterUsername], { 'user.fields': ['profile_image_url', 'description', 'public_metrics'] });
    } catch (err) {

        if (err.data.title === "Invalid Request") {
            return {
                isActive: 0,
                hasBio: 0,
                hasProfilePic: 0,
                didTweet: 0
            }
        } else {
            console.log(err);
            exit(1)
        }
    }

    if ("errors" in user) {
        if (user["errors"][0]["title"] === "Not Found Error" || user["errors"][0]["title"] === "Forbidden") {
            console.log(`User with handle ${twitterUsername} not found...`)
            return {
                isActive: 0,
                hasBio: 0,
                hasProfilePic: 0,
                didTweet: 0
            }
        }


    }
    console.log(user)
    console.log(`Found twitter handle ${twitterUsername} with name ${user.data[0].name} and id ${user.data[0].id}`)

    const tweets = await client.v2.userTimeline(user.data[0].id, { exclude: 'replies', max_results: 100 })
    let tweetId = false;

    console.log()

    if (tweets._realData.errors) {
        if (tweets._realData.errors[0].title === 'Authorization Error') {
            console.log(`User with handle ${twitterUsername} not authorized to check tweets...`)
            return {
                isActive: 0,
                hasBio: 0,
                hasProfilePic: 0,
                didTweet: 0
            }
        }
    }

    if (tweets.data.meta.result_count === 0) {
        return {
            isActive: user.data[0].public_metrics.tweet_count > 5 && user.data[0].public_metrics.followers_count > 0 ? 1 : 0,
            hasBio: user.data[0].description.length > 0 ? 1 : 0,
            hasProfilePic: user.data[0].profile_image_url.indexOf('default_profile_images') === -1 ? 1 : 0,
            didTweet: 0
        }
    }

    tweets.data.data.some(el => {
        if (el.text.indexOf('@Gigaconnect') > -1) {
            tweetId = el.id;
        }
        return tweetId;
    });

    return {
        isActive: user.data[0].public_metrics.tweet_count > 5 && user.data[0].public_metrics.followers_count > 0 ? 1 : 0,
        hasBio: user.data[0].description.length > 0 ? 1 : 0,
        hasProfilePic: user.data[0].profile_image_url.indexOf('default_profile_images') === -1 ? 1 : 0,
        didTweet: tweetId !== false ? 1 : 0
    };

}

async function checkWallet(address) {

    let txCount = await web3.eth.getTransactionCount(address)
    let balance = await web3.eth.getBalance(address)

    return {
        transactionCount: txCount,
        walletBalance: parseFloat(parseFloat(web3.utils.fromWei(balance, 'ether')).toFixed(2))
    }
}

async function main() {
    const allEntries = await prisma.whitelist.findMany()

    for (let entry of allEntries) {

        let row = db.prepare('SELECT * FROM cleaned WHERE address = ?').get(entry["address"]);

        if (row) {
            console.log(`Skipping for ${row.address} ...`)
            continue;
        }

        let tweeted = await checkTweet(entry["twitterHandle"])
        let wallet = await checkWallet(entry["address"])

        let wlObj = {
            address: entry["address"],
            twitterHandle: entry["twitterHandle"],
            discordId: entry["discordId"],
            tweetUrl: entry["tweetUrl"],
            contactPermission: entry["contactPermission"] ? 1 : 0
        }

        wlObj = { ...wlObj, ...tweeted, ...wallet }


        const cols = Object.keys(wlObj).join(", ");
        const placeholders = '@' + Object.keys(wlObj).join(", @");

        const insert = db.prepare('INSERT INTO cleaned (' + cols + ') VALUES (' + placeholders + ')');

        try {
            insert.run(wlObj);
        } catch (err) {
            console.log(err)
        }
        await new Promise(resolve => setTimeout(resolve, 2200));
    }
}

main()
    .catch((e) => {
        throw e
    })
    .finally(async () => {
        await prisma.$disconnect()
    })