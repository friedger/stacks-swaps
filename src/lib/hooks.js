import { useConnect } from '@stacks/connect-react';
import { addressToString } from '@stacks/transactions';
import { useEffect, useState } from 'react';
import { getStacksAccount } from './account';
import { userSession } from '../UserSession';

export function useAccount() {
  const userData = userSession?.loadUserData();
  return {
    stxAddress: userData?.profile?.stxAddress?.mainnet,
    decentralizedId: userData?.decentralizedID,
    appPrivateKey: userData?.appPrivateKey,
  };
}

export function useOpenContractCall(options) {
  const { doContractCall } = useConnect();
  return { openContractCall: moreOptions => doContractCall({ ...options, ...moreOptions }) };
}

export function useOpenContractDeploy(options) {
  const { doContractDeploy } = useConnect();
  return { openContractDeploy: moreOptions => doContractDeploy({ ...options, ...moreOptions }) };
}
export function useStxAddresses() {
  const [ownerStxAddress, setOwnerStxAddress] = useState();
  const [appStxAddress, setAppStxAddress] = useState();
  const { appPrivateKey, stxAddress } = useAccount();
  const { isSignedIn } = useAuth();

  const authenticated = stxAddress && isSignedIn;

  useEffect(() => {
    if (authenticated) {
      if (appPrivateKey) {
        const { address } = getStacksAccount(appPrivateKey);
        setAppStxAddress(addressToString(address));
      }
      if (stxAddress) {
        setOwnerStxAddress(stxAddress);
      }
    }
  }, [stxAddress, authenticated, appPrivateKey]);

  return { ownerStxAddress, appStxAddress };
}
