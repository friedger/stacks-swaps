import React from 'react';
import { AlertAllPages } from '../components/AlertAllPages';
import { StacksSwapsContainer } from '../components/StacksSwapsContainer';
import { useStxAddresses } from '../lib/hooks';

export default function StacksSwaps({ userSession, type, trait, id, nftId }) {
  const { ownerStxAddress } = useStxAddresses(userSession);
  if (!userSession || !ownerStxAddress) {
    return <div>Loading</div>;
  }
  return (
    <main className="container">
      <AlertAllPages />
      <StacksSwapsContainer type={type} trait={trait} id={id} nftId={nftId}/>
    </main>
  );
}
