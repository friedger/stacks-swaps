import React, { Fragment, useEffect, useState } from 'react';
import { Address } from './Address';

export function SwapList() {
  const [swaps, setSwaps] = useState();

  useEffect(() => {
    setSwaps([{ contract: '', type: 'nft', tx_id:"0x1234", title: "Boombox b-12 #82" }]);
  }, []);

  if (swaps) {
    return (
      <>
        <h3>Swap Activities</h3>
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
                <div
                  id="accordionActivityLog-activityOne"
                  className="accordion-collapse collapse"
                  aria-labelledby="accordionActivityLog-headingOne"
                  data-bs-parent="#accordionActivityLog"
                >
                  <div className="accordion-body">
                    <div className="card p-2 m-2">
                      <div className="row pl-4">{swap.type}</div>
                      <div className="row pl-4 mb-2">
                        <Details swap={swap} />
                      </div>
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
          <Address addr={swap.contract} />
        </small>
      </div>
      <div className="col-lg-6 col-md-12 text-right">
        {swap.tx_id.substr(0, 10)}...
        <a href={`https://explorer.stacks.co/txid/${swap.tx_id}`} target="_blank" rel="noreferrer">
          <i className="bi bi-box-arrow-up-right" />
        </a>
      </div>
    </>
  );
}
