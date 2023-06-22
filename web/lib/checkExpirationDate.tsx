export default async function checkExpirationDate(nfts, currentTimestamp) {
    if (nfts) {
        nfts.every(async el => {
            if (currentTimestamp >= el.expiration) {
                // stops iteration
                return false;
            }
        });
        return true;
    }
}
