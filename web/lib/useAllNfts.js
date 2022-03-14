import useSWR from "swr";

export default function useAllNfts(user) {

    const { data: nfts } = useSWR(true ? `/api/getOwnedNfts?all=true` : null);

    return { nfts };
}