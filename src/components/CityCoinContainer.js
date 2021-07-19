import React, { useEffect, useState } from 'react';
import { userSessionState } from '../lib/auth';
import { useStxAddresses } from '../lib/hooks';
import { useAtomValue } from 'jotai/utils';
import { CityCoinDashboard } from './CityCoinDashboard';
import { CityCoinRegister } from './CityCoinRegister';
import { CityCoinMining } from './CityCoinMining';
import { CityCoinMiningClaim } from './CityCoinMiningClaim';
import { CityCoinStacking } from './CityCoinStacking';
import { CityCoinStackingClaim } from './CityCoinStackingClaim';
import { getMiningActivationStatus } from '../lib/citycoin';
import { tab } from 'bootstrap';

export function CityCoinContainer() {
  const userSession = useAtomValue(userSessionState);
  const { ownerStxAddress } = useStxAddresses(userSession);

  const [miningActivated, setMiningActivated] = useState();

  useEffect(() => {
    getMiningActivationStatus()
      .then(result => {
        setMiningActivated(result);
      })
      .catch(e => {
        setMiningActivated(false);
        console.log(e);
      });
  }, []);

  // TODO: change back to !miningActivated when done

  if (!miningActivated) {
    return (
      <div>
        <CityCoinRegister ownerStxAddress={ownerStxAddress} />
      </div>
    );
  } else {
    return (
      <div>
        <ul className="nav nav-tabs">
          <li className="nav-item" role="presentation">
            <button
              className="nav-link active"
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
              id="mining-tab"
              data-bs-toggle="tab"
              data-bs-target="#mining"
              type="button"
              role="tab"
              aria-controls="mining"
              aria-selected="true"
            >
              Mine CityCoins
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
              Claim Mining Rewards
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className="nav-link"
              id="stacking-tab"
              data-bs-toggle="tab"
              data-bs-target="#stacking"
              type="button"
              role="tab"
              aria-controls="stacking"
              aria-selected="true"
            >
              Stack CityCoins
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className="nav-link"
              id="stackingclaim-tab"
              data-bs-toggle="tab"
              data-bs-target="#stackingclaim"
              type="button"
              role="tab"
              aria-controls="stackingclaim"
              aria-selected="true"
            >
              Claim Stacking Rewards
            </button>
          </li>
        </ul>

        <div className="tab-content mt-3" id="myTabContent">
          <div
            className="tab-pane fade show active"
            id="dashboard"
            role="tabpanel"
            aria-labelledby="dashboard-tab"
          >
            <CityCoinDashboard />
          </div>
          <div className="tab-pane fade" id="mining" role="tabpanel" aria-labelledby="mining-tab">
            <CityCoinMining ownerStxAddress={ownerStxAddress} />
          </div>
          <div
            className="tab-pane fade"
            id="miningclaim"
            role="tabpanel"
            aria-labelledby="miningclaim-tab"
          >
            <CityCoinMiningClaim ownerStxAddress={ownerStxAddress} />
          </div>
          <div
            className="tab-pane fade"
            id="stacking"
            role="tabpanel"
            aria-labelledby="stacking-tab"
          >
            <CityCoinStacking ownerStxAddress={ownerStxAddress} />
          </div>
          <div
            className="tab-pane fade"
            id="stackingclaim"
            role="tabpanel"
            aria-labelledby="stackingclaim-tab"
          >
            <CityCoinStackingClaim ownerStxAddress={ownerStxAddress} />
          </div>
        </div>
      </div>
    );
  }
}
