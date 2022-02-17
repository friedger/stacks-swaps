import { AssetIcon } from '../AssetIcon';

export default function AssetFT({ asset, amountProperty, readOnly, onFormUpdate }) {
  return (
    <>
      <AssetIcon type={asset.type} trait={asset.trait} />
      <br />
      <div className={'input-group'}>
        <input
          type="number"
          className="form-control"
          value={asset.amount}
          onChange={e => onFormUpdate({ property: amountProperty, value: e.target.value })}
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
