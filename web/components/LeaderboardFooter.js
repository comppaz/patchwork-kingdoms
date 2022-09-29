import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid';

export default function LeaderboardFooter({ currentStartNft, setCurrentStartNft, currentPage, setCurrentPage }) {
    const minPages = 1;
    const maxPages = 10;
    const maxEntriesOnPage = 100;

    const setNext = () => {
        if (currentPage != maxPages) {
            setCurrentPage(currentPage + 1);
            setCurrentStartNft(currentStartNft + maxEntriesOnPage);
        }
    };

    const setPrevious = () => {
        if (currentPage != minPages) {
            setCurrentPage(currentPage - 1);
            setCurrentStartNft(currentStartNft - maxEntriesOnPage);
        }
    };

    return (
        <div className="bg-white">
            <div className="mx-auto py-12 px-4 max-w-7xl sm:px-6 lg:px-8 lg:py-24">
                <div className="space-y-12">
                    {/** desktop view */}
                    <div className="hidden sm:inline-block min-w-full py-2 align-middle">
                        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Currently on page <span className="font-medium">{currentPage}</span> of{' '}
                                        <span className="font-medium">{maxPages}</span>
                                    </p>
                                </div>
                                <div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                        <button
                                            onClick={() => {
                                                setPrevious();
                                            }}
                                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                            <span className="sr-only">Previous</span>
                                            <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setNext();
                                            }}
                                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                            <span className="sr-only">Next</span>
                                            <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/** mobile view */}
                    <div className="visible sm:hidden">
                        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                            <div className="flex-1 flex justify-between sm:hidden">
                                <button
                                    onClick={() => {
                                        setPrevious();
                                    }}
                                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                    Previous
                                </button>
                                <p className="text-sm text-gray-700">
                                    Page <span className="font-medium">{currentPage}</span> of{' '}
                                    <span className="font-medium">{maxPages}</span>
                                </p>
                                <button
                                    onClick={() => {
                                        setNext();
                                    }}
                                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
