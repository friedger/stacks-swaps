import { CatamaranIntroButton } from '../components/CatamaranIntroButton';
import {
  BANANA_TOKEN,
  BITCOIN_MONKEYS,
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

export function GridOfSwaps({ hideAtomic, hideCatamaran }) {
  return (
    <div className="Landing">
      <div className="jumbotron jumbotron-fluid pt-3 mb-0">
        <div className="container pt-3">
          {!hideCatamaran && (
            <>
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
            </>
          )}
          {!hideAtomic && (
            <>
              <h1>Atomic Stacks Swaps</h1>
              <p className="h5">
                Use atomic swaps to exchange digital assets only on the Stacks chain.
              </p>
              <h2>Swap STX tokens for NFTs and FTs</h2>
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
              <h2>Assets with special support</h2>
              <div className="container">
                <div className="row">
                  <div className="col">
                    <AtomicIntroButton type="banana-nft" />
                  </div>
                  <div className="col">
                    <AtomicIntroButton type="xbtc-nft" />
                  </div>
                  <div className="col">
                    <AtomicIntroButton type="usda-nft" />
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <AtomicIntroButton type="banana-ft" />
                  </div>
                  <div className="col">
                    <AtomicIntroButton type="xbtc-ft" />
                  </div>
                  <div className="col">
                    <AtomicIntroButton type="usda-ft" />
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <AtomicIntroButton type="satoshible-nft" />
                  </div>
                  <div className="col">
                    <AtomicIntroButton type="satoshible-ft" />
                  </div>
                  <div className="col"></div>
                </div>
                <div className="row">
                  <div className="col">
                    <AtomicIntroButton type="satoshible-nft" trait={BITCOIN_MONKEYS} />
                  </div>
                  <div className="col">
                    <AtomicIntroButton type="banana-nft" trait={BITCOIN_MONKEYS} />
                  </div>
                  <div className="col"></div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
export default function Intro({ hideAtomic, hideCatamaran }) {
  return <GridOfSwaps hideAtomic={hideAtomic} hideCatamaran={hideCatamaran} />;
}
