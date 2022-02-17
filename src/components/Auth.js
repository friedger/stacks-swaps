import React from 'react';
import { useAuth } from '@micro-stacks/react';
import GetStartedButton from './GetStartedButton';

// Authentication button adapting to status

export default function Auth() {
  const { handleSignIn, handleSignOut, isSignedIn } = useAuth();

  if (isSignedIn) {
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
    return <GetStartedButton handleSignIn={handleSignIn} type="small" />;
  }
}
