import { addressToString } from 'micro-stacks/clarity';
import {
  useAuth, useAccount
} from '@micro-stacks/react';
import { useState, useEffect } from 'react';
import { getStacksAccount } from './account';

export function useStxAddresses() {
  const [ownerStxAddress, setOwnerStxAddress] = useState();
  const [appStxAddress, setAppStxAddress] = useState();
  const {appPrivateKey, stxAddress} = useAccount();
  const {isSignedIn} = useAuth()

  const authenticated = stxAddress && isSignedIn;

  useEffect(() => {
    if (authenticated) {
      const { address } = getStacksAccount(appPrivateKey);
      setAppStxAddress(addressToString(address));
      if (stxAddress) {
        setOwnerStxAddress(stxAddress);
      }
    }
  }, [stxAddress, authenticated]);

  return { ownerStxAddress, appStxAddress };
}
