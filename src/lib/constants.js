import {
  TransactionsApi,
  SmartContractsApi,
  AccountsApi,
  Configuration,
  InfoApi,
} from '@stacks/blockchain-api-client';
import { StacksMainnet } from '@stacks/network';

export const mainnet = window.location.search.includes('chain=mainnet');

export const chainSuffix = '?chain=mainnet';

export const CONTRACT_ADDRESS = 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9';
export const GENESIS_CONTRACT_ADDRESS = 'SP000000000000000000002Q6VF78';

export const BNS_CONTRACT_NAME = 'bns';

export const CLARITY_BITCOIN_CONTRACT_NAME = mainnet
  ? 'clarity-bitcoin-lib-v1'
  : 'clarity-bitcoin-lib-v1';

export const BTC_NFT_SWAP_NAME = 'btc-nft-swap-v1';

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
