import React, { useRef, useState } from 'react';
import { useConnect } from '@stacks/connect-react';
import { contracts, NETWORK } from '../lib/constants';
import { TxStatus } from './TxStatus';
import {
  AnchorMode,
  bufferCV,
  contractPrincipalCV,
  createAssetInfo,
  FungibleConditionCode,
  makeStandardFungiblePostCondition,
  makeStandardNonFungiblePostCondition,
  makeStandardSTXPostCondition,
  NonFungibleConditionCode,
  PostConditionMode,
  someCV,
  standardPrincipalCV,
  uintCV,
} from '@stacks/transactions';
import { decodeBtcAddress } from '@stacks/stacking';

export function SwapCreate({ ownerStxAddress, type, trait }) {
  const amountSatsRef = useRef();
  const btcRecipientRef = useRef();
  const nftIdRef = useRef();
  const amountRef = useRef();
  const assetRecipientRef = useRef();
  const traitRef = useRef();
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
      const contract = contracts[type];
      let functionArgs;
      let postConditions;
      switch (type) {
        case 'nft':
          const nftIdCV = uintCV(nftIdRef.current.value.trim());
          const nftReceiverCV = standardPrincipalCV(assetRecipientRef.current.value.trim());
          const [nftContractAddress, nftTail] = traitRef.current.value.trim().split('.');
          const [nftContractName, nftAssetName] = nftTail.split('::');
          const nftCV = contractPrincipalCV(nftContractAddress, nftContractName);
          functionArgs = [satsCV, btcReceiverCV, nftIdCV, nftReceiverCV, nftCV];
          postConditions = [
            makeStandardNonFungiblePostCondition(
              ownerStxAddress,
              NonFungibleConditionCode.DoesNotOwn,
              createAssetInfo(nftContractAddress, nftContractName, nftAssetName),
              nftIdCV
            ),
          ];
          break;
        case 'ft':
          const ftAmountCV = uintCV(amountRef.current.value.trim());
          const ftReceiverCV = someCV(standardPrincipalCV(assetRecipientRef.current.value.trim()));
          const [ftContractAddress, ftTail] = traitRef.current.value.trim().split('.');
          const [ftContractName, ftAssetName] = ftTail.split('::');
          const ftCV = contractPrincipalCV(ftContractAddress, ftContractName);
          functionArgs = [satsCV, btcReceiverCV, ftAmountCV, ftReceiverCV, ftCV];
          postConditions = [
            makeStandardFungiblePostCondition(
              ownerStxAddress,
              FungibleConditionCode.Equal,
              ftAmountCV.value,
              createAssetInfo(ftContractAddress, ftContractName, ftAssetName)
            ),
          ];
          break;
        case 'stx':
          const stxAmountCV = uintCV(amountRef.current.value.trim());
          const stxReceiverCV = someCV(standardPrincipalCV(assetRecipientRef.current.value.trim()));
          functionArgs = [satsCV, btcReceiverCV, stxAmountCV, stxReceiverCV];
          postConditions = [
            makeStandardSTXPostCondition(
              ownerStxAddress,
              FungibleConditionCode.Equal,
              stxAmountCV.value
            ),
          ];
          break;

        default:
          break;
      }
      await doContractCall({
        contractAddress: contract.address,
        contractName: contract.name,
        functionName: 'create-swap',
        functionArgs,
        network: NETWORK,
        anchorMode: AnchorMode.Any,
        postConditionMode: PostConditionMode.Deny,
        postConditions,

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
  const asset = type.toUpperCase();
  const assetName = type === 'nft' ? 'NFT' : type === 'ft' ? 'token' : 'stacks';
  return (
    <>
      <h3>Create Swap BTC-{asset}</h3>
      {type === 'nft' && (
        <p>For a swap of Bitcoins and an NFT on Stacks, the NFT has to comply with SIP-9.</p>
      )}
      {type === 'ft' && (
        <p>For a swap of Bitcoins and a token on Stacks, the token has to comply with SIP-10.</p>
      )}
      <p>
        Your {assetName} {type === 'nft' ? ' is ' : ' are '} sent to the contract now and will be
        released to the buyer if the BTC transaction is verified (or back to you if the swap expired
        after 100 Bitcoin blocks and you called "cancel").
      </p>
      <form>
        <div className={`input-group mb-3 ${type === 'stx' ? 'd-none' : ''}`}>
          <input
            type="text"
            className="form-control"
            ref={traitRef}
            aria-label={`fully qualified contract of the ${assetName} and its asset class`}
            placeholder={`fully qualified contract of the ${assetName} and its asset class`}
            defaultValue={trait}
            required
            minLength="1"
          />
        </div>
        <div className="input-group mb-3">
          <input
            type="number"
            className="form-control"
            ref={amountSatsRef}
            aria-label={type === 'nft' ? `Price for NFT in Bitcoin` : `amount of Bitcoins`}
            placeholder={type === 'nft' ? `Price for NFT in Bitcoin` : `amount of Bitcoins`}
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
        <div className={`input-group mb-3 ${type === 'nft' ? '' : 'd-none'}`}>
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
        <div className={`input-group mb-3 ${type === 'nft' ? 'd-none' : ''}`}>
          <input
            type="number"
            className="form-control"
            ref={amountRef}
            aria-label={`amount of ${assetName} in ${type === 'stx' ? 'ustx' : 'smallest unit'}`}
            placeholder={`amount of ${assetName} in ${type === 'stx' ? 'ustx' : 'smallest unit'}`}
            required
            minLength="1"
          />
        </div>
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            ref={assetRecipientRef}
            aria-label={`${assetName} receiver's Stacks address`}
            placeholder={`${assetName} receiver's Stacks address`}
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
