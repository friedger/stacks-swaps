import React from 'react';
import { chainSuffix } from '../lib/constants';
import { Address } from './Address';
import { Amount } from './Amount';
import { AmountFiat } from './AmountFiat';
import { AmountStx } from './AmountStx';
export function Tx({ tx, onDetailsPage, hideEvents, hideHeader }) {
  const apiData = tx.apiData;
  const txId = apiData.tx_id;
  const copyToClipboard = () => {
    navigator.clipboard.writeText(txId);
  };
  const openTxInExplorer = () => {
    window.open(`https://explorer.stacks.co/txid/${txId}`, '_blank');
  };
  const openTx = () => {
    window.location.href = `/txid/${txId}`;
  };

  const txEvents =
    tx &&
    tx.apiData &&
    tx.apiData.events.filter(event => {
      return event.event_type === 'stx_asset';
    });
  const total = txEvents.reduce((sum, e) => sum + parseInt(e.asset.amount), 0);
  return (
    <div className="small container">
      {!hideHeader && (
        <div className="row">
          <div className="col-lg-7 col-xs-12">
            <span title={txId}>
              {txId.substr(0, 7)}...{txId.substr(58)}
            </span>
            <i
              className="p-1 bi bi-clipboard"
              role="button"
              title="copy"
              onClick={copyToClipboard}
            ></i>
            <i
              className={`${onDetailsPage ? 'd-none' : ''} p-1 bi bi-link`}
              role="button"
              title="details"
              onClick={openTx}
            ></i>
            <i
              className="p-1 bi bi-link-45deg"
              role="button"
              title="explorer"
              onClick={openTxInExplorer}
            ></i>
          </div>
          {total > 0 ? (
            <div className="col-lg-5 col-xs-12 text-danger text-right small">
              <Amount ustx={-1 * total} />
            </div>
          ) : (
            <div className="col-lg-5 col-xs-12 text-right small">
              {(tx.apiData && tx.apiData.tx_status) || ''}
            </div>
          )}
        </div>
      )}

      {!hideEvents &&
        txEvents &&
        txEvents.map((event, key) => {
          return (
            <div
              onClick={() =>
                (window.location.href = `/txid/${tx.apiData.tx_id}/${event.event_index}${chainSuffix}`)
              }
              key={key}
              className="row"
              role="button"
            >
              <div className="col-8">
                <Address addr={event.asset.recipient} />
              </div>
              <div className="col-4 text-right small">
                <AmountStx ustx={event.asset.amount} />
                <br />
                (<AmountFiat ustx={event.asset.amount} />)
              </div>
            </div>
          );
        })}
    </div>
  );
}
