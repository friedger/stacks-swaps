import { Link } from '@reach/router';

import { AssetIcon } from './AssetIcon';
import { getAsset, getDeepLink } from './assets';

export function AtomicIntroButton({ type, trait, showBoth }) {
  const [buyWith, sell] = type.split('-');
  const to = getDeepLink(type, trait);
  const assetName = getAsset(sell, trait);
  const buyWithName = getAsset(buyWith);
  return (
    <Link to={to} type="button">
      {showBoth ? (
        <>
          <AssetIcon type={buyWith} trait={trait} />
          <AssetIcon type={sell} trait={trait} />
        </>
      ) : buyWith === 'stx' ? (
        <>
          <AssetIcon type={sell} trait={trait} />
        </>
      ) : (
        <>
          <AssetIcon type={buyWith} trait={trait} />
          <AssetIcon type={sell} trait={trait} />
        </>
      )}
      Swap {buyWithName} for {assetName}
    </Link>
  );
}
