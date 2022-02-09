import { uintCV } from 'micro-stacks/clarity';
import {
  createAssetInfo,
  FungibleConditionCode,
  makeContractNonFungiblePostCondition,
  makeContractSTXPostCondition,
  NonFungibleConditionCode,
  PostConditionMode,
} from 'micro-stacks/transactions';
import { useContractCall } from '@micro-stacks/react';
import { BN } from 'bn.js';
import React, { useState } from 'react';
import { NETWORK } from '../../lib/constants';

export default function UnlistStacksPunks({ userSession }) {
  const [id, setId] = useState();
  const [status, setStatus] = useState();

  const { handleContractCall } = useContractCall({
    contractAddress: 'SPJW1XE278YMCEYMXB8ZFGJMH8ZVAAEDP2S2PJYG',
    contractName: 'stacks-punks-market',
    functionName: 'unlist-punk',
    postConditionMode: PostConditionMode.Deny,
    userSession,
    network: NETWORK,
    onFinish: result => {
      setStatus(result);
    },
    onCancel: () => {
      setStatus('Tx not sent.');
    },
  });

  return (
    <main className="container">
      <div>
        <h1>Unlist Stacks Punks</h1>
        This will unlist the NFT with the id:
        <br />
        <input className="form-control" onChange={e => setId(e.target.value)} inputMode="numeric" />
        <br />
        <button
          className="btn btn-outline-primary"
          disabled={!userSession || !userSession.isUserSignedIn()}
          onClick={() => {
            const idCV = uintCV(id);
            handleContractCall({
              functionArgs: [idCV],
              postConditions: [
                makeContractSTXPostCondition(
                  'SPJW1XE278YMCEYMXB8ZFGJMH8ZVAAEDP2S2PJYG',
                  'stacks-punks-market',
                  FungibleConditionCode.GreaterEqual,
                  new BN(0)
                ),
                makeContractNonFungiblePostCondition(
                  'SPJW1XE278YMCEYMXB8ZFGJMH8ZVAAEDP2S2PJYG',
                  'stacks-punks-market',
                  NonFungibleConditionCode.DoesNotOwn,
                  createAssetInfo(
                    'SPJW1XE278YMCEYMXB8ZFGJMH8ZVAAEDP2S2PJYG',
                    'stacks-punks-v3',
                    'stacks-punks'
                  ),
                  idCV
                ),
              ],
            });
          }}
        >
          Unlist
        </button>
        <br />
        {JSON.stringify(status)}
      </div>
    </main>
  );
}
