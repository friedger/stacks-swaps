import { useStxAddresses } from '../lib/hooks';
import { useAuth } from '../lib/useAuth';
import { Address } from './Address';
import { ProfileFull } from './ProfileFull';

export function ProfileSmall() {
  const { ownerStxAddress } = useStxAddresses();
  const { isSignedIn } = useAuth();
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
        <ProfileFull stxAddress={ownerStxAddress} />
      </>
    );
  } else {
    return null;
  }
}
