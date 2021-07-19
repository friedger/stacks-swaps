import React, { useEffect, useState } from 'react';
import { useConnect } from '@stacks/connect-react';
import { CC_SYMBOL, CITYCOIN_CONTRACT_NAME, CONTRACT_ADDRESS, NETWORK } from '../lib/constants';
import { TxStatus } from './TxStatus';
import { uintCV } from '@stacks/transactions';
import { getCoinbase, getMiningDetails } from '../lib/citycoin';

// TODO: how to know block height to claim?
// get from a getter?

export function CityCoinMiningClaim({ ownerStxAddress }) {
  const [txId, setTxId] = useState();
  const [loading, setLoading] = useState();
  const [miningState, setMiningState] = useState();
  const { doContractCall } = useConnect();

  useEffect(() => {
    if (ownerStxAddress) {
      getMiningDetails(ownerStxAddress).then(state => setMiningState(state));
      getCoinbase(100);
    }
  }, [ownerStxAddress]);

  const claimAction = async amountUstxCV => {
    await doContractCall({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CITYCOIN_CONTRACT_NAME,
      functionName: 'claim-token-reward',
      functionArgs: [amountUstxCV],
      network: NETWORK,
      onCancel: () => {
        setLoading(false);
      },
      onFinish: result => {
        setLoading(false);
        setTxId(result.txId);
      },
    });
  };

  return (
    <>
      <h3>Claim Mining Rewards</h3>
      <p>Available CityCoins to claim:</p>
      {miningState && miningState.winningDetails.length > 0 ? (
        <div class="row">
          {miningState.winningDetails.map((details, key) =>
            details.lost ? null : (
              <div className="col-3 card" key={key}>
                <div className="card-header">Block {details.blockHeight}</div>
                <div className="card-body">
                  {details.winner ? (
                    details.claimed ? (
                      <>
                        <p>
                          {details.coinbase} {CC_SYMBOL} claimed.
                        </p>
                      </>
                    ) : (
                      <>
                        <p>
                          {details.coinbase} {CC_SYMBOL}
                        </p>
                        <button
                          className="btn btn-outline-primary"
                          onClick={() => claimAction(uintCV(details.blockHeight))}
                        >
                          Claim
                        </button>
                      </>
                    )
                  ) : details.e ? (
                    <>
                      <p>
                        Error for Block {details.blockHeight} {details.e.toString()}
                      </p>
                    </>
                  ) : (
                    <>
                      <p>Pending tx for Block {details.blockHeight}</p>
                    </>
                  )}
                </div>
              </div>
            )
          )}
        </div>
      ) : loading ? null : (
        <div className="my-2">No rewards yet</div>
      )}
    </>
  );
}
