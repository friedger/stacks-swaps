import React from 'react';
import { useConnect } from '../lib/auth';
import { AlertAllPages } from '../components/AlertAllPages';

// Landing page with Stacks Connect for authentication

export default function Landing(props) {
  const { handleOpenAuth } = useConnect();

  return (
    <div className="Landing">
      <div className="jumbotron jumbotron-fluid pt-3 mb-0">
        <div className="container pt-3">
          <AlertAllPages />
          <h1>Stacks Swaps</h1>
          <p className="h5">
            The Stacks Blockchain has knowledge about the Bitcoin blockchain. This can be used to
            trigger contract call by a bitcoin transaction.
          </p>
          <p className="h5">
            This site provides a UI to create and handle trustless swaps between Bitcoins and and
            fungible and non-fungible tokens on the Stacks chain.
          </p>
          <h2 className="mt-4">Create Swap</h2>
          <p className="h5">
            After agreeing on Terms and Conditions off-chain, the owner of the Stacks assets creates
            a swap and sends the assets to the contract in escrow.
          </p>
          <h2 className="mt-4">Submit BTC transaction</h2>
          <p className="h5">
            After the owner of BTC has made the transaction to the agree BTC address, any user can
            submit the BTC contract to the Stacks contract. After verification, the Stacks assets
            are released to the agree Stacks receiver.
          </p>
          <button
            className="btn btn-lg btn-outline-primary mt-4"
            type="button"
            onClick={handleOpenAuth}
          >
            Get Started!
          </button>
        </div>
      </div>
    </div>
  );
}
