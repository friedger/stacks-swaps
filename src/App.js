import React, { useEffect } from 'react';
import { Connect } from '@stacks/connect-react';
import { Router } from '@reach/router';
import Auth from './components/Auth';
import { userDataState, userSessionState, useConnectForAuth } from './lib/auth';
import { useAtom } from 'jotai';
import LandingCat from './pages/LandingCat';
import Intro from './pages/Intro';

import Tac from './pages/Tac';
import StacksSwaps from './pages/StacksSwaps';
import { ProfileSmall } from './components/ProfileSmall';
import { FARI_TOKEN, MIA_TOKEN, THIS_IS_NUMBER_ONE } from './components/assets';
import LandingAtomic from './pages/LandingAtomic';
import Landing from './pages/Landing';
import UnlistStacksPunks from './pages/UnlistStacksPunks';

export default function App(props) {
  const { authOptions } = useConnectForAuth();
  const [userSession] = useAtom(userSessionState);
  const [, setUserData] = useAtom(userDataState);

  useEffect(() => {
    if (userSession?.isUserSignedIn()) {
      setUserData(userSession.loadUserData());
    } else if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn();
    }
  }, [userSession, setUserData]);

  return (
    <Connect authOptions={authOptions}>
      <header className="d-flex flex-wrap justify-content-between align-items-center mx-3 py-3 mb-4 border-bottom">
        <div>
          <a
            href="/"
            className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark text-decoration-none"
          >
            <img src="/android-icon-72x72.png" width="75" alt="Catamaran Swaps Logo" />
          </a>
        </div>
        <div className="text-center">
          <span className="h1">Catamaran Swaps</span>
          <br />
          <span className="p">Trustless exchange of digital assets</span>
        </div>
        <div className="btn-group btn-group-lg" role="group" aria-label="Basic outlined example">
          <ProfileSmall userSession={userSession} />
          <a
            href="https://docs.catamaranswaps.org"
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline-primary"
          >
            Docs
          </a>
          <Auth />
        </div>
      </header>
      <Content userSession={userSession} path="/" />
    </Connect>
  );
}
function Content({ userSession }) {
  const authenticated = userSession && userSession.isUserSignedIn();
  const decentralizedID =
    userSession && userSession.isUserSignedIn() && userSession.loadUserData().decentralizedID;
  return (
    <>
      <Router>
        <>
          <Intro path="/" default />
          <Tac path="/tac"/>
          <StacksSwaps
            path="/stx/swap/:id"
            type="stx"
            decentralizedID={decentralizedID}
            userSession={userSession}
          />
          <StacksSwaps
            path="/stx"
            type="stx"
            decentralizedID={decentralizedID}
            userSession={userSession}
          />
          <StacksSwaps
            path="/stx-ft/swap/:id"
            type="stx-ft"
            decentralizedID={decentralizedID}
            userSession={userSession}
          />
          <StacksSwaps
            path="/stx-ft/:trait"
            type="stx-ft"
            decentralizedID={decentralizedID}
            userSession={userSession}
          />
          <StacksSwaps
            path="/stx-ft"
            type="stx-ft"
            decentralizedID={decentralizedID}
            userSession={userSession}
          />
          <StacksSwaps
            path="/stx-mia/swap/:id"
            type="stx-ft"
            decentralizedID={decentralizedID}
            userSession={userSession}
            trait={MIA_TOKEN}
          />
          <StacksSwaps
            path="/stx-mia"
            type="stx-ft"
            decentralizedID={decentralizedID}
            userSession={userSession}
            trait={MIA_TOKEN}
          />
          <StacksSwaps
            path="/stx-fari/swap/:id"
            type="stx-ft"
            decentralizedID={decentralizedID}
            userSession={userSession}
            trait={FARI_TOKEN}
          />
          <StacksSwaps
            path="/stx-fari"
            type="stx-ft"
            decentralizedID={decentralizedID}
            userSession={userSession}
            trait={FARI_TOKEN}
          />
          {authenticated && (
            <UnlistStacksPunks path="/unlist-stacks-punks" userSession={userSession} />
          )}
        </>
        {!authenticated && <Landing path="/" exact default />}
        {!authenticated && <LandingCat path="/catamaran" />}
        {!authenticated && <LandingAtomic path="/atomic" />}
      </Router>
    </>
  );
}
