import React, { useRef, useState } from 'react';
import { useConnect } from '@stacks/connect-react';
import { CITYCOIN_CONTRACT_NAME, CONTRACT_ADDRESS, NETWORK } from '../lib/constants';
import { TxStatus } from './TxStatus';
import {
  AnchorMode,
  bufferCVFromString,
  FungibleConditionCode,
  makeStandardSTXPostCondition,
  noneCV,
  PostConditionMode,
  someCV,
  uintCV,
} from '@stacks/transactions';
import BN from 'bn.js';

export function CityCoinMining({ ownerStxAddress }) {
  const amountRef = useRef();
  const mine30BlocksRef = useRef();
  const memoRef = useRef();
  const [txId, setTxId] = useState();
  const [loading, setLoading] = useState();
  const [buttonLabel, setButtonLabel] = useState('Mine');
  const { doContractCall } = useConnect();

  // TODO: add onCancel state for loading that works ?
  // TODO: add logic for wallet not enabled (aka not installed)
  // TODO: consider state for when mining is active

  const mineAction = async () => {
    setLoading(true);
    if (amountRef.current.value === '') {
      console.log('positive number required to mine');
      setLoading(false);
    } else {
      const mine30Blocks = mine30BlocksRef.current.checked;
      console.log(mine30Blocks);
      try {
        const amountUstx = Math.floor(parseFloat(amountRef.current.value.trim()) * 1000000);
        const amountUstxCV = uintCV(amountUstx);
        const memo = memoRef.current.value.trim();
        const memoCV = memo ? someCV(bufferCVFromString(memo)) : noneCV();
        await doContractCall({
          contractAddress: CONTRACT_ADDRESS,
          contractName: CITYCOIN_CONTRACT_NAME,
          functionName: mine30Blocks ? 'mine-tokens-over-30-blocks' : 'mine-tokens',
          functionArgs: mine30Blocks ? [amountUstxCV] : [amountUstxCV, memoCV],
          postConditionMode: PostConditionMode.Deny,
          postConditions: [
            makeStandardSTXPostCondition(
              ownerStxAddress,
              FungibleConditionCode.LessEqual,
              mine30Blocks ? amountUstxCV.value.mul(new BN(30)) : amountUstxCV.value
            ),
          ],
          anchorMode: AnchorMode.OnChainOnly,
          network: NETWORK,
          onCancel: () => {
            setLoading(false);
          },
          onFinish: result => {
            setLoading(false);
            setTxId(result.txId);
          },
        });
      } catch (e) {
        setLoading(false);
      }
    }
  };

  const updateValue = () => {
    if (mine30BlocksRef.current.checked) {
      let amount = parseFloat(amountRef.current.value.trim());
      amount = isNaN(amount) ? 0 : 30 * amount;
      setButtonLabel(
        `Mine for 30 blocks (${amount.toLocaleString(undefined, {
          style: 'decimal',
          maximumFractionDigits: 6,
        })} STX)`
      );
    } else {
      setButtonLabel('Mine');
    }
  };

  return (
    <>
      <h3>Mine CityCoins</h3>
      <p>
        Mining CityCoins is done by spending STX in a given Stacks block. A winner is selected
        randomly weighted by the miners' proportion of contributions of that block. Rewards can be
        withdrawn after a 100 block maturity window.
      </p>
      <form>
        <div className="input-group mb-3">
          <input
            type="number"
            className="form-control"
            ref={amountRef}
            onChange={updateValue}
            aria-label="Amount in STX"
            placeholder="Amount in STX"
            required
            minLength="1"
          />
          <div className="input-group-append">
            <span className="input-group-text">STX</span>
          </div>
        </div>
        <input
          ref={memoRef}
          className="form-control"
          type="text"
          placeholder="Memo (optional)"
          aria-label="Optional memo field"
          maxLength="34"
          hidden={mine30BlocksRef.current?.checked}
        />
        <br />
        <div className="form-check">
          <input
            ref={mine30BlocksRef}
            className="form-check-input"
            onChange={updateValue}
            type="checkbox"
            value=""
            id="mine30Blocks"
          />
          <label className="form-check-label" htmlFor="mine30Blocks">
            Mine for 30 blocks
          </label>
        </div>
        <br />
        <button
          className="btn btn-block btn-primary"
          type="button"
          disabled={txId}
          onClick={mineAction}
        >
          <div
            role="status"
            className={`${
              loading ? '' : 'd-none'
            } spinner-border spinner-border-sm text-info align-text-top mr-2`}
          />
          {buttonLabel}
        </button>
      </form>
      {txId && <TxStatus txId={txId} />}
    </>
  );
}
