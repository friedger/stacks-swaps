import { addressToString } from 'micro-stacks/clarity';
import { useSession, useIsSignedIn } from '@micro-stacks/react';
import { useState, useEffect } from 'react';
import { getStacksAccount } from './account';

export function useStxAddresses() {
  const [ownerStxAddress, setOwnerStxAddress] = useState();
  const [appStxAddress, setAppStxAddress] = useState();
  const [userSession] = useSession();
  const isUserSignedIn = useIsSignedIn();

  const authenticated = userSession && isUserSignedIn;

  useEffect(() => {
    if (authenticated) {
      const { address } = getStacksAccount(userSession.appPrivateKey);
      setAppStxAddress(addressToString(address));
      setOwnerStxAddress(userSession.addresses?.mainnet);
    }
  }, [userSession, authenticated]);

  return { ownerStxAddress, appStxAddress };
}
