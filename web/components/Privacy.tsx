/* This example requires Tailwind CSS v2.0+ */
import { Disclosure } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/outline';

const policy = [
    {
        header: 'Section 1: Data Collection',
        content:
            'When you donate your Patchwork Kingdom NFT to Giga, we will collect certain personal data about you, including your chosen username, email address, and wallet address. Giga and UNICEF may collect the email addresses of donors and buyers on a voluntary basis, for the sole purpose of sending transactional emails to the donor and/or buyer. These emails will be related to the purchase and donation of PWK, such as confirming the donation, purchase, or transfer of PWK, or notifying the donor of their status as a "Giga Friend". Giga and UNICEF will not share or sell these email addresses to any third party, except as required by law. Donors and buyers may unsubscribe from these transactional emails at any time, and their email addresses will be removed from our system.',
    },
    {
        header: 'Section 2: Use of Data',
        content:
            'We use the personal data collected during the donation process to provide you with transactional emails, such as confirmation of your donation and information about the buyer of your Patchwork Kingdom NFT. We may also use your personal data to comply with legal obligations or enforce our legal rights.',
    },
    {
        header: 'Section 3: Disclosure of Data',
        content:
            'We may disclose your personal data to our third-party service providers who assist us in delivering our services, such as processing transactions or hosting our website. These service providers are obligated to maintain the confidentiality and security of your personal data, and are prohibited from using your personal data for any other purpose. We may also disclose your personal data to law enforcement agencies or other third parties if we are required to do so by law, or if we believe in good faith that such disclosure is necessary to comply with legal requirements, prevent fraud or other illegal activities, or protect the safety and security of our users.',
    },
    {
        header: 'Section 4: Data Security',
        content:
            'We take the security of your personal data seriously and have implemented technical and organizational measures to protect against unauthorized access, disclosure, alteration, or destruction of your personal data. Our website is encrypted using SSL technology, and we regularly monitor our systems for security vulnerabilities.',
    },
    {
        header: 'Section 5: Data Retention',
        content:
            'We will retain your personal data for as long as necessary to fulfill the purposes for which it was collected, or as required by applicable law. We may also retain certain personal data for longer periods of time if necessary to comply with legal obligations or enforce our legal rights.',
    },
    {
        header: 'Section 6: Your Rights',
        content:
            'You have certain rights with respect to your personal data, including the right to access, correct, or delete your personal data, as well as the right to restrict or object to our processing of your personal data. If you wish to exercise any of these rights, please contact us using the contact details provided below.',
    },
    {
        header: 'Section 7: Limitation of Liability',
        content:
            "Giga and UNICEF make no representations or warranties of any kind, express or implied, about the accuracy, completeness, reliability, suitability, or availability with respect to the donation feature or any information, products, services, or related graphics contained on the Patchwork Kingdoms website for any purpose. Any reliance placed on such information is strictly at the user's own risk. In no event will Giga or UNICEF be liable for any loss or damage including, without limitation, indirect or consequential loss or damage, or any loss or damage whatsoever arising from loss of data or profits arising out of, or in connection with, the use of the donation feature. Giga and UNICEF will not be responsible for any malfunction, error, or damage that occurs during the use of the donation feature. The donor and buyer have the final responsibility in making the decision to use the smart contracts linked to this feature, and they do so at their own risk.",
    },
    {
        header: 'Section 8: Governing Law',
        content:
            'This privacy policy shall be governed by and construed in accordance with the laws of the United States of America, without giving effect to any principles of conflicts of law.',
    },
    {
        header: 'Section 9: Changes to this Privacy Policy',
        content:
            'Giga and UNICEF reserve the right to modify this privacy policy at any time, and without prior notice. The latest version of this privacy policy will always be available on the Patchwork Kingdoms website. If you continue to use the donation feature after any changes have been made to this privacy policy, you are accepting the changes.',
    },
    {
        header: 'Section 10: Contact Us',
        content:
            'If you have any questions or concerns about this privacy policy, please contact us at <a class="underline" href="mailto:info@giga.global">info@giga.global</a>',
    },
];

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function Privacy() {
    return (
        <div>
            <div></div>
            <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-center text-3xl font-extrabold text-gray-900 sm:text-4xl">Privacy Policy</h2>
                    <div className=" font-bold mt-5 text-md text-gray-600 sm:text-md">
                        This Privacy Policy (&quot;Policy&quot;) is designed to assist users of the Patchwork Kingdoms NFT Collection in
                        understanding how their personal information is collected, used, and disclosed when they choose to donate their
                        Patchwork Kingdoms NFTs (&quot;Donation&quot;) to the Giga initiative through the Patchwork Kingdoms website. Please
                        read this Policy carefully to understand how we collect and use your personal information in connection with the
                        Donation. By donating your Patchwork Kingdoms NFTs, you agree to the collection and use of your personal information
                        as outlined in this Policy. If you do not agree with this Policy, please do not donate your Patchwork Kingdoms NFTs
                        through the Patchwork Kingdoms website.
                    </div>
                </div>
                <div className="max-w-3xl mx-auto divide-y-2 divide-gray-200">
                    <dl className="mt-6 space-y-6 divide-y divide-gray-200">
                        {policy.map(pol => (
                            <Disclosure defaultOpen as="div" key={pol.header} className="pt-6">
                                {({ open }) => (
                                    <>
                                        <dt className="text-lg">
                                            <Disclosure.Button className="text-left w-full flex justify-between items-start text-gray-400">
                                                <span className="font-medium text-gray-900">{pol.header}</span>
                                                <span className="ml-6 h-7 flex items-center">
                                                    <ChevronDownIcon
                                                        className={classNames(open ? '-rotate-180' : 'rotate-0', 'h-6 w-6 transform')}
                                                        aria-hidden="true"
                                                    />
                                                </span>
                                            </Disclosure.Button>
                                        </dt>
                                        <Disclosure.Panel as="dd" className="mt-2 pr-12">
                                            <p className="text-base text-gray-500" dangerouslySetInnerHTML={{ __html: pol.content }}></p>
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
