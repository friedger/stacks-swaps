import { getUserData } from '@stacks/connect-react';
import { addressToString } from '@stacks/transactions';

import { useState, useEffect } from 'react';
import { getStacksAccount } from './account';

export function useStxAddresses(userSession) {
  const [ownerStxAddress, setOwnerStxAddress] = useState();
  const [appStxAddress, setAppStxAddress] = useState();
  useEffect(() => {
    if (userSession && userSession.isUserSignedIn()) {
      getUserData(userSession).then(userData => {
        const { address } = getStacksAccount(userData.appPrivateKey);
        setAppStxAddress(addressToString(address));
        setOwnerStxAddress(userData.profile.stxAddress['mainnet']);
      });
    }
  }, [userSession]);

  return { ownerStxAddress, appStxAddress };
}
