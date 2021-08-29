import React from 'react';
import { AlertAllPages } from '../components/AlertAllPages';
import { CatamaranIntroButton } from '../components/CatamaranIntroButton';
import { BOOMBOX, MIA_TOKEN, THIS_IS_NUMBER_ONE } from '../components/assets';
import { AtomicIntroButton } from '../components/AtomicIntroButton';
// Intro page with choice of swaps

export default function Intro(props) {
  return (
    <div className="Landing">
      <div className="jumbotron jumbotron-fluid pt-3 mb-0">
        <div className="container pt-3">
          <AlertAllPages />
          <h1>Catamaran Swaps</h1>
          <p className="h5">
            Use catamaran swaps to exchange BTCs for digital assets on the Stacks chain.
          </p>
          <div className="container">
            <div className="row">
              <div className="col">
                <CatamaranIntroButton type="stx" />
              </div>
              <div className="col">
                <CatamaranIntroButton type="ft" trait={MIA_TOKEN} />
              </div>
              <div className="col">
                <CatamaranIntroButton type="nft" trait={BOOMBOX} />
              </div>
            </div>
            <div className="row">
              <div className="col">
                <CatamaranIntroButton type="nft" trait={THIS_IS_NUMBER_ONE} />
              </div>

              <div className="col">
                <CatamaranIntroButton type="ft" />
              </div>
              <div className="col">
                <CatamaranIntroButton type="nft" />
              </div>
            </div>
          </div>

          <h1>Atomic Stacks Swaps</h1>
          <p className="h5">
            Use atomic swaps to exchange digital assets only on the Stacks chain.
          </p>
          <div className="container">
            <div className="row">
              <div className="col">
                <AtomicIntroButton type="stx-ft" />
              </div>
              <div className="col">
                <AtomicIntroButton type="stx-ft" trait={MIA_TOKEN} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
