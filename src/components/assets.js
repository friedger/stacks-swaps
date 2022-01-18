export const MIA_TOKEN = 'SP466FNC0P7JWTNM2R9T199QRZN1MYEDTAR0KP27.miamicoin-token::miamicoin';
export const FARI_TOKEN = 'SP213KNHB5QD308TEESY1ZMX1BP8EZDPG4JWD0MEA.fari-token-mn::fari';
export const BOOMBOX = 'SP1QK1AZ24R132C0D84EEQ8Y2JDHARDR58R72E1ZW.boomboxes-cycle-20-v1::b-20';
export const THIS_IS_NUMBER_ONE =
  'SP3QSAJQ4EA8WXEDSRRKMZZ29NH91VZ6C5X88FGZQ.thisisnumberone-v2::my-nft';
export const CRASHPUNKS = 'SP3QSAJQ4EA8WXEDSRRKMZZ29NH91VZ6C5X88FGZQ.crashpunks-v2::crashpunks-v2';

export function getAsset(type, trait) {
  return trait === MIA_TOKEN
    ? 'MIA'
    : trait === BOOMBOX
    ? 'Boombox [5th Edition]'
    : trait === FARI_TOKEN
    ? 'FARI'
    : trait === THIS_IS_NUMBER_ONE
    ? '#1'
    : trait === CRASHPUNKS
    ? 'Crash Punks'
    : type.toUpperCase();
}

export function getAssetName(type, trait) {
  return type === 'nft' || type === 'stx-nft' ? 'NFT' : type === 'ft' ? 'tokens' : 'stacks';
}

export function getDeepLink(type, trait) {
  return trait === MIA_TOKEN
    ? type === 'stx-ft'
      ? '/stx-mia'
      : '/mia'
    : trait === THIS_IS_NUMBER_ONE
    ? '/thisisnumberone'
    : trait === FARI_TOKEN
    ? type === 'stx-ft'
      ? '/stx-fari'
      : '/fari'
    : trait
    ? `/${type}/${trait}`
    : `/${type}`;
}
