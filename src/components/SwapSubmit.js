import React, { useRef, useState } from 'react';
import { useConnect } from '@stacks/connect-react';
import {
  BTC_FT_SWAP_CONTRACT,
  BTC_NFT_SWAP_CONTRACT,
  BTC_STX_SWAP_CONTRACT,
  contracts,
  NETWORK,
  smartContractsApi,
} from '../lib/constants';
import { TxStatus } from './TxStatus';
import {
  AnchorMode,
  contractPrincipalCV,
  createAssetInfo,
  cvToHex,
  cvToString,
  FungibleConditionCode,
  hexToCV,
  makeContractFungiblePostCondition,
  makeContractNonFungiblePostCondition,
  makeContractSTXPostCondition,
  NonFungibleConditionCode,
  PostConditionMode,
  uintCV,
} from '@stacks/transactions';
import {
  getReversedTxId,
  paramsFromTx,
  parseBlockHeader,
  verifyBlockHeader,
  verifyBlockHeader2,
  verifyMerkleProof,
  verifyMerkleProof2,
  wasTxMined,
  wasTxMinedFromHex,
} from '../lib/btcTransactions';

export function SwapSubmit({ ownerStxAddress, userSession, type, trait }) {
  const heightRef = useRef();
  const swapIdRef = useRef();
  const nftIdRef = useRef();
  const traitRef = useRef();
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
    console.log({
      btcTxId,
      block,
      proofCV: cvToString(proofCV),
      blockCV: cvToString(blockCV),
      txCV: cvToString(txCV),
    });
    const results = await Promise.all([
      getReversedTxId(txCV),
      verifyMerkleProof(btcTxId, block, proofCV),
      verifyMerkleProof2(txCV, headerPartsCV, proofCV),
      verifyBlockHeader(headerParts, height),
      verifyBlockHeader2(blockCV),
      wasTxMinedFromHex(blockCV, txCV, proofCV),
      parseBlockHeader(header),
      wasTxMined(headerPartsCV, txCV, proofCV),
    ]);
    console.log({ r: results.map(r => cvToString(r)) });
    setChanged(false);
  };

  const submitAction = async () => {
    setLoading(true);

    const height = parseInt(heightRef.current.value.trim());
    const swapId = parseInt(swapIdRef.current.value.trim());
    const btcTxId = btcTxIdRef.current.value.trim();
    const { txPartsCV, proofCV, headerPartsCV } = await paramsFromTx(btcTxId, height);
    const swapIdCV = uintCV(swapId);
    const contract = contracts[type];
    const swapEntry = await smartContractsApi.getContractDataMapEntry({
      contractAddress: contract.address,
      contractName: contract.name,
      mapName: 'swaps',
      key: cvToHex(swapIdCV),
    });
    const swapCV = hexToCV(swapEntry.data);

    let functionArgs;
    let postConditions;
    switch (type) {
      case 'nft':
        const [nftContractAddress, nftTail] = traitRef.current.value.trim().split('.');
        const [nftContractName, nftAssetName] = nftTail.split('::');
        const nftCV = contractPrincipalCV(nftContractAddress, nftContractName);
        const nftIdCV = uintCV(parseInt(nftIdRef.current.value.trim()));
        functionArgs = [
          swapIdCV,
          // block
          headerPartsCV,
          // tx
          txPartsCV,
          // proof
          proofCV,
          nftCV,
        ];
        postConditions = [
          makeContractNonFungiblePostCondition(
            BTC_NFT_SWAP_CONTRACT.address,
            BTC_NFT_SWAP_CONTRACT.name,
            NonFungibleConditionCode.DoesNotOwn,
            createAssetInfo(nftContractAddress, nftContractName, nftAssetName),
            nftIdCV
          ),
        ];
        break;
      case 'ft':
        const [ftContractAddress, ftTail] = traitRef.current.value.trim().split('.');
        const [ftContractName, ftAssetName] = ftTail.split('::');
        const ftCV = contractPrincipalCV(ftContractAddress, ftContractName);
        functionArgs = [
          swapIdCV,
          // block
          headerPartsCV,
          // tx
          txPartsCV,
          // proof
          proofCV,
          ftCV,
        ];
        postConditions = [
          makeContractFungiblePostCondition(
            BTC_FT_SWAP_CONTRACT.address,
            BTC_FT_SWAP_CONTRACT.name,
            FungibleConditionCode.Equal,
            swapCV.value.data['amount'].value,
            createAssetInfo(ftContractAddress, ftContractName, ftAssetName)
          ),
        ];
        break;
      case 'stx':
        functionArgs = [
          swapIdCV,
          // block
          headerPartsCV,
          // tx
          txPartsCV,
          // proof
          proofCV,
        ];
        postConditions = [
          makeContractSTXPostCondition(
            BTC_STX_SWAP_CONTRACT.address,
            BTC_STX_SWAP_CONTRACT.name,
            FungibleConditionCode.Equal,
            swapCV.value.data['ustx'].value
          ),
        ];
        break;

      default:
        break;
    }
    try {
      // submit
      await doContractCall({
        contractAddress: contract.address,
        contractName: contract.name,
        functionName: 'submit-swap',
        functionArgs,
        postConditionMode: PostConditionMode.Deny,
        postConditions,
        userSession,
        network: NETWORK,
        anchorMode: AnchorMode.Any,
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
  const assetName = type === 'nft' ? 'NFT' : type === 'ft' ? 'token' : 'stacks';
  return (
    <>
      <h3>Submit BTC Transaction for Swap BTC-{type.toUpperCase()}</h3>
      <p>The Swap ID is returned during creation.</p>
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
          {changed ? 'Verify (dry run)' : 'Submit'}
        </button>
      </form>
      {txId && <TxStatus txId={txId} />}
    </>
  );
}
