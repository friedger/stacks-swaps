import React from 'react';
import { Router } from '@reach/router';
import { MicroStacksProvider, useSession, useAuth } from '@micro-stacks/react';
import Auth from './components/Auth';
import LandingCat from './pages/LandingCat';
import Intro from './pages/Intro';

import Tac from './pages/Tac';
import StacksSwaps from './pages/StacksSwaps';
import { ProfileSmall } from './components/ProfileSmall';
import {
  BANANA_TOKEN,
  BITCOIN_MONKEYS,
  CRASHPUNKS,
  FARI_TOKEN,
  MIA_TOKEN,
  SATOSHIBLES,
} from './components/assets';
import LandingAtomic from './pages/LandingAtomic';
import Landing from './pages/Landing';
import UnlistStacksPunks from './pages/special/UnlistStacksPunks';
import SwapCrashPunks200 from './pages/special/SwapCrashPunks200';

const authOptions = {
  appDetails: {
    name: 'Catamaran Swaps',
    icon: 'https://catamaranswaps.org/android-icon-192x192.png',
  },
};

export default function App(props) {
  return (
    <MicroStacksProvider authOptions={authOptions}>
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
          <ProfileSmall />
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
      <Content path="/" />
    </MicroStacksProvider>
  );
}
function Content() {
  const [userSession] = useSession();
  const { isSignedIn } = useAuth();

  const authenticated = userSession && isSignedIn;
  const decentralizedID = authenticated && userSession.decentralizedID;
  return (
    <>
      <Router>
        <>
          <Intro path="/" default />
          <Tac path="/tac" />
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
            path="/stx-nft/swap/:id"
            type="stx-nft"
            decentralizedID={decentralizedID}
            userSession={userSession}
          />
          <StacksSwaps
            path="/stx-nft/:trait/:nftId"
            type="stx-nft"
            decentralizedID={decentralizedID}
            userSession={userSession}
          />
          <StacksSwaps
            path="/stx-nft/:trait"
            type="stx-nft"
            decentralizedID={decentralizedID}
            userSession={userSession}
          />
          <StacksSwaps
            path="/stx-nft"
            type="stx-nft"
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
          <StacksSwaps
            path="/stx-banana/swap/:id"
            type="stx-ft"
            decentralizedID={decentralizedID}
            userSession={userSession}
            trait={BANANA_TOKEN}
          />
          <StacksSwaps
            path="/stx-banana"
            type="stx-ft"
            decentralizedID={decentralizedID}
            userSession={userSession}
            trait={BANANA_TOKEN}
          />
          <StacksSwaps
            path="/stx-cp/swap/:id"
            type="stx-nft"
            decentralizedID={decentralizedID}
            userSession={userSession}
            trait={CRASHPUNKS}
          />
          <StacksSwaps
            path="/stx-cp"
            type="stx-nft"
            decentralizedID={decentralizedID}
            userSession={userSession}
            trait={CRASHPUNKS}
          />
          <StacksSwaps
            path="/stx-satoshibles/swap/:id"
            type="stx-nft"
            decentralizedID={decentralizedID}
            userSession={userSession}
            trait={SATOSHIBLES}
          />
          <StacksSwaps
            path="/stx-satoshibles"
            type="stx-nft"
            decentralizedID={decentralizedID}
            userSession={userSession}
            trait={SATOSHIBLES}
          />
          <StacksSwaps
            path="/banana-nft/swap/:id"
            type="banana-nft"
            decentralizedID={decentralizedID}
            userSession={userSession}
          />
          <StacksSwaps
            path="/banana-nft/:trait/:nftId"
            type="banana-nft"
            decentralizedID={decentralizedID}
            userSession={userSession}
          />
          <StacksSwaps
            path="/banana-nft/:trait"
            type="banana-nft"
            decentralizedID={decentralizedID}
            userSession={userSession}
          />
          <StacksSwaps
            path="/banana-nft"
            type="banana-nft"
            decentralizedID={decentralizedID}
            userSession={userSession}
          />
          <StacksSwaps
            path="/banana-bitcoinmonkeys/swap/:id"
            type="banana-nft"
            decentralizedID={decentralizedID}
            userSession={userSession}
            trait={BITCOIN_MONKEYS}
          />
          <StacksSwaps
            path="/banana-bitcoinmonkeys"
            type="banana-nft"
            decentralizedID={decentralizedID}
            userSession={userSession}
            trait={BITCOIN_MONKEYS}
          />
          <StacksSwaps
            path="/xbtc-nft/swap/:id"
            type="xbtc-nft"
            decentralizedID={decentralizedID}
            userSession={userSession}
          />
          <StacksSwaps
            path="/xbtc-nft/:trait/:nftId"
            type="xbtc-nft"
            decentralizedID={decentralizedID}
            userSession={userSession}
          />
          <StacksSwaps
            path="/xbtc-nft/:trait"
            type="xbtc-nft"
            decentralizedID={decentralizedID}
            userSession={userSession}
          />
          <StacksSwaps
            path="/xbtc-nft"
            type="xbtc-nft"
            decentralizedID={decentralizedID}
            userSession={userSession}
          />

          {authenticated && (
            <UnlistStacksPunks path="/unlist-stacks-punks" userSession={userSession} />
          )}
          {authenticated && (
            <SwapCrashPunks200 path="/swap-crash-punks-200" userSession={userSession} />
          )}
        </>
        {!authenticated && <Landing path="/" exact default />}
        {!authenticated && <LandingCat path="/catamaran" />}
        {!authenticated && <LandingAtomic path="/atomic" />}
      </Router>
    </>
  );
}
