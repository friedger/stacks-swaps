import { AssetIcon } from '../AssetIcon';

export default function AssetNFT({ assetUrl, asset, readOnly, nftIdProperty, onFormUpdate }) {
  return (
    <>
      {assetUrl ? (
        <img className="m-1" src={assetUrl} width={50} height={50} alt="asset" />
      ) : (
        <AssetIcon type={asset.type} trait={asset.trait} />
      )}
      <br />
      <div className="input-group">
        <input
          type="number"
          className="form-control"
          value={asset.nftId}
          onChange={e => onFormUpdate({ property: nftIdProperty, value: e.target.value })}
          aria-label={asset.label}
          placeholder={asset.label}
          readOnly={readOnly}
          required
          minLength="1"
        />
      </div>
    </>
  );
}
