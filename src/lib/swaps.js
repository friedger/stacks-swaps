import {
  createAssetInfo,
  FungibleConditionCode,
  makeContractFungiblePostCondition,
  makeContractSTXPostCondition,
  makeStandardFungiblePostCondition,
  makeStandardSTXPostCondition,
} from '@stacks/transactions';

export function makeCreateSwapPostConditions(
  feeId,
  ownerStxAddress,
  satsOrUstxCV,
  fees,
  feeContract
) {
  return feeId === 'stx'
    ? [
        makeStandardSTXPostCondition(
          ownerStxAddress,
          FungibleConditionCode.Equal,
          satsOrUstxCV.value.add(fees)
        ),
      ]
    : [
        makeStandardSTXPostCondition(
          ownerStxAddress,
          FungibleConditionCode.Equal,
          satsOrUstxCV.value
        ),
        makeStandardFungiblePostCondition(
          ownerStxAddress,
          FungibleConditionCode.Equal,
          fees,
          createAssetInfo(feeContract.ft.address, feeContract.ft.name, feeContract.ft.assetName)
        ),
      ];
}

export function makeCancelSwapPostConditions(feeId, contract, satsOrUstxCV, fees, feeContract) {
  return feeId === 'stx'
    ? [
        makeContractSTXPostCondition(
          contract.address,
          contract.name,
          FungibleConditionCode.Equal,
          satsOrUstxCV.value
        ),
        makeContractSTXPostCondition(
          feeContract.address,
          feeContract.name,
          FungibleConditionCode.Equal,
          fees
        ),
      ]
    : [
        makeContractSTXPostCondition(
          contract.address,
          contract.name,
          FungibleConditionCode.Equal,
          satsOrUstxCV.value
        ),
        makeContractFungiblePostCondition(
          contract.address,
          contract.name,
          FungibleConditionCode.Equal,
          fees,
          createAssetInfo(feeContract.ft.address, feeContract.ft.name, feeContract.ft.assetName)
        ),
      ];
}
