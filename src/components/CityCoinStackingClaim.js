import React, { useEffect, useRef, useState } from 'react';
import { useConnect } from '@stacks/connect-react';
import { CC_NAME, CITYCOIN_CONTRACT_NAME, CONTRACT_ADDRESS, NETWORK } from '../lib/constants';
import {
  uintCV,
  PostConditionMode,
  makeContractSTXPostCondition,
  makeContractFungiblePostCondition,
  createAssetInfo,
  FungibleConditionCode,
  AnchorMode,
} from '@stacks/transactions';
import { getStackingState } from '../lib/citycoin';

// TODO: how to know reward cycle to claim?
// get from a getter?

export function CityCoinStackingClaim({ ownerStxAddress }) {
  const rewardCycleRef = useRef();
  const [txId, setTxId] = useState();
  const [loading, setLoading] = useState();
  const [stackingState, setStackingState] = useState();
  const { doContractCall } = useConnect();

  useEffect(() => {
    getStackingState(ownerStxAddress).then(state => setStackingState(state));
  }, [ownerStxAddress]);

  const claimAction = async (targetRewardCycleCV, amountUstxCV, amountCityCoinCV) => {
    setLoading(true);
    await doContractCall({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CITYCOIN_CONTRACT_NAME,
      functionName: 'claim-stacking-reward',
      functionArgs: [targetRewardCycleCV],
      postConditionMode: PostConditionMode.Deny,
      postConditions: [
        makeContractSTXPostCondition(
          CONTRACT_ADDRESS,
          CITYCOIN_CONTRACT_NAME,
          FungibleConditionCode.LessEqual,
          amountUstxCV.value
        ),
        makeContractFungiblePostCondition(
          CONTRACT_ADDRESS,
          CITYCOIN_CONTRACT_NAME,
          FungibleConditionCode.LessEqual,
          amountCityCoinCV.value,
          createAssetInfo(CONTRACT_ADDRESS, CITYCOIN_CONTRACT_NAME, CC_NAME)
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
  };

  // TODO: add txstatus back to correlate with each claim button state

  return (
    <>
      <h3>Claim Stacking Rewards</h3>
      {stackingState && stackingState.length > 0 ? (
        <div class="row">
          {stackingState.map((details, key) => (
            <div className="col-3 card" key={key}>
              <div className="card-header">Cycle {details.cycleId}</div>
              <div className="card-body">
                <p>{(details.amountSTX / 1000000).toLocaleString()} STX</p>
                <p>{details.amountCC.toLocaleString()} CityCoins</p>
                <button
                  className="btn btn-outline-primary"
                  onClick={() =>
                    claimAction(
                      uintCV(details.cycleId),
                      uintCV(details.amountSTX),
                      uintCV(details.amountCC)
                    )
                  }
                >
                  Claim
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : loading ? null : (
        <div className="my-2">Nothing to claim</div>
      )}
    </>
  );
}
