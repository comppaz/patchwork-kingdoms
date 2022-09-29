import { useEffect, useState } from 'react';
import Loading from '../components/Loading';
import Leaderboard from '../components/Leaderbord';

const Leaderbord = () => {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(false);
    const [exchangeRate, setExchangeRate] = useState(0);
    const fixedAuctionValue = 40.9;

    useEffect(async () => {
        // get and add current statistics values
        data = await getNFTStatistics();
        exchangeRate = await getCurrentUSDExchangeRate();
        setData(data);
        setExchangeRate(exchangeRate);
        setLoading(false);
    }, []);

    const getNFTStatistics = async () => {
        const response = await fetch('/api/getNFTStatistics', {
            method: 'POST',
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
