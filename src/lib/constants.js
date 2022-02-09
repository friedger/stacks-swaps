import {
  TransactionsApi,
  SmartContractsApi,
  AccountsApi,
  Configuration,
  InfoApi,
  BlocksApi,
} from '@stacks/blockchain-api-client';
import { StacksMainnet } from '@stacks/network';

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
  name: 'btc-stx-swap-v1',
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

export const STX_NFT_SWAP_CONTRACT = {
  address: 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9',
  name: 'stx-nft-swap-v1',
};

export const STX_NFT_SWAP_FEE_CONTRACT = {
  address: 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9',
  name: 'stx-nft-fixed-fees',
};

export const BANANA_NFT_SWAP_CONTRACT = {
  address: 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9',
  name: 'banana-nft-swap-v1',
};

export const BANANA_NFT_SWAP_FEE_CONTRACT = {
  address: 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9',
  name: 'banana-nft-swap-v1-fixed-fees',
  ft: {
    address: 'SP2KAF9RF86PVX3NEE27DFV1CQX0T4WGR41X3S45C',
    name: 'bitcoin-monkeys-bananas',
    assetName: 'BANANA',
  },
};

export const ftFeeContracts = {
  stx: STX_FT_SWAP_FEE_CONTRACT,
  fpwr: STX_FT_SWAP_FPWR_FEE_CONTRACT,
  frie: {
    address: 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9',
    name: 'stx-ft-swap-v1-fixed-frie-fees',
    ft: {
      address: 'SPN4Y5QPGQA8882ZXW90ADC2DHYXMSTN8VAR8C3X',
      name: 'friedger-token-v1',
      assetName: 'friedger',
    },
  },

  mia: {
    address: 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9',
    name: 'cycle-2-hodl-mia-fees',
    ft: {
      address: 'SP466FNC0P7JWTNM2R9T199QRZN1MYEDTAR0KP27',
      name: 'miamicoin-token',
      assetName: 'miamicoin',
    },
  },
  stxnft: STX_NFT_SWAP_FEE_CONTRACT,
};

export const nftFeeContracts = {
  stx: STX_NFT_SWAP_FEE_CONTRACT,
  mia: {
    address: 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9',
    name: 'cycle-2-hodl-mia-fees',
    ft: {
      address: 'SP466FNC0P7JWTNM2R9T199QRZN1MYEDTAR0KP27',
      name: 'miamicoin-token',
      assetName: 'miamicoin',
    },
  },

  banana: BANANA_NFT_SWAP_FEE_CONTRACT,
};

export const contracts = {
  nft: BTC_NFT_SWAP_CONTRACT,
  ft: BTC_FT_SWAP_CONTRACT,
  stx: BTC_STX_SWAP_CONTRACT,
  'stx-ft': STX_FT_SWAP_CONTRACT,
  'stx-nft': STX_NFT_SWAP_CONTRACT,
  'banana-nft': BANANA_NFT_SWAP_CONTRACT,
};

// TODO: add Freehold API endpoint?
export const STACK_API_URL = 'https://stacks-node-api.mainnet.stacks.co';
export const STACKS_API_WS_URL = 'wss://stacks-node-api.mainnet.stacks.co/';
export const STACKS_API_ACCOUNTS_URL = `${STACK_API_URL}/v2/accounts`;

export const NETWORK = new StacksMainnet();
NETWORK.coreApiUrl = STACK_API_URL;

const basePath = STACK_API_URL;
const config = new Configuration({ basePath });
export const accountsApi = new AccountsApi(config);
export const smartContractsApi = new SmartContractsApi(config);
export const transactionsApi = new TransactionsApi(config);
export const infoApi = new InfoApi(config);
export const blocksApi = new BlocksApi(config);
