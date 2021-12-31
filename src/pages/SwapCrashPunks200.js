import { useConnect } from '@stacks/connect-react';
import {
  AnchorMode,
  contractPrincipalCV,
  createAssetInfo,
  cvToString,
  FungibleConditionCode,
  hexToCV,
  listCV,
  makeContractNonFungiblePostCondition,
  makeContractSTXPostCondition,
  makeStandardNonFungiblePostCondition,
  makeStandardSTXPostCondition,
  NonFungibleConditionCode,
  PostConditionMode,
  someCV,
  standardPrincipalCV,
  trueCV,
  uintCV,
} from '@stacks/transactions';
import { BN } from 'bn.js';
import React, { useEffect, useState } from 'react';
import { accountsApi, NETWORK } from '../lib/constants';

const feesCV = contractPrincipalCV(
  'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9',
  'stx-nft-fixed-fees'
);

export default function SwapCrashPunks200({ userSession }) {
  const [status, setStatus] = useState();
  const [swapForUser, setSwapsForUser] = useState();

  const { doContractCall } = useConnect();

  useEffect(() => {
    if (userSession && userSession.isUserSignedIn()) {
      const userAddress = userSession.loadUserData().profile.stxAddress.mainnet;

      const fn = async () => {
        const response = await accountsApi.getAccountTransactions({
          principal: 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.stx-cp-many-swap-v1',
          unanchored: true,
        });
        const result = response.results.filter(
          tx => tx.tx_status === 'success' && tx.tx_type === 'contract_call'
        );
        console.log(result);
        const txsForUser = result.filter(tx => {
          const owner = cvToString(hexToCV(tx.contract_call.function_args[2].hex).value);
          console.log(owner);
          return owner === userAddress;
        });
        if (txsForUser.length > 0) {
          const swapId = hexToCV(txsForUser[0].tx_result.hex).value.value;
          const amountCV = hexToCV(txsForUser[0].contract_call.function_args[0].hex);
          const idsCV = hexToCV(txsForUser[0].contract_call.function_args[1].hex);
          setSwapsForUser({ swapId, amountCV, idsCV });
        }
      };
      fn();
    }
  }, [userSession]);

  const approveContract = async () => {
    doContractCall({
      contractAddress: 'SP3QSAJQ4EA8WXEDSRRKMZZ29NH91VZ6C5X88FGZQ',
      contractName: 'crashpunks-v2',
      functionName: 'set-approve-all',
      functionArgs: [
        contractPrincipalCV('SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9', 'stx-cp-many-swap-v1'),
        trueCV(),
      ],
      postConditionMode: PostConditionMode.Deny,
      postConditions: [],
      userSession,
      anchorMode: AnchorMode.Any,
      network: NETWORK,
      onFinish: result => {
        setStatus(result);
      },
      onCancel: () => {
        setStatus('Tx not sent.');
      },
    });
  };

  const createSwap = async nftOwner => {
    const userAddress = userSession.loadUserData().profile.stxAddress.mainnet;
    const ids = nftIds[nftOwner];
    const amountCV = uintCV(BigInt(ids.length * 50_000_000));
    const idsCV = listCV(ids.map(id => uintCV(id)));
    const nftSenderCV = someCV(standardPrincipalCV(nftOwner));
    doContractCall({
      contractAddress: 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9',
      contractName: 'stx-cp-many-swap-v1',
      functionName: 'create-swap',
      functionArgs: [amountCV, idsCV, nftSenderCV, feesCV],
      postConditionMode: PostConditionMode.Deny,
      postConditions: [
        makeStandardSTXPostCondition(
          userAddress,
          FungibleConditionCode.LessEqual,
          new BN(ids.length * 50_500_000)
        ),
      ],
      userSession,
      anchorMode: AnchorMode.Any,
      network: NETWORK,
      onFinish: result => {
        setStatus(result);
      },
      onCancel: () => {
        setStatus('Tx not sent.');
      },
    });
  };

  const executeSwap = async () => {
    const userAddress = userSession.loadUserData().profile.stxAddress.mainnet;
    console.log({ swapForUser });
    const postConditions = [
      ...swapForUser.idsCV.list.map(idCV =>
        makeStandardNonFungiblePostCondition(
          userAddress,
          NonFungibleConditionCode.DoesNotOwn,
          createAssetInfo(
            'SP3QSAJQ4EA8WXEDSRRKMZZ29NH91VZ6C5X88FGZQ',
            'crashpunks-v2',
            'crashpunks-v2'
          ),
          idCV
        )
      ),
    ];
    postConditions.push(
      makeContractSTXPostCondition(
        'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9',
        'stx-cp-many-swap-v1',
        FungibleConditionCode.LessEqual,
        new BN(swapForUser.idsCV.list.length * 50_000_000)
      )
    );
    postConditions.push(
      makeContractSTXPostCondition(
        'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9',
        'stx-nft-fixed-fees',
        FungibleConditionCode.LessEqual,
        new BN(swapForUser.idsCV.list.length * 500_000)
      )
    );

    doContractCall({
      contractAddress: 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9',
      contractName: 'stx-cp-many-swap-v1',
      functionName: 'submit-swap',
      functionArgs: [uintCV(swapForUser.swapId), feesCV],
      postConditionMode: PostConditionMode.Deny,
      postConditions,
      userSession,
      anchorMode: AnchorMode.Any,
      network: NETWORK,
      onFinish: result => {
        setStatus(result);
      },
      onCancel: () => {
        setStatus('Tx not sent.');
      },
    });
  };
  const userAddress =
    userSession && userSession.isUserSignedIn()
      ? userSession.loadUserData().profile.stxAddress.mainnet
      : undefined;

  return (
    <main className="container">
      <div>
        <h1>Special Crash Punks Swap Page</h1>
        <b>Only use this site if you were invited by Grace.</b>
        <br />
        <div className="card p-2 m-2">
          <h2>Create Swaps (by Grace)</h2>
          <>{Object.keys(nftIds).reduce((sum, owner) => sum + nftIds[owner].length, 0)} CPs</>
          {Object.keys(nftIds).map(owner => {
            return (
              <>
                <button
                  className="btn btn-outline-primary"
                  disabled={!userSession || !userSession.isUserSignedIn()}
                  onClick={() => createSwap(owner)}
                >
                  Create Swap for {owner} ({nftIds[owner].length} CPs)
                </button>
              </>
            );
          })}
        </div>
        <div className="card p-2 m-2">
          <h2>Execute Swaps (by CP owners)</h2>
          {userAddress && nftIds[userAddress] && (
            <>
              {nftIds[userAddress].length} Crash Punks owned by {userAddress}
              <br />
              <button
                className="btn btn-outline-primary"
                disabled={!userSession || !userSession.isUserSignedIn()}
                onClick={approveContract}
              >
                Approve Swap Contract
              </button>
              <br />
              {swapForUser && (
                <button
                  className="btn btn-outline-primary"
                  disabled={!userSession || !userSession.isUserSignedIn()}
                  onClick={() => executeSwap(swapForUser.id)}
                >
                  Execute Swap
                </button>
              )}
              {!swapForUser && <div>Swap not yet created.</div>}
            </>
          )}
          {userAddress && !nftIds[userAddress] && <div>No Swaps for user {userAddress}</div>}
          {!userAddress && <div>Checking ...</div>}
        </div>
        {status && JSON.stringify(status)}
      </div>
    </main>
  );
}

const nftIds = {
  SP18JMFHKPEDGHQ443FG6KWA6AVV3761KQMTSNB6B: [
    2965, 2964, 2963, 2961, 2941, 2940, 2939, 2938, 2937, 2936, 2935, 2932, 2931, 2930, 2929, 2928,
    2927, 2926, 2925, 2923, 2910, 2909, 2908, 2906, 2905, 2880, 2878, 2876, 2875, 2873, 2872, 2871,
    2869, 2868, 2867, 2858, 2854, 2831,
  ],
  SP2ZT8SEZJQTEW4748BK62ZGK71YGJ1NNGAE3PTCP: [
    3167, 3166, 3165, 3164, 3162, 3161, 3160, 3159, 3157, 3155, 3154, 3153, 3151, 3150, 3148, 3147,
    3146, 3145, 3144, 3143, 3142, 3140, 3139, 3138, 3137, 3136, 3000, 2999, 2998, 2996, 2994, 2992,
    2991, 2990, 2987, 2986, 2984,
  ],
  SP3R5ED2HF4W2T6SA2DD76PYCH4KAF68GDAYSF9Q7: [
    2983, 2982, 2981, 2978, 2977, 2975, 2972, 2971, 2970, 2969, 2959, 2958, 2957, 2956, 2955, 2952,
    2951, 2920, 2919, 2917, 2916, 2915, 2914, 2913, 2912, 2902, 2901, 2900, 2899, 2898, 2897, 2896,
    2894, 2893, 2892, 2891, 2890, 2884, 2882, 2881,
  ],
  SPXJNDHF9BQETWQETYKJN8PDEGWCF6CZ80YB9MKX: [
    2979, 2968, 2967, 2966, 2962, 2960, 2950, 2949, 2948, 2947, 2945, 2944, 2943, 2942, 2903, 2889,
    2887, 2865, 2864, 2861, 2859, 2857, 2856, 2855, 2850, 2848, 2847, 2846, 2844, 2843, 2842, 2841,
    2840, 2839, 2838, 2835, 2834, 2833,
  ],
  SP1WZ5HR7PMR99S10M75GX6EDDQRET0XH4G7QSFDS: [
    1896, 1897, 1900, 1901, 2437, 2438, 2442, 2443, 2694, 2695, 2699, 2700, 2701, 2709, 2710, 2712,
    2714, 2715, 2717, 2721, 2722, 2725, 2726, 2728, 2729, 2730, 2733, 2734, 2736, 2738, 2739, 2740,
    2825, 2826, 2827, 4690, 4064, 4975, 5116, 5039, 5040, 5046, 5628, 5054, 5055, 4144, 4978, 5096,
    5097, 5102, 5103, 5104, 5106, 5107, 5108, 5142, 5143, 5147, 5149, 5150,
  ],
};
