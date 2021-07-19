import { ClarityType, cvToHex, cvToString, hexToCV, tupleCV, uintCV } from '@stacks/transactions';
import { standardPrincipalCV, callReadOnlyFunction } from '@stacks/transactions';
import {
  accountsApi,
  CITYCOIN_CONTRACT_NAME,
  CONTRACT_ADDRESS,
  GENESIS_CONTRACT_ADDRESS,
  infoApi,
  NETWORK,
  smartContractsApi,
} from './constants';

export async function getCityCoinBalance(address) {
  const result = await callReadOnlyFunction({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CITYCOIN_CONTRACT_NAME,
    functionName: 'get-balance',
    functionArgs: [standardPrincipalCV(address)],
    network: NETWORK,
    senderAddress: address,
  });
  return result.value.value.toNumber();
}

export async function getMiningActivationStatus() {
  const result = await callReadOnlyFunction({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CITYCOIN_CONTRACT_NAME,
    functionName: 'get-mining-activation-status',
    functionArgs: [],
    network: NETWORK,
    senderAddress: GENESIS_CONTRACT_ADDRESS,
  });
  return result.type === ClarityType.BoolTrue;
}

export async function getRegisteredMinerId(address) {
  const result = await callReadOnlyFunction({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CITYCOIN_CONTRACT_NAME,
    functionName: 'get-miner-id',
    functionArgs: [standardPrincipalCV(address)],
    network: NETWORK,
    senderAddress: address,
  });
  if (result.type === ClarityType.OptionalSome) {
    return result.value.value.toNumber();
  } else {
    return undefined;
  }
}

export async function getRegisteredMinerCount() {
  const result = await callReadOnlyFunction({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CITYCOIN_CONTRACT_NAME,
    functionName: 'get-registered-miners-nonce',
    functionArgs: [],
    network: NETWORK,
    senderAddress: GENESIS_CONTRACT_ADDRESS,
  });
  return result.value.toNumber();
}

export async function getRegisteredMinersThreshold() {
  const result = await callReadOnlyFunction({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CITYCOIN_CONTRACT_NAME,
    functionName: 'get-registered-miners-threshold',
    functionArgs: [],
    network: NETWORK,
    senderAddress: GENESIS_CONTRACT_ADDRESS,
  });
  return result.value.toNumber();
}
export async function getCoinbase(blockHeight) {
  const result = await callReadOnlyFunction({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CITYCOIN_CONTRACT_NAME,
    functionName: 'get-coinbase-amount',
    functionArgs: [uintCV(blockHeight)],
    senderAddress: CONTRACT_ADDRESS,
    network: NETWORK,
  });
  return result.value.toNumber();
}

export async function getMiningDetails(stxAddress) {
  const response = await accountsApi.getAccountTransactions({ principal: stxAddress });
  const txs = response.results.filter(
    tx =>
      tx.tx_status === 'success' &&
      tx.tx_type === 'contract_call' &&
      (tx.contract_call.function_name === 'mine-tokens' ||
        tx.contract_call.function_name === 'mine-tokens-over-30-blocks') &&
      tx.contract_call.contract_id === `${CONTRACT_ADDRESS}.${CITYCOIN_CONTRACT_NAME}`
  );
  const minerId = await getRegisteredMinerId(stxAddress);
  console.log({ minerId });
  const winningDetails = [];
  console.log(txs);
  for (let tx of txs) {
    if (tx.contract_call.function_name === 'mine-tokens-over-30-blocks') {
      for (let i = 29; i >= 0; i--) {
        winningDetails.push(await getWinningDetailsFor(tx.block_height + i, minerId));
      }
    } else {
      winningDetails.push(await getWinningDetailsFor(tx.block_height, minerId));
    }
  }
  return { count: winningDetails.length, winningDetails };
}

async function getWinningDetailsFor(blockHeight, minerId) {
  console.log({ blockHeight });
  const randomSample = await callReadOnlyFunction({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CITYCOIN_CONTRACT_NAME,
    functionName: 'get-random-uint-at-block',
    functionArgs: [uintCV(blockHeight + 100)],
    senderAddress: CONTRACT_ADDRESS,
    network: NETWORK,
  });
  console.log({ randomSample: cvToString(randomSample) });

  if (randomSample.type === ClarityType.OptionalSome) {
    const winningAmount = await getWinningAmount(blockHeight, randomSample.value.value);

    const minedBlock = await smartContractsApi.getContractDataMapEntry({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CITYCOIN_CONTRACT_NAME,
      mapName: 'mined-blocks',
      key: cvToHex(tupleCV({ 'stacks-block-height': uintCV(blockHeight) })),
    });
    const minedBlockCV = hexToCV(minedBlock.data);
    console.log({ minedBlockCV });
    const minersCount = minedBlockCV.value.data['miners-count'].value.toNumber();
    const claimed = minedBlockCV.value.data['claimed'].type === ClarityType.BoolTrue;

    console.log({ minersCount });
    let idx = 1;
    let sum = 0;
    let winner;
    while (!winner && idx < 10) {
      console.log({ idx });
      const minerOfBlock = await smartContractsApi.getContractDataMapEntry({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CITYCOIN_CONTRACT_NAME,
        mapName: 'blocks-miners',
        key: cvToHex(tupleCV({ 'stacks-block-height': uintCV(blockHeight), idx: uintCV(idx) })),
      });
      const minerOfBlockCV = hexToCV(minerOfBlock.data);
      console.log({ minerOfBlockCV: cvToString(minerOfBlockCV) });
      // add commit to total
      const nextSum = sum + minerOfBlockCV.value.data.ustx.value.toNumber();
      // check total for winning amount
      if (sum <= winningAmount && nextSum > winningAmount) {
        winner = minerOfBlockCV;
      }
      idx++;
    }
    if (winner.value.data['miner-id'].value.toNumber() === minerId) {
      const coinbase = await getCoinbase(blockHeight);
      console.log({ coinbase });
      return { blockHeight, winner, coinbase, claimed };
    } else {
      return { blockHeight, lost: true, claimed };
    }
  } else {
    return { blockHeight };
  }
}

async function getWinningAmount(blockHeight, randomSample) {
  const blockCommit = await callReadOnlyFunction({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CITYCOIN_CONTRACT_NAME,
    functionName: 'get-block-commit-total',
    functionArgs: [uintCV(blockHeight)],
    senderAddress: CONTRACT_ADDRESS,
    network: NETWORK,
  });

  console.log({ blockCommit: cvToString(blockCommit) });
  const winningAmount = randomSample.mod(blockCommit.value).toNumber();
  console.log({ winningAmount });
  return winningAmount;
}

export async function getPoxLiteInfo() {
  const poxLiteInfo = await callReadOnlyFunction({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CITYCOIN_CONTRACT_NAME,
    functionName: 'get-pox-lite-info',
    functionArgs: [],
    senderAddress: CONTRACT_ADDRESS,
    network: NETWORK,
  });
  return poxLiteInfo;
}

export async function getAvailableRewards(stxAddress, cycleId) {
  const info = await infoApi.getCoreApiInfo();
  const stackingReward = await callReadOnlyFunction({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CITYCOIN_CONTRACT_NAME,
    functionName: 'get-entitled-stacking-reward',
    functionArgs: [
      standardPrincipalCV(stxAddress),
      uintCV(cycleId),
      uintCV(info.stacks_tip_height),
    ],
    senderAddress: stxAddress,
    network: NETWORK,
  });
  const cityCoinClaim = await callReadOnlyFunction({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CITYCOIN_CONTRACT_NAME,
    functionName: 'get-stacked-in-cycle',
    functionArgs: [standardPrincipalCV(stxAddress), uintCV(cycleId)],
    senderAddress: stxAddress,
    network: NETWORK,
  });
  const result = {
    amountSTX: stackingReward.value.toNumber(),
    amountCC: cityCoinClaim.value.toNumber(),
    cycleId,
    stxAddress,
  };
  console.log({ result });
  return result;
}

export async function getStackingState(stxAddress) {
  const response = await accountsApi.getAccountTransactions({ principal: stxAddress });
  const txs = response.results.filter(
    tx =>
      tx.tx_status === 'success' &&
      tx.tx_type === 'contract_call' &&
      tx.contract_call.function_name === 'stack-tokens' &&
      tx.contract_call.contract_id === `${CONTRACT_ADDRESS}.${CITYCOIN_CONTRACT_NAME}`
  );
  const state = [];
  for (let tx of txs) {
    // TODO use better tx result like this:
    /*
    const firstCycle = hexToCV(tx.tx_result).data.first.value.toNumber();
    const lastCycle = hexToCV(tx.tx_result).data.last.value.toNumber();
    */
    const firstCycle = Math.floor(
      (hexToCV(tx.contract_call.function_args[1].hex).value.toNumber() - 14726) / 50
    );
    const lockPeriod = hexToCV(tx.contract_call.function_args[2].hex).value.toNumber();
    const lastCycle = firstCycle + lockPeriod;

    for (let i = lastCycle; i >= firstCycle; i--) {
      state.push(await getAvailableRewards(stxAddress, i));
    }
  }
  return state;
}
