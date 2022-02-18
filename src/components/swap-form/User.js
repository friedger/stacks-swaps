import { Address } from '../Address';
import { AssetIcon } from '../AssetIcon';

export default function User({
  user,
  isOwner,
  title,
  disabled,
  inputOfBtcAddress,
  onFormUpdate,
  addressProperty,
}) {
  const label = inputOfBtcAddress
    ? 'Bitcoin recipient address (must start with 1)'
    : 'Stacks address or name (optional)';
  console.log(title, { user });
  return (
    <>
      <i className="bi bi-person" style={{ fontSize: '4rem' }}></i>
      <br />
      {title}
      {isOwner ? ' (You)' : null}
      <br />
      {disabled ? (
        <>
          <Address addr={user.address} />
          {user.address && user.btcAddress && <br />}
          {user.btcAddress && <Address addr={user.btcAddress} />}
        </>
      ) : (
        <>
          {inputOfBtcAddress && <Address addr={user.address} />}
          <div className="input-group">
            <span className="input-group-text">
              <AssetIcon type={inputOfBtcAddress ? 'btc' : 'stx'} small bw />
            </span>
            <input
              type="text"
              className="form-control"
              defaultValue={inputOfBtcAddress ? user.btcAddress : user.address}
              onChange={e => onFormUpdate({ property: addressProperty, value: e.target.value })}
              aria-label={label}
              placeholder={label}
              required
              max="40"
              minLength="1"
            />
          </div>
        </>
      )}
    </>
  );
}
