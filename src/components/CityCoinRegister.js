import React, { useEffect, useRef, useState } from 'react';
import { useConnect } from '@stacks/connect-react';
import { CITYCOIN_CONTRACT_NAME, CONTRACT_ADDRESS, NETWORK } from '../lib/constants';
import { TxStatus } from './TxStatus';
import {
  getRegisteredMinerId,
  getRegisteredMinerCount,
  getRegisteredMinersThreshold,
} from '../lib/citycoin';
import { bufferCVFromString, someCV } from '@stacks/transactions';

export function CityCoinRegister({ ownerStxAddress }) {
  const minerMemoRef = useRef();
  const [minerCount, setMinerCount] = useState();
  const [minerId, setMinerId] = useState(null);
  const [minerRegistered, setMinerRegistered] = useState(false);
  const [minerThreshold, setMinerThreshold] = useState(1);
  const [txId, setTxId] = useState();
  const [loading, setLoading] = useState();
  const { doContractCall } = useConnect();

  const styles = {
    width: `${(minerCount / minerThreshold) * 100}%`,
  };

  useEffect(() => {
    getRegisteredMinerCount()
      .then(result => {
        setMinerCount(result);
      })
      .catch(e => {
        setMinerCount(0);
        console.log(e);
      });
    getRegisteredMinersThreshold()
      .then(result => {
        setMinerThreshold(result);
      })
      .catch(e => {
        setMinerThreshold(20);
        console.log(e);
      });
  }, []);

  useEffect(() => {
    console.log(ownerStxAddress);
    ownerStxAddress &&
      getRegisteredMinerId(ownerStxAddress)
        .then(result => {
          if (result) {
            setMinerId(result);
            setMinerRegistered(true);
          }
        })
        .catch(e => {
          console.log(e);
        });
  }, [ownerStxAddress]);

  const registerAction = async () => {
    setLoading(true);
    const minerMemoCV = bufferCVFromString(minerMemoRef.current.value.trim());
    await doContractCall({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CITYCOIN_CONTRACT_NAME,
      functionName: 'register-miner',
      functionArgs: [someCV(minerMemoCV)],
      network: NETWORK,
      onFinish: result => {
        setLoading(false);
        setTxId(result.txId);
      },
      onCancel: () => {
        setLoading(false)
      }
    });
  };

  // TODO: update disable button styles

  return (
    <>
      <h3>Activate CityCoin Mining</h3>
      <p>
        Before mining can begin, at least {minerThreshold} miners must register with the contract to
        signal activation.
      </p>
      <ul>
        <li>Miners Registered: {minerCount}</li>
        <li>Threshold: {minerThreshold} Miners</li>
      </ul>
      <div className="progress mb-3">
        <div
          className="progress-bar"
          role="progressbar"
          style={styles}
          aria-valuenow={((minerCount / minerThreshold) * 100).toFixed(2)}
          aria-valuemin="0"
          aria-valuemax="100"
        >
          {((minerCount / minerThreshold) * 100).toFixed(2)}%
        </div>
      </div>
      {minerRegistered && <p>Registration Complete! ID: {minerId}</p>}
      {!minerRegistered && (
        <>
          <hr />
          <form>
            <input
              type="text"
              className="form-control"
              ref={minerMemoRef}
              aria-label="Registration Message"
              placeholder="Registration Message (optional)"
              minLength="1"
              maxLength="32"
            />
            <br />
            <button
              className="btn btn-block btn-primary"
              type="button"
              disabled={txId}
              onClick={registerAction}
            >
              <div
                role="status"
                className={`${
                  loading ? '' : 'd-none'
                } spinner-border spinner-border-sm text-info align-text-top mr-2`}
              />
              Register
            </button>
          </form>
        </>
      )}
      {txId && <TxStatus txId={txId} />}
    </>
  );
}
