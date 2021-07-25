import React from 'react';
import { AlertAllPages } from '../components/AlertAllPages';

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
            <a href="stx">Swap STX</a>
          </p>
          <p className="h5">
            <a href="nft">Swap NFTs (SIP-9 compliant)</a>
          </p>
          <p className="h5">
            <a href="ft">Swap tokens (SIP-10 compliant)</a>
          </p>
        </div>
      </div>
    </div>
  );
}
