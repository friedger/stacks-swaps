import { standardPrincipalCV, uintCV } from 'micro-stacks/clarity';
import {
  createAssetInfo,
  makeStandardNonFungiblePostCondition,
  NonFungibleConditionCode,
  PostConditionMode,
} from 'micro-stacks/transactions';
import { useContractCall, useStxAddresses } from '@micro-stacks/react';
import { BN } from 'bn.js';
import React, { useState } from 'react';
import { NETWORK } from '../../lib/constants';

export default function NFTTransfer({ userSession }) {
  const [nftContract, setNftContract] = useState();
  const [id, setId] = useState();
  const [recipient, setRecipient] = useState();
  const [status, setStatus] = useState();
  const [contractAddress, setContractAddress] = useState();
  const [contractName, setContractName] = useState();
  const [asset, setAsset] = useState();

  const { handleContractCall } = useContractCall({
    contractAddress,
    contractName,
    functionName: 'transfer',
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

  const { mainnet: userAddress } = useStxAddresses();

  return (
    <main className="container">
      <div>
        <h1>Transfer an NFT</h1>
        This will transfer an NFT
        <br />
        NFT contract + NFT name <br />
        <input className="form-control" onChange={e => setNftContract(e.target.value)} />
        <br />
        <button
          className="btn btn-outline-primary"
          onClick={() => {
            const [nftContractAddress, rest] = nftContract.split('.');
            const [nftContactName, nftAsset] = rest.split('::');
            setContractAddress(nftContractAddress);
            setContractName(nftContactName);
            setAsset(nftAsset);
          }}
        >
          Set NFT contract
        </button>
        <br />
        NFT id <br />
        <input className="form-control" onChange={e => setId(e.target.value)} inputMode="numeric" />
        Recipient address <br />
        <input className="form-control" onChange={e => setRecipient(e.target.value)} />
        <button
          className="btn btn-outline-primary"
          onClick={() => {
            const recipientCV = standardPrincipalCV(recipient);
            const idCV = uintCV(id);
            handleContractCall({
              functionArgs: [idCV, standardPrincipalCV(userAddress), recipientCV],
              postConditions: [
                makeStandardNonFungiblePostCondition(
                  userAddress,
                  NonFungibleConditionCode.DoesNotOwn,
                  createAssetInfo(contractAddress, contractName, asset),
                  idCV
                ),
              ],
            });
          }}
        >
          Transfer NFT contract (using Hiro Wallet Extension)
        </button>
        <br />
        {JSON.stringify(status)}
      </div>
    </main>
  );
}
