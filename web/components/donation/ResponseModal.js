import { Fragment, useRef, useState, useEffect } from 'react';
import { Dialog, Transition, Switch } from '@headlessui/react';
import Link from 'next/link';
import Loading from '../Loading';
import Router from 'next/router';

export default function ResponseModal({ title, heading, txhash, nft, open, setOpen, isProcessing }) {
    const cancelButtonRef = useRef(null);

    useEffect(() => {
        console.log('WHY ARE WE FREEZING?');
    }, []);

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog
                as="div"
                className="relative z-10"
                initialFocus={cancelButtonRef}
                onClose={() => {
                    setOpen(false);
                    //Router.reload();
                }}>
                <Transition.Child
                    as={Fragment}
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
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                <div className="w-full py-2 px-12 text-center text-gray-500 bg-gray-50 font-light border border-b-2">
                                    {title}
                                </div>
                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                                        {nft ? <strong>Test Token #{nft.tokenId}</strong> : <strong>Test TOKEN</strong>}
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">{heading}</p>
                                        {isProcessing ? (
                                            <Loading></Loading>
                                        ) : (
                                            <p className="text-sm text-gray-500">
                                                Check the status of your Transaction {}
                                                <Link href={`https://goerli.etherscan.io/tx/${txhash}`} passHref>
                                                    <a className="text-blue-600" target="_blank" rel="noopener noreferrer">
                                                        here
                                                    </a>
                                                </Link>
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <button
                                        type="button"
                                        className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                        onClick={() => {
                                            setOpen(false);
                                            Router.reload();
                                        }}
                                        ref={cancelButtonRef}>
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
