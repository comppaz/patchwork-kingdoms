import { Fragment, useEffect, useState } from 'react';
import { Transition, Dialog } from '@headlessui/react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/outline';
import { useWeb3React } from '@web3-react/core';
import { injected } from './_web3';
import { PublicKey } from '@solana/web3.js';

export default function Banner() {
    const [open, setOpen] = useState(false);
    const [username, setUsername] = useState(null);
    const [solanaAddress, setSolanaAddress] = useState(null);
    const [check, setCheck] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [running, setRunning] = useState(false);

    const { active, account, activate } = useWeb3React();

    useEffect(async () => {
        if (!open) {
            setRunning(false);
            setError(null);
        }
    }, [open]);

    const handleTwitter = e => {
        setUsername(e.target.value);
    };

    const handleSolana = e => {
        setSolanaAddress(e.target.value);
    };

    const handleCheckbox = e => {
        setCheck(!check);
    };

    async function connect() {
        try {
            await activate(injected);
        } catch (ex) {
            console.log(ex);
        }
    }

    const save = async () => {
        setRunning(true);
        setError(null);
        setSuccess(false);

        if (!running && success) {
            setOpen(false);
            return;
        }

        if (running) {
            return;
        }

        if (!check) {
            setRunning(false);
            return setError('Please agree to the terms and to the privacy policy.');
        }

        if (!account || account.length === 0) {
            setRunning(false);
            return setError('Please connect your wallet.');
        }

        if (!username || username.trim().length === 0) {
            setRunning(false);
            return setError('Please provide your Twitter handle.');
        }

        if (!solanaAddress || solanaAddress.length === 0) {
            setRunning(false);
            return setError('Please provide your Solana wallet address.');
        } else {
            try {
                let addressPubkey = new PublicKey(solanaAddress);
                let legitSolAddress = PublicKey.isOnCurve(addressPubkey);
                if (!legitSolAddress) throw Error();
            } catch (err) {
                setRunning(false);
                return setError('Your Solana wallet address does not seem to be a valid address.');
            }
        }

        const res = await fetch(`/api/verify-sc`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                twitter: username.trim(),
                eth: account,
                sol: solanaAddress.trim(),
                contact_permission: check,
            }),
        });

        if (res.status === 400) {
            setRunning(false);
            return setError((await res.json()).error);
        }

        if (res.status === 200) {
            setRunning(false);
            setSuccess(true);
        }
    };

    return (
        <>
            <div className="bg-teal-600 -mt-2">
                <div className="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between flex-wrap">
                        <div className="w-0 flex-1 flex items-center">
                            <span className="flex p-1 w-12 rounded-lg">
                                <img width="24" src="/images/snowcrash-icon-white.png" />
                            </span>
                            <p className="ml-3 font-medium pr-1 text-white">
                                <span className="md:hidden">
                                    Our partners at{' '}
                                    <a href="https://snowcrash.com" className="underline" target="_blank" rel="noreferrer">
                                        Snowcrash
                                    </a>{' '}
                                    have reserved <strong>100 founding membership tokens</strong> for you!{' '}
                                </span>
                                <span className="hidden md:inline">
                                    To thank you for joining the Giga community, our partners at{' '}
                                    <a href="https://snowcrash.com" className="underline" target="_blank" rel="noreferrer">
                                        Snowcrash
                                    </a>{' '}
                                    have reserved <strong>100 founding membership tokens</strong> for you!{' '}
                                </span>
                            </p>
                        </div>
                        <div className="order-1 mt-2 flex-shrink-0 w-auto sm:order-2 sm:mt-0 sm:w-auto">
                            <button
                                className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-light text-teal-800 bg-white hover:bg-teal-50"
                                onClick={() => setOpen(true)}>
                                Apply now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Transition.Root show={open} as={Fragment}>
                <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={setOpen}>
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0">
                            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                        </Transition.Child>

                        {/* This element is to trick the browser into centering the modal contents. */}
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                            &#8203;
                        </span>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                                <div>
                                    <div className="mx-auto flex items-center justify-center h-12 w-36">
                                        <img width="200" src="/images/SNOWCRASH-LOGO-BLACK.png" />
                                    </div>
                                    <div className="mt-3 text-center sm:mt-5">
                                        <Dialog.Title as="h3" className="text-xl leading-6 font-medium text-gray-900">
                                            Apply to win one of <br />{' '}
                                            <strong>
                                                100 Snowcrash founding <br /> membership tokens
                                            </strong>
                                            !
                                        </Dialog.Title>
                                        <div className="mt-4">
                                            <p className="text-sm">
                                                To be eligible to win one, you have to be on the Patchwork Kingdoms whitelist and complete
                                                this form!
                                            </p>
                                        </div>
                                        <div className="mt-8">
                                            <p className="text-lg tracking-wide">1. Connect to select your Ethereum wallet.</p>
                                            <button
                                                onClick={connect}
                                                className="py-2 mt-6 mb-4 text-sm text-gray-400 border border-gray-400 rounded-lg w-48 bg-white hover:bg-white px-12">
                                                <img src="/images/metamask.svg" width="125" />
                                            </button>
                                            <div className="-mt-2">
                                                {active ? (
                                                    <p className="text-xs">Connected with {account}</p>
                                                ) : (
                                                    <p className="text-xs">Not connected.</p>
                                                )}
                                            </div>
                                            <div className="mt-8">
                                                <p className="text-lg tracking-wide">
                                                    2. Tweet about the project <br />
                                                    and tag <strong>@SnowcrashLabs</strong>.
                                                </p>
                                                <div className="py-2 mt-2 mb-4">
                                                    <div className="mt-2">
                                                        <a
                                                            href={
                                                                'https://twitter.com/intent/tweet?url=https%3A%2F%2Fpatchwork-kingdoms.com&text=I%E2%80%99m%20supporting%20Giga%20to%20help%20bring%20internet%20connectivity%20to%20schools%20around%20the%20world.%20%0A%0A@SnowcrashLabs,%20Giga%E2%80%99s%20creative%20partner%20on%20its%20inaugural%20NFT%20project,%20has%20reserved%20100%20membership%20tokens%20for%20the%20giga%20community.%20%0A%0ASign%20up%20for%20your%20chance%20to%20win%20one:'
                                                            }
                                                            target="_blank"
                                                            className="py-2 mt-6 mb-4 text-sm text-gray-600 border border-gray-400 rounded-lg bg-white hover:bg-white px-12"
                                                            rel="noreferrer">
                                                            <svg
                                                                className="w-6 inline-flex pr-2 -mt-1"
                                                                role="img"
                                                                fill="#1DA1F2"
                                                                viewBox="0 0 24 24"
                                                                xmlns="http://www.w3.org/2000/svg">
                                                                <title>Twitter</title>
                                                                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                                            </svg>
                                                            Tweet now
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-8">
                                                <p className="text-lg tracking-wide">
                                                    3. Share your Twitter handle and <br /> your Solana wallet with us!{' '}
                                                </p>
                                                <div className="py-2 mt-2 mb-4">
                                                    <div className="mt-2">
                                                        <div className="mt-1 flex rounded-md shadow-sm max-w-xs mx-auto">
                                                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                                                                Twitter
                                                            </span>
                                                            <input
                                                                type="text"
                                                                name="twitter"
                                                                id="twitter"
                                                                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none border rounded-r-md focus:ring-teal-500 focus:border-teal-500 sm:text-sm border-gray-300"
                                                                placeholder="@example"
                                                                onChange={e => {
                                                                    handleTwitter(e);
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="mt-2">
                                                        <div className="mt-1 flex rounded-md shadow-sm max-w-xs mx-auto">
                                                            <span className="inline-flex items-center px-3 rounded-l-md border w-30 border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                                                                Solana Wallet
                                                            </span>
                                                            <input
                                                                type="text"
                                                                name="discord"
                                                                id="discord"
                                                                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none border rounded-r-md focus:ring-teal-500 focus:border-teal-500 sm:text-sm border-gray-300"
                                                                placeholder="2Ge..."
                                                                onChange={e => {
                                                                    handleSolana(e);
                                                                }}
                                                            />
                                                        </div>
                                                        <p className="text-xs block max-w-xs mx-auto mt-2">
                                                            If you are elected you&apos;ll receive your token on Solana.
                                                        </p>
                                                    </div>
                                                    <div className="mt-4">
                                                        <label className="inline-flex items-left mt-3 max-w-xs">
                                                            <input
                                                                type="checkbox"
                                                                className="form-checkbox h-5 w-8 text-gray-600"
                                                                onChange={e => {
                                                                    handleCheckbox(e);
                                                                }}
                                                                checked={check}
                                                            />
                                                            <span className="ml-2 text-sm text-left">
                                                                By clicking on the button below, you acknowledge you have read and agree to
                                                                be bound by Snowcrash, Inc.’s{' '}
                                                                <a
                                                                    className="text-teal-900 underline"
                                                                    href="https://snowcrash.com/privacy"
                                                                    target="_blank"
                                                                    rel="noreferrer">
                                                                    Privacy Policy
                                                                </a>{' '}
                                                                and{' '}
                                                                <a
                                                                    className="text-teal-900 underline"
                                                                    href="https://snowcrash.com/terms"
                                                                    target="_blank"
                                                                    rel="noreferrer">
                                                                    Terms of Use
                                                                </a>
                                                                .”
                                                            </span>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {error ? (
                                    <div className="rounded-md bg-red-50 p-4">
                                        <div className="flex">
                                            <div className="flex-shrink-0">
                                                <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                                            </div>
                                            <div className="ml-3">
                                                <h3 className="text-sm font-medium text-red-800">
                                                    We encountered an error with your submission
                                                </h3>
                                                <div className="mt-2 text-sm text-red-700">{error}</div>
                                            </div>
                                        </div>
                                    </div>
                                ) : null}
                                {success ? (
                                    <div className="rounded-md bg-green-50 p-4">
                                        <div className="flex">
                                            <div className="flex-shrink-0">
                                                <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm font-medium text-green-800">You applied successfully!</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : null}
                                <div className="mt-8 sm:mt-8">
                                    {!success ? (
                                        <button
                                            type="button"
                                            className="inline-flex justify-center w-2/12 rounded-md border border-teal-600 shadow-sm px-4 py-2 bg-white text-base font-medium text-teal-600 hover:bg-teal-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 sm:text-sm"
                                            onClick={() => setOpen(false)}>
                                            Cancel
                                        </button>
                                    ) : null}
                                    <button
                                        type="button"
                                        className="inline-flex ml-8 justify-center float-right w-5/12 rounded-md border border-transparent shadow-sm px-4 py-2 bg-teal-600 text-base font-medium text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 sm:text-sm disabled:opacity-40"
                                        onClick={() => save()}>
                                        {running ? <img width="20" src="/images/loading.svg" /> : null}
                                        {!running && !success ? 'Apply now' : null}
                                        {!running && success ? 'Confirm' : null}
                                    </button>
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>
        </>
    );
}
