import useSWR from "swr";

export default function useOwnedNfts(user) {

    const { data: nfts } = useSWR(user?.isLoggedIn ? `/api/getOwnedNfts` : null);

    return { nfts };
}