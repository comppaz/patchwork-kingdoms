import { InjectedConnector } from "@web3-react/injected-connector";

const acceptedChains = [1];

export const injected = new InjectedConnector({ supportedChainIds: acceptedChains });