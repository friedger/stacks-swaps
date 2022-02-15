import React, { useEffect, useRef, useState } from 'react';
import { contracts, ftFeeContracts, nftFeeContracts, NETWORK } from '../lib/constants';
import { TxStatus } from './TxStatus';
import { noneCV, principalCV, someCV, standardPrincipalCV, uintCV } from 'micro-stacks/clarity';
import {
  AnchorMode,
  createAssetInfo,
  NonFungibleConditionCode,
  PostConditionMode,
  FungibleConditionCode,
  makeContractFungiblePostCondition,
  makeContractNonFungiblePostCondition,
  makeContractSTXPostCondition,
  makeStandardFungiblePostCondition,
  makeStandardNonFungiblePostCondition,
  makeStandardSTXPostCondition,
} from 'micro-stacks/transactions';
import { fetchAccountBalances } from 'micro-stacks/api';

import { useAuth, useContractCall, useSession } from '@micro-stacks/react';
import { Address } from './Address';
import { AssetIcon } from './AssetIcon';
import { BANANA_TOKEN, getAsset, getAssetName, USDA_TOKEN, XBTC_TOKEN } from './assets';
import { btcAddressToPubscriptCV } from '../lib/btcTransactions';
import { BN } from 'bn.js';
import { saveTxData } from '../lib/transactions';
import { Price } from './Price';
import { resolveBNS } from '../lib/account';
import { getFTData, getNFTData } from '../lib/tokenData';
import { contractToFees } from '../lib/fees';
import {
  buyAssetFromType,
  buyAssetTypeFromSwapType,
  buyDecimalsFromType,
  factorForType,
  isAtomic,
  resolveImageForNFT,
  resolveOwnerForNFT,
  splitAssetIdentifier,
} from '../lib/assets';
import {
  makeCancelSwapPostConditions,
  makeCreateSwapPostConditions,
  makeSubmitPostConditions,
  nftSwap,
} from '../lib/swaps';

function readFloat(ref) {
  const result = parseFloat(ref.current.value.trim());
  return isNaN(result) ? undefined : result;
}

export function SwapCreate({
  ownerStxAddress,
  type,
  trait,
  id,
  formData: formData1,
  blockHeight,
  feeOptions,
}) {
  const amountSatsRef = useRef();
  const assetSellerRef = useRef();
  const nftIdRef = useRef();
  const amountRef = useRef();
  const assetBuyerRef = useRef();
  const traitRef = useRef();
  const feeContractRef = useRef();
  const [txId, setTxId] = useState();
  const [loading, setLoading] = useState();
  const [status, setStatus] = useState();
  const [formData, setFormData] = useState(formData1);
  const [ftData, setFtData] = useState();
  const [previewed, setPreviewed] = useState(false);
  const [assetUrl, setAssetUrl] = useState();

  const contract = contracts[type];
  const { handleContractCall } = useContractCall({
    contractAddress: contract.address,
    contractName: contract.name,
    network: NETWORK,
    anchorMode: AnchorMode.Any,
  });
  const { handleSignIn } = useAuth();
  const [userSession] = useSession();

  const atomicSwap = isAtomic(type);

  const satsOrUstxCVFromInput = () => {
    const factor = factorForType(type);
    const amountInputFloat = readFloat(amountSatsRef) || 0;
    return uintCV(Math.floor(amountInputFloat * factor));
  };

  const getFeeOption = type => (feeOptions ? feeOptions.find(f => f.type === type) : undefined);

  useEffect(() => {
    console.log({ type, formData });
    if (type === 'stx-ft' && formData && formData.trait) {
      const [contractId] = formData.trait.split('::');
      const [address, name] = contractId.split('.');
      getFTData(address, name).then(result => {
        console.log({ ftData: result });
        setFtData(result);
      });
    } else if (type === 'stx-nft' && formData && formData.trait) {
      const [contractId] = formData.trait.split('::');
      const [address, name] = contractId.split('.');
      getNFTData(address, name).then(result => {
        console.log({ nftData: result });
      });
    }
  }, [formData, type]);

  const createAction = async () => {
    setLoading(true);
    setStatus('');
    const errors = [];
    let seller = assetSellerRef.current.value.trim();
    if (!atomicSwap && seller === '') {
      errors.push('BTC address is required');
    }

    const satsOrUstxCV = satsOrUstxCVFromInput();
    if (satsOrUstxCV.value <= 0) {
      errors.push('positive amount required to swap');
    }
    if (isNaN(parseInt(formData.nftId))) {
      errors.push('not a valid NFT id');
    }
    const tokenContract = traitRef.current.value.trim();
    if (!tokenContract) {
      errors.push('Missing token contract');
    }
    if (seller === 'SP6P4EJF0VG8V0RB3TQQKJBHDQKEF6NVRD1KZE3C.stacksbridge-satoshibles') {
      errors.push("Can't swap from Stacks bridge");
    }
    if (seller === 'SP2KAF9RF86PVX3NEE27DFV1CQX0T4WGR41X3S45C.btc-monkeys-staking') {
      errors.push("Can't swap staked monkey");
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

    seller = await resolveBNS(assetSellerRef.current.value.trim());
    const sellerCV = atomicSwap
      ? seller
        ? someCV(principalCV(seller))
        : noneCV()
      : btcAddressToPubscriptCV(seller);

    const assetBuyer = await resolveBNS(assetBuyerRef.current.value.trim());

    let functionArgs, postConditions;
    let ftAmountCV, nftIdCV;
    let feeId, feeContract, feesCV, fees;
    let assetContractAddress, assetContractName, assetName, assetContractCV;
    switch (type) {
      // catamaran swaps
      case 'nft':
        if (!assetBuyer) {
          setStatus('Buyer address must be set.');
          setLoading(false);
          return;
        }
        nftIdCV = uintCV(nftIdRef.current.value.trim());
        const nftReceiverCV = standardPrincipalCV(assetBuyer);
        [assetContractCV, assetName, assetContractName, assetContractAddress] =
          splitAssetIdentifier(traitRef.current.value.trim());
        if (!assetName) {
          setLoading(false);
          setStatus('"nft contract :: nft name" must be set');
          return;
        }
        functionArgs = [satsOrUstxCV, sellerCV, nftIdCV, nftReceiverCV, assetContractCV];
        postConditions = [
          makeStandardNonFungiblePostCondition(
            ownerStxAddress,
            NonFungibleConditionCode.DoesNotOwn,
            createAssetInfo(assetContractAddress, assetContractName, assetName),
            nftIdCV
          ),
        ];
        break;
      case 'ft':
        ftAmountCV = uintCV(amountRef.current.value.trim());
        if (ftAmountCV.value <= 0) {
          setLoading(false);
          setStatus('positive numbers required to swap');
          return;
        }
        const ftReceiverCV = assetBuyer ? someCV(standardPrincipalCV(assetBuyer)) : noneCV();
        [assetContractCV, assetName, assetContractName, assetContractAddress] =
          splitAssetIdentifier(traitRef.current.value.trim());
        if (!assetName) {
          setLoading(false);
          setStatus('"ft contract :: ft name" must be set');
          return;
        }

        functionArgs = [satsOrUstxCV, sellerCV, ftAmountCV, ftReceiverCV, assetContractCV];
        postConditions = [
          makeStandardFungiblePostCondition(
            ownerStxAddress,
            FungibleConditionCode.Equal,
            ftAmountCV.value,
            createAssetInfo(assetContractAddress, assetContractName, assetName)
          ),
        ];
        break;
      case 'stx':
        const stxAmountCV = uintCV(amountRef.current.value.trim() * 1_000_000);
        if (stxAmountCV.value <= 0) {
          setLoading(false);
          setStatus('positive numbers required to swap');
          return;
        }
        const stxReceiverCV = assetBuyer ? someCV(standardPrincipalCV(assetBuyer)) : noneCV();
        functionArgs = [satsOrUstxCV, sellerCV, stxAmountCV, stxReceiverCV];
        postConditions = [
          makeStandardSTXPostCondition(
            ownerStxAddress,
            FungibleConditionCode.Equal,
            stxAmountCV.value
          ),
        ];
        break;

      // atomic swaps
      case 'stx-ft':
      case 'banana-ft':
      case 'satoshible-ft':
      case 'xbtc-ft':
      case 'usda-ft':
        const sellFactor = ftData ? Math.pow(10, ftData.decimals) : 1;
        ftAmountCV = uintCV(amountRef.current.value.trim() * sellFactor);
        if (ftAmountCV.value <= 0) {
          setLoading(false);
          setStatus('positive numbers required to swap');
          return;
        }
        [assetContractCV, assetName] = splitAssetIdentifier(traitRef.current.value.trim());
        if (!assetName) {
          setLoading(false);
          setStatus('"ft contract :: ft name" must be set');
          return;
        }
        feeId = feeContractRef.current.value;
        feeContract = getFeeOption(feeId).contract;
        [feesCV, fees] = await contractToFees(feeContract, satsOrUstxCV);
        functionArgs = [satsOrUstxCV, ftAmountCV, sellerCV, assetContractCV, feesCV];
        postConditions = makeCreateSwapPostConditions(
          type,
          feeId,
          ownerStxAddress,
          satsOrUstxCV,
          fees,
          feeContract
        );
        break;
      case 'stx-nft':
      case 'banana-nft':
      case 'satoshible-nft':
      case 'xbtc-nft':
      case 'usda-nft':
        nftIdCV = uintCV(formData.nftId);
        if (nftIdCV.value <= 0) {
          setLoading(false);
          setStatus('positive numbers required to swap');
          return;
        }
        [assetContractCV, assetName] = splitAssetIdentifier(traitRef.current.value.trim());
        if (!assetName) {
          setLoading(false);
          setStatus('"nft contract :: nft name" must be set');
          return;
        }
        feeId = feeContractRef.current.value;
        console.log({ feeId });
        feeContract = getFeeOption(feeId).contract;
        [feesCV, fees] = await contractToFees(feeContract, satsOrUstxCV);
        functionArgs = [satsOrUstxCV, nftIdCV, sellerCV, assetContractCV, feesCV];
        postConditions = makeCreateSwapPostConditions(
          type,
          feeId,
          ownerStxAddress,
          satsOrUstxCV,
          fees,
          feeContract
        );
        break;
      default:
        setLoading(false);
        setStatus('Unsupported type');
        return;
    }
    await handleContractCall({
      functionName: 'create-swap',
      functionArgs,
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

  const hasInsufficientBalance = async satsOrUstxCV => {
    const feeId = feeContractRef.current.value;
    console.log({ feeId });
    const feeContract = nftFeeContracts[feeId];
    const [, fees] = await contractToFees(feeContract, satsOrUstxCV);
    const balances = await fetchAccountBalances({
      url: NETWORK.coreApiUrl,
      principal: ownerStxAddress,
    });
    console.log({ balances });
    const feesInSameAsset = type.startsWith(feeId + '-');
    const requiredAsset = satsOrUstxCV.value + (feesInSameAsset ? fees : 0);
    console.log(balances.stx.balance, requiredAsset, balances.stx.balance < requiredAsset);

    switch (type) {
      case 'stx':
      case 'stx-nft':
      case 'stx-ft':
        return balances.stx.balance < requiredAsset;
      case 'banana-nft':
      case 'banana-ft':
        return balances.fungible_tokens[BANANA_TOKEN]?.balance < requiredAsset;
      case 'xbtc-nft':
      case 'xbtc-ft':
        return balances.fungible_tokens[XBTC_TOKEN]?.balance < requiredAsset;
      case 'usda-nft':
      case 'usda-ft':
        return balances.fungible_tokens[USDA_TOKEN]?.balance < requiredAsset;
      default:
        // unsupported type, assume balance is sufficient.
        return false;
    }
  };

  const previewAction = async () => {
    setLoading(true);
    const errors = [];
    const satsOrUstxCV = satsOrUstxCVFromInput();
    if (satsOrUstxCV.value <= 0) {
      errors.push('positive amount required to swap');
    }
    if (nftSwap(type) && isNaN(parseInt(formData.nftId))) {
      errors.push('not a valid NFT id');
    }
    try {
      // TODO handle fee checks for NFT swaps
      if (await hasInsufficientBalance(satsOrUstxCV)) {
        errors.push('wallet has insufficient balance');
      }
    } catch (e) {
      console.log(e);
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
    const [, , contractName, contractAddress] = splitAssetIdentifier(traitRef.current.value.trim());
    if (nftSwap(type)) {
      try {
        const image = await resolveImageForNFT(contractAddress, contractName, formData.nftId);
        if (image) {
          setAssetUrl(image);
        }
      } catch (e) {
        // ignore
        console.log(e);
        setStatus('NFT image not found');
      }
      try {
        const account = await resolveOwnerForNFT(contractAddress, contractName, formData.nftId);
        if (isAtomic) {
          assetSellerRef.current.value = account;
        } else {
          assetBuyerRef.current.value = account;
        }
      } catch (e) {
        console.log(e);
      }
    }
    setPreviewed(true);
    setLoading(false);
  };

  const setRecipientAction = async () => {
    setLoading(true);
    const errors = [];
    if (assetBuyerRef.current.value.trim() === '') {
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
    await handleContractCall({
      functionName,
      functionArgs,
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
    setLoading(true);
    const swapIdCV = uintCV(id);

    let functionArgs;
    let postConditions;
    let amountInSmallestUnit, nftIdCV;
    let assetContractCV, assetName, assetContractName, assetContractAddress;
    let feeId, feeContract, feesCV, fees;
    const factor = factorForType(type);
    const satsOrUstxCV = uintCV(
      Math.floor(parseFloat(amountSatsRef.current.value.trim()) * factor)
    );

    switch (type) {
      case 'nft':
        nftIdCV = uintCV(nftIdRef.current.value.trim());
        [, assetName, assetContractName, assetContractAddress] = splitAssetIdentifier(
          traitRef.current.value.trim()
        );
        functionArgs = [swapIdCV];
        postConditions = [
          makeContractNonFungiblePostCondition(
            contract.address,
            contract.name,
            NonFungibleConditionCode.DoesNotOwn,
            createAssetInfo(assetContractAddress, assetContractName, assetName),
            nftIdCV
          ),
        ];

        break;
      case 'ft':
        [, assetName, assetContractName, assetContractAddress] = splitAssetIdentifier(
          traitRef.current.value.trim()
        );
        amountInSmallestUnit = formData.amount * Math.pow(10, sellDecimals);
        functionArgs = [swapIdCV];
        postConditions = [
          makeContractFungiblePostCondition(
            contract.address,
            contract.name,
            FungibleConditionCode.Equal,
            new BN(amountInSmallestUnit),
            createAssetInfo(assetContractAddress, assetContractName, assetName)
          ),
        ];
        break;
      case 'stx':
        amountInSmallestUnit = formData.amount * Math.pow(10, sellDecimals);

        functionArgs = [swapIdCV];
        postConditions = [
          makeContractSTXPostCondition(
            contract.address,
            contract.name,
            FungibleConditionCode.Equal,
            new BN(amountInSmallestUnit)
          ),
        ];
        break;
      case 'stx-ft':
      case 'banana-ft':
      case 'xbtc-ft':
      case 'usda-ft':
      case 'satoshible-ft':
        [assetContractCV, assetName, assetContractName, assetContractAddress] =
          splitAssetIdentifier(traitRef.current.value.trim());
        if (!assetName) {
          setLoading(false);
          setStatus('"ft contract :: ft name" must be set');
          return;
        }
        feeId = feeContractRef.current.value;
        feeContract = ftFeeContracts[feeId];
        [feesCV, fees] = await contractToFees(feeContract, satsOrUstxCV);
        functionArgs = [swapIdCV, assetContractCV, feesCV];
        postConditions = makeCancelSwapPostConditions(
          type,
          contract,
          satsOrUstxCV,
          feeId,
          feeContract,
          fees
        );
        break;
      case 'stx-nft':
      case 'banana-nft':
      case 'xbtc-nft':
      case 'usda-nft':
      case 'satoshible-nft':
        nftIdCV = uintCV(nftIdRef.current.value.trim());

        [assetContractCV, assetName, assetContractName, assetContractAddress] =
          splitAssetIdentifier(traitRef.current.value.trim());
        if (!assetName) {
          setLoading(false);
          setStatus('"ft contract :: ft name" must be set');
          return;
        }
        feeId = feeContractRef.current.value;
        feeContract = ftFeeContracts[feeId];
        [feesCV, fees] = await contractToFees(feeContract, satsOrUstxCV);
        functionArgs = [swapIdCV, assetContractCV, feesCV];
        postConditions = makeCancelSwapPostConditions(
          type,
          contract,
          satsOrUstxCV,
          feeId,
          feeContract,
          fees
        );
        break;

      default:
        setLoading(false);
        return;
    }
    await handleContractCall({
      functionName: 'cancel',
      functionArgs,
      postConditionMode: PostConditionMode.Deny,
      postConditions,

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
  };

  const submitAction = async () => {
    setLoading(true);

    const swapIdCV = uintCV(id);

    let functionArgs;
    let postConditions;

    let amountOrIdToSwapCV;
    let amountInSmallestUnitOrNftIdInEscrowCV;
    let assetContractCV, assetName, assetContractName, assetContractAddress;
    let factor;
    let feesCV, fees;

    // asset to swap (not in escrow)
    [assetContractCV, assetName, assetContractName, assetContractAddress] = splitAssetIdentifier(
      traitRef.current.value.trim()
    );

    const feeId = feeContractRef.current.value;
    const feeContract = getFeeOption(feeId).contract;

    switch (type) {
      case 'stx-ft':
      case 'banana-ft':
      case 'xbtc-ft':
      case 'usda-ft':
      case 'satoshible-ft':
        // price for escrowed asset
        // to be paid by user
        amountOrIdToSwapCV = formData.amount * Math.pow(10, sellDecimals);

        break;

      case 'stx-nft':
      case 'banana-nft':
      case 'xbtc-nft':
      case 'usda-nft':
      case 'satoshible-nft':
        // nft for escrowed asset
        // to be sent by user
        amountOrIdToSwapCV = uintCV(formData.nftId);

        break;

      default:
        setStatus('Unsupported swapping type');
        setLoading(false);
        return;
    }

    switch (type) {
      case 'stx-ft':
      case 'banana-ft':
      case 'xbtc-ft':
      case 'usda-ft':
      case 'stx-nft':
      case 'banana-nft':
      case 'xbtc-nft':
      case 'usda-nft':
        // ft asset in escrow
        factor = factorForType(type);
        amountInSmallestUnitOrNftIdInEscrowCV = uintCV(
          Math.floor(parseFloat(amountSatsRef.current.value.trim()) * factor)
        );

        break;

      case 'satoshible-ft':
      case 'satoshible-nft':
        // nft asset in escrow
        amountInSmallestUnitOrNftIdInEscrowCV = uintCV(
          parseInt(amountSatsRef.current.value.trim())
        );

        break;
      default:
        setStatus('Unsupported swapping type');
        setLoading(false);
        return;
    }

    [feesCV, fees] = await contractToFees(feeContract, amountInSmallestUnitOrNftIdInEscrowCV);
    if (!fees) {
      setLoading(false);
      setStatus("Couldn't load fees.");
      return;
    }
    functionArgs = [swapIdCV, assetContractCV, feesCV];
    postConditions = makeSubmitPostConditions(
      type,
      contract,
      amountInSmallestUnitOrNftIdInEscrowCV,
      ownerStxAddress,
      assetContractAddress,
      assetContractName,
      assetName,
      amountOrIdToSwapCV,
      feeId,
      feeContract,
      fees
    );

    try {
      // submit
      await handleContractCall({
        functionName: 'submit-swap',
        functionArgs,
        postConditionMode: PostConditionMode.Deny,
        postConditions,
        onCancel: () => {
          setLoading(false);
        },
        onFinish: result => {
          console.log(result);
          console.log(result.txId);
          setLoading(false);
          if (result.txId.error) {
            setStatus(result.txId.error + ' ' + result.txId.reason);
            return;
          }
          setTxId(result.txId.txid);
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

  // sell (left to right)
  const sellType = atomicSwap ? type.split('-')[1] : type;
  const sellDecimals =
    sellType === 'stx'
      ? 6
      : type === 'stx-ft' &&
        formData.trait === 'SPN4Y5QPGQA8882ZXW90ADC2DHYXMSTN8VAR8C3X.friedger-token-v1::friedger'
      ? 6
      : type === 'stx-ft' && ftData
      ? ftData.decimals
      : 0;
  const asset = getAsset(sellType, formData.trait);
  const assetName = getAssetName(sellType, formData.trait);
  // buy (right to left)
  const buyWithAsset = buyAssetFromType(type);
  const buyDecimals = buyDecimalsFromType(type);

  const createSellOrder = false;
  return (
    <>
      <h3>
        {id ? null : 'Create'} Swap {buyWithAsset}-{asset} {id ? `#${id}` : null}{' '}
        {formData.doneFromSwap === 1 ? <>(completed)</> : null}
      </h3>
      <Hint type={type} />
      {atomicSwap ? (
        <p>
          Your {buyWithAsset} tokens will be sent to the contract now (including 1% fees) and will
          be released to the buyer if the {assetName} {sellType === 'nft' ? ' is ' : ' are '}{' '}
          transferred to you. If the swap expired after 100 Stacks blocks and you called "cancel"
          your {buyWithAsset} tokens including fees are returned to you.
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
              {(!id || formData.assetSenderFromSwap === ownerStxAddress) && !atomicSwap ? (
                <>
                  Seller (You)
                  <br />
                  <Address addr={ownerStxAddress} />
                </>
              ) : (
                <>
                  <br />
                  Seller
                  {formData.assetSenderFromSwap === ownerStxAddress ||
                  (!atomicSwap && !id) ||
                  (atomicSwap &&
                    id &&
                    ((formData.doneFromSwap === 0 && formData.assetSenderFromSwap === 'none') ||
                      formData.assetSenderFromSwap === `(some ${ownerStxAddress})`))
                    ? ' (You)'
                    : null}
                </>
              )}
              <br />
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  ref={assetSellerRef}
                  defaultValue={
                    (formData.btcRecipient
                      ? formData.btcRecipient
                      : formData.assetSenderFromSwap !== 'none'
                      ? formData.assetSenderFromSwap.substr(
                          6,
                          formData.assetSenderFromSwap.length - 7
                        )
                      : undefined) ||
                    (atomicSwap && id && formData.doneFromSwap === 0 ? ownerStxAddress : '')
                  }
                  onChange={e => setFormData({ ...formData, btcRecipient: e.target.value })}
                  aria-label={
                    atomicSwap
                      ? 'Stacks address or name (optional)'
                      : 'Bitcoin recipient address (must start with 1)'
                  }
                  placeholder={
                    atomicSwap
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
              {previewed && nftSwap(type) && assetUrl ? (
                <img className="m-1" src={assetUrl} width={50} height={50} alt="asset in escrow" />
              ) : (
                <AssetIcon type={sellType} trait={formData.trait} />
              )}
              <br />
              <div className={`input-group ${nftSwap(type) ? '' : 'd-none'}`}>
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
              <div className={`input-group ${nftSwap(type) ? 'd-none' : ''}`}>
                <input
                  type="number"
                  className="form-control"
                  ref={amountRef}
                  value={formData.amount}
                  onChange={e => setFormData({ ...formData, amount: e.target.value })}
                  aria-label={`amount of ${assetName}${type === 'stx' ? '' : ' in smallest unit'}`}
                  placeholder={`amount of ${assetName}${type === 'stx' ? '' : ' in smallest unit'}`}
                  readOnly={id}
                  required
                  minLength="1"
                />
              </div>
              <i className="bi bi-arrow-right"></i>
              <br />
              {!nftSwap(type) && (
                <>
                  <br />
                  <Price
                    sell={{ amount: formData.amount, asset: asset, decimals: sellDecimals }}
                    buy={{
                      amount: formData.amountSats,
                      asset: buyWithAsset,
                      decimals: buyDecimals,
                    }}
                    editablePrice={createSellOrder}
                  />
                  <br />
                  <br />
                </>
              )}
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
                    atomicSwap
                      ? type === 'stx-nft'
                        ? `Price for NFT in STXs`
                        : type === 'banana-nft'
                        ? 'Price of NFT in BANANAs'
                        : `amount of STXs`
                      : type === 'nft'
                      ? `Price for NFT in Bitcoin`
                      : `amount of Bitcoins`
                  }
                  placeholder={
                    atomicSwap
                      ? type === 'stx-nft'
                        ? `Price for NFT in STXs`
                        : type === 'banana-nft'
                        ? 'Price of NFT in BANANAs'
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
              <AssetIcon type={buyAssetTypeFromSwapType(type)} />
            </div>
            <div className="col text-center">
              {(!id || formData.assetSenderFromSwap === ownerStxAddress) && atomicSwap ? (
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
                  ref={assetBuyerRef}
                  value={formData.assetRecipient}
                  onChange={e => setFormData({ ...formData, assetRecipient: e.target.value })}
                  aria-label={`${assetName} receiver's Stacks address`}
                  placeholder={`${assetName} receiver's Stacks address`}
                  readOnly={(id && formData.assetRecipientFromSwap) || atomicSwap}
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
          {atomicSwap && (
            // fees
            <div className="row m-2">
              <div className="col" />
              <div className="col text-center">
                <select
                  className="form-select form-select-sm"
                  ref={feeContractRef}
                  value={formData.feeId || (type === 'banana-nft' ? 'banana' : 'stx')}
                  onChange={e => setFormData({ ...formData, feeId: e.target.value })}
                  disabled={id}
                  aria-label="select fee model"
                >
                  {feeOptions.map((feeOption, index) => (
                    <option value={feeOption.type} key={index}>
                      {feeOption.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col" />
            </div>
          )}
          <div className="row m-2">
            <div className="col-12 text-center">
              {!ownerStxAddress ? (
                <>
                  <button
                    className="btn btn-lg btn-outline-primary mt-4"
                    type="button"
                    onClick={handleSignIn}
                  >
                    Get Started
                  </button>
                </>
              ) : (
                <>
                  {id &&
                    (formData.assetSenderFromSwap === ownerStxAddress ||
                      (atomicSwap && formData.assetRecipientFromSwap === ownerStxAddress)) &&
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
                    atomicSwap ? (
                      formData.doneFromSwap === 1 ? (
                        <>
                          <button className="btn btn-block btn-success" type="button" disabled>
                            Completed
                          </button>
                        </>
                      ) : (
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
                      ) // handle buy with btc
                    ) : formData.assetRecipientFromSwap ? (
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
                    <button
                      className="btn btn-block btn-primary"
                      type="button"
                      onClick={previewed ? createAction : previewAction}
                    >
                      <div
                        role="status"
                        className={`${
                          loading ? '' : 'd-none'
                        } spinner-border spinner-border-sm text-info align-text-top mr-2`}
                      />
                      {previewed ? (
                        <>
                          {atomicSwap ? 'Buy' : 'Sell'} {asset}
                        </>
                      ) : (
                        <>Preview {asset} swap</>
                      )}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </form>
      {txId && <TxStatus txId={txId} />}
    </>
  );
}

const Hint = ({ type }) => {
  return (
    <>
      {type === 'nft' && (
        <p>For a swap of Bitcoins and an NFT on Stacks, the NFT has to comply with SIP-9.</p>
      )}
      {type === 'ft' && (
        <p>For a swap of Bitcoins and a token on Stacks, the token has to comply with SIP-10.</p>
      )}
      {type === 'stx-ft' && (
        <p>For a swap of Stacks and a token on Stacks, the token has to comply with SIP-10.</p>
      )}
      {type === 'stx-nft' && (
        <p>For a swap of Stacks and a NFT on Stacks, the token has to comply with SIP-9.</p>
      )}
      {type === 'stx-nft' && (
        <p>For a swap of Stacks and a NFT on Stacks, the token has to comply with SIP-9.</p>
      )}
      {type === 'banana-nft' && (
        <p>For a swap of BANANAs and a NFT on Stacks, the NFT has to comply with SIP-9.</p>
      )}
    </>
  );
};
