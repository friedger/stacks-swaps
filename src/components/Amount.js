import React from 'react';
import { AmountStx } from './AmountStx';

export function Amount({ ustx, stxAddress }) {
  if (typeof ustx !== "bigint") {
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
