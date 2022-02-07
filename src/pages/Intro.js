import React from 'react';
import { CatamaranIntroButton } from '../components/CatamaranIntroButton';
import {
  BANANA_TOKEN,
  CRASHPUNKS,
  DIKO_TOKEN,
  FARI_TOKEN,
  MIA_TOKEN,
  SATOSHIBLES,
  THIS_IS_NUMBER_ONE,
  USDA_TOKEN,
} from '../components/assets';
import { AtomicIntroButton } from '../components/AtomicIntroButton';
// Intro page with choice of swaps

export default function Intro(props) {
  return (
    <div className="Landing">
      <div className="jumbotron jumbotron-fluid pt-3 mb-0">
        <div className="container pt-3">
          <h1>Catamaran Swaps</h1>
          <p className="h5">
            Use catamaran swaps to exchange BTCs for digital assets on the Stacks chain.
          </p>
          <div className="container">
            <div className="row">
              <div className="col">
                <CatamaranIntroButton type="stx" />
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
                <AtomicIntroButton type="stx-ft" trait={MIA_TOKEN} />
              </div>
              <div className="col">
                <AtomicIntroButton type="stx-ft" trait={FARI_TOKEN} />
              </div>
              <div className="col">
                <AtomicIntroButton type="stx-ft" />
              </div>
            </div>
            <div className="row">
              <div className="col">
                <AtomicIntroButton type="stx-ft" trait={BANANA_TOKEN} />
              </div>
              <div className="col">
                <AtomicIntroButton type="stx-ft" trait={USDA_TOKEN} />
              </div>
              <div className="col">
                <div className="col">
                  <AtomicIntroButton type="stx-ft" trait={DIKO_TOKEN} />
                </div>
              </div>
            </div>
          </div>
          <div className="container">
            <div className="row">
              <div className="col">
                <AtomicIntroButton type="stx-nft" trait={CRASHPUNKS} />
              </div>
              <div className="col">
                <AtomicIntroButton type="stx-nft" trait={SATOSHIBLES} />
              </div>
              <div className="col"></div>
            </div>
            <div className="row">
              <div className="col">
                <AtomicIntroButton type="stx-nft" trait={THIS_IS_NUMBER_ONE} />
              </div>
              <div className="col">
                <AtomicIntroButton type="stx-nft" />
              </div>
              <div className="col"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
