export const MIA_TOKEN = 'SP466FNC0P7JWTNM2R9T199QRZN1MYEDTAR0KP27.miamicoin-token::miamicoin';
export const BOOMBOX = 'SP497E7RX3233ATBS2AB9G4WTHB63X5PBSP5VGAQ.boomboxes-cycle-14::b-14';
export const THIS_IS_NUMBER_ONE =
  'SP3QSAJQ4EA8WXEDSRRKMZZ29NH91VZ6C5X88FGZQ.thisisnumberone-v2::my-nft';

export function getAsset(type, trait) {
  return trait === MIA_TOKEN
    ? 'MIA'
    : trait === BOOMBOX
    ? 'BOOMBOX'
    : trait === THIS_IS_NUMBER_ONE
    ? '#1'
    : type.toUpperCase();
}

export function getAssetName(type, trait) {
  return type === 'nft' ? 'NFT' : type === 'ft' ? 'token' : 'stacks';
}

export function getDeepLink(type, trait) {
  return trait === MIA_TOKEN
    ? '/mia'
    : trait === THIS_IS_NUMBER_ONE
    ? '/thisisnumberone'
    : trait
    ? `/${type}/${trait}`
    : `/${type}`;
}
