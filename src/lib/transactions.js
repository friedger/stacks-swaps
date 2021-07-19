import { serializeCV, hexToCV as stacksHexToCV } from '@stacks/transactions';
import {
  chainSuffix,
  mainnet,
  mocknet,
  STACKS_API_WS_URL,
  STACK_API_URL,
  testnet,
  transactionsApi,
} from './constants';
import { Storage } from '@stacks/storage';

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

export function cvToHex(value) {
  return `0x${serializeCV(value).toString('hex')}`;
}

export function hexToCV(hexString) {
  return stacksHexToCV(hexString);
}

export function txUrl(txId) {
  if (mocknet) {
    return `${STACK_API_URL}/extended/v1/tx/0x${txId}`;
  } else {
    return `https://explorer.stacks.co/txid/0x${txId}${chainSuffix}`;
  }
}

const indexFileName = mainnet
  ? 'index-mainnet.json'
  : testnet
  ? 'index-testnet.json'
  : 'index-mocknet.json';

export async function saveTxData(data, userSession) {
  console.log(JSON.stringify(data));
  const storage = new Storage({ userSession });
  let indexArray;
  try {
    const indexFile = await storage.getFile(indexFileName);
    indexArray = JSON.parse(indexFile);
  } catch (e) {
    console.log(e);
    indexArray = [];
  }
  indexArray.push(data.txId);
  await storage.putFile(indexFileName, JSON.stringify(indexArray));
  await storage.putFile(`txs/${data.txId}.json`, JSON.stringify({ data }));
}

export async function getTxs(userSession) {
  const storage = new Storage({ userSession });
  let indexArray;
  try {
    let indexFile;
    indexFile = await storage.getFile(indexFileName);
    indexArray = JSON.parse(indexFile);
    return Promise.all(
      indexArray.map(async txId => {
        return getTxWithStorage(txId, storage);
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
              }, https://explorer.stacks.co/txid/${
                tx.apiData.tx_id
              }, https://stacks-send-many.pages.dev/txid/${tx.apiData.tx_id}\n`
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
              send_many_url: `https://stacks-send-many.pages.dev/txid/${tx.apiData.tx_id}`,
            };
            return exportedTx;
          })
      );
    }, []);
  return txsAsJSON;
}

async function getTxWithStorage(txId, storage) {
  try {
    const txFile = await storage.getFile(`txs/${txId}.json`);
    let tx = JSON.parse(txFile);
    if (!tx.data) {
      tx = { data: { txId } };
    }
    if (!tx.apiData || tx.apiData.tx_status === 'pending') {
      tx = await createTxWithApiData(txId, tx, storage);
    }
    return tx;
  } catch (e) {
    console.log(e);
    let tx = { data: { txId } };
    tx = await createTxWithApiData(txId, tx, storage);
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
    const storage = new Storage({ userSession });
    return getTxWithStorage(txId, storage);
  } else {
    return getTxWithoutStorage(txId);
  }
}

async function createTxWithApiData(txId, tx, storage) {
  let eventOffset = 0;
  const offsetLimit = 400;
  let events = [];
  let apiData = undefined;
  while (!apiData || events.length < apiData.event_count) {
    eventOffset = events.length;
    apiData = await transactionsApi.getTransactionById({ txId, eventOffset, offsetLimit });
    console.log(eventOffset, apiData.events.length, apiData.event_count);
    events = events.concat(apiData.events);
    console.log(apiData.event_count);
  }
  const txWithApiData = { ...tx, apiData: { ...apiData, events } };
  if (storage && apiData.tx_status !== 'pending') {
    await storage.putFile(`txs/${txId}.json`, JSON.stringify(txWithApiData));
  }
  return txWithApiData;
}
