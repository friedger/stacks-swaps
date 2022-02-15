import { Link } from '@reach/router';
import React from 'react';
import { AssetIcon } from './AssetIcon';
import { getAsset, getDeepLink } from './assets';

export function AtomicIntroButton({ type, trait }) {
  const [buyWith, sell] = type.split('-');
  const to = getDeepLink(type, trait);
  const assetName = getAsset(sell, trait);
  const buyWithName = getAsset(buyWith);
  return (
    <Link to={to} type="button">
      <AssetIcon type={buyWith === 'stx' ? sell : buyWith} trait={trait} />
      {buyWith !== 'stx' && <AssetIcon type={sell} trait={trait} />}
      Swap {buyWithName} for {assetName}
    </Link>
  );
}
