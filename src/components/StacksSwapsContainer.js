import React, { useEffect, useState } from 'react';
import { useStxAddresses } from '../lib/hooks';
import { StacksSwapsDashboard } from './StacksSwapsDashboard';
import { SwapCreate } from './SwapCreate';
import { SwapSubmit } from './SwapSubmit';
import { fetchSwapsEntry } from '../lib/transactions';
import { feeOptionsByType, infoApi } from '../lib/constants';
import { isAtomic, setFromDataFromSwapsEntry } from '../lib/assets';

export function StacksSwapsContainer({ type, trait, id, nftId }) {
  const { ownerStxAddress } = useStxAddresses();

  const atomicSwap = isAtomic(type);

  const [loadingSwapEntry, setLoadingSwapEntry] = useState();
  const [invalidSwapId, setInvalidSwapId] = useState(false);
  const [blockHeight, setBlockHeight] = useState(0);
  const [formData, setFormData] = useState({
    trait: trait,
    btcRecipient: '',
    amountSats: '',
    nftId: nftId,
    assetRecipient: '',
    amount: '',
    assetSenderFromSwap: '',
  });

  useEffect(() => {
    if (atomicSwap) {
      setFormData({
        trait: trait,
        btcRecipient: '',
        amountSats: '',
        nftId: nftId,
        assetRecipient: ownerStxAddress,
        amount: '',
        assetSenderFromSwap: '',
      });
    }
  }, [atomicSwap, ownerStxAddress, trait, nftId]);

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
          if (swapsEntry) {
            await setFromDataFromSwapsEntry(swapsEntry, type, setFormData);
          } else {
            setInvalidSwapId(true);
          }
          setLoadingSwapEntry(false);
        };
        asyncFetchSwapEntry();
      } catch (e) {
        console.log({ e });
        setLoadingSwapEntry(false);
      }
    }
  }, [atomicSwap, type, id]);
  const hideSubmitUIClassname = id && !atomicSwap ? '' : 'd-none';
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
        <li className={`nav-item ${hideSubmitUIClassname}`} role="presentation">
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
              formData={formData}
              blockHeight={blockHeight}
              feeOptions={type ? feeOptionsByType[type] : []}
            />
          </div>
          <div
            className={`tab-pane fade show active ${hideSubmitUIClassname}`}
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
