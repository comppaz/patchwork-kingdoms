import useSWR from 'swr';

export default function useUser(): IUseUser {
    const { data: user, mutate: mutateUser } = useSWR('/api/user');

    return { user, mutateUser };
}
