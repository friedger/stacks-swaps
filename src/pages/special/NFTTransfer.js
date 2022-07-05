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
        <hr />
        Select the NFT contract
        <br />
        Enter NFT contract, in a format like this:
        SPNWZ5V2TPWGQGVDR6T7B6RQ4XMGZ4PXTEE0VQ0S.nfts-for-peace::nfts-for-peace <br />
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
        <hr />
        Transfer NFT
        <pre>
          {contractAddress}.{contractName}
        </pre>
        NFT id <br />
        <input
          className="form-control"
          onChange={e => setId(e.target.value)}
          inputMode="numeric"
          placeholder="123"
        />
        Recipient address <br />
        <input
          className="form-control"
          onChange={e => setRecipient(e.target.value)}
          placeholder="SP1234..."
        />
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
