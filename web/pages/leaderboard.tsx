import { useEffect, useState } from 'react';
import Loading from '../components/Loading';
import Leaderboard from '../components/Leaderbord';

const Leaderbord = () => {
    const [data, setData] = useState();
    const [donators, setDonators] = useState();
    const [loading, setLoading] = useState<boolean>(false);
    const [exchangeRate, setExchangeRate] = useState<number>(0);
    const fixedAuctionValue = 40.9;

    useEffect(() => {
        (async () => {
            // get and add current statistics values
            setData(await getNFTStatistics());
            setDonators(await getDonators());
            setExchangeRate(await getCurrentUSDExchangeRate());
            setLoading(false);
        })();
    }, []);

    const getNFTStatistics = async () => {
        const response = await fetch('/api/getNFTStatistics', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const res = await response.json();
        return res;
    };

    const getCurrentUSDExchangeRate = async () => {
        const response = await fetch('/api/getCurrentUSDExchangeRate', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const res = await response.json();
        return res;
    };

    const getDonators = async () => {
        const response = await fetch('/api/getDonators', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const res = await response.json();
        console.log(res);
        return res;
    };

    const roundPriceValue = (price, decimalPoints) => {
        if (price) {
            return price.toFixed(decimalPoints);
        }
    };

    const convertToUSD = eth => {
        return eth * exchangeRate;
    };

    return (
        <>
            {loading ? (
                <Loading />
            ) : (
                <Leaderboard
                    data={data}
                    fixedAuctionValue={fixedAuctionValue}
                    roundPriceValue={roundPriceValue}
                    convertToUSD={convertToUSD}></Leaderboard>
            )}
        </>
    );
};

export default Leaderbord;
