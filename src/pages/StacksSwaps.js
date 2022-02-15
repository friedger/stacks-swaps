import React from 'react';
import { AlertAllPages } from '../components/AlertAllPages';
import { StacksSwapsContainer } from '../components/StacksSwapsContainer';
import { SwapPathNotFound } from '../components/SwapPathNotFound';
import { isAtomic } from '../lib/assets';
import { atomicSwaps } from '../lib/constants';

export default function StacksSwaps({ swapPath, trait, id, nftId }) {
  if (trait && trait.startsWith('friedger.btc')) {
    trait = trait.replace('friedger.btc', 'SPN4Y5QPGQA8882ZXW90ADC2DHYXMSTN8VAR8C3X');
  }
  let type;
  if (swapPath === 'stx') {
    // catamaran swap
    type = swapPath;
  } else {
    // atomic swap
    // TODO improve support for more short codes like xbtc-cp
    const swap = atomicSwaps.find(s => (s.path ? s.path === swapPath : s.type === swapPath));
    if (swap) {
      type = swap.type;
      trait = trait || swap.trait;
    }
  }
  if (!type) {
    return (
      <main className="container">
        <SwapPathNotFound swapPath={swapPath} trait={trait} />
      </main>
    );
  }
  return (
    <main className="container">
      {isAtomic(type) ? null : <AlertAllPages />}
      <StacksSwapsContainer type={type} trait={trait} id={id} nftId={nftId} />
    </main>
  );
}
