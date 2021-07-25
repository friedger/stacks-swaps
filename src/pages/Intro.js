import React from 'react';
import { AlertAllPages } from '../components/AlertAllPages';
import { Link } from '@reach/router';
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
          <p className="h5">
            <Link to="stx">Swap STX</Link>
          </p>
          <p className="h5">
            <Link to="nft">Swap NFTs (SIP-9 compliant)</Link>
          </p>
          <p className="h5">
            <Link to="ft">Swap tokens (SIP-10 compliant)</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
