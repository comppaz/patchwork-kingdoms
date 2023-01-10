import { Fragment, useRef, useState, useEffect, useContext } from 'react';
import { Dialog, Transition, Switch } from '@headlessui/react';
import Image from 'next/image';
import { InformationCircleIcon } from '@heroicons/react/outline';
import Tooltip from '../Tooltip';
import { connectWallet, deposit, buy } from '../../lib/contractInteraction';
import { ethers } from 'ethers';
import AddressContext from '../../context/AddressContext';
import ModalContext from '../../context/ModalContext';
import { approveTransaction } from '../../lib/testTokenInteraction';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}
export default function Modal({ transactionType, setTransactionType, nft, isModalOpen, setIsModalOpen }) {
    const cancelButtonRef = useRef(null);
    const { walletAddress, updateWalletAddress, walletStatus, updateEmittingAddress } = useContext(AddressContext);
    const { isLoading, setIsLoading } = useContext(ModalContext);

    const [enabled, setEnabled] = useState(false);
    const monthlyTimeUnit = 2629743;

    // default timeframe starts with 24 months
    const [currentExpirationTimeFrame, setExpirationTimeframe] = useState(24 * monthlyTimeUnit);
    const [priceOffer, setPriceOffer] = useState(0.175);
    const [expiration, setExpiration] = useState({});
    const [inputError, setInputError] = useState({ isError: false, status: '' });
    //const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState({ status: true, message: '', txHash: '' });

    //called only once
    useEffect(() => {
        let expirationDate = new Date(nft.expiration * 1000);
        setExpiration(expirationDate.toLocaleDateString());
        setIsLoading(false);
        setProgress({ status: false, message: '', txHash: '' });
        setEnabled(false);
        setInputError({ isError: false, status: '' });
    }, [walletAddress, walletStatus, isModalOpen]);

    function setTimeframe(value) {
        switch (Number(value)) {
            case 1:
                setExpirationTimeframe(3 * monthlyTimeUnit);
                break;
            case 2:
                setExpirationTimeframe(6 * monthlyTimeUnit);
                break;
            case 3:
                setExpirationTimeframe(12 * monthlyTimeUnit);
                break;
            case 4:
                setExpirationTimeframe(24 * monthlyTimeUnit);
                break;
            default:
                console.log('Error with TimeframeValue');
        }
    }

    const connectWalletButtonPressed = async () => {
        await connectWallet();
    };

    const onDepositPressed = async nftId => {
        console.log('Starting Deposit for TokenID: ' + nftId);
        const approvalResponse = await approveTransaction(walletAddress, nftId);
        notify(approvalResponse.status, approvalResponse.message, approvalResponse.txHash);
        setProgress(approvalResponse);
        if (approvalResponse.status) {
            const depositResponse = await deposit(walletAddress, nftId, currentExpirationTimeFrame);
            setProgress(depositResponse);
            updateEmittingAddress(walletAddress);
            notify(depositResponse.status, depositResponse.message, depositResponse.txHash);
            console.log(depositResponse);
        } else {
            setIsLoading(false);
        }
    };

    const onBuyPressed = async itemId => {
        console.log('Starting Purchase Transaction for TokenID: ' + itemId);
        let price = ethers.utils.parseEther(priceOffer.toString());
        const response = await buy(walletAddress, itemId, price._hex);
        setProgress(response);
        notify(response.status, response.message, response.txHash);
        console.log(response);
        updateEmittingAddress(walletAddress);
    };

    const notify = (successful, output, txHash) => {
        if (successful) {
            toast.success(output, {
                hideProgressBar: true,
                autoClose: false,
                position: toast.POSITION.BOTTOM_LEFT,
            });
        } else {
            toast.error(output, {
                hideProgressBar: true,
                autoClose: false,
                position: toast.POSITION.BOTTOM_LEFT,
            });
        }
    };

    return (
        <div>
            <Transition.Root show={isModalOpen}>
                <ToastContainer />
                {/** purchase/deposit modal*/}
                {transactionType.isDeposit && (
                    <Dialog
                        as="div"
                        className="relative z-10"
                        initialFocus={cancelButtonRef}
                        onClose={() => {
                            setTransactionType({ isDeposit: false, isPurchasement: false });
                            setIsModalOpen(false);
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
                                        <div className="mt-2 mr-auto ml-4 flex text-sm font-medium text-gray-600">{walletStatus}</div>
                                        {/** check login information */}
                                        <div className="">
                                            {walletAddress.length > 0 ? (
                                                <p className="mt-2 mr-auto ml-4 flex text-sm font-medium text-gray-600">
                                                    You are currently connected: ${walletAddress.substring(0, 6)} ... $
                                                    {walletAddress.substring(38)}
                                                </p>
                                            ) : (
                                                <button
                                                    type="button"
                                                    className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                                    onClick={() => connectWalletButtonPressed()}>
                                                    {' '}
                                                    Connect
                                                </button>
                                            )}
                                        </div>
                                        {/** deposit modal */}
                                        <div>
                                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                                <div className="sm:flex sm:items-start">
                                                    <div className="mx-auto flex h-24 w-24 flex-shrink-0 items-center justify-center sm:mx-0 sm:h-32 sm:w-32">
                                                        <Image
                                                            className="object-cover shadow-lg rounded-lg"
                                                            width="512"
                                                            height="512"
                                                            src={nft.url}
                                                            alt={nft.title + ' NFT Image'}
                                                        />
                                                    </div>
                                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                                        <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                                                            <strong>{nft.title}</strong>
                                                        </Dialog.Title>
                                                        <div className="mt-2">
                                                            <p className="text-sm text-gray-500">
                                                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut a massa semper,
                                                                condimentum dolor in, ornare nisi. Cras mauris tortor, placerat a accumsan
                                                                vel, dignissim non turpis.
                                                            </p>
                                                        </div>
                                                        <div className="mt-4">
                                                            <label htmlFor="timeframe" className="block text-sm font-medium text-gray-600">
                                                                Timeframe{'  '}
                                                                <Tooltip enabled={true} className="inline" text="This is a tooltip">
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
                                                                    onChange={event => {
                                                                        setTimeframe(event.target.value);
                                                                    }}
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
                                                                    <Switch.Label
                                                                        as="span"
                                                                        className="text-sm font-medium text-gray-900"
                                                                        passive>
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
                                            {/** check loading status and show loading spinner or buttons to continue */}
                                            {isLoading ? (
                                                <div className="py-8 text-sm font-medium mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                                    <div className="flex h-1/3">
                                                        <div className="m-auto justify-center left-1/2 top-1/2">
                                                            <svg
                                                                className="animate-spin relative mr-2 w-8 h-8 text-gray-400"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 24 24">
                                                                <circle
                                                                    className="opacity-25"
                                                                    cx="12"
                                                                    cy="12"
                                                                    r="10"
                                                                    stroke="currentColor"
                                                                    strokeWidth="4"></circle>
                                                                <path
                                                                    className="opacity-75"
                                                                    fill="currentColor"
                                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                    {/** 
                                                    {progress.status ? (
                                                        <div className="text-green-600 flex justify-center">
                                                            <p>{progress.message}</p>
                                                            <p>
                                                                Check out the transaction on{' '}
                                                                <a
                                                                    target="_blank"
                                                                    href={`https://goerli.etherscan.io/tx/${progress.txHash}`}
                                                                    rel="noopener noreferrer">
                                                                    Etherscan
                                                                </a>{' '}
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <div className="text-red-600 flex justify-center">{progress.message}</div>
                                                    )}
                                                    */}
                                                </div>
                                            ) : (
                                                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                                    <Tooltip
                                                        enabled={!enabled}
                                                        className="inline text-sm"
                                                        text="Please agree to the terms.">
                                                        <button
                                                            type="button"
                                                            disabled={!enabled}
                                                            className="inline-flex w-full justify-center rounded-md border border-transparent bg-teal-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm disabled:bg-gray-300 disabled:hover:bg-gray-300 disabled:hover:border-red-400"
                                                            onClick={() => {
                                                                setIsLoading(true);
                                                                onDepositPressed(nft.tokenId);
                                                                setProgress({
                                                                    message: 'Please follow the instructions on Metamask.',
                                                                    status: false,
                                                                });
                                                            }}>
                                                            Sign
                                                        </button>
                                                    </Tooltip>

                                                    <button
                                                        type="button"
                                                        className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                                        onClick={() => {
                                                            setTransactionType({ isDeposit: false, isPurchasement: false });
                                                            setIsModalOpen(false);
                                                        }}
                                                        ref={cancelButtonRef}>
                                                        Cancel
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                )}
                {transactionType.isPurchase && (
                    <Dialog
                        as="div"
                        className="relative z-10"
                        initialFocus={cancelButtonRef}
                        onClose={() => {
                            setTransactionType({ isDeposit: false, isPurchasement: false });
                            setIsModalOpen(false);
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
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                                    <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                        {/** buy modal*/}
                                        <div className="w-full py-2 px-12 text-center text-gray-500 bg-gray-50 font-light border border-b-2">
                                            Buy this NFT
                                        </div>
                                        <div className="mt-2 mr-auto ml-4 flex text-sm font-medium text-gray-600">{walletStatus}</div>
                                        <div className="">
                                            {walletAddress.length > 0 ? (
                                                <p className="mt-2 mr-auto ml-4 flex text-sm font-medium text-gray-600">
                                                    You are currently connected: ${walletAddress.substring(0, 6)} ... $
                                                    {walletAddress.substring(38)}
                                                </p>
                                            ) : (
                                                <div>
                                                    <button
                                                        type="button"
                                                        className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                                        onClick={() => connectWalletButtonPressed()}>
                                                        {' '}
                                                        Connect
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            {' '}
                                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                                <div className="sm:flex sm:items-start">
                                                    <div className="mx-auto flex h-24 w-24 flex-shrink-0 items-center justify-center sm:mx-0 sm:h-32 sm:w-32">
                                                        {/* <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" /> */}
                                                        <Image
                                                            className="object-cover shadow-lg rounded-lg"
                                                            width="512"
                                                            height="512"
                                                            src={nft.url}
                                                            alt={nft.title + ' NFT Image'}
                                                        />
                                                    </div>
                                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                                        <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                                                            <strong>{nft.title}</strong>
                                                        </Dialog.Title>
                                                        <div className="mt-2">
                                                            <p className="text-sm text-gray-500">
                                                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut a massa semper,
                                                                condimentum dolor in, ornare nisi. Cras mauris tortor, placerat a accumsan
                                                                vel, dignissim non turpis.
                                                            </p>
                                                        </div>
                                                        <div className="mt-6">
                                                            <div>
                                                                <label htmlFor="email" className="block text-sm font-medium text-gray-600">
                                                                    Get notified when the transaction was successful{' '}
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
                                                                <label
                                                                    htmlFor="minPrice"
                                                                    className="block text-sm font-medium text-gray-600">
                                                                    Accepting offers higher than:
                                                                </label>
                                                                <div className="block text-sm font-medium text-gray-500">
                                                                    <span>{nft.price / 10 ** 18} ETH</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="mt-6">
                                                            <div>
                                                                <label
                                                                    htmlFor="minPrice"
                                                                    className="block text-sm font-medium text-gray-600">
                                                                    Expiration Date
                                                                </label>
                                                                <div>
                                                                    <span className="block text-sm font-medium text-gray-500">
                                                                        {expiration.toString()}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="mt-6">
                                                            <div>
                                                                <label htmlFor="price" className="block text-sm font-medium text-gray-600">
                                                                    Your offer
                                                                </label>
                                                                <div className="mt-1">
                                                                    <input
                                                                        type="number"
                                                                        placeholder="Type in your offer"
                                                                        onInput={event => {
                                                                            if (event.target.value <= nft.price / 10 ** 18) {
                                                                                console.log('Illegal value ');
                                                                                setInputError({
                                                                                    isError: true,
                                                                                    status: 'The value does not exceed the minimum price or is not a valid number!',
                                                                                });
                                                                            } else {
                                                                                setInputError({
                                                                                    isError: false,
                                                                                    status: '',
                                                                                });
                                                                            }
                                                                        }}
                                                                        min={0.15}
                                                                        required
                                                                        onChange={event => {
                                                                            setPriceOffer(event.target.value);
                                                                        }}
                                                                        className="block w-full px-4 py-2 rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                                                                    />
                                                                </div>
                                                                <p className="block text-sm font-medium text-red-600">
                                                                    {inputError.status}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="mt-4">
                                                            <Switch.Group as="div" className="flex items-center justify-between">
                                                                <span className="flex flex-grow flex-col">
                                                                    <Switch.Label
                                                                        as="span"
                                                                        className="text-sm font-medium text-gray-900"
                                                                        passive>
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
                                            {isLoading ? (
                                                <div className="py-8 text-red-700 mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                                    <div className="flex h-1/3">
                                                        <div className="m-auto justify-center left-1/2 top-1/2">
                                                            <svg
                                                                className="animate-spin relative mr-2 w-8 h-8 text-gray-400"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 24 24">
                                                                <circle
                                                                    className="opacity-25"
                                                                    cx="12"
                                                                    cy="12"
                                                                    r="10"
                                                                    stroke="currentColor"
                                                                    strokeWidth="4"></circle>
                                                                <path
                                                                    className="opacity-75"
                                                                    fill="currentColor"
                                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-center">{progress.status}</div>
                                                </div>
                                            ) : (
                                                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                                    <Tooltip
                                                        enabled={!enabled}
                                                        className="inline text-sm"
                                                        text="Please agree to the terms.">
                                                        <button
                                                            type="button"
                                                            disabled={!enabled}
                                                            className="inline-flex w-full justify-center rounded-md border border-transparent bg-teal-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm disabled:bg-gray-300 disabled:hover:bg-gray-300 disabled:hover:border-red-400"
                                                            onClick={() => {
                                                                setIsLoading(true);
                                                                onBuyPressed(nft.itemId);
                                                                setProgress({
                                                                    message: 'Please follow the instructions on Metamask.',
                                                                    status: false,
                                                                });
                                                            }}>
                                                            Sign
                                                        </button>
                                                    </Tooltip>

                                                    <button
                                                        type="button"
                                                        className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                                        onClick={() => {
                                                            setTransactionType({ isDeposit: false, isPurchasement: false });
                                                            setIsModalOpen(false);
                                                        }}
                                                        ref={cancelButtonRef}>
                                                        Cancel
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                )}
            </Transition.Root>
        </div>
    );
}
