import useUser from '../lib/useUser'
import useOwnedNfts from '../lib/useOwnedNfts'
import fetchJson from '../lib/fetchJson'
import Gallery from '../components/Gallery';

export default function Dashboard() {

    const { user } = useUser();

    const { nfts } = useOwnedNfts(user);

    console.log(nfts)

    if (!user?.isLoggedIn) {
        return (
            <div className="min-h-full pt-16 pb-12 flex flex-col bg-white">
                <main className="flex-grow flex flex-col justify-center max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="py-16 mt-8">
                        <div className="text-center">
                            <p className="text-sm font-semibold text-teal-600 uppercase tracking-wide">Please sign in through Metamask</p>

                            <p className="mt-2 text-base text-gray-500">When you sign in, you'll be able to see your NFTs.</p>

                        </div>
                    </div>
                </main>
            </div>
        )
    }


    return (
        <div>
            <Gallery nfts={nfts}></Gallery>
        </div>
    )

}
