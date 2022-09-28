import { ClarityType } from 'micro-stacks/clarity';
import { PostConditionMode } from 'micro-stacks/transactions';
import { useOpenContractCall } from '@micro-stacks/react';
import { useState } from 'react';
import { transactionsApi } from '../../lib/constants';
import { hexToCV } from '../../lib/transactions';

export default function ResendFailedTx() {
  const [id, setId] = useState();
  const [status, setStatus] = useState();

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
        <h1>Resend Failed Transaction</h1>
        This will resend the failed BNS register transaction:
        <br />
        <input className="form-control" onChange={e => setId(e.target.value)} />
        <br />
        <button
          className="btn btn-outline-primary"
          onClick={async () => {
            const result = await transactionsApi.getTransactionById({ txId: id });
            const { function_name, contract_id, function_args } = result.contract_call;
            const [contractAddress, contractName] = contract_id.split('.');
            const functionArgs = function_args.map(a => hexToCV(a.hex));
            const postConditions = []; // TODO reconstruct post conditions
            const txResult = hexToCV(result.tx_result.hex);
            if (
              txResult.type !== ClarityType.ResponseErr ||
              Number(txResult.value.value) !== 3001
            ) {
              setStatus(
                'Support only for txs with result (err u3001), but was ' + result.tx_result.repr
              );
              return;
            }
            console.log(result);
            await openContractCall({
              contractAddress,
              contractName,
              functionName: function_name,
              functionArgs,
              postConditions,
              postConditionMode: PostConditionMode.Allow,
            });
          }}
        >
          Resend
        </button>
        <br />
        {JSON.stringify(status)}
      </div>
    </main>
  );
}
