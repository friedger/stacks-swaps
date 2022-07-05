import { ClarityType, contractPrincipalCV, cvToString } from 'micro-stacks/clarity';
import { callReadOnlyFunction } from 'micro-stacks/transactions';
import { feeOptionsByType } from './constants';

export async function contractToFees(feeContract, amountInEscrowCV) {
  const feesCV = contractPrincipalCV(feeContract.address, feeContract.name);
  console.log({ feesCV: cvToString(feesCV) });
  const feesResponse = await callReadOnlyFunction({
    contractAddress: feeContract.address,
    contractName: feeContract.name,
    functionName: 'get-fees',
    functionArgs: [amountInEscrowCV],
    senderAddress: feeContract.address,
  });
  const fees =
    feesResponse.type === ClarityType.OptionalNone ? undefined : feesResponse.value.value;
  return [feesCV, fees];
}

export function defaultFeeIdFromSwapType(swapType) {
  const feeOptions = swapType ? feeOptionsByType[swapType] : [];
  if (feeOptions && feeOptions.length > 0) {
    return feeOptions[0].type;
  } else {
    console.error(`No feeId found for ${swapType} in `, feeOptionsByType[swapType]);
    return '';
  }
}
