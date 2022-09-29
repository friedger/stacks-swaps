import { bufferCV, standardPrincipalCV, tupleCV, uintCV } from 'micro-stacks/clarity';
import { PostConditionMode } from 'micro-stacks/transactions';
import { useOpenContractCall } from '@micro-stacks/react';
import { useState } from 'react';
import { hexToBytes } from 'micro-stacks/common';

export default function PoolAdmin() {
  const [hashbytes, setHashBytes] = useState();
  const [version, setVersion] = useState();
  const [startBurnHt, setStartBurnHt] = useState();
  const [stacker, setStacker] = useState();
  const [amountUstx, setAmountUstx] = useState();
  const [status, setStatus] = useState();
  const [lockPeriod, setLockPeriod] = useState();

  const [hashbytes2, setHashBytes2] = useState();
  const [version2, setVersion2] = useState();
  const [rewardCycle, setRewardCycle] = useState();

  const { openContractCall } = useOpenContractCall({
    onFinish: result => {
      setStatus(result);
    },
    onCancel: () => {
      setStatus('Tx not sent.');
    },
  });

  return (
    <main className="container">
      <div>
        <h1>Pool Admin function</h1>
        Using <code>SP000000000000000000002Q6VF78.bns</code> only.
        <br />
        {JSON.stringify(status)}
        <h2>delegate-stacks-stx</h2>
        <br />
        Stacker:
        <input className="form-control" onChange={e => setStacker(e.target.value.trim())} />
        <br />
        Amount in uSTX:
        <input className="form-control" onChange={e => setAmountUstx(e.target.value.trim())} />
        <br />
        Reward address hash bytes in hex (010203..):
        <input className="form-control" onChange={e => setHashBytes(e.target.value.trim())} />
        <br />
        Reward address version in hex (00 or 01):
        <input className="form-control" onChange={e => setVersion(e.target.value.trim())} />
        <br />
        Start burn height:
        <input className="form-control" onChange={e => setStartBurnHt(e.target.value.trim())} />
        <br />
        Lock period (max 12):
        <input className="form-control" onChange={e => setLockPeriod(e.target.value.trim())} />
        <br />
        <button
          className="btn btn-outline-primary"
          onClick={async () => {
            const [contractAddress, contractName] = ['SP000000000000000000002Q6VF78', 'pox'];
            const functionName = 'delegate-stack-stx';
            const functionArgs = [
              standardPrincipalCV(stacker),
              uintCV(amountUstx),
              tupleCV({
                hashbytes: bufferCV(hexToBytes(hashbytes)),
                version: bufferCV(hexToBytes(version)),
              }),
              uintCV(parseInt(startBurnHt)),
              uintCV(parseInt(lockPeriod)),
            ];
            const postConditions = [];
            await openContractCall({
              contractAddress,
              contractName,
              functionName,
              functionArgs,
              postConditions,
              postConditionMode: PostConditionMode.Deny,
            });
          }}
        >
          Lock user's Stacks
        </button>

        <hr/>

        <h2>stack-aggregation-commit</h2>
        Reward address hash bytes in hex (010203..):
        <input className="form-control" onChange={e => setHashBytes2(e.target.value.trim())} />
        <br />
        Reward address version in hex (00 or 01):
        <input className="form-control" onChange={e => setVersion2(e.target.value.trim())} />
        <br />
        Reward Cycle:
        <input className="form-control" onChange={e => setRewardCycle(e.target.value.trim())} />
        <br />
        <button
          className="btn btn-outline-primary"
          onClick={async () => {
            const [contractAddress, contractName] = ['SP000000000000000000002Q6VF78', 'pox'];
            const functionName = 'stack-aggregation-commit';
            const functionArgs = [
              tupleCV({
                hashbytes: bufferCV(hexToBytes(hashbytes2)),
                version: bufferCV(hexToBytes(version2)),
              }),
              uintCV(parseInt(rewardCycle)),
            ];
            const postConditions = [];
            await openContractCall({
              contractAddress,
              contractName,
              functionName,
              functionArgs,
              postConditions,
              postConditionMode: PostConditionMode.Deny,
            });
          }}
        >
          Finalize Cycle
        </button>
      </div>
    </main>
  );
}
