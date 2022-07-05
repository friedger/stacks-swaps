import { useAuth } from '@micro-stacks/react';
import GetStartedButton from './GetStartedButton';

// Authentication button adapting to status

export default function Auth() {
  const { authenticate, signOut, isSignedIn } = useAuth();

  if (isSignedIn) {
    return (
      <button
        className="btn btn-outline-primary"
        onClick={() => {
          console.log('signOut');
          signOut();
        }}
      >
        Log Out
      </button>
    );
  } else {
    return <GetStartedButton handleSignIn={authenticate} type="small" />;
  }
}
