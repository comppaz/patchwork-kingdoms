const fs = require('fs')

for (let i = 1; i <= 25; i++) {

    let md = {
        "description": "Let's build a community of supporters for the Giga initiative and raise funds to bring reliable, robust connectivity to schools across the globe.",
        "external_url": "https://patchwork-kingdoms.com",
        "image": `https://dummyimage.com/512x512/000/fff&text=${i}`,
        "name": `Patchwork Kingdoms #${i}`,
    }


    fs.writeFileSync(__dirname + `/../data/metadata/${i}`, JSON.stringify(md, null, 2), 'utf-8');

}