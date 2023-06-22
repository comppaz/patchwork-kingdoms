import { InjectedConnector } from '@web3-react/injected-connector';

let acceptedChains;
if (!process.env.NEXT_PUBLIC_PROD_FLAG) {
    acceptedChains = [5];
} else {
    acceptedChains = [1];
}
export const injected = new InjectedConnector({ supportedChainIds: acceptedChains });
