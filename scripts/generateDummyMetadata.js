require("dotenv").config();
const fs = require('fs')

for (let i = 1; i <= 1000; i++) {

    let md = {
        "description": "**To be revealead when all tokens are minted.** Let's build a community of supporters for the Giga initiative and raise funds to bring reliable, robust connectivity to schools across the globe.",
        "external_url": "https://patchwork-kingdoms.com",
        "image": process.env.PLACEHOLDER_IMAGE,
        "name": `Patchwork Kingdoms #${i}`,
    }

    fs.writeFileSync(__dirname + `/../data/metadata/${i}`, JSON.stringify(md, null, 2), 'utf-8');

}