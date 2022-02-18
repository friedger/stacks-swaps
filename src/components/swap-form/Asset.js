import { splitAssetIdentifier } from '../../lib/assets';
import { AssetIcon } from '../AssetIcon';
import { Contract } from '../Contract';

export default function Asset({ assetUrl, asset, readOnly, numberProperty, onFormUpdate }) {
  let ctr;
  if (asset.trait) {
    const [, , name, address] = splitAssetIdentifier(asset.trait);
    ctr = { address, name };
  }
  return (
    <>
      <div className="input-group">
        <input
          type="number"
          className="form-control"
          defaultValue={asset.amountOrId || ''}
          onChange={e => onFormUpdate({ property: numberProperty, value: e.target.value })}
          aria-label={asset.label}
          placeholder={asset.label}
          readOnly={readOnly}
          required
          minLength="1"
        />
        <span className="input-group-text">
          {assetUrl ? (
            <img className="m-1" src={assetUrl} width={50} height={50} alt="asset" />
          ) : (
            <AssetIcon type={asset.type} trait={asset.trait} />
          )}
        </span>
      </div>
      {ctr ? (
        <small>
          <Contract ctr={ctr} />
        </small>
      ) : (
        asset.type !== 'stx' &&
        asset.type !== 'btc' && (
          <div className="input-group mt-2">
            <input
              type="text"
              className="form-control"
              value=""
              onChange={e => onFormUpdate({ property: 'traitForSale', value: e.current.value })}
              aria-label={`fully qualified contract of the ${asset.asset} and its asset class`}
              placeholder={`fully qualified contract of the ${asset.asset} and its asset class`}
              required
              minLength="1"
            />
          </div>
        )
      )}
    </>
  );
}
