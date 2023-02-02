interface User {
    account: string;
    signature: string;
    isLoggedIn: boolean;
    totalNfts: number;
}

interface IUseUser {
    user: User;
    mutateUser: KeyedMutator<any>;
}
