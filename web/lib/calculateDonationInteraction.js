export function calculateMinPrice(price) {
    let expPrice = price.toExponential();
    let parts = String(expPrice).toLowerCase().split('e');
    let ePart = parts.pop() - 1;
    let e = `1e${ePart}`;
    return { minPrice: Number(expPrice) + Number(e), step: Number(e) };
}

export function convertExpirationToDate(expiration) {
    let expirationDate = new Date(expiration * 1000);
    return expirationDate.toLocaleDateString();
}
