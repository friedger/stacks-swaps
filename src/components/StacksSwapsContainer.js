import React, { useEffect, useState } from 'react';
import { userSessionState } from '../lib/auth';
import { useStxAddresses } from '../lib/hooks';
import { useAtomValue } from 'jotai/utils';
import { StacksSwapsDashboard } from './StacksSwapsDashboard';
import { SwapCreate } from './SwapCreate';
import { SwapSubmit } from './SwapSubmit';
import { fetchSwapsEntry, optionalCVToString } from '../lib/transactions';
import { ClarityType, cvToString } from '@stacks/transactions';
import { feeContracts, infoApi, smartContractsApi } from '../lib/constants';
import { pubscriptCVToBtcAddress } from '../lib/btcTransactions';
import { getFTData } from '../lib/fungibleTokens';

export function StacksSwapsContainer({ type, trait, id, nftId }) {
  const userSession = useAtomValue(userSessionState);
  const { ownerStxAddress } = useStxAddresses(userSession);

  const buyWithStx = type.startsWith('stx-');
  const [loadingSwapEntry, setLoadingSwapEntry] = useState();
  const [swapsEntry, setSwapsEntry] = useState();
  const [invalidSwapId, setInvalidSwapId] = useState(false);
  const [blockHeight, setBlockHeight] = useState(0);
  const [status, setStatus] = useState();
  const [formData, setFormData] = useState({
    trait: trait,
    btcRecipient: '',
    amountSats: '',
    assetRecipient: '',
    amount: '',
    nftId: nftId,
    assetSenderFromSwap: '',
  });

  useEffect(() => {
    if (buyWithStx) {
      setFormData({
        trait: trait,
        btcRecipient: '',
        amountSats: '',
        assetRecipient: ownerStxAddress,
        amount: '',
        nftId: nftId,
        assetSenderFromSwap: '',
      });
    }
  }, [buyWithStx, ownerStxAddress, nftId, trait]);

  useEffect(() => {
    infoApi.getCoreApiInfo().then(info => {
      setBlockHeight(info.stacks_tip_height);
    });

    if (type && id) {
      setLoadingSwapEntry(true);
      try {
        console.log('fetch swap entry');
        const asyncFetchSwapEntry = async () => {
          const swapsEntry = await fetchSwapsEntry(type, id);
          console.log(swapsEntry);
          const buyWithStx = type.startsWith('stx-');
          if (swapsEntry) {
            setSwapsEntry(swapsEntry);
            const whenFromSwap = swapsEntry.data['when'].value.toNumber();
            const doneFromSwap = swapsEntry.data['done']
              ? swapsEntry.data['done'].value.toNumber()
              : swapsEntry.data['open'].type === ClarityType.BoolTrue
              ? 0
              : 1;
            const btcRecipient = buyWithStx
              ? undefined
              : pubscriptCVToBtcAddress(swapsEntry.data['btc-receiver']);
            const amountBtcOrStx = buyWithStx
              ? swapsEntry.data.ustx.value.toNumber() / 1_000_000
              : swapsEntry.data.sats.value.toNumber() / 100_000_000;
            let trait, ftData, contractAddress, contractName, ctrInterface;
            switch (type) {
              case 'ft':
                trait = cvToString(swapsEntry.data['ft']);
                [contractAddress, contractName] = trait.split('.');
                ftData = getFTData(contractAddress, contractName);

                setFormData({
                  btcRecipient,
                  amountSats: amountBtcOrStx,
                  trait: trait + '::' + ftData.assetName,
                  amount: swapsEntry.data.amount.value.toNumber() / Math.pow(10, ftData.decimals),
                  assetRecipient: optionalCVToString(swapsEntry.data['ft-receiver']),
                  assetRecipientFromSwap: optionalCVToString(swapsEntry.data['ft-receiver']),
                  assetSenderFromSwap: cvToString(swapsEntry.data['ft-sender']),
                  whenFromSwap,
                  doneFromSwap,
                });
                break;
              case 'stx':
                setFormData({
                  btcRecipient,
                  amountSats: amountBtcOrStx,
                  amount: swapsEntry.data.ustx.value.toNumber() / Math.pow(10, 6),
                  assetRecipient: optionalCVToString(swapsEntry.data['stx-receiver']),
                  assetRecipientFromSwap: optionalCVToString(swapsEntry.data['stx-receiver']),
                  assetSenderFromSwap: cvToString(swapsEntry.data['stx-sender']),
                  whenFromSwap,
                  doneFromSwap,
                });
                break;
              case 'nft':
                trait = cvToString(swapsEntry.data['nft']);
                [contractAddress, contractName] = trait.split('.');
                console.log({ contractAddress, contractName });
                ctrInterface = await smartContractsApi.getContractInterface({
                  contractAddress,
                  contractName,
                });
                const nft =
                  ctrInterface.non_fungible_tokens.length === 1
                    ? ctrInterface.non_fungible_tokens[0].name
                    : undefined;
                console.log({ nft });

                setFormData({
                  btcRecipient,
                  amountSats: amountBtcOrStx,
                  trait: trait + '::' + nft,
                  nftId: swapsEntry.data['nft-id'].value.toNumber(),
                  assetRecipient: cvToString(swapsEntry.data['nft-receiver']),
                  assetRecipientFromSwap: cvToString(swapsEntry.data['nft-receiver']),
                  assetSenderFromSwap: cvToString(swapsEntry.data['nft-sender']),
                  whenFromSwap,
                  doneFromSwap,
                });
                break;
              case 'stx-ft':
                trait = cvToString(swapsEntry.data['ft']);
                const [feeAddress, feeName] = cvToString(swapsEntry.data['fees']).split('.');
                const feeId = Object.entries(feeContracts).find(
                  e => e[1].address === feeAddress && e[1].name === feeName
                );
                [contractAddress, contractName] = trait.split('.');
                ftData = await getFTData(contractAddress, contractName);
                setFormData({
                  btcRecipient,
                  amountSats: amountBtcOrStx,
                  trait: trait + '::' + ftData.assetName,
                  amount: swapsEntry.data.amount.value.toNumber() / Math.pow(10, ftData.decimals),
                  assetRecipient: cvToString(swapsEntry.data['stx-sender']),
                  assetRecipientFromSwap: cvToString(swapsEntry.data['stx-sender']),
                  assetSenderFromSwap: cvToString(swapsEntry.data['ft-sender']),
                  whenFromSwap,
                  doneFromSwap,
                  feeId: feeId ? feeId[0] : 'stx', // TODO better fall back
                });
                break;
              default:
                console.log('unsupported type ' + type);
            }
          } else {
            setInvalidSwapId(true);
          }
          setLoadingSwapEntry(false);
        };
        asyncFetchSwapEntry();
      } catch (e) {
        setStatus(`Error: couldn't load swap details for swap ${id}`);
        console.log({ e });
        setLoadingSwapEntry(false);
      }
    }
  }, [type, id]);
  const hideSubmit = id && !buyWithStx ? '' : 'd-none';
  return (
    <div>
      <ul className="nav nav-tabs">
        <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            id="dashboard-tab"
            data-bs-toggle="tab"
            data-bs-target="#dashboard"
            type="button"
            role="tab"
            aria-controls="dashboard"
            aria-selected="true"
          >
            Dashboard
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            id="createswap-tab"
            data-bs-toggle="tab"
            data-bs-target="#createswap"
            type="button"
            role="tab"
            aria-controls="createswap"
            aria-selected="true"
          >
            {formData.doneFromSwap === 1 || id ? 'Swap Details' : 'Create Swap'}
          </button>
        </li>
        <li className={`nav-item ${hideSubmit}`} role="presentation">
          <button
            className="nav-link"
            id="miningclaim-tab"
            data-bs-toggle="tab"
            data-bs-target="#miningclaim"
            type="button"
            role="tab"
            aria-controls="miningclaim"
            aria-selected="true"
          >
            Confirm Bitcoin Tx
          </button>
        </li>
      </ul>

      {loadingSwapEntry ? (
        <div className="container">
          <div className="row align-items-center">
            <div className="col text-center">
              <div role="status" className={`spinner-grow text-primary align-text-top m-5`} />
              <div role="status" className={`spinner-grow text-primary align-text-top m-5`} />
              <div role="status" className={`spinner-grow text-primary align-text-top m-5`} />
            </div>
          </div>
        </div>
      ) : invalidSwapId ? (
        <div className="container">
          <div className="row align-items-center">
            <div className="col text-center">Invalid Swap Id {id}</div>
          </div>
        </div>
      ) : (
        <div className="tab-content mt-3" id="myTabContent">
          <div
            className="tab-pane fade  show active"
            id="createswap"
            role="tabpanel"
            aria-labelledby="createswap-tab"
          >
            <SwapCreate
              ownerStxAddress={ownerStxAddress}
              type={type}
              trait={formData.trait}
              id={id}
              nftId={nftId}
              formData={formData}
              blockHeight={blockHeight}
              userSession={userSession}
            />
          </div>
          <div
            className={`tab-pane fade show active ${hideSubmit}`}
            id="miningclaim"
            role="tabpanel"
            aria-labelledby="miningclaim-tab"
          >
            <SwapSubmit
              ownerStxAddress={ownerStxAddress}
              type={type}
              trait={id ? formData.trait : trait}
              id={id}
              formData={formData}
              userSession={userSession}
            />
          </div>
          <div
            className="tab-pane fade  show active"
            id="dashboard"
            role="tabpanel"
            aria-labelledby="dashboard-tab"
          >
            <StacksSwapsDashboard type={type} />
          </div>
        </div>
      )}
    </div>
  );
}
