import React from 'react';
import { AmountStx } from './AmountStx';
import { AmountCityCoin } from './AmountCityCoin';

export function Amount({ ustx, stxAddress }) {
  if (isNaN(ustx)) {
    return ustx;
  }
  return (
    <>
      <ul>
        <AmountStx ustx={ustx} />
        <AmountCityCoin stxAddress={stxAddress} />
      </ul>
    </>
  );
}
