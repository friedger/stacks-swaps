import { useAuth } from '@micro-stacks/react';
import GetStartedButton from './../components/GetStartedButton';

// Landing page with Stacks Connect for authentication

export default function LandingCat(props) {
  const { openAuthRequest } = useAuth();

  return (
    <div className="Landing">
      <div className="jumbotron jumbotron-fluid pt-3 mb-0">
        <div className="container pt-3">
          <h1>Catamaran Swaps</h1>
          <p className="h5">
            The Stacks Blockchain has knowledge about the Bitcoin blockchain. This can be used to
            trigger contract call by a bitcoin transaction.
          </p>
          <p className="h5">
            This site provides a UI to create and handle trustless swaps between Bitcoins and
            fungible and non-fungible tokens on the Stacks chain.
          </p>
          <h2 className="mt-4">Create Swap</h2>
          <p className="h5">
            After agreeing on Terms and Conditions off-chain, the owner of the Stacks assets creates
            a swap and sends the assets to the contract in escrow.
          </p>
          <h2 className="mt-4">Submit BTC Transaction</h2>
          <p className="h5">
            After the owner of BTC has made the transaction to the agree BTC address, any user can
            submit the BTC contract to the Stacks contract. After verification, the Stacks assets
            are released to the agree Stacks receiver.
          </p>
          <h2 className="mt-4">Atomic Stacks Swaps</h2>
          <p className="h5">
            In addition to Catamaran swaps, the UI also provides support for swaps of digital assets
            just on the Stacks chain.
          </p>
          <GetStartedButton openAuthRequest={openAuthRequest} />
        </div>
      </div>
    </div>
  );
}
