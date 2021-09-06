import React from 'react';
import { AlertAllPages } from '../components/AlertAllPages';
import { StacksSwapsContainer } from '../components/StacksSwapsContainer';
import { useStxAddresses } from '../lib/hooks';

export default function StacksSwaps({ userSession, type, trait, id, nftId }) {
  if (trait && trait.startsWith('friedger.btc')) {
    trait = trait.replace('friedger.btc', 'SPN4Y5QPGQA8882ZXW90ADC2DHYXMSTN8VAR8C3X');
  }

  return (
    <main className="container">
      {type.startsWith('stx-') ? null : <AlertAllPages />}
      <StacksSwapsContainer type={type} trait={trait} id={id} nftId={nftId} />
    </main>
  );
}
