/* This example requires Tailwind CSS v2.0+ */
import { Disclosure } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/outline';

const faqs = [
    {
        question: 'What is an NFT?',
        answer: 'An NFT is a unique digital token in an original and non-interchangeable digital asset record stored on the blockchain network. An NFT is owned by the  to the crypto address where the token is located, and data such as price, transaction history and ownership are forever stored and accessible on the blockchain network.',
    },
    {
        question: 'How can I get a Patchwork Kingdom?',
        answer: 'To buy a Patchwork Kingdom, you need a Metamask wallet. You can learn how to set up a Metamask wallet on <a class="underline" href="https://metamask.io/faqs.html" target="_blank">https://metamask.io/faqs.html</a> Once you have a wallet, you can use the ‘Mint’ button to connect your wallet and mint a token.<br><br>You need to be on the whitelist to have a chance to mint one of the tokens. If the list is oversubscribed, a random draw will be held to determine who can mint (see below).',
    },
    {
        question: 'What is the whitelist?',
        answer: `
    One of the goals of Patchwork Kingdom is to do a fair, clear, and transparent launch.  To promote this sense of fairness, all 999 available tokens (minus #1, for the Artist) will be made equally available.  Another goal is to create a strong community for this, and future work.  Here's how we plan to do that.<br><br>

    <ul>
    <li>1) On 23 December, the whitelist will open here on the page.</li>
    <li>2) You will be able to fill in your information (twitter, discord (optional), and ETH wallet address) on the form.</li>
    <li>3) This information will be kept by the Giga team.</li>
    <li>4) If there are more people on the whitelist than available tokens (for example, 3000 people sign up for the WL, but there are only 999 tokens available) we will randomize the entries, record the randomization, and open the minting to only 999 of the 3000.</li>
    <li>5) This means that even if you are on the Whitelist, you may not get to mint a token.  But it will be a fair process.</li>
    <li>6) Unlike many projects, there is no allocation or 'held tokens' for the core team.</li>
    <li>7) This means that if there are more people on the WL than tokens, some of the core team may also not be able to mint a token.  But it will be fair.</li>
    <li>8) If you opt in, we will contact you later about future drops / work.</li>
    <li>9) Whitelisted (and selected, if there are more than 999 on the WL) accounts will have 3 days from the minting to mint.</li>
    <li>10) If there are unclaimed NFTs, the rest will be available to mint on a first come first serve basis to the rest of the whitelist, or to the public, depending on how many people have signed up for the whitelist.</li>
    </ul>
    `,
    },
    {
        question: 'How can I get on the public whitelist?',
        answer: `
      <ul>
        <li>1) Connect your Metamask wallet with the website.</li>
        <li>2) You'll receive a personal hashtag which you then have to include in a tweet.</li>
        <li>3) Share your twitter username and your Discord ID (optional) with us.</li>
        <li>4) As soon as you saved your application, we will verify your tweet and your application. 
      </ul>    
    `,
    },
    {
        question: 'When will the sale happen?',
        answer: 'The sale will begin in January 2022.',
    },
    {
        question: 'Will there be a presale, and is there a presale whitelist?',
        answer: 'No - there is no presale. <br />This will be conducted entirely through the whitelist (see above) (and if the whitelist is oversubscribed, through a lottery system based on the whitelist). This mechanism is designed to make the drop as fair as possible, and also begin creating the community for later Giga work. <br />There is no allocation for the team (other than #1 for the artist) and no second whitelist or private presale. Not all entrants on the whitelist are certain to be able to mint (if there are more wallets on the whitelist than the 999 NFTs available, a random drawing will be held to pick the 999 addresses for minting.)',
    },
    {
        question: 'Will any tokens be withheld from the sale?',
        answer: '1 for the artist.<br>No other tokens will be held back for the team.',
    },
    {
        question: 'What will the proceeds of the minting be used for?',
        answer: 'Proceeds will be used to fund school connectivity efforts through Giga. <br><br>Connecting one school costs us, approximately, and on average in the 19 Giga Lead countries, around 30,000 USD - and we estimate it will cost around 428B$ to connect every school and provide them with appropriate infrastructure, etc.  Some of the proceeds will be used to help move these efforts forward, some to contribute to building a better map of the schools in need, and some to building out the technical roadmap for the next Giga NFT work.',
    },
    {
        question: 'What about the secondary market?',
        answer: "25% of any secondary market sales will go to Giga in perpetuity (to UNICEF France's wallet). <br /><br />This is an unusually high amount of 'royalty' that we believe is another differentiator in this project.  It means that when you sell a Giga NFT you are creating revenue to help connect schools and drive technology solutions for children.  It means that each sale means more than it would otherwise.  This unique (and elevated) percentage is a marker for what Giga would like to achieve in the crypto space: novel, ongoing, boundary-pushing engagement with communities that can help fix the world.",
    },
    {
        question: 'Technical Roadmap for future Giga NFT work',
        answer: "Part of the proceeds from this NFT sale will be used by Giga to develop the next NFT collection based on school data, and add some utility to the pieces that you (hopefully) will own.<br><br><strong>Major activities planned for 2022:</strong><ul><li>1) Decomposing the Patchwork Kingdoms.  Each NFT has certain metadata. We will build an explorer so you can see what countries are 'in' your NFT, and other rarity characteristics.</li><li>2) Prototyping a 1:1 NFT for Giga, where each NFT represents one school exactly.</li><li>3) Adding more 'live' connectivity data to the collections (NFTs that can grow/change over time depending on the connectivity status of schools.</li><li>4) Creating a light DAO/community (and further sustaining and growing the <a href='https://discord.gg/vS9QguncHu' target='_blank' class='underline'>Giga Discord</a></li></ul>",
    },
    {
        question: 'Can UNICEF Staff participate in the sale?',
        answer: 'As per guidance from UNICEF Office of Ethics (Dec2021) UNICEF Staff may participate in this NFT sale as long as they (1) are part of the same purchasing process as the general public (2) agree to not sell their purchased artwork for a period of four years from purchase date and (3) share a copy of this agreement, with their name, with their Giga focal point or a relevant member of the Giga team in UNICEF HQ.<br><br>The Giga team confirms that UNICEF staff will be able to participate in the whitelist with the same conditions as the general public and will not have exclusive or privileged rights to access this sale.',
    },
    {
        question: 'Where can I get more information?',
        answer: 'For more information about Giga please go to <a class="underline" href="https://www.gigaconnect.org">www.gigaconnect.org</a> and tweet at us at <a target="_blank" className="underline" href="https://twitter.com/Gigaconnect">@gigaconnect</a>. To learn more about the Patchwork Kingdoms collection and be part of the community, join the <a target="_blank" class="underline" href="https://discord.gg/vS9QguncHu">Discord channel</a> or <a class="underline" href="https://twitter.com/Gigaconnect" target="_blank">follow us on Twitter.</a>',
    },
];

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function Faq() {
    return (
        <div>
            <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto divide-y-2 divide-gray-200">
                    <h2 className="text-center text-3xl font-extrabold text-gray-900 sm:text-4xl">FAQ</h2>
                    <dl className="mt-6 space-y-6 divide-y divide-gray-200">
                        {faqs.map(faq => (
                            <Disclosure as="div" key={faq.question} className="pt-6">
                                {({ open }) => (
                                    <>
                                        <dt className="text-lg">
                                            <Disclosure.Button className="text-left w-full flex justify-between items-start text-gray-400">
                                                <span className="font-medium text-gray-900">{faq.question}</span>
                                                <span className="ml-6 h-7 flex items-center">
                                                    <ChevronDownIcon
                                                        className={classNames(open ? '-rotate-180' : 'rotate-0', 'h-6 w-6 transform')}
                                                        aria-hidden="true"
                                                    />
                                                </span>
                                            </Disclosure.Button>
                                        </dt>
                                        <Disclosure.Panel as="dd" className="mt-2 pr-12">
                                            <p className="text-base text-gray-500" dangerouslySetInnerHTML={{ __html: faq.answer }}></p>
                                        </Disclosure.Panel>
                                    </>
                                )}
                            </Disclosure>
                        ))}
                    </dl>
                </div>
            </div>
        </div>
    );
}
