import React from 'react';
import { ProfileFull } from './ProfileFull';
import { Address } from './Address';
import { useAuth } from '@micro-stacks/react';
import { useStxAddresses } from '../lib/hooks';

export function ProfileSmall() {
  const { mainnet: ownerStxAddress } = useStxAddresses();
  const { session, isSignedIn } = useAuth();
  if (isSignedIn) {
    return (
      <>
        <div>
          <a
            className="btn btn-primary-outline btn-lg"
            data-bs-toggle="offcanvas"
            href="#offcanvasProfile"
            role="button"
            aria-controls="offcanvasProfile"
          >
            <i className="bi bi-person-circle me-2" />
            {ownerStxAddress ? <Address addr={ownerStxAddress} /> : 'Profile'}
          </a>
        </div>
        <ProfileFull stxAddress={ownerStxAddress} userSession={session} />
      </>
    );
  } else {
    return null;
  }
}
