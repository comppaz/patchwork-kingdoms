import { InjectedConnector } from "@web3-react/injected-connector";

const acceptedChains = [1, 2, 4, 5];

export const injected = new InjectedConnector({ supportedChainIds: acceptedChains });