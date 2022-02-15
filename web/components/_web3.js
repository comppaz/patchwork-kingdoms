import { InjectedConnector } from "@web3-react/injected-connector";
import Web3 from 'web3';
import contractABI from "../data/PatchworkKingdoms.json";

const acceptedChains = [1, 2, 4, 5];

export const injected = new InjectedConnector({ supportedChainIds: acceptedChains });

export const mint = (account, proof) => {
    const amount = '0.175';
    const web3 = new Web3(Web3.givenProvider)
    const contract = new web3.eth.Contract(contractABI, process.env.NEXT_PUBLIC_CONTRACT_ADDRESS);
    const amountToWei = web3.utils.toWei(amount, 'ether');

    return contract.methods.mint(proof).send({ from: account, value: amountToWei });
}

export const hasClaimed = async (account) => {

    const web3 = new Web3(Web3.givenProvider)
    const contract = new web3.eth.Contract(contractABI, process.env.NEXT_PUBLIC_CONTRACT_ADDRESS);

    return await contract.methods.hasClaimed(account).call()

}