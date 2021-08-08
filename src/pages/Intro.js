import React from 'react';
import { AlertAllPages } from '../components/AlertAllPages';
import { IntroButton } from '../components/IntroButton';
import { BOOMBOX_CONTRACT, MIA_CONTRACT } from '../components/assets';
// Intro page with choice of swaps

export default function Intro(props) {
  return (
    <div className="Landing">
      <div className="jumbotron jumbotron-fluid pt-3 mb-0">
        <div className="container pt-3">
          <AlertAllPages />
          <h1>Stacks Swaps</h1>
          <p className="h5">
            Use catamaran swaps to exchange BTCs for digital assets on the Stacks Chain.
          </p>
          <div className="container">
            <div className="row">
              <div className="col">
                <IntroButton type="stx" />
              </div>
              <div className="col">
                <IntroButton type="ft" trait={MIA_CONTRACT} />
              </div>
              <div className="col">
                <IntroButton type="nft" trait={BOOMBOX_CONTRACT} />
              </div>
            </div>
            <div className="row">
              <div className="col">
                <IntroButton type="ft" />
              </div>
              <div className="col">
                <IntroButton type="nft" />
              </div>
              <div className="col"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
