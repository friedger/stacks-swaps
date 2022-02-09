import { ClarityType, contractPrincipalCV } from 'micro-stacks/clarity';
import { callReadOnlyFunction } from 'micro-stacks/transactions';

export async function contractToFees(feeContract, satsOrUstxCV) {
  const feesCV = contractPrincipalCV(feeContract.address, feeContract.name);
  const feesResponse = await callReadOnlyFunction({
    contractAddress: feeContract.address,
    contractName: feeContract.name,
    functionName: 'get-fees',
    functionArgs: [satsOrUstxCV],
    senderAddress: feeContract.address,
  });
  const fees =
    feesResponse.type === ClarityType.OptionalNone ? undefined : feesResponse.value.value;
  return [feesCV, fees];
}
