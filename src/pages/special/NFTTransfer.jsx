import { standardPrincipalCV, uintCV } from 'micro-stacks/clarity';
import {
  createAssetInfo,
  makeStandardNonFungiblePostCondition,
  NonFungibleConditionCode,
  PostConditionMode,
} from 'micro-stacks/transactions';
import { useAccount, useAuth, useOpenContractCall } from '@micro-stacks/react';
import { useState } from 'react';
import { useStxAddresses } from '../../lib/hooks';
import GetStartedButton from '../../components/GetStartedButton';

export default function NFTTransfer({ userSession }) {
  const [nftContract, setNftContract] = useState();
  const [id, setId] = useState();
  const [recipient, setRecipient] = useState();
  const [status, setStatus] = useState();
  const [contractAddress, setContractAddress] = useState();
  const [contractName, setContractName] = useState();
  const [asset, setAsset] = useState();

  const { stxAddress } = useAccount();
  const { authenticate } = useAuth();

  const { openContractCall } = useOpenContractCall({
    onFinish: result => {
      setStatus(result);
    },
    onCancel: () => {
      setStatus('Tx not sent.');
    },
  });

  const { ownerStxAddress } = useStxAddresses();

  return (
    <main className="container">
      <div>
        <h1>Transfer an NFT</h1>
        Here you can transfer any NFTs using the asset identifier
        <br />
        {stxAddress ? (
          <>
            <hr />
            1. Select the NFT contract
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
            2. Transfer NFT
            <br />
            {contractAddress && contractName ? (
              <pre>
                {contractAddress}.{contractName}
              </pre>
            ) : (
              <>Enter asset identifier first</>
            )}
            } NFT id <br />
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
              onClick={async () => {
                const recipientCV = standardPrincipalCV(recipient);
                const idCV = uintCV(id);
                await openContractCall({
                  contractAddress,
                  contractName,
                  functionName: 'transfer',
                  functionArgs: [idCV, standardPrincipalCV(ownerStxAddress), recipientCV],
                  postConditions: [],
                  postConditionMode: PostConditionMode.Allow,
                  sponsored: false,
                });
              }}
            >
              Transfer NFT contract (using Hiro Wallet Extension)
            </button>
            <br />
            {JSON.stringify(status)}
          </>
        ) : (
          <GetStartedButton handleSignIn={authenticate} />
        )}
      </div>
    </main>
  );
}
