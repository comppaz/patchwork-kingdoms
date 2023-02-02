const JoinCTA = () => {
    const renderCTAs = () => (
        <div className="bg-teal-600 py-1 sticky top-0 z-[100]">
            <div className="flex justify-center mt-0.5 mb-0.5 ">
                <a href="https://discord.gg/vS9QguncHu" target="_blank" rel="noreferrer">
                    <button className="bg-white hover:bg-black hover:text-white text-black font-bold py-2 px-5 mr-2 rounded center uppercase">
                        Join Discord
                    </button>
                </a>
                <a href="/gallery" target="_blank" rel="noreferrer">
                    <button className="bg-white hover:bg-black hover:text-white text-black font-bold py-2 px-4 ml-2 rounded center uppercase">
                        Get a Kingdom
                    </button>
                </a>
            </div>
        </div>
    );

    return renderCTAs();
};

export default JoinCTA;
