import { callReadOnlyFunction } from 'micro-stacks/transactions';
import { NETWORK, smartContractsApi } from './constants';

export async function getFTData(contractAddress, contractName) {
  const ctrInterface = await smartContractsApi.getContractInterface({
    contractAddress,
    contractName,
  });
  const decimalsResponse = await callReadOnlyFunction({
    contractAddress,
    contractName,
    functionName: 'get-decimals',
    functionArgs: [],
    senderAddress: contractAddress,
    network: NETWORK,
  });
  const decimals = decimalsResponse.value.value;
  const symbol = await callReadOnlyFunction({
    contractAddress,
    contractName,
    functionName: 'get-symbol',
    functionArgs: [],
    senderAddress: contractAddress,
    network: NETWORK,
  });
  const assetName =
    ctrInterface.fungible_tokens.length === 1 ? ctrInterface.fungible_tokens[0].name : undefined;
  return { decimals, symbol, assetName };
}

export async function getNFTData(contractAddress, contractName) {
  const ctrInterface = await smartContractsApi.getContractInterface({
    contractAddress,
    contractName,
  });
  const assetName =
    ctrInterface.non_fungible_tokens.length === 1
      ? ctrInterface.non_fungible_tokens[0].name
      : undefined;
  console.log({ nft: assetName });
  return { assetName };
}
