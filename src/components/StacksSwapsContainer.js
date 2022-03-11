import React, { useEffect, useState } from 'react';
import { useStxAddresses } from '../lib/hooks';
import { StacksSwapsDashboard } from './StacksSwapsDashboard';
import { SwapCreate } from './SwapCreate';
import { SwapSubmit } from './SwapSubmit';
import { fetchSwapsEntry } from '../lib/transactions';
import { feeOptionsByType, infoApi } from '../lib/constants';
import {
  assetInEscrowFromType,
  buyDecimalsFromType2,
  getFtDataFromSwapsEntry,
  getNftDataFromSwapsEntry,
  isAtomic,
  setFormDataFromSwapsEntry,
} from '../lib/assets';
import { c32ToB58 } from 'micro-stacks/crypto';

export function StacksSwapsContainer({ type, trait, id, nftId }) {
  const { ownerStxAddress } = useStxAddresses();
  const atomicSwap = isAtomic(type);

  const [loadingSwapEntry, setLoadingSwapEntry] = useState();
  const [invalidSwapId, setInvalidSwapId] = useState(false);
  const [blockHeight, setBlockHeight] = useState(0);
  const [formDataInitial, setFormDataInitial] = useState({
    amountOrIdInEscrow: '',
    decimalsInEscrow: buyDecimalsFromType2(type),
    traitInEscrow: assetInEscrowFromType(type),
    amountOrIdForSale: '',
    decimalsForSale: 0,
    traitForSale: trait,
    buyerAddress: ownerStxAddress || '',
    buyerBtcAddress: ownerStxAddress ? c32ToB58(ownerStxAddress) : '',
    sellerAddress: '',
    feeId: '',
    whenFromSwap: '',
    doneFromSwap: '',
  });

  useEffect(() => {
    const asyncFn = async () => {
      setFormDataInitial({
        amountOrIdInEscrow: '',
        decimalsInEscrow: buyDecimalsFromType2(type),
        traitInEscrow: assetInEscrowFromType(type),
        amountOrIdForSale: '',
        decimalsForSale: 0,
        traitForSale: trait,
        buyerAddress: ownerStxAddress || '',
        buyerBtcAddress: ownerStxAddress ? c32ToB58(ownerStxAddress) : '',
        sellerAddress: '',
        feeId: '',
        whenFromSwap: '',
        doneFromSwap: '',
      });

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
              await setFormDataFromSwapsEntry(swapsEntry, type, setFormDataInitial);
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
    };
    asyncFn();
  }, [atomicSwap, type, id, ownerStxAddress, trait]);
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
            aria-selected="false"
          >
            Dashboard
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link active"
            id="createswap-tab"
            data-bs-toggle="tab"
            data-bs-target="#createswap"
            type="button"
            role="tab"
            aria-controls="createswap"
            aria-selected="true"
          >
            {formDataInitial.doneFromSwap === 1 || id ? 'Swap Details' : 'Create Swap'}
          </button>
        </li>
        <li className={`nav-item ${hideSubmitUIClassname}`} role="presentation">
          <button
            className="nav-link"
            id="submit-tab"
            data-bs-toggle="tab"
            data-bs-target="#submit"
            type="button"
            role="tab"
            aria-controls="submit"
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
            className="tab-pane fade show active"
            id="createswap"
            role="tabpanel"
            aria-labelledby="createswap-tab"
          >
            <SwapCreate
              ownerStxAddress={ownerStxAddress}
              type={type}
              trait={formDataInitial.traitForSale}
              id={id}
              formDataInitial={formDataInitial}
              blockHeight={blockHeight}
              feeOptions={type ? feeOptionsByType[type] : []}
            />
          </div>
          <div
            className={`tab-pane fade ${hideSubmitUIClassname}`}
            id="submit"
            role="tabpanel"
            aria-labelledby="submit-tab"
          >
            <SwapSubmit
              ownerStxAddress={ownerStxAddress}
              type={type}
              trait={id ? formDataInitial.trait : trait}
              id={id}
              formData={formDataInitial}
            />
          </div>
          <div
            className="tab-pane fade"
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
