export function getAsset(type, trait) {
  return trait === 'SP466FNC0P7JWTNM2R9T199QRZN1MYEDTAR0KP27.miamicoin-core-v1'
    ? 'MIA'
    : type.toUpperCase();
}

export function getAssetName(type, trait) {
  return type === 'nft' ? 'NFT' : type === 'ft' ? 'token' : 'stacks';
}
