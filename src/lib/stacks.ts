import {
  contractPrincipalCV,
  makeContractCall,
  makeUnsignedContractCall,
  noneCV,
  principalCV,
  uintCV,
} from "@stacks/transactions";
import { SwapDetail } from "../app/slices/Swap";
import { resolveProvider } from "./provider";
import { UserState } from "../app/slices/User";

const SBTC_SWAP_CONTRACT = {
  address: "SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4",
  name: "sbtc-token",
};
export const completeSwap = async (swapInfo: SwapDetail, user: UserState) => {
  const provider = resolveProvider();
  console.log(user.wallet.stxPublicKey, swapInfo.amountInfo.sendAmount);
  const tx = await makeUnsignedContractCall({
    contractAddress: SBTC_SWAP_CONTRACT.address,
    contractName: SBTC_SWAP_CONTRACT.name,
    functionName: "transfer",
    functionArgs: [
      uintCV(swapInfo.amountInfo.sendAmount * 10e8),
      principalCV(user.wallet.stxAddress),
      contractPrincipalCV(SBTC_SWAP_CONTRACT.address, SBTC_SWAP_CONTRACT.name),
      noneCV(),
    ],
    network: "mainnet",
    fee: 1000,
    sponsored: true,
    publicKey: user.wallet.stxPublicKey,
  });
  const txHex = tx.serialize();
  try {
    const response = (await provider.request("stx_signTransaction", {
      stxAddress: swapInfo.addressInfo.receiverSTXAddress,
      txHex,
      network: "mainnet",
    })) as {
      result: { txId: string };
    };
    return response.result.txId;
  } catch (error) {
    console.log((error as any).error);
  }
};
