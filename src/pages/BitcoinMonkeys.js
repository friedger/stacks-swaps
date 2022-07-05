import { BANANA_TOKEN, BITCOIN_MONKEYS } from '../components/assets';
import { AtomicIntroButton } from '../components/AtomicIntroButton';
// Intro page with choice of swaps

function GridOfSwaps() {
  return (
    <div className="Landing">
      <div className="jumbotron jumbotron-fluid pt-3 mb-0">
        <div className="container pt-3">
          <img
            src="/bitcoinmonkeys-logo.png"
            width="25%"
            alt="Bitcoin Monkeys"
            className="mx-auto d-block"
          />
          <p className="h5 text-center mb-5">
            Use atomic swaps to exchange digital assets <br />
            for $BANANA and Bitcoin Monkeys.
          </p>
          <div className="row">
            <div className="col">
              <AtomicIntroButton type="stx-ft" trait={BANANA_TOKEN} showBoth />
            </div>
            <div className="col">
              <AtomicIntroButton type="stx-nft" trait={BITCOIN_MONKEYS} showBoth />
            </div>
            <div className="col">
              <AtomicIntroButton type="banana-nft" />
            </div>
          </div>
          <div className="row">
            <div className="col">
              <AtomicIntroButton type="satoshible-nft" trait={BITCOIN_MONKEYS} />
            </div>
            <div className="col">
              <AtomicIntroButton type="banana-nft" trait={BITCOIN_MONKEYS} />
            </div>
            <div className="col">
              <AtomicIntroButton type="banana-ft" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default function BitcoinMonkeys() {
  return <GridOfSwaps />;
}
