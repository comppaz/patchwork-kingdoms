import { Fragment, useRef, useState } from 'react';
import { Dialog, Transition, Switch } from '@headlessui/react';
import Image from 'next/image';
import { InformationCircleIcon } from '@heroicons/react/outline';
import Tooltip from '../Tooltip';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}
export default function Modal({ nft, open, setOpen }) {
    const cancelButtonRef = useRef(null);
    const [enabled, setEnabled] = useState(false);

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={() => setOpen(false)}>
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
                                    Donate your NFT
                                </div>
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mx-auto flex h-24 w-24 flex-shrink-0 items-center justify-center sm:mx-0 sm:h-32 sm:w-32">
                                            {/* <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" /> */}
                                            <Image
                                                className="object-cover shadow-lg rounded-lg"
                                                width="512"
                                                height="512"
                                                src={nft.imageUrl}
                                                alt={nft.title + ' NFT Image'}
                                            />
                                        </div>
                                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                            <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                                                <strong>{nft.title}</strong>
                                            </Dialog.Title>
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-500">
                                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut a massa semper, condimentum
                                                    dolor in, ornare nisi. Cras mauris tortor, placerat a accumsan vel, dignissim non
                                                    turpis.
                                                </p>
                                            </div>
                                            <div className="mt-4">
                                                <label htmlFor="timeframe" className="block flex text-sm font-medium text-gray-600">
                                                    Timeframe{'  '}
                                                    <Tooltip className="inline" text="This is a tooltip">
                                                        <InformationCircleIcon className="w-4 h-4"></InformationCircleIcon>
                                                    </Tooltip>
                                                </label>

                                                <div className="flex flex-col space-y-2 p-2 w-80">
                                                    <input
                                                        type="range"
                                                        className="w-full h-2 bg-gray-200 rounded-lg shadow-md appearance-none cursor-pointer"
                                                        min="1"
                                                        max="4"
                                                        step="1"
                                                        id="timeframe"
                                                    />
                                                    <ul className="flex justify-between w-full px-[10px] text-gray-500">
                                                        <li className="flex justify-center relative">
                                                            <span className="absolute text-xs">3M</span>
                                                        </li>
                                                        <li className="flex justify-center relative">
                                                            <span className="absolute text-xs">6M</span>
                                                        </li>
                                                        <li className="flex justify-center relative">
                                                            <span className="absolute text-xs">1Y</span>
                                                        </li>
                                                        <li className="flex justify-center relative">
                                                            <span className="absolute text-xs">2Y</span>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <div className="mt-6">
                                                <div>
                                                    <label htmlFor="email" className="block text-sm font-medium text-gray-600">
                                                        Get notified when the NFT is donated{' '}
                                                        <span className="text-xs font-light">(optional)</span>
                                                    </label>
                                                    <div className="mt-1">
                                                        <input
                                                            type="email"
                                                            name="email"
                                                            id="email"
                                                            className="block w-full px-4 py-2 rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                                                            placeholder="you@example.com"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-6">
                                                <div>
                                                    <label htmlFor="email" className="block text-sm font-medium text-gray-600">
                                                        Your name on the &quot;hall of fame&quot;?{' '}
                                                        <span className="text-xs font-light">(optional)</span>
                                                    </label>
                                                    <div className="mt-1">
                                                        <input
                                                            type="text"
                                                            name="name"
                                                            id="name"
                                                            className="block w-full px-4 py-2 rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                                                            placeholder="@auntey"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-4">
                                                <Switch.Group as="div" className="flex items-center justify-between">
                                                    <span className="flex flex-grow flex-col">
                                                        <Switch.Label as="span" className="text-sm font-medium text-gray-900" passive>
                                                            I agree to:
                                                        </Switch.Label>
                                                        <Switch.Description as="span" className="text-sm text-gray-500">
                                                            Nulla amet tempus sit accumsan. Aliquet turpis sed sit lacinia.
                                                        </Switch.Description>
                                                    </span>
                                                    <Switch
                                                        checked={enabled}
                                                        onChange={setEnabled}
                                                        className={classNames(
                                                            enabled ? 'bg-teal-500' : 'bg-gray-200',
                                                            'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2',
                                                        )}>
                                                        <span
                                                            aria-hidden="true"
                                                            className={classNames(
                                                                enabled ? 'translate-x-5' : 'translate-x-0',
                                                                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                                                            )}
                                                        />
                                                    </Switch>
                                                </Switch.Group>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                    <button
                                        type="button"
                                        className="inline-flex w-full justify-center rounded-md border border-transparent bg-teal-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                                        onClick={() => setOpen(false)}>
                                        Sign
                                    </button>
                                    <button
                                        type="button"
                                        className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                        onClick={() => setOpen(false)}
                                        ref={cancelButtonRef}>
                                        Cancel
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
