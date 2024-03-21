import {
  ClarityType,
  cvToHex,
  cvToString,
  hexToCV as stacksHexToCV,
  uintCV,
} from '@stacks/transactions';
import {
  accountsApi,
  chainSuffix,
  contracts,
  smartContractsApi,
  transactionsApi,
} from './constants';

export async function fetchSwapTxList(type) {
  const contract = contracts[type];
  const response = await accountsApi.getAccountTransactions({
    principal: `${contract.address}.${contract.name}`,
  });

  console.log(response);
  const result = response.results.filter(
    tx => tx.tx_status === 'success' && tx.tx_type === 'contract_call'
  );

  console.log(result);
  return result;
}

export async function fetchSwapsEntry(type, id) {
  const contract = contracts[type];
  const response = await smartContractsApi.getContractDataMapEntry({
    contractAddress: contract.address,
    contractName: contract.name,
    mapName: 'swaps',
    key: cvToHex(uintCV(id)),
  });
  if (response.data === '0x09') {
    return undefined;
  } else {
    return hexToCV(response.data).value;
  }
}

export function resultToStatus(result) {
  if (result && !result.error && result.startsWith('"') && result.length === 66) {
    const txId = result.substr(1, 64);
    return txIdToStatus(txId);
  } else if (result && result.error) {
    return JSON.stringify(result);
  } else {
    return result.toString();
  }
}

export function txIdToStatus(txId) {
  return (
    <>
      Check transaction status: <a href={txUrl(txId)}>{txId}</a>
    </>
  );
}

export function hexToCV(hexString) {
  return stacksHexToCV(hexString);
}

export function txUrl(txId) {
  return `https://explorer.stacks.co/txid/0x${txId}${chainSuffix}`;
}

const indexFileName = 'index-mainnet.json';

export async function saveTxData(data) {
  console.log(JSON.stringify(data));
  let indexArray;
  try {
    const indexFile = await getFile(indexFileName);
    indexArray = JSON.parse(indexFile);
  } catch (e) {
    console.log(e);
    indexArray = [];
  }
  indexArray.push(data.txId);
  await putFile(indexFileName, JSON.stringify(indexArray));
  await putFile(`txs/${data.txId}.json`, JSON.stringify({ data }));
}

export async function getTxs() {
  let indexArray;
  try {
    let indexFile;
    indexFile = await getFile(indexFileName);
    indexArray = JSON.parse(indexFile);
    return Promise.all(
      indexArray.map(async txId => {
        return getTxWithStorage(txId);
      })
    );
  } catch (e) {
    console.log(e);
    return [];
  }
}

export async function getTxsAsCSV(userSession, filter) {
  const txs = await getTxs(userSession);
  const txsAsCSV = txs
    .filter(tx => tx.apiData && tx.apiData.tx_status === 'success')
    .filter(filter)
    .reduce((result, tx) => {
      return (
        result +
        tx.apiData.events
          .filter(e => e.event_type === 'stx_asset')
          .reduce((eventResult, e) => {
            return (
              eventResult +
              `${e.asset.recipient}, ${e.asset.amount / 1000000}, ${
                tx.apiData.burn_block_time_iso
              }, https://explorer.stacks.co/txid/${tx.apiData.tx_id}, https://sendstx.com/txid/${
                tx.apiData.tx_id
              }\n`
            );
          }, '')
      );
    }, 'recipient, amount, timestamp, explorer_url, send_many_url\n');
  return txsAsCSV;
}

export async function getTxsAsJSON(userSession, filter) {
  const txs = await getTxs(userSession);
  const txsAsJSON = txs
    .filter(tx => tx.apiData && tx.apiData.tx_status === 'success')
    .filter(filter)
    .reduce((result, tx) => {
      return result.concat(
        tx.apiData.events
          .filter(e => e.event_type === 'stx_asset')
          .map(e => {
            const exportedTx = {
              recipient: e.asset.recipient,
              amount: e.asset.amount / 1000000,
              timestamp: tx.apiData.burn_block_time_iso,
              explorer_url: `https://explorer.stacks.co/txid/${tx.apiData.tx_id}`,
              send_many_url: `https://sendstx.com/txid/${tx.apiData.tx_id}`,
            };
            return exportedTx;
          })
      );
    }, []);
  return txsAsJSON;
}

async function getTxWithStorage(txId) {
  try {
    const txFile = await getFile(`txs/${txId}.json`);
    let tx = JSON.parse(txFile);
    if (!tx.data) {
      tx = { data: { txId } };
    }
    if (!tx.apiData || tx.apiData.tx_status === 'pending') {
      tx = await createTxWithApiData(txId, tx);
    }
    return tx;
  } catch (e) {
    console.log(e);
    let tx = { data: { txId } };
    tx = await createTxWithApiData(txId, tx);
    return tx;
  }
}

async function getTxWithoutStorage(txId) {
  try {
    return await createTxWithApiData(txId, {});
  } catch (e) {
    console.log(e);
    return {};
  }
}

export async function getTx(txId, userSession) {
  if (userSession && userSession.isUserSignedIn()) {
    return getTxWithStorage(txId);
  } else {
    return getTxWithoutStorage(txId);
  }
}

async function createTxWithApiData(txId, tx) {
  let eventOffset = 0;
  const offsetLimit = 400;
  let events = [];
  let apiData = undefined;
  while (!apiData || events.length < apiData.event_count) {
    eventOffset = events.length;
    apiData = await transactionsApi.getTransactionById({
      txId: `0x${txId}`,
      eventOffset,
      offsetLimit,
    });
    console.log(txId, apiData, eventOffset, apiData.events, apiData.event_count);
    events = events.concat(apiData.events);
    console.log(apiData.event_count);
  }
  const txWithApiData = { ...tx, apiData: { ...apiData, events } };
  if (apiData.tx_status !== 'pending') {
    await putFile(`txs/${txId}.json`, JSON.stringify(txWithApiData));
  }
  return txWithApiData;
}

export function optionalCVToString(cv) {
  if (cv.type === ClarityType.OptionalNone) {
    return '';
  } else {
    return cvToString(cv.value);
  }
}
