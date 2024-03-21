import { useConnect } from '@stacks/connect-react';
import { useAuth } from '../lib/useAuth';
import GetStartedButton from './GetStartedButton';

// Authentication button adapting to status

export default function Auth() {
  const { handleSignOut, state } = useAuth();
  const { doOpenAuth } = useConnect();

  if (state?.userData) {
    return (
      <button
        className="btn btn-outline-primary"
        onClick={() => {
          console.log('signOut');
          handleSignOut();
        }}
      >
        Log Out
      </button>
    );
  } else {
    return <GetStartedButton openAuthRequest={doOpenAuth} type="small" />;
  }
}
