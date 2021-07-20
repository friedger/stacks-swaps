import React, { useRef, useState } from 'react';
import { useConnect } from '@stacks/connect-react';
import { BTC_NFT_SWAP_NAME, CONTRACT_ADDRESS, NETWORK } from '../lib/constants';
import { TxStatus } from './TxStatus';
import {
  AnchorMode,
  bufferCV,
  contractPrincipalCV,
  createAssetInfo,
  makeStandardNonFungiblePostCondition,
  NonFungibleConditionCode,
  PostConditionMode,
  standardPrincipalCV,
  uintCV,
} from '@stacks/transactions';
import { decodeBtcAddress } from '@stacks/stacking';

// TODO: consider state for when stacking is active

export function SwapCreateNFT({ ownerStxAddress }) {
  const amountSatsRef = useRef();
  const btcRecipientRef = useRef();
  const nftIdRef = useRef();
  const nftRecipientRef = useRef();
  const nftTraitRef = useRef();
  const [txId, setTxId] = useState();
  const [loading, setLoading] = useState();
  const { doContractCall } = useConnect();

  const createAction = async () => {
    setLoading(true);
    if (amountSatsRef.current.value === '' || btcRecipientRef.current.value === '') {
      console.log('positive numbers required to stack');
      setLoading(false);
    } else {
      const satsCV = uintCV(
        Math.floor(parseFloat(amountSatsRef.current.value.trim()) * 100_000_000)
      );
      const btcReceiverCV = bufferCV(
        Buffer.concat([
          Buffer.from('76a914', 'hex'),
          decodeBtcAddress(btcRecipientRef.current.value.trim()).data,
          Buffer.from('88ac', 'hex'),
        ])
      );
      const nftIdCV = uintCV(nftIdRef.current.value.trim());
      const nftReceiverCV = standardPrincipalCV(nftRecipientRef.current.value.trim());
      const [nftContractAddress, nftTail] = nftTraitRef.current.value.trim().split('.');
      const [nftContractName, nftAssetName] = nftTail.split('::');
      const nftCV = contractPrincipalCV(nftContractAddress, nftContractName);
      await doContractCall({
        contractAddress: CONTRACT_ADDRESS,
        contractName: BTC_NFT_SWAP_NAME,
        functionName: 'create-swap',
        functionArgs: [satsCV, btcReceiverCV, nftIdCV, nftReceiverCV, nftCV],
        network: NETWORK,
        anchorMode: AnchorMode.Any,
        postConditionMode: PostConditionMode.Deny,
        postConditions: [
          makeStandardNonFungiblePostCondition(
            ownerStxAddress,
            NonFungibleConditionCode.DoesNotOwn,
            createAssetInfo(nftContractAddress, nftContractName, nftAssetName),
            nftIdCV
          ),
        ],

        onCancel: () => {
          setLoading(false);
        },
        onFinish: result => {
          setLoading(false);
          setTxId(result.txId);
        },
      });
    }
  };

  return (
    <>
      <h3>Create Swap BTC-NFT</h3>
      <p>For a swap of Bitcoins and an NFT on Stacks, the NFT has to comply with SIP-9.</p>
      <form>
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            ref={nftTraitRef}
            aria-label="NFT asset"
            placeholder="NFT asset"
            required
            minLength="1"
          />
        </div>
        <div className="input-group mb-3">
          <input
            type="number"
            className="form-control"
            ref={amountSatsRef}
            aria-label="Price for NFT in Bitcoin"
            placeholder="Price for NFT in Bitcoin"
            required
            minLength="1"
          />
          <div className="input-group-append">
            <span className="input-group-text">$BTC</span>
          </div>
        </div>
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            ref={btcRecipientRef}
            aria-label="Bitcoin recipient address"
            placeholder="Bitcoin recipient address"
            required
            max="40"
            minLength="1"
          />
        </div>
        <div className="input-group mb-3">
          <input
            type="number"
            className="form-control"
            ref={nftIdRef}
            aria-label="ID of NFT"
            placeholder="ID of NFT"
            required
            minLength="1"
          />
        </div>
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            ref={nftRecipientRef}
            aria-label="NFT receiver Stacks address"
            placeholder="NFT receiver Stacks address"
            required
            minLength="1"
          />
        </div>
        <button className="btn btn-block btn-primary" type="button" onClick={createAction}>
          <div
            role="status"
            className={`${
              loading ? '' : 'd-none'
            } spinner-border spinner-border-sm text-info align-text-top mr-2`}
          />
          Create Swap
        </button>
      </form>
      {txId && <TxStatus txId={txId} />}
    </>
  );
}
