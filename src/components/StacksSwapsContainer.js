import React from 'react';
import { userSessionState } from '../lib/auth';
import { useStxAddresses } from '../lib/hooks';
import { useAtomValue } from 'jotai/utils';
import { StacksSwapsDashboard } from './StacksSwapsDashboard';
import { SwapCreateNFT } from './SwapCreateNFT';
import { SwapSubmit } from './SwapSubmit';

export function StacksSwapsContainer() {
  const userSession = useAtomValue(userSessionState);
  const { ownerStxAddress } = useStxAddresses(userSession);
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
            id="create-nft"
            data-bs-toggle="tab"
            data-bs-target="#create-nft"
            type="button"
            role="tab"
            aria-controls="create-nft"
            aria-selected="true"
          >
            Create Swap
          </button>
        </li>
        <li className="nav-item" role="presentation">
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

      <div className="tab-content mt-3" id="myTabContent">
        <div
          className="tab-pane fade"
          id="dashboard"
          role="tabpanel"
          aria-labelledby="dashboard-tab"
        >
          <StacksSwapsDashboard />
        </div>
        <div
          className="tab-pane fade"
          id="create-nft"
          role="tabpanel"
          aria-labelledby="create-nft-tab"
        >
          <SwapCreateNFT ownerStxAddress={ownerStxAddress} />
        </div>
        <div
          className="tab-pane fade show active"
          id="miningclaim"
          role="tabpanel"
          aria-labelledby="miningclaim-tab"
        >
          <SwapSubmit ownerStxAddress={ownerStxAddress} />
        </div>
      </div>
    </div>
  );
}
