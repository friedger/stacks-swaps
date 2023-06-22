import { useState, useEffect } from 'react';
import { fetchAccount } from '../lib/account';
import { Address } from './Address';
import { Amount } from './Amount';
import { TxStatus } from './TxStatus';
import {} from 'react-jdenticon';
import { useAtom } from 'jotai';
import { refreshPrice, STX_USD } from '../lib/price';
import { getTxs } from '../lib/transactions';
import { ClarityType, hexToCV } from 'micro-stacks/clarity';
import { contracts } from '../lib/constants';
import { useAuth } from '@micro-stacks/react';

export function ProfileFull({ stxAddress }) {
  const { signOut } = useAuth();
  const [profileState, setProfileState] = useState({
    account: undefined,
  });
  const [, setStxUsd] = useAtom(STX_USD);
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState();

  useEffect(() => {
    refreshPrice(setStxUsd);
  }, [setStxUsd]);

  useEffect(() => {
    if (stxAddress) {
      setLoading(true);
      fetchAccount(stxAddress)
        .then(acc => {
          setProfileState({ account: acc });
          setLoading(false);
        })
        .catch(e => setLoading(false));
    }
  }, [stxAddress]);

  useEffect(() => {
    // getTxs().then(txs => setTransactions(txs));
  }, []);

  return (
    <div
      className="offcanvas offcanvas-end"
      tabIndex="-1"
      id="offcanvasProfile"
      aria-labelledby="offcanvasProfileLabel"
    >
      <div className="offcanvas-header">
        <h5 className="offcanvas-title" id="offcanvasProfileLabel">
          <a className="navbar-brand" href="/">
            {stxAddress || typeof stxAddress != 'undefined' ? (
              <svg
                className="rounded-circle bg-white"
                width="50"
                height="50"
                data-jdenticon-value={stxAddress}
              />
            ) : (
              <img src="/stacks.png" width="50" height="50" alt="Logo" />
            )}
          </a>
          {stxAddress ? <Address addr={stxAddress} /> : 'Profile'}{' '}
        </h5>
        <button
          type="button"
          className="btn-close text-reset"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        ></button>
      </div>
      <div className="offcanvas-body">
        <div className="dropdown mt-3">
          <button
            className="btn btn-primary dropdown-toggle"
            type="button"
            id="dropdownMenuButton"
            data-bs-toggle="dropdown"
          >
            Actions
          </button>
          <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <li>
              <a
                className="dropdown-item"
                href={'https://explorer.stacks.co/address/' + stxAddress}
                target="_blank"
                rel="noreferrer"
              >
                <i className="bi bi-box-arrow-up-right"></i> View on Explorer
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                href="https://github.com/citycoins/citycoin-ui/issues/new?assignees=&labels=Bug&template=bug_report.md&title=%F0%9F%90%9E%5BBUG%5D+"
                target="_blank"
                rel="noreferrer"
              >
                <i className="bi bi-bug"></i> Report a Bug
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                href="https://github.com/citycoins/citycoin-ui/issues/new?assignees=&labels=Enhancement&template=feature_request.md&title=%E2%9A%A1%5BFEAT%5D+"
                target="_blank"
                rel="noreferrer"
              >
                <i className="bi bi-lightning"></i> Request a Feature
              </a>
            </li>
            <li>
              <button
                className="dropdown-item"
                href="#"
                onClick={() => {
                  signOut();
                }}
              >
                <i className="bi bi-x-circle"></i> Sign Out
              </button>
            </li>
          </ul>
          <hr />

          <div
            role="status"
            className={`${
              loading ? '' : 'd-none'
            } spinner-border spinner-border-sm text-info align-text-top mr-2`}
          />

          {profileState.account && (
            <>
              <h5 className="mb-3">Account Balances</h5>
              <Amount ustx={BigInt(profileState.account.balance)} stxAddress={stxAddress} />
            </>
          )}
          {transactions && (
            <>
              <h5 className="mb-3">Your swaps</h5>
              {Object.entries(
                transactions
                  .filter(t => t.apiData?.tx_status === 'pending')
                  .reduce((swaps, t) => {
                    let id;
                    const swap = swaps[t.data.txId];
                    const ctr = Object.entries(contracts).find(
                      c => `${c[1].address}.${c[1].name}` === t.apiData.contract_call.contract_id
                    );
                    const swapType = ctr ? ctr[0] : undefined;
                    switch (t.apiData?.contract_call?.function_name) {
                      case 'create-swap':
                        swaps[t.data.txId] = { ...swap, swapType };
                        break;
                      case 'submit-swap':
                        id = hexToCV(t.apiData.contract_call.function_args[0].hex).value;
                        console.log(id, t.data.txId);
                        swaps[t.data.txId] = { ...swap, id, swapType };
                        break;
                      default:
                    }
                    return swaps;
                  }, {})
              ).map((e, key) => {
                const txId = e[0];
                const swap = e[1];
                if (swap.id) {
                  return (
                    <div key={key}>
                      <a href={`/${swap.swapType}/swap/${swap.id}`}>
                        Pending Swap #{swap.id} ({swap.swapType})
                      </a>
                    </div>
                  );
                } else {
                  return (
                    <div key={key}>
                      Pending Swap <TxStatus txId={txId} />
                    </div>
                  );
                }
              })}

              {Object.entries(
                transactions
                  .filter(t => t.apiData?.tx_status === 'success')
                  .reduce((swaps, t) => {
                    let id;
                    const swap = swaps[t.data.txId];
                    const ctr = Object.entries(contracts).find(
                      c => `${c[1].address}.${c[1].name}` === t.apiData.contract_call.contract_id
                    );
                    const swapType = ctr ? ctr[0] : undefined;
                    switch (t.apiData?.contract_call?.function_name) {
                      case 'create-swap':
                        id =
                          hexToCV(t.apiData.tx_result.hex).type === ClarityType.ResponseOk
                            ? hexToCV(t.apiData.tx_result.hex).value.value
                            : t.data.txId;
                        swaps[t.data.txId] = { ...swap, id, swapType };
                        break;
                      case 'submit-swap':
                        id = hexToCV(t.apiData.contract_call.function_args[0].hex).value;
                        console.log(id, t.data.txId);
                        swaps[t.data.txId] = { ...swap, id, swapType };
                        break;
                      default:
                    }
                    return swaps;
                  }, {})
              ).map((e, key) => {
                // eslint-disable-next-line no-unused-vars
                const txId = e[0];
                const swap = e[1];
                return (
                  <div key={key}>
                    <a href={`/${swap.swapType}/swap/${swap.id}`}>
                      Swap #{swap.id} ({swap.swapType})
                    </a>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
