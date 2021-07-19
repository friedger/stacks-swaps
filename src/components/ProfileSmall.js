import React from 'react';
import { ProfileFull } from './ProfileFull';
import { useStxAddresses } from '../lib/hooks';
import { Address } from './Address';

export function ProfileSmall({ userSession }) {
  const { ownerStxAddress } = useStxAddresses(userSession);

  if (userSession?.isUserSignedIn()) {
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
        <ProfileFull stxAddress={ownerStxAddress} userSession={userSession} />
      </>
    );
  } else {
    return null;
  }
}
