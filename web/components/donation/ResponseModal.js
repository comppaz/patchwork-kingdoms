import { Fragment, useEffect, useRef, useContext } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Link from 'next/link';
import ModalContext from '../../context/ModalContext';
import { FacebookShareButton, TwitterShareButton, FacebookIcon, TwitterIcon } from 'react-share';

export default function ResponseModal() {
    const cancelButtonRef = useRef(null);
    const shareUrl = 'https://www.patchwork-kingdoms.com/gallery';
    const shareTitle = 'Patchwork Kingdom NFT Donation';
    const shareDescription =
        "My Patchwork Kingdom NFT is up for donation. Click here to buy it! All proceeds from this PWK purchase go to UNICEF to help support Giga's mission in connecting schools.";
    const { data: modalData, isOpen, setIsOpen } = useContext(ModalContext);

    return (
        <Transition.Root show={isOpen}>
            <Dialog
                as="div"
                className="relative z-10"
                initialFocus={cancelButtonRef}
                onClose={() => {
                    setIsOpen(false);
                }}>
                <Transition.Child
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                <div className="w-full py-2 px-12 text-center text-gray-500 bg-gray-50 font-light border border-b-2">
                                    {modalData.title}
                                </div>
                                <div className="mt-3 sm:mt-0 sm:ml-4 sm:mr-4 sm:text-left">
                                    <Dialog.Title as="h3" className="text-lg m-4 font-medium leading-6 text-gray-900">
                                        <strong>Your transaction completed succesfully!</strong>
                                    </Dialog.Title>
                                    {modalData.transactionType.isDeposit && (
                                        <div className="m-4">
                                            <p className="text-sm text-green-500 flex items-center flex-wrap relative left-0">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth={1.5}
                                                    stroke="currentColor"
                                                    className="w-6 h-6">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    />
                                                </svg>
                                                Congrats, your NFT is up for sale!
                                            </p>
                                            <p className="text-sm text-gray-500 ">
                                                Check the details of your Transaction {}
                                                <Link href={`https://goerli.etherscan.io/tx/${modalData.txhash}`} passHref>
                                                    <a className="text-blue-600" target="_blank" rel="noopener noreferrer">
                                                        here
                                                    </a>
                                                </Link>
                                                .
                                            </p>
                                            <p className="text-sm text-gray-500">Share:</p>
                                            <p className="">
                                                <FacebookShareButton url={shareUrl} title={shareTitle} quote={shareDescription}>
                                                    <FacebookIcon size={32} round={true}></FacebookIcon>
                                                </FacebookShareButton>
                                                <TwitterShareButton url={shareUrl} title={shareDescription}>
                                                    <TwitterIcon size={32} round={true}></TwitterIcon>
                                                </TwitterShareButton>
                                            </p>{' '}
                                        </div>
                                    )}
                                    {modalData.transactionType.isPurchase && (
                                        <div className="m-4">
                                            <p className="text-sm text-green-500 flex items-center flex-wrap relative left-0">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth={1.5}
                                                    stroke="currentColor"
                                                    className="w-6 h-6">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    />
                                                </svg>
                                                Thank you for your purchase!
                                            </p>
                                            <p className=" text-xs text-gray-400">All proceeds for this purchase goes to UNICEF. </p>

                                            <p className="text-sm text-gray-500">
                                                You can now see your NFT in your personal collection in the{' '}
                                                <Link href="/dashboard" passHref>
                                                    <a className="text-blue-600" target="_blank" rel="noopener noreferrer">
                                                        {' '}
                                                        dashboard
                                                    </a>
                                                </Link>
                                                . You can also continue and bid for other NFTs.
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <button
                                        type="button"
                                        className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                        ref={cancelButtonRef}
                                        onClick={() => {
                                            setIsOpen(false);
                                        }}>
                                        Close
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}
