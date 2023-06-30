import { useAccount, useAuth, useOpenContractCall } from '@micro-stacks/react';
import { useParams } from '@reach/router';
import { Box, Button, Text } from '@stacks/ui';
import { listCV, standardPrincipalCV, uintCV } from 'micro-stacks/clarity';
import { validateStacksAddress } from 'micro-stacks/crypto';
import {
  NonFungibleConditionCode,
  makeStandardNonFungiblePostCondition,
} from 'micro-stacks/transactions';
import { useEffect, useState } from 'react';
import GetStartedButton from '../../components/GetStartedButton';
import { nonFungibleTokensApi } from '../../lib/constants';
import { points } from './BTCSportsFlags';

function Flag({ flag, onSelect, selectedIds }) {
  const id = flag.value.repr.substr(1);
  const idNumber = parseInt(id);
  const flagPoints = points[100].includes(idNumber) ? 100 : points[20].includes(idNumber) ? 20 : 5;
  return (
    <Text
      m="5px"
      onClick={() => {
        onSelect(id);
      }}
      background={selectedIds.includes(id) ? 'yellow' : 'white'}
    >
      {id} ({flagPoints})
    </Text>
  );
}

export default function BTCSportFlagsTransferMany() {
  const [ids, setIds] = useState([]);
  const [flags, setFlags] = useState();
  const [status, setStatus] = useState();
  const [total, setTotal] = useState();
  const [shown, setShown] = useState();

  const { receiver } = useParams();

  const { openAuthRequest } = useAuth();
  const { stxAddress } = useAccount();
  const onSelect = id => {
    if (ids.includes(id)) {
      setIds(ids.filter(i => i !== id));
    } else {
      setIds([...ids, id]);
    }
  };

  const { openContractCall } = useOpenContractCall({
    onFinish: result => {
      setStatus(result);
    },
    onCancel: () => {
      setStatus('Tx not sent.');
    },
  });

  useEffect(() => {
    const fetchHoldings = async () => {
      const holdings = await nonFungibleTokensApi.getNftHoldings({
        principal: stxAddress,
        assetIdentifiers: [
          'SP2BE8TZATXEVPGZ8HAFZYE5GKZ02X0YDKAN7ZTGW.btc-sports-flags-nft::btc-sports-flags',
        ],
        limit: 200,
      });
      console.log(holdings);
      setFlags(holdings.results);
      setTotal(holdings.total);
      setShown(holdings.results.length);
      setIds(holdings.results.slice(0, 25).map(r => r.value.repr.substr(1)));
    };
    fetchHoldings();
  }, [stxAddress]);

  return (
    <main className="container">
      <div>
        <h1>BTC Sports Flags/Coins Transfer Many</h1>
        Hello, use this transfer-many option to transfer flags in bulk to
        {receiver ? (
          <>
            {' '}
            stacks address {receiver}.{' '}
            {!validateStacksAddress(receiver) && <b>This address is invalid!</b>}
            {receiver === stxAddress && <b>This is your address!</b>}
          </>
        ) : (
          <>
            BTC Sports burn wallet (btcsburn.btc = 'SP15P146EH0NJB7KNGMWX1NB5EE8750ZM2ZB2BK5Z) to
            exchange for promotions. Please go to{' '}
            <a href="https://discord.gg/btcsports">https://discord.gg/btcsports</a> in order to find
            out active promotions. Thanks!
          </>
        )}
        <br />
        {stxAddress ? (
          <>
            {flags ? (
              <>
                Showing {shown} / {total}
                <br />
                <Box justifyContent="center" p="tight" columnGap="loose">
                  {flags.map((flag, i) => {
                    return <Flag key={i} flag={flag} onSelect={onSelect} selectedIds={ids} />;
                  })}
                </Box>
              </>
            ) : (
              <>Loading your NFTs</>
            )}
            <br />
            Selected {ids.length}
            <br />
            <Box justifyContent="center" p="tight" columnGap="loose">
              {ids.map((id, i) => {
                return (
                  <Text key={i} m="5px" background="yellow">
                    {id}
                  </Text>
                );
              })}
            </Box>
            <Button mode="tertiary" onClick={() => setIds([])}>
              Clear Selection
            </Button>
            <br />
            <br />
            <Button
              className="btn btn-outline-primary"
              disabled={
                !stxAddress ||
                (receiver && (!validateStacksAddress(receiver) || receiver === stxAddress))
              }
              onClick={async () => {
                await openContractCall({
                  contractAddress: 'SPN4Y5QPGQA8882ZXW90ADC2DHYXMSTN8VAR8C3X',
                  contractName: 'btc-sports-flags-many',
                  functionName: 'transfer-many',
                  functionArgs: [
                    listCV(ids.map(id => uintCV(id))),
                    standardPrincipalCV(receiver || 'SP15P146EH0NJB7KNGMWX1NB5EE8750ZM2ZB2BK5Z'),
                  ],
                  postConditions: ids.map(id =>
                    makeStandardNonFungiblePostCondition(
                      stxAddress,
                      NonFungibleConditionCode.DoesNotOwn,
                      'SP2BE8TZATXEVPGZ8HAFZYE5GKZ02X0YDKAN7ZTGW.btc-sports-flags-nft::btc-sports-flags',
                      uintCV(id)
                    )
                  ),
                });
              }}
            >
              Transfer Selected Items
            </Button>
            <br />
            {JSON.stringify(status)}
          </>
        ) : (
          <GetStartedButton openAuthRequest={openAuthRequest} />
        )}
      </div>
    </main>
  );
}
