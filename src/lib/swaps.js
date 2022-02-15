import {
  createAssetInfo,
  FungibleConditionCode,
  makeContractFungiblePostCondition,
  makeContractNonFungiblePostCondition,
  makeContractSTXPostCondition,
  makeStandardFungiblePostCondition,
  makeStandardNonFungiblePostCondition,
  makeStandardSTXPostCondition,
  NonFungibleConditionCode,
} from 'micro-stacks/transactions';
import { BANANA_TOKEN, SATOSHIBLES, USDA_TOKEN, XBTC_TOKEN } from '../components/assets';
import { splitAssetIdentifier } from './assets';

export function assetInEscrow(type) {
  if (type.startsWith('stx-')) {
    return undefined;
  } else if (type.startsWith('banana-')) {
    return BANANA_TOKEN;
  } else if (type.startsWith('usda-')) {
    return USDA_TOKEN;
  } else if (type.startsWith('xbtc-')) {
    return XBTC_TOKEN;
  } else if (type.startsWith('satoshible-')) {
    return SATOSHIBLES;
  }
}

function ftInEscrow(type) {
  return type.startsWith('banana-') || type.startsWith('usda-') || type.startsWith('xbtc-');
}

// return true for nft and anyasset-nft
export function nftSwap(type) {
  return type.endsWith('nft');
}

export function makeCreateSwapPostConditions(
  type,
  feeId,
  ownerStxAddress,
  satsOrUstxCV,
  fees,
  feeContract
) {
  const postConditions = [];

  if (type.startsWith('stx-')) {
    // move stx to escrow
    const feesInSTX = feeId === 'stx' ? fees : 0;
    postConditions.push(
      makeStandardSTXPostCondition(
        ownerStxAddress,
        FungibleConditionCode.Equal,
        satsOrUstxCV.value + feesInSTX
      )
    );
    if (feeId !== 'stx') {
      postConditions.push(
        makeStandardFungiblePostCondition(
          ownerStxAddress,
          FungibleConditionCode.Equal,
          fees,
          createAssetInfo(feeContract.ft.address, feeContract.ft.name, feeContract.ft.assetName)
        )
      );
    }
  } else if (ftInEscrow(type)) {
    // move ft to escrow
    const asset = assetInEscrow(type);
    const [, assetName, assetContractName, assetContractAddress] = splitAssetIdentifier(asset);
    const sameContract =
      assetContractAddress === feeContract.ft.address && assetContractName === feeContract.ft.name;

    const feesInFT = sameContract ? fees : 0;
    postConditions.push(
      makeStandardFungiblePostCondition(
        ownerStxAddress,
        FungibleConditionCode.Equal,
        satsOrUstxCV.value + BigInt(feesInFT),
        createAssetInfo(assetContractAddress, assetContractName, assetName)
      )
    );
    if (!sameContract) {
      postConditions.push(
        makeStandardFungiblePostCondition(
          ownerStxAddress,
          FungibleConditionCode.Equal,
          fees,
          createAssetInfo(feeContract.ft.address, feeContract.ft.name, feeContract.ft.assetName)
        )
      );
    }
  } else {
    // move nft to escrow
    const asset = assetInEscrow(type);
    const [, assetName, assetContractName, assetContractAddress] = splitAssetIdentifier(asset);
    postConditions.push(
      makeStandardNonFungiblePostCondition(
        ownerStxAddress,
        NonFungibleConditionCode.DoesNotOwn,
        createAssetInfo(assetContractAddress, assetContractName, assetName),
        satsOrUstxCV
      )
    );
    if (feeId === 'fixed') {
      postConditions.push(
        makeStandardSTXPostCondition(ownerStxAddress, FungibleConditionCode.Equal, fees)
      );
    } else {
      // unsupported
      console.error('Unsupported feeId', feeId, type);
    }
  }
  console.log({ postConditions });
  return postConditions;
}

export function makeCancelSwapPostConditions(
  type,
  contract,
  amountOrIdCV,
  feeId,
  feeContract,
  fees
) {
  const postConditions = [];
  // move stx from escrow
  if (type.startsWith('stx-')) {
    postConditions.push(
      makeContractSTXPostCondition(
        contract.address,
        contract.name,
        FungibleConditionCode.Equal,
        amountOrIdCV.value
      )
    );
  } else if (ftInEscrow(type)) {
    // move ft from escrow
    const [, assetName, assetContractName, assetContractAddress] = splitAssetIdentifier(
      assetInEscrow(type)
    );
    postConditions.push(
      makeContractFungiblePostCondition(
        contract.address,
        contract.name,
        FungibleConditionCode.Equal,
        createAssetInfo(assetContractAddress, assetContractName, assetName),
        amountOrIdCV.value
      )
    );
  } else {
    // move nft from escrow
    const [, assetName, assetContractName, assetContractAddress] = splitAssetIdentifier(
      assetInEscrow(type)
    );
    postConditions.push(
      makeContractNonFungiblePostCondition(
        contract.address,
        contract.name,
        NonFungibleConditionCode.DoesNotOwn,
        createAssetInfo(assetContractAddress, assetContractName, assetName),
        amountOrIdCV.value
      )
    );
  }

  // handle fees

  if (feeId === 'stx' || feeId === 'fixed') {
    // move stx from fee contract
    postConditions.push(
      makeContractSTXPostCondition(
        feeContract.address,
        feeContract.name,
        FungibleConditionCode.Equal,
        fees
      )
    );
  } else {
    // move ft from fee contract
    postConditions.push(
      makeContractFungiblePostCondition(
        feeContract.address,
        feeContract.name,
        FungibleConditionCode.Equal,
        fees,
        createAssetInfo(feeContract.ft.address, feeContract.ft.name, feeContract.ft.assetName)
      )
    );
  }
}

export function makeSubmitPostConditions(
  type,
  contract,
  amountOrIdCV,
  ownerStxAddress,
  assetContractAddress,
  assetContractName,
  assetName,
  amountOrIdToSwapCV,
  feeId,
  feeContract,
  fees
) {
  const postConditions = [];

  // handle asset to swap against asset in escrow

  if (nftSwap(type)) {
    postConditions.push(
      makeStandardNonFungiblePostCondition(
        ownerStxAddress,
        NonFungibleConditionCode.DoesNotOwn,
        createAssetInfo(assetContractAddress, assetContractName, assetName),
        amountOrIdToSwapCV.value
      )
    );
  } else {
    postConditions.push(
      makeStandardFungiblePostCondition(
        ownerStxAddress,
        FungibleConditionCode.Equal,
        amountOrIdToSwapCV.value,
        createAssetInfo(assetContractAddress, assetContractName, assetName)
      )
    );
  }

  return postConditions.concat(
    makeCancelSwapPostConditions(type, contract, amountOrIdCV, feeId, feeContract, fees)
  );
}
