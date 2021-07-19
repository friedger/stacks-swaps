import React from 'react';
import { STX_USD } from '../lib/price';
import { useAtomValue } from 'jotai/utils';

export function AmountStx({ ustx }) {
  const rate = useAtomValue(STX_USD);
  if (isNaN(ustx)) {
    return ustx;
  }
  return (
    <li>
      {(ustx / 1000000).toLocaleString(undefined, {
        style: 'decimal',
        minimumFractionDigits: 6,
        maximumFractionDigits: 6,
      })}
      &nbsp;Ӿ
      <br />
      ($
      {((ustx / 1000000) * rate.value).toLocaleString(undefined, {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}
      )
    </li>
  );
}
