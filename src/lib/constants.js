import {
  TransactionsApi,
  SmartContractsApi,
  AccountsApi,
  Configuration,
  InfoApi,
  BlocksApi,
  NamesApi,
  NonFungibleTokensApi,
} from '@stacks/blockchain-api-client';
import { StacksMainnet } from 'micro-stacks/network';
import {
  BANANA_TOKEN,
  BITCOIN_MONKEYS,
  CRASHPUNKS,
  FARI_TOKEN,
  MIA_TOKEN,
  SATOSHIBLES,
} from '../components/assets';

export const mainnet = window.location.search.includes('chain=mainnet');

export const chainSuffix = '?chain=mainnet';

export const CONTRACT_ADDRESS = 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9';
export const GENESIS_CONTRACT_ADDRESS = 'SP000000000000000000002Q6VF78';

export const BNS_CONTRACT_NAME = 'bns';

export const CLARITY_BITCOIN_CONTRACT = {
  address: 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9',
  name: 'clarity-bitcoin-lib-v1',
};

export const BTC_NFT_SWAP_CONTRACT = {
  address: 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9',
  name: 'btc-nft-swap-v1',
};

export const BTC_FT_SWAP_CONTRACT = {
  address: 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9',
  name: 'btc-ft-swap',
};

export const BTC_STX_SWAP_CONTRACT = {
  address: 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9',
  name: 'btc-stx-swap-v2',
};

export const STX_FT_SWAP_CONTRACT = {
  address: 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9',
  name: 'stx-ft-swap-v1',
};

export const STX_FT_SWAP_FEE_CONTRACT = {
  address: 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9',
  name: 'stx-ft-swap-v1-fixed-fees',
};

export const STX_FT_SWAP_FPWR_FEE_CONTRACT = {
  address: 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9',
  name: 'stx-ft-swap-v1-fixed-fpwr-v04-fees',
  ft: {
    address: 'SP1JSH2FPE8BWNTP228YZ1AZZ0HE0064PS6RXRAY4',
    name: 'fpwr-v04',
    assetName: 'wrapped-rewards',
  },
};

export const STX_FT_SWAP_FRIE_FEE_CONTRACT = {
  address: 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9',
  name: 'stx-ft-swap-v1-fixed-frie-fees',
  ft: {
    address: 'SPN4Y5QPGQA8882ZXW90ADC2DHYXMSTN8VAR8C3X',
    name: 'friedger-token-v1',
    assetName: 'friedger',
  },
};

export const STX_NFT_SWAP_CONTRACT = {
  address: 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9',
  name: 'stx-nft-swap-v2',
};

export const STX_NFT_SWAP_FEE_CONTRACT = {
  address: 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9',
  name: 'stx-nft-fixed-fees',
};

export const MIA_SWAP_FEE_CONTRACT = {
  address: 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9',
  name: 'cycle-2-hodl-mia-fees',
  ft: {
    address: 'SP466FNC0P7JWTNM2R9T199QRZN1MYEDTAR0KP27',
    name: 'miamicoin-token',
    assetName: 'miamicoin',
  },
};

export const BANANA_NFT_SWAP_CONTRACT = {
  address: 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9',
  name: 'banana-nft-swap-v2',
};

export const BANANA_NFT_SWAP_FEE_CONTRACT = {
  address: 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9',
  name: 'banana-nft-swap-v2-fixed-fees',
  ft: {
    address: 'SP2KAF9RF86PVX3NEE27DFV1CQX0T4WGR41X3S45C',
    name: 'btc-monkeys-bananas',
    assetName: 'BANANA',
  },
};

export const BANANA_FT_SWAP_CONTRACT = {
  address: 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9',
  name: 'banana-ft-swap-v1',
};

export const BANANA_FT_SWAP_FEE_CONTRACT = {
  address: 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9',
  name: 'banana-ft-swap-v2-fixed-fees',
  ft: {
    address: 'SP2KAF9RF86PVX3NEE27DFV1CQX0T4WGR41X3S45C',
    name: 'btc-monkeys-bananas',
    assetName: 'BANANA',
  },
};

export const SATOSHIBLE_NFT_SWAP_CONTRACT = {
  address: 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9',
  name: 'satoshible-nft-swap-v1',
};

export const SATOSHIBLE_FT_SWAP_CONTRACT = {
  address: 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9',
  name: 'satoshible-ft-swap-v1',
};

export const SATOSHIBLE_SWAP_FEE_CONTRACT = {
  address: 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9',
  name: 'satoshible-swap-v1-fixed-fees',
};

export const XBTC_NFT_SWAP_CONTRACT = {
  address: 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9',
  name: 'xbtc-nft-swap-v1',
};

export const XBTC_FT_SWAP_CONTRACT = {
  address: 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9',
  name: 'xbtc-ft-swap-v1',
};

export const XBTC_SWAP_FEE_CONTRACT = {
  address: 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9',
  name: 'xbtc-swap-v1-fixed-fees',
  ft: {
    address: 'SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR',
    name: 'Wrapped-Bitcoin',
    assetName: 'wrapped-bitcoin',
  },
};

export const USDA_NFT_SWAP_CONTRACT = {
  address: 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9',
  name: 'usda-nft-swap-v1',
};

export const USDA_FT_SWAP_CONTRACT = {
  address: 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9',
  name: 'usda-ft-swap-v1',
};

export const USDA_SWAP_FEE_CONTRACT = {
  address: 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9',
  name: 'usda-swap-v1-fixed-fees',
  ft: {
    address: 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR',
    name: 'usda-token',
    assetName: 'usda',
  },
};
// fee contracts for atomic swaps with fts for sale by type
export const ftFeeContracts = {
  stx: STX_FT_SWAP_FEE_CONTRACT,
  fpwr: STX_FT_SWAP_FPWR_FEE_CONTRACT,
  frie: STX_FT_SWAP_FRIE_FEE_CONTRACT,
  mia: MIA_SWAP_FEE_CONTRACT,
  stxnft: STX_NFT_SWAP_FEE_CONTRACT,
  fixed: SATOSHIBLE_SWAP_FEE_CONTRACT,
  banana: BANANA_FT_SWAP_FEE_CONTRACT,
  xbtc: XBTC_SWAP_FEE_CONTRACT,
  usda: USDA_SWAP_FEE_CONTRACT,
};

// fee contracts for atomic swaps with nfts for sale by type
export const nftFeeContracts = {
  stx: STX_NFT_SWAP_FEE_CONTRACT,
  mia: MIA_SWAP_FEE_CONTRACT,
  fixed: SATOSHIBLE_SWAP_FEE_CONTRACT,
  banana: BANANA_NFT_SWAP_FEE_CONTRACT,
  xbtc: XBTC_SWAP_FEE_CONTRACT,
  usda: USDA_SWAP_FEE_CONTRACT,
};

export const atomicSwaps = [
  { type: 'stx-ft' },
  { type: 'stx-nft' },
  { type: 'stx-ft', path: 'stx-mia', trait: MIA_TOKEN },
  { type: 'stx-ft', path: 'stx-fari', trait: FARI_TOKEN },
  { type: 'stx-ft', path: 'stx-banana', trait: BANANA_TOKEN },
  { type: 'stx-nft', path: 'stx-cp', trait: CRASHPUNKS },
  { type: 'stx-nft', path: 'stx-bitcoinmonkey', trait: BITCOIN_MONKEYS },
  {
    type: 'stx-nft',
    path: 'stx-satoshible',
    trait: SATOSHIBLES,
  },
  { type: 'banana-ft' },
  { type: 'banana-nft' },
  { type: 'banana-nft', path: 'banana-bitcoinmonkey', trait: BITCOIN_MONKEYS },
  { type: 'satoshible-ft' },
  { type: 'satoshible-nft' },
  { type: 'satoshible-nft', path: 'satoshible-bitcoinmonkey', trait: BITCOIN_MONKEYS },
  { type: 'xbtc-ft' },
  { type: 'xbtc-nft' },
  { type: 'usda-ft' },
  { type: 'usda-nft' },
];

// swap contracts
export const contracts = {
  nft: BTC_NFT_SWAP_CONTRACT,
  ft: BTC_FT_SWAP_CONTRACT,
  stx: BTC_STX_SWAP_CONTRACT,
  'stx-ft': STX_FT_SWAP_CONTRACT,
  'stx-nft': STX_NFT_SWAP_CONTRACT,
  'banana-nft': BANANA_NFT_SWAP_CONTRACT,
  'banana-ft': BANANA_FT_SWAP_CONTRACT,
  'satoshible-nft': SATOSHIBLE_NFT_SWAP_CONTRACT,
  'satoshible-ft': SATOSHIBLE_FT_SWAP_CONTRACT,
  'xbtc-nft': XBTC_NFT_SWAP_CONTRACT,
  'xbtc-ft': XBTC_FT_SWAP_CONTRACT,
  'usda-nft': USDA_NFT_SWAP_CONTRACT,
  'usda-ft': USDA_FT_SWAP_CONTRACT,
};

export const feeOptionsByType = {
  'stx-ft': [
    { type: 'stx', title: '1% in STX', contract: STX_FT_SWAP_FEE_CONTRACT },
    { type: 'frie', title: '1% in FRIE', contract: STX_FT_SWAP_FRIE_FEE_CONTRACT },
  ],
  'stx-nft': [{ type: 'stx', title: '1% in STX', contract: STX_NFT_SWAP_FEE_CONTRACT }],
  'banana-nft': [
    { type: 'banana', title: '1% in $BANANA', contract: BANANA_NFT_SWAP_FEE_CONTRACT },
  ],
  'banana-ft': [{ type: 'banana', title: '1% in $BANANA', contract: BANANA_FT_SWAP_FEE_CONTRACT }],
  'satoshible-nft': [{ type: 'fixed', title: '5 STX', contract: SATOSHIBLE_SWAP_FEE_CONTRACT }],
  'satoshible-ft': [{ type: 'fixed', title: '5 STX', contract: SATOSHIBLE_SWAP_FEE_CONTRACT }],
  'usda-nft': [{ type: 'usda', title: '1% in USDA', contract: USDA_SWAP_FEE_CONTRACT }],
  'usda-ft': [{ type: 'usda', title: '1% in USDA', contract: USDA_SWAP_FEE_CONTRACT }],
  'xbtc-nft': [{ type: 'xbtc', title: '1% in xBTC', contract: XBTC_SWAP_FEE_CONTRACT }],
  'xbtc-ft': [{ type: 'xbtc', title: '1% in xBTC', contract: XBTC_SWAP_FEE_CONTRACT }],
};

export const STACK_API_URL = 'https://stacks-node-api.mainnet.stacks.co';
export const STACKS_API_WS_URL = 'wss://stacks-node-api.mainnet.stacks.co/';
export const STACKS_API_ACCOUNTS_URL = `${STACK_API_URL}/v2/accounts`;

export const NETWORK = new StacksMainnet({
  coreApiUrl: STACK_API_URL,
});

const basePath = STACK_API_URL;
const config = new Configuration({ basePath });
export const accountsApi = new AccountsApi(config);
export const smartContractsApi = new SmartContractsApi(config);
export const transactionsApi = new TransactionsApi(config);
export const infoApi = new InfoApi(config);
export const blocksApi = new BlocksApi(config);
export const namesApi = new NamesApi(config);
export const nonFungibleTokensApi = new NonFungibleTokensApi(config);
