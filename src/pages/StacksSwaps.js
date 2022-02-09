import React from 'react';
import { AlertAllPages } from '../components/AlertAllPages';
import { StacksSwapsContainer } from '../components/StacksSwapsContainer';
import { isAtomic } from '../lib/assets';

export default function StacksSwaps({ type, trait, id }) {
  if (trait && trait.startsWith('friedger.btc')) {
    trait = trait.replace('friedger.btc', 'SPN4Y5QPGQA8882ZXW90ADC2DHYXMSTN8VAR8C3X');
  }

  return (
    <main className="container">
      {isAtomic(type) ? null : <AlertAllPages />}
      <StacksSwapsContainer type={type} trait={trait} id={id} />
    </main>
  );
}
