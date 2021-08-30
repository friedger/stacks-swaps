import React, { useEffect, useRef, useState } from 'react';
import { useConnect } from '@stacks/connect-react';
import {
  contracts,
  NETWORK,
  smartContractsApi,
  STX_FT_SWAP_CONTRACT,
  STX_FT_SWAP_FEE_CONTRACT,
} from '../lib/constants';
import { TxStatus } from './TxStatus';
import {
  AnchorMode,
  callReadOnlyFunction,
  ClarityType,
  contractPrincipalCV,
  createAssetInfo,
  FungibleConditionCode,
  makeContractFungiblePostCondition,
  makeContractNonFungiblePostCondition,
  makeContractSTXPostCondition,
  makeStandardFungiblePostCondition,
  makeStandardNonFungiblePostCondition,
  makeStandardSTXPostCondition,
  noneCV,
  NonFungibleConditionCode,
  PostConditionMode,
  someCV,
  standardPrincipalCV,
  uintCV,
} from '@stacks/transactions';
import { Address } from './Address';
import { AssetIcon } from './AssetIcon';
import { getAsset, getAssetName } from './assets';
import { btcAddressToPubscriptCV } from '../lib/btcTransactions';
import { BN } from 'bn.js';
import { saveTxData } from '../lib/transactions';

export function SwapCreate({
  ownerStxAddress,
  type,
  trait,
  id,
  formData: formData1,
  blockHeight,
  userSession,
}) {
  const amountSatsRef = useRef();
  const btcRecipientRef = useRef();
  const nftIdRef = useRef();
  const amountRef = useRef();
  const assetRecipientRef = useRef();
  const traitRef = useRef();
  const [txId, setTxId] = useState();
  const [loading, setLoading] = useState();
  const [status, setStatus] = useState();
  const [formData, setFormData] = useState({ formData1 });
  const { doContractCall } = useConnect();

  const buyWithStx = type.startsWith('stx-');

  useEffect(() => {
    setFormData(formData1);
  }, [formData1]);

  const createAction = async () => {
    setLoading(true);
    const errors = [];
    if (amountSatsRef.current.value.trim() === '') {
      errors.push('positive numbers required to swap');
    }

    if (!buyWithStx && btcRecipientRef.current.value.trim() === '') {
      errors.push('BTC address is required');
    }
    if (errors.length > 0) {
      setLoading(false);
      setStatus(
        errors.map((e, index) => (
          <React.Fragment key={index}>
            {e}
            <br />
          </React.Fragment>
        ))
      );
      return;
    }
    const factor = buyWithStx ? 1_000_000 : 100_000_000;
    const satsOrUstxCV = uintCV(
      Math.floor(parseFloat(amountSatsRef.current.value.trim()) * factor)
    );
    const contract = contracts[type];
    const seller = btcRecipientRef.current.value.trim();
    const sellerCV = buyWithStx
      ? seller
        ? someCV(standardPrincipalCV(seller))
        : noneCV()
      : btcAddressToPubscriptCV(seller);

    let functionArgs;
    let postConditions;
    let ftContractAddress, ftTail, ftContractName, ftAssetName, ftCV;
    switch (type) {
      case 'nft':
        const nftIdCV = uintCV(nftIdRef.current.value.trim());
        const nftReceiverCV = standardPrincipalCV(assetRecipientRef.current.value.trim());
        const [nftContractAddress, nftTail] = traitRef.current.value.trim().split('.');
        const [nftContractName, nftAssetName] = nftTail.split('::');
        if (!nftAssetName) {
          setStatus('"nft contract :: nft name" must be set');
          return;
        }
        const nftCV = contractPrincipalCV(nftContractAddress, nftContractName);
        functionArgs = [satsOrUstxCV, sellerCV, nftIdCV, nftReceiverCV, nftCV];
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
        const ftReceiverCV = assetRecipientRef.current.value.trim()
          ? someCV(standardPrincipalCV(assetRecipientRef.current.value.trim()))
          : noneCV();
        [ftContractAddress, ftTail] = traitRef.current.value.trim().split('.');
        [ftContractName, ftAssetName] = ftTail.split('::');
        if (!ftAssetName) {
          setStatus('"ft contract :: ft name" must be set');
          return;
        }
        ftCV = contractPrincipalCV(ftContractAddress, ftContractName);
        functionArgs = [satsOrUstxCV, sellerCV, ftAmountCV, ftReceiverCV, ftCV];
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
        const stxReceiverCV = assetRecipientRef.current.value.trim()
          ? someCV(standardPrincipalCV(assetRecipientRef.current.value.trim()))
          : noneCV();
        functionArgs = [satsOrUstxCV, sellerCV, stxAmountCV, stxReceiverCV];
        postConditions = [
          makeStandardSTXPostCondition(
            ownerStxAddress,
            FungibleConditionCode.Equal,
            stxAmountCV.value
          ),
        ];
        break;
      case 'stx-ft':
        const ftAmount2CV = uintCV(amountRef.current.value.trim());

        [ftContractAddress, ftTail] = traitRef.current.value.trim().split('.');
        [ftContractName, ftAssetName] = ftTail.split('::');
        if (!ftAssetName) {
          setStatus('"ft contract :: ft name" must be set');
          return;
        }
        ftCV = contractPrincipalCV(ftContractAddress, ftContractName);

        const feesCV = contractPrincipalCV(
          STX_FT_SWAP_FEE_CONTRACT.address,
          STX_FT_SWAP_FEE_CONTRACT.name
        );

        functionArgs = [satsOrUstxCV, ftAmount2CV, sellerCV, ftCV, feesCV];
        postConditions = [
          makeStandardSTXPostCondition(
            ownerStxAddress,
            FungibleConditionCode.Equal,
            satsOrUstxCV.value.add(satsOrUstxCV.value.divRound(new BN(100)))
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
        setStatus('Saving transaction to your storage');
        setTxId(result.txId);
        saveTxData(result, userSession)
          .then(r => {
            setLoading(false);
            setStatus(undefined);
          })
          .catch(e => {
            console.log(e);
            setLoading(false);
            setStatus("Couldn't save the transaction");
          });
      },
    });
  };

  const setRecipientAction = async () => {
    setLoading(true);
    const errors = [];
    if (assetRecipientRef.current.value.trim() === '') {
      errors.push('Receiver is required');
    }
    if (errors.length > 0) {
      setLoading(false);
      setStatus(
        errors.map((e, index) => (
          <React.Fragment key={index}>
            {e}
            <br />
          </React.Fragment>
        ))
      );
      return;
    }
    const contract = contracts[type];
    let functionArgs;
    let postConditions;
    let functionName;
    let idCV;
    switch (type) {
      case 'nft':
        setStatus('not supported');
        return;
      case 'ft':
        functionName = 'set-ft-receiver';
        idCV = uintCV(id);
        functionArgs = [idCV];
        postConditions = [];
        break;
      case 'stx':
        functionName = 'set-stx-receiver';
        idCV = uintCV(id);
        functionArgs = [idCV];
        postConditions = [];
        break;

      default:
        break;
    }
    await doContractCall({
      contractAddress: contract.address,
      contractName: contract.name,
      functionName,
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
  };

  const cancelAction = async () => {
    const contract = contracts[type];
    let functionArgs;
    let postConditions;
    let idCV;
    switch (type) {
      case 'nft':
        const [nftContractAddress, nftTail] = traitRef.current.value.trim().split('.');
        const [nftContractName, nftAssetName] = nftTail.split('::');

        idCV = uintCV(id);
        functionArgs = [idCV];
        postConditions = [
          makeContractNonFungiblePostCondition(
            contract.address,
            contract.name,
            NonFungibleConditionCode.DoesNotOwn,
            createAssetInfo(nftContractAddress, nftContractName, nftAssetName),
            idCV
          ),
        ];

        break;
      case 'ft':
        const [ftContractAddress, ftTail] = traitRef.current.value.trim().split('.');
        const [ftContractName, ftAssetName] = ftTail.split('::');

        idCV = uintCV(id);
        functionArgs = [idCV];
        postConditions = [
          makeContractFungiblePostCondition(
            contract.address,
            contract.name,
            FungibleConditionCode.Equal,
            new BN(formData.amount),
            createAssetInfo(ftContractAddress, ftContractName, ftAssetName)
          ),
        ];
        break;
      case 'stx':
        idCV = uintCV(id);
        functionArgs = [idCV];
        postConditions = [
          makeContractSTXPostCondition(
            contract.address,
            contract.name,
            FungibleConditionCode.Equal,
            new BN(formData.amount)
          ),
        ];
        break;

      default:
        setLoading(false);
        return;
    }
    await doContractCall({
      contractAddress: contract.address,
      contractName: contract.name,
      functionName: 'cancel',
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
  };

  const submitAction = async () => {
    setLoading(true);

    const factor = buyWithStx ? 1_000_000 : 100_000_000;
    const satsOrUstxCV = uintCV(
      Math.floor(parseFloat(amountSatsRef.current.value.trim()) * factor)
    );

    const swapIdCV = uintCV(id);
    const contract = contracts[type];

    let functionArgs;
    let postConditions;
    switch (type) {
      case 'stx-ft':
        const [ftContractAddress, ftTail] = traitRef.current.value.trim().split('.');
        const [ftContractName, ftAssetName] = ftTail.split('::');
        const ftCV = contractPrincipalCV(ftContractAddress, ftContractName);
        const feesCV = contractPrincipalCV(
          STX_FT_SWAP_FEE_CONTRACT.address,
          STX_FT_SWAP_FEE_CONTRACT.name
        );
        const feesResponse = await callReadOnlyFunction({
          contractAddress: STX_FT_SWAP_FEE_CONTRACT.address,
          contractName: STX_FT_SWAP_FEE_CONTRACT.name,
          functionName: 'get-fees',
          functionArgs: [satsOrUstxCV],
          senderAddress: STX_FT_SWAP_FEE_CONTRACT.address,
        });
        const fees =
          feesResponse.type === ClarityType.OptionalNone ? undefined : feesResponse.value.value;
        if (!fees) {
          setLoading(false);
          setStatus("Couldn't load fees.");
          return;
        }
        functionArgs = [swapIdCV, ftCV, feesCV];
        postConditions = [
          makeContractSTXPostCondition(
            STX_FT_SWAP_CONTRACT.address,
            STX_FT_SWAP_CONTRACT.name,
            FungibleConditionCode.Equal,
            satsOrUstxCV.value
          ),
          makeContractSTXPostCondition(
            STX_FT_SWAP_FEE_CONTRACT.address,
            STX_FT_SWAP_FEE_CONTRACT.name,
            FungibleConditionCode.Equal,
            fees
          ),
          makeStandardFungiblePostCondition(
            ownerStxAddress,
            FungibleConditionCode.Equal,
            new BN(formData.amount),
            createAssetInfo(ftContractAddress, ftContractName, ftAssetName)
          ),
        ];
        break;

      default:
        setLoading(false);
        return;
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
          saveTxData(result, userSession)
            .then(r => {
              setLoading(false);
            })
            .catch(e => {
              console.log(e);
              setLoading(false);
            });
        },
      });
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  const buyWithAsset = buyWithStx ? 'STX' : 'BTC';
  const sellType = buyWithStx ? type.split('-')[1] : type;
  const asset = getAsset(sellType, formData.trait);
  const assetName = getAssetName(sellType, formData.trait);

  return (
    <>
      <h3>
        Create Swap {buyWithAsset}-{asset}
      </h3>
      {type === 'nft' && (
        <p>For a swap of Bitcoins and an NFT on Stacks, the NFT has to comply with SIP-9.</p>
      )}
      {type === 'ft' && (
        <p>For a swap of Bitcoins and a token on Stacks, the token has to comply with SIP-10.</p>
      )}
      {type === 'stx-ft' && (
        <p>For a swap of Stacks and a token on Stacks, the token has to comply with SIP-10.</p>
      )}
      {buyWithStx ? (
        <p>
          Your Stacks tokens will be sent to the contract now (including 1% fees) and will be
          released to the buyer if the {assetName} {sellType === 'nft' ? ' is ' : ' are '}{' '}
          transferred to you. If the swap expired after 100 Stacks blocks and you called "cancel"
          your Stacks tokens including fees are returned to you.
        </p>
      ) : (
        <p>
          Your {assetName} {type === 'nft' ? ' is ' : ' are '} sent to the contract now and will be
          released to the buyer if the BTC transaction is verified (or back to you if the swap
          expired after 100 Stacks blocks and you called "cancel").
        </p>
      )}
      <form>
        <div className={`input-group ${type === 'stx' ? 'd-none' : ''}`}>
          <input
            type="text"
            className="form-control"
            ref={traitRef}
            value={formData.trait}
            onChange={e => setFormData({ ...formData, trait: e.current.value })}
            aria-label={`fully qualified contract of the ${assetName} and its asset class`}
            placeholder={`fully qualified contract of the ${assetName} and its asset class`}
            readOnly={trait}
            required
            minLength="1"
          />
        </div>
        <div className="container">
          <div className="row align-items-center m-5">
            <div className="col text-center">
              {(!id || formData.assetSenderFromSwap === ownerStxAddress) && !buyWithStx ? (
                <>
                  Seller (You)
                  <br />
                  <Address addr={ownerStxAddress} />
                </>
              ) : (
                <>
                  <br />
                  Seller
                </>
              )}
              <br />
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  ref={btcRecipientRef}
                  value={formData.btcRecipient}
                  onChange={e => setFormData({ ...formData, btcRecipient: e.target.value })}
                  aria-label={
                    buyWithStx
                      ? 'Stacks address or name (optional)'
                      : 'Bitcoin recipient address (must start with 1)'
                  }
                  placeholder={
                    buyWithStx
                      ? 'Stacks address or name (optional)'
                      : 'Bitcoin recipient address (must start with 1)'
                  }
                  readOnly={id}
                  required
                  max="40"
                  minLength="1"
                />
              </div>
            </div>
            <div className="col text-center border-left">
              <AssetIcon type={sellType} trait={formData.trait} />
              <br />
              <div className={`input-group ${type === 'nft' ? '' : 'd-none'}`}>
                <input
                  type="number"
                  className="form-control"
                  ref={nftIdRef}
                  value={formData.nftId}
                  onChange={e => setFormData({ ...formData, nftId: e.target.value })}
                  aria-label="ID of NFT"
                  placeholder="ID of NFT"
                  readOnly={id}
                  required
                  minLength="1"
                />
              </div>
              <div className={`input-group ${type === 'nft' ? 'd-none' : ''}`}>
                <input
                  type="number"
                  className="form-control"
                  ref={amountRef}
                  value={formData.amount}
                  onChange={e => setFormData({ ...formData, amount: e.target.value })}
                  aria-label={`amount of ${assetName} in ${
                    type === 'stx' ? 'ustx' : 'smallest unit'
                  }`}
                  placeholder={`amount of ${assetName} in ${
                    type === 'stx' ? 'ustx' : 'smallest unit'
                  }`}
                  readOnly={id}
                  required
                  minLength="1"
                />
              </div>
              <i className="bi bi-arrow-right"></i>
              <br />
              <i className="bi bi-arrow-left"></i>
              <br />
              <div className="input-group">
                <input
                  type="number"
                  className="form-control"
                  ref={amountSatsRef}
                  value={formData.amountSats}
                  onChange={e => setFormData({ ...formData, amountSats: e.target.value })}
                  aria-label={
                    buyWithStx
                      ? type === 'nft'
                        ? `Price for NFT in STXs`
                        : `amount of STXs`
                      : type === 'nft'
                      ? `Price for NFT in Bitcoin`
                      : `amount of Bitcoins`
                  }
                  placeholder={
                    buyWithStx
                      ? type === 'nft'
                        ? `Price for NFT in STXs`
                        : `amount of STXs`
                      : type === 'nft'
                      ? `Price for NFT in Bitcoin`
                      : `amount of Bitcoins`
                  }
                  readOnly={id}
                  required
                  minLength="1"
                />
              </div>
              {buyWithStx ? (
                <AssetIcon type="stx" />
              ) : (
                <img className="m-1" src="/bitcoin.webp" alt="BTC" />
              )}
            </div>
            <div className="col text-center">
              {(!id || formData.assetSenderFromSwap === ownerStxAddress) && buyWithStx ? (
                <>
                  Buyer (You)
                  <br />
                  <Address addr={ownerStxAddress} />
                </>
              ) : (
                <>
                  <br />
                  Buyer
                </>
              )}

              <br />
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  ref={assetRecipientRef}
                  value={formData.assetRecipient}
                  onChange={e => setFormData({ ...formData, assetRecipient: e.target.value })}
                  aria-label={`${assetName} receiver's Stacks address`}
                  placeholder={`${assetName} receiver's Stacks address`}
                  readOnly={(id && formData.assetRecipientFromSwap) || buyWithStx}
                  required
                  minLength="1"
                />
              </div>
            </div>
          </div>
          {status && (
            <div className="row align-items-center">
              <div className="col text-center alert">{status}</div>
            </div>
          )}
          <div className="row">
            <div className="col-12 text-center">
              {id &&
                (formData.assetSenderFromSwap || buyWithStx) &&
                formData.whenFromSwap + 100 < blockHeight &&
                formData.doneFromSwap === 0 && (
                  <button
                    className="btn btn-block btn-primary"
                    type="button"
                    onClick={cancelAction}
                  >
                    <div
                      role="status"
                      className={`${
                        loading ? '' : 'd-none'
                      } spinner-border spinner-border-sm text-info align-text-top mr-2`}
                    />
                    Cancel swap
                  </button>
                )}
              {id ? (
                // show existing swap
                buyWithStx ? (
                  <button
                    className="btn btn-block btn-primary"
                    type="button"
                    onClick={submitAction}
                  >
                    <div
                      role="status"
                      className={`${
                        loading ? '' : 'd-none'
                      } spinner-border spinner-border-sm text-info align-text-top mr-2`}
                    />
                    Sell {asset}
                  </button>
                ) : // handle buy with btc
                formData.assetRecipientFromSwap ? (
                  <></>
                ) : (
                  <button
                    className="btn btn-block btn-primary"
                    type="button"
                    onClick={setRecipientAction}
                  >
                    <div
                      role="status"
                      className={`${
                        loading ? '' : 'd-none'
                      } spinner-border spinner-border-sm text-info align-text-top mr-2`}
                    />
                    Buy {asset}
                  </button>
                )
              ) : (
                // create new swap
                <button className="btn btn-block btn-primary" type="button" onClick={createAction}>
                  <div
                    role="status"
                    className={`${
                      loading ? '' : 'd-none'
                    } spinner-border spinner-border-sm text-info align-text-top mr-2`}
                  />
                  {buyWithStx ? 'Buy' : 'Sell'} {asset}
                </button>
              )}
            </div>
          </div>
        </div>
      </form>
      {txId && <TxStatus txId={txId} />}
    </>
  );
}
