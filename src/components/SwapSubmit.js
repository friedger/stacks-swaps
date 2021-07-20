import React, { useRef, useState } from 'react';
import { useConnect } from '@stacks/connect-react';
import { BTC_NFT_SWAP_NAME, CONTRACT_ADDRESS, NETWORK } from '../lib/constants';
import { TxStatus } from './TxStatus';
import {
  AnchorMode,
  broadcastTransaction,
  bufferCV,
  contractPrincipalCV,
  createAssetInfo,
  makeContractCall,
  makeContractNonFungiblePostCondition,
  makeStandardNonFungiblePostCondition,
  NonFungibleConditionCode,
  PostConditionMode,
  serializeCV,
  standardPrincipalCV,
  uintCV,
} from '@stacks/transactions';
import {
  paramsFromTx,
  parseBlockHeader,
  verifyBlockHeader,
  verifyMerkleProof,
  wasTxMined,
  wasTxMinedFromHex,
} from '../lib/btcTransactions';
export function SwapSubmit({ ownerStxAddress, userSession }) {
  const heightRef = useRef();
  const swapIdRef = useRef();
  const nftIdRef = useRef();
  const nftTraitRef = useRef();
  const btcTxIdRef = useRef();

  const [txId, setTxId] = useState();
  const [loading, setLoading] = useState();
  const [changed, setChanged] = useState(true);
  const { doContractCall } = useConnect();

  const verifyAction = async () => {
    const btcTxId = btcTxIdRef.current.value.trim();
    const stxHeight = parseInt(heightRef.current.value.trim());
    const {
      txCV,
      txPartsCV,
      proofCV,
      block,
      blockCV,
      header,
      headerParts,
      headerPartsCV,
      stacksBlock,
    } = await paramsFromTx(btcTxId, stxHeight);
    const height = stacksBlock.height;
    const results = await Promise.all([
      verifyMerkleProof(btcTxId, block, proofCV),
      wasTxMinedFromHex(blockCV, txCV, proofCV),
      parseBlockHeader(header),
      verifyBlockHeader(headerParts, height),
      wasTxMined(headerPartsCV, txCV, proofCV),
    ]);
    console.log({ results });
    setChanged(false);
  };

  const submitAction = async () => {
    setLoading(true);

    const height = parseInt(heightRef.current.value.trim());
    const swapId = parseInt(swapIdRef.current.value.trim());
    const btcTxId = btcTxIdRef.current.value.trim();
    const { txPartsCV, proofCV, headerPartsCV } = await paramsFromTx(btcTxId, height);
    const swapIdCV = uintCV(swapId);
    const [nftContractAddress, nftTail] = nftTraitRef.current.value.trim().split('.');
    const [nftContractName, nftAssetName] = nftTail.split('::');
    const nftCV = contractPrincipalCV(nftContractAddress, nftContractName);
    const nftIdCV = uintCV(parseInt(nftIdRef.current.value.trim()));
    try {
      // submit
      await doContractCall({
        contractAddress: CONTRACT_ADDRESS,
        contractName: BTC_NFT_SWAP_NAME,
        functionName: 'submit-swap',
        functionArgs: [
          swapIdCV,
          // block
          headerPartsCV,
          // tx
          txPartsCV,
          // proof
          proofCV,
          nftCV,
        ],
        postConditionMode: PostConditionMode.Allow,
        postConditions: [
          makeContractNonFungiblePostCondition(
            CONTRACT_ADDRESS,
            BTC_NFT_SWAP_NAME,
            NonFungibleConditionCode.DoesNotOwn,
            createAssetInfo(nftContractAddress, nftContractName, nftAssetName),
            nftIdCV
          ),
        ],
        userSession,
        network: NETWORK,
        onCancel: () => {
          setLoading(false);
        },
        onFinish: result => {
          setLoading(false);
          setTxId(result.txId);
        },
      });
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  return (
    <>
      <h3>Submit BTC Transaction for Swap BTC-NFT</h3>
      <p>The Swap ID is returned during creation.</p>
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
            ref={swapIdRef}
            aria-label="Swap ID"
            placeholder="Swap ID"
            required
            minLength="1"
          />
        </div>
        <div className="input-group mb-3">
          <input
            type="number"
            className="form-control"
            ref={heightRef}
            aria-label="Stacks Block"
            placeholder="Stacks Block"
            required
            minLength="1"
          />
        </div>
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            ref={btcTxIdRef}
            aria-label="Bitcoin transaction ID"
            placeholder="Bitcoin transaction ID"
            required
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
        <button
          className="btn btn-block btn-primary"
          type="button"
          onClick={changed ? verifyAction : submitAction}
        >
          <div
            role="status"
            className={`${
              loading ? '' : 'd-none'
            } spinner-border spinner-border-sm text-info align-text-top mr-2`}
          />
          {changed ? 'Verify' : 'Submit'}
        </button>
      </form>
      {txId && <TxStatus txId={txId} />}
    </>
  );
}
