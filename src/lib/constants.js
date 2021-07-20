import {
  TransactionsApi,
  SmartContractsApi,
  AccountsApi,
  Configuration,
  InfoApi,
} from '@stacks/blockchain-api-client';
import { StacksTestnet, StacksMainnet } from '@stacks/network';

export const mainnet = window.location.search.includes('chain=mainnet');
export const localMocknet = !mainnet && window.location.search.includes('mocknet=local');
export const testnet =
  (!mainnet && !localMocknet) || window.location.search.includes('chain=testnet');

export const chainSuffix = `?chain=${mainnet ? 'mainnet' : testnet ? 'testnet' : 'mocknet'}`;
export const localNode = localMocknet;
export const localAuth = false;
export const mocknet = localMocknet;

console.log({ localNode, localAuth, mocknet, testnet, mainnet });

export const CONTRACT_ADDRESS = mocknet
  ? 'ST3EQ88S02BXXD0T5ZVT3KW947CRMQ1C6DMQY8H19' //ADDR1 from Stacks.toml
  : testnet
  ? 'ST2PABAF9FTAJYNFZH93XENAJ8FVY99RRM4DF2YCW'
  : 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9';
export const GENESIS_CONTRACT_ADDRESS = mainnet
  ? 'SP000000000000000000002Q6VF78'
  : 'ST000000000000000000002AMW42H';

export const BNS_CONTRACT_NAME = 'bns';

export const CLARITY_BITCOIN_CONTRACT_NAME = mainnet
  ? 'clarity-bitcoin-lib-v1'
  : 'clarity-bitcoin-lib-v1';

export const BTC_NFT_SWAP_NAME = mocknet
  ? 'btc-nft-swap'
  : testnet
  ? 'btc-nft-swap-v1'
  : 'btc-nft-swap-v1';

// TODO: add Freehold API endpoint?
export const STACK_API_URL = localNode
  ? 'http://localhost:3999'
  : mainnet
  ? 'https://stacks-node-api.mainnet.stacks.co'
  : 'https://stacks-node-api.testnet.stacks.co';
export const STACKS_API_WS_URL = localNode
  ? 'ws:localhost:3999/'
  : mainnet
  ? 'wss://stacks-node-api.mainnet.stacks.co/'
  : 'wss://stacks-node-api.testnet.stacks.co/';
export const STACKS_API_ACCOUNTS_URL = `${STACK_API_URL}/v2/accounts`;

export const NETWORK = mainnet ? new StacksMainnet() : new StacksTestnet();
NETWORK.coreApiUrl = STACK_API_URL;

const basePath = STACK_API_URL;
const config = new Configuration({ basePath });
export const accountsApi = new AccountsApi(config);
export const smartContractsApi = new SmartContractsApi(config);
export const transactionsApi = new TransactionsApi(config);
export const infoApi = new InfoApi(config);
