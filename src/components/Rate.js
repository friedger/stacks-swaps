import { useAtom } from 'jotai';
import React, { useEffect } from 'react';
import { refreshPrice, STX_USD } from '../lib/price';

export function Rate() {
  const [stxUsd, setStxUsd] = useAtom(STX_USD);

  useEffect(() => {
    refreshPrice(setStxUsd);
  }, [setStxUsd]);

  return (
    <div className="rounded border-secondary d-flex justify-content-around bg-secondary p-1">
      <img alt="stacks" src="/stacks.png" width="25" height="25" />${stxUsd.value.toFixed(2)}{' '}
      {stxUsd.loading ? '...' : ''}
    </div>
  );
}
