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
        Reward address version in hex (00 or 05):
        <input className="form-control" onChange={e => setVersion(e.target.value.trim())} />
        <br />
        Start burn height:
        <input className="form-control" onChange={e => setStartBurnHt(e.target.value.trim())} />
        <br />
        Lock period (max 12):
        <input className="form-control" onChange={e => setLockPeriod(e.target.value.trim())} />
        <br />
        <code>SP000000000000000000002Q6VF78.bns</code>.<br />
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
        <br />
        {JSON.stringify(status)}
      </div>
    </main>
  );
}
