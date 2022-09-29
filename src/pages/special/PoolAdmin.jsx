import {
  bufferCV,
  ClarityType,
  cvToHex,
  standardPrincipalCV,
  tupleCV,
  uintCV,
} from 'micro-stacks/clarity';
import { PostConditionMode } from 'micro-stacks/transactions';
import { useAccount, useOpenContractCall } from '@micro-stacks/react';
import { useState } from 'react';
import { hexToBytes } from 'micro-stacks/common';
import { smartContractsApi } from '../../lib/constants';
import { hexToCV } from '../../lib/transactions';

export async function getPartialStacked(stxAddress, rewardCycle, hashbytes, version) {
  const key = cvToHex(
    tupleCV({
      'pox-addr': tupleCV({
        hashbytes: bufferCV(hexToBytes(hashbytes)),
        version: bufferCV(hexToBytes(version)),
      }),
      'reward-cycle': uintCV(parseInt(rewardCycle)),
      sender: standardPrincipalCV(stxAddress),
    })
  );

  try {
    const amountHex = await smartContractsApi.getContractDataMapEntry({
      contractAddress: 'SP000000000000000000002Q6VF78',
      contractName: 'pox',
      mapName: 'partial-stacked-by-cycle',
      key,
      proof: 0,
    });
    const amountCV = hexToCV(amountHex.data);
    if (amountCV.type === ClarityType.OptionalNone) {
      return { amount: 'none', cycle: rewardCycle, stxAddress, hashbytes, version };
    } else {
      return {
        amount: amountCV.value.data['stacked-amount'].value.toString(10),
        cycle: rewardCycle,
        stxAddress,
        hashbytes,
        version,
      };
    }
  } catch (e) {
    console.log(e);
  }
}

export default function PoolAdmin() {
  const [hashbytes, setHashBytes] = useState();
  const [version, setVersion] = useState();
  const [startBurnHt, setStartBurnHt] = useState();
  const [stacker, setStacker] = useState();
  const [amountUstx, setAmountUstx] = useState();
  const [status, setStatus] = useState();
  const [partialDetails, setPartialDetails] = useState();
  const [lockPeriod, setLockPeriod] = useState();

  const [hashbytes2, setHashBytes2] = useState();
  const [version2, setVersion2] = useState();
  const [rewardCycle, setRewardCycle] = useState();

  const [hashbytes3, setHashBytes3] = useState();
  const [version3, setVersion3] = useState();
  const [rewardCycle3, setRewardCycle3] = useState();

  const { stxAddress } = useAccount();

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
        <hr />
        <h2>Check partially stacked amount</h2>
        Reward address hash bytes in hex (010203..):
        <input className="form-control" onChange={e => setHashBytes3(e.target.value.trim())} />
        <br />
        Reward address version in hex (00 or 01):
        <input className="form-control" onChange={e => setVersion3(e.target.value.trim())} />
        <br />
        Reward Cycle:
        <input className="form-control" onChange={e => setRewardCycle3(e.target.value.trim())} />
        <br />
        <button
          className="btn btn-outline-primary"
          onClick={async () => {
            const details = await getPartialStacked(stxAddress, rewardCycle3, hashbytes3, version3);
            setPartialDetails(details);
          }}
        >
          Check amount
        </button>
        <div>
          <pre>{JSON.stringify(partialDetails)}</pre>
        </div>
        <hr />
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
