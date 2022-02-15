import { bufferCVFromString, ClarityType, cvToString } from 'micro-stacks/clarity';
import {
  createStacksPrivateKey,
  AddressVersion,
  AddressHashMode,
  callReadOnlyFunction,
  addressFromPublicKeys,
  getPublicKeyFromStacksPrivateKey,
} from 'micro-stacks/transactions';
import {
  accountsApi,
  BNS_CONTRACT_NAME,
  GENESIS_CONTRACT_ADDRESS,
  NETWORK,
  STACKS_API_ACCOUNTS_URL,
} from './constants';

export function getStacksAccount(appPrivateKey) {
  const privateKey = createStacksPrivateKey(appPrivateKey);
  const publicKey = getPublicKeyFromStacksPrivateKey(privateKey);
  const address = addressFromPublicKeys(
    AddressVersion.MainnetSingleSig,
    AddressHashMode.SerializeP2PKH,
    1,
    [publicKey]
  );
  return { privateKey, address };
}

export async function resolveBNS(username) {
  const parts = username ? username.split('.') : [];
  if (parts.length === 2) {
    const result = await callReadOnlyFunction({
      contractAddress: GENESIS_CONTRACT_ADDRESS,
      contractName: BNS_CONTRACT_NAME,
      functionName: 'name-resolve',
      functionArgs: [bufferCVFromString(parts[1]), bufferCVFromString(parts[0])],
      network: NETWORK,
      senderAddress: GENESIS_CONTRACT_ADDRESS,
    }).catch(e => {
      return { type: ClarityType.ResponseErr };
    });
    if (result.type === ClarityType.ResponseOk) {
      return cvToString(result.value.data.owner);
    } else {
      return username;
    }
  } else {
    return username;
  }
}

/**
 * Uses the AccountsApi of the stacks blockchain api client library,
 * returns the stacks balance object with property `balance` in decimal.
 */
export function fetchAccount(addressAsString) {
  console.log(`Checking account "${addressAsString}"`);
  if (addressAsString) {
    return accountsApi
      .getAccountBalance({ principal: addressAsString })
      .then(response => response.stx);
  } else {
    return Promise.reject('addressAsString not defined');
  }
}

/**
 * Uses the RCP api of the stacks node directly,
 * returns the json object with property `balance` in hex.
 */
export function fetchAccount2(addressAsString) {
  console.log('Checking account');
  const balanceUrl = `${STACKS_API_ACCOUNTS_URL}/${addressAsString}`;
  return fetch(balanceUrl).then(r => {
    console.log({ r });
    return r.json();
  });
}
