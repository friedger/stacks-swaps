import React from 'react';
import { useConnect, userSessionState } from '../lib/auth';
import { useAtom } from 'jotai';

// Authentication button adapting to status

export default function Auth() {
  const { handleOpenAuth } = useConnect();
  const { handleSignOut } = useConnect();
  const [userSession] = useAtom(userSessionState);

  if (userSession?.isUserSignedIn()) {
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
      <button type="button" className="btn btn-outline-primary" onClick={handleOpenAuth}>
        Get Started
      </button>
    );
  }
}
