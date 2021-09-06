import { navigate } from '@reach/router';
import React from 'react';
import { AssetIcon } from '../components/AssetIcon';
import { useConnectForAuth } from '../lib/auth';

// Landing page with Stacks Connect for authentication

export default function Landing(props) {
  const { handleOpenAuth } = useConnectForAuth();

  return (
    <div className="Landing">
      <div className="jumbotron jumbotron-fluid pt-3 mb-0">
        <div className="container pt-3">
          <h1 className="text-center">Swap your digital assets..</h1>
          <div className="row">
            <div className="col text-center">
              <button
                className="btn btn-lg btn-outline-primary mt-4"
                onClick={e => navigate('/catamaran')}
              >
                <p className="h5 text-center">.. between BTC and STX chain</p>
                <div className="text-center container">
                  <div className="row align-items-center">
                    <div className="col">
                      <AssetIcon type="btc" />
                    </div>
                    <div className="col">
                      <i className="bi bi-arrow-right"></i>
                      <br />
                      <i className="bi bi-arrow-left"></i>
                    </div>
                    <div className="col">
                      <AssetIcon type="stx" />
                    </div>
                  </div>
                </div>
                <p className="h5 text-center">.. using catamaran swaps.</p>
              </button>
            </div>
            <div className="col text-center">
              <button
                className="btn btn-lg btn-outline-primary mt-4"
                onClick={e => navigate('/atomic')}
              >
                <p className="h5 text-center">.. on STX chain ..</p>
                <div className="container">
                  <div className="row align-items-center">
                    <div className="col">
                      <AssetIcon type="stx" />
                    </div>
                    <div className="col">
                      <i className="bi bi-arrow-right"></i>
                      <br />
                      <i className="bi bi-arrow-left"></i>
                    </div>
                    <div className="col">
                      <AssetIcon type="stx" />
                    </div>
                  </div>
                </div>
                <p className="h5 text-center">.. atomic swaps.</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
