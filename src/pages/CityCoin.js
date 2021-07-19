import React from 'react';
import { AlertAllPages } from '../components/AlertAllPages';
import { CityCoinContainer } from '../components/CityCoinContainer';
import { useStxAddresses } from '../lib/hooks';

export default function CityCoin({ userSession }) {
  const { ownerStxAddress } = useStxAddresses(userSession);
  if (!userSession || !ownerStxAddress) {
    return <div>Loading</div>;
  }
  return (
    <main className="container">
      <AlertAllPages />
      <CityCoinContainer />
    </main>
  );
}
