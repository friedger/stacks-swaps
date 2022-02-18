// returns property for amount or nft id of asset in escrow
export function amountOrIdPropertyInEscrowFromSwapsEntry(type) {
  return type.startsWith('satoshible-')
    ? 'satoshible-id'
    : type.startsWith('stx')
    ? 'ustx'
    : type.startsWith('banana-')
    ? 'ubanana'
    : type.startsWith('usda')
    ? 'usda'
    : type.startsWith('xbtc')
    ? 'xbtc'
    : type === 'nft'
    ? 'nft-id'
    : type === 'ft'
    ? 'amount'
    : '';
}

export function amountOrIdPropertyForSaleFromSwapsType(type) {
  return type === 'satoshible-ft'
    ? 'ft-amount'
    : type === 'satoshible-nft'
    ? 'nft-id'
    : type === 'stx-ft'
    ? 'amount'
    : type.endsWith('-nft')
    ? 'nft-id'
    : type.endsWith('-ft')
    ? 'amount-sell'
    : 'sats';
}

// from swaps map entry
export function buyerPropertyFromSwapType(type) {
  if (type === 'nft') {
    return 'nft-sender';
  } else if (type === 'ft') {
    return 'ft-sender';
  } else if (type.startsWith('banana-')) {
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

export function sellerPropertyFromSwapType(type) {
  return type === 'nft'
    ? 'nft-receiver'
    : type === 'ft'
    ? 'ft-receiver'
    : type === 'stx-ft' || type === 'satoshible-ft'
    ? 'ft-sender'
    : type.endsWith('-ft') // usda-ft, xbtc-ft, banana-ft
    ? 'seller'
    : type.endsWith('-nft') // satoshible-nft, usda-nft, xbtc-nft, banana-nft
    ? 'nft-sender'
    : undefined;
}

export function ftPropertyFromSwapsType(type) {
  return type === 'stx' || type === 'nft' || type.endsWith('nft')
    ? undefined
    : type === 'banana-ft' || type === 'usda-ft' || type === 'xbtc-ft'
    ? 'ft-sell'
    : 'ft';
}

export function nftPropertyFromSwapsType(type) {
  return type === 'stx' || type === 'ft' || type.endsWith('ft') ? undefined : 'ft';
}
