import { navigate } from '@reach/router';
import React from 'react';
import { AssetIcon } from '../components/AssetIcon';
import { useConnect } from '../lib/auth';

// Landing page with Stacks Connect for authentication

export default function Landing(props) {
  const { handleOpenAuth } = useConnect();

  return (
    <div className="Landing">
      <div className="jumbotron jumbotron-fluid pt-3 mb-0">
        <div className="container pt-3">
          <h1 className="text-center">Swap your digital assets..</h1>
          <div className="row">
            <div className="col" />
            <div className="col">
              <button
                className="btn btn-lg btn-outline-primary mt-4"
                onClick={e => navigate('/catamaran')}
              >
                <p className="h5 text-center">..with BTC</p>
                <p className="text-center">
                  <AssetIcon type="btc" />
                </p>
              </button>
            </div>
            <div className="col" />
            <div className="col">
              <button
                className="btn btn-lg btn-outline-primary mt-4"
                onClick={e => navigate('/atomic')}
              >
                <p className="h5 text-center">..with STX</p>
                <p className="text-center">
                  <AssetIcon type="stx" />
                </p>
              </button>
            </div>
            <div className="col" />
          </div>
        </div>
      </div>
    </div>
  );
}
