import { useAccount, useOpenContractCall } from '@micro-stacks/react';
import { principalCV, uintCV } from 'micro-stacks/clarity';
import {
  FungibleConditionCode,
  createAssetInfo,
  makeContractFungiblePostCondition,
} from 'micro-stacks/transactions';
import { useState } from 'react';

export default function Arkadiko({}) {
  const [id, setId] = useState(2458);
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
        <h1>Arkadiko Vault list</h1>
        <br />
        Vault Id
        <input
          onChange={e => {
            const value = parseInt(e.currentTarget.value);
            console.log(value)
            if (!isNaN(value)) setId(value);
          }}
          value={id}
        />
        <button
          className="btn btn-outline-primary"
          disabled={!stxAddress}
          onClick={async () => {
            await openContractCall({
              contractAddress: 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR',
              contractName: 'arkadiko-auction-engine-v4-5',
              functionName: 'start-auction',
              functionArgs: [
                uintCV(id),
                principalCV('SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.arkadiko-freddie-v1-1'),
                principalCV(
                  'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.arkadiko-collateral-types-v3-1'
                ),
                principalCV('SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.arkadiko-oracle-v2-2'),
                principalCV('SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.xstx-token'),
                principalCV(
                  'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.arkadiko-sip10-reserve-v2-1'
                ),
                principalCV(
                  'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.arkadiko-liquidation-pool-v1-1'
                ),
                principalCV(
                  'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.arkadiko-liquidation-rewards-v1-2'
                ),
              ],
              postConditions: [
                makeContractFungiblePostCondition(
                  'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR',
                  'arkadiko-liquidation-pool-v1-1',
                  FungibleConditionCode.GreaterEqual,
                  0,
                  createAssetInfo('SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR', 'usda-token', 'usda')
                ),
              ],
            });
          }}
        >
          Start Auction
        </button>
        <br />
        {JSON.stringify(status)}
      </div>
    </main>
  );
}
