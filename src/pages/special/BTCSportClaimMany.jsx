import { FungibleConditionCode, makeStandardSTXPostCondition } from '@stacks/transactions';
import { useState } from 'react';
import { useAccount, useOpenContractCall } from '../../lib/hooks';

export default function BTCSportClaimMany({}) {
  const [id, setId] = useState();
  const [status, setStatus] = useState();

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
        <h1>BTC Sports Claim Many</h1>
        <br />
        <button
          className="btn btn-outline-primary"
          disabled={!stxAddress}
          onClick={async () => {
            await openContractCall({
              contractAddress: 'SP2BE8TZATXEVPGZ8HAFZYE5GKZ02X0YDKAN7ZTGW',
              contractName: 'btc-sports-vip-pass',
              functionName: 'claim-three',
              functionArgs: [],
              postConditions: [
                makeStandardSTXPostCondition(stxAddress, FungibleConditionCode.Equal, 750_000_000),
              ],
            });
          }}
        >
          Claim Three
        </button>
        <br />
        {JSON.stringify(status)}
      </div>
    </main>
  );
}
