export function checkIfFeatureIsActive() {
    if (
        process.env.NEXT_PUBLIC_DONATION_FEATURE_FLAG === undefined ||
        process.env.NEXT_PUBLIC_DONATION_FEATURE_FLAG === 'false' ||
        process.env.NEXT_PUBLIC_DONATION_FEATURE_FLAG.length === 0
    ) {
        return false;
    }
    return true;
}
