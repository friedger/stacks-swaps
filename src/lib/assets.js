import { ClarityType, contractPrincipalCV, cvToString, uintCV } from 'micro-stacks/clarity';
import { pubscriptCVToBtcAddress } from './btcTransactions';
import { getFTData, getNFTData } from './tokenData';
import { optionalCVToString } from './transactions';
import { ftFeeContracts, NETWORK, nftFeeContracts } from './constants';
import { callReadOnlyFunction, fetchNamesByAddress } from 'micro-stacks/api';
import { fetchPrivate } from 'micro-stacks/common';
import { BANANA_TOKEN, getAsset, XBTC_TOKEN } from '../components/assets';
import {
  amountOrIdPropertyForSaleFromSwapsType,
  amountOrIdPropertyInEscrowFromSwapsEntry,
  buyerPropertyFromSwapType,
  ftPropertyFromSwapsType,
  nftPropertyFromSwapsType,
  sellerPropertyFromSwapType,
} from './swapMapEntries';
import { getAssetInEscrow, traitForSaleFromSwapsEntry } from './swaps';
import { c32ToB58 } from 'micro-stacks/crypto';

/**
 *
 * @param  assetString identifier in the form address.name::assetName
 * @returns contract as CV and asset name
 */
export function splitAssetIdentifier(assetString) {
  const [contractAddress, tail] = assetString.split('.');
  const [contractName, assetName] = tail.split('::');
  const contractCV = contractPrincipalCV(contractAddress, contractName);
  return [contractCV, assetName, contractName, contractAddress];
}

export function isAtomic(type) {
  return type.indexOf('-') > 0;
}

export function buyAssetFromType(type) {
  return type.startsWith('stx-') //
    ? 'STX'
    : type.startsWith('banana-')
    ? 'BANANA'
    : type.startsWith('usda-')
    ? 'USDA'
    : type.startsWith('xbtc-')
    ? 'xBTC'
    : type.startsWith('satoshible-')
    ? 'Satoshible'
    : 'BTC';
}

export function assetInEscrowFromType(type) {
  const [escrow] = type.split('-');
  return getAsset(escrow);
}

export function buyAssetTypeFromSwapType(type) {
  return isAtomic(type) ? type.split('-')[0] : 'btc';
}

export function assetTypeInEscrowFromSwapType(type) {
  return isAtomic(type) ? type.split('-')[0] : type;
}

export function getBuyLabelFromType(type) {
  return isAtomic(type)
    ? type === 'stx-nft'
      ? `Price for NFT in STXs`
      : type === 'banana-nft'
      ? 'Price of NFT in $BANANAs'
      : type === 'banana-ft'
      ? 'amount of $BANANA'
      : type.startsWith('satoshible-')
      ? 'ID of Satoshible'
      : type === 'usda-nft'
      ? 'Price of NFT in USDA'
      : type === 'usda-ft'
      ? 'amount of USDA'
      : type === 'xbtc-nft'
      ? 'Price of NFT in xBTC'
      : type === 'xbtc-ft'
      ? 'amount of xBTC'
      : `amount of STXs` // default for atomic swaps
    : type === 'nft'
    ? `Price for NFT in Bitcoin`
    : `amount of Bitcoins`; // type === stx or ft
}

export function getBuyLabelFromType2(type) {
  return isAtomic(type)
    ? type === 'stx-nft'
      ? `Price for NFT in STXs`
      : type === 'banana-nft'
      ? 'Price of NFT in $BANANAs'
      : type === 'banana-ft'
      ? 'amount of $BANANA'
      : type.startsWith('satoshible-')
      ? 'ID of Satoshible'
      : type === 'usda-nft'
      ? 'Price of NFT in USDA'
      : type === 'usda-ft'
      ? 'amount of USDA'
      : type === 'xbtc-nft'
      ? 'Price of NFT in xBTC'
      : type === 'xbtc-ft'
      ? 'amount of xBTC'
      : `amount of STXs` // default for atomic swaps
    : type === 'stx'
    ? 'amount of STXs'
    : type === 'usda'
    ? 'amount of USDA'
    : type === 'xbtc'
    ? 'amount of XBTC'
    : 'amount';
}

export function buyDecimalsFromType(type) {
  return type.startsWith('stx-') //
    ? 6
    : type.startsWith('banana-')
    ? 6
    : type.startsWith('usda-')
    ? 6
    : type.startsWith('xbtc-')
    ? 8
    : 8;
}

export function buyDecimalsFromType2(type) {
  const [escrow] = type.split('-');

  return escrow === 'stx' //
    ? 6
    : escrow === 'banana'
    ? 6
    : escrow === 'usda'
    ? 6
    : escrow === 'xbtc'
    ? 8
    : 0;
}

export async function getFtDataFromSwapsEntry(swapsEntry, type) {
  const property = ftPropertyFromSwapsType(type);
  if (property) {
    const ctr = cvToString(swapsEntry.data[property]);
    const [contractAddress, contractName] = ctr.split('.');
    const ftData = await getFTData(contractAddress, contractName);
    return [ctr + '::' + ftData.assetName, ftData];
  } else {
    return [];
  }
}

export async function getNftDataFromSwapsEntry(swapsEntry, type) {
  const property = nftPropertyFromSwapsType(type);
  if (property) {
    const ctr = cvToString(swapsEntry.data[property]);
    const [contractAddress, contractName] = ctr.split('.');
    const nftData = await getNFTData(contractAddress, contractName);
    return [ctr + '::' + nftData.assetName, nftData];
  } else {
    return [];
  }
}

export function factorAssetInEscrowFromSwapType(type) {
  return type.startsWith('stx') //
    ? 1_000_000
    : type.startsWith('banana-')
    ? 1_000_000
    : type.startsWith('usda')
    ? 1_000_000
    : type.startsWith('xbtc')
    ? 100_000_000
    : type.startsWith('satoshible')
    ? 1
    : 100_000_000;
}

export function factorAssetForSaleFromSwapType(type, trait) {
  return type === 'stx' || type === 'ft' || type === 'nft'
    ? 100_000_000
    : type.endsWith('-nft')
    ? 1
    : trait === XBTC_TOKEN
    ? 100_000_000
    : 1_000_000;
}

// returns number with decimals or nft id
function amountOrIdForSaleFromSwapsEntry(swapsEntry, type, ftData) {
  const numberProperty = amountOrIdPropertyForSaleFromSwapsType(type);
  if (ftData?.decimals) {
    const factor = Math.pow(10, Number(ftData.decimals));
    return Number(swapsEntry.data[numberProperty].value) / factor;
  } else {
    return Number(swapsEntry.data[numberProperty].value);
  }
}

// returns number with decimals or nft id
function amountOrIdInEscrowFromSwapsEntry(swapsEntry, type, ftData) {
  const numberProperty = amountOrIdPropertyInEscrowFromSwapsEntry(type);
  if (type.startsWith('satoshible')) {
    return Number(swapsEntry.data[numberProperty].value);
  } else {
    const factor =
      type === 'ft' ? Math.pow(10, ftData.decimals) : factorAssetInEscrowFromSwapType(type);
    return Number(swapsEntry.data[numberProperty].value) / factor;
  }
}

function getFeeIdFromSwapsEntry(swapsEntry) {
  if (swapsEntry.data['fees']) {
    const [feeAddress, feeName] = cvToString(swapsEntry.data['fees']).split('.');
    const feeIds = Object.entries(nftFeeContracts).concat(Object.entries(ftFeeContracts)).find(
      e => e[1].address === feeAddress && e[1].name === feeName
    );
    if (feeIds && feeIds.length > 0) {
      return feeIds[0];
    }
  }
  return undefined;
}

export async function setFormDataFromSwapsEntry(swapsEntry, type, setFormData, ownerStxAddress) {
  const [ftTrait, ftData] = await getFtDataFromSwapsEntry(swapsEntry, type);
  const [nftTrait] = await getNftDataFromSwapsEntry(swapsEntry, type);

  const amountOrIdInEscrow = amountOrIdInEscrowFromSwapsEntry(swapsEntry, type);
  const decimalsInEscrow = buyDecimalsFromType2(type);
  const traitInEscrow = getAssetInEscrow(type, ftTrait);

  const amountOrIdForSale = amountOrIdForSaleFromSwapsEntry(swapsEntry, type, ftData);
  const decimalsForSale = ftData?.decimals ? ftData.decimals : 1;
  const traitForSale = traitForSaleFromSwapsEntry(type, ftTrait, nftTrait);

  const buyerAddress = isAtomic(type)
    ? cvToString(swapsEntry.data[buyerPropertyFromSwapType(type)])
    : pubscriptCVToBtcAddress(swapsEntry.data['btc-receiver']);
  const buyerBtcAddress = isAtomic(type)
    ? c32ToB58(buyerAddress)
    : pubscriptCVToBtcAddress(swapsEntry.data['btc-receiver']);
  const sellerAddress = optionalCVToString(swapsEntry.data[sellerPropertyFromSwapType(type)]);

  const feeId = getFeeIdFromSwapsEntry(swapsEntry, type);

  const whenFromSwap = Number(swapsEntry.data['when'].value);
  const doneFromSwap = swapsEntry.data['done']
    ? Number(swapsEntry.data['done'].value)
    : swapsEntry.data['open'].type === ClarityType.BoolTrue
    ? 0
    : 1;

  setFormData({
    amountOrIdInEscrow,
    decimalsInEscrow,
    traitInEscrow,
    amountOrIdForSale,
    decimalsForSale,
    traitForSale,
    buyerAddress,
    buyerBtcAddress,
    sellerAddress,
    feeId,
    whenFromSwap,
    doneFromSwap,
  });
}

export async function resolveImageForNFT(contractAddress, contractName, nftId) {
  const tokenUriCV = await callReadOnlyFunction({
    contractAddress,
    contractName,
    functionName: 'get-token-uri',
    functionArgs: [uintCV(nftId)],
  });
  const nftUrl =
    tokenUriCV.type === ClarityType.ResponseOk && tokenUriCV.value.type === ClarityType.OptionalSome
      ? tokenUriCV.value.value.data
      : undefined;
  if (nftUrl) {
    let url = nftUrl.replace('{id}', nftId);
    url = url.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/');
    const metaDataResponse = await fetchPrivate(url);
    const metaData = await metaDataResponse.json();
    let image = metaData.image || metaData.properties.image;
    image = image.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/');
    return image;
  } else {
    return undefined;
  }
}

export async function resolveOwnerForNFT(contractAddress, contractName, nftId, addressOnly) {
  const ownerCV = await callReadOnlyFunction({
    contractAddress,
    contractName,
    functionName: 'get-owner',
    functionArgs: [uintCV(nftId)],
  });
  const owner =
    ownerCV.type === ClarityType.ResponseOk && ownerCV.value.type === ClarityType.OptionalSome
      ? cvToString(ownerCV.value.value)
      : undefined;
  if (addressOnly) {
    return owner;
  }
  const namesResponse = await fetchNamesByAddress({
    url: NETWORK.bnsLookupUrl,
    address: owner,
    blockchain: 'stacks',
  });
  return namesResponse.names?.length ? namesResponse.names[0] : owner;
}
