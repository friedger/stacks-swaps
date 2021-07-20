import React from 'react';
import { AmountStx } from './AmountStx';

export function Amount({ ustx, stxAddress }) {
  if (isNaN(ustx)) {
    return ustx;
  }
  return (
    <>
      <ul>
        <AmountStx ustx={ustx} />
      </ul>
    </>
  );
}
