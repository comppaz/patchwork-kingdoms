import { Fragment, useRef, useState, useEffect, useContext, ChangeEvent } from 'react';
import { Dialog, Transition, Switch } from '@headlessui/react';
import Image from 'next/image';
import { InformationCircleIcon } from '@heroicons/react/outline';
import Tooltip from '../Tooltip';
import { connectWallet, deposit, buy } from '../../lib/contractInteraction';
import { ethers } from 'ethers';
import AddressContext from '../../context/AddressContext';
import ModalContext from '../../context/ModalContext';
import { approveTransaction } from '../../lib/testTokenInteraction';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { calculateMinPrice, convertExpirationToDate } from '../../lib/calculateDonationInteraction';
import useUser from '../../lib/useUser';
import Link from 'next/link';
import ProgressStatusContext from '../../context/ProgressStatusContext';
import { waitTransaction } from '../../lib/checkApprovalStatus';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}
export default function Modal({ transactionType, setTransactionType, nft, isModalOpen, setIsModalOpen }) {
    const cancelButtonRef = useRef(null);
    const { updateEmittingAddress } = useContext(AddressContext);
    const { isLoading, setIsLoading } = useContext(ModalContext);
    const { setProgressStatus, progressStatus } = useContext(ProgressStatusContext);

    const [enabled, setEnabled] = useState(false);

    const progressDefault = 'Please follow the instructions on Metamask!';
    // 1 month = 2629743 seconds
    const monthlyTimeUnit = 2629743;
    // for testing
    const minutlyTimeUnit = 60;

    // default timeframe starts with 24 months
    const [currentExpirationTimeFrame, setExpirationTimeframe] = useState(24 * monthlyTimeUnit);
    const [priceOffer, setPriceOffer] = useState(nft.price / 10 ** 18);
    const [minPriceObj, setMinPriceObj] = useState(calculateMinPrice(nft.price / 10 ** 18));
    const [expiration, setExpiration] = useState({});
    const [priceError, setPriceError] = useState({ isError: false, status: '' });
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [estimatedPrice, setEstimatedPrice] = useState(0);
    const [alert, setAlert] = useState('');
    const [purchaserMail, setPurchaserMail] = useState('');
    const [donatorMail, setDonatorMail] = useState('');
    const { user } = useUser();

    toast.configure();

    useEffect(() => {
        resetModalValues();
        setPriceOffer(calculateMinPrice(nft.price / 10 ** 18).minPrice);
        if (transactionType.isDeposit) {
            (async () => {
                setEstimatedPrice(await getEstimatedPrice(nft.tokenId));
            })();
        }
    }, [user.account, isModalOpen]);

    useEffect(() => {
        agreeToTerms && !priceError.isError ? setEnabled(true) : setEnabled(false);
    }, [agreeToTerms, priceError]);

    function setTimeframe(value: String) {
        // production case
        if (process.env.PROD_FLAG) {
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
        // test case
        else {
            switch (Number(value)) {
                case 1:
                    setExpirationTimeframe(3 * minutlyTimeUnit);
                    break;
                case 2:
                    setExpirationTimeframe(6 * minutlyTimeUnit);
                    break;
                case 3:
                    setExpirationTimeframe(12 * minutlyTimeUnit);
                    break;
                case 4:
                    setExpirationTimeframe(24 * minutlyTimeUnit);
                    break;
                default:
                    console.log('Error with TimeframeValue');
            }
        }
    }

    const onDepositPressed = async (nftId: Number) => {
        const approvalResponse = await approveTransaction(user.account, nftId);
        if (approvalResponse.status) {
            console.log(approvalResponse);
            setProgressStatus(
                'Your approval request was successful! Please do not close this window and wait for further instructions on Metamask!',
            );
            await waitTransaction(approvalResponse.txHash);
            const depositResponse = await deposit(user.account, nftId, currentExpirationTimeFrame);
            updateEmittingAddress(user.account);
            notify(depositResponse.status, depositResponse.message);
            if (donatorMail && depositResponse.status) {
                setProgressStatus(depositResponse.message);
                let currentDate = new Date();
                const body = {
                    nftId,
                    donatorMail,
                    currentDate,
                    timeframe: currentExpirationTimeFrame,
                    minPrice: estimatedPrice,
                    address: user.account,
                    isSold: false,
                };
                const result = await fetch('/api/donationDB', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body),
                });
            }
        } else {
            notify(approvalResponse.status, approvalResponse.message);
        }
    };

    const onBuyPressed = async (itemId: number, tokenId: number) => {
        let price = ethers.utils.parseEther(priceOffer.toString());
        const response = await buy(user.account, itemId, price._hex);
        notify(response.status, response.message);
        updateEmittingAddress(user.account);
        if (purchaserMail && response.status) {
            // save purchaserMailData in database
            let currentDate = new Date();
            const body = { tokenId, purchaserMail, currentDate, salePrice: priceOffer, minPrice: minPriceObj.minPrice };
            const result = await fetch('/api/purchasementDB', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
        }
    };

    const notify = (successful, output) => {
        if (successful) {
            toast.success(output, {
                hideProgressBar: true,
                autoClose: false,
                position: toast.POSITION.TOP_RIGHT,
            });
        } else {
            setIsModalOpen(false);
            resetModalValues();
            toast.error(output, {
                hideProgressBar: true,
                autoClose: false,
                position: toast.POSITION.TOP_RIGHT,
            });
        }
    };

    const resetModalValues = () => {
        setExpiration(convertExpirationToDate(nft.expiration));
        setIsLoading(false);
        setEnabled(false);
        setAgreeToTerms(false);
        setPriceError({ isError: false, status: '' });
        setAlert('');
        setEstimatedPrice(0);
        setExpirationTimeframe(24 * monthlyTimeUnit);
        setProgressStatus(progressDefault);
    };
    const getEstimatedPrice = async (tokenId: Number) => {
        const response = await fetch(`/api/getMinPriceValue/${tokenId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const res = await response.json();
        return res.message;
    };
    return (
        <div>
            <Transition.Root show={isModalOpen}>
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
                                            Donate this PWK 🎉
                                        </div>

                                        <p className="mt-2 mr-auto ml-4 flex text-sm font-medium text-gray-600">
                                            Donate your PWK #{nft.tokenId} by putting it up for sale.
                                        </p>

                                        <div>
                                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                                <div className="sm:flex sm:items-start">
                                                    <div className="mx-auto flex h-24 w-24 flex-shrink-0 items-center justify-center sm:mx-0 sm:h-32 sm:w-32">
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
                                                            <p className="text-sm text-teal-500">
                                                                By donating, all the proceeds from this PWK purchase go to UNICEF to help
                                                                support Giga&apos;s mission in connecting schools. Learn more about how it
                                                                works.
                                                            </p>
                                                        </div>
                                                        <div className="mt-4">
                                                            <label
                                                                htmlFor="timeframe"
                                                                className="text-sm font-medium text-gray-600 invisible sm:visible">
                                                                Timeframe{'  '}
                                                                <Tooltip
                                                                    enabled={true}
                                                                    className=" bg-green-400"
                                                                    text="Choose how long you want your PWK to stay up for sale. If not sold by this date, your PWK will be returned.">
                                                                    <InformationCircleIcon className="w-4 h-4"></InformationCircleIcon>
                                                                </Tooltip>
                                                            </label>
                                                            <label
                                                                htmlFor="timeframeMobile"
                                                                className="visible sm:hidden text-sm font-medium text-gray-600">
                                                                Timeframe{'  '}
                                                                <div className="text-xs">
                                                                    Choose how long you want your PWK to stay up for sale. If not sold by
                                                                    this date, your PWK will be returned.
                                                                </div>
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
                                                                        <span className="fixed text-xs">3 months</span>
                                                                    </li>
                                                                    <li className="flex justify-center relative">
                                                                        <span className="fixed text-xs">6 months</span>
                                                                    </li>
                                                                    <li className="flex justify-center relative">
                                                                        <span className="fixed text-xs">1 year</span>
                                                                    </li>
                                                                    <li className="flex justify-center relative">
                                                                        <span className="fixed text-xs">2 years</span>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                        <div className="mt-6">
                                                            <div>
                                                                <label
                                                                    htmlFor="priceEstimate"
                                                                    className="block text-sm font-medium text-gray-600">
                                                                    Estimated minimum price value: {}
                                                                </label>
                                                                <div className="block text-sm font-medium text-gray-500">
                                                                    <span>{estimatedPrice / 10 ** 18} ETH</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="mt-6">
                                                            <div>
                                                                <label htmlFor="email" className="block text-sm font-medium text-gray-600">
                                                                    Notify me by email:{' '}
                                                                    <span className="text-xs font-light">(optional)</span>
                                                                </label>
                                                                <div className="mt-1">
                                                                    <input
                                                                        type="email"
                                                                        onChange={event => {
                                                                            setDonatorMail(event.target.value);
                                                                        }}
                                                                        name="email"
                                                                        id="email"
                                                                        className="block w-full px-4 py-2 rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                                                                        placeholder="you@example.com"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {/** 
                                                        <div className="mt-6">
                                                            <div>
                                                                <label htmlFor="hall" className="block text-sm font-medium text-gray-600">
                                                                    Add me to the Hall of Fame:{' '}
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
                                                        */}
                                                        <div className="mt-4">
                                                            <Switch.Group as="div" className="flex items-center justify-between">
                                                                <span className="flex flex-grow flex-col">
                                                                    <Switch.Label
                                                                        as="span"
                                                                        className="text-xs font-light text-gray-900"
                                                                        passive>
                                                                        I agree to the Patchwork Kingdom&apos;s{' '}
                                                                        <Link key="donatorPriv" href={'/privacy'}>
                                                                            <a className="underline" target="_blank">
                                                                                Privacy Policy
                                                                            </a>
                                                                        </Link>
                                                                        .
                                                                    </Switch.Label>
                                                                    {/** 
                                                                    <Switch.Description as="span" className="text-sm text-gray-500">
                                                                        Patchwork Kingdom&apos;s Privacy Policy:{' '}
                                                                        <Link key="donatorPriv" href={'/privacy'} className="underline">
                                                                            Read here
                                                                        </Link>
                                                                    </Switch.Description>
                                                                    */}
                                                                </span>
                                                                <Switch
                                                                    checked={enabled}
                                                                    onChange={() => {
                                                                        setAlert('');
                                                                        setEnabled(!enabled);
                                                                    }}
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
                                                    <span className=" p-4 flex justify-center text-gray-500 text-sm">{progressStatus}</span>
                                                </div>
                                            ) : (
                                                <div>
                                                    <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                                        <div
                                                            onClick={() => {
                                                                if (!enabled) {
                                                                    setAlert('Please agree to the terms first!');
                                                                }
                                                            }}>
                                                            <button
                                                                type="button"
                                                                disabled={!enabled}
                                                                className=" disabled:pointer-events-none inline-flex w-full justify-center rounded-md border border-transparent bg-teal-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm disabled:bg-gray-300 disabled:hover:bg-gray-300 disabled:hover:border-red-400"
                                                                onClick={() => {
                                                                    setIsLoading(true);
                                                                    onDepositPressed(nft.tokenId);
                                                                }}>
                                                                <span>Sign</span>
                                                            </button>
                                                        </div>
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
                                                    <div className="  px-4 py-2 sm:flex sm:flex-row-reverse sm:px-6 inline-flex w-full text-xs text-red-600">
                                                        {alert}
                                                    </div>
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
                                            Buy this PWK
                                        </div>
                                        <div className="mt-2 mr-auto ml-4 flex text-sm font-medium text-gray-600">
                                            Purchase this PWK #{nft.itemId}
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
                                                            src={nft.imageUrl}
                                                            alt={nft.title + ' NFT Image'}
                                                        />
                                                    </div>
                                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                                        <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                                                            <strong>{nft.title}</strong>
                                                        </Dialog.Title>
                                                        <div className="mt-2">
                                                            <p className="text-sm text-teal-500">
                                                                All proceeds from this PWK purchase go to UNICEF to help support Giga&apos;s
                                                                mission in connecting schools.
                                                            </p>
                                                            <p className="text-sm text-gray-500 underline">
                                                                Learn more about UNICEF and GIGA&apos;s mission.
                                                            </p>
                                                        </div>
                                                        <div className="mt-6">
                                                            <div>
                                                                <label
                                                                    htmlFor="expiration"
                                                                    className="block text-sm font-medium text-gray-600">
                                                                    Sale ends on:
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
                                                                <label
                                                                    htmlFor="minPrice"
                                                                    className="block text-sm font-medium text-gray-600">
                                                                    Accepting offers equal to or greater than:
                                                                </label>
                                                                <div className="block text-sm font-medium text-gray-500">
                                                                    <span>{minPriceObj.minPrice} ETH</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="mt-6">
                                                            <div>
                                                                <label htmlFor="price" className="block text-sm font-medium text-gray-600">
                                                                    Your offer:
                                                                </label>
                                                                <div className="mt-1">
                                                                    <input
                                                                        type="number"
                                                                        step={minPriceObj.step}
                                                                        defaultValue={minPriceObj.minPrice}
                                                                        placeholder="Type in your offer"
                                                                        onInput={(e: ChangeEvent<HTMLInputElement>) => {
                                                                            if (Number(e.target.value) <= nft.price / 10 ** 18) {
                                                                                setPriceError({
                                                                                    isError: true,
                                                                                    status: 'The value does not exceed the minimum price or is not a valid number!',
                                                                                });
                                                                            } else {
                                                                                setPriceError({
                                                                                    isError: false,
                                                                                    status: '',
                                                                                });
                                                                                if (agreeToTerms) {
                                                                                    setAlert('');
                                                                                }
                                                                            }
                                                                        }}
                                                                        required
                                                                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                                            setPriceOffer(Number(e.target.value));
                                                                        }}
                                                                        className="block w-full px-4 py-2 rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                                                                    />
                                                                </div>
                                                                <p className="block text-sm font-medium text-red-600">
                                                                    {priceError.status}
                                                                </p>
                                                            </div>
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
                                                                        onChange={event => {
                                                                            setPurchaserMail(event.target.value);
                                                                        }}
                                                                        className="block w-full px-4 py-2 rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                                                                        placeholder="you@example.com"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="mt-4">
                                                            <Switch.Group as="div" className="flex items-center justify-between">
                                                                <span className="flex flex-grow flex-col">
                                                                    <Switch.Label
                                                                        as="span"
                                                                        className="text-xs font-light text-gray-900"
                                                                        passive>
                                                                        I agree to the Patchwork Kingdom&apos;s{' '}
                                                                        <Link key="donatorPriv" href={'/privacy'}>
                                                                            <a className="underline" target="_blank">
                                                                                Privacy Policy
                                                                            </a>
                                                                        </Link>
                                                                        .
                                                                    </Switch.Label>
                                                                    {/** 
                                                                    <Switch.Description as="span" className="text-sm text-gray-500">
                                                                        Patchwork Kingdom&apos;s Privacy policy:{' '}
                                                                        <Link key="buyerPriv" href={'/privacy'} className="underline">
                                                                            Read here
                                                                        </Link>
                                                                    </Switch.Description>
                                                                    */}
                                                                </span>
                                                                <Switch
                                                                    checked={agreeToTerms}
                                                                    onChange={() => {
                                                                        if (!priceError.isError) {
                                                                            setAlert('');
                                                                        }
                                                                        setAgreeToTerms(!agreeToTerms);
                                                                    }}
                                                                    className={classNames(
                                                                        agreeToTerms ? 'bg-teal-500' : 'bg-gray-200',
                                                                        'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2',
                                                                    )}>
                                                                    <span
                                                                        aria-hidden="true"
                                                                        className={classNames(
                                                                            agreeToTerms ? 'translate-x-5' : 'translate-x-0',
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
                                                    <span className=" p-4 flex justify-center text-gray-500 text-sm">{progressStatus}</span>
                                                </div>
                                            ) : (
                                                <div>
                                                    <div className=" px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                                        <div
                                                            onClick={() => {
                                                                if (!enabled) {
                                                                    setAlert(
                                                                        `Please agree to the terms first and insert a valid offer value!`,
                                                                    );
                                                                } else if (!user?.isLoggedIn) {
                                                                    setAlert(`You have to log into your Metamask account!`);
                                                                }
                                                            }}>
                                                            <button
                                                                type="button"
                                                                disabled={!enabled || !user?.isLoggedIn}
                                                                className="disabled:pointer-events-none inline-flex w-full justify-center rounded-md border border-transparent bg-teal-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm disabled:bg-gray-300 disabled:hover:bg-gray-300 disabled:hover:border-red-400"
                                                                onClick={event => {
                                                                    setIsLoading(true);
                                                                    onBuyPressed(nft.itemId, nft.tokenId);
                                                                }}>
                                                                <span>Sign</span>
                                                            </button>
                                                        </div>
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
                                                    <div className="  px-4 py-2 sm:flex sm:flex-row-reverse sm:px-6 inline-flex w-full text-xs text-red-600">
                                                        {alert}
                                                    </div>
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
