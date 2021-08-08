export const MIA_CONTRACT = 'SP466FNC0P7JWTNM2R9T199QRZN1MYEDTAR0KP27.miamicoin-core-v1';
export const BOOMBOX_CONTRACT = 'SP497E7RX3233ATBS2AB9G4WTHB63X5PBSP5VGAQ.boomboxes-cycle-14';

export function getAsset(type, trait) {
  return trait === MIA_CONTRACT
    ? 'MIA'
    : trait === BOOMBOX_CONTRACT
    ? 'BOOMBOX'
    : type.toUpperCase();
}

export function getAssetName(type, trait) {
  return type === 'nft' ? 'NFT' : type === 'ft' ? 'token' : 'stacks';
}

export function getDeepLink(type, trait) {
  return trait === MIA_CONTRACT ? '/mia' : trait ? `/${type}/${trait}` : `/${type}`;
}
