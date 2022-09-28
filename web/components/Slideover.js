import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Image from 'next/image';
import { ChevronLeftIcon, ChevronDownIcon } from '@heroicons/react/outline';
import { InformationCircleIcon } from '@heroicons/react/solid';
import { DateTime } from 'luxon';

function formatDate(dateTimeObject) {
    return DateTime.fromISO(dateTimeObject).toLocaleString(DateTime.DATETIME_MED);
}

const roundETHValue = eth => {
    return eth.toFixed(2);
};

export default function Slideover({ data, isDialogOpen, setDialogOpen }) {
    let dateTimeObject = DateTime.fromISO(data?.statistics?.lastUpdate);
    let date = formatDate(dateTimeObject);

    return (
        <div className="relative z-10">
            <Transition.Root show={isDialogOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={setDialogOpen}>
                    <div className="fixed inset-y-0"></div>
                    <div className="invisible sm:visible fixed inset-y-0 overflow-hidden">
                        <div className="absolute inset-y-0 overflow-hidden">
                            <div className="pointer-events-none fixed inset-0 left-0 flex max-w-full pl-4 pt-32">
                                <div>
                                    <Transition.Child
                                        as={Fragment}
                                        enter="transition transform ease-out duration-500 sm:duration-700"
                                        enterFrom="-translate-x-full opacity-50"
                                        enterTo="translate-x-0 opacity-100"
                                        leave="transition transform ease-in duration-500 sm:duration-700"
                                        leaveFrom="translate-x-0 opacity-100"
                                        leaveTo="-translate-x-full opacity-50">
                                        <Dialog.Panel className="pointer-events-auto w-screen max-w-lg overflow-y-scroll">
                                            <div className="flex h-fit flex-col bg-white py-6 rounded-lg shadow-xl">
                                                <div className="px-4 sm:px-8">
                                                    <div className="flex items-start justify-between border-b-2 border-grey-100 pb-2">
                                                        <Dialog.Title className="text-xl font-bold text-teal-600">
                                                            {' '}
                                                            {'#' + data?.name.split('#')[1]}{' '}
                                                        </Dialog.Title>
                                                        <button
                                                            type="button"
                                                            className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                                                            onClick={() => setDialogOpen(false)}>
                                                            <span className="sr-only">Close panel</span>
                                                            <ChevronLeftIcon className="h-6 w-6" aria-hidden="true" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="relative mt-4 flex-1 px-4 sm:px-6">
                                                    {/* Replace with your content */}
                                                    <div className="text-sm font-bold pb-4">
                                                        {data?.description.split('|')[0].trim() + '.'}
                                                    </div>
                                                    {/* statistics/leaderboard */}
                                                    <div className="flex flex-row">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="text-teal-600 fill-current h-11 w-11"
                                                            viewBox="0 0 20 20">
                                                            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                        <div className="flex flex-col">
                                                            <div className="text-l font-bold text-teal-600">Funds raised to date</div>
                                                            <div className="text-xl font-bold pb-4">
                                                                {roundETHValue(data?.statistics.eth)} ETH
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-row">
                                                        <div className="text-teal-600 fill-current h-11 w-11">
                                                            <InformationCircleIcon />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <div className="text-l font-bold text-teal-600">Rank</div>
                                                            <div className="text-xl font-bold pb-4">{data?.statistics.rank} / 1,000</div>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-row text-sm text-gray-400">Last update: {date}</div>
                                                    <div className="relative inset-x-0 mt-4">
                                                        <Image
                                                            src={`https://patchwork-kingdoms.fra1.digitaloceanspaces.com/thumbnail/${data?.cluster_id}.png`}
                                                            layout="responsive"
                                                            height="10"
                                                            width="20"
                                                            objectFit="contain"
                                                        />
                                                    </div>
                                                    <div className="absolute mt-4 inset-x-0">
                                                        <div className="bg-teal-600 px-8 pt-6 pb-8 rounded-b-lg shadow-b-xl">
                                                            <h2 className="text-white font-bold text-xl leading-7">
                                                                Connecting every school in the world to the internet
                                                            </h2>
                                                            <p className="text-white font-medium text-xs leading-5 mt-2">
                                                                Each Patchwork Kingdom tells a unique story on school connectivity. The
                                                                artwork is data generated and based on the connectivity status of real
                                                                schools spread all over the world. Every square represents a real school
                                                                with real students. Giga estimates that today, more than 1.3 billion
                                                                students in the world do not have access to reliable internet at school. The
                                                                Patchwork Kingdoms is an NFT project raising funds to help close the digital
                                                                divide.
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {/* /End replace */}
                                                </div>
                                            </div>
                                        </Dialog.Panel>
                                    </Transition.Child>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/** Mobile View */}
                    <div className="visible sm:invisible fixed inset-0">
                        <div className="fixed inset-0 max-w-full max-h-full overflow-clip">
                            <div className="pl-4 pt-24">
                                <Transition.Child
                                    as={Fragment}
                                    enter="transition transform ease-out duration-700"
                                    enterFrom="translate-y-full opacity-50"
                                    enterTo="translate-y-0 opacity-100"
                                    leave="transition transform ease-in duration-700"
                                    leaveFrom="translate-y-0 opacity-100"
                                    leaveTo="translate-y-full opacity-50">
                                    <Dialog.Panel className="pointer-events-auto absolute inset-y-0 max-w-full inset-x-0 overflow-y-scroll">
                                        <div className="flex w-fit h-full flex-col bg-white py-6 rounded-lg shadow-xl">
                                            <div className="px-4 sm:px-8">
                                                <div className="flex items-start justify-between border-b-2 border-grey-100 pb-2">
                                                    <Dialog.Title className="text-xl font-bold text-teal-600">
                                                        {' '}
                                                        {'#' + data?.name.split('#')[1]}{' '}
                                                    </Dialog.Title>
                                                    <button
                                                        type="button"
                                                        className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                                                        onClick={() => setDialogOpen(false)}>
                                                        <span className="sr-only">Close panel</span>
                                                        <ChevronDownIcon className="h-6 w-6" aria-hidden="true" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="relative mt-4 flex-1 px-4 sm:px-6">
                                                {/* Replace with your content */}
                                                <div className="text-sm font-bold pb-4">{data?.description.split('|')[0].trim() + '.'}</div>
                                                {/* statistics/leaderboard */}
                                                <div className="flex flex-row">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="text-teal-600 fill-current h-8 w-8"
                                                        viewBox="0 0 20 20">
                                                        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                    <div className="flex flex-col">
                                                        <div className="text-l font-bold text-teal-600">Funds raised to date</div>
                                                        <div className="text-xl font-bold pb-4">
                                                            {roundETHValue(data?.statistics.eth)} ETH
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-row">
                                                    <div className="text-teal-600 fill-current h-8 w-8">
                                                        <InformationCircleIcon />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <div className="text-l font-bold text-teal-600">Rank</div>
                                                        <div className="text-xl font-bold pb-4">{data?.statistics.rank} / 1,000</div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-row">Last update: {date}</div>
                                            </div>
                                            <div className="relative inset-x-0">
                                                <Image
                                                    src={`https://patchwork-kingdoms.fra1.digitaloceanspaces.com/thumbnail/${data?.cluster_id}.png`}
                                                    layout="responsive"
                                                    width="100%"
                                                    height="100%"
                                                    objectFit="contain"
                                                />
                                                <div className="bg-teal-600 px-8 pt-6 pb-8 rounded-b-lg shadow-b-xl">
                                                    <h2 className="text-white font-bold text-2xl leading-7">
                                                        Connecting every school in the world to the internet
                                                    </h2>
                                                    <p className="text-white font-medium text-sm leading-5 mt-2">
                                                        Each Patchwork Kingdom tells a unique story on school connectivity. The artwork is
                                                        data generated and based on the connectivity status of real schools spread all over
                                                        the world. Every square represents a real school with real students. Giga estimates
                                                        that today, more than 1.3 billion students in the world do not have access to
                                                        reliable internet at school. The Patchwork Kingdoms is an NFT project raising funds
                                                        to help close the digital divide.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </div>
    );
}
