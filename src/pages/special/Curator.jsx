import { useAccount, useOpenContractCall } from '@micro-stacks/react';
import { contractPrincipalCV, noneCV, stringAsciiCV, uintCV } from 'micro-stacks/clarity';
import { PostConditionMode } from 'micro-stacks/transactions';
import { useState } from 'react';
import { infoApi } from '../../lib/constants';

export default function Curator() {
  const [status, setStatus] = useState();
  const [exhibits, setExhibits] = useState();
  const { stxAddress } = useAccount();

  const { openContractCall } = useOpenContractCall({
    onFinish: result => {
      setStatus(result);
    },
    onCancel: () => {
      setStatus('Tx not sent.');
    },
  });

  const putOnShow = async (nft, id) => {
    const [artContract, artId] = nft.split(':');
    const [contractAddress, contractName] = [
      'SP3XA0MBJ3TD14HRAT0ZP65N933XMG6E6QAS00CTW',
      'fine-art-exhibition-v1',
    ];
    const functionName = 'put-on-show';
    const functionArgs = [noneCV(), uintCV(id), uintCV(artId), contractPrincipalCV(artContract)];
    const postConditions = [];
    await openContractCall({
      contractAddress,
      contractName,
      functionName,
      functionArgs,
      postConditions,
      postConditionMode: PostConditionMode.Deny,
    });
  };
  return (
    <main className="container">
      <div>
        <h1>Curator</h1>
        <br />
        {JSON.stringify(status)}
        <h2>Create Exhibition</h2>
        <button
          className="btn btn-outline-primary"
          onClick={async () => {
            const info = await infoApi.getCoreApiInfo();
            const blockHeight = info.stacks_tip_height;
            const [contractAddress, contractName] = [
              'SP3XA0MBJ3TD14HRAT0ZP65N933XMG6E6QAS00CTW',
              'fine-art-exhibition-v1',
            ];
            const functionName = 'create-exhibition';
            const functionArgs = [
              uintCV(blockHeight + 100),
              uintCV(blockHeight + 1100),
              stringAsciiCV('First Time'),
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
          Create Exhibition
        </button>
        <hr />

        <h2>Prepare Exhibition</h2>

        <textarea
          className="form-control"
          onChange={e => setExhibits(e.target.value)}
          type="textarea"
        />

        <button
          className="btn btn-outline-primary"
          onClick={async () => {
            const listOfExhibits = exhibits.split('\n');

            for (let e in listOfExhibits) {
              await putOnShow(listOfExhibits[e].trim(), parseInt(e) + 7);
            }
          }}
        >
          Select Exhibits
        </button>
        <hr />

        <h2>Inaugurate Exhibition</h2>
        <button
          className="btn btn-outline-primary"
          onClick={async () => {
            const [contractAddress, contractName] = [
              'SP3XA0MBJ3TD14HRAT0ZP65N933XMG6E6QAS00CTW',
              'fine-art-exhibition-v1',
            ];
            const functionName = 'inaugurate';
            const functionArgs = [uintCV(1)];
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
          Inaugurate
        </button>
      </div>
    </main>
  );
}
