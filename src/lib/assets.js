import { ClarityType, contractPrincipalCV, cvToString, uintCV } from 'micro-stacks/clarity';
import { pubscriptCVToBtcAddress } from './btcTransactions';
import { getFTData, getNFTData } from './tokenData';
import { optionalCVToString } from './transactions';
import { ftFeeContracts, NETWORK, nftFeeContracts } from './constants';
import { callReadOnlyFunction, fetchNamesByAddress } from 'micro-stacks/api';
import { fetchPrivate } from 'micro-stacks/common';
import { getAsset } from '../components/assets';

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
  const [escrow] = type.split("-");

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

export function factorForType(type) {
  return type.startsWith('stx-') //
    ? 1_000_000
    : type.startsWith('banana-')
    ? 1_000_000
    : type.startsWith('usda-')
    ? 1_000_000
    : type.startsWith('xbtc-')
    ? 100_000_000
    : 100_000_000;
}
export function amountFromSwapsEntry(swapsEntry, type) {
  if (type.startsWith('satoshible-')) {
    return swapsEntry.data['satoshible-id'].value;
  }
  const factor = factorForType(type);
  let amountProperty = type.startsWith('stx-')
    ? 'ustx'
    : type.startsWith('banana-')
    ? 'ubanana'
    : type.startsWith('usda-')
    ? 'usda'
    : type.startsWith('xbtc-')
    ? 'xbtc'
    : 'sats';
  return Number(swapsEntry.data[amountProperty].value) / factor;
}

// from swaps map entry
function senderToEscrow(type) {
  if (type === 'nft') {
    return 'nft-receiver';
  }
  if (type.startsWith('banana-')) {
    return 'banana-sender';
  } else if (type.startsWith('usda-')) {
    return 'usda-sender';
  } else if (type.startsWith('xbtc-')) {
    return 'xbtc-sender';
  } else if (type.startsWith('satoshible-')) {
    return 'satoshible-sender';
  } else {
    return 'stx-sender';
  }
}
export async function setFromDataFromSwapsEntry(swapsEntry, type, setFormData) {
  const whenFromSwap = Number(swapsEntry.data['when'].value);
  const doneFromSwap = swapsEntry.data['done']
    ? Number(swapsEntry.data['done'].value)
    : swapsEntry.data['open'].type === ClarityType.BoolTrue
    ? 0
    : 1;
  const btcRecipient = isAtomic(type)
    ? undefined
    : pubscriptCVToBtcAddress(swapsEntry.data['btc-receiver']);
  const amountBtcOrStx = amountFromSwapsEntry(swapsEntry, type);
  const assetRecipient = cvToString(swapsEntry.data[senderToEscrow(type)]);

  console.log(amountBtcOrStx);
  let trait, ftData, nftData, contractAddress, contractName;
  let feeAddress, feeName, feeId;
  switch (type) {
    case 'ft':
      trait = cvToString(swapsEntry.data['ft']);
      [contractAddress, contractName] = trait.split('.');
      ftData = await getFTData(contractAddress, contractName);

      setFormData({
        btcRecipient,
        amountSats: amountBtcOrStx,
        trait: trait + '::' + ftData.assetName,
        amount: Number(swapsEntry.data.ustx.value) / Math.pow(10, ftData.decimals),
        assetRecipient: optionalCVToString(swapsEntry.data['ft-receiver']),
        assetRecipientFromSwap: optionalCVToString(swapsEntry.data['ft-receiver']),
        assetSenderFromSwap: cvToString(swapsEntry.data['ft-sender']),
        whenFromSwap,
        doneFromSwap,
      });
      break;
    case 'stx':
      setFormData({
        btcRecipient,
        amountSats: amountBtcOrStx,
        amount: Number(swapsEntry.data.ustx.value) / Math.pow(10, 6),
        assetRecipient: optionalCVToString(swapsEntry.data['stx-receiver']),
        assetRecipientFromSwap: optionalCVToString(swapsEntry.data['stx-receiver']),
        assetSenderFromSwap: cvToString(swapsEntry.data['stx-sender']),
        whenFromSwap,
        doneFromSwap,
      });
      break;
    case 'nft':
      trait = cvToString(swapsEntry.data['nft']);
      nftData = await getNFTData(trait);

      setFormData({
        btcRecipient,
        amountSats: amountBtcOrStx,
        trait: trait + '::' + nftData.assetName,
        nftId: Number(swapsEntry.data['nft-id'].value),
        assetRecipient,
        assetRecipientFromSwap: assetRecipient,
        assetSenderFromSwap: cvToString(swapsEntry.data['nft-sender']),
        whenFromSwap,
        doneFromSwap,
      });
      break;
    case 'stx-ft': // (define-map swaps uint {ustx: uint, stx-sender: principal, amount: uint, ft-sender: (optional principal), when: uint, open: bool, ft: principal, fees: principal})
    case 'banana-ft':
    case 'xbtc-ft':
    case 'usda-ft':
    case 'satoshible-ft': // (define-map swaps uint {satoshible-id: uint, satoshible-sender: principal, ft-amount: uint, ft-sender: (optional principal), when: uint, open: bool, ft: principal, fees: principal})
      trait = cvToString(swapsEntry.data['ft']);
      [feeAddress, feeName] = cvToString(swapsEntry.data['fees']).split('.');
      feeId = Object.entries(ftFeeContracts).find(
        e => e[1].address === feeAddress && e[1].name === feeName
      );
      [contractAddress, contractName] = trait.split('.');
      ftData = await getFTData(contractAddress, contractName);
      setFormData({
        btcRecipient,
        amountSats: amountBtcOrStx,
        trait: trait + '::' + ftData.assetName,
        amount: Number(swapsEntry.data.ustx.value) / Math.pow(10, Number(ftData.decimals)),
        assetRecipient,
        assetRecipientFromSwap: assetRecipient,
        assetSenderFromSwap: cvToString(swapsEntry.data['ft-sender']),
        whenFromSwap,
        doneFromSwap,
        feeId: feeId ? feeId[0] : 'stx', // TODO better fall back
      });
      break;
    case 'stx-nft': //  (define-map swaps uint {ustx: uint, stx-sender: principal, nft-id: uint, nft-sender: (optional principal), when: uint, open: bool, nft: principal, fees: principal})
    case 'banana-nft': //(define-map swaps uint {ubanana: uint, banana-sender: principal, nft-id: uint, nft-sender: (optional principal), when: uint, open: bool, nft: principal, fees: principal})
    case 'xbtc-nft':
    case 'usda-nft':
    case 'satoshible-nft': // (define-map swaps uint {satoshible-id: uint, satoshible-sender: principal, nft-id: uint, nft-sender: (optional principal), when: uint, open: bool, nft: principal, fees: principal})
      trait = cvToString(swapsEntry.data['nft']);
      [feeAddress, feeName] = cvToString(swapsEntry.data['fees']).split('.');
      feeId = Object.entries(nftFeeContracts).find(
        e => e[1].address === feeAddress && e[1].name === feeName
      );
      [contractAddress, contractName] = trait.split('.');
      nftData = await getNFTData(contractAddress, contractName);
      setFormData({
        btcRecipient,
        amountSats: amountBtcOrStx,
        trait: trait + '::' + nftData.assetName,
        nftId: Number(swapsEntry.data['nft-id'].value),
        assetRecipient,
        assetRecipientFromSwap: assetRecipient,
        assetSenderFromSwap: cvToString(swapsEntry.data['nft-sender']),
        whenFromSwap,
        doneFromSwap,
        feeId: feeId ? feeId[0] : 'stx', // TODO better fall back
      });
      break;
    default:
      console.log('unsupported type ' + type);
  }
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
  console.log({ ownerCV });
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
