import React from 'react';
import { useAuth } from '@micro-stacks/react';
import { useAtom } from 'jotai';

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
    return (
      <button type="button" className="btn btn-outline-primary" onClick={handleSignIn}>
        Get Started
      </button>
    );
  }
}
