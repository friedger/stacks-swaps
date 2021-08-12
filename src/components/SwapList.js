import React, { Fragment, useEffect, useState } from 'react';
import { contracts } from '../lib/constants';
import { Contract } from './Contract';

export function SwapList() {
  const [swaps, setSwaps] = useState();

  useEffect(() => {
    setSwaps([
      {
        contract: contracts['nft'],
        type: 'nft',
        create_tx_id: '0x70578fa63b28659b9fdcadc77d096b70d6789f0e4c92304d9e14325af5dcb0d8',
        submit_tx_id: '0x5c275f52078374fb1ff68266034ce83e8cfe144cfb239f0d10c8f626b0b2e431',
        title: 'Boombox b-12 #82 (id 0)',
      },
      {
        contract: contracts['stx'],
        type: 'stx',
        create_tx_id: '0xcc8cb89aaee093903ebbb91ee2f0c9212ee114f090a408afdef9eb1d9c335ba4',
        submit_tx_id: '0x134473bbc94467fee49e57d5462372e05dd2f8bd759a169f474ec3995fbf8f86',
        title: '500 STX (id 0)',
      },
      {
        contract: contracts['ft'],
        type: 'ft',
        create_tx_id: '0x7c20aeb66742e50f52898339e3d1f56a99901f405900ec48241891811496e7fc',
        submit_tx_id: '0x4d6d6f15309790a30c7f2794680c3e267f31ab43712e72479f79d8054798ce77',
        title: '1m Wrapped Nothing (id 0)',
      },
    ]);
  }, []);

  if (swaps) {
    return (
      <>
        <h3>Some Completed Swap Activities</h3>
        <div className="container">
          {swaps.map((swap, key) => (
            <Fragment key={key}>
              <div className="accordion accordion-flush" id="accordionActivityLog">
                <div className="accordion-item">
                  <h2 className="accordion-header" id="accordionActivityLog-heading">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#accordionActivityLog-activityOne"
                      aria-expanded="false"
                      aria-controls="accordionActivityLog-activityOne"
                    >
                      Swap {swap.title}
                    </button>
                  </h2>
                </div>

                <div className="accordion-body">
                  <div className="card p-2 m-2">
                    <div className="row pl-4 mb-2">
                      <Details swap={swap} />
                    </div>
                  </div>
                </div>
              </div>
            </Fragment>
          ))}
        </div>
      </>
    );
  } else {
    return null;
  }
}

function Details({ swap }) {
  return (
    <>
      <div className="col-lg-6 col-md-12">
        <small>
          <Contract ctr={swap.contract} />
        </small>
      </div>
      <div className="col-lg-6 col-md-12 text-right">
        create: {swap.create_tx_id.substr(0, 10)}...
        <a
          href={`https://explorer.stacks.co/txid/${swap.create_tx_id}`}
          target="_blank"
          rel="noreferrer"
        >
          <i className="bi bi-box-arrow-up-right" />
        </a>
        <br />
        verify: {swap.submit_tx_id.substr(0, 10)}...
        <a
          href={`https://explorer.stacks.co/txid/${swap.submit_tx_id}`}
          target="_blank"
          rel="noreferrer"
        >
          <i className="bi bi-box-arrow-up-right" />
        </a>
      </div>
    </>
  );
}
