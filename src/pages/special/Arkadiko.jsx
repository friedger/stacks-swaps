import { useAccount, useOpenContractCall } from '@micro-stacks/react';
import {
  ClarityType,
  contractPrincipalCV,
  cvToString,
  falseCV,
  noneCV,
  principalCV,
  uintCV,
} from 'micro-stacks/clarity';
import {
  FungibleConditionCode,
  PostConditionMode,
  callReadOnlyFunction,
  makeContractFungiblePostCondition
} from 'micro-stacks/transactions';
import { useState } from 'react';

const sleep = () => new Promise(resolve => setTimeout(resolve, 5000));

const fetchVaultById = async id => {
  return callReadOnlyFunction({
    contractAddress: 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR',
    contractName: 'arkadiko-freddie-v1-1',
    functionName: 'get-vault-by-id',
    functionArgs: [uintCV(id)],
  });
};

export default function Arkadiko() {
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

  const fetchRatio = async id => {
    try {
      const vault = await fetchVaultById(id);
      const result = await callReadOnlyFunction({
        contractAddress: 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR',
        contractName: 'arkadiko-freddie-v1-1',
        functionName: 'calculate-current-collateral-to-debt-ratio',
        functionArgs: [
          uintCV(id),
          principalCV('SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.arkadiko-collateral-types-v3-1'),
          principalCV('SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.arkadiko-oracle-v2-2'),
          falseCV(),
        ],
      });
      const isBelow180 =
        result.type === ClarityType.ResponseOk &&
        result.value.value <= 180 &&
        result.value.value > 0;
      return { id, vault, result, isBelow180 };
    } catch (e) {
      console.log(e);
    }
    return { id, vault: noneCV(), result: noneCV() };
  };

  return (
    <main className="container">
      <div>
        <h1>Arkadiko Vault list</h1>
        <br />
        Vault Id
        <input
          onChange={e => {
            try {
              const value = parseInt(e.currentTarget.value);
              if (!isNaN(value)) {
                fetchRatio(value).then(({ id, vault, result }) => {
                  console.log(id, cvToString(result), cvToString(vault));
                  setStatus(cvToString(result));
                });
                setId(value);
              } else {
                setId();
                setStatus('');
              }
            } catch (e) {
              console.log(e);
              setStatus('');
            }
          }}
          value={id}
        />
        <button
          className="btn btn-outline-primary"
          disabled={!stxAddress}
          onClick={async () => {
            const vault = await fetchVaultById(id);
            if (vault.data['auction-ended'].type === ClarityType.BoolTrue) {
              setStatus('Auction already ended');
              return;
            }
            const collToken = vault.data['collateral-token'].data;
            const ft =
              collToken === 'STX'
                ? principalCV('SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.xstx-token')
                : collToken === 'xBTC'
                ? principalCV('SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.Wrapped-Bitcoin')
                : // auto-alex
                  principalCV('SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.auto-alex');
            const reserveName =
              vault.data['revoked-stacking'].type === ClarityType.BoolFalse
                ? 'arkadiko-sip10-reserve-v2-1'
                : 'arkadiko-stx-reserve-v1-1';
            const reserve = contractPrincipalCV(
              'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR',
              reserveName
            );
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
                ft,
                reserve,
                principalCV(
                  'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.arkadiko-liquidation-pool-v1-1'
                ),
                principalCV(
                  'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.arkadiko-liquidation-rewards-v1-2'
                ),
              ],
              postConditionMode: PostConditionMode.Allow,

              postConditions: [
                // xstx is minted and burnt in reserve v1.1
                makeContractFungiblePostCondition(
                  'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR',
                  'arkadiko-sip10-reserve-v1-1',
                  FungibleConditionCode.GreaterEqual,
                  0,
                  'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.xstx-token::xstx'
                ),
                // event 4
                makeContractFungiblePostCondition(
                  'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR',
                  reserveName,
                  FungibleConditionCode.GreaterEqual,
                  0,
                  'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.xstx-token::xstx'
                ),
                // event 7
                makeContractFungiblePostCondition(
                  'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR',
                  'arkadiko-liquidation-pool-v1-1',
                  FungibleConditionCode.GreaterEqual,
                  0,
                  'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.usda-token::usda'
                ),
                // event 10
                makeContractFungiblePostCondition(
                  'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR',
                  'arkadiko-auction-engine-v4-5',
                  FungibleConditionCode.GreaterEqual,
                  0,
                  'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.usda-token::usda'
                ),
                // event 11
                makeContractFungiblePostCondition(
                  'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR',
                  reserveName,
                  FungibleConditionCode.GreaterEqual,
                  0,
                  'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.xstx-token::xstx'
                ),
                // event 13
                makeContractFungiblePostCondition(
                  'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR',
                  'arkadiko-auction-engine-v4-5',
                  FungibleConditionCode.GreaterEqual,
                  0,
                  'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.xstx-token::xstx'
                ),
                // event 17
                makeContractFungiblePostCondition(
                  'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR',
                  'arkadiko-auction-engine-v4-5',
                  FungibleConditionCode.GreaterEqual,
                  0,
                  'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.arkadiko-token::diko'
                ),
                // event 19
                makeContractFungiblePostCondition(
                  'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR',
                  'arkadiko-swap-v2-1',
                  FungibleConditionCode.GreaterEqual,
                  0,
                  'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.usda-token::usda'
                ),

                // auto-alex reserve
                makeContractFungiblePostCondition(
                  'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR',
                  reserveName,
                  FungibleConditionCode.GreaterEqual,
                  0,
                  'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.auto-alex::auto-alex'
                ),
                // auto-alex auction
                makeContractFungiblePostCondition(
                  'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR',
                  'arkadiko-auction-engine-v4-5',
                  FungibleConditionCode.GreaterEqual,
                  0,
                  'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.auto-alex::auto-alex'
                ),

                // xbtc reserve
                makeContractFungiblePostCondition(
                  'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR',
                  reserveName,
                  FungibleConditionCode.GreaterEqual,
                  0,
                  'SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.Wrapped-Bitcoin::wrapped-bitcoin'
                ),
                // xbtc auction
                makeContractFungiblePostCondition(
                  'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR',
                  'arkadiko-auction-engine-v4-5',
                  FungibleConditionCode.GreaterEqual,
                  0,
                  'SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.Wrapped-Bitcoin::wrapped-bitcoin'
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
