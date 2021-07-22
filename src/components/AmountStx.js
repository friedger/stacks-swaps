import React from 'react';
import { STX_USD } from '../lib/price';
import { useAtomValue } from 'jotai/utils';

export function AmountStx({ ustx }) {
  const rate = useAtomValue(STX_USD);
  if (typeof ustx !== "bigint") {
    return ustx;
  }
  return (
    <li>
      {(ustx / 1000000n).toLocaleString(undefined, {
        style: 'decimal',
        minimumFractionDigits: 6,
        maximumFractionDigits: 6,
      })}
      &nbsp;Ӿ
      <br />
      ($
      {((ustx / 1000000n) * rate.value).toLocaleString(undefined, {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}
      )
    </li>
  );
}
