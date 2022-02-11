import { addressToString } from 'micro-stacks/clarity';
import {
  useSession,
  useIsSignedIn,
  useStxAddresses as useMicroStxAddresses,
} from '@micro-stacks/react';
import { useState, useEffect } from 'react';
import { getStacksAccount } from './account';

export function useStxAddresses() {
  const [ownerStxAddress, setOwnerStxAddress] = useState();
  const [appStxAddress, setAppStxAddress] = useState();
  const [userSession] = useSession();
  const isUserSignedIn = useIsSignedIn();

  const authenticated = userSession && isUserSignedIn;
  const addresses = useMicroStxAddresses();
  console.log({ addresses });
  useEffect(() => {
    if (authenticated) {
      const { address } = getStacksAccount(userSession.appPrivateKey);
      setAppStxAddress(addressToString(address));
      setOwnerStxAddress(addresses.mainnet);
    }
  }, [addresses.mainnet, userSession, authenticated]);

  return { ownerStxAddress, appStxAddress };
}
