import { ClarityType } from '@stacks/transactions';
import { useEffect, useState } from 'react';
import { getPoxLiteInfo } from '../lib/citycoin';

export function PoxLiteInfo() {
  const [info, setInfo] = useState();
  useEffect(() => {
    getPoxLiteInfo().then(info => setInfo(info));
  }, []);
  return (
    <>
      {info && (
        <>
          {info.type === ClarityType.ResponseErr ? (
            <>City Coin not yet activated.</>
          ) : (
            <>
              <h3>Stacking Info</h3>
              <div className="container">
                <div className="row">
                  <div className="col-6">CityCoin Total Supply</div>
                  <div className="col-6 text-right">
                    {info.value.data['total-supply'].value.toNumber().toLocaleString()}
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-6">Total STX locked in contract</div>
                  <div className="col-6 text-right">
                    {(
                      info.value.data['total-ustx-locked'].value.toNumber() / 1000000
                    ).toLocaleString()}
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-12">
                    Reward Cycle #{info.value.data['reward-cycle-id'].value.toNumber()}
                  </div>
                </div>
                <div className="row p-2">
                  <div className="col-6">Current Liquid Supply</div>
                  <div className="col-6 text-right">
                    {info.value.data['cur-liquid-supply'].value.toNumber().toLocaleString()}
                  </div>
                </div>
                <div className="row p-2">
                  <div className="col-6">Current Locked Supply</div>
                  <div className="col-6 text-right">
                    {info.value.data['cur-locked-supply'].value.toNumber().toLocaleString()}
                  </div>
                </div>
                <div className="row p-2">
                  <div className="col-6">Current STX committed</div>
                  <div className="col-6 text-right">
                    {(
                      info.value.data['cur-ustx-committed'].value.toNumber() / 1000000
                    ).toLocaleString()}
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-6">First Block Height</div>
                  <div className="col-6 text-right">
                    {info.value.data['first-block-height'].value.toNumber().toLocaleString()}
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-6">Reward Cycle Length</div>
                  <div className="col-6 text-right">
                    {info.value.data['reward-cycle-length'].value.toNumber().toLocaleString()}{' '}
                    Stacks blocks
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}
