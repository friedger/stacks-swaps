import { useConnect } from '@stacks/connect-react';
import {
  createAssetInfo,
  FungibleConditionCode,
  makeContractNonFungiblePostCondition,
  makeContractSTXPostCondition,
  NonFungibleConditionCode,
  PostConditionMode,
  uintCV,
} from '@stacks/transactions';
import { BN } from 'bn.js';
import React, { useEffect, useState } from 'react';
import { NETWORK } from '../lib/constants';

export default function UnlistStacksPunks({ userSession }) {
  const [id, setId] = useState();
  const [status, setStatus] = useState();

  const { doContractCall } = useConnect();

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
            doContractCall({
              contractAddress: 'SPJW1XE278YMCEYMXB8ZFGJMH8ZVAAEDP2S2PJYG',
              contractName: 'stacks-punks-market',
              functionName: 'unlist-punk',
              functionArgs: [idCV],
              postConditionMode: PostConditionMode.Deny,
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
              userSession,
              network: NETWORK,
              onFinish: result => {
                setStatus(result);
              },
              onCancel: () => {
                setStatus('Tx not sent.');
              },
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
