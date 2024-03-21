import { fetchAccountBalances } from '@stacks/blockchain-api-client';
import {
  AnchorMode,
  FungibleConditionCode,
  NonFungibleConditionCode,
  PostConditionMode,
  createAssetInfo,
  makeContractFungiblePostCondition,
  makeContractNonFungiblePostCondition,
  makeContractSTXPostCondition,
  makeStandardFungiblePostCondition,
  makeStandardNonFungiblePostCondition,
  makeStandardSTXPostCondition,
  noneCV,
  principalCV,
  someCV,
  standardPrincipalCV,
  uintCV,
} from '@stacks/transactions';
import { Fragment, useEffect, useState } from 'react';
import { NETWORK, contracts, ftFeeContracts, nftFeeContracts } from '../lib/constants';
import { TxStatus } from './TxStatus';

import { c32ToB58 } from 'c32check';
import { resolveBNS } from '../lib/account';
import {
  assetInEscrowFromType,
  assetTypeInEscrowFromSwapType,
  buyAssetFromType,
  buyDecimalsFromType2,
  factorAssetForSaleFromSwapType,
  factorAssetInEscrowFromSwapType,
  getBuyLabelFromType2,
  isAtomic,
  resolveImageForNFT,
  resolveOwnerForNFT,
  splitAssetIdentifier,
} from '../lib/assets';
import { btcAddressToPubscriptCV } from '../lib/btcTransactions';
import { contractToFees } from '../lib/fees';
import { useAuth, useOpenContractCall } from '../lib/hooks';
import {
  getAssetInEscrow,
  isAssetForSaleANonFungibleToken,
  isAssetInEscrowANonFungibleToken,
  makeCancelSwapPostConditions,
  makeCreateSwapPostConditions,
  makeSubmitPostConditions,
} from '../lib/swaps';
import { getFTData, getNFTData } from '../lib/tokenData';
import { saveTxData } from '../lib/transactions';
import GetStartedButton from './GetStartedButton';
import SwapForm from './SwapCreateForm';
import {
  BANANA_TOKEN,
  SATOSHIBLES,
  USDA_TOKEN,
  XBTC_TOKEN,
  getAsset,
  getAssetName,
} from './assets';

export function SwapCreate({
  ownerStxAddress,
  type,
  trait,
  id,
  formDataInitial,
  blockHeight,
  feeOptions,
}) {
  const [txId, setTxId] = useState();
  const [loading, setLoading] = useState();
  const [status, setStatus] = useState();
  const [formData, setFormData] = useState(formDataInitial);
  const [ftData, setFtData] = useState();
  const [previewed, setPreviewed] = useState(false);
  const [assetForSaleUrl, setAssetForSaleUrl] = useState();
  const [assetInEscrowUrl, setAssetInEscrowUrl] = useState();
  console.log({ formDataInitial, formData });

  useEffect(() => {
    setFormData(formDataInitial);
  }, [formDataInitial]);

  const contract = contracts[type];
  const { openContractCall } = useOpenContractCall();
  const { openAuthRequest } = useAuth();

  const atomicSwap = isAtomic(type);

  const getFeeOption = type => (feeOptions ? feeOptions.find(f => f.type === type) : undefined);

  useEffect(() => {
    console.log({ type, formData });
    if (type === 'stx-ft' && formData && formData.traitForSale) {
      const [contractId] = formData.traitForSale.split('::');
      const [address, name] = contractId.split('.');
      getFTData(address, name).then(result => {
        console.log({ ftData: result });
        setFtData(result);
      });
    } else if (type === 'stx-nft' && formData && formData.traitForSale) {
      const [contractId] = formData.traitForSale.split('::');
      const [address, name] = contractId.split('.');
      getNFTData(address, name).then(result => {
        console.log({ nftData: result });
      });
    }
  }, [formData, type]);

  const createAction = async () => {
    setLoading(true);
    setStatus('');
    let seller = formData.sellerAddress;
    const factorForEscrow = factorAssetInEscrowFromSwapType(type);
    const amountISUOrIdInEscrowCV = uintCV(
      Math.floor(parseFloat(formData.amountOrIdInEscrow) * factorForEscrow)
    );

    const factorForSale = factorAssetForSaleFromSwapType(type, trait);
    const amountISUOrIdForSaleCV = uintCV(
      Math.floor(parseFloat(formData.amountOrIdForSale) * factorForSale)
    );
    const errors = await verifyCreateForm();
    if (errors.length > 0) {
      setLoading(false);
      setStatus(
        errors.map((e, index) => (
          <Fragment key={index}>
            {e}
            <br />
          </Fragment>
        ))
      );
      return;
    }

    seller = await resolveBNS(formData.sellerAddress);
    const sellerCV = seller ? someCV(principalCV(seller)) : noneCV();
    const buyerAddressCV = btcAddressToPubscriptCV(formData.buyerBtcAddress);
    let functionArgs, postConditions;
    let ftAmountCV, nftIdCV;
    let feeId, feeContract, feesCV, fees;
    let assetContractAddress, assetContractName, assetName, assetContractCV;
    switch (type) {
      // catamaran swaps
      case 'nft':
        if (!buyerAddressCV) {
          setStatus('Buyer address must be set.');
          setLoading(false);
          return;
        }
        nftIdCV = uintCV(formData.amountOrIdInEscrow);
        const nftReceiverCV = principalCV(seller);
        [assetContractCV, assetName, assetContractName, assetContractAddress] =
          splitAssetIdentifier(formData.traitInEscrow);
        if (!assetName) {
          setLoading(false);
          setStatus('"nft contract :: nft name" must be set');
          return;
        }
        functionArgs = [amountISUOrIdForSaleCV, sellerCV, nftIdCV, nftReceiverCV, assetContractCV];
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
        ftAmountCV = uintCV(formData.amountOrIdInEscrow);
        if (ftAmountCV.value <= 0) {
          setLoading(false);
          setStatus('positive numbers required to swap');
          return;
        }
        const ftReceiverCV = formData.seller
          ? someCV(standardPrincipalCV(formData.seller))
          : noneCV();
        [assetContractCV, assetName, assetContractName, assetContractAddress] =
          splitAssetIdentifier(formData.traitInEscrow);
        if (!assetName) {
          setLoading(false);
          setStatus('"ft contract :: ft name" must be set');
          return;
        }

        functionArgs = [
          amountISUOrIdForSaleCV,
          buyerAddressCV,
          amountISUOrIdInEscrowCV,
          ftReceiverCV,
          assetContractCV,
        ];
        postConditions = [
          makeStandardFungiblePostCondition(
            ownerStxAddress,
            FungibleConditionCode.Equal,
            amountISUOrIdInEscrowCV.value,
            createAssetInfo(assetContractAddress, assetContractName, assetName)
          ),
        ];
        break;
      case 'stx':
        if (amountISUOrIdInEscrowCV.value <= 0) {
          setLoading(false);
          setStatus('positive numbers required to swap');
          return;
        }
        const stxReceiverCV = formData.sellerAddress
          ? someCV(principalCV(formData.sellerAddress))
          : noneCV();
        functionArgs = [
          amountISUOrIdForSaleCV,
          buyerAddressCV,
          amountISUOrIdInEscrowCV,
          stxReceiverCV,
        ];
        postConditions = [
          makeStandardSTXPostCondition(
            ownerStxAddress,
            FungibleConditionCode.Equal,
            amountISUOrIdInEscrowCV.value
          ),
        ];
        break;

      // atomic swaps
      case 'stx-ft':
      case 'banana-ft':
      case 'satoshible-ft':
      case 'xbtc-ft':
      case 'usda-ft':
        [assetContractCV, assetName] = splitAssetIdentifier(formData.traitForSale);
        if (!assetName) {
          setLoading(false);
          setStatus('"ft contract :: ft name" must be set');
          return;
        }
        feeId = formData.feeId;
        feeContract = getFeeOption(feeId).contract;
        [feesCV, fees] = await contractToFees(feeContract, amountISUOrIdInEscrowCV);
        functionArgs = [
          amountISUOrIdInEscrowCV,
          amountISUOrIdForSaleCV,
          sellerCV,
          assetContractCV,
          feesCV,
        ];
        postConditions = makeCreateSwapPostConditions(
          type,
          feeId,
          ownerStxAddress,
          amountISUOrIdInEscrowCV,
          fees,
          feeContract
        );
        break;
      case 'stx-nft':
      case 'banana-nft':
      case 'satoshible-nft':
      case 'xbtc-nft':
      case 'usda-nft':
        nftIdCV = uintCV(formData.amountOrIdForSale);
        if (nftIdCV.value <= 0) {
          setLoading(false);
          setStatus('positive numbers required to swap');
          return;
        }
        [assetContractCV, assetName] = splitAssetIdentifier(formData.traitForSale);
        if (!assetName) {
          setLoading(false);
          setStatus('"nft contract :: nft name" must be set');
          return;
        }
        feeId = formData.feeId;
        feeContract = getFeeOption(feeId).contract;
        [feesCV, fees] = await contractToFees(feeContract, amountISUOrIdInEscrowCV);
        functionArgs = [amountISUOrIdInEscrowCV, nftIdCV, sellerCV, assetContractCV, feesCV];
        postConditions = makeCreateSwapPostConditions(
          type,
          feeId,
          ownerStxAddress,
          amountISUOrIdInEscrowCV,
          fees,
          feeContract
        );
        break;
      default:
        setLoading(false);
        setStatus('Unsupported type');
        return;
    }
    await openContractCall({
      contractAddress: contract.address,
      contractName: contract.name,
      anchorMode: AnchorMode.Any,
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
        saveTxData(result)
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

  const hasInsufficientBalance = async amountInEscrowCV => {
    const balances = await fetchAccountBalances({
      url: NETWORK.coreApiUrl,
      principal: ownerStxAddress,
    });

    if (isAtomic(type)) {
      const feeId = formData.feeId;
      console.log({ feeId });
      const feeContract = nftFeeContracts[feeId];
      const [, fees] = await contractToFees(feeContract, amountInEscrowCV);
      const feesInSameAsset = type.startsWith(feeId + '-');
      const requiredAsset = amountInEscrowCV.value + (feesInSameAsset ? fees : BigInt(0));
      console.log(balances.stx.balance, requiredAsset, balances.stx.balance < requiredAsset);

      switch (type) {
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
    } else {
      switch (type) {
        case 'stx':
          return balances.stx.balance < amountInEscrowCV.value;
        default:
          return false;
      }
    }
  };

  const verifyCreateForm = async () => {
    const errors = [];
    const factorForEscrow = factorAssetInEscrowFromSwapType(type);
    const amountISUOrIdInEscrowCV = uintCV(
      Math.floor(parseFloat(formData.amountOrIdInEscrow) * factorForEscrow)
    );

    if (!atomicSwap && !formData.buyerBtcAddress) {
      errors.push('BTC address is required');
    }
    if (!atomicSwap) {
      try {
        btcAddressToPubscriptCV(formData.buyerBtcAddress);
      } catch (e) {
        console.log({ seller, e });
        errors.push('Invalid BTC address');
      }
    }
    if (formData.amountOrIdInEscrow <= 0) {
      errors.push('positive amount required to swap');
    }
    if (isAssetForSaleANonFungibleToken(type) && isNaN(parseInt(formData.amountOrIdForSale))) {
      errors.push('not a valid NFT id');
    }
    if (isAtomic(type) && !formData.traitForSale) {
      errors.push('Missing token contract');
    }
    try {
      // TODO handle fee checks for NFT swaps
      if (await hasInsufficientBalance(amountISUOrIdInEscrowCV)) {
        errors.push('wallet has insufficient balance');
      }
    } catch (e) {
      console.log(e);
    }

    if (
      formData.sellerAddress === 'SP6P4EJF0VG8V0RB3TQQKJBHDQKEF6NVRD1KZE3C.stacksbridge-satoshibles'
    ) {
      errors.push("Can't swap from Stacks bridge");
    }
    if (
      formData.sellerAddress === 'SP2KAF9RF86PVX3NEE27DFV1CQX0T4WGR41X3S45C.btc-monkeys-staking'
    ) {
      errors.push("Can't swap staked monkey");
    }

    return errors;
  };

  const previewAction = async () => {
    setLoading(true);
    setStatus('');
    const errors = await verifyCreateForm();
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
    if (isAtomic(type)) {
      const [, , contractName, contractAddress] = splitAssetIdentifier(formData.traitForSale);
      if (isAssetForSaleANonFungibleToken(type)) {
        try {
          const image = await resolveImageForNFT(
            contractAddress,
            contractName,
            formData.amountOrIdForSale
          );
          if (image) {
            setAssetForSaleUrl(image);
          }
        } catch (e) {
          // ignore
          console.log(e);
          setStatus('NFT image not found');
        }
        try {
          const account = await resolveOwnerForNFT(
            contractAddress,
            contractName,
            formData.amountOrIdForSale,
            false
          );
          setFormData({ ...formData, sellerAddress: account });
        } catch (e) {
          console.log(e);
        }
      }

      if (type.startsWith('satoshible-')) {
        const [, , contractName, contractAddress] = splitAssetIdentifier(SATOSHIBLES);
        try {
          const image = await resolveImageForNFT(
            contractAddress,
            contractName,
            formData.amountOrIdInEscrow
          );
          if (image) {
            setAssetInEscrowUrl(image);
          }
        } catch (e) {
          // ignore
          console.log(e);
          setStatus('NFT image not found');
        }
        try {
          const account = await resolveOwnerForNFT(
            contractAddress,
            contractName,
            formData.amountOrIdInEscrow,
            true
          );
          if (account !== ownerStxAddress) {
            console.log(account, ownerStxAddress, formData.amountOrIdInEscrow);
            setStatus("You don't own this Satoshible");
            setLoading(false);
            return;
          }
        } catch (e) {
          console.log(e);
        }
      }
    }

    setPreviewed(true);
    setLoading(false);
  };

  const setRecipientAction = async () => {
    setLoading(true);
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
    await openContractCall({
      contractAddress: contract.address,
      contractName: contract.name,
      anchorMode: AnchorMode.Any,
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
    let assetContractCV, assetName, assetContractName, assetContractAddress;
    let feeId, feeContract, feesCV, fees;
    const factor = factorAssetInEscrowFromSwapType(type);
    const amountISUOrIdInEscrowCV = uintCV(
      Math.floor(parseFloat(formData.amountOrIdInEscrow) * factor)
    );

    switch (type) {
      case 'nft':
        [, assetName, assetContractName, assetContractAddress] = splitAssetIdentifier(
          formData.traitInEscrow
        );
        functionArgs = [swapIdCV];
        postConditions = [
          makeContractNonFungiblePostCondition(
            contract.address,
            contract.name,
            NonFungibleConditionCode.DoesNotOwn,
            createAssetInfo(assetContractAddress, assetContractName, assetName),
            amountISUOrIdInEscrowCV
          ),
        ];

        break;
      case 'ft':
        [, assetName, assetContractName, assetContractAddress] = splitAssetIdentifier(
          formData.traitInEscrow
        );
        functionArgs = [swapIdCV];
        postConditions = [
          makeContractFungiblePostCondition(
            contract.address,
            contract.name,
            FungibleConditionCode.Equal,
            amountISUOrIdInEscrowCV,
            createAssetInfo(assetContractAddress, assetContractName, assetName)
          ),
        ];
        break;
      case 'stx':
        functionArgs = [swapIdCV];
        postConditions = [
          makeContractSTXPostCondition(
            contract.address,
            contract.name,
            FungibleConditionCode.Equal,
            Number(amountISUOrIdInEscrowCV.value)
          ),
        ];
        break;
      case 'stx-ft':
      case 'banana-ft':
      case 'xbtc-ft':
      case 'usda-ft':
      case 'satoshible-ft':
        [assetContractCV, assetName, assetContractName, assetContractAddress] =
          splitAssetIdentifier(formData.traitForSale);
        if (!assetName) {
          setLoading(false);
          setStatus('"ft contract :: ft name" must be set');
          return;
        }
        feeId = formData.feeId;
        feeContract = ftFeeContracts[feeId];
        [feesCV, fees] = await contractToFees(feeContract, amountISUOrIdInEscrowCV);
        functionArgs = [swapIdCV, assetContractCV, feesCV];
        postConditions = makeCancelSwapPostConditions(
          type,
          contract,
          amountISUOrIdInEscrowCV,
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
        [assetContractCV, assetName, assetContractName, assetContractAddress] =
          splitAssetIdentifier(formData.traitForSale);
        if (!assetName) {
          setLoading(false);
          setStatus('"ft contract :: ft name" must be set');
          return;
        }
        feeId = formData.feeId;
        feeContract = nftFeeContracts[feeId];
        [feesCV, fees] = await contractToFees(feeContract, amountISUOrIdInEscrowCV);
        functionArgs = [swapIdCV, assetContractCV, feesCV];
        postConditions = makeCancelSwapPostConditions(
          type,
          contract,
          amountISUOrIdInEscrowCV,
          feeId,
          feeContract,
          fees
        );
        break;

      default:
        setLoading(false);
        return;
    }
    await openContractCall({
      contractAddress: contract.address,
      contractName: contract.name,
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
        saveTxData(result)
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

    let amountOrIdForSaleCV;
    let amountISUOrIdInEscrowCV;
    let assetContractCV, assetName, assetContractName, assetContractAddress;
    let factor;
    let feesCV, fees;

    // asset to swap (not in escrow)
    [assetContractCV, assetName, assetContractName, assetContractAddress] = splitAssetIdentifier(
      formData.traitForSale
    );

    const feeId = formData.feeId;
    const feeContract = getFeeOption(feeId).contract;

    switch (type) {
      case 'stx-ft':
      case 'banana-ft':
      case 'xbtc-ft':
      case 'usda-ft':
      case 'satoshible-ft':
        // price for escrowed asset
        // to be paid by user
        factor = factorAssetForSaleFromSwapType(type, formData.traitForSale);
        amountOrIdForSaleCV = uintCV(formData.amountOrIdForSale * factor);
        break;

      case 'stx-nft':
      case 'banana-nft':
      case 'xbtc-nft':
      case 'usda-nft':
      case 'satoshible-nft':
        // nft for escrowed asset
        // to be sent by user
        amountOrIdForSaleCV = uintCV(formData.amountOrIdForSale);

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
        factor = factorAssetInEscrowFromSwapType(type);
        amountISUOrIdInEscrowCV = uintCV(
          Math.floor(parseFloat(formData.amountOrIdInEscrow) * factor)
        );

        break;

      case 'satoshible-ft':
      case 'satoshible-nft':
        // nft asset in escrow
        amountISUOrIdInEscrowCV = uintCV(parseInt(formData.amountOrIdInEscrow));

        break;
      default:
        setStatus('Unsupported swapping type');
        setLoading(false);
        return;
    }

    [feesCV, fees] = await contractToFees(feeContract, amountISUOrIdInEscrowCV);
    if (!fees) {
      setLoading(false);
      setStatus("Couldn't load fees.");
      return;
    }
    functionArgs = [swapIdCV, assetContractCV, feesCV];
    postConditions = makeSubmitPostConditions(
      type,
      contract,
      amountISUOrIdInEscrowCV,
      ownerStxAddress,
      assetContractAddress,
      assetContractName,
      assetName,
      amountOrIdForSaleCV,
      feeId,
      feeContract,
      fees
    );

    try {
      // submit
      await openContractCall({
        contractAddress: contract.address,
        contractName: contract.name,
        anchorMode: AnchorMode.Any,
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
          saveTxData(result)
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

  const onFormUpdate = ({ property, value }) => {
    setPreviewed(false);
    const newValue = {};
    newValue[property] = value.trim();
    console.log('Updating', property, value);
    setFormData({ ...formData, ...newValue });
  };

  // sell (right to left)
  const sellType2 = atomicSwap ? type.split('-')[1] : 'btc';
  const sellDecimals2 =
    sellType2 === 'stx'
      ? 6
      : sellType2 === 'ft' &&
          formData.trait === 'SPN4Y5QPGQA8882ZXW90ADC2DHYXMSTN8VAR8C3X.friedger-token-v1::friedger'
        ? 6
        : sellType2 === 'ft' && ftData
          ? Number(ftData.decimals)
          : 8;
  console.log({ sellDecimals2 }, ftData?.decimals);
  const asset = getAsset(sellType2, formData.traitForSale);
  const assetName = getAssetName(sellType2, formData.traitForSale);
  // buy (left to right)
  const buyWithAsset = buyAssetFromType(type);

  //
  // buyer
  //
  const buyer = {
    address: formData.buyerAddress,
    btcAddress: formData.buyerBtcAddress,
    isOwner: formData.buyerAddress === ownerStxAddress,
    inputOfBtcAddress: sellType2 === 'btc',
  };
  console.log(buyer, formData);
  // sent by buyer
  const assetInEscrowIsNFT = isAssetInEscrowANonFungibleToken(type);
  const assetInEscrow = {
    isNFT: assetInEscrowIsNFT,
    type: assetTypeInEscrowFromSwapType(type),
    trait: getAssetInEscrow(type),
    label: getBuyLabelFromType2(type),
    amountOrId: formData.amountOrIdInEscrow,
    asset: assetInEscrowFromType(type),
    decimals: buyDecimalsFromType2(type),
  };

  //
  // seller
  //
  const sellerAddress = atomicSwap
    ? formData.sellerAddress || (id && formData.doneFromSwap === 0 ? ownerStxAddress : '')
    : formData.sellerAddress;
  let sellerBtcAddress;
  try {
    sellerBtcAddress = sellerAddress ? c32ToB58(sellerAddress) : '';
  } catch (e) {}
  console.log(sellerAddress, formData.sellerAddress);
  const seller = {
    address: sellerAddress,
    btcAddress: sellerBtcAddress,
    isOwner: sellerAddress === ownerStxAddress,
  };

  // sent by seller
  const assetForSaleIsNFT = isAssetForSaleANonFungibleToken(type);
  const assetForSaleType = sellType2;
  const assetForSale = {
    isNFT: assetForSaleIsNFT,
    type: assetForSaleType,
    trait: formData.traitForSale,
    label: assetForSaleIsNFT
      ? 'ID of NFT'
      : `amount of ${getAssetName(assetForSaleType, formData.traitForSale)}`,
    amountOrId: formData.amountOrIdForSale,
    asset: getAsset(assetForSaleType, formData.traitForSale),
    decimals: sellDecimals2,
  };

  const getActionFromSwap = () => {
    if (
      id &&
      (formData.buyerAddress === ownerStxAddress || !atomicSwap) &&
      formData.whenFromSwap + 100 < blockHeight &&
      formData.doneFromSwap === 0
    ) {
      return ['Cancel swap', cancelAction];
    }
    if (id) {
      if (atomicSwap) {
        if (formData.doneFromSwap === 1) {
          return ['Completed'];
        } else {
          if (formData.sellerAddress && formData.sellerAddress !== ownerStxAddress) {
            return ['In progress'];
          } else {
            return [`Sell ${asset}`, submitAction];
          }
        }
      } else {
        // handle buy with btc
        if (formData.doneFromSwap === 1) {
          return ['Completed'];
        } else {
          if (formData.sellerAddress) {
            if (formData.sellerAddress === ownerStxAddress) {
              return ['Make your BTC tx using a BTC wallet'];
            } else {
              return ['In progress'];
            }
          } else {
            return [`Sell ${asset}`, setRecipientAction];
          }
        }
      }
    } else {
      // create new swap
      if (previewed) {
        return [`${atomicSwap ? 'Buy' : 'Sell'} ${asset}`, createAction];
      } else {
        return [`Preview ${asset} swap`, previewAction];
      }
    }
  };
  const [action, onAction] = getActionFromSwap();
  console.log({ done: formData.doneFromSwap });
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
          be released to the buyer if the {assetName} {sellType2 === 'nft' ? ' is ' : ' are '}{' '}
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
      {!ownerStxAddress ? (
        <GetStartedButton openAuthRequest={openAuthRequest} />
      ) : (
        <SwapForm
          atomicSwap={atomicSwap}
          swapId={id}
          done={formData.doneFromSwap === 1}
          buyer={buyer}
          assetInEscrow={assetInEscrow}
          assetInEscrowUrl={assetInEscrowUrl}
          seller={seller}
          assetForSale={assetForSale}
          assetForSaleUrl={assetForSaleUrl}
          when={formData.whenFromSwap}
          blockHeight={blockHeight}
          showFees={!assetForSale.isNFT || !assetInEscrow.isNFT}
          feeOptions={feeOptions}
          feeId={formData.feeId}
          feeReceiver="SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9"
          onFormUpdate={onFormUpdate}
          action={action}
          onAction={onAction}
          loading={loading}
          status={status}
          ownerStxAddress={ownerStxAddress}
        />
      )}
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
