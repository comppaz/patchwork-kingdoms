import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/solid';


export default function Popup ({ title, country, lat, lng, connectionStatus }) {

    return (
        <div className="px-2 w-64">
        
        <div className="border-b-2 border-grey-500 pb-2">
            <h3 className="font-bold">{title}</h3>
        </div>
        <div className="mt-3">
            <h4 className="text-teal-600 uppercase font-light">Country</h4>
            <div className="font-bold">{country}</div>
        </div>
        <div className="mt-2 grid grid-flow-col">
            <div>
                <h4 className="text-teal-600 uppercase font-light">Location</h4>
                <div className="font-bold">{lat}, {lng}</div>
            </div>
            <div className="place-self-end">
                {connectionStatus && (<div className="group flex"><CheckCircleIcon className="mr-1 flex-shrink-0 h-6 w-6 text-teal-300" aria-hidden="true"></CheckCircleIcon><span className='flex-1 font-bold leading-6'>Connected</span></div>)}
                {!connectionStatus && (<div className="group flex"><XCircleIcon className="mr-1 flex-shrink-0 h-6 w-6 text-red-300" aria-hidden="true"></XCircleIcon><span className='flex-1 font-bold leading-6'>Disconnected</span></div>)} 
            </div>
        </div>
        </div>
    )
};
  